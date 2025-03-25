const Event = require("../models/event.models.js");
const { getAnalyticsForOrganizer, putAnalyticsForOrganizer } = require("../utils/cache.js");

const options = { fullDocument: "updateLookup" };
const pipeline = [];

exports.watchEvents = () => {
    Event.watch(pipeline, options).on("change", async next => {
        switch (next.operationType) {
            case "insert":
            case "update":
                const event = next.fullDocument;
                const organizer = event.user;
                const analysis = getAnalyticsForOrganizer(organizer);
                if (analysis === null) {
                    analysis = { events: [], totalParticipants: 0, totalVolunteers: 0, eventName: [], numParticipants: [], registeredParticipants: [], tagName: [], totalVolunteersWithTag: [], registeredVolunteersWithTag: [] };
                }
                analysis.events.push({ eventName: event.name, numParticipants: event.registeredParticipants.length, numVolunteers: event.volunteers.length });
                analysis.eventName.push(event.name);
                analysis.numParticipants.push(event.registeredParticipants.length);
                analysis.registeredParticipants.push(event.volunteers.length);
                analysis.totalParticipants += event.registeredParticipants.length;
                analysis.totalVolunteers += event.volunteers.length;

                putAnalyticsForOrganizer(organizer, analysis);
                break;
        }
    });
}
