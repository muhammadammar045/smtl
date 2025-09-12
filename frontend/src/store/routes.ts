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
        getAttendanceDetails: (month: number, year: number, search: string) => `user/attendence/detail_attendance_api?month=${month}&year=${year}&std_id=&search=${search}`
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

    },

    bioLog: {

    },

    exam: {
        examSchedule: "/user/examschedule/exam_schedule_api",
        examProgressReport: "/user/user/results_progress_api",
        examResults: "/user/user/results_api",
    },

    calendar: {
        getCalendar: "user/calendar/calendar_api"
    }


}