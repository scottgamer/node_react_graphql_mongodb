const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type Employee {
  _id: ID!
  firstname: String!
  lastname: String!
  addresses: [Address!]
  skills: [Skill!]
}

type Address {
  _id: ID!
  line1: String!
  line2: String
  city: String!
  state: String!
  zipcode: String!
}

type Skill {
  _id: ID!
  name: String!
}

type Booking {
  _id: ID!
  event: Event!
  user: User!
  createdAt: String!
  updatedAt: String!
}

type Event {
  _id: ID!,
  title: String!
  description: String!
  price: Float!
  date: String!
  creator: User!
}

type User {
  _id: ID!
  email: String!
  password: String
  createdEvents: [Event!]
}

type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
}

input EventInput {
  title: String!
  description: String!
  price: Float!
  date: String!
}

input UserInput {
  email: String!
  password: String!
}

input EmployeeInput {
  firstname: String!
  lastname: String!
  addresses: [AddressInput!]
  skills: [SkillInput!]
}

input UpdateEmployeeInput {
  _id: ID!
  firstname: String
  lastname: String
  addresses: [UpdateAddressInput]
  skills: [UpdateSkillInput]
}

input AddressInput {
  line1: String!
  line2: String
  city: String!
  state: String!
  zipcode: String!
}

input UpdateAddressInput {
  _id: ID!
  line1: String
  line2: String
  city: String
  state: String
  zipcode: String
}

input SkillInput {
  name: String!
}

input UpdateSkillInput {
  _id: ID!
  name: String
}

type RootQuery {
  events: [Event!]!
  bookings: [Booking!]!
  login(email: String!, password: String!): AuthData!
  employees: [Employee!]!
}

type RootMutation {
  createEmployee(employeeInput: EmployeeInput): Employee
  updateEmployee(updateEmployeeInput: UpdateEmployeeInput): Employee
  deleteEmployee(employeeId: ID!): Employee
  createAddress(addressInput: AddressInput): Address
  createSkill(skillInput: SkillInput): Skill
  createEvent(eventInput: EventInput): Event
  createUser(userInput: UserInput): User
  bookEvent(eventId: ID!): Booking!
  cancelBooking(bookingId: ID!): Event!
}

schema {
  query: RootQuery
  mutation: RootMutation
}
`);
