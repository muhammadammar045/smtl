import { ExamScheduleData, ExamProgressReportData } from "@/store/slices/examSchedule/types";

// Parent API returns a single ExamScheduleData object, not an array
export type ParentExamTimetableData = ExamScheduleData;
export type ParentExamsData = ExamProgressReportData[];

