// Sales Agent System Types - Based on README specifications

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp?: string;
}

// Business Data Types (matching README schema)
export interface BusinessData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  website?: string;
  category?: string;
  rating?: number;
  source?: string;
  session_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BusinessLead extends BusinessData {
  _id?: string;
  confidence_score?: number;
  industry?: string;
  business_type?: string;
  additional_info?: Record<string, any>;
}

export interface Session {
  _id?: string;
  session_id: string;
  created_at: string;
  leads_count: number;
  insert_count: number;
  upsert_count: number;
  status: string;
  workflow_duration: number;
}

export interface LeadSearchRequest {
  city: string;
  business_type?: string;
  max_results?: number;
  search_radius?: number;
  session_id?: string;
}

export interface LeadSearchResponse {
  success: boolean;
  leads_found: number;
  session_id: string;
  search_summary: {
    city: string;
    business_type: string;
    search_radius: number;
    total_found: number;
  };
  leads: BusinessLead[];
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

export interface MainAgentWorkflowRequest {
  city: string;
  business_type: string;
  max_results: number;
  search_radius: number;
}

export interface MainAgentWorkflowResponse {
  session_id: string;
  success: boolean;
  leads_count: number;
  sdr_results: SDRResult[];
  workflow_duration: number;
  status: string;
}

export interface SDRResult {
  success: boolean;
  business_name: string;
  research_completed: boolean;
  proposal_generated: boolean;
  phone_call_made: boolean;
  email_sent: boolean;
  conversation_classification: string;
  business_data: BusinessLead;
}

export interface SDRWorkflowRequest {
  business_data: BusinessLead;
}

export interface SDRWorkflowResponse {
  success: boolean;
  business_name: string;
  research_completed: boolean;
  proposal_generated: boolean;
  phone_call_made: boolean;
  email_sent: boolean;
  conversation_classification: string;
  results: {
    research?: string;
    proposal?: string;
    call?: {
      made: boolean;
      duration?: number;
      outcome?: string;
    };
    email?: {
      sent: boolean;
      subject?: string;
      delivered?: boolean;
    };
  };
}

export interface AgentStatus {
  success: boolean;
  agents: {
    email_sender: { status: string; description?: string };
    sdr_main: { status: string; description?: string };
    research: { status: string; description?: string };
    proposal: { status: string; description?: string };
    calling: { status: string; description?: string };
  };
  environment: {
    gmail_configured: boolean;
    cerebras_configured: boolean;
    mongodb_configured: boolean;
  };
}

// Database Schema Types (matching README)
export interface BusinessLeadDocument {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  website?: string;
  category: string;
  rating?: number;
  source: string;
  session_id: string;
  created_at: string;
  updated_at: string;
}

export interface SessionDocument {
  _id: string;
  session_id: string;
  created_at: string;
  leads_count: number;
  insert_count: number;
  upsert_count: number;
  status: string;
  workflow_duration: number;
}

// Health Check Types
export interface HealthResponse {
  status: string;
  message: string;
  version: string;
}