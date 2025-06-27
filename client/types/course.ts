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
  _id?: string;
  name: string;
  description: string;
  price: number | string;
  estimatedPrice?: number | string;
  thumbnail: string | ArrayBuffer | null;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  courseContent: ContentSectionData[];
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
