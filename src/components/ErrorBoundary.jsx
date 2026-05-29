/**
 * ErrorBoundary — The Safety Net for the Entire App
 * ==================================================
 * 
 * WHAT THIS FILE DOES:
 * If any React component crashes (throws an error during rendering),
 * this component catches it and shows a friendly error page instead
 * of a blank white screen. The rest of the app stays alive.
 * 
 * WHY IT MATTERS:
 * Without this, a single broken component could crash the ENTIRE site.
 * With this, only the broken section shows an error — everything else works.
 * 
 * HOW TO USE:
 * Wrap it around <App /> in main.jsx:
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 * 
 * NOTE: This uses a Class component because React's error boundary API
 * only works with class components (as of React 19). This is the one
 * exception to our "use function components everywhere" rule.
 */

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Called when a child component throws an error.
   * Updates state so the next render shows the fallback UI.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Called after an error is caught. Logs the error for debugging.
   * In production, you could send this to a monitoring service.
   */
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component stack:', errorInfo.componentStack);
    this.setState({ errorInfo });
  }

  /**
   * Resets the error state so the user can try again.
   * Reloads the app from scratch.
   */
  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8f9fb',
            fontFamily: "'Outfit', sans-serif",
            padding: '24px',
          }}
        >
          <div
            style={{
              maxWidth: '480px',
              width: '100%',
              background: '#fff',
              borderRadius: '20px',
              padding: '40px 32px',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            }}
          >
            {/* Error Icon */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '28px',
              }}
            >
              ⚠️
            </div>

            <h1
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '8px',
              }}
            >
              Something went wrong
            </h1>

            <p
              style={{
                fontSize: '14px',
                color: '#64748b',
                lineHeight: '1.6',
                marginBottom: '24px',
              }}
            >
              An unexpected error occurred. Don't worry — your data is safe.
              Try refreshing the page or going back to the homepage.
            </p>

            {/* Error details (only in development) */}
            {import.meta.env.DEV && this.state.error && (
              <div
                style={{
                  background: '#fef2f2',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '24px',
                  textAlign: 'left',
                  border: '1px solid #fecaca',
                }}
              >
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#dc2626',
                    marginBottom: '4px',
                  }}
                >
                  Error Details (dev only):
                </p>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#991b1b',
                    fontFamily: 'monospace',
                    wordBreak: 'break-word',
                  }}
                >
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  background: '#fff',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Refresh Page
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #0b5ed7, #4f46e5)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: '0 4px 14px rgba(11,94,215,0.3)',
                }}
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      );
    }

    // No error — render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
