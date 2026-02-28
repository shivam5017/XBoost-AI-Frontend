export default function PageLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f3ff] via-white to-[#eef2ff] p-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="h-12 w-64 rounded-2xl shimmer" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-28 rounded-2xl shimmer" />
          <div className="h-28 rounded-2xl shimmer" />
          <div className="h-28 rounded-2xl shimmer" />
        </div>
        <div className="h-80 rounded-3xl shimmer" />
      </div>
    </div>
  );
}
