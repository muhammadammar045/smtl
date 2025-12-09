import { api } from "@/store/service/rtk-service";
import attendanceReducer from "./slices/attendance/attendance.slice";
import authReducer from "@/store/slices/auth/auth.slice";
import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "@/store/slices/dashboard/dashboard.slice";
import diaryReducer from "./slices/diary/diary.slice";
import downloadReducer from "./slices/download/download.slice";
import examReducer from "./slices/examSchedule/examSchedule.slice";
import liveClassesReducer from "./slices/conference/conference.slice";
import noticeboardReducer from "./slices/noticeboard/noticeboard.slice";
import { setupListeners } from "@reduxjs/toolkit/query";
import subjectReducer from "./slices/subject/subject.slice";
import timeLogReducer from "./slices/timelog/timelog.slice";
import transportReducer from "./slices/transport/transport.slice";
import parentDashboardReducer from "./slices/parent/dashboard/parentDashboard.slice";
import parentStudentReducer from "./slices/parent/student/parentStudent.slice";
import parentNotificationReducer from "./slices/parent/notification/parentNotification.slice";
import parentAttendanceReducer from "./slices/parent/attendance/parentAttendance.slice";
import parentLeaveRequestReducer from "./slices/parent/leaveRequest/parentLeaveRequest.slice";
import parentBioLogReducer from "./slices/parent/bioLog/parentBioLog.slice";
import parentDiaryReducer from "./slices/parent/diary/parentDiary.slice";
import parentExamReducer from "./slices/parent/exam/parentExam.slice";
import parentDownloadReducer from "./slices/parent/download/parentDownload.slice";
import parentSubjectReducer from "./slices/parent/subject/parentSubject.slice";
import parentRouteReducer from "./slices/parent/route/parentRoute.slice";

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authReducer,
        attendance: attendanceReducer,
        dashboard: dashboardReducer,
        noticeboard: noticeboardReducer,
        subjects: subjectReducer,
        downloadCenter: downloadReducer,
        exam: examReducer,
        liveClass: liveClassesReducer,
        timelog: timeLogReducer,
        diary: diaryReducer,
        transport: transportReducer,
        parentDashboard: parentDashboardReducer,
        parentStudent: parentStudentReducer,
        parentNotification: parentNotificationReducer,
        parentAttendance: parentAttendanceReducer,
        parentLeaveRequest: parentLeaveRequestReducer,
        parentBioLog: parentBioLogReducer,
        parentDiary: parentDiaryReducer,
        parentExam: parentExamReducer,
        parentDownload: parentDownloadReducer,
        parentSubject: parentSubjectReducer,
        parentRoute: parentRouteReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
})
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
