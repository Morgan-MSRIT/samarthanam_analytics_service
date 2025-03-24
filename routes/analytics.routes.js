const { getOrganizerAnalytics, getAllAnalytics } = require("../controllers/analytics.controllers");

const analyticsRouter = require("express").Router();

analyticsRouter.route("/get-organizer-analytics").post(getOrganizerAnalytics);
analyticsRouter.route("/get-all-analytics").post(getAllAnalytics);

module.exports = { analyticsRouter };
