import "reflect-metadata";
import { prop, getModelForClass, index, ReturnModelType } from "@typegoose/typegoose";
import mongoose from "mongoose";

@index({ name: 1 }, { unique: true })
export class Editorial {
  @prop({ required: true, trim: true })
  name!: string;

  @prop({ default: Date.now })
  createdAt?: Date;
}

export const EditorialModel: ReturnModelType<typeof Editorial> =
  (mongoose.models.Editorial as ReturnModelType<typeof Editorial>) ?? getModelForClass(Editorial);