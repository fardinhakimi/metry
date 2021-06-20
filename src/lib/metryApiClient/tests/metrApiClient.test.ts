import { MetryApiClient } from "../client";
import { Metry } from "../types";

jest.mock("node-fetch", () => require("fetch-mock-jest").sandbox());
const fetchMock = require("node-fetch");

const meters: Metry.ApiMeterListResult = {
  count: 2,
  skip: 0,
  limit: 50,
  data: [
    {
      _id: "605db28dbb5f5735f53653f5",
      ean: "65488644",
      box: Metry.MeterBoxStatus.ACTIVE,
      revoked: false,
      metrics: ["energy"],
      type: "electricity",
    },
    {
      _id: "705db28dbb5f5735f53653d5",
      ean: "65488642",
      box: Metry.MeterBoxStatus.TEMPORARY,
      revoked: false,
      metrics: ["energy"],
      type: "electricity",
    },
    {
      _id: "775db28dbb5f5735f53653d5",
      ean: "65488642",
      box: Metry.MeterBoxStatus.TEMPORARY,
      revoked: true,
      metrics: ["energy"],
      type: "electricity",
    },
  ],
};

const consumptionForFirstMeter = {
  data: [
    {
      meter_id: "605db28dbb5f5735f53653f5",
      periods: [
        {
          start_date: "20210101",
          end_date: "20210707",
          energy: [null, null, 2020],
        },
        {
          start_date: "20210101",
          end_date: "20210707",
          flow: [2021],
        },
      ],
    },
  ],
};

const consumptionForSecondMeter = {
  data: [
    {
      meter_id: "705db28dbb5f5735f53653d5",
      periods: [
        {
          start_date: "20210101",
          end_date: "20210707",
          energy: [null, null, 2021],
        },
      ],
    },
  ],
};

const BASE_URL = process.env.METRI_API_URL;

describe("MetryApiClient", () => {
  test("It should return 3 meters", async () => {
    fetchMock.get(`${BASE_URL}/meters?metrics=energy`, meters);
    const metriApiClient = new MetryApiClient();
    const items = await metriApiClient.getMeters();
    expect(items.length == 3);
    fetchMock.mockReset();
  });

  test("It should return the correct consumption value for each meter", async () => {
    fetchMock
      .get(`${BASE_URL}/meters?box=active&metrics=energy`, meters)
      .get(
        `${BASE_URL}/consumptions/605db28dbb5f5735f53653f5/month/2021-202108?metrics=energy`,
        consumptionForFirstMeter
      )
      .get(
        `${BASE_URL}/consumptions/705db28dbb5f5735f53653d5/month/2021-202108?metrics=energy`,
        consumptionForSecondMeter
      );

    const metriApiClient = new MetryApiClient();

    const items = await metriApiClient
      .setGranularity("month")
      .setBoxStatus(Metry.MeterBoxStatus.ACTIVE)
      .setConsumptionPeriod({
        start: {
          date: new Date("2021"),
          format: Metry.PeriodFormats.YEAR,
        },
        end: {
          date: new Date(2021, 7),
          format: Metry.PeriodFormats.YEAR_MONTH,
        },
      })
      .getMeters();
    expect(
      items.filter((item) => item._id === "705db28dbb5f5735f53653d5")[0]
        .consumption?.value
    ).toEqual(2021);
    expect(
      items.filter((item) => item._id === "605db28dbb5f5735f53653f5")[0]
        .consumption?.value
    ).toEqual(2020);
    expect(
      items.filter((item) => item._id === "775db28dbb5f5735f53653d5")[0]
        .consumption
    ).toEqual(null);
    fetchMock.mockReset();
  });
});
