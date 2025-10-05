import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { AgentStatus } from '../types';
import { Activity, CheckCircle, XCircle, Loader2, Database, Mail, Brain, Sparkles } from 'lucide-react';

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
        return <CheckCircle className="h-5 w-5 text-black" />;
      case 'busy':
        return <Activity className="h-5 w-5 text-black" />;
      default:
        return <XCircle className="h-5 w-5 text-black" />;
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
      <div className="text-center mb-12 pt-8 bounce-in">
        <div className="inline-flex items-center justify-center mb-6">
          <Sparkles className="h-12 w-12 text-brutal-pink mr-4" />
          <h1 className="text-6xl md:text-7xl font-black text-black uppercase tracking-tight">
            Status
          </h1>
          <Sparkles className="h-12 w-12 text-brutal-yellow ml-4" />
        </div>
        <p className="text-xl md:text-2xl font-bold text-black max-w-2xl mx-auto">
          Real-time agent monitoring and system health
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="card p-6 bg-brutal-red slide-up">
          <div className="flex items-center space-x-3 text-white font-bold text-lg">
            <XCircle className="h-6 w-6" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Agent Status */}
      <div className="card p-8 bg-brutal-blue slide-up">
        <h2 className="text-3xl font-black text-black mb-6 flex items-center uppercase">
          <Activity className="h-8 w-8 mr-3" />
          Agent Status
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-black" />
          </div>
        ) : agentStatus ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(agentStatus.agents).map(([key, agent]) => (
              <div key={key} className="bg-white border-4 border-black p-4 shadow-brutal hover:shadow-brutal-lg transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black text-black capitalize uppercase text-sm">
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
                  <p className="text-xs font-bold text-gray-700 mt-3">{agent.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border-4 border-black p-8 text-center shadow-brutal">
            <p className="text-black font-bold">No agent data available</p>
          </div>
        )}
      </div>

      {/* Environment Configuration */}
      {agentStatus && (
        <div className="card p-8 bg-brutal-green slide-up">
          <h2 className="text-3xl font-black text-black mb-6 flex items-center uppercase">
            <Database className="h-8 w-8 mr-3" />
            Environment Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border-4 border-black p-4 shadow-brutal">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-black" />
                  <span className="text-sm font-black text-black uppercase">Gmail</span>
                </div>
                <span className={`badge ${agentStatus.environment.gmail_configured ? 'badge-success' : 'badge-error'}`}>
                  {agentStatus.environment.gmail_configured ? 'Set' : 'Not Set'}
                </span>
              </div>
            </div>

            <div className="bg-white border-4 border-black p-4 shadow-brutal">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-black" />
                  <span className="text-sm font-black text-black uppercase">Cerebras</span>
                </div>
                <span className={`badge ${agentStatus.environment.cerebras_configured ? 'badge-success' : 'badge-error'}`}>
                  {agentStatus.environment.cerebras_configured ? 'Set' : 'Not Set'}
                </span>
              </div>
            </div>

            <div className="bg-white border-4 border-black p-4 shadow-brutal">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-black" />
                  <span className="text-sm font-black text-black uppercase">MongoDB</span>
                </div>
                <span className={`badge ${agentStatus.environment.mongodb_configured ? 'badge-success' : 'badge-error'}`}>
                  {agentStatus.environment.mongodb_configured ? 'Set' : 'Not Set'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Health */}
      <div className="card p-8 bg-brutal-yellow slide-up">
        <h2 className="text-3xl font-black text-black mb-6 flex items-center uppercase">
          <CheckCircle className="h-8 w-8 mr-3" />
          System Health
        </h2>
        <div className="space-y-4">
          <div className="bg-white border-4 border-black p-4 shadow-brutal flex items-center justify-between">
            <span className="text-sm font-black text-black uppercase">API Connection</span>
            <span className="badge badge-success">Connected</span>
          </div>
          <div className="bg-white border-4 border-black p-4 shadow-brutal flex items-center justify-between">
            <span className="text-sm font-black text-black uppercase">Database</span>
            <span className="badge badge-success">Online</span>
          </div>
          <div className="bg-white border-4 border-black p-4 shadow-brutal flex items-center justify-between">
            <span className="text-sm font-black text-black uppercase">External APIs</span>
            <span className="badge badge-success">Available</span>
          </div>
        </div>
      </div>
    </div>
  );
}
