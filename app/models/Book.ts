import "reflect-metadata";
import { prop, getModelForClass, index, ReturnModelType } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
import mongoose from "mongoose";
import * as EditorialNS from "./Editorial";
import type { Editorial as EditorialType } from "./Editorial";
@index({ title: 1, author: 1 })
export class Book {
  @prop({ required: true, trim: true })
  title!: string;

  @prop({ required: true, trim: true })
  author!: string;

  @prop({ required: true, trim: true })
  description!: string;

  @prop()
  genre?: string;

  @prop()
  year?: number;

  // URL segura en Cloudinary
  @prop({ trim: true })
  coverUrl?: string;

  // Public ID para futuras operaciones (opcional)
  @prop({ trim: true })
  coverPublicId?: string;

  @prop({ default: true })
  available?: boolean;

  // Relación: Editorial (editorial/publisher)
  @prop({ ref: () => EditorialNS.Editorial })
  editorial?: Ref<EditorialType>;
}


export const BookModel: ReturnModelType<typeof Book> =
  (mongoose.models.Book as ReturnModelType<typeof Book>) ?? getModelForClass(Book);
