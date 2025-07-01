// /types/course.ts

export interface Link {
  id: string;
  title: string;
  url: string;
}

export interface VideoComponent {
  id: string;
  videoTitle: string;
  videoUrl: string;
  videoDescription: string;
  links: Link[];
}

export interface ContentSectionData {
  id: string;
  title: string;
  components: VideoComponent[];
}

export interface CourseFormData {
  ratings: number;
  purchased: number;
  _id?: string;
  name: string;
  description: string;
  price: string;
  estimatedPrice?: string;
  thumbnail: string | null | { public_id?: string; url?: string }; // Handle both client and server formats
  newThumbnail?: string | null | { public_id?: string; url?: string }; // For edit mode
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  courseContent: ContentSectionData[];
  courseData?: Array<{
    _id?: string;
    title?: string;
    videoSection?: string;
    videoUrl?: string;
    description?: string;
    links?: Array<{ _id?: string; title?: string; url?: string }>;
  }>;
}

export interface StepValidation {
  isCompleted: boolean;
  isSaved: boolean;
  errors: string[];
}

export interface CourseStepStatus {
  step0: StepValidation; // Course Information
  step1: StepValidation; // Course Benefits/Prerequisites
  step2: StepValidation; // Course Content
  step3: StepValidation; // Course Preview
}

export type TitleItem = { title: string };
