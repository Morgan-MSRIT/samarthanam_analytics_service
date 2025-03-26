const Event = require("../models/event.models.js");
const { putEventAnalyticsForOrganizer, getEventAnalyticsForOrganizer } = require("../utils/cache.js");

const options = { fullDocument: "updateLookup" };
const pipeline = [];

exports.watchEvents = () => {
    Event.watch(pipeline, options).on("change", async next => {
        switch (next.operationType) {
            case "insert":
            case "update":
                const event = next.fullDocument;
                const organizer = event.user;
                const analysis = getEventAnalyticsForOrganizer(organizer);
                if (analysis === null) {
                    analysis = { totalParticipants: 0, totalVolunteers: 0, eventName: [], volunteersRequired: [], volunteersRegistered: [] };
                }
                analysis.eventName.push(event.name);
                analysis.maxVolunteers.push(event.registeredParticipants.length);
                analysis.volunteersRegistered.push(event.volunteers.length);
                analysis.volunteersRequired.push(event.totalVolunteerReq);
                analysis.totalParticipants += event.registeredParticipants.length;
                analysis.totalVolunteers += event.volunteers.length;

                putEventAnalyticsForOrganizer(organizer, analysis);
                break;
        }
    });
}
