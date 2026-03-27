'use client';

import { FormEvent, useMemo, useState } from 'react';
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
  const [exams, setExams] = useState<ExamRecord[] | null>(null);
  const [submittedId, setSubmittedId] = useState('');
  const [db, setDb] = useState<ExamsDB | null>(null);

  const statusClass = useMemo(() => {
    if (status.type === 'ok') return 'status ok';
    if (status.type === 'error') return 'status error';
    if (status.type === 'loading') return 'status loading';
    return 'status';
  }, [status.type]);

  async function getDB() {
    if (db) return db;
    setStatus({ type: 'loading', message: 'Loading schedule data…' });
    const response = await fetch('/data.json');
    if (!response.ok) {
      throw new Error('Could not load schedule data');
    }

    const parsed = (await response.json()) as ExamsDB;
    setDb(parsed);
    return parsed;
  }

  async function handleLookup(event: FormEvent) {
    event.preventDefault();

    const normalized = studentId.trim();
    if (!normalized) {
      setStatus({ type: 'error', message: 'Please enter your student ID.' });
      setExams(null);
      return;
    }

    try {
      const loaded = await getDB();
      const hash = await sha256(normalized);
      const result = loaded[hash] ?? [];

      if (!result.length) {
        setStatus({ type: 'error', message: `No exams found for ID "${normalized}". Double-check and try again.` });
        setExams(null);
        return;
      }

      setSubmittedId(normalized);
      setExams(result);
      setStatus({ type: 'ok', message: `Found ${result.length} exam${result.length > 1 ? 's' : ''}.` });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setStatus({ type: 'error', message: `Error: ${message}` });
      setExams(null);
    }
  }

  return (
    <>
      <div className="card">
        <form className="inputRow" onSubmit={handleLookup}>
          <input
            aria-label="Student ID"
            type="text"
            maxLength={20}
            autoComplete="off"
            spellCheck={false}
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            placeholder="e.g. 221000002"
          />
          <button type="submit">Look up →</button>
        </form>
        <p className={statusClass} role="status" aria-live="polite">
          {status.message}
        </p>
      </div>

      {exams && (
        <div className="results">
          <div className="resultsHeader">
            <span className="resultTitle">
              Schedule for <strong>{submittedId}</strong>
            </span>
            <span className="badge">{exams.length} EXAM{exams.length > 1 ? 'S' : ''}</span>
          </div>
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Course</th>
                  <th>Date &amp; Time</th>
                  <th>Room</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam, index) => (
                  <tr key={`${exam.course}-${exam.date}-${exam.time}-${exam.room}`}>
                    <td>{String(index + 1).padStart(2, '0')}</td>
                    <td>
                      <span className="coursePill">{exam.course}</span>
                    </td>
                    <td>
                      <div>{exam.date}</div>
                      <small>{exam.time}</small>
                    </td>
                    <td>{exam.room}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
