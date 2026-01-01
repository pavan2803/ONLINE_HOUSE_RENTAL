import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  owner: mongoose.Types.ObjectId;
  title: string;
  description: string;
  rent: number;
  location: string;
  amenities: string[];
  photos: string[];
  createdAt: Date;
}

const PropertySchema = new Schema<IProperty>({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  rent: { type: Number, required: true, min: 1 },
  location: { type: String, required: true },
  amenities: [{ type: String }],
  photos: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export const Property = mongoose.model<IProperty>('Property', PropertySchema);
