import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs'

const Message = ({ message }) => {

  useEffect(() => {
    Prism.highlightAll();
  }, [message.content])

  const styles = `
    .message-container {
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .user-message {
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    }

    .dark .user-message {
      background: linear-gradient(135deg, rgba(87, 49, 124, 0.25) 0%, rgba(87, 49, 124, 0.15) 100%);
    }

    .ai-message {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%);
    }

    .dark .ai-message {
      background: linear-gradient(135deg, rgba(87, 49, 124, 0.3) 0%, rgba(87, 49, 124, 0.2) 100%);
    }

    .message-bubble {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
    }

    .message-bubble:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .dark .message-bubble:hover {
      box-shadow: 0 4px 16px rgba(164, 86, 247, 0.15);
    }

    .reset-tw code {
      background-color: #1e1e1e !important;
      color: #d4d4d4 !important;
      padding: 12px !important;
      border-radius: 6px !important;
      font-size: 13px !important;
      font-family: 'Courier New', monospace !important;
      overflow-x: auto !important;
      line-height: 1.5 !important;
    }

    .reset-tw pre {
      background-color: #1e1e1e !important;
      border: 1px solid #333 !important;
      border-radius: 8px !important;
      margin: 12px 0 !important;
      overflow-x: auto !important;
    }

    .reset-tw pre code {
      background-color: transparent !important;
      padding: 0 !important;
    }

    .reset-tw p {
      margin: 8px 0 !important;
      line-height: 1.6 !important;
    }

    .reset-tw ul, .reset-tw ol {
      margin: 8px 0 !important;
      padding-left: 20px !important;
    }

    .reset-tw li {
      margin: 4px 0 !important;
    }

    .reset-tw strong {
      font-weight: 600 !important;
    }

    .reset-tw a {
      color: #a456f7 !important;
      text-decoration: none !important;
    }

    .reset-tw a:hover {
      text-decoration: underline !important;
    }

    .reset-tw blockquote {
      border-left: 3px solid #a456f7 !important;
      padding-left: 12px !important;
      margin: 8px 0 !important;
      opacity: 0.8 !important;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      object-fit: cover;
      flex-shrink: 0;
      border: 2px solid rgba(164, 86, 247, 0.2);
    }

    .ai-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
      background: linear-gradient(135deg, #a456f7, #3d81f6);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .timestamp {
      font-size: 11px;
      opacity: 0.7;
      margin-top: 4px;
    }

    .message-image {
      border-radius: 8px;
      max-width: 100%;
      margin: 8px 0;
      box-shadow: 0 4px 12px rgba(164, 86, 247, 0.2);
      transition: transform 0.3s ease;
    }

    .message-image:hover {
      transform: scale(1.02);
    }
  `;

  return (
    <>
      <style>{styles}</style>
      
      {message.role === "user" ? (
        // User Message
        <div className='flex items-end justify-end gap-3 my-4 message-container'>
          <div className="flex flex-col gap-2 p-4 px-5 user-message message-bubble rounded-2xl rounded-tr-sm max-w-2xl">
            <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">
              {message.content}
            </p>
            <span className="timestamp text-gray-500 dark:text-gray-400">
              {moment(message.timestamp).fromNow()}
            </span>
          </div>
          
          <img 
            src={assets.user_icon}
            className='user-avatar' 
            alt="User Avatar" 
          />
        </div>
      ) : (
        // AI Message
        <div className='flex items-end gap-3 my-4 message-container'>
          <div className='ai-avatar'>
            <img 
              src={assets.logo_full} 
              className='w-5 h-5' 
              alt="AI Avatar"
            />
          </div>

          <div className='flex flex-col gap-2 p-4 px-5 max-w-2xl ai-message message-bubble rounded-2xl rounded-tl-sm'>
            {message.isImage ? (
              <img 
                src={message.content}
                className='message-image max-h-96'
                alt="AI Generated" 
              />
            ) : (
              <div className='text-sm text-gray-900 dark:text-gray-100 reset-tw prose prose-invert max-w-none'>
                <Markdown
                  components={{
                    code: ({ node, inline, className, children, ...props }) => (
                      !inline ? (
                        <pre className='bg-gray-900 rounded-lg p-4 overflow-x-auto my-2'>
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code className='bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-xs' {...props}>
                          {children}
                        </code>
                      )
                    ),
                    p: ({ children }) => <p className='mb-2'>{children}</p>,
                    ul: ({ children }) => <ul className='list-disc list-inside mb-2'>{children}</ul>,
                    ol: ({ children }) => <ol className='list-decimal list-inside mb-2'>{children}</ol>,
                    li: ({ children }) => <li className='mb-1'>{children}</li>,
                    strong: ({ children }) => <strong className='font-semibold text-purple-600 dark:text-purple-400'>{children}</strong>,
                    a: ({ children, href }) => (
                      <a 
                        href={href} 
                        target='_blank' 
                        rel='noopener noreferrer'
                        className='text-purple-600 dark:text-purple-400 hover:underline'
                      >
                        {children}
                      </a>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className='border-l-4 border-purple-500 pl-4 italic opacity-75 my-2'>
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {message.content}
                </Markdown>
              </div>
            )}
            
            <span className='timestamp text-gray-500 dark:text-gray-400'>
              {moment(message.timestamp).fromNow()}
            </span>
          </div>
        </div>
      )}
    </>
  )
}

export default Message
