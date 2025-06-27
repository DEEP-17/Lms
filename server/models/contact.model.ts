import mongoose, { Document, Schema } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
  answered: boolean;
  answerText?: string;
}

const ContactSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  answered: { type: Boolean, default: false },
  answerText: { type: String },
});

export default mongoose.models.Contact ||
  mongoose.model<IContact>("Contact", ContactSchema);
