export function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-secondary">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        <p className="text-text-secondary text-sm font-medium">Loading your board...</p>
      </div>
    </div>
  );
}
