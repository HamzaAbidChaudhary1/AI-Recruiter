// User & Authentication Types
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'recruiter' | 'candidate'
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface AuthToken {
  token: string
  refreshToken?: string
  expiresIn: number
  user: User
}

// Candidate Types
export interface Candidate {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  resumeUrl?: string
  linkedinUrl?: string
  githubUrl?: string
  portfolioUrl?: string
  skills: string[]
  experience: number // years
  education: Education[]
  location: string
  preferredRoles: string[]
  salaryExpectation?: SalaryRange
  availability: 'immediate' | '2-weeks' | '1-month' | 'flexible'
  status: 'new' | 'screening' | 'assessment' | 'interview' | 'offer' | 'rejected' | 'hired'
  assessments: CandidateAssessment[]
  notes?: Note[]
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface Education {
  degree: string
  field: string
  institution: string
  startYear: number
  endYear?: number
  gpa?: number
}

export interface SalaryRange {
  min: number
  max: number
  currency: string
  period: 'hourly' | 'monthly' | 'yearly'
}

export interface CandidateAssessment {
  assessmentId: string
  status: 'pending' | 'in-progress' | 'completed' | 'expired'
  score?: number
  startedAt?: string
  completedAt?: string
  expiresAt: string
}

export interface Note {
  id: string
  authorId: string
  authorName: string
  content: string
  type: 'general' | 'interview' | 'technical' | 'cultural'
  createdAt: string
}

// Assessment Types
export interface Assessment {
  id: string
  title: string
  description?: string
  role: string
  department?: string
  level: 'junior' | 'mid' | 'senior' | 'lead' | 'principal'
  duration: number // minutes
  passingScore: number
  questions: Question[]
  instructions?: string
  requiredSkills: string[]
  optionalSkills?: string[]
  status: 'draft' | 'active' | 'archived'
  antiCheating: AntiCheatingConfig
  proctoring: ProctoringConfig
  createdBy: string
  createdAt: string
  updatedAt: string
  totalCandidates?: number
  averageScore?: number
  completionRate?: number
}

export interface Question {
  id: string
  type: 'multiple-choice' | 'multi-select' | 'true-false' | 'essay' | 'coding' | 'video' | 'audio' | 'file-upload'
  category?: string
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  description?: string
  points: number
  timeLimit?: number // seconds
  orderIndex: number
  required: boolean
  
  // Type-specific fields
  options?: QuestionOption[] // For MCQ, multi-select
  correctAnswer?: string | number | string[] // For MCQ, true-false
  codeTemplate?: string // For coding questions
  language?: string // For coding questions
  testCases?: TestCase[] // For coding questions
  maxLength?: number // For essay questions
  maxDuration?: number // For video/audio questions
  allowedFormats?: string[] // For file upload
  maxFileSize?: number // For file upload in MB
  
  rubric?: GradingRubric
  hints?: string[]
  resources?: Resource[]
}

export interface QuestionOption {
  id: string
  text: string
  isCorrect?: boolean
}

export interface TestCase {
  id: string
  input: string
  expectedOutput: string
  isHidden: boolean
  weight: number
}

export interface GradingRubric {
  criteria: RubricCriterion[]
  totalPoints: number
}

export interface RubricCriterion {
  name: string
  description: string
  points: number
  levels: RubricLevel[]
}

export interface RubricLevel {
  score: number
  description: string
}

export interface Resource {
  type: 'link' | 'document' | 'video'
  title: string
  url: string
}

export interface AntiCheatingConfig {
  enabled: boolean
  preventCopy: boolean
  preventPaste: boolean
  preventRightClick: boolean
  preventTabSwitch: boolean
  preventScreenshot: boolean
  enforceFullscreen: boolean
  detectDevTools: boolean
  maxTabSwitches?: number
  idleTimeout?: number // seconds
  shuffleQuestions: boolean
  shuffleOptions: boolean
}

export interface ProctoringConfig {
  enabled: boolean
  requireWebcam: boolean
  requireScreenShare: boolean
  recordVideo: boolean
  recordScreen: boolean
  recordAudio: boolean
  detectMultipleFaces: boolean
  detectNoFace: boolean
  detectPhoneUsage: boolean
  aiProctoring: boolean
  liveProctoringAvailable: boolean
}

// Assessment Submission Types
export interface AssessmentSubmission {
  id: string
  assessmentId: string
  candidateId: string
  token: string
  status: 'pending' | 'in-progress' | 'completed' | 'expired' | 'flagged'
  answers: Answer[]
  score?: number
  percentageScore?: number
  passed?: boolean
  feedback?: string
  
  startedAt?: string
  completedAt?: string
  submittedAt?: string
  duration?: number // seconds
  
  violations: Violation[]
  proctoringData?: ProctoringData
  
  ipAddress?: string
  userAgent?: string
  browserInfo?: BrowserInfo
  
  reviewedBy?: string
  reviewedAt?: string
  reviewNotes?: string
}

export interface Answer {
  questionId: string
  answer: any // Can be string, number, array, Blob, etc.
  timeSpent: number // seconds
  attempts: number
  flagged: boolean
  savedAt: string
}

export interface Violation {
  type: string
  timestamp: string
  description?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  screenshot?: string
}

export interface ProctoringData {
  videoRecordingUrl?: string
  screenRecordingUrl?: string
  audioRecordingUrl?: string
  snapshots: ProctoringSnapshot[]
  faceDetectionResults: FaceDetectionResult[]
  suspiciousActivities: SuspiciousActivity[]
}

export interface ProctoringSnapshot {
  timestamp: string
  imageUrl: string
  type: 'webcam' | 'screen'
}

export interface FaceDetectionResult {
  timestamp: string
  faceCount: number
  confidence: number
  alert?: string
}

export interface SuspiciousActivity {
  type: string
  timestamp: string
  confidence: number
  description: string
  evidence?: string
}

export interface BrowserInfo {
  name: string
  version: string
  platform: string
  screenResolution: string
  timezone: string
  language: string
}

// Analytics Types
export interface AnalyticsOverview {
  totalCandidates: number
  activeCandidates: number
  completedAssessments: number
  averageScore: number
  weeklyGrowth: number
  topPerformers: Candidate[]
  recentActivity: ActivityLog[]
}

export interface PipelineStage {
  name: string
  count: number
  percentage: number
  averageTimeInStage: number // days
  conversionRate: number
}

export interface ActivityLog {
  id: string
  type: 'candidate-added' | 'assessment-started' | 'assessment-completed' | 'candidate-moved' | 'note-added'
  message: string
  metadata?: Record<string, any>
  timestamp: string
  userId?: string
  userName?: string
}

// Report Types
export interface Report {
  id: string
  type: 'assessment' | 'candidate' | 'pipeline' | 'performance'
  title: string
  description?: string
  filters: ReportFilter[]
  data: any
  generatedAt: string
  generatedBy: string
  format: 'pdf' | 'excel' | 'csv' | 'json'
  downloadUrl?: string
}

export interface ReportFilter {
  field: string
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between' | 'in'
  value: any
}

// Real-time Event Types
export interface RealtimeEvent {
  type: string
  payload: any
  timestamp: string
  source?: string
}

export interface CandidateUpdateEvent extends RealtimeEvent {
  type: 'candidate-update'
  payload: {
    candidateId: string
    updates: Partial<Candidate>
  }
}

export interface AssessmentProgressEvent extends RealtimeEvent {
  type: 'assessment-progress'
  payload: {
    submissionId: string
    candidateId: string
    progress: number
    currentQuestion: number
    totalQuestions: number
  }
}

export interface ProctoringAlertEvent extends RealtimeEvent {
  type: 'proctoring-alert'
  payload: {
    submissionId: string
    candidateId: string
    alert: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    screenshot?: string
  }
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
  message?: string
}

export interface ApiError {
  code: string
  message: string
  details?: any
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Filter & Sort Types
export interface FilterOptions {
  search?: string
  status?: string[]
  role?: string[]
  skills?: string[]
  experience?: { min: number; max: number }
  score?: { min: number; max: number }
  dateRange?: { start: string; end: string }
  tags?: string[]
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

// Export all types
export * from './components'
export * from './utils'
