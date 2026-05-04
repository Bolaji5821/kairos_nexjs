// User and Profile Types
export interface Skill {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  pageNo: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
}

export interface SkillsResponse {
  message: string;
  data: Skill[];
  pagination: Pagination;
  state: string;
  status: number;
}

export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dob: string;
  bio: string | null;
  gender: string | null;
  phone: string | null;
  location: [number, number];
  userLocation?: {
    country: string;
    state: string;
  };
  address: string | null;
  interests: string[];
  jobTitles: string[];
  employmentType: string | null;
  experienceLevel: string | null;
  jobRole: string | null;
  universityEmail: string | null;
  universityAttended: string | null;
  companyName: string | null;
  companySize: string | null;
  companyWebsite: string | null;
  companyCAC: string | null;
  industry: string | null;
  profilePicture: string | null;
  resume: string | null;
  certificate: string | null;
  certifications: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  nin: string | null;
  role: "STUDENT" | "COMPANY" | "ADMIN";
  opportunityCredit: number;
  opportunityHistory: any[];
  verificationReference: string;
  isMailVerified: boolean;
  isPhoneVerified: boolean;
  isKycDone: boolean;
  createdAt: string;
  updatedAt: string;
  profile: Profile;
  skillSet: Skill[];
  notificationPreferences: any[];
  companyName: string;
  industry: string;
  companySize: string | null;
  companyWebsite: string | null;
}

export interface UserResponse {
  message: string;
  data: User;
  state: "success" | "error";
  status: number;
}

// Generic API Response wrapper for reusability
export interface ApiResponse<T> {
  message: string;
  data: T;
  state: "success" | "error";
  status: number;
}

export interface JobsListResponse {
  message: string;
  data: IJobCard[];
  pagination: Pagination;
  state: "success" | "error";
  status: number;
}

// Job API Response Types
export interface IJobDetailsData {
  id: string;
  title: string;
  description: string;
  aiDescription: string[];
  aiOverview: string[];
  aiRequirements: string[];
  aiParsed: boolean;
  type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "FREELANCE" | "INTERNSHIP";
  locationType: "ONSITE" | "REMOTE" | "HYBRID";
  location: string;
  experienceLevel: string;
  yearsOfExperience: number | null;
  companyName: string;
  industry: string;
  companySize: string | null;
  companyWebsite: string | null;
  skills: string[];
  compensation: string | null;
  source: "LINKEDIN" | "INDEED" | "MANUAL" | string;
  sourceId: string;
  opportunityUrl: string | null;
  userId: string;
  profilePicture?: string;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  isFeatured: boolean;
  applicationOpenDate: string | null;
  applicationCloseDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IJobDetails {
  data: IJobDetailsData;
  isApplied?: boolean;
  isBookmarked?: boolean;
  recommendations?: any[];
}

export interface JobDetailsResponse {
  data: IJobDetails;
  message: string;
  state: "success" | "error";
  status: number;
}

export interface AdminJobDetailsResponse {
  data: IJobDetailsData;
  message: string;
  state: "success" | "error";
  status: number;
}

export interface IBookmarkedJob {
  id: string;
  opportunityId: string;
  userId: string;
  createdAt: string;
  opportunity: {
    id: string;
    title: string;
    type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "FREELANCE" | "INTERNSHIP";
    locationType: "ONSITE" | "REMOTE" | "HYBRID";
    location: string;
    companyName: string;
    compensation: string | null;
    source: "LINKEDIN" | "INDEED" | "MANUAL" | string;
    opportunityUrl: string | null;
  };
}

export interface BookmarkResponse {
  message: string;
  data: IBookmarkedJob[];
  pagination: Pagination;
  state: "success" | "error";
  status: number;
}

export interface JobTitlesResponse {
  message: string;
  data: { id: string; title: string }[];
  pagination?: Pagination;
  state: "success" | "error";
  status: number;
}

export interface IsBookmarkedResponse {
  message: string;
  data: boolean;
  state: "success" | "error";
  status: number;
}

// Job Card Interface (for list views)
export interface IJobCard {
  id: string;
  title: string;
  type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "FREELANCE" | "INTERNSHIP";
  locationType: "ONSITE" | "REMOTE" | "HYBRID";
  location: string;
  companyName: string;
  compensation: string | null;
  source: "LINKEDIN" | "INDEED" | "MANUAL" | string;
  opportunityUrl: string | null;
  createdAt: string;
  updatedAt: string;
  profilePicture?: string;
  isFeatured?: boolean;
  status?: "PUBLISHED" | "DRAFT" | "ARCHIVED" | "CLOSED";
}

// Recruiter Job Card Interface (extends IJobCard with application data)
export interface IRecruiterJobCard extends IJobCard {
  applicants?: {
    userId: string;
  }[];
  strongMatches?: number;
}

// Applied Jobs Types (for user-applied endpoint)
export interface IAppliedJob {
  id: string;
  userId: string;
  opportunityId: string;
  createdAt: string;
  updatedAt: string;
  opportunity: IJobDetailsData;
}

export interface AppliedJobsResponse {
  message: string;
  data: IAppliedJob[];
  state: "success" | "error";
  status: number;
}

export interface RecruiterJobsListResponse {
  message: string;
  data: IRecruiterJobCard[];
  pagination: Pagination;
  state: "success" | "error";
  status: number;
}

// Job Applicants Types
export interface IJobApplicant {
  id: string;
  userId: string;
  opportunityId: string;
  createdAt: string;
  updatedAt: string;

  user: {
    email: string;
    isKycDone: boolean;
    skillSet: Skill[];
    profile: {
      firstName: string;
      lastName: string;
      bio: string | null;
      gender: string | null;
      phone: string | null;
      location: [number, number];
      address: string | null;
      jobTitles: string[];
      profilePicture: string | null;
    };
  };
}

export interface JobApplicantsResponse {
  message: string;
  data: {
    data: IJobApplicant[];
    opportunityDetails: {
      title: string;
      description: string;
      createdAt: string;
    };
  };
  state: "success" | "error";
  status: number;
}

// Talent Match Types
export interface ITalentMatch {
  id: string;
  isKycDone: boolean;
  skillSet: Array<{
    title: string;
  }>;
  profile: {
    firstName: string;
    lastName: string;
    profilePicture: string | null;
    jobTitles: string[];
  };
}

export interface TalentMatchResponse {
  message: string;
  data: ITalentMatch[];
  pagination: Pagination;
  state: "success" | "error";
  status: number;
}
// Competition Types
export interface Competition extends BaseCompetition {
  userId?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    isKycDone: boolean;
    profile: {
      firstName: string;
      lastName: string;
      companyName: string;
      profilePicture: string;
    };
  };
}

export interface CompetitionResponse {
  message: string;
  data: Competition[];
  pagination: Pagination;
  state: "success" | "error";
  status: number;
}

export interface SingleCompetitionResponse {
  message: string;
  data: {
    data: Competition;
    isApplied: boolean;
  };
  state: "success" | "error";
  status: number;
}

export interface OwnCompetitionResponse {
  message: string;
  data: Omit<Competition, "user"> & {
    applications: any[];
  };
  state: "success" | "error";
  status: number;
}

export interface School {
  id?: string;
  name: string;
  webSite?: string;
  country?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SchoolsResponse {
  message: string;
  data: School[];
  pagination?: Pagination;
  state: string;
  status: number;
}

// Base Competition without user info (for bookmarked competitions)
export interface BaseCompetition {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  coverImage: string;
  startsAt: string;
  endsAt: string;
  applicationDeadline: string;
  prize: string;
  prizeAmount: string | null;
  whatToSubmit: string;
  externalApplyLink: string;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED" | "CLOSED";
}

export interface IBookmarkedCompetition {
  id: string;
  competitionId: string;
  userId: string;
  createdAt: string;
  competition: BaseCompetition;
}

export interface BookmarkedCompetitionResponse {
  message: string;
  data: IBookmarkedCompetition[];
  pagination: Pagination;
  state: "success" | "error";
  status: number;
}

export interface IAppliedCompetition {
  id: string;
  competitionId: string;
  userId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  appliedAt: string;
  competition: {
    title: string;
    shortDescription: string;
    status: string;
    startsAt: string;
    endsAt: string;
  };
}

export interface AppliedCompetitionResponse {
  message: string;
  data: IAppliedCompetition[];
  pagination: Pagination;
  state: "success" | "error";
  status: number;
}

export interface ManageJobAlertProps {
  title?: string;
  description?: string;
  showTitle?: boolean;
  className?: string;
  initialKeyword?: string | null; 
  showOnlyAddForm?: boolean;
  onSuccess?: () => void;
}