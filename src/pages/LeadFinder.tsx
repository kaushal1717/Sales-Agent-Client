import React, { useState, useRef, useEffect } from 'react';
import { apiService } from '../services/api';
import type { LeadSearchRequest, LeadSearchResponse, MainWorkflowStreamRequest } from '../types';
import { Search, MapPin, Building2, Mail, Phone, Globe, Loader2, Database, Users, Clock, Sparkles, CheckCircle, XCircle } from 'lucide-react';

export function LeadFinder() {
  const [formData, setFormData] = useState<LeadSearchRequest>({
    city: '',
    business_type: '',
    max_results: 3,
    search_radius: 5000,
  });

  const [results, setResults] = useState<LeadSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingStatus, setStreamingStatus] = useState<string>('');
  const [streamingProgress, setStreamingProgress] = useState<number>(0);
  const eventSourceRef = useRef<EventSource | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.city) {
      setError('City is required');
      return;
    }

    setLoading(true);
    setError(null);
    setStreamingStatus('Starting workflow...');
    setStreamingProgress(0);

    try {
      // Close any existing event source
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // Prepare the request payload for the streaming API
      const streamRequest: MainWorkflowStreamRequest = {
        city: formData.city,
        business_type: formData.business_type || 'restaurants',
        max_results: formData.max_results || 3,
        search_radius: formData.search_radius || 5000,
        enable_sdr: true,
      };

      // Start the streaming workflow
      const eventSource = await apiService.startMainWorkflowStream(streamRequest);
      eventSourceRef.current = eventSource;

      // Handle streaming events
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Streaming data:', data);
          
          // Update status based on the streaming data
          if (data.status) {
            setStreamingStatus(data.status);
          }
          
          if (data.progress !== undefined) {
            setStreamingProgress(data.progress);
          }
          
          // Handle completion
          if (data.completed) {
            setStreamingStatus('Workflow completed successfully!');
            setStreamingProgress(100);
            setLoading(false);
            eventSource.close();
            
            // If we have results, set them
            if (data.results) {
              setResults(data.results);
            }
          }
        } catch (parseError) {
          console.error('Error parsing streaming data:', parseError);
        }
      };

      eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
        setError('Connection lost. Please try again.');
        setLoading(false);
        setStreamingStatus('Connection error');
        eventSource.close();
      };

    } catch (err: any) {
      console.error('Lead finder failed:', err);
      setError('Failed to start workflow. Please check your connection and try again.');
      setLoading(false);
      setStreamingStatus('Failed to start');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'search_radius' || name === 'max_results' ? parseInt(value) || 0 : value,
    }));
  };

  // Cleanup function to close event source when component unmounts
  const cleanup = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12 pt-8 bounce-in">
        <div className="inline-flex items-center justify-center mb-6">
          <Sparkles className="h-12 w-12 text-brutal-pink mr-4" />
          <h1 className="text-6xl md:text-7xl font-black text-black uppercase tracking-tight">
            Lead Finder
          </h1>
          <Sparkles className="h-12 w-12 text-brutal-yellow ml-4" />
        </div>
        <p className="text-xl md:text-2xl font-bold text-black max-w-3xl mx-auto leading-relaxed">
          Start the complete sales automation workflow by searching for business leads.
        </p>
        <p className="text-lg font-semibold text-gray-700 max-w-3xl mx-auto mt-2">
          The system will automatically trigger SDR agents to research, propose, call, and email.
        </p>
      </div>

      {/* Search Form */}
      <div className="card p-8 bg-brutal-yellow slide-up">
        <h2 className="text-3xl font-black text-black mb-4 flex items-center uppercase">
          <Search className="h-8 w-8 mr-3" />
          Search Parameters
        </h2>
        <div className="bg-white border-4 border-black p-4 mb-6 shadow-brutal">
          <p className="text-black font-bold text-sm">
            ⚡ Once you submit this form, the Lead Finder will automatically trigger the SDR Agent
            to research businesses, generate proposals, make calls, and send outreach emails.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-black text-black mb-2 uppercase tracking-wide">
                City *
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black z-10" />
                <input
                  type="text"
                  name="city"
                  placeholder="e.g., New York, San Francisco"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="input pl-12"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-black mb-2 uppercase tracking-wide">
                Business Type
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black z-10" />
                <input
                  type="text"
                  name="business_type"
                  placeholder="e.g., restaurants, cafes, IT services"
                  value={formData.business_type}
                  onChange={handleInputChange}
                  className="input pl-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-black mb-2 uppercase tracking-wide">
                Search Radius (meters)
              </label>
              <input
                type="number"
                name="search_radius"
                placeholder="5000"
                value={formData.search_radius}
                onChange={handleInputChange}
                className="input"
                min="100"
                max="50000"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-black mb-2 uppercase tracking-wide">
                Max Results
              </label>
              <input
                type="number"
                name="max_results"
                placeholder="3"
                value={formData.max_results}
                onChange={handleInputChange}
                className="input"
                min="1"
                max="20"
              />
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center space-x-3 px-10 py-4 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="h-6 w-6" />
                  <span>Search Leads</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Streaming Progress */}
      {loading && (
        <div className="card gradient-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-100 flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 pulse-glow"></div>
              Workflow Progress
            </h3>
            <span className="text-sm text-gray-400">{streamingProgress}%</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${streamingProgress}%` }}
            ></div>
          </div>
          
          {/* Status Message */}
          <div className="flex items-center space-x-2 text-gray-300">
            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            <span className="text-sm">{streamingStatus}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="card p-6 bg-brutal-red slide-up">
          <div className="flex items-center space-x-3 text-white font-bold text-lg">
            <span>❌ {error}</span>
          </div>
        </div>
      )}

      {/* Session Info */}
      {results && (
        <div className="card p-8 bg-brutal-pink slide-up">
          <h2 className="text-3xl font-black text-black mb-6 flex items-center uppercase">
            <Database className="h-8 w-8 mr-3" />
            Session Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border-4 border-black p-4 shadow-brutal">
              <div className="flex items-start space-x-3">
                <Database className="h-6 w-6 text-black mt-1" />
                <div>
                  <p className="text-xs font-black text-black uppercase tracking-wide">Session ID</p>
                  <p className="text-sm font-bold text-gray-700 mt-1 break-all">{results.session_id}</p>
                </div>
              </div>
            </div>
            <div className="bg-white border-4 border-black p-4 shadow-brutal">
              <div className="flex items-start space-x-3">
                <MapPin className="h-6 w-6 text-black mt-1" />
                <div>
                  <p className="text-xs font-black text-black uppercase tracking-wide">City</p>
                  <p className="text-sm font-bold text-gray-700 mt-1">{results.search_summary.city}</p>
                </div>
              </div>
            </div>
            <div className="bg-white border-4 border-black p-4 shadow-brutal">
              <div className="flex items-start space-x-3">
                <Users className="h-6 w-6 text-black mt-1" />
                <div>
                  <p className="text-xs font-black text-black uppercase tracking-wide">Leads Found</p>
                  <p className="text-sm font-bold text-gray-700 mt-1">{results.search_summary.total_found}</p>
                </div>
              </div>
            </div>
            <div className="bg-white border-4 border-black p-4 shadow-brutal">
              <div className="flex items-start space-x-3">
                <Clock className="h-6 w-6 text-black mt-1" />
                <div>
                  <p className="text-xs font-black text-black uppercase tracking-wide">Search Radius</p>
                  <p className="text-sm font-bold text-gray-700 mt-1">{results.search_summary.search_radius}m</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="card p-8 bg-brutal-blue slide-up">
          <h2 className="text-3xl font-black text-black mb-4 flex items-center uppercase">
            <Sparkles className="h-8 w-8 mr-3" />
            Lead Discovery Results
          </h2>
          <p className="text-black font-bold text-xl mb-8">
            Found <span className="bg-black text-brutal-yellow px-3 py-1 border-4 border-black">{results.leads.length}</span> lead{results.leads.length !== 1 ? 's' : ''} with valid email addresses
          </p>

          {results.leads.length > 0 ? (
            <div className="space-y-6">
              {results.leads.map((lead, index) => (
                <div key={index} className="bg-white border-4 border-black p-6 shadow-brutal hover:shadow-brutal-lg transition-all">
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
            <div className="text-center py-16 bg-white border-4 border-black shadow-brutal">
              <Search className="h-20 w-20 mx-auto mb-6 text-black" />
              <p className="text-2xl font-black text-black uppercase mb-2">No leads found</p>
              <p className="text-lg font-bold text-gray-700">Try adjusting your search criteria or expanding the search radius.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
