export const USER_ROLES = {
  Student: "STUDENT",
  Company: "COMPANY",
  Admin: "ADMIN",
};

export const currencyOptions = [
  { value: "₦", label: "NGN" },
  { value: "$", label: "USD" },
  { value: "€", label: "EUR" },
  { value: "£", label: "GBP" },
];

export const durationOptions = [
  { value: "per hour", label: "per hour" },
  { value: "per day", label: "per day" },
  { value: "per week", label: "per week" },
  { value: "per month", label: "per month" },
  { value: "per year", label: "per year" },
  { value: "one-time", label: "one-time" },
];

export const industryOptions = [
  { label: "Accounting" },
  { label: "Advertising" },
  { label: "Automotive" },
  { label: "Banking" },
  { label: "Construction" },
  { label: "Consulting" },
  { label: "Consumer Goods" },
  { label: "Education" },
  { label: "Engineering" },
  { label: "Entertainment" },
  { label: "Environmental Services" },
  { label: "Financial Services" },
  { label: "Food and Beverages" },
  { label: "Government Administration" },
  { label: "Healthcare" },
  { label: "Hospitality" },
  { label: "Human Resources" },
  { label: "Information Technology and Services" },
  { label: "Insurance" },
  { label: "Legal Services" },
  { label: "Logistics and Supply Chain" },
  { label: "Manufacturing" },
  { label: "Marketing and Advertising" },
  { label: "Media and Broadcasting" },
  { label: "Non-profit Organization Management" },
  { label: "Pharmaceuticals" },
  { label: "Real Estate" },
  { label: "Retail" },
  { label: "Telecommunications" },
  { label: "Transportation and Logistics" },
];

export const companySizeOptions = [
  { value: "1-19", label: "Small (1–19 employees)" },
  { value: "20-100", label: "Medium (20–100 employees)" },
  { value: "101-500", label: "Large (101–500 employees)" },
  { value: "501-1000", label: "Very Large (501–1,000 employees)" },
  { value: "1001+", label: "Enterprise (1,001+ employees)" },
];

export const jobRoleOptions = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "CONTRACT", label: "Contract" },
  { value: "FREELANCE", label: "Freelance" },
];

export const experienceLevelOptions = [
  { value: "JUNIOR", label: "Junior" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "SENIOR", label: "Senior" },
];

export const employmentTypeOptions = [
  { value: "HYBRID", label: "Hybrid" },
  { value: "REMOTE", label: "Remote" },
  { value: "ONSITE", label: "Onsite" },
];

export const datePostedOptions = [
  { value: "today", label: "Today" },
  { value: "this_week", label: "This Week" },
  { value: "this_month", label: "This Month" },
];

export const competitionTypeOptions = [
  { value: "design", label: "Design" },
  { value: "coding", label: "Coding" },
  { value: "case-study", label: "Case Study" },
  { value: "data-science", label: "Data Science" },
  { value: "web-development", label: "Web Development" },
  { value: "mobile-development", label: "Mobile Development" },
  { value: "ai-ml", label: "AI/Machine Learning" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "blockchain", label: "Blockchain" },
  { value: "product-management", label: "Product Management" },
  { value: "marketing", label: "Marketing" },
  { value: "business-strategy", label: "Business Strategy" },
  { value: "innovation", label: "Innovation Challenge" },
  { value: "sustainability", label: "Sustainability" },
  { value: "fintech", label: "FinTech" },
];

export const entryEligibilityOptions = [
  { value: "open-to-all", label: "Open to All" },
  { value: "students-only", label: "Students Only" },
  { value: "professionals-only", label: "Professionals Only" },
  { value: "by-invitation", label: "By Invitation Only" },
  { value: "university-specific", label: "Specific University/Institution" },
  { value: "age-restricted", label: "Age Restricted" },
  { value: "experience-level", label: "Specific Experience Level" },
  { value: "geographic-restriction", label: "Geographic Restriction" },
  { value: "team-only", label: "Team Participation Only" },
  { value: "individual-only", label: "Individual Participation Only" },
  { value: "company-employees", label: "Company Employees Only" },
  { value: "freelancers", label: "Freelancers Only" },
];

export const rewardTypeOptions = [
  { value: "cash-prize", label: "Cash Prize" },
  { value: "scholarship", label: "Scholarship" },
  { value: "internship", label: "Internship Opportunity" },
  { value: "job-offer", label: "Job Offer" },
  { value: "mentorship", label: "Mentorship Program" },
  { value: "certificate", label: "Certificate/Award" },
  { value: "trophy", label: "Trophy/Medal" },
  { value: "tech-gadgets", label: "Tech Gadgets" },
  { value: "software-license", label: "Software License" },
  { value: "course-access", label: "Free Course Access" },
  { value: "conference-ticket", label: "Conference Tickets" },
  { value: "recognition", label: "Public Recognition" },
  { value: "startup-funding", label: "Startup Funding" },
  { value: "incubator-access", label: "Incubator/Accelerator Access" },
  { value: "networking", label: "Networking Opportunities" },
];

export const submissionFormatOptions = [
  { value: "pdf-document", label: "PDF Document" },
  { value: "prototype-link", label: "Prototype Link" },
  { value: "code-repository", label: "Code Repository" },
  { value: "pitch-deck", label: "Pitch Deck" },
  { value: "video-demo", label: "Video Demo" },
  { value: "live-demo", label: "Live Demo/Presentation" },
  { value: "design-files", label: "Design Files (Figma, Sketch, etc.)" },
  { value: "web-application", label: "Web Application" },
  { value: "mobile-app", label: "Mobile Application" },
  { value: "research-paper", label: "Research Paper" },
  { value: "business-plan", label: "Business Plan" },
  { value: "case-study", label: "Case Study Report" },
  { value: "source-code", label: "Source Code Files" },
  { value: "executable-file", label: "Executable File" },
  { value: "docker-container", label: "Docker Container" },
  { value: "api-documentation", label: "API Documentation" },
  { value: "dataset", label: "Dataset/Data Analysis" },
  { value: "3d-model", label: "3D Model" },
  { value: "portfolio", label: "Portfolio/Gallery" },
  { value: "written-proposal", label: "Written Proposal" },
  { value: "slides-presentation", label: "Slides Presentation" },
  { value: "infographic", label: "Infographic" },
  { value: "whitepaper", label: "Whitepaper" },
  { value: "mockup", label: "Mockup/Wireframe" },
  { value: "multiple-formats", label: "Multiple Submission Formats" },
];

export const mockJobs = [
  {
    id: "1",
    title: "UI UX Designer Intern",
    lastUpdated: "10 secs ago",
    totalApplications: 100,
    strongMatches: 5,
  },
  {
    id: "2",
    title: "Frontend Developer Intern",
    lastUpdated: "2 mins ago",
    totalApplications: 87,
    strongMatches: 7,
  },
  {
    id: "3",
    title: "Product Manager Intern",
    lastUpdated: "5 mins ago",
    totalApplications: 120,
    strongMatches: 10,
  },
  {
    id: "4",
    title: "Graphic Design Intern",
    lastUpdated: "1 min ago",
    totalApplications: 54,
    strongMatches: 3,
  },
  {
    id: "5",
    title: "Marketing Analyst Intern",
    lastUpdated: "3 mins ago",
    totalApplications: 76,
    strongMatches: 6,
  },
  {
    id: "6",
    title: "Software Engineer Intern",
    lastUpdated: "30 secs ago",
    totalApplications: 98,
    strongMatches: 9,
  },
];

export const mockApplicants = [
  {
    name: "Feyisiyunmi Akinyeye",
    company: "Danor Tech Limited",
    title:
      "Product Designer | UX Designer | Community Manager @ The HERdacity Network",
    availableFor: [
      "UX Designer",
      "Product Designer",
      "Community Building",
      "12+",
    ],
    avatarUrl: "/avatars/feyi.jpg",
    verified: true,
  },
  {
    name: "Aisha Bello",
    company: "Innovate Labs",
    title: "UX Researcher | Product Strategist",
    availableFor: ["UX Research", "Strategy", "Prototyping"],
    avatarUrl: "/avatars/aisha.jpg",
    verified: true,
  },
  {
    name: "Tunde Ojo",
    company: "CreativeCore",
    title: "UI Designer | Visual Storyteller",
    availableFor: ["UI Design", "Branding", "Illustration"],
    avatarUrl: "/avatars/tunde.jpg",
    verified: false,
  },
  {
    name: "Ngozi Okafor",
    company: "TechBridge",
    title: "Community Manager | UX Coach",
    availableFor: ["Community Building", "Mentorship", "UX Coaching"],
    avatarUrl: "/avatars/ngozi.jpg",
    verified: true,
  },
  {
    name: "Samuel Adeyemi",
    company: "PixelCraft",
    title: "Product Designer | UI/UX Enthusiast",
    availableFor: ["UI Design", "UX Writing", "Mobile Apps"],
    avatarUrl: "/avatars/samuel.jpg",
    verified: true,
  },
  {
    name: "Chioma Anozie",
    company: "Bold Studio",
    title: "Interaction Designer | Accessibility Advocate",
    availableFor: ["Accessibility", "Interaction Design", "Workshops"],
    avatarUrl: "/avatars/chioma.jpg",
    verified: false,
  },
  {
    name: "Ibrahim Musa",
    company: "Flow Digital",
    title: "UX Designer | No-Code Builder",
    availableFor: ["UX Design", "No-Code", "Webflow"],
    avatarUrl: "/avatars/ibrahim.jpg",
    verified: true,
  },
  {
    name: "Kemi Balogun",
    company: "NextGen Creatives",
    title: "Product Designer | DEI Consultant",
    availableFor: ["Design Thinking", "Product Design", "DEI"],
    avatarUrl: "/avatars/kemi.jpg",
    verified: false,
  },
];

export const recentJobs = [
  {
    companyName: "Tech Innovators Ltd",
    position:
      "Senior Software EngineerSenior Software EngineerSenior Software Engineer",
    salary: "$120k - 150k/yr",
    locationType: "On-site",
    hoursPerWeek: "40hrs/wk",
  },
  // Duplicate job for demo
  {
    companyName: "Tech Innovators Ltd",
    position: "Senior Software Engineer",
    salary: "$120k - 150k/yr",
    locationType: "On-site",
    hoursPerWeek: "40hrs/wk",
  },
];

export const competitions = [
  {
    title: "Wikipedi",
    price: "6.90",
    image: "/illustrations/auth.png",
  },
  {
    title: "Wikipedi",
    price: "6.90",
    image: "/illustrations/auth.png",
  },
  {
    title: "Wikipedi",
    price: "6.90",
    image: "/illustrations/auth.png",
  },
  {
    title: "Wikipedi",
    price: "6.90",
    image: "/illustrations/auth.png",
  },
  {
    title: "Wikipedi",
    price: "6.90",
    image: "/illustrations/auth.png",
  },
  {
    title: "Wikipedi",
    price: "6.90",
    image: "/illustrations/auth.png",
  },
];

export const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "transgender", label: "Transgender" },
  { value: "nonbinary", label: "Nonbinary" },
  { value: "agender", label: "Agender" },
  { value: "genderqueer", label: "Genderqueer" },
  { value: "genderfluid", label: "Genderfluid" },
  { value: "bigender", label: "Bigender" },
  { value: "cisgender", label: "Cisgender" },
  { value: "intersex", label: "Intersex" },
  { value: "gender_nonconforming", label: "Gender nonconforming" },
  { value: "other", label: "Other" },
];

export const JOB_TABS = {
  jobsByMe: {
    name: "Jobs posted by me",
    value: "jobs-posted-by-me",
  },
  otherJobs: {
    name: "Other Job listings",
    value: "other-job-listings",
  },
  all: {
    name: "All",
    value: "ALL",
  },
  published: {
    name: "Published",
    value: "PUBLISHED",
  },
  draft: {
    name: "Draft",
    value: "DRAFT",
  },
  archive: {
    name: "Archive",
    value: "ARCHIVE",
  },
  closed: {
    name: "Closed",
    value: "CLOSED",
  },
};
