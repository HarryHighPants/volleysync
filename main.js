import fetchGameDetails from "./webScraper.js";
import syncCalendar from "./calendar.js";
import cron from "node-cron";
import chalk from "chalk";

const teamName = "Send Tuesday";
const url =
  "https://www.volleyball.com";

console.log(chalk.yellow(`Starting up at ${new Date().toString()}`));
// Runs every hour on the hour from 7am to 11pm
cron.schedule("0 7-23 * * *", async () => {
  try {
    await fetchAndSync();
  } catch (error) {
    console.log(chalk.red(error.message, "\n\n", error));
  }
});

const fetchAndSync = async () => {
  const gameDetails = await fetchGameDetails(teamName, url);
  if (syncCalendar(gameDetails)) {
    console.log(
      chalk.green(
        `Successfully synced calendar with game ${gameDetails.dateTime.toString()} on ${
          gameDetails.court
        }`
      )
    );
  }
};
