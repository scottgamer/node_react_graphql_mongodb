const Event = require("../../models/event");
const User = require("../../models/user");
const Address = require("../../models/address");
const Skill = require("../../models/skill");

const { dateToString } = require("../../helpers/date");

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });

    return events.map(event => {
      return transformEvent(event);
    });
  } catch (error) {
    throw error;
  }
};

const addresses = async addressIds => {
  try {
    const addresses = await Address.find({ _id: { $in: addressIds } });

    return addresses.map(address => {
      return transformAddress(address);
    });
  } catch (error) {
    throw error;
  }
};

const skills = async skillIds => {
  try {
    const skills = await Skill.find({ _id: { $in: skillIds } });

    return skills.map(skill => {
      return transformSkill(skill);
    });
  } catch (error) {
    throw error;
  }
};

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (error) {
    throw error;
  }
};

// manual population of user creator
const user = async userId => {
  try {
    const user = await User.findById(userId);

    return {
      ...user._doc,
      createdEvents: events.bind(this, user._doc.createdEvents)
    };
  } catch (error) {
    throw error;
  }
};

const transformEvent = event => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator)
  };
};

const transformAddress = address => {
  return {
    ...address._doc
  };
};

const transformSkill = skill => {
  return {
    ...skill._doc
  };
};

const transformBooking = booking => {
  return {
    ...booking._doc,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
};

const transformEmployee = employee => {
  return {
    ...employee._doc,
    addresses: addresses.bind(this, employee._doc.addresses),
    skills: skills.bind(this, employee._doc.skills),
    createdAt: dateToString(employee._doc.createdAt),
    updatedAt: dateToString(employee._doc.updatedAt)
  };
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
exports.transformEmployee = transformEmployee;
