import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { AgentStatus, Session } from '../types';
import { Database, Users, Clock, CheckCircle, XCircle, Loader2, Activity, Sparkles } from 'lucide-react';

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
      bgColor: 'bg-brutal-blue',
    },
    {
      title: 'Active Agents',
      value: agentStatus ? Object.values(agentStatus.agents).filter(a => a.status === 'available').length : 0,
      icon: Users,
      bgColor: 'bg-brutal-green',
    },
    {
      title: 'Total Leads',
      value: sessions.reduce((sum, s) => sum + s.leads_count, 0),
      icon: Activity,
      bgColor: 'bg-brutal-pink',
    },
    {
      title: 'Success Rate',
      value: sessions.length > 0 ? `${Math.round((sessions.filter(s => s.status === 'completed').length / sessions.length) * 100)}%` : '0%',
      icon: CheckCircle,
      bgColor: 'bg-brutal-yellow',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12 pt-8 bounce-in">
        <div className="inline-flex items-center justify-center mb-6">
          <Sparkles className="h-12 w-12 text-brutal-pink mr-4" />
          <h1 className="text-6xl md:text-7xl font-black text-black uppercase tracking-tight">
            Dashboard
          </h1>
          <Sparkles className="h-12 w-12 text-brutal-yellow ml-4" />
        </div>
        <p className="text-xl md:text-2xl font-bold text-black max-w-2xl mx-auto">
          Monitor your AI-powered sales automation workflow
        </p>
        <p className="text-lg font-semibold text-gray-700 max-w-2xl mx-auto mt-2">
          Real-time insights and analytics at your fingertips
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="card p-6 bg-brutal-red slide-up">
          <div className="flex items-center space-x-3 text-white font-bold text-lg">
            <XCircle className="h-6 w-6" />
            <div>
              <p className="font-black uppercase">Connection Error</p>
              <p className="text-sm font-semibold">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 slide-up">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`card p-6 ${stat.bgColor}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-black uppercase tracking-wide">{stat.title}</p>
                  <p className="text-4xl font-black text-black mt-2">
                    {loading ? (
                      <div className="h-10 w-20 bg-black animate-pulse"></div>
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
                <div className="p-4 bg-black border-4 border-black">
                  <Icon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Agent Status */}
      <div className="card p-8 bg-brutal-yellow slide-up">
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
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 border-4 border-black ${
                    agent.status === 'available' ? 'bg-brutal-green' : 'bg-gray-400'
                  }`} />
                  <div className="flex-1">
                    <p className="font-black text-black capitalize uppercase text-sm">
                      {key.replace(/_/g, ' ')}
                    </p>
                    {agent.description && (
                      <p className="text-xs font-bold text-gray-700 mt-1">{agent.description}</p>
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
          <div className="bg-white border-4 border-black p-8 text-center shadow-brutal">
            <p className="text-black font-bold">No agent data available</p>
          </div>
        )}
      </div>

      {/* Recent Sessions */}
      <div className="card p-8 bg-brutal-pink slide-up">
        <h2 className="text-3xl font-black text-black mb-6 flex items-center uppercase">
          <Database className="h-8 w-8 mr-3" />
          Recent Sessions
        </h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-black" />
          </div>
        ) : sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.slice(0, 5).map((session) => (
              <div key={session.session_id} className="bg-white border-4 border-black p-4 shadow-brutal hover:shadow-brutal-lg transition-all">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-black uppercase text-sm truncate">{session.session_id}</p>
                    <div className="flex items-center space-x-6 text-sm font-bold text-gray-700 mt-2">
                      <span className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-black" />
                        <span>{session.leads_count} leads</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-black" />
                        <span>{Math.round(session.workflow_duration)}s</span>
                      </span>
                    </div>
                  </div>
                  <span className={`badge ${
                    session.status === 'completed' ? 'badge-success' : 'badge-warning'
                  } flex items-center space-x-1`}>
                    {session.status === 'completed' ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    <span>{session.status}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border-4 border-black p-8 text-center shadow-brutal">
            <Database className="h-12 w-12 mx-auto mb-4 text-black" />
            <p className="text-black font-bold">No sessions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
