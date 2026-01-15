import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reportSchema = new Schema(
  {
    issue_id: {
      type: Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      required: [true, "An image URL is required."],
    },
    description: {
      type: String,
      required: [true, "A description is required."],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;
