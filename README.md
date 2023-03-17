
<img width="700" alt="image" src="https://user-images.githubusercontent.com/38173749/225908600-d06eb12a-8195-4c3a-8357-3ba7bfe9c5a9.png">


# Never miss a game:

## Sync your team's upcoming sporting event with your own Google Calendar

This example NodeJS application scrapes a website for your team's upcoming sporting event using Cheerio and syncs the event times with your Google Calendar. 

The program runs on a regular basis using cron scheduling inside a Docker container, which ensures that your calendar stays up-to-date with the latest information about the upcoming events.

## Getting Started

### Prerequisites

To use this script, you will need:

-   Docker installed on your machine
-   Google Calendar API credentials: [Service account](https://github.com/googleapis/google-api-nodejs-client#service-account-credentials) 

### Installing

1.  Fork this repository and clone it to your local machine.
2. Run `npm install`
3.  Modify the `webScraper.js` file to fetch the information from your team's website. Update the URL and HTML parsing.
4.  Follow the instructions [here](https://github.com/googleapis/google-api-nodejs-client#service-account-credentials)  to set up your Google Calendar API credentials and download the `credentials.json` file.
5.  Rename the `credentials.json` file to `service_account_key.json` and place it in the root directory of the project.
6.  Modify the `calendar.js` file to format the event with your custom scraped data.
7. To run the local repo you can use `npm start`

### Usage

1.  The Docker image will be built whenever you create a release for your repo
2. It's currently setup to build for servers running `arm64` but you can customise that in the `Dockerfile` and Github Action files
3.  Run the Docker container using `docker run -d --name volleysync-container ghcr.io/your-github-user/your-forked-repo`
4.  The script will run every hour and create events on your Google Calendar for any upcoming sporting events.

### Calendar Settings

To manage the calendars settings and visibility options etc you can give your own personal google account access to it via an [acl](https://developers.google.com/calendar/api/v3/reference/acl/insert). This will allow you to manage the calendar through the standard [Google calendar website](https://calendar.google.com/calendar/u/0/)
