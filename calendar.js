import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "./service_account_key.json",
  scopes: ["https://www.googleapis.com/auth/calendar"],
});
const calendar = google.calendar({ version: "v3", auth });

const syncCalendar = async (latestGameDetails) => {
  const currentUpcomingEvent = await getCurrentUpcomingEvent();

  if (!upcomingEvent) {
    console.log("No upcoming events found so creating one");
    await createEvent(latestGameDetails);
    return;
  }

  if (
    currentUpcomingEvent.start.dateTime === latestGameDetails.time &&
    currentUpcomingEvent.description.contains(latestGameDetails.court)
  )
    return;

  console.log("Event is out of date so updating it");
  await updateEventDetails(currentUpcomingEvent, latestGameDetails);
};

const getCurrentUpcomingEvent = async () => {
  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: 1,
    orderBy: "startTime",
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
    .then((event) => console.log(`Event updated: ${event}`));
};

const createEvent = async (latestGameDetails) => {
  const newEventData = generateEventData(latestGameDetails);
  calendar.events
    .insert({
      calendarId: "primary",
      resource: newEventData,
    })
    .then((event) => console.log(`Event created: ${event}`));
};

const generateEventData = (gameDetails) => ({
  summary: "Beach Volleyball",
  description: "Huge game on " + gameDetails.court,
  start: {
    dateTime: gameDetails.time,
    timeZoneId: "Australia/Brisbane",
  },
  end: {
    dateTime: gameDetails.time + 30,
    timeZoneId: "Australia/Brisbane",
  },
});

export default syncCalendar;
