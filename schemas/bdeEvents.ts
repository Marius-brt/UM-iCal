import { Schema, model, Types, models } from "mongoose";
import bde from "./bde";

const BdeEventsSchema = new Schema({
  bde: { type: Types.ObjectId, require: true, ref: bde },
  date: { type: Date, require: true },
  title: { type: String, require: true, max: 50 },
  description: { type: String, require: true },
  price: { type: String, require: true },
  registration: { type: String, default: "" },
});

export default models.BdeEvents || model("BdeEvents", BdeEventsSchema);
