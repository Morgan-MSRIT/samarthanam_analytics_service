const User = require("../models/user.models.js");
const { getAnalyticsForOrganizer, getAnalytics } = require("../utils/cache");

exports.getOrganizerAnalytics = async (req, res) => {
    try {
        const id = req.body.id;
        const organizer = await User.findById(id)
        const analysis = getAnalyticsForOrganizer(organizer);
        if (analysis === null) {
            return res.status(400).json({
                success: false,
                message: "No analytics for organizer.",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Analysis found for organizer",
            data: analysis,
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
        const analytics = getAnalytics();
        return res.status(200).json({
            success: true,
            message: "Analysis found for organizer",
            data: analytics,
        });
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            success: false,
            message: "Not an organizer.",
        })
    }
}
