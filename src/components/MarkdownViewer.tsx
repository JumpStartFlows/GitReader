import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useTheme } from '../hooks/useTheme';

interface MarkdownViewerProps {
  content: string;
}

// Language mapping for common aliases and variations
const languageMap: Record<string, string> = {
  'js': 'javascript',
  'ts': 'typescript',
  'py': 'python',
  'rb': 'ruby',
  'sh': 'bash',
  'shell': 'bash',
  'yml': 'yaml',
  'md': 'markdown',
  'cpp': 'cpp',
  'c++': 'cpp',
  'csharp': 'csharp',
  'c#': 'csharp',
  'cs': 'csharp',
  'php': 'php',
  'go': 'go',
  'rust': 'rust',
  'rs': 'rust',
  'swift': 'swift',
  'kotlin': 'kotlin',
  'kt': 'kotlin',
  'scala': 'scala',
  'r': 'r',
  'matlab': 'matlab',
  'sql': 'sql',
  'html': 'markup',
  'xml': 'markup',
  'css': 'css',
  'scss': 'scss',
  'sass': 'sass',
  'less': 'less',
  'json': 'json',
  'dockerfile': 'docker',
  'makefile': 'makefile',
  'vim': 'vim',
  'powershell': 'powershell',
  'ps1': 'powershell',
  'batch': 'batch',
  'bat': 'batch'
};

// Function to normalize and validate language
const normalizeLanguage = (lang: string): string => {
  if (!lang) return 'text';
  
  const normalized = lang.toLowerCase().trim();
  return languageMap[normalized] || normalized;
};

// Function to detect language from content if not specified
const detectLanguageFromContent = (content: string): string => {
  const trimmedContent = content.trim();
  
  // JavaScript/TypeScript patterns
  if (/^(function|const|let|var|class|import|export)/m.test(trimmedContent) ||
      /console\.(log|error|warn)/m.test(trimmedContent)) {
    return 'javascript';
  }
  
  // Python patterns
  if (/^(def|class|import|from|if __name__|print\()/m.test(trimmedContent) ||
      /^\s*#.*python/i.test(trimmedContent)) {
    return 'python';
  }
  
  // Java patterns
  if (/^(public|private|protected)\s+(class|interface)/m.test(trimmedContent) ||
      /System\.out\.println/m.test(trimmedContent)) {
    return 'java';
  }
  
  // C/C++ patterns
  if (/#include\s*<.*>/m.test(trimmedContent) ||
      /int\s+main\s*\(/m.test(trimmedContent)) {
    return 'cpp';
  }
  
  // HTML patterns
  if (/<\/?[a-z][\s\S]*>/i.test(trimmedContent)) {
    return 'markup';
  }
  
  // CSS patterns
  if (/\{[\s\S]*:[^}]*\}/m.test(trimmedContent) &&
      !/^[\s]*[\w-]+\s*\(/m.test(trimmedContent)) {
    return 'css';
  }
  
  // JSON patterns
  if (/^\s*[\{\[]/.test(trimmedContent) && 
      /[\}\]]\s*$/.test(trimmedContent)) {
    try {
      JSON.parse(trimmedContent);
      return 'json';
    } catch {
      // Not valid JSON
    }
  }
  
  // SQL patterns
  if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\s+/im.test(trimmedContent)) {
    return 'sql';
  }
  
  // Shell/Bash patterns
  if (/^#!/.test(trimmedContent) || 
      /^\s*(echo|ls|cd|mkdir|rm|cp|mv|grep|awk|sed)\s+/m.test(trimmedContent)) {
    return 'bash';
  }
  
  return 'text';
};

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  const { theme } = useTheme();

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <style jsx>{`
        /* Custom scrollbar styling for code blocks */
        .code-scroll-container::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        
        .code-scroll-container::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }
        
        .code-scroll-container::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
        }
        
        .code-scroll-container::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.5);
        }
        
        /* Dark mode scrollbar */
        .dark .code-scroll-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .dark .code-scroll-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .dark .code-scroll-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        
        /* Firefox scrollbar */
        .code-scroll-container {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.3) rgba(0, 0, 0, 0.1);
        }
        
        .dark .code-scroll-container {
          scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
        }

        /* Hide the horizontal scroll instruction text */
        .code-block-header .scroll-instruction {
          display: none !important;
        }

        /* Ensure HTML images are responsive and styled properly */
        .prose img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          margin: 1rem 0;
        }

        .dark .prose img {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
        }
      `}</style>
      
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }) {
            // Extract language from className or detect from content
            const match = /language-(\w+)/.exec(className || '');
            const specifiedLanguage = match ? match[1] : '';
            const codeContent = String(children).replace(/\n$/, '');
            
            // Normalize language or detect from content
            const detectedLanguage = specifiedLanguage 
              ? normalizeLanguage(specifiedLanguage)
              : detectLanguageFromContent(codeContent);
            
            const finalLanguage = detectedLanguage || 'text';
            
            return !inline && (match || codeContent.includes('\n')) ? (
              <div className="relative w-full my-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                {/* Language label without scroll instruction */}
                <div className="code-block-header flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      {finalLanguage}
                    </span>
                    {!specifiedLanguage && finalLanguage !== 'text' && (
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        Auto-detected
                      </span>
                    )}
                    {finalLanguage === 'text' && !specifiedLanguage && (
                      <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                        No language specified
                      </span>
                    )}
                  </div>
                  {/* Removed the scroll instruction span */}
                </div>
                
                {/* Scrollable code container */}
                <div 
                  className="code-scroll-container overflow-x-auto overflow-y-hidden"
                  role="region"
                  aria-label={`Code block in ${finalLanguage} language`}
                  tabIndex={0}
                  style={{
                    maxWidth: '100%',
                    scrollBehavior: 'smooth'
                  }}
                >
                  <SyntaxHighlighter
                    style={theme === 'dark' ? oneDark : oneLight}
                    language={finalLanguage}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      padding: '1rem',
                      borderRadius: 0,
                      background: 'transparent',
                      fontSize: '0.875rem',
                      lineHeight: '1.6',
                      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                      minWidth: 'max-content',
                      whiteSpace: 'pre',
                      wordWrap: 'normal',
                      overflowWrap: 'normal'
                    }}
                    codeTagProps={{
                      style: {
                        fontSize: '0.875rem',
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                        whiteSpace: 'pre',
                        wordWrap: 'normal',
                        overflowWrap: 'normal'
                      }
                    }}
                    wrapLongLines={false}
                    showLineNumbers={codeContent.split('\n').length > 5}
                    {...props}
                  >
                    {codeContent}
                  </SyntaxHighlighter>
                </div>
              </div>
            ) : (
              <code
                className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono text-gray-800 dark:text-gray-200 inline-block max-w-full"
                style={{ 
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                  fontSize: '0.875rem',
                  wordBreak: 'break-all',
                  overflowWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.4',
                  hyphens: 'auto'
                }}
                {...props}
              >
                {children}
              </code>
            );
          },
          img: ({ src, alt, ...props }) => (
            <img
              src={src}
              alt={alt}
              className="max-w-full h-auto rounded-lg shadow-md my-4"
              style={{
                display: 'block',
                margin: '1rem auto',
                maxWidth: '100%',
                height: 'auto'
              }}
              loading="lazy"
              {...props}
            />
          ),
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              {children}
            </p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline transition-colors break-words"
              style={{ 
                wordBreak: 'break-all',
                overflowWrap: 'break-word'
              }}
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 pl-6 space-y-1 text-gray-700 dark:text-gray-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 pl-6 space-y-1 text-gray-700 dark:text-gray-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="list-disc">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 mb-4 break-words">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4 w-full rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-left font-semibold text-gray-900 dark:text-white">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};