import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  name?: string;
  required?: boolean;
  error?: any;
  disabled?: boolean;
  height?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  placeholder,
  value,
  onChange,
  name,
  required = false,
  error,
  disabled = false,
  height = 300,
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorChange = (content: string) => {
    const syntheticEvent = {
      target: {
        value: content,
        name: name || 'content',
      },
    };
    
    onChange(syntheticEvent as any);
  };

  const token = import.meta.env.VITE_TEXT_EDITOR_URL;

  return (
    <div className="w-full">
      <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className={`rounded-[20px] overflow-hidden transition-all duration-200 ${
        error ? "border border-red-500" : "border border-transparent focus-within:border-green-500"
      }`}>
        <Editor
          apiKey={token}
          onInit={(evt, editor) => (editorRef.current = editor)}
          value={value}
          onEditorChange={handleEditorChange}
          disabled={disabled}
          init={{
            height: height,
            menubar: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'help', 'wordcount'
            ],
            toolbar: 
              'undo redo | blocks | bold italic underline | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | link image | \
              removeformat | help',
            placeholder: placeholder,
            content_style: `
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                font-size: 14px; 
                line-height: 1.6;
                background-color: #F5F5F5;
                margin: 0;
                padding: 10px 24px;
              }
            `,
            skin: 'oxide',
            content_css: 'default',
            branding: false,
            statusbar: false,
            mobile: {
              theme: 'mobile',
              plugins: ['lists', 'autolink', 'link', 'image'],
              toolbar: 'undo redo | bold italic | bullist numlist | link',
            },
            width: '100%',
            resize: 'both',
            autoresize: true,
          }}
        />
      </div>
      
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default RichTextEditor;