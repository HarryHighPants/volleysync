import chalk from "chalk";
import fetchGameDetails from "./webScraper.js";
import trySyncCalendar from "./calendar.js";

const fetchAndSync = async () => {
  try {
    const gameDetails = await fetchGameDetails();
    if (await trySyncCalendar(gameDetails)) logSyncSuccess(gameDetails);
  } catch (error) {
    console.log(chalk.red(error.message, "\n\n", error));
  }
};

const logSyncSuccess = (gameDetails) =>
  console.log(
    chalk.green(
      `Successfully synced calendar with game ${gameDetails.dateTime.toString()} on ${
        gameDetails.court
      }`
    )
  );

export default fetchAndSync;
