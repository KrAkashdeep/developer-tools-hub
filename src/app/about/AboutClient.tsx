'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { IconMail, IconUser, IconMessageCircle, IconSend, IconHeart, IconCode, IconBolt, IconShield } from '@tabler/icons-react';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function AboutClient() {
  const { trackForm, trackButton } = useAnalytics();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        // Track successful form submission
        trackForm('feedback_form', true);
      } else {
        throw new Error(result.error || 'Failed to send feedback');
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      setSubmitStatus('error');
      // Track failed form submission
      trackForm('feedback_form', false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            About multidevTools
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Your go-to platform for professional developer tools. Built with passion for developers, by developers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconCode className="h-6 w-6 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                multidevTools was created to provide developers with a comprehensive suite of tools that work 
                entirely in your browser. No installations, no sign-ups, no data collection - just pure functionality.
              </p>
              <p className="text-muted-foreground">
                We believe that developer tools should be fast, reliable, and accessible to everyone. 
                That's why all our tools process data locally, ensuring your privacy and security.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <IconBolt className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Lightning Fast</div>
                    <div className="text-sm text-muted-foreground">Instant processing</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <IconShield className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">100% Private</div>
                    <div className="text-sm text-muted-foreground">Local processing</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconHeart className="h-6 w-6 text-primary" />
                By the Numbers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">80+</div>
                  <div className="text-sm text-muted-foreground">Developer Tools</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">9</div>
                  <div className="text-sm text-muted-foreground">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">Free to Use</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">Data Collected</div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <h4 className="font-semibold">Tool Categories:</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Formatters', 'Validators', 'Encoders/Decoders', 'Converters',
                    'Color Tools', 'Text Utilities', 'File Tools', 'Code Tools', 'System Tools'
                  ].map((category) => (
                    <Badge key={category} variant="outline" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconMessageCircle className="h-6 w-6 text-primary" />
              Send Feedback
            </CardTitle>
            <CardDescription>
              Have suggestions, found a bug, or want to request a new tool? We'd love to hear from you!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <IconUser className="h-4 w-4" />
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <IconMail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="flex items-center gap-2">
                  <IconMessageCircle className="h-4 w-4" />
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your experience, suggestions for new tools, bug reports, or any other feedback..."
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
                  className="w-full flex items-center gap-2"
                  onClick={() => trackButton('send_feedback', 'about_page')}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <IconSend className="h-4 w-4" />
                      Send Feedback
                    </>
                  )}
                </Button>

                {submitStatus === 'success' && (
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg">
                    Feedback submitted successfully. Thank you for taking the time.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
                    ❌ Unable to send feedback at the moment. Please try again later.
                  </div>
                )}
              </div>
            </form>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">What kind of feedback are you looking for?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Bug reports:</strong> Found something that doesn't work as expected?</li>
                <li>• <strong>Feature requests:</strong> Need a tool that we don't have yet?</li>
                <li>• <strong>Improvements:</strong> Ideas to make existing tools better?</li>
                <li>• <strong>General feedback:</strong> How can we improve your experience?</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-12 p-6 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">
            <strong>Privacy Note:</strong> Your message is sent directly to our email. 
            We don't store your data and will only use your email to respond to your feedback.
          </p>
        </div>
      </div>
    </div>
  );
}