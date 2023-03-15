import fetch from "node-fetch";
import * as cheerio from "cheerio";

// Example HTML:
{
  /* <tr class="row-8 even">
  <td class="column-1">6:30pm</td>
  <td class="column-2"></td>
  <td class="column-3"></td>
  <td class="column-4"></td>
  <td class="column-5"></td>
  <td class="column-6"></td>
</tr>
<tr class="row-9 odd">
  <td class="column-1">Court 1 </td>
  <td class="column-2">Setsy Beaches</td>
  <td class="column-3">vs</td>
  <td class="column-4">Send Tuesday</td>
  <td class="column-5">DIV1A</td>
  <td class="column-6">Tay</td>
</tr> */
}

const fetchGameDetails = async (teamName, url) => {
  // Get the HTML from the URL
  const response = await fetch(url);
  const body = await response.text();
  if (!body) throw new Error("Could not get HTML from URL");
  const $ = cheerio.load(body);

  // Find the cell with our team name
  const teamCell = $(`td:icontains(${teamName})`);
  if (!teamCell?.length) throw new Error(`Could not find ${teamName}s cell`);

  // The first column is the court number
  const court = teamCell.siblings().eq(0).text();
  if (!court.trim()) throw new Error(`Could not find court number`);

  // Find the first time above the team cell
  const timeText = teamCell
    .parent()
    .prevAll()
    .find("td:first-child:contains(pm)")
    .eq(0)
    .text();
  if (!timeText.trim()) throw new Error(`Could not find game time`);

  // Get the date from the table header
  const dateText = $(`thead`).find(".column-4").text();
  if (!dateText.trim()) throw new Error(`Could not find game date`);

  // Convert the time and date into a Date object
  const dateTime = convertToDate(timeText, dateText);

  return { court, dateTime };
};

// timeText example: "6:30pm"
// dateText example: "13th September"
const convertToDate = (timeText, dateText) => {
  const hours = +timeText.split(":")[0] + 12;
  const minutes = timeText.split(":")[1].replace(/\D/g, "");
  const month = dateText.split(" ")[1];
  const day = dateText.split(" ")[0].replace(/\D/g, "");

  // Convert the date and time into a Date object
  const year = new Date().getFullYear();
  const dateTimeString = `${day} ${month} ${year} ${hours}:${minutes}`;
  const dateTime = new Date(dateTimeString);
  if (isNaN(dateTime.getTime()))
    throw new Error(`Could not parse date string: ${dateTimeString}`);

  return dateTime;
};

export default fetchGameDetails;
