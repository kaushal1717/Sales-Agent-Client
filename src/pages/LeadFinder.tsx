import React, { useState, useRef, useEffect } from 'react';
import { apiService } from '../services/api';
import type { LeadSearchRequest, LeadSearchResponse, MainWorkflowStreamRequest } from '../types';
import { Search, MapPin, Building2, Mail, Phone, Globe, Loader2, Database, Users, Clock, CheckCircle, XCircle } from 'lucide-react';

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
      <div className="text-center mb-12">
        <div className="floating">
          <h1 className="text-4xl font-bold text-gray-100 mb-4 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Lead Finder
          </h1>
        </div>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto">
          Start the complete AI-powered sales automation workflow with real-time streaming updates. 
          The system will automatically search for leads, trigger SDR agents to research, propose, call, and email.
        </p>
      </div>

      {/* Search Form */}
      <div className="card gradient-border p-8">
        <h2 className="text-2xl font-semibold text-gray-100 mb-4 flex items-center">
          <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 pulse-glow"></div>
          Search Parameters
        </h2>
        <p className="text-gray-400 mb-6 text-sm bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
          Once you submit this form, the system will start a real-time streaming workflow that automatically 
          searches for business leads and triggers the complete SDR automation pipeline with live progress updates.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                City *
              </label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-3 h-4 w-4 text-white z-10" />
                <input
                  type="text"
                  name="city"
                  placeholder="e.g., New York, San Francisco"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="input pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Business Type
              </label>
              <div className="relative flex items-center">
                <Building2 className="absolute left-3 h-4 w-4 text-white z-10" />
                <input
                  type="text"
                  name="business_type"
                  placeholder="e.g., restaurants, cafes, IT services"
                  value={formData.business_type}
                  onChange={handleInputChange}
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
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
              <label className="block text-sm font-medium text-gray-300 mb-1">
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
              className="btn btn-primary flex items-center space-x-2 px-6 py-3"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Running Workflow...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Start Workflow</span>
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
        <div className="card p-4 border-red-200 bg-red-50">
          <div className="flex items-center space-x-2 text-red-800">
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Session Info */}
      {results && (
        <div className="card p-6 bg-blue-50 border-blue-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
            <Database className="h-5 w-5 mr-2 text-blue-600" />
            Session Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-sm font-medium text-slate-900">Session ID</p>
                <p className="text-xs text-slate-500">{results.session_id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-sm font-medium text-slate-900">City</p>
                <p className="text-xs text-slate-500">{results.search_summary.city}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-sm font-medium text-slate-900">Leads Found</p>
                <p className="text-xs text-slate-500">{results.search_summary.total_found}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-sm font-medium text-slate-900">Search Radius</p>
                <p className="text-xs text-slate-500">{results.search_summary.search_radius}m</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Lead Discovery Results</h2>
          <p className="text-slate-600 mb-6">
            Found {results.leads.length} lead{results.leads.length !== 1 ? 's' : ''} with valid email addresses
          </p>
          
          {results.leads.length > 0 ? (
            <div className="space-y-4">
              {results.leads.map((lead, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900">{lead.name}</h3>
                      
                      <div className="mt-2 space-y-1">
                        {lead.email && (
                          <div className="flex items-center text-sm text-slate-600">
                            <Mail className="h-4 w-4 mr-2 text-slate-400" />
                            <a href={`mailto:${lead.email}`} className="hover:text-blue-600">
                              {lead.email}
                            </a>
                          </div>
                        )}
                        
                        {lead.phone && (
                          <div className="flex items-center text-sm text-slate-600">
                            <Phone className="h-4 w-4 mr-2 text-slate-400" />
                            <a href={`tel:${lead.phone}`} className="hover:text-blue-600">
                              {lead.phone}
                            </a>
                          </div>
                        )}
                        
                        {lead.address && (
                          <div className="flex items-center text-sm text-slate-600">
                            <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                            <span>{lead.address}</span>
                          </div>
                        )}
                        
                        {lead.website && (
                          <div className="flex items-center text-sm text-slate-600">
                            <Globe className="h-4 w-4 mr-2 text-slate-400" />
                            <a
                              href={lead.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-600"
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
              <Search className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p>No leads found with valid email addresses.</p>
              <p className="text-sm mt-2">Try adjusting your search criteria or expanding the search radius.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}