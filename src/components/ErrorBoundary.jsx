import { Component } from "react";

/**
 * Without this, any render-time throw unmounts the whole tree and leaves a
 * blank page with the cause only visible in the console. Error boundaries still
 * have to be class components — there is no hook equivalent.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled render error:", error, info);
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <main className="loading-screen">
        <div className="loading-card error-card">
          <h2>Something broke while drawing your notebook.</h2>
          <p>
            Your cards are safe — they live in Firestore, not in this page.
            Reloading usually clears it.
          </p>
          <pre className="error-detail">{String(this.state.error)}</pre>
          <button
            type="button"
            className="button button-primary"
            onClick={() => window.location.reload()}
          >
            Reload the page
          </button>
        </div>
      </main>
    );
  }
}
