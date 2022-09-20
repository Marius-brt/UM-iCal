import { Schema, model, models } from "mongoose";

const BdeSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
});

export default models.Bde || model("Bde", BdeSchema);
