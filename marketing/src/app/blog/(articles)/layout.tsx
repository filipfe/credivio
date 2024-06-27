export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 py-6 lg:py-16">
      <div className="max-w-7xl mx-auto flex flex-col lg:grid grid-cols-[3fr_1fr] gap-24">
        <section className="flex flex-col gap-6">{children}</section>
        <aside className="sr-only lg:not-sr-only">
          <nav className="sticky top-20 border border-primary/10 p-6 rounded-md lg:h-max">
            <ul></ul>
          </nav>
        </aside>
      </div>
    </div>
  );
}
