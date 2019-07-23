const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tripSchema = new Schema({
     budget: {
          type: Number
     },
     title: {
          type: String,
          required: true
     },
     description: String,
     startDate: {
          type: Date,
          required: true
     },
     endDate: {
          type: Date,
          required: true
     },
     
     activity: [{ type: Schema.Types.ObjectId, ref: "Activity" }],
     activityContainer: { type: Schema.Types.ObjectId, ref: "ActivityContainer" },
     owner: { type: Schema.Types.ObjectId, ref: "User" }
});

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;