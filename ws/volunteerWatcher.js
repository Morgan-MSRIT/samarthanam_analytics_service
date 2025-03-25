const User = require("../models/user.models.js");
const Tag = require("../models/tag.models.js");
const Volunteer = require("../models/volunteer.models.js");
const { putTagAnalyticsForTag, getTagAnalyticsForTag } = require("../utils/cache.js");

const options = { fullDocument: "updateLookup" };
const pipeline = [];

exports.watchVolunteers = () => {
    Volunteer.watch(pipeline, options).on("change", async next => {
        switch (next.operationType) {
            case "insert":
            case "update":
                const volunteer = next.fullDocument.populate("event", "user");
                const tags = await Tag.find();
                for (const tag of tags) {
                    const analytics = getTagAnalyticsForTag(tag);
                    if (analytics === undefined) {
                        analytics = { totalVolunteersWithTag: 0, registeredVolunteersWithTag: 0 };
                    }
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
                    putTagAnalyticsForTag(tag, analytics);
                }
                break;
        }
    });
}
