import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "./service_account_key.json",
  scopes: ["https://www.googleapis.com/auth/calendar"],
});
const calendar = google.calendar({ version: "v3", auth });

const syncCalendar = async (latestGameDetails) => {
  if (latestGameDetails.dateTime < new Date()) {
    console.log("Latest game is in the past");
    return;
  }

  const currentUpcomingEvent = await getCurrentUpcomingEvent();
  if (!currentUpcomingEvent) {
    console.log("No upcoming events found so creating one");
    await createEvent(latestGameDetails);
    return;
  }

  if (
    new Date(currentUpcomingEvent.start.dateTime).toISOString() ===
      latestGameDetails.dateTime.toISOString() &&
    currentUpcomingEvent.summary.includes(latestGameDetails.court)
  ) {
    console.log("Event is already up to date");
    return;
  }

  console.log("Event is outdated so updating it");
  await updateEventDetails(currentUpcomingEvent, latestGameDetails);
};

const getCurrentUpcomingEvent = async () => {
  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: 1,
  });
  return !!res?.data?.items?.length ? res.data.items[0] : undefined;
};

const updateEventDetails = async (event, latestGameDetails) => {
  const updatedEventData = generateEventData(latestGameDetails);
  calendar.events
    .update({
      calendarId: "primary",
      eventId: event.id,
      resource: updatedEventData,
    })
    .then((event) => console.log(`Event updated: ${event.statusText}`));
};

const createEvent = async (latestGameDetails) => {
  const newEventData = generateEventData(latestGameDetails);
  calendar.events
    .insert({
      calendarId: "primary",
      resource: newEventData,
    })
    .then((event) => console.log(`Event created: ${event.statusText}`));
};

const generateEventData = (gameDetails) => {
  const gameTypes = ["Huge", "Big", "Massive", "Giant", "Gigantic"];
  const randomGameType =
    gameTypes[Math.floor(Math.random() * gameTypes.length)];

  const descriptions = [
    "What are the odds Dos will get tilted this one?",
    "Timmys had too many wheat bix this morning",
    "I heard Timmys running in from Chermside this one",
    "Timmys got the fists back out",
    "I bet Mikaela and Kate won't stop chatting",
    "How did we ever get into div 2?",
    "Harry will surely make it this time",
    "What are the odds the ref watches this one?",
    "'Quick reset' - Dos",
  ];
  const randomDescription =
    descriptions[Math.floor(Math.random() * descriptions.length)];

  return {
    summary: `${randomGameType} Volleyball Game -  ${gameDetails.court}`,
    description: randomDescription,
    start: {
      dateTime: gameDetails.dateTime.toISOString(),
      timeZoneId: "Australia/Brisbane",
    },
    end: {
      dateTime: addMinutes(gameDetails.dateTime, 45).toISOString(),
      timeZoneId: "Australia/Brisbane",
    },
  };
};

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

export default syncCalendar;
