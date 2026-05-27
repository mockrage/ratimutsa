export default function Loading() {
  return (
    <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
      <div className="text-center">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-luxury-forest-green/20 border-t-luxury-forest-green rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-gray-500 font-sans tracking-wider uppercase">Loading...</p>
      </div>
    </div>
  );
}
