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
  const response = await fetch(url);
  const body = await response.text();
  const $ = cheerio.load(body);

  // Find the cell with our team name
  const teamCell = $(`td:icontains(${teamName})`);

  // The first column is the court number
  const court = teamCell.siblings().eq(0).text();

  // Find the first time above the team cell
  // Example output: "6:30pm"
  const timeText = teamCell
    .parent()
    .prevAll()
    .find("td:first-child:contains(pm)")
    .eq(0)
    .text();

  // Get the date from the table header
  // Example output: "13th September"
  const dateText = $(`thead`).find(".column-4").text();
  const monthText = dateText.split(" ")[1];
  const dayText = dateText.split(" ")[0].replace(/\D/g, "");

  const dateToParse = `${dayText} ${monthText} ${new Date().getFullYear()} ${timeText} EST`;
  console.log(dateToParse);
  // Convert the date and time into a date object
  const dateTime = Date.parse(dateToParse);

  return { court, dateTime };
};

export default fetchGameDetails;
