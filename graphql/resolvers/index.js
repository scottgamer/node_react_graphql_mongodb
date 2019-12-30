const authResolver = require("./auth");
const eventsResolver = require("./events");
const bookingResolver = require("./booking");

const employeeResolver = require("./employee");
const addressResolver = require("./address");
const skillResolver = require("./skill.js");

const rootResolver = {
  ...authResolver,
  ...eventsResolver,
  ...bookingResolver,
  ...employeeResolver,
  ...addressResolver,
  ...skillResolver
};

module.exports = rootResolver;
