const User = require("../models/user.models.js");
const Tag = require("../models/tag.models.js");
const { getEventAnalyticsForOrganizer, getEventAnalytics, getTagAnalytics } = require("../utils/cache");

exports.getOrganizerAnalytics = async (req, res) => {
    try {
        const id = req.body.id;
        const organizer = await User.findById(id)
        const eventAnalysis = getEventAnalyticsForOrganizer(organizer);
        if (eventAnalysis === undefined) {
            return res.status(400).json({
                success: false,
                message: "No analytics for organizer.",
            })
        }
        
        eventAnalysis.tags = [];
        eventAnalysis.totalVolunteersWithTag = [];
        eventAnalysis.registeredVolunteersWithTag = [];

        const tagAnalytics = getTagAnalytics();
        for (const tag in tagAnalytics) {
            const tagSchema = await Tag.findOne({ _id: tag });
            console.log(tagSchema);
            eventAnalysis.tags.push(tagSchema.name);
            eventAnalysis.totalVolunteersWithTag.push(tagAnalytics[tag].totalVolunteersWithTag);
            eventAnalysis.registeredVolunteersWithTag.push(tagAnalytics[tag].registeredVolunteersWithTag);
        }
    
        return res.status(200).json({
            success: true,
            message: "Analysis found for organizer along with tag analytics",
            data: eventAnalysis,
        });
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            success: false,
            message: "Not an organizer.",
        })
    }
}

exports.getAllAnalytics = async (req, res) => {
    try {
        const eventAnalysis = getEventAnalytics();
        eventAnalysis.tags = [];
        eventAnalysis.totalVolunteersWithTag = [];
        eventAnalysis.registeredVolunteersWithTag = [];

        const tagAnalytics = getTagAnalytics();
        for (const tag in tagAnalytics) {
            const tagSchema = await Tag.findOne({ _id: tag });
            console.log(tagSchema);
            eventAnalysis.tags.push(tagSchema.name);
            eventAnalysis.totalVolunteersWithTag.push(tagAnalytics[tag].totalVolunteersWithTag);
            eventAnalysis.registeredVolunteersWithTag.push(tagAnalytics[tag].registeredVolunteersWithTag);
        }
        return res.status(200).json({
            success: true,
            message: "Analysis found along with tag analytics",
            data: eventAnalysis,
        });
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            success: false,
            message: "Internal error",
        })
    }
}
