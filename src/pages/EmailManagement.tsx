import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { apiService } from '../services/api';
import type { EmailRequest } from '../types';
import { Mail, Loader2, CheckCircle2, XCircle, Send } from 'lucide-react';

export function EmailManagement() {
  const [formData, setFormData] = useState<EmailRequest>({
    to_email: '',
    subject: '',
    body: '',
    is_html: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.to_email || !formData.subject || !formData.body) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await apiService.sendEmail(formData);
      if (result.success) {
        setSuccess(`Email sent successfully to ${result.to_email}`);
        // Reset form
        setFormData({
          to_email: '',
          subject: '',
          body: '',
          is_html: false,
        });
      } else {
        setError(result.message || 'Failed to send email');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Email Management</h1>
        <p className="text-gray-500 mt-1">Send emails to leads and prospects</p>
      </div>

      {/* Email Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Compose Email</span>
          </CardTitle>
          <CardDescription>Send a professional email to your leads</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* To Email */}
            <div className="space-y-2">
              <label htmlFor="to_email" className="text-sm font-medium text-gray-700">
                Recipient Email *
              </label>
              <Input
                id="to_email"
                name="to_email"
                type="email"
                placeholder="recipient@example.com"
                value={formData.to_email}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                Subject *
              </label>
              <Input
                id="subject"
                name="subject"
                type="text"
                placeholder="Your email subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Body */}
            <div className="space-y-2">
              <label htmlFor="body" className="text-sm font-medium text-gray-700">
                Email Body *
              </label>
              <textarea
                id="body"
                name="body"
                rows={10}
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Write your email message here..."
                value={formData.body}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* HTML Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                id="is_html"
                name="is_html"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={formData.is_html}
                onChange={handleInputChange}
              />
              <label htmlFor="is_html" className="text-sm text-gray-700">
                Send as HTML email
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading} className="min-w-32">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Email
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Success Message */}
      {success && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-green-800">
              <CheckCircle2 className="h-5 w-5" />
              <span>{success}</span>
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Templates</CardTitle>
          <CardDescription>Use these templates to get started quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() =>
                setFormData(prev => ({
                  ...prev,
                  subject: 'Introduction to Our Services',
                  body: `Hello,

I hope this email finds you well. I wanted to reach out and introduce our company and the services we offer.

We specialize in helping businesses like yours achieve their goals through innovative solutions.

Would you be interested in scheduling a brief call to discuss how we might be able to help you?

Best regards,
Your Name`,
                }))
              }
              className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-semibold text-gray-900">Introduction Template</h4>
              <p className="text-sm text-gray-500 mt-1">Basic introduction to your services</p>
            </button>

            <button
              type="button"
              onClick={() =>
                setFormData(prev => ({
                  ...prev,
                  subject: 'Follow-up: Our Previous Conversation',
                  body: `Hi,

I wanted to follow up on our previous conversation regarding [topic].

I believe we have a solution that could really benefit your business.

Are you available for a quick call this week?

Best,
Your Name`,
                }))
              }
              className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-semibold text-gray-900">Follow-up Template</h4>
              <p className="text-sm text-gray-500 mt-1">Follow up on previous interactions</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
