export type TimeLogRow = [number, string, string, string, string, string];

// Final formatted object used in table
export interface TimeLog {
    id: number;
    attendanceDate: string;
    inTime: string;
    outTime: string;
    fullName: string;
    className: string;
}

// API data wrapper
export interface TimeLogData {
    draw: number | null;
    recordsTotal: number;
    recordsFiltered: number;
    data: TimeLogRow[];
}