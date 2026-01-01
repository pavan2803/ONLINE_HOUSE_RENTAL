import mongoose, { Document, Schema } from 'mongoose';

export type BookingStatus = 'Pending' | 'Approved' | 'Rejected';

export interface IBooking extends Document {
  property: mongoose.Types.ObjectId;
  tenant: mongoose.Types.ObjectId;
  status: BookingStatus;
  requestTime: Date;
}

const BookingSchema = new Schema<IBooking>({
  property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  tenant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  requestTime: { type: Date, default: Date.now },
});

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
