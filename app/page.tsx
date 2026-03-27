import ScheduleLookup from '@/components/schedule-lookup';

export default function HomePage() {
  return (
    <main className="wrapper">
      <header>
        <p className="label">Nile University · Spring 2026</p>
        <h1>Midterm Schedule</h1>
        <p className="subtitle">Enter your student ID to view your personal exam timetable</p>
      </header>

      <section className="cautionBanner" aria-label="Important notice">
        <h2>Always verify manually</h2>
        <p>
          This tool is provided for convenience and may contain errors. Please cross-check your schedule against the
          official Nile University exam schedule before your exams.
        </p>
      </section>

      <ScheduleLookup />
    </main>
  );
}
