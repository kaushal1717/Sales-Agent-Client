import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import type { BusinessLead } from "../types";
import {
  Database,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Globe,
  Loader2,
  Sparkles,
  List,
  ChevronLeft,
  ChevronRight,
  XCircle,
} from "lucide-react";

export function Sessions() {
  const [allLeads, setAllLeads] = useState<BusinessLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [withEmailOnly, setWithEmailOnly] = useState(false);
  const leadsPerPage = 10;

  useEffect(() => {
    loadAllLeads();
  }, []);

  useEffect(() => {
    loadAllLeads();
  }, [currentPage, withEmailOnly]);

  const loadAllLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAllLeads({
        limit: leadsPerPage,
        offset: currentPage * leadsPerPage,
        with_email_only: withEmailOnly,
      });
      console.log("API Response:", data);
      setAllLeads(data.leads || []);
      setTotalLeads(data.total || 0);
      setHasMore(data.has_more || false);
    } catch (err: any) {
      console.error("Failed to load all leads:", err);
      setError("Failed to load leads. Please try again.");
      setAllLeads([]);
      setTotalLeads(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleEmailFilterToggle = () => {
    setWithEmailOnly((prev) => !prev);
    setCurrentPage(0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='text-center mb-12 pt-8 bounce-in'>
        <div className='inline-flex items-center justify-center mb-6'>
          <Sparkles className='h-12 w-12 text-brutal-pink mr-4' />
          <h1 className='text-6xl md:text-7xl font-black text-black uppercase tracking-tight'>
            All Leads
          </h1>
          <Sparkles className='h-12 w-12 text-brutal-yellow ml-4' />
        </div>
        <p className='text-xl md:text-2xl font-bold text-black max-w-2xl mx-auto'>
          Browse and manage all your business leads in one place
        </p>
      </div>

      {/* All Leads Section */}
      <div className='card p-8 bg-brutal-yellow slide-up'>
        <div className='flex items-center justify-between mb-6 flex-wrap gap-4'>
          <h2 className='text-3xl font-black text-black flex items-center uppercase'>
            <List className='h-8 w-8 mr-3' />
            Leads Database
          </h2>
          <div className='flex items-center space-x-4'>
            <button
              onClick={handleEmailFilterToggle}
              className={`btn text-sm ${
                withEmailOnly
                  ? "btn-primary"
                  : "bg-white text-black hover:bg-brutal-beige"
              }`}
            >
              {withEmailOnly ? "Showing: With Email" : "Showing: All"}
            </button>
            <div className='bg-white border-4 border-black px-4 py-2 shadow-brutal'>
              <p className='text-sm font-black text-black'>
                Total: <span className='text-brutal-pink'>{totalLeads}</span>
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className='card p-6 bg-brutal-red mb-6'>
            <div className='flex items-center space-x-3 text-white font-bold text-lg'>
              <XCircle className='h-6 w-6' />
              <p>{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='h-12 w-12 animate-spin text-black' />
          </div>
        ) : allLeads.length > 0 ? (
          <>
            <div className='space-y-4 mb-6'>
              {allLeads.map((lead) => (
                <div
                  key={lead._id}
                  className='bg-white border-4 border-black p-6 shadow-brutal hover:shadow-brutal-lg transition-all'
                >
                  <div className='flex items-start justify-between gap-4'>
                    <div className='flex-1'>
                      <h3 className='text-2xl font-black text-black mb-4 uppercase'>
                        {lead.name}
                      </h3>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        {lead.email && (
                          <div className='flex items-center text-base font-bold text-black'>
                            <Mail className='h-5 w-5 mr-3 flex-shrink-0' />
                            <a
                              href={`mailto:${lead.email}`}
                              className='hover:text-brutal-pink transition-colors underline truncate'
                            >
                              {lead.email}
                            </a>
                          </div>
                        )}

                        {lead.phone && (
                          <div className='flex items-center text-base font-bold text-black'>
                            <Phone className='h-5 w-5 mr-3 flex-shrink-0' />
                            <a
                              href={`tel:${lead.phone}`}
                              className='hover:text-brutal-pink transition-colors underline'
                            >
                              {lead.phone}
                            </a>
                          </div>
                        )}

                        {lead.address && (
                          <div className='flex items-center text-base font-bold text-black md:col-span-2'>
                            <MapPin className='h-5 w-5 mr-3 flex-shrink-0' />
                            <span>{lead.address}</span>
                          </div>
                        )}

                        {lead.website && (
                          <div className='flex items-center text-base font-bold text-black md:col-span-2'>
                            <Globe className='h-5 w-5 mr-3 flex-shrink-0' />
                            <a
                              href={lead.website}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='hover:text-brutal-pink transition-colors underline break-all'
                            >
                              {lead.website}
                            </a>
                          </div>
                        )}

                        {lead.session_id && (
                          <div className='flex items-center text-xs font-bold text-gray-600 md:col-span-2'>
                            <Database className='h-4 w-4 mr-2 flex-shrink-0' />
                            <span className='truncate'>
                              Session: {lead.session_id}
                            </span>
                          </div>
                        )}

                        {lead.created_at && (
                          <div className='flex items-center text-xs font-bold text-gray-600 md:col-span-2'>
                            <Calendar className='h-4 w-4 mr-2 flex-shrink-0' />
                            <span>{formatDate(lead.created_at)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className='flex flex-col items-end space-y-3'>
                      <span className='badge badge-info px-4 py-2'>
                        {lead.category}
                      </span>
                      <span className='badge badge-success px-3 py-1'>
                        {lead.source}
                      </span>
                      {lead.rating && (
                        <span className='badge badge-warning px-3 py-1'>
                          ⭐ {lead.rating}
                        </span>
                      )}
                      {lead.lead_status && (
                        <span className='badge bg-brutal-purple text-white px-3 py-1'>
                          {lead.lead_status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className='flex items-center justify-between bg-white border-4 border-black p-4 shadow-brutal'>
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className={`btn flex items-center space-x-2 ${
                  currentPage === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-white text-black hover:bg-brutal-beige"
                }`}
              >
                <ChevronLeft className='h-5 w-5' />
                <span>Previous</span>
              </button>

              <div className='flex items-center space-x-4'>
                <span className='text-sm font-black text-black'>
                  Page {currentPage + 1}
                </span>
                <span className='text-sm font-bold text-gray-700'>
                  {totalLeads > 0 ? (
                    <>
                      Showing {currentPage * leadsPerPage + 1} -{" "}
                      {Math.min((currentPage + 1) * leadsPerPage, totalLeads)} of{" "}
                      {totalLeads}
                    </>
                  ) : (
                    <>Showing {allLeads.length} leads</>
                  )}
                </span>
              </div>

              <button
                onClick={handleNextPage}
                disabled={!hasMore}
                className={`btn flex items-center space-x-2 ${
                  !hasMore
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-white text-black hover:bg-brutal-beige"
                }`}
              >
                <span>Next</span>
                <ChevronRight className='h-5 w-5' />
              </button>
            </div>
          </>
        ) : (
          <div className='bg-white border-4 border-black p-8 text-center shadow-brutal'>
            <List className='h-12 w-12 mx-auto mb-4 text-black' />
            <p className='text-black font-bold'>No leads found</p>
          </div>
        )}
      </div>
    </div>
  );
}
