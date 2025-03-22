const { getOrganizerAnalytics, getAllAnalytics } = require("../controllers/analytics.controllers");

const analyticsRouter = require("express").Router();

analyticsRouter.route("/get-organizer-analytics").get(getOrganizerAnalytics);
analyticsRouter.route("/get-all-analytics").get(getAllAnalytics);

module.exports = { analyticsRouter };
