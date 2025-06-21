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
export type TitleItem = { title: string };
