import axios, { type AxiosInstance } from 'axios';
import type {
  HealthResponse,
  LeadSearchRequest,
  LeadSearchResponse,
  EmailRequest,
  EmailResponse,
  EmailAgentRequest,
  BusinessData,
  WorkflowExecutionResponse,
  WorkflowAsyncResponse,
  AgentStatusResponse,
} from '../types';

class APIService {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 300000, // 5 minutes for long-running operations
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
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
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Health Check
  async healthCheck(): Promise<HealthResponse> {
    const response = await this.client.get<HealthResponse>('/health');
    return response.data;
  }

  // Lead Management
  async searchLeads(request: LeadSearchRequest): Promise<LeadSearchResponse> {
    const response = await this.client.post<LeadSearchResponse>('/api/v1/leads/search', request);
    return response.data;
  }

  // Email Operations
  async sendEmail(request: EmailRequest): Promise<EmailResponse> {
    const response = await this.client.post<EmailResponse>('/api/v1/email/send', request);
    return response.data;
  }

  async sendEmailWithAgent(request: EmailAgentRequest): Promise<any> {
    const response = await this.client.post('/api/v1/email/send-agent', request);
    return response.data;
  }

  // Workflow Operations
  async executeWorkflow(businessData: BusinessData): Promise<WorkflowExecutionResponse> {
    const response = await this.client.post<WorkflowExecutionResponse>(
      '/api/v1/workflow/execute',
      businessData
    );
    return response.data;
  }

  async executeWorkflowAsync(businessData: BusinessData): Promise<WorkflowAsyncResponse> {
    const response = await this.client.post<WorkflowAsyncResponse>(
      '/api/v1/workflow/execute-async',
      businessData
    );
    return response.data;
  }

  // Agent Status
  async getAgentStatus(): Promise<AgentStatusResponse> {
    const response = await this.client.get<AgentStatusResponse>('/api/v1/agents/status');
    return response.data;
  }
}

export const apiService = new APIService();
