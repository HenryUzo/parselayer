const capabilities = [
  'Schema-constrained extraction',
  'Field-level evidence and confidence',
  'Human review for uncertain critical fields',
  'Versioned, asynchronous developer API',
];

export default function HomePage() {
  return (
    <main className="shell">
      <section className="hero" aria-labelledby="page-title">
        <p className="eyebrow">Phase 1 foundation</p>
        <h1 id="page-title">Document intelligence that shows its work.</h1>
        <p className="lede">
          ParseLayer turns resumes, cover letters, job descriptions, and supported government IDs
          into structured data with traceable evidence and explicit uncertainty.
        </p>
        <div className="status" role="status">
          <span className="status-dot" aria-hidden="true" />
          Web, API, worker, database, queue, and local storage foundations are configured.
        </div>
      </section>

      <section aria-labelledby="capabilities-title">
        <h2 id="capabilities-title">Foundation principles</h2>
        <ul className="capabilities">
          {capabilities.map((capability) => (
            <li key={capability}>{capability}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
