import fetchGameDetails from "./webScraper.js";
import syncCalendar from "./calendar.js";

const teamName = "Send Tuesday";
const url =
  "https://www.volleyball.com";

const main = async () => {
  const gameDetails = await fetchGameDetails(teamName, url);
  console.log(`Huge game at ${gameDetails.dateTime} on ${gameDetails.court}`);
  syncCalendar(gameDetails);
};

main();
