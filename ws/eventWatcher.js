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
                    analysis = { events: [], totalParticipants: 0, totalVolunteers: 0 };
                }
                analysis.events.push({ eventName: event.name, numParticipants: event.registered_participants.length, numVolunteers: event.volunteers.length });
                analysis.totalParticipants += event.registered_participants.length;
                analysis.totalVolunteers += event.volunteers.length;
                putAnalyticsForOrganizer(organizer, analysis);
                break;
        }
    });
}
