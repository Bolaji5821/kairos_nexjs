import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { Code, Palette, Headset, Brain, FileText, Users, Briefcase, Database, Layout, BarChart, Settings, Search, Megaphone, Video, UserCheck } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7700/api/v1";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
console.log({API_BASE_URL})
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  pay: string;
  featured?: boolean;
  urgent?: boolean;
  verified?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  type: string;
  postedAt: string;
  description: string;
}

export interface Category {
  id: string;
  title: string;
  desc: string;
  tag: string;
  count: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const categories: Category[] = [
  { id: "1", title: "Marketing & Growth", desc: "Scale your reach with experts in social media, content, and paid ads.", tag: "Marketing", count: "390+ Experts", icon: Megaphone },
  { id: "2", title: "Graphic Design", desc: "Senior designers specialized in branding, SaaS UI/UX, and complex workflows.", tag: "Design", count: "420+ Experts", icon: Palette },
  { id: "3", title: "Video Editing", desc: "Professional editors for high-impact social content and brand storytelling.", tag: "Creative", count: "215+ Experts", icon: Video },
  { id: "4", title: "Web Development", desc: "Expert React, Node, and Full-stack developers for your core product.", tag: "Development", count: "850+ Experts", icon: Code },
  { id: "5", title: "Virtual Assistance", desc: "Efficient operational support to manage growth and executive tasks.", tag: "Operations", count: "310+ Experts", icon: UserCheck },
  { id: "6", title: "Backend Engineering", desc: "Robust Node.js, Python, and Go developers for scalable systems.", tag: "Development", count: "620+ Experts", icon: Database },
  { id: "7", title: "Data Science", desc: "AI and Machine Learning experts to drive your data-led decisions.", tag: "Science", count: "250+ Experts", icon: Brain },
  { id: "8", title: "Product Management", desc: "Strategic product leaders to guide your roadmap and execution.", tag: "Management", count: "280+ Experts", icon: Briefcase },
  { id: "9", title: "Legal & Compliance", desc: "Specialized legal talent for cross-border operations and SaaS.", tag: "Legal", count: "120+ Experts", icon: FileText },
  { id: "10", title: "Human Resources", desc: "People operations and talent acquisition experts.", tag: "HR", count: "210+ Experts", icon: Users },
  { id: "11", title: "DevOps & Infrastructure", desc: "Cloud infrastructure and CI/CD automation specialists.", tag: "Infrastructure", count: "340+ Experts", icon: Settings },
  { id: "12", title: "Sales & Account Management", desc: "Results-driven sales professionals for global markets.", tag: "Sales", count: "450+ Experts", icon: Search },
];

export const jobs: Job[] = [
  { 
    id: "j1",
    title: "Senior Marketing Manager", 
    company: "GrowthFlow US", 
    location: "Remote", 
    pay: "$3.0k-$4.5k/month", 
    featured: true, 
    icon: Megaphone,
    category: "Marketing",
    type: "Full-time",
    postedAt: "2 hours ago",
    description: "Lead our performance marketing efforts for the US market..."
  },
  { 
    id: "j2",
    title: "Creative Video Editor", 
    company: "Vivid Content", 
    location: "Remote", 
    pay: "$2.5k-$3.5k/month", 
    urgent: true, 
    icon: Video,
    category: "Creative",
    type: "Full-time",
    postedAt: "1 day ago",
    description: "Join our fast-paced creative team to produce viral video content..."
  },
  { 
    id: "j3",
    title: "Full Stack Engineer", 
    company: "Kairos Partner Role", 
    location: "Remote", 
    pay: "$4.0k-$5.5k/month", 
    verified: true, 
    icon: Code,
    category: "Development",
    type: "Contract",
    postedAt: "3 days ago",
    description: "Join a high-growth startup as a lead frontend engineer..."
  },
  { 
    id: "j4",
    title: "Executive Virtual Assistant", 
    company: "Nexus Partners", 
    location: "U.S. Hours", 
    pay: "$1.5k-$2.5k/month", 
    icon: UserCheck,
    category: "Operations",
    type: "Full-time",
    postedAt: "5 hours ago",
    description: "Provide high-level support to US-based executives..."
  },
  { 
    id: "j5",
    title: "Product Designer", 
    company: "SaaS Growth Co.", 
    location: "Remote", 
    pay: "$2.8k-$4.1k/month", 
    icon: Palette,
    category: "Design",
    type: "Full-time",
    postedAt: "4 days ago",
    description: "We are looking for a Product Designer to join our growing team..."
  },
  { 
    id: "j6",
    title: "Backend Developer (Node.js)", 
    company: "FinTech Solutions", 
    location: "Remote (EMEA)", 
    pay: "$4.0k-$6.0k/month", 
    icon: Database,
    category: "Development",
    type: "Full-time",
    postedAt: "1 week ago",
    description: "Help build the future of cross-border payments in Africa..."
  },
];

export async function getCategories() {
  await new Promise(resolve => setTimeout(resolve, 500));
  return categories;
}

export async function getJobs() {
  await new Promise(resolve => setTimeout(resolve, 500));
  return jobs;
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
}

export type UserRole = "STUDENT" | "COMPANY" | "ADMIN" | "SUPERADMIN";

export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
  otp: string;
  companyName?: string;
  dob?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  reference?: string;
  user?: {
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
  };
}

export async function generateOTP(email: string): Promise<ApiResponse<void>> {
  const response = await apiClient.get(`/default/generate-otp`, {
    params: {
      destination: "email",
      identity: email,
      len: 6,
    },
  });
  return response.data;
}

export async function checkEmailExists(email: string): Promise<{ exists: boolean }> {
  const response = await apiClient.get(`/auth/check-email-exist`, {
    params: { email },
  });
  return response.data;
}

export async function registerUser(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
  const response = await apiClient.post(`/auth/register`, data);
  return response.data;
}

export async function loginUser(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
  const response = await apiClient.post(`/auth/login`, data);
  return response.data;
}

export interface PublicJob {
  id: string;
  slug?: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  locationType: string;
  type: string;
  experienceLevel: string;
  compensation?: string;
  skills: string[];
  createdAt: string;
  applicationCloseDate?: string;
}

export interface PublicTalent {
  id: string;
  firstName: string;
  lastName: string;
  bio?: string;
  skills: string[];
  jobTitles: string[];
  experienceLevel: string;
  employmentType: string;
  jobRole: string;
  location?: string;
  profilePicture?: string;
}

export interface PaginatedResponse<T> {
  message: string;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface GetPublicJobsParams {
  search?: string;
  locationType?: string;
  jobType?: string;
  experienceLevel?: string;
  skills?: string;
  page?: number;
  limit?: number;
}

export interface GetPublicTalentsParams {
  search?: string;
  skills?: string;
  jobTitles?: string;
  experienceLevel?: string;
  locationPreference?: string;
  jobTypePreference?: string;
  page?: number;
  limit?: number;
}

export async function getPublicJobs(params?: GetPublicJobsParams): Promise<PaginatedResponse<PublicJob>> {
  const response = await apiClient.get(`/default/public-jobs`, { params });
  return response.data;
}

export async function getPublicTalents(params?: GetPublicTalentsParams): Promise<PaginatedResponse<PublicTalent>> {
  const response = await apiClient.get(`/default/public-talents`, { params });
  return response.data;
}

export async function getTalentById(talentId: string): Promise<ApiResponse<PublicTalent>> {
  const response = await apiClient.get(`/default/public-talents/${talentId}`);
  return response.data;
}

export async function forgotPassword(email: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post(`/auth/forgot-password`, { email });
  return response.data;
}

export async function resetPassword(data: { email: string; otp: string; password: string }): Promise<ApiResponse<AuthResponse>> {
  const response = await apiClient.post(`/auth/reset-password`, data);
  return response.data;
}

export interface JobRequest {
  title: string;
  compensation?: string;
  type?: string;
  locationType?: string;
  experienceLevel?: string;
  yearsOfExperience?: string;
  location?: string;
  description: string;
  opportunityUrl?: string;
  companyName?: string;
  industry?: string;
  companySize?: string;
  companyWebsite?: string;
  skills?: string[];
  applicationOpenDate?: string;
  applicationCloseDate?: string;
  status?: "DRAFT" | "PUBLISHED";
  id?: string;
}

export interface RecruiterJob {
  id: string;
  title: string;
  compensation?: string;
  type?: string;
  locationType?: string;
  experienceLevel?: string;
  yearsOfExperience?: string;
  location?: string;
  description: string;
  opportunityUrl?: string;
  companyName?: string;
  industry?: string;
  companySize?: string;
  companyWebsite?: string;
  skills?: string[];
  applicationOpenDate?: string;
  applicationCloseDate?: string;
  status: "DRAFT" | "PUBLISHED";
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplicants: number;
  talentMatches: number;
}

export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  const response = await apiClient.get(`/default/dashboard-stats`);
  return response.data;
}

export async function getRecruiterJobs(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<RecruiterJob>> {
  const response = await apiClient.get(`/default/recruiter-jobs`, { params });
  return response.data;
}

export async function postJob(data: JobRequest): Promise<ApiResponse<{ jobId: string }>> {
  const response = await apiClient.post(`/opportunity`, data);
  return response.data;
}

export async function updateJob(data: JobRequest): Promise<ApiResponse<void>> {
  const response = await apiClient.patch(`/opportunity/update`, data);
  return response.data;
}

export async function getPublicJobBySlug(slug: string): Promise<ApiResponse<PublicJob>> {
  const response = await apiClient.get(`/opportunity/public/${slug}`);
  return response.data;
}

export async function getJobById(jobId: string): Promise<ApiResponse<RecruiterJob>> {
  const response = await apiClient.get(`/opportunity/user-get/${jobId}`);
  return response.data;
}
