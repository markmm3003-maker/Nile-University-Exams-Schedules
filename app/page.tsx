import { ThemeToggle } from '@/components/theme-toggle';
import ScheduleLookup from '@/components/schedule-lookup';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <main className="container py-12">
      <div className="mb-6 flex justify-end">
        <ThemeToggle />
      </div>

      <Card>
        <CardHeader>
          <CardDescription className="uppercase tracking-[0.2em]">Nile University · Spring 2026</CardDescription>
          <CardTitle className="text-3xl sm:text-5xl">Midterm Schedule</CardTitle>
          <CardDescription>Enter your student ID to view your personal exam timetable.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>Always verify manually</AlertTitle>
            <AlertDescription>
              This tool is provided for convenience and may contain errors. Please cross-check your schedule against the
              official Nile University exam schedule before your exams.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <ScheduleLookup />
    </main>
  );
}
