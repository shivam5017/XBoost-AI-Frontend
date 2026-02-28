export default function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      
      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />

      {/* Text */}
      <p className="mt-4 text-sm text-gray-500 font-medium tracking-wide">
        Loading...
      </p>

    </div>
  );
}