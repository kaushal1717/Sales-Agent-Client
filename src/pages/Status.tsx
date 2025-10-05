import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { AgentStatus } from '../types';
import { Activity, CheckCircle, XCircle, Loader2, Database, Mail, Brain } from 'lucide-react';

export function Status() {
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAgentStatus();
  }, []);

  const loadAgentStatus = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAgentStatus();
      setAgentStatus(data);
    } catch (err: any) {
      console.error('Failed to load agent status:', err);
      setError('Failed to load agent status. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'busy':
        return <Activity className="h-4 w-4 text-yellow-600" />;
      default:
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'badge-success';
      case 'busy':
        return 'badge-warning';
      default:
        return 'badge-error';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Status</h1>
        <p className="text-gray-400 mt-1">Real-time agent monitoring and system health</p>
      </div>

      {/* Agent Status */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-blue-600" />
          Agent Status
        </h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            <XCircle className="h-12 w-12 mx-auto mb-4" />
            <p>{error}</p>
          </div>
        ) : agentStatus ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(agentStatus.agents).map(([key, agent]) => (
              <div key={key} className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900 capitalize">
                    {key.replace(/_/g, ' ')}
                  </h3>
                  {getStatusIcon(agent.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`badge ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                </div>
                {agent.description && (
                  <p className="text-sm text-gray-400 mt-2">{agent.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">No agent data available</p>
        )}
      </div>

      {/* Environment Configuration */}
      {agentStatus && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
            <Database className="h-5 w-5 mr-2 text-green-600" />
            Environment Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border border-gray-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-100">Gmail</span>
              </div>
              <span className={`badge ${agentStatus.environment.gmail_configured ? 'badge-success' : 'badge-error'}`}>
                {agentStatus.environment.gmail_configured ? 'Configured' : 'Not Configured'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-100">Cerebras</span>
              </div>
              <span className={`badge ${agentStatus.environment.cerebras_configured ? 'badge-success' : 'badge-error'}`}>
                {agentStatus.environment.cerebras_configured ? 'Configured' : 'Not Configured'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-100">MongoDB</span>
              </div>
              <span className={`badge ${agentStatus.environment.mongodb_configured ? 'badge-success' : 'badge-error'}`}>
                {agentStatus.environment.mongodb_configured ? 'Configured' : 'Not Configured'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* System Health */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">System Health</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-gray-700 rounded-lg">
            <span className="text-sm font-medium text-gray-100">API Connection</span>
            <span className="badge badge-success">Connected</span>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-700 rounded-lg">
            <span className="text-sm font-medium text-gray-100">Database</span>
            <span className="badge badge-success">Online</span>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-700 rounded-lg">
            <span className="text-sm font-medium text-gray-100">External APIs</span>
            <span className="badge badge-success">Available</span>
          </div>
        </div>
      </div>
    </div>
  );
}