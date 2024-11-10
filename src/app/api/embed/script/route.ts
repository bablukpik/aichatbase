import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  const headersList = headers();
  const origin = headersList.get('origin') || '';

  const script = `
    (function(w,d) {
      const container = d.createElement('div');
      container.id = 'aichatbase-container';
      container.style.position = 'fixed';
      container.style.bottom = '20px';
      container.style.right = '20px';
      container.style.zIndex = '999999';
      d.body.appendChild(container);

      const config = w.chatbaseConfig || {};
      const position = config.position || 'bottom-right';
      const theme = config.theme || 'light';
      
      // Position the container
      if (position.includes('left')) {
        container.style.right = 'auto';
        container.style.left = '20px';
      }
      if (position.includes('top')) {
        container.style.bottom = 'auto';
        container.style.top = '20px';
      }

      // Create chat iframe
      const iframe = d.createElement('iframe');
      iframe.src = '${process.env.NEXT_PUBLIC_APP_URL}/chat-widget/' + config.chatbotId;
      iframe.style.border = 'none';
      iframe.style.width = '350px';
      iframe.style.height = '600px';
      iframe.style.borderRadius = '10px';
      iframe.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      
      // Apply theme
      if (theme === 'dark') {
        iframe.style.backgroundColor = '#1a1a1a';
      }
      
      // Append iframe to container
      container.appendChild(iframe);
      
      // Handle messages from iframe
      w.addEventListener('message', function(event) {
        if (event.origin !== '${process.env.NEXT_PUBLIC_APP_URL}') return;
        
        if (event.data.type === 'resize') {
          iframe.style.height = event.data.height + 'px';
        }
      });
    })(window,document);
  `;

  return new NextResponse(script, {
    headers: {
      'Content-Type': 'application/javascript',
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'public, max-age=3600',
    },
  });
} 