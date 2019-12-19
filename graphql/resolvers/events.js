const Event = require("../../models/event");
const { transformEvent } = require("./merge");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      // .populate("creator")
      return events.map(event => {
        return transformEvent(event);
      });
    } catch (error) {
      throw error;
    }
  },

  createEvent: async args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "5dfbb9224b910a1d59a9fd26"
    });

    try {
      const result = await event.save();
      const createdEvent = transformEvent(result);

      const creator = await User.findById("5dfbb9224b910a1d59a9fd26");
      if (!creator) {
        throw new Error("User not found");
      }

      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
};
