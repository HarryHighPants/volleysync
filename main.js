import fetchGameDetails from "./webScraper";

const teamName = "Send Tuesday";
const url =
  "https://www.volleyball.com";

const main = async () => {
  const gameDetails = await fetchGameDetails(teamName, url);
  console.log(`Huge game at ${gameDetails.time} on ${gameDetails.court}`);
};

main();
