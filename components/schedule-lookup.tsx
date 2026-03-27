'use client';

import { FormEvent, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ExamRecord, ExamsDB } from '@/lib/types';

type StatusType = 'idle' | 'loading' | 'ok' | 'error';

async function sha256(value: string) {
  const encoded = new TextEncoder().encode(value.trim().toLowerCase());
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export default function ScheduleLookup() {
  const [studentId, setStudentId] = useState('');
  const [status, setStatus] = useState<{ type: StatusType; message: string }>({ type: 'idle', message: '' });
  const [records, setRecords] = useState<ExamRecord[] | null>(null);
  const [submittedId, setSubmittedId] = useState('');
  const [db, setDb] = useState<ExamsDB | null>(null);

  async function getDB() {
    if (db) return db;
    setStatus({ type: 'loading', message: 'Loading schedule data…' });

    const response = await fetch('/data.json');
    if (!response.ok) {
      throw new Error('Could not load schedule data.');
    }

    const parsed = (await response.json()) as ExamsDB;
    setDb(parsed);
    return parsed;
  }

  async function handleLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalized = studentId.trim();
    if (!normalized) {
      setStatus({ type: 'error', message: 'Please enter your student ID.' });
      setRecords(null);
      return;
    }

    try {
      const loaded = await getDB();
      const hash = await sha256(normalized);
      const exams = loaded[hash] ?? [];

      if (exams.length === 0) {
        setStatus({ type: 'error', message: `No exams found for ID "${normalized}". Double-check and try again.` });
        setRecords(null);
        return;
      }

      setSubmittedId(normalized);
      setRecords(exams);
      setStatus({ type: 'ok', message: `Found ${exams.length} exam${exams.length > 1 ? 's' : ''}.` });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setStatus({ type: 'error', message: `Error: ${message}` });
      setRecords(null);
    }
  }

  return (
    <section className="mt-6 space-y-6">
      <Card>
        <CardContent className="pt-6">
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleLookup}>
            <Input
              aria-label="Student ID"
              placeholder="e.g. 221000002"
              maxLength={20}
              autoComplete="off"
              spellCheck={false}
              value={studentId}
              onChange={(event) => setStudentId(event.target.value)}
            />
            <Button type="submit">Look up</Button>
          </form>

          <p
            className="mt-3 min-h-5 text-sm text-muted-foreground"
            role="status"
            aria-live="polite"
            data-state={status.type}
          >
            {status.message}
          </p>
        </CardContent>
      </Card>

      {records && (
        <Card>
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">
              Schedule for <span className="text-foreground/80">{submittedId}</span>
            </CardTitle>
            <Badge variant="secondary">
              {records.length} EXAM{records.length > 1 ? 'S' : ''}
            </Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Date &amp; Time</TableHead>
                  <TableHead>Room</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((exam, index) => (
                  <TableRow key={`${exam.course}-${exam.date}-${exam.time}-${exam.room}`}>
                    <TableCell>{String(index + 1).padStart(2, '0')}</TableCell>
                    <TableCell>{exam.course}</TableCell>
                    <TableCell>
                      <div>{exam.date}</div>
                      <div className="text-muted-foreground">{exam.time}</div>
                    </TableCell>
                    <TableCell>{exam.room}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
