import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { apiService } from '../services/api';
import type { LeadSearchRequest, BusinessLead } from '../types';
import { Search, MapPin, Building2, Mail, Phone, Globe, Loader2 } from 'lucide-react';

export function LeadSearch() {
  const [formData, setFormData] = useState<LeadSearchRequest>({
    location: '',
    business_type: '',
    radius: 2000,
    limit: 20,
  });

  const [leads, setLeads] = useState<BusinessLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.location) {
      setError('Location is required');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const result = await apiService.searchLeads(formData);
      setLeads(result.leads || []);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to search leads');
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'radius' || name === 'limit' ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Lead Search</h1>
        <p className="text-gray-500 mt-1">Search for potential business leads in any location</p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search Parameters</span>
          </CardTitle>
          <CardDescription>Enter your search criteria to find leads</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location */}
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium text-gray-700">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="e.g., New York, Ahmedabad"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Business Type */}
              <div className="space-y-2">
                <label htmlFor="business_type" className="text-sm font-medium text-gray-700">
                  Business Type
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="business_type"
                    name="business_type"
                    type="text"
                    placeholder="e.g., restaurants, IT services"
                    value={formData.business_type}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Radius */}
              <div className="space-y-2">
                <label htmlFor="radius" className="text-sm font-medium text-gray-700">
                  Search Radius (meters)
                </label>
                <Input
                  id="radius"
                  name="radius"
                  type="number"
                  placeholder="2000"
                  value={formData.radius}
                  onChange={handleInputChange}
                  min="100"
                  max="50000"
                />
              </div>

              {/* Limit */}
              <div className="space-y-2">
                <label htmlFor="limit" className="text-sm font-medium text-gray-700">
                  Max Results
                </label>
                <Input
                  id="limit"
                  name="limit"
                  type="number"
                  placeholder="20"
                  value={formData.limit}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={loading} className="min-w-32">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Leads
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {searched && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>
              {loading ? 'Searching...' : `Found ${leads.length} lead${leads.length !== 1 ? 's' : ''}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : leads.length > 0 ? (
              <div className="space-y-4">
                {leads.map((lead, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>

                        <div className="mt-2 space-y-1">
                          {lead.email && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-4 w-4 mr-2 text-gray-400" />
                              <a href={`mailto:${lead.email}`} className="hover:text-blue-600">
                                {lead.email}
                              </a>
                            </div>
                          )}

                          {lead.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-2 text-gray-400" />
                              <a href={`tel:${lead.phone}`} className="hover:text-blue-600">
                                {lead.phone}
                              </a>
                            </div>
                          )}

                          {lead.address && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{lead.address}</span>
                            </div>
                          )}

                          {lead.website && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Globe className="h-4 w-4 mr-2 text-gray-400" />
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
                        {lead.confidence_score && (
                          <Badge variant={lead.confidence_score > 0.7 ? 'success' : 'secondary'}>
                            Score: {(lead.confidence_score * 100).toFixed(0)}%
                          </Badge>
                        )}

                        {lead.industry && (
                          <Badge variant="outline">{lead.industry}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No leads found. Try adjusting your search criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
