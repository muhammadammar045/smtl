import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { NotFound } from "./components/error/NotFound";
import Profile from "./pages/dashboard/Profile";
import Attendance from "./pages/dashboard/Attendance";
import TransportRoutes from "./pages/dashboard/TransportRoutes";
import Subjects from "./pages/dashboard/Subjects";
import SummerTasks from "./pages/dashboard/downloads/SummerTasks";
import Syllabus from "./pages/dashboard/downloads/Syllabus";
import StudyMaterial from "./pages/dashboard/downloads/StudyMaterial";
import Homework from "./pages/dashboard/downloads/Homework";
import TimeTable from "./pages/dashboard/downloads/TimeTable";
import ProgressReport from "./pages/dashboard/examinations/ProgressReport";
import ExamsSchedule from "./pages/dashboard/examinations/ExamsSchedule";
import Diary from "./pages/dashboard/Diary";
import TimeLog from "./pages/dashboard/TimeLog";
import LiveClasses from "./pages/dashboard/LiveClasses";
import ExamsResult from "./pages/dashboard/examinations/ExamsResult";
import Noticeboard from "./pages/dashboard/Noticeboard";
import Login from "./pages/Login/Login";
import Calendar from "./components/dashboard/calendar/Calendar";
import Todo from "./components/dashboard/todo/Todo";

// Import the page components

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                path: "",
                element: (
                    <Navigate
                        to='/auth/login'
                        replace
                    />
                ),
            },
            {
                path: "auth",
                element: <AuthLayout />,
                children: [
                    {
                        path: "login",
                        element: <Login />,
                    },
                    {
                        path: "register",
                        element: <div>Register Page</div>,
                    },
                    {
                        path: "forgot-password",
                        element: <div>Forgot Password Page</div>,
                    },
                ],
            },
            {
                path: "dashboard",
                element: <DashboardLayout />,
                children: [
                    {
                        path: "calendar",
                        element: <Calendar />,
                    },
                    {
                        path: "todo",
                        element: <Todo />,
                    },
                    {
                        path: "profile",
                        element: <Profile />,
                    },
                    {
                        path: "notice-board",
                        element: <Noticeboard />,
                    },
                    {
                        path: "attendance",
                        element: <Attendance />,
                    },
                    {
                        path: "live-classes",
                        element: <LiveClasses />,
                    },
                    {
                        path: "time-log",
                        element: <TimeLog />,
                    },
                    {
                        path: "diary",
                        element: <Diary />,
                    },
                    {
                        path: "exams/schedule",
                        element: <ExamsSchedule />,
                    },
                    {
                        path: "exams/results",
                        element: <ExamsResult />,
                    },
                    {
                        path: "progress/report",
                        element: <ProgressReport />,
                    },
                    {
                        path: "downloads/timetable",
                        element: <TimeTable />,
                    },
                    {
                        path: "downloads/homework",
                        element: <Homework />,
                    },
                    {
                        path: "downloads/study-material",
                        element: <StudyMaterial />,
                    },
                    {
                        path: "downloads/syllabus",
                        element: <Syllabus />,
                    },
                    {
                        path: "downloads/summer-tasks",
                        element: <SummerTasks />,
                    },
                    {
                        path: "subjects",
                        element: <Subjects />,
                    },
                    {
                        path: "transport",
                        element: <TransportRoutes />,
                    },
                ],
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
]);
