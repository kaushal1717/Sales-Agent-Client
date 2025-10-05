import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { Session, BusinessLead } from '../types';
import { Database, Clock, Users, CheckCircle, XCircle, Calendar, MapPin, Mail, Phone, Globe, Loader2 } from 'lucide-react';

export function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [sessionLeads, setSessionLeads] = useState<BusinessLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getSessions();
      setSessions(data);
    } catch (err: any) {
      console.error('Failed to load sessions:', err);
      setError('Failed to load sessions. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadSessionLeads = async (sessionId: string) => {
    try {
      setLeadsLoading(true);
      const data = await apiService.getSessionLeads(sessionId);
      setSessionLeads(data);
    } catch (err: any) {
      console.error('Failed to load session leads:', err);
    } finally {
      setLeadsLoading(false);
    }
  };

  const handleSessionSelect = (session: Session) => {
    setSelectedSession(session);
    loadSessionLeads(session.session_id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'failed':
        return 'badge-error';
      case 'running':
        return 'badge-warning';
      default:
        return 'badge-info';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Sessions</h1>
        <p className="text-gray-400 mt-1">Track workflow sessions and monitor lead processing</p>
      </div>

      {/* Sessions List */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
          <Database className="h-5 w-5 mr-2 text-blue-600" />
          Workflow Sessions
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
        ) : sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.session_id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedSession?.session_id === session.session_id
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
                onClick={() => handleSessionSelect(session)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-100">{session.session_id}</h3>
                      <span className={`badge ${getStatusColor(session.status)}`}>
                        {session.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {session.status === 'failed' && <XCircle className="h-3 w-3 mr-1" />}
                        {session.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(session.created_at)}</span>
                      </span>
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
                  <div className="text-right text-sm text-slate-500">
                    <div>Insert: {session.insert_count}</div>
                    <div>Upsert: {session.upsert_count}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <Database className="h-12 w-12 mx-auto mb-4 text-gray-500" />
            <p>No sessions found</p>
          </div>
        )}
      </div>

      {/* Session Details */}
      {selectedSession && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
            <Database className="h-5 w-5 mr-2 text-green-600" />
            Session Details: {selectedSession.session_id}
          </h2>
          
          {leadsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : sessionLeads.length > 0 ? (
            <div className="space-y-4">
              {sessionLeads.map((lead) => (
                <div
                  key={lead._id}
                  className="p-4 border border-gray-700 rounded-lg hover:border-green-500 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-100">{lead.name}</h3>
                      
                      <div className="mt-2 space-y-1">
                        {lead.email && (
                          <div className="flex items-center text-sm text-gray-400">
                            <Mail className="h-4 w-4 mr-2 text-gray-500" />
                            <a href={`mailto:${lead.email}`} className="hover:text-blue-400">
                              {lead.email}
                            </a>
                          </div>
                        )}
                        
                        {lead.phone && (
                          <div className="flex items-center text-sm text-gray-400">
                            <Phone className="h-4 w-4 mr-2 text-gray-500" />
                            <a href={`tel:${lead.phone}`} className="hover:text-blue-400">
                              {lead.phone}
                            </a>
                          </div>
                        )}
                        
                        {lead.address && (
                          <div className="flex items-center text-sm text-gray-400">
                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{lead.address}</span>
                          </div>
                        )}
                        
                        {lead.website && (
                          <div className="flex items-center text-sm text-gray-400">
                            <Globe className="h-4 w-4 mr-2 text-gray-500" />
                            <a
                              href={lead.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-400"
                            >
                              {lead.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <span className="badge badge-info">{lead.category}</span>
                      <span className="badge badge-info text-xs">{lead.source}</span>
                      {lead.rating && (
                        <span className="badge badge-info text-xs">⭐ {lead.rating}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p>No leads found for this session</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}