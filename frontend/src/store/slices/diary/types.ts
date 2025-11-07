export interface DiaryEntry {
    content?: string; // or whatever fields a diary has
}

export interface SessionMonth {
    year: string;
    month: string;
    session_month: string; // e.g., "Mar 2025"
}

export interface Diary {
    session_months: SessionMonth[];
    current_month: string;
    diarylist: Record<string, DiaryEntry | null> | null;
}
