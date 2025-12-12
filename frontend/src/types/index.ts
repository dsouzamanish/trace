// User and Auth Types
export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePic?: string;
  designation?: string;
  team?: string;
  isManager: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Team Member Types
export type Designation = 'Engineer' | 'Sr. Engineer' | 'Tech Lead' | 'QA' | 'Manager' | 'Other';
export type MemberStatus = 'Active' | 'Inactive';

export interface TeamMember {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  slackId?: string;
  profilePic?: string;
  designation?: Designation;
  team?: string;
  isManager?: boolean;
  joinedDate?: string;
  status?: MemberStatus;
}

// Blocker Types
export type BlockerCategory = 'Process' | 'Technical' | 'Dependency' | 'Infrastructure' | 'Other';
export type BlockerSeverity = 'Low' | 'Medium' | 'High';
export type BlockerStatus = 'Open' | 'Resolved' | 'Ignored';

export interface Blocker {
  uid: string;
  teamMember: string | TeamMember;
  description: string;
  category: BlockerCategory;
  severity: BlockerSeverity;
  timestamp: string;
  status: BlockerStatus;
  reportedVia: string;
  managerNotes?: string;
  slackMessageId?: string;
  attachments?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BlockerStats {
  total: number;
  byCategory: Record<BlockerCategory, number>;
  bySeverity: Record<BlockerSeverity, number>;
  byStatus: Record<BlockerStatus, number>;
  weeklyTrend: Array<{ week: string; count: number }>;
}

export interface BlockersState {
  blockers: Blocker[];
  stats: BlockerStats | null;
  isLoading: boolean;
  error: string | null;
  total: number;
}

// AI Report Types
export type ReportType = 'individual' | 'team';
export type ReportPeriod = 'weekly' | 'monthly';

export interface ActionItem {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AiReport {
  uid: string;
  reportType: ReportType;
  targetMember?: string;
  targetTeam?: string;
  reportPeriod: ReportPeriod;
  summary: string;
  actionItems: ActionItem[];
  insights: string[];
  generatedAt: string;
}

export interface AiReportsState {
  reports: AiReport[];
  currentReport: AiReport | null;
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

