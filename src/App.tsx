import { useAuth } from './hooks/useAuth';
import { Board } from './components/Board';
import { LoadingState } from './components/LoadingState';

function App() {
  const { user, loading, error } = useAuth();

  if (loading) return <LoadingState />;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-secondary">
        <div className="text-center p-8 max-w-md">
          <p className="text-text-primary font-semibold text-lg mb-2">Failed to initialize session</p>
          {error && (
            <p className="text-danger text-sm mb-4 bg-red-50 p-3 rounded-xl border border-red-200 text-left font-mono">
              {error}
            </p>
          )}
          <p className="text-text-secondary text-sm mb-4">
            Make sure anonymous sign-in is enabled in your Supabase dashboard:
            <br />
            <span className="font-medium">Authentication → Settings → Anonymous Sign-Ins → ON</span>
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <Board userId={user.id} />;
}

export default App;
