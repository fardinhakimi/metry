import fetch from "node-fetch";
import dateformat from "dateformat";
import { MetriApiError } from "./exceptions";

/* 
    Note: importing a namespace this way is not the best way. typescript must be able to automatically find 
    and load namespaces. ts-node fails to do this, this is starting to take too much time to find the bug and fix it. 
    so I am choosing to import it this to continue with the rest of the stuff.
*/

import { Metry } from "./types";

export class MetryApiClient
  implements Metry.IMetriApiClient, Metry.IFilterAble
{
  private BASE_URl: string;
  private TOKEN: string;

  private meterFilterParams: Metry.MeterFilter = {
    skip: null,
    box: null,
    metrics: "energy",
  };

  private consumptionParams: Metry.ConsumptionFilter = {
    period: null,
    metrics: "energy",
    granularity: null,
  };

  constructor() {
    if (!process.env.METRI_API_URL || !process.env.METRI_API_TOKEN) {
      throw new Error(
        "METRI_API_URL and METRI_API_TOKEN must be provided to connect to Metri Api"
      );
    }

    this.BASE_URl = process.env.METRI_API_URL;
    this.TOKEN = process.env.METRI_API_TOKEN;
  }

  setMetric(metric: Metry.MetricType = "energy"): MetryApiClient {
    this.meterFilterParams.metrics = metric;
    this.consumptionParams.metrics = metric;
    return this;
  }

  setSkip(skip: number): MetryApiClient {
    this.meterFilterParams.skip = skip;
    return this;
  }

  setBoxStatus(
    status: Metry.MeterBoxStatus = Metry.MeterBoxStatus.ACTIVE
  ): MetryApiClient {
    this.meterFilterParams.box = status;
    return this;
  }

  setConsumptionPeriod(period: Metry.ConsumptionPeriod): MetryApiClient {
    this.consumptionParams.period = period;
    return this;
  }

  setGranularity(granularity: Metry.GranularityType): MetryApiClient {
    this.consumptionParams.granularity = granularity;
    return this;
  }

  private getMeterQueryString() {
    let queryString = "";
    for (const [key, value] of Object.entries(this.meterFilterParams)) {
      if (value === null) continue;
      const separator = queryString === "" ? "?" : "&";
      queryString += `${separator}${key}=${value}`;
    }
    console.log("Meter query-string", queryString);
    return queryString;
  }

  private getLatestConsumption(consumption: Metry.Consumption) {
    const metric = this.consumptionParams.metrics;

    if (!consumption || consumption.data.length === 0 || !metric) {
      return null;
    }

    const [headPeriodItem] = consumption.data[0].periods.filter((item) => {
      return Object.hasOwnProperty.call(item, metric);
    });

    const latestConsumptions = headPeriodItem[metric].filter((item) => !!item);

    // The latest consumption at this end_date.

    return {
      timeStamp: headPeriodItem.end_date,
      value: latestConsumptions[latestConsumptions.length - 1] ?? null,
    };
  }

  async getMeters(): Promise<Metry.MeterListResult> {
    try {
      const response = await fetch(
        `${this.BASE_URl}/meters${this.getMeterQueryString()}`,
        {
          headers: {
            Authorization: `Bearer ${this.TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new MetriApiError(response.statusText, response.status);
      }

      const meterList: Metry.ApiMeterListResult = await response.json();

      const results = await Promise.all(
        meterList.data.map(
          async (meter: Metry.Meter): Promise<Metry.MeterListItem> => {
            const defaultMeter = {
              _id: meter._id,
              ean: meter.ean,
              consumption: null,
            };

            try {
              const { box, revoked } = meter;

              if (
                revoked ||
                ![
                  Metry.MeterBoxStatus.ACTIVE,
                  Metry.MeterBoxStatus.TEMPORARY,
                ].includes(box)
              ) {
                return defaultMeter;
              }

              const consumption = await this.getConsumption(meter._id);

              const latestConsumption = this.getLatestConsumption(consumption);

              console.log(`Latest consumption for meter (${meter._id})`);

              return {
                ...defaultMeter,
                consumption: latestConsumption,
              };
            } catch (error) {
              console.error(error.message);
              return defaultMeter;
            }
          }
        )
      );

      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getConsumption(meterId: string): Promise<Metry.Consumption> {
    if (
      !meterId ||
      !this.consumptionParams.period ||
      !this.consumptionParams.granularity
    ) {
      throw new Error(
        "MeterId, format, period and granularity is required to get a meaninful consumption"
      );
    }
    const { granularity, period, metrics } = this.consumptionParams;

    const startPeriod = dateformat(period.start.date, period.start.format);
    const endPeriod = period.end
      ? dateformat(period.end.date, period.end.format)
      : "";
    const periodStr = endPeriod ? `${startPeriod}-${endPeriod}` : startPeriod;

    const response = await fetch(
      `${this.BASE_URl}/consumptions/${meterId}/${granularity}/${periodStr}?metrics=${metrics}`,
      {
        headers: {
          Authorization: `Bearer ${this.TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new MetriApiError(response.statusText, response.status);
    }

    const result: Metry.Consumption = await response.json();

    console.log(`Got consumption data for meter(${meterId})`);

    return result;
  }
}
