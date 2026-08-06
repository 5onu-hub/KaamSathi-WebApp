import { Schema, model, Document } from "mongoose";

export interface IFAQArticle extends Document {
  question: string;
  answer: string;
  category: string;
  helpfulCount: number;
  views: number;
}

const faqSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, required: true, index: true },
  helpfulCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 }
});

export const FAQArticle = model<IFAQArticle>("FAQArticle", faqSchema);

export interface IKnowledgeBaseArticle extends Document {
  title: string;
  slug: string;
  category: string;
  content: string;
  readTime: string;
}

const kbSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true, index: true },
  content: { type: String, required: true },
  readTime: { type: String, default: "3 min read" }
});

export const KnowledgeBaseArticle = model<IKnowledgeBaseArticle>("KnowledgeBaseArticle", kbSchema);
