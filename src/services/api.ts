import axios, { type AxiosInstance } from "axios";
import type {
  HealthResponse,
  LeadSearchRequest,
  LeadSearchResponse,
  EmailRequest,
  EmailResponse,
  EmailAgentRequest,
  BusinessData,
  SDRWorkflowResponse,
  MainAgentWorkflowRequest,
  MainAgentWorkflowResponse,
  MainWorkflowStreamRequest,
  AgentStatus,
  Session,
  BusinessLeadDocument,
} from "../types";

class APIService {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || "";
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 300000, // 5 minutes for long-running operations
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(
          `API Request: ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Health Check
  async healthCheck(): Promise<HealthResponse> {
    try {
      const response = await this.client.get<HealthResponse>("/health");
      return response.data;
    } catch (error: any) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  }

  // Lead Finder Agent (matching README)
  async runLeadFinderWorkflow(
    request: LeadSearchRequest
  ): Promise<LeadSearchResponse> {
    try {
      const response = await this.client.post<LeadSearchResponse>(
        "/api/v1/leads/finder",
        request
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Lead finder workflow failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  // Main Workflow Stream (new endpoint from API docs)
  async startMainWorkflowStream(
    request: MainWorkflowStreamRequest
  ): Promise<EventSource> {
    try {
      // First, make a POST request to start the workflow
      const response = await this.client.post(
        "/api/v1/workflow/main-stream",
        request
      );

      
      console.log("response.data", response.data);
      // Get session ID from response
      const sessionId = response.data.session_id || response.data.id 

      // Create EventSource for streaming updates
      const streamUrl = `${this.baseURL}/api/v1/workflow/status/${sessionId}`;
      return new EventSource(streamUrl);
    } catch (error: any) {
      throw new Error(
        `Main workflow stream failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  // Email Operations (kept for potential future use)
  async sendEmail(request: EmailRequest): Promise<EmailResponse> {
    try {
      const response = await this.client.post<EmailResponse>(
        "/api/v1/email/send",
        request
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Email send failed: ${error.response?.data?.message || error.message}`
      );
    }
  }

  async sendEmailWithAgent(request: EmailAgentRequest): Promise<any> {
    try {
      const response = await this.client.post(
        "/api/v1/email/send-agent",
        request
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Email agent failed: ${error.response?.data?.message || error.message}`
      );
    }
  }

  // Main Agent Orchestrator (kept for potential future use)
  async runMainAgentWorkflow(
    request: MainAgentWorkflowRequest
  ): Promise<MainAgentWorkflowResponse> {
    try {
      const response = await this.client.post<MainAgentWorkflowResponse>(
        "/api/v1/main-agent/workflow",
        request
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Main agent workflow failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  // SDR Agent (kept for potential future use)
  async executeSDRWorkflow(
    businessData: BusinessData
  ): Promise<SDRWorkflowResponse> {
    try {
      const response = await this.client.post<SDRWorkflowResponse>(
        "/api/v1/sdr/workflow",
        businessData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `SDR workflow failed: ${error.response?.data?.message || error.message}`
      );
    }
  }

  // Session Management (matching README)
  async getSessions(): Promise<Session[]> {
    try {
      const response = await this.client.get<Session[]>("/api/v1/sessions");
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Failed to fetch sessions: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  async getSession(sessionId: string): Promise<Session> {
    try {
      const response = await this.client.get<Session>(
        `/api/v1/sessions/${sessionId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Failed to fetch session: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  async getSessionLeads(sessionId: string): Promise<BusinessLeadDocument[]> {
    try {
      const response = await this.client.get<BusinessLeadDocument[]>(
        `/api/v1/sessions/${sessionId}/leads`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Failed to fetch session leads: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  // Database Operations (matching README schema)
  async getBusinessLeads(): Promise<BusinessLeadDocument[]> {
    try {
      const response = await this.client.get<BusinessLeadDocument[]>(
        "/api/v1/database/business-leads"
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Failed to fetch business leads: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  async getBusinessLeadById(id: string): Promise<BusinessLeadDocument> {
    try {
      const response = await this.client.get<BusinessLeadDocument>(
        `/api/v1/database/business-leads/${id}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Failed to fetch business lead: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  // Agent Status
  async getAgentStatus(): Promise<AgentStatus> {
    try {
      const response = await this.client.get<AgentStatus>(
        "/api/v1/agents/status"
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Failed to fetch agent status: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  // Get All Leads with Pagination
  async getAllLeads(params?: {
    limit?: number;
    offset?: number;
    with_email_only?: boolean;
  }): Promise<{
    leads: BusinessLeadDocument[];
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  }> {
    try {
      const response = await this.client.get("/api/v1/leads/all", {
        params: {
          limit: params?.limit || 10,
          offset: params?.offset || 0,
          with_email_only: params?.with_email_only || false,
        },
      });

      // Transform the response to match expected format
      const data = response.data;
      return {
        leads: data.leads || [],
        total: data.pagination?.total || 0,
        limit: data.pagination?.limit || 10,
        offset: data.pagination?.offset || 0,
        has_more: data.pagination?.has_more || false,
      };
    } catch (error: any) {
      throw new Error(
        `Failed to fetch all leads: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }
}

export const apiService = new APIService();
