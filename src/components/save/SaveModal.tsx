import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveResource } from '@/lib/utils';
import { MetadataResponse, SocialMetadataResponse } from '@/types/metadata';
import { Loader2 } from 'lucide-react';
import { getSummaryGenerator } from '@/lib/ai';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SaveModal: React.FC<SaveModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    type: 'article',
    tags: '',
    thumbnail_url: '',
    summary: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const detectUrlType = (url: string): 'twitter' | 'instagram' | 'generic' => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('twitter.com') || urlObj.hostname.includes('x.com')) {
        return 'twitter';
      }
      if (urlObj.hostname.includes('instagram.com')) {
        return 'instagram';
      }
      return 'generic';
    } catch {
      return 'generic';
    }
  };

  const fetchMetadata = async (url: string) => {
    setIsLoadingMetadata(true);
    setErrors({});

    try {
      const urlType = detectUrlType(url);
      let response: Response;
      let data: MetadataResponse | SocialMetadataResponse;

      if (urlType === 'twitter') {
        response = await fetch(`/api/social/twitter?url=${encodeURIComponent(url)}`);
      } else if (urlType === 'instagram') {
        response = await fetch(`/api/social/instagram?url=${encodeURIComponent(url)}`);
      } else {
        response = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`);
      }

      if (!response.ok) {
        throw new Error('Failed to fetch metadata');
      }

      data = await response.json();

      // Update form with metadata
      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        type: urlType === 'generic' ? 'article' : urlType,
        thumbnail_url: data.image || prev.thumbnail_url,
        summary: data.description || prev.summary,
      }));

      // Generate AI summary if we have content
      if (data.content || data.description) {
        await generateAISummary(data.content || data.description);
      }
    } catch (error) {
      setErrors({
        metadata: 'Could not retrieve metadata. Please enter details manually.'
      });
    } finally {
      setIsLoadingMetadata(false);
    }
  };

  const generateAISummary = async (text: string) => {
    if (!text || isGeneratingSummary) return;

    setIsGeneratingSummary(true);
    try {
      const summaryGenerator = getSummaryGenerator();
      const summary = await summaryGenerator(text);
      setFormData(prev => ({ ...prev, summary }));
    } catch (error) {
      console.error('Error generating summary:', error);
      // Don't show error to user, just keep the original summary
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = 'Invalid URL format';
      }
    }

    if (!formData.type) {
      newErrors.type = 'Type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await saveResource({
        title: formData.title,
        url: formData.url,
        type: formData.type,
        tags,
        thumbnail_url: formData.thumbnail_url,
        summary: formData.summary,
      });

      onClose();
    } catch (error) {
      setErrors({ submit: 'Failed to save resource' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleUrlBlur = () => {
    if (formData.url && !isLoadingMetadata) {
      fetchMetadata(formData.url);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Resource</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <div className="relative">
              <Input
                id="url"
                name="url"
                type="url"
                value={formData.url}
                onChange={handleChange}
                onBlur={handleUrlBlur}
                placeholder="https://example.com"
                className={isLoadingMetadata ? 'pr-10' : ''}
              />
              {isLoadingMetadata && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
            </div>
            {errors.url && (
              <p className="text-sm text-destructive">{errors.url}</p>
            )}
            {errors.metadata && (
              <p className="text-sm text-destructive">{errors.metadata}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter resource title"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="article">Article</option>
              <option value="video">Video</option>
              <option value="book">Book</option>
              <option value="code">Code</option>
              <option value="twitter">Tweet</option>
              <option value="instagram">Instagram Post</option>
            </select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <div className="relative">
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                placeholder="Enter a brief summary"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                rows={3}
              />
              {isGeneratingSummary && (
                <div className="absolute right-3 top-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
            <Input
              id="thumbnail_url"
              name="thumbnail_url"
              value={formData.thumbnail_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="react, typescript, testing"
            />
          </div>

          {errors.submit && (
            <p className="text-sm text-destructive">{errors.submit}</p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || isLoadingMetadata || isGeneratingSummary}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SaveModal; 