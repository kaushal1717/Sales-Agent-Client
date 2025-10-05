import { useEffect, useState } from "react";
import { apiService } from "../services/api";
import type { AgentStatusResponse } from "../types";
import {
  Activity,
  Mail,
  Phone,
  FileSearch,
  Brain,
  AlertCircle,
} from "lucide-react";

export function Dashboard() {
  const [agentStatus, setAgentStatus] = useState<AgentStatusResponse | null>(
    null
  );
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
      setError(err.message || "Failed to fetch agent status");
      console.error("Error fetching agent status:", err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Total Agents",
      value: agentStatus ? Object.keys(agentStatus.agents).length : 0,
      icon: Brain,
      color: "text-primary-600",
      bgColor: "bg-primary-100",
    },
    {
      title: "Email Agent",
      value: agentStatus?.agents.email_sender.status || "Unknown",
      icon: Mail,
      color: "text-success-600",
      bgColor: "bg-success-100",
    },
    {
      title: "Calling Agent",
      value: agentStatus?.agents.calling.status || "Unknown",
      icon: Phone,
      color: "text-warning-600",
      bgColor: "bg-warning-100",
    },
    {
      title: "Research Agent",
      value: agentStatus?.agents.research.status || "Unknown",
      icon: FileSearch,
      color: "text-error-600",
      bgColor: "bg-error-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Sales Agent Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to your AI-powered sales automation system. Monitor agents,
            track performance, and manage your sales pipeline.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Connection Error
                </h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {loading ? (
                        <div className="h-8 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                      ) : (
                        stat.value
                      )}
                    </p>
                  </div>
                  <div
                    className={`${stat.bgColor} ${stat.color} p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                </div>
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Agent Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Agents Status */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Agent Status</h3>
                  <p className="text-blue-100 text-sm">
                    Real-time agent monitoring
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : agentStatus ? (
                <div className="space-y-4">
                  {Object.entries(agentStatus.agents).map(([key, agent]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            agent.status === "available"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        ></div>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {key.replace(/_/g, " ")}
                          </p>
                          {agent.description && (
                            <p className="text-sm text-gray-500">
                              {agent.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          agent.status === "available"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {agent.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <Activity className="h-12 w-12 mx-auto" />
                  </div>
                  <p className="text-gray-500">No agent data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Environment Configuration */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Environment Config</h3>
                  <p className="text-emerald-100 text-sm">
                    System configuration status
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : agentStatus ? (
                <div className="space-y-3">
                  {Object.entries(agentStatus.environment).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <p className="text-gray-700 capitalize font-medium">
                          {key.replace(/_/g, " ")}
                        </p>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            value
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {value ? "✓ Configured" : "✗ Not Configured"}
                        </span>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <Brain className="h-12 w-12 mx-auto" />
                  </div>
                  <p className="text-gray-500">
                    No configuration data available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FileSearch className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Quick Actions</h3>
                <p className="text-purple-100 text-sm">
                  Get started with common tasks
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a
                href="/leads"
                className="group relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-blue-200/50"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-blue-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 mb-4">
                    <FileSearch className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Search Leads</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Find new business opportunities and potential customers
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>

              <a
                href="/workflow"
                className="group relative bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-green-200/50"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-green-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 mb-4">
                    <Activity className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Run SDR Workflow
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Execute complete sales development workflow automation
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>

              <a
                href="/email"
                className="group relative bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-purple-200/50"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-purple-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 mb-4">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Send Email</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Send personalized outreach emails to your leads
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
