const User = require("../models/user.models.js");
const { getAnalyticsForOrganizer, getAnalytics } = require("../utils/cache");

exports.getOrganizerAnalytics = async (req, res) => {
    try {
        const name  = req.body.organizerName;
        const email = req.body.organizerEmail;
        const organizer = await User.find({ name: name, email: email })
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
            analytics: analysis,
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
            analytics: analytics,
        });
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            success: false,
            message: "Not an organizer.",
        })
    }
}
