export interface Job {
  id: string;
  url: string;
  image?: string;
  title: string;
  location: string;
  companyLogo?: string;
  companyName: string;
  jobWebsite: string;
  jobPostDate: string;
  appliedState?: string | null;
  appliedDate?: string | null;
  savedState?: string | null;
  savedDate?: string | null;
  notes?: string | null;
}