import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center gap-6 px-4 text-center sm:px-6 lg:px-8">
      <p className="font-display text-7xl font-bold text-gradient">404</p>
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Lost in the void</h1>
        <p className="mt-2 text-sm text-white/50">
          The page you’re looking for doesn’t exist — it may have been moved or is
          temporarily unavailable.
        </p>
      </div>
      <Link href="/" className="btn-neon">
        Back to home
      </Link>
    </div>
  );
}
