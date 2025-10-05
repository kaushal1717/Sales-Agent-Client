// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp?: string;
}

// Business Data Types
export interface BusinessData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  industry?: string;
  business_type?: string;
  website?: string;
  additional_info?: Record<string, any>;
}

export interface BusinessLead extends BusinessData {
  id?: string;
  confidence_score?: number;
  source?: string;
  created_at?: string;
  updated_at?: string;
}

// Lead Search Types
export interface LeadSearchRequest {
  location: string;
  business_type?: string;
  radius?: number;
  limit?: number;
}

export interface LeadSearchResponse {
  success: boolean;
  message: string;
  leads: BusinessLead[];
  total_found: number;
  search_params: LeadSearchRequest;
}

// Email Types
export interface EmailRequest {
  to_email: string;
  subject: string;
  body: string;
  is_html?: boolean;
}

export interface EmailAgentRequest {
  business_data: BusinessData;
  research_result: string;
  proposal: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  to_email: string;
  subject: string;
}

// Workflow Types
export type WorkflowStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface WorkflowResults {
  research?: string;
  proposal?: string;
  call?: any;
  classification?: string;
  email?: any;
}

export interface WorkflowExecutionResponse {
  success: boolean;
  message: string;
  business_data: BusinessData;
  results: WorkflowResults;
  workflow_status: WorkflowStatus;
}

export interface WorkflowAsyncResponse {
  success: boolean;
  message: string;
  task_id: string;
  status: string;
}

// Agent Status Types
export interface AgentInfo {
  status: string;
  type?: string;
  description?: string;
  sender_email?: string;
}

export interface AgentStatusResponse {
  success: boolean;
  agents: {
    email_sender: AgentInfo;
    sdr_main: AgentInfo;
    research: AgentInfo;
    proposal: AgentInfo;
    calling: AgentInfo;
  };
  environment: {
    gmail_configured: boolean;
    cerebras_configured: boolean;
    mongodb_configured: boolean;
  };
}

// Health Check Types
export interface HealthResponse {
  status: string;
  message: string;
  version: string;
}
