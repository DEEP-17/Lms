import { Document, model, Schema } from "mongoose";

interface FaqItem extends Document {
  question: string;
  answer: string;
}

interface Category extends Document {
  title: string;
  icon: string;
  count: number;
}

interface Testimonial extends Document {
  name: string;
  text: string;
  rating: number;
  avatar: string;
  date: string;
}

interface Feature extends Document {
  title: string;
  icon: string;
}

interface Layout extends Document {
  faq: FaqItem[];
  type: string;
  categories: Category[];
  testimonials: Testimonial[];
  features: Feature[];
  bannerImage: {
    title: string;
    subTitle: string;
  };
  whyTrustUs: {
    title: string;
    description: string;
    image: string;
    features: Feature[];
  };
  newsletter: {
    title: string;
    description: string;
    buttonText: string;
    visitorCount: string;
  };
  knowledgeGuarantee: {
    title: string;
    description: string;
    buttonText: string;
    image: {
      public_id: string;
      url: string;
    };
  };
}

const faqSchema = new Schema<FaqItem>({
  question: { type: String },
  answer: { type: String },
});

const categorySchema = new Schema<Category>({
  title: { type: String },
  icon: { type: String },
  count: { type: Number, default: 0 },
});

const testimonialSchema = new Schema<Testimonial>({
  name: { type: String },
  text: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  avatar: { type: String },
  date: { type: String },
});

const featureSchema = new Schema<Feature>({
  title: { type: String },
  icon: { type: String },
});

const layoutSchema = new Schema<Layout>({
  faq: [faqSchema],
  type: { type: String },
  categories: [categorySchema],
  testimonials: [testimonialSchema],
  features: [featureSchema],
  bannerImage: {
    title: { type: String },
    subTitle: { type: String },
  },
  whyTrustUs: {
    title: { type: String },
    description: { type: String },
    image: { type: String },
    features: [featureSchema],
  },
  newsletter: {
    title: { type: String },
    description: { type: String },
    buttonText: { type: String },
    visitorCount: { type: String },
  },
  knowledgeGuarantee: {
    title: { type: String },
    description: { type: String },
    buttonText: { type: String },
    image: {
      public_id: String,
      url: String,
    },
  },
});

const LayoutModel = model<Layout>("Layout", layoutSchema);
export default LayoutModel;
