import { writeFileSync } from "fs";
import { Metry } from "./lib/metryApiClient/types";
import { MetryApiClient } from "./lib/metryApiClient/client";
// Load env variables
require("dotenv").config();

const run = async () => {
  try {
    const now = new Date();

    const apiClient = new MetryApiClient();
    const meters = await apiClient
      .setBoxStatus()
      .setMetric()
      .setGranularity("month")
      .setConsumptionPeriod({
        start: {
          date: new Date(now.getFullYear().toString()),
          format: Metry.PeriodFormats.YEAR,
        },
        end: {
          date: new Date(now.getFullYear(), now.getMonth()),
          format: Metry.PeriodFormats.YEAR_MONTH,
        },
      })
      .getMeters();
    writeFileSync("meters.json", JSON.stringify(meters));
    console.log("Meters printed in JSON ");
    console.log(JSON.stringify(meters, null, 2));
  } catch (error) {
    console.error(error);
  }
};

run();
