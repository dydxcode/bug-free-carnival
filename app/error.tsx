export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <main className="container-shell py-24 text-center">
      <h2 className="text-3xl font-semibold">Something went wrong</h2>
      <p className="mt-4 text-muted">The page could not load the latest content.</p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-full bg-primary px-5 py-2 font-medium text-white transition hover:bg-[#9d6af5]"
      >
        Try again
      </button>
    </main>
  );
}
