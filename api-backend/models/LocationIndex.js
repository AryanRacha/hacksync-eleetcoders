import mongoose from "mongoose";
const Schema = mongoose.Schema;

/**
 * Optimized LocationIndex schema for central geospatial storage.
 * - Stores each location as a separate document (not grouped by pincode).
 * - Enables efficient geospatial queries and indexing.
 * - Designed to work with extractLocation.js utilities.
 */
const locationIndexSchema = new Schema(
  {
    modelType: { type: String, required: true }, // e.g., "Issue", "Report"
    refId: { type: Schema.Types.ObjectId, required: true }, // Reference to Issue/Report
    address: {
      geoJson: {
        type: {
          type: String,
          enum: ["Point"],
          required: true,
        },
        coordinates: {
          type: [Number], // [lng, lat]
          required: true,
        },
      },
      latLng: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
      pincode: {
        type: String,
        required: [true, "Pincode is required."],
        trim: true,
        index: true, // For fast pincode queries
      },
      addressLine: {
        type: String,
        required: [true, "Address is required."],
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// 2dsphere index for geospatial queries
locationIndexSchema.index({ "address.geoJson": "2dsphere" });
// Index for pincode-based queries
locationIndexSchema.index({ "address.pincode": 1 });

const LocationIndex = mongoose.model("LocationIndex", locationIndexSchema);
export default LocationIndex;
