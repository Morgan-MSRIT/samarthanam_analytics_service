const Event = require("../models/event.models.js");
const User = require("../models/user.models.js");
const Tag = require("../models/tag.models.js");
const Volunteer = require("../models/volunteer.models.js");

const eventAnalytics = {};
/**
    analytics = {
        <organizer object id>: {
            events: Array<{ eventName: string, numParticipants: number, numVolunteers: number },
            totalParticipants: number,
            totalVolunteers: number,
            eventName: Array<string>,
            numParticipants: Array<number>,
            registeredParticipants: Array<number>,
        }
    }
**/

const tagAnalytics = {};
/**
    tagAnalytics = {
        <tag object id>: {
            totalVolunteersWithTag: number,
            registeredVolunteersWithTag: number,
        }
    }
**/
const initializeTagAnalytics = async () => {
    const tags = await Tag.find();
    const volunteers = await Volunteer.find().populate('event').populate('user');

    for (const tag of tags) {
        tagAnalytics[tag._id] = { totalVolunteersWithTag: 0, registeredVolunteersWithTag: 0 };

        for (const volunteer of volunteers) {
            var eventHasTag = false;
            for (const eventTag of volunteer.event.tags) {
                if (eventTag._id.toString() === tag._id.toString()) {
                    eventHasTag = true;
                    break;
                }
            }
            
            var userHasTag = false;
            for (const userTag of volunteer.user.tags) {
                if (userTag._id.toString() === tag._id.toString()) {
                    userHasTag = true;
                    break;
                }
            }

            tagAnalytics[tag._id].registeredVolunteersWithTag += (eventHasTag && userHasTag)? 1: 0;
            tagAnalytics[tag._id].totalVolunteersWithTag += (userHasTag)? 1: 0;
        }
    }
    console.log(tagAnalytics);
}

exports.putTagAnalyticsForTag = (tag, analytics) => {
    tagAnalytics[tag._id] = analytics;
    console.log("New analytics for tag: ");
    console.log(tagAnalytics);
}

exports.getTagAnalytics = () => {
    return tagAnalytics;
}

exports.initializeAnalytics = async () => {
    const events = await Event.find();
    for (const event of events) {
        const organizer = await User.findOne({ _id: event.user });
        if (eventAnalytics[organizer._id] === undefined) {
            eventAnalytics[organizer._id] = { eventName: [], volunteersRequired: [], volunteersRegistered: [], totalParticipants: 0, totalVolunteers: 0 };
        }
        eventAnalytics[organizer._id].eventName.push(event.name);
        eventAnalytics[organizer._id].volunteersRequired.push(event.totalVolunteerReq);
        eventAnalytics[organizer._id].volunteersRegistered.push(event.volunteers.length);
        eventAnalytics[organizer._id].totalParticipants += event.registeredParticipants.length;
        eventAnalytics[organizer._id].totalVolunteers += event.volunteers.length;
    }
    initializeTagAnalytics();
    console.log(eventAnalytics);
}

exports.getEventAnalyticsForOrganizer = organizer => {
    return eventAnalytics[organizer._id];
}

exports.putEventAnalyticsForOrganizer = (organizer, analysis) => {
    eventAnalytics[organizer._id] = analysis;
    console.log("New analytics for organizer:");
    console.log(eventAnalytics);
    return eventAnalytics[organizer._id];
}

exports.getEventAnalytics = () => {
    const analytics = { eventName: [], volunteersRequired: [], volunteersRegistered: [], totalParticipants: 0, totalVolunteers: 0 };
    for (const organizerId in eventAnalytics) {
        analytics.eventName.push(...eventAnalytics[organizerId].eventName);
        analytics.volunteersRequired.push(...eventAnalytics[organizerId].volunteersRequired);
        analytics.volunteersRegistered.push(...eventAnalytics[organizerId].volunteersRegistered);
        analytics.totalParticipants += eventAnalytics[organizerId].totalParticipants;
        analytics.totalVolunteers += eventAnalytics[organizerId].totalVolunteers;
    }
    return analytics;
}
