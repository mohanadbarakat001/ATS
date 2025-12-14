export interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
  linkedin?: string;
  location?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  dates: string;
  bullets: string[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  certifications?: string[];
}

export interface AnalysisReport {
  matchScore: number;
  foundKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
}

export interface OptimizationResult {
  id: string;
  createdAt: number;
  originalResumeText: string;
  jobDescription: string;
  optimizedResume: ResumeData;
  coverLetter: string;
  linkedinSummary: string;
  analysis: AnalysisReport;
  targetRole: string;
}

export enum AppView {
  LANDING = 'LANDING',
  CHECKOUT = 'CHECKOUT',
  DASHBOARD = 'DASHBOARD',
  HISTORY = 'HISTORY'
}

export enum WizardStep {
  UPLOAD = 1,
  JOB_DETAILS = 2,
  CONFIG = 3,
  PROCESSING = 4,
  RESULTS = 5
}

export interface UserConfig {
  seniority: 'Intern' | 'Junior' | 'Mid' | 'Senior';
  tone: 'Professional' | 'Confident' | 'Direct';
  primaryNiche: string;
  subNiche: string;
}