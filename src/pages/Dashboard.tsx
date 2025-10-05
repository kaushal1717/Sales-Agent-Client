import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { AgentStatus, Session } from '../types';
import { Database, Users, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function Dashboard() {
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [agentData, sessionsData] = await Promise.all([
        apiService.getAgentStatus(),
        apiService.getSessions()
      ]);
      setAgentStatus(agentData);
      setSessions(sessionsData);
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setError('Unable to connect to the backend service. Please ensure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Total Sessions',
      value: sessions.length,
      icon: Database,
      color: 'text-blue-600',
    },
    {
      title: 'Active Agents',
      value: agentStatus ? Object.values(agentStatus.agents).filter(a => a.status === 'available').length : 0,
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Total Leads',
      value: sessions.reduce((sum, s) => sum + s.leads_count, 0),
      icon: Database,
      color: 'text-purple-600',
    },
    {
      title: 'Success Rate',
      value: sessions.length > 0 ? `${Math.round((sessions.filter(s => s.status === 'completed').length / sessions.length) * 100)}%` : '0%',
      icon: CheckCircle,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="floating">
          <h1 className="text-4xl font-bold text-gray-100 mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
        </div>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Monitor your AI-powered sales automation workflow with real-time insights and analytics
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="card p-4 border-red-700 bg-red-900">
          <div className="flex items-center space-x-2 text-red-300">
            <XCircle className="h-5 w-5" />
            <div>
              <p className="font-semibold">Connection Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card gradient-border p-6 group hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-100 mt-2 group-hover:text-white transition-colors">
                    {loading ? (
                      <div className="h-8 w-20 bg-gradient-to-r from-gray-700 to-gray-600 rounded animate-pulse"></div>
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
                <div className={`p-4 rounded-xl ${stat.color} bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300`}>
                  <Icon className={`h-8 w-8 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Agent Status */}
      <div className="card gradient-border p-8">
        <h2 className="text-2xl font-semibold text-gray-100 mb-6 flex items-center">
          <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 pulse-glow"></div>
          Agent Status
        </h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-blue-600 opacity-20"></div>
            </div>
          </div>
        ) : agentStatus ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(agentStatus.agents).map(([key, agent]) => (
              <div key={key} className="glass-effect p-4 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    agent.status === 'available' ? 'bg-green-500 pulse-glow' : 'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-100 capitalize group-hover:text-white transition-colors">
                      {key.replace(/_/g, ' ')}
                    </p>
                    {agent.description && (
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{agent.description}</p>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <span className={`badge ${
                    agent.status === 'available' ? 'badge-success' : 'badge-info'
                  }`}>
                    {agent.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">No agent data available</p>
        )}
      </div>

      {/* Recent Sessions */}
      <div className="card gradient-border p-8">
        <h2 className="text-2xl font-semibold text-gray-100 mb-6 flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-3 pulse-glow"></div>
          Recent Sessions
        </h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-green-600" />
              <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-green-600 opacity-20"></div>
            </div>
          </div>
        ) : sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.slice(0, 5).map((session) => (
              <div key={session.session_id} className="glass-effect p-4 rounded-xl border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-100 group-hover:text-white transition-colors">{session.session_id}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-400 mt-2 group-hover:text-gray-300 transition-colors">
                      <span className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{session.leads_count} leads</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{Math.round(session.workflow_duration)}s</span>
                      </span>
                    </div>
                  </div>
                  <span className={`badge ${
                    session.status === 'completed' ? 'badge-success' : 'badge-warning'
                  }`}>
                    {session.status === 'completed' ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {session.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">No sessions found</p>
        )}
      </div>
    </div>
  );
}