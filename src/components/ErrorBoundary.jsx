import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          background: '#fff3cd',
          borderRadius: '10px',
          border: '1px solid #ffc107',
          margin: '1rem 0'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#856404' }}>Map temporarily unavailable</h4>
          <p style={{ margin: 0, color: '#856404', fontSize: '0.9rem' }}>
            {this.state.error?.message || 'Unable to load the continent map'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
