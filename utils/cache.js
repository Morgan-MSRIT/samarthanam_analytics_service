const Event = require("../models/event.models.js");
const User = require("../models/user.models.js");

const analytics = {};
/**
    analytics = {
        <organizer object id>: {
            events: Array<{ eventName: string, numParticipants: number, numVolunteers: number },
            totalParticipants: number,
            totalVolunteers: number,
        }
    }
**/

exports.initializeAnalytics = async () => {
    const events = await Event.find();
    for (const event of events) {
        const organizer = await User.findOne({ _id: event.user });
        if (analytics[organizer._id] === undefined) {
            analytics[organizer._id] = { events: [], totalParticipants: 0, totalVolunteers: 0 };
        }

        analytics[organizer._id].events.push({ eventName: event.name, numParticipants: event.registered_participants.length, numVolunteers: event.volunteers.length });
        analytics[organizer._id].totalParticipants += event.registered_participants.length;
        analytics[organizer._id].totalVolunteers += event.volunteers.length;
    }
    console.log(analytics);
}

exports.getAnalyticsForOrganizer = organizer => {
    return analytics[organizer._id];
}

exports.putAnalyticsForOrganizer = (organizer, analysis) => {
    analytics[organizer._id] = analysis;
    console.log("Updated analytics for organizer.")
    console.log(analytics);
}

exports.getAnalytics = () => {
    return analytics;
}
