import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { apiService } from '../services/api';
import type { AgentStatusResponse } from '../types';
import { Activity, RefreshCw, Loader2, CheckCircle2, XCircle } from 'lucide-react';

export function AgentStatus() {
  const [agentStatus, setAgentStatus] = useState<AgentStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAgentStatus();
  }, []);

  const fetchAgentStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAgentStatus();
      setAgentStatus(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch agent status');
      console.error('Error fetching agent status:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agent Status</h1>
          <p className="text-gray-500 mt-1">Monitor the status of all agents</p>
        </div>
        <Button onClick={fetchAgentStatus} disabled={loading} variant="outline">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-800">
              <XCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>System Status</span>
          </CardTitle>
          <CardDescription>Overall system health and configuration</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : agentStatus ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">API Connection</p>
                  <p className="text-sm text-gray-500">Backend API status</p>
                </div>
                <Badge variant="success">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(agentStatus.environment).map(([key, value]) => (
                  <div key={key} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/_/g, ' ')}
                      </p>
                      <Badge variant={value ? 'success' : 'destructive'}>
                        {value ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Agent Details */}
      {agentStatus && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(agentStatus.agents).map(([key, agent]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="capitalize text-lg">
                  {key.replace(/_/g, ' ')} Agent
                </CardTitle>
                <CardDescription>
                  {agent.description || 'No description available'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Status</span>
                    <Badge variant={agent.status === 'available' ? 'success' : 'secondary'}>
                      {agent.status}
                    </Badge>
                  </div>

                  {agent.type && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Type</span>
                      <span className="text-sm text-gray-600">{agent.type}</span>
                    </div>
                  )}

                  {agent.sender_email && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Sender Email</span>
                      <span className="text-sm text-gray-600">{agent.sender_email}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Additional system details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">API Version</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">1.0.0</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Total Agents</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {agentStatus ? Object.keys(agentStatus.agents).length : 0}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">API Endpoint</p>
              <p className="text-sm text-gray-600 mt-1 font-mono break-all">
                {import.meta.env.VITE_API_URL || 'http://localhost:8000'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Last Updated</p>
              <p className="text-sm text-gray-600 mt-1">
                {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
