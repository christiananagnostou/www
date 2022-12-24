export interface Project {
  title: string;
  desktopImgs: string[];
  mobileImgs: string[];
  externalLink?: string;
  github?: string;
  slug: string;
  summary: string;
  details: { title: string; description: string }[];
}
