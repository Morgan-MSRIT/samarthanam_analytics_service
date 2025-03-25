const Tag = require("../models/tag.models.js");
const User = require("../models/user.models.js");
const Event = require("../models/event.models.js");
const Volunteer = require("../models/volunteer.models.js");
const { putTagAnalyticsForTag } = require("../utils/cache.js");

const options = { fullDocument: "updateLookup" };
const pipeline = [];

exports.watchTags = () => {
    Tag.watch(pipeline, options).on("change", async next => {
        switch (next.operationType) {
            case "insert":
                const tag = next.fullDocument;
                const volunteers = await Volunteer.find().populate('user').populate('event');
                const analytics = { totalVolunteersWithTag: 0, registeredVolunteersWithTag: 0 };

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

                    analytics.registeredVolunteersWithTag += (eventHasTag && userHasTag)? 1: 0;
                    analytics.totalVolunteersWithTag += (userHasTag)? 1: 0;
                }

                putTagAnalyticsForTag(tag, analytics);
                break;
    }});
}
