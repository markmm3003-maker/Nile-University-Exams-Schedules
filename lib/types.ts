export type ExamRecord = {
  date: string;
  time: string;
  room: string;
  course: string;
};

export type ExamsDB = Record<string, ExamRecord[]>;
