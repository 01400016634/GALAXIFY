import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-black/90 text-white p-6 text-center z-50 relative">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">3D Scene Failed to Load</h2>
          <p className="text-red-300 mb-4 max-w-md text-sm bg-red-900/20 p-2 rounded border border-red-500/30">
            {this.state.error?.message || "Unknown error"}
          </p>
          <p className="text-gray-400 text-xs">
            Please ensure <code>sun.jpg</code> is in <code>public/textures/</code> at the project root.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            <RefreshCcw size={16} /> Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;