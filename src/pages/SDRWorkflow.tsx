import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { apiService } from '../services/api';
import type { BusinessData, WorkflowResults } from '../types';
import { Workflow, Loader2, CheckCircle2, XCircle, Play, FileText, Phone, Mail } from 'lucide-react';

export function SDRWorkflow() {
  const [formData, setFormData] = useState<BusinessData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    business_type: '',
    industry: '',
    website: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<WorkflowResults | null>(null);
  const [workflowStatus, setWorkflowStatus] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      setError('Business name and email are required');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setWorkflowStatus('running');

    try {
      const result = await apiService.executeWorkflow(formData);
      setResults(result.results);
      setWorkflowStatus(result.workflow_status);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Workflow execution failed');
      setWorkflowStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SDR Workflow</h1>
        <p className="text-gray-500 mt-1">Execute complete sales development workflow</p>
      </div>

      {/* Workflow Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Steps</CardTitle>
          <CardDescription>The complete SDR workflow includes:</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900">1. Research</h3>
              <p className="text-sm text-gray-500 mt-1">Business analysis</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900">2. Proposal</h3>
              <p className="text-sm text-gray-500 mt-1">Create pitch</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900">3. Call</h3>
              <p className="text-sm text-gray-500 mt-1">Make contact</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="bg-orange-100 text-orange-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900">4. Email</h3>
              <p className="text-sm text-gray-500 mt-1">Send follow-up</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Information Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Workflow className="h-5 w-5" />
            <span>Business Information</span>
          </CardTitle>
          <CardDescription>Enter the business details to start the workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Business Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="ABC Corporation"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="contact@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1-555-0123"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="website" className="text-sm font-medium text-gray-700">
                  Website
                </label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="industry" className="text-sm font-medium text-gray-700">
                  Industry
                </label>
                <Input
                  id="industry"
                  name="industry"
                  type="text"
                  placeholder="Technology"
                  value={formData.industry}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="business_type" className="text-sm font-medium text-gray-700">
                  Business Type
                </label>
                <Input
                  id="business_type"
                  name="business_type"
                  type="text"
                  placeholder="Software Company"
                  value={formData.business_type}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Address
                </label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="123 Main St, City, State"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-2">
                {workflowStatus && (
                  <Badge
                    variant={
                      workflowStatus === 'completed'
                        ? 'success'
                        : workflowStatus === 'failed'
                        ? 'destructive'
                        : 'default'
                    }
                  >
                    {workflowStatus === 'completed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {workflowStatus === 'failed' && <XCircle className="h-3 w-3 mr-1" />}
                    {workflowStatus}
                  </Badge>
                )}
              </div>

              <Button type="submit" disabled={loading} className="min-w-40">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Workflow...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Workflow
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
            <div className="flex items-center space-x-2 text-red-800">
              <XCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Research Results */}
          {results.research && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>Research Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm">
                    {results.research}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Proposal */}
          {results.proposal && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span>Generated Proposal</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm">
                    {results.proposal}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Call Results */}
          {results.call && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-purple-600" />
                  <span>Call Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm">
                    {JSON.stringify(results.call, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Classification */}
          {results.classification && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-600" />
                  <span>Classification</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm">
                    {results.classification}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Email Results */}
          {results.email && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span>Email Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm">
                    {JSON.stringify(results.email, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
