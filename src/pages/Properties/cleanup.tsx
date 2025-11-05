import React from 'react';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

interface DescriptionSectionProps {
  /** Raw HTML string coming from your backend (e.g., property.description) */
  htmlContent: string;
  /** Optional Tailwind class for the label (defaults to your design) */
  labelClassName?: string;
  /** Optional Tailwind class for the content wrapper */
  contentClassName?: string;
}


export const SafeDescriptionSection: React.FC<DescriptionSectionProps> = ({
  htmlContent = '',
  labelClassName = ' font-medium w-full md:w-1/3',
  contentClassName = 'w-full flex justify-start',
}) => {
  const cleanHtml = DOMPurify.sanitize(htmlContent, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'base'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onfocus', 'onblur'],
  });

  const parsedContent = React.useMemo(() => {
    try {
      return parse(cleanHtml);
    } catch (e) {
      console.warn('HTML parsing failed, fallback to text', e);
      return cleanHtml.replace(/<[^>]*>/g, '').trim() || 'N/A';
    }
  }, [cleanHtml]);

  return (
    <div className="flex flex-col md:flex-col md:justify-between items-start md:items-start gap-2 py-6">
      <label className={`${labelClassName} text-2xl font-semibold mb-4`}>Description:</label>
      <div className={contentClassName}>
        <div className="prose prose-lg max-w-none text-gray-900">
          {parsedContent}
        </div>
      </div>
    </div>
  );
};
