import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { apiService } from '../services/api';
import type { AgentStatusResponse } from '../types';
import { Activity, Mail, Phone, FileSearch, Brain, AlertCircle } from 'lucide-react';

export function Dashboard() {
  const [agentStatus, setAgentStatus] = useState<AgentStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAgentStatus();
  }, []);

  const fetchAgentStatus = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAgentStatus();
      setAgentStatus(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch agent status');
      console.error('Error fetching agent status:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Total Agents',
      value: agentStatus ? Object.keys(agentStatus.agents).length : 0,
      icon: Brain,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Email Agent',
      value: agentStatus?.agents.email_sender.status || 'Unknown',
      icon: Mail,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Calling Agent',
      value: agentStatus?.agents.calling.status || 'Unknown',
      icon: Phone,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Research Agent',
      value: agentStatus?.agents.research.status || 'Unknown',
      icon: FileSearch,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to Sales Agent AI System</p>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {loading ? '...' : stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Agent Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agents Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Agent Status</span>
            </CardTitle>
            <CardDescription>Current status of all agents</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : agentStatus ? (
              <div className="space-y-4">
                {Object.entries(agentStatus.agents).map(([key, agent]) => (
                  <div key={key} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {key.replace(/_/g, ' ')}
                      </p>
                      {agent.description && (
                        <p className="text-sm text-gray-500">{agent.description}</p>
                      )}
                    </div>
                    <Badge variant={agent.status === 'available' ? 'success' : 'secondary'}>
                      {agent.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Environment Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Configuration</CardTitle>
            <CardDescription>System configuration status</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : agentStatus ? (
              <div className="space-y-3">
                {Object.entries(agentStatus.environment).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <p className="text-gray-700 capitalize">{key.replace(/_/g, ' ')}</p>
                    <Badge variant={value ? 'success' : 'destructive'}>
                      {value ? 'Configured' : 'Not Configured'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/leads"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileSearch className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Search Leads</h3>
              <p className="text-sm text-gray-500 mt-1">Find new business opportunities</p>
            </a>
            <a
              href="/workflow"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Activity className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Run SDR Workflow</h3>
              <p className="text-sm text-gray-500 mt-1">Execute complete sales workflow</p>
            </a>
            <a
              href="/email"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Mail className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Send Email</h3>
              <p className="text-sm text-gray-500 mt-1">Send outreach emails to leads</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
