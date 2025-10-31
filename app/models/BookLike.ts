import "reflect-metadata";
import { prop, getModelForClass, index, ReturnModelType } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
import mongoose from "mongoose";
import * as BookNS from "./Book";
import type { Book as BookType } from "./Book";

@index({ book: 1 }, { unique: true })
export class BookLike {
  @prop({ ref: () => BookNS.Book, required: true })
  book!: Ref<BookType>;

  @prop({ default: 0 })
  likes!: number;

  @prop({ default: Date.now })
  updatedAt?: Date;
}

export const BookLikeModel: ReturnModelType<typeof BookLike> =
  (mongoose.models.BookLike as ReturnModelType<typeof BookLike>) ?? getModelForClass(BookLike);