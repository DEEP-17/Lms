import cloudinary from "cloudinary";
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import LayoutModel from "../models/layout.model";
import ErrorHandler from "../utils/ErrorHandler";

export const createLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      let layoutData = await LayoutModel.findOne({ type: "layout" });

      // If no layout document exists, create one
      if (!layoutData) {
        layoutData = await LayoutModel.create({ type: "layout" });
      }

      if (type === "Banner") {
        const { title, subTitle } = req.body;
        await LayoutModel.findByIdAndUpdate(layoutData._id, {
          bannerImage: {
            title,
            subTitle,
          },
        });
      }

      if (type === "FAQ") {
        const { faq } = req.body;
        const faqItems = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          })
        );
        await LayoutModel.findByIdAndUpdate(layoutData._id, {
          faq: faqItems,
        });
      }

      if (type === "Categories") {
        const { categories } = req.body;
        const categoriesList = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title,
              icon: item.icon,
              count: item.count || 0,
            };
          })
        );
        await LayoutModel.findByIdAndUpdate(layoutData._id, {
          categories: categoriesList,
        });
      }

      if (type === "Testimonials") {
        const { testimonials } = req.body;
        const testimonialsList = await Promise.all(
          testimonials.map(async (item: any) => {
            return {
              name: item.name,
              text: item.text,
              rating: item.rating,
              avatar: item.avatar,
              date: item.date,
            };
          })
        );
        await LayoutModel.findByIdAndUpdate(layoutData._id, {
          testimonials: testimonialsList,
        });
      }

      if (type === "WhyTrustUs") {
        const { title, description, image, features } = req.body;
        const featuresList = await Promise.all(
          features.map(async (item: any) => {
            return {
              title: item.title,
              icon: item.icon,
            };
          })
        );
        await LayoutModel.findByIdAndUpdate(layoutData._id, {
          whyTrustUs: {
            title,
            description,
            image,
            features: featuresList,
          },
        });
      }

      if (type === "Newsletter") {
        const { title, description, buttonText, visitorCount } = req.body;
        await LayoutModel.findByIdAndUpdate(layoutData._id, {
          newsletter: {
            title,
            description,
            buttonText,
            visitorCount,
          },
        });
      }

      if (type === "KnowledgeGuarantee") {
        const { title, description, buttonText, image } = req.body;
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "Layout",
        });
        await LayoutModel.findByIdAndUpdate(layoutData._id, {
          knowledgeGuarantee: {
            title,
            description,
            buttonText,
            image: {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            },
          },
        });
      }

      res.status(200).json({
        success: true,
        message: "Layout created successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//Edit layout
export const editLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      const layoutData = await LayoutModel.findOne({ type: "layout" });

      if (!layoutData) {
        return next(new ErrorHandler("Layout not found", 404));
      }

      if (type === "Banner") {
        const { title, subTitle } = req.body;
        await LayoutModel.findByIdAndUpdate(layoutData._id, {
          bannerImage: {
            title,
            subTitle,
          },
        });
      }

      if (type === "FAQ") {
        const { faq } = req.body;
        const faqItems = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          })
        );
        await LayoutModel.findByIdAndUpdate(layoutData._id, {
          faq: faqItems,
        });
      }

      if (type === "Categories") {
        const { categories } = req.body;
        const categoriesList = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title,
              icon: item.icon,
              count: item.count || 0,
            };
          })
        );
        await LayoutModel.findByIdAndUpdate(layoutData._id, {
          categories: categoriesList,
        });
      }

      if (type === "Testimonials") {
        const { testimonials } = req.body;
        const testimonialsList = await Promise.all(
          testimonials.map(async (item: any) => {
            return {
              name: item.name,
              text: item.text,
              rating: item.rating,
              avatar: item.avatar,
              date: item.date,
            };
          })
        );
        await LayoutModel.findByIdAndUpdate(layoutData._id, {
          testimonials: testimonialsList,
        });
      }

      if (type === "WhyTrustUs") {
        const { title, description, image, features } = req.body;
        const featuresList = await Promise.all(
          features.map(async (item: any) => {
            return {
              title: item.title,
              icon: item.icon,
            };
          })
        );
        await LayoutModel.findByIdAndUpdate(layoutData._id, {
          whyTrustUs: {
            title,
            description,
            image,
            features: featuresList,
          },
        });
      }

      if (type === "Newsletter") {
        const { title, description, buttonText, visitorCount } = req.body;
        await LayoutModel.findByIdAndUpdate(layoutData._id, {
          newsletter: {
            title,
            description,
            buttonText,
            visitorCount,
          },
        });
      }

      if (type === "KnowledgeGuarantee") {
        const { title, description, buttonText, image } = req.body;

        // Delete existing image from Cloudinary if it exists
        if (layoutData.knowledgeGuarantee?.image?.public_id) {
          await cloudinary.v2.uploader.destroy(
            layoutData.knowledgeGuarantee.image.public_id
          );
        }

        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "Layout",
        });
        await LayoutModel.findByIdAndUpdate(layoutData._id, {
          knowledgeGuarantee: {
            title,
            description,
            buttonText,
            image: {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            },
          },
        });
      }

      res.status(200).json({
        success: true,
        message: "Layout updated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get layout by type
export const getLayoutByType = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.params;

      // For the main layout document that contains all sections
      if (type === "layout") {
        const layout = await LayoutModel.findOne({ type: "layout" });
        if (!layout) {
          return next(new ErrorHandler("Layout not found", 404));
        }
        res.status(200).json({
          success: true,
          layout,
        });
        return;
      }

      // For individual section types (legacy support)
      const layout = await LayoutModel.findOne({ type });
      if (!layout) {
        return next(new ErrorHandler("Layout not found", 404));
      }
      res.status(200).json({
        success: true,
        layout,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
