import "reflect-metadata";
import { prop, getModelForClass, index, ReturnModelType } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
import mongoose from "mongoose";
import * as BookNS from "./Book";
import type { Book as BookType } from "./Book";

@index({ book: 1 }, { unique: true })
export class BookView {
  @prop({ ref: () => BookNS.Book, required: true })
  book!: Ref<BookType>;

  @prop({ default: 0 })
  views!: number;

  @prop({ default: Date.now })
  updatedAt?: Date;
}

export const BookViewModel: ReturnModelType<typeof BookView> =
  (mongoose.models.BookView as ReturnModelType<typeof BookView>) ?? getModelForClass(BookView);