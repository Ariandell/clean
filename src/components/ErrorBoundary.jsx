import React from 'react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black text-red-500 p-10 font-mono overflow-auto z-[9999] relative">
                    <h1 className="text-4xl font-bold mb-4">Something went wrong.</h1>
                    <h2 className="text-xl text-white mb-2">Error:</h2>
                    <pre className="bg-red-900/20 p-4 rounded border border-red-500/50 mb-6 whitespace-pre-wrap">
                        {this.state.error && this.state.error.toString()}
                    </pre>
                    <h2 className="text-xl text-white mb-2">Component Stack:</h2>
                    <pre className="text-xs text-gray-400 bg-black p-4 border border-gray-800 rounded whitespace-pre-wrap">
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </pre>
                </div>
            );
        }

        return this.props.children;
    }
}
