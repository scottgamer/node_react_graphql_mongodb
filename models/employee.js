const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    addresses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Address"
      }
    ],
    skills: [
      {
        type: Schema.Types.ObjectId,
        ref: "Skill"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
