import chalk from "chalk";
import cron from "node-cron";
import fetchAndSync from "./services/fetchAndSync.js";

process.env.TZ = "Australia/Brisbane";
console.log(chalk.yellow(`Starting up at ${new Date().toString()}`));

// Runs every hour on the hour from 7am to 11pm
// cron.schedule("0 7-23 * * *", async () => {
cron.schedule("*/1 * * * *", async () => {
  await fetchAndSync();
});
