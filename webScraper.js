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
  const time = teamCell
    .parent()
    .prevAll()
    .find("td:first-child:contains(pm)")
    .eq(0)
    .text();
  return { court, time };
};

export default fetchGameDetails;
