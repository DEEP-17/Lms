# Dynamic Landing Page Setup Guide

This guide explains how to set up and use the dynamic landing page system that allows admins to edit all landing page content through the admin interface.

## 🚀 Quick Setup

### 1. Initialize Database with Default Data

First, run the initialization script to populate your database with default content:

```bash
cd server
npm run init-layout
```

This will create initial data for:

- Hero/Banner section
- Categories
- Testimonials
- Why Trust Us section
- Newsletter section
- Knowledge Guarantee section
- FAQ section

### 2. Start the Application

```bash
# Terminal 1 - Start the server
cd server
npm run dev

# Terminal 2 - Start the client
cd client
npm run dev
```

## 📋 What's Been Implemented

### Backend Changes

1. **Layout Model** (`server/models/layout.model.ts`)

   - Extended to include all landing page components
   - Added schemas for FAQ, Categories, Testimonials, Features, etc.

2. **Layout Controller** (`server/controllers/layout.controller.ts`)

   - Added CRUD operations for each component type
   - Support for create/edit operations with proper validation

3. **Layout Routes** (`server/routes/layout.route.ts`)
   - API endpoints for all component types
   - Proper authentication and authorization

### Frontend Changes

1. **Redux API Slice** (`client/redux/features/Layout/layoutApi.ts`)

   - Queries for fetching data for each component
   - Mutations for updating each component type

2. **Landing Page Components** (Updated to use dynamic data)

   - `Categories.tsx` - Fetches categories from API
   - `Testimonials.tsx` - Fetches testimonials from API
   - `WhyTrustUs.tsx` - Fetches why trust us data from API
   - `Newsletter.tsx` - Fetches newsletter data from API
   - `KnowledgeGuarantee.tsx` - Fetches knowledge guarantee data from API

3. **Admin Components** (New components for editing)

   - `EditCategories.tsx` - Manage course categories
   - `EditTestimonials.tsx` - Manage customer testimonials
   - `EditWhyTrustUs.tsx` - Manage trust-building section
   - `EditNewsletter.tsx` - Manage newsletter subscription section
   - `EditKnowledgeGuarantee.tsx` - Manage knowledge guarantee section
   - `EditFAQ.tsx` - Manage frequently asked questions

4. **Admin Routes** (New pages)

   - `/admin/customization/testimonials`
   - `/admin/customization/why-trust-us`
   - `/admin/customization/newsletter`
   - `/admin/customization/knowledge-guarantee`

5. **Admin Sidebar** (Updated navigation)
   - Added navigation items for all new customization pages
   - Proper active state management

## 🎯 Features

### For Admins

- **Full CRUD Operations**: Add, edit, delete items in each section
- **Image Upload**: Upload and manage images for testimonials and other sections
- **Live Preview**: See changes in real-time
- **Validation**: Form validation with error handling
- **Loading States**: Proper loading indicators during operations
- **Toast Notifications**: Success/error feedback

### For Users

- **Dynamic Content**: All landing page content is now fetched from the database
- **Fallback Content**: If API fails, components show default content
- **Loading States**: Skeleton loaders while content is being fetched
- **Error Handling**: Graceful error states

## 🔧 API Endpoints

### Get Data

- `GET /api/layout/get-layout` - Get all layout data
- `GET /api/layout/get-categories` - Get categories data
- `GET /api/layout/get-testimonials` - Get testimonials data
- `GET /api/layout/get-why-trust-us` - Get why trust us data
- `GET /api/layout/get-newsletter` - Get newsletter data
- `GET /api/layout/get-knowledge-guarantee` - Get knowledge guarantee data
- `GET /api/layout/get-faq` - Get FAQ data

### Update Data

- `PUT /api/layout/edit-layout` - Update layout data
- `PUT /api/layout/edit-categories` - Update categories
- `PUT /api/layout/edit-testimonials` - Update testimonials
- `PUT /api/layout/edit-why-trust-us` - Update why trust us
- `PUT /api/layout/edit-newsletter` - Update newsletter
- `PUT /api/layout/edit-knowledge-guarantee` - Update knowledge guarantee
- `PUT /api/layout/edit-faq` - Update FAQ

## 🎨 Component Structure

Each admin component follows this pattern:

1. **Data Fetching**: Uses RTK Query to fetch current data
2. **Form Management**: Controlled inputs with validation
3. **Image Upload**: Cloudinary integration for image management
4. **Live Preview**: Real-time preview of changes
5. **Save Functionality**: Mutation to update data
6. **Error Handling**: Proper error states and user feedback

## 🔒 Security

- All admin routes are protected with `AdminProtected` HOC
- API endpoints require authentication
- Proper validation on both frontend and backend
- Image upload security with Cloudinary

## 🚀 Next Steps

1. **Test the System**: Visit each admin page and test the functionality
2. **Customize Content**: Update the default content to match your brand
3. **Add More Sections**: Extend the system to include additional landing page sections
4. **Performance Optimization**: Consider caching strategies for better performance
5. **Analytics**: Add tracking for content changes and user interactions

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**: Ensure MongoDB is running and connection string is correct
2. **Image Upload**: Check Cloudinary configuration in environment variables
3. **Authentication**: Ensure you're logged in as an admin user
4. **CORS Issues**: Check server CORS configuration

### Reset Data

To reset the layout data:

```bash
# Connect to MongoDB and delete the layout collection
# Then run the initialization script again
npm run init-layout
```

## 📝 Notes

- All components include fallback content if API calls fail
- The system is designed to be extensible for future components
- Image uploads are handled through Cloudinary for optimal performance
- The admin interface follows the existing design patterns for consistency
