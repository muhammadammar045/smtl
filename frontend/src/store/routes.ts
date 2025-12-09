
export const apiRoutes = {
    auth: {
        login: "/site/userlogin_api",
        logout: "/site/logout_api"
    },
    dashboard: {
        getDashboardDetails: "/user/user/dashboard_api",
    },
    noticeboard: {
        getNoticeboardDetails: "/user/notification/notification_api",
    },
    attendance: {
        getAttendance: "/user/attendence/attendance_api",
        getAttendanceDetails: (month: string, year: number, search: string) => `user/attendence/detail_attendance_api?month=${month}&year=${year}&std_id=&search=${search}`
    },
    conference: {
        getConference: "user/conference/conference_api"
    },
    subjects: {
        getSubjects: "/user/subject/subject_api",
    },
    routes: {
        getRoutes: "user/route/transport_routes_api",
    },

    download: {
        timeTable: "/user/content/timetable_api",
        assignment: "/user/content/assignment_api",
        studyMaterial: "/user/content/studymaterial_api",
        syllabus: "/user/content/syllabus_api",
        other: "/user/content/other_summertask_api"
    },

    diary: {
        getDiary: "/user/diary/student_diary_desc_api",
    },

    timelog: {
        getTimeLogs: "/user/user/bio_log_api",

    },

    exam: {
        examSchedule: "/user/examschedule/exam_schedule_api",
        examProgressReport: "/user/user/results_progress_api",
        examResults: "/user/user/results_api",
    },

    calendar: {
        getCalendar: "user/calendar/calendar_api"
    },

    parent: {
        dashboard: "/parent/parents/dashboard_api",
        getStudent: (childId: string) => `/parent/parents/getstudent_api/${childId}`,
        getNotifications: (childId: string) => `/parent/notification/index_api/${childId}`,
        getAttendance: (childId: string) => `/parent/parents/getattendence_api/${childId}`,
        getAttendanceDetails: (childId: string, month: string, year: number, search: string) => `/parent/parents/detail_attendance_api?month=${month}&year=${year}&std_id=${childId}&search=${search}`,
        getLeaveRequest: (childId: string) => `/parent/parents/leaverequest_api/${childId}`,
        getBioLog: (childId: string) => `/parent/parents/bio_log_api/${childId}`,
        getDiary: (childId: string) => `/parent/diary/student_diary_desc_api/${childId}`,
        getExamTimetable: (childId: string) => `/parent/parents/getexamtimetable_api/${childId}`,
        getExams: (childId: string) => `/parent/parents/getexams_api/${childId}`,
        getDownloads: (childId: string) => `/parent/parents/downloads_api/${childId}`,
        getSubject: (childId: string) => `/parent/parents/getsubject_api/${childId}`,
        getRoutes: "/parent/route_api"
    }


}