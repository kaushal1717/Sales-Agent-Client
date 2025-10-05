import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { Session, BusinessLead } from '../types';
import { Database, Clock, Users, CheckCircle, XCircle, Calendar, MapPin, Mail, Phone, Globe, Loader2, Sparkles } from 'lucide-react';

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
      <div className="text-center mb-12 pt-8 bounce-in">
        <div className="inline-flex items-center justify-center mb-6">
          <Sparkles className="h-12 w-12 text-brutal-pink mr-4" />
          <h1 className="text-6xl md:text-7xl font-black text-black uppercase tracking-tight">
            Sessions
          </h1>
          <Sparkles className="h-12 w-12 text-brutal-yellow ml-4" />
        </div>
        <p className="text-xl md:text-2xl font-bold text-black max-w-2xl mx-auto">
          Track workflow sessions and monitor lead processing
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

      {/* Sessions List */}
      <div className="card p-8 bg-brutal-beige slide-up">
        <h2 className="text-3xl font-black text-black mb-6 flex items-center uppercase">
          <Database className="h-8 w-8 mr-3" />
          Workflow Sessions
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-black" />
          </div>
        ) : sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.session_id}
                className={`p-6 border-4 border-black cursor-pointer transition-all shadow-brutal hover:shadow-brutal-lg ${
                  selectedSession?.session_id === session.session_id
                    ? 'bg-brutal-yellow'
                    : 'bg-white hover:bg-brutal-blue'
                }`}
                onClick={() => handleSessionSelect(session)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-3 flex-wrap">
                      <h3 className="font-black text-black uppercase text-sm truncate">{session.session_id}</h3>
                      <span className={`badge ${getStatusColor(session.status)} flex items-center space-x-1`}>
                        {session.status === 'completed' && <CheckCircle className="h-3 w-3" />}
                        {session.status === 'failed' && <XCircle className="h-3 w-3" />}
                        <span>{session.status}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm font-bold text-gray-700 flex-wrap gap-2">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-black" />
                        <span>{formatDate(session.created_at)}</span>
                      </span>
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
                  <div className="text-right text-sm font-black text-black">
                    <div>Insert: {session.insert_count}</div>
                    <div>Upsert: {session.upsert_count}</div>
                  </div>
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

      {/* Session Details */}
      {selectedSession && (
        <div className="card p-8 bg-brutal-blue slide-up">
          <h2 className="text-3xl font-black text-black mb-6 flex items-center uppercase">
            <Users className="h-8 w-8 mr-3" />
            Session Details
          </h2>
          <div className="bg-white border-4 border-black p-4 mb-6 shadow-brutal">
            <p className="font-black text-black text-sm uppercase">
              Session ID: <span className="font-bold text-gray-700">{selectedSession.session_id}</span>
            </p>
          </div>

          {leadsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-black" />
            </div>
          ) : sessionLeads.length > 0 ? (
            <div className="space-y-4">
              {sessionLeads.map((lead) => (
                <div
                  key={lead._id}
                  className="bg-white border-4 border-black p-6 shadow-brutal hover:shadow-brutal-lg transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-black mb-4 uppercase">{lead.name}</h3>

                      <div className="space-y-3">
                        {lead.email && (
                          <div className="flex items-center text-base font-bold text-black">
                            <Mail className="h-5 w-5 mr-3 flex-shrink-0" />
                            <a href={`mailto:${lead.email}`} className="hover:text-brutal-pink transition-colors underline">
                              {lead.email}
                            </a>
                          </div>
                        )}

                        {lead.phone && (
                          <div className="flex items-center text-base font-bold text-black">
                            <Phone className="h-5 w-5 mr-3 flex-shrink-0" />
                            <a href={`tel:${lead.phone}`} className="hover:text-brutal-pink transition-colors underline">
                              {lead.phone}
                            </a>
                          </div>
                        )}

                        {lead.address && (
                          <div className="flex items-center text-base font-bold text-black">
                            <MapPin className="h-5 w-5 mr-3 flex-shrink-0" />
                            <span>{lead.address}</span>
                          </div>
                        )}

                        {lead.website && (
                          <div className="flex items-center text-base font-bold text-black">
                            <Globe className="h-5 w-5 mr-3 flex-shrink-0" />
                            <a
                              href={lead.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-brutal-pink transition-colors underline break-all"
                            >
                              {lead.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-3">
                      <span className="badge badge-info px-4 py-2">{lead.category}</span>
                      <span className="badge badge-success px-3 py-1">{lead.source}</span>
                      {lead.rating && (
                        <span className="badge badge-warning px-3 py-1">⭐ {lead.rating}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border-4 border-black p-8 text-center shadow-brutal">
              <Users className="h-12 w-12 mx-auto mb-4 text-black" />
              <p className="text-black font-bold">No leads found for this session</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
