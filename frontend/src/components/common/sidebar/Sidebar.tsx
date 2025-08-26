import { useState, useMemo } from "react";
import { useLocation, NavLink } from "react-router-dom";
import {
    BookOpen,
    Clock,
    Download,
    Bus,
    Bell,
    FileText,
    Users,
    ClipboardList,
    Calendar,
    BookCopy,
    Book,
    Sun,
    CalendarSearchIcon,
    User,
    ChevronDown,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

import { useAppSelector } from "@/store/hooks/hooks";
import { selectAuth } from "@/store/slices/auth/auth.slice";

// Dummy children
const mockChildren = [
    { id: "1", name: "Muhammad Senan" },
    { id: "2", name: "Muhammad Ammar" },
    { id: "3", name: "Muhammad Maaz" },
];

interface LinkItem {
    title: string;
    url: string;
    icon: React.ReactNode;
    items?: LinkItem[];
}

const studentLinks: LinkItem[] = [
    { title: "My Profile", url: "/dashboard/profile", icon: <Users /> },
    { title: "Notice Board", url: "/dashboard/notice-board", icon: <Bell /> },
    {
        title: "Attendance",
        url: "/dashboard/attendance",
        icon: <ClipboardList />,
    },
    {
        title: "Live Classes",
        url: "/dashboard/live-classes",
        icon: <BookOpen />,
    },
    { title: "IN/OUT Time Log", url: "/dashboard/time-log", icon: <Clock /> },
    { title: "Diary", url: "/dashboard/diary", icon: <FileText /> },
    {
        title: "Examinations",
        url: "/dashboard/examinations",
        icon: <FileText />,
        items: [
            {
                title: "Exam Schedule",
                url: "/dashboard/exams/schedule",
                icon: <CalendarSearchIcon />,
            },
            {
                title: "Exam Results",
                url: "/dashboard/exams/results",
                icon: <FileText />,
            },
            {
                title: "Progress Report",
                url: "/dashboard/progress/report",
                icon: <FileText />,
            },
        ],
    },
    {
        title: "Download Center",
        url: "/dashboard/downloads",
        icon: <Download />,
        items: [
            {
                title: "Time Table",
                url: "/dashboard/downloads/timetable",
                icon: <Calendar />,
            },
            {
                title: "Homework",
                url: "/dashboard/downloads/homework",
                icon: <BookCopy />,
            },
            {
                title: "Study Material",
                url: "/dashboard/downloads/study-material",
                icon: <Book />,
            },
            {
                title: "Syllabus",
                url: "/dashboard/downloads/syllabus",
                icon: <FileText />,
            },
            {
                title: "Summer Tasks",
                url: "/dashboard/downloads/summer-tasks",
                icon: <Sun />,
            },
        ],
    },
    { title: "Subjects", url: "/dashboard/subjects", icon: <BookOpen /> },
    { title: "Transport Routes", url: "/dashboard/transport", icon: <Bus /> },
];

const generateParentLinks = (): LinkItem[] => {
    return studentLinks.map((link) => {
        if (link.items) {
            return {
                ...link,
                items: link.items.map((subItem) => ({
                    ...subItem,
                    items: mockChildren.map((child) => ({
                        title: child.name,
                        url: `/parent/child/${child.id}${subItem.url.substring(
                            "/dashboard".length
                        )}`,
                        icon: <User />,
                    })),
                })),
            };
        } else {
            return {
                ...link,
                items: mockChildren.map((child) => ({
                    title: child.name,
                    url: `/parent/child/${child.id}${link.url.substring(
                        "/dashboard".length
                    )}`,
                    icon: <User />,
                })),
            };
        }
    });
};

const isItemActive = (item: LinkItem, pathname: string): boolean => {
    if (pathname.startsWith(item.url)) return true;
    return (
        item.items?.some((subItem) => isItemActive(subItem, pathname)) ?? false
    );
};

export function AppSidebar() {
    const { pathname } = useLocation();
    const user = useAppSelector(selectAuth);
    const role = user?.role;

    const Links = useMemo(
        () => (role === "parent" ? generateParentLinks() : studentLinks),
        [role]
    );
    const [openAccordions, setOpenAccordions] = useState<
        Record<string, boolean>
    >({});
    const { isMobile, setOpenMobile } = useSidebar();

    const toggleAccordion = (key: string) => {
        setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleNavClick = () => {
        if (isMobile) setOpenMobile(false);
    };

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>

                    <p className='text-sm py-2 px-4 text-white bg-primary rounded mb-2'>
                        Current Session:{" "}
                        <span>
                            {new Date().getFullYear()} -{" "}
                            {new Date().getFullYear() + 1}
                        </span>
                    </p>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {Links.map((item) => {
                                const active = isItemActive(item, pathname);
                                const hasChildren = !!item.items?.length;

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        {hasChildren ? (
                                            <div className='flex flex-col'>
                                                <button
                                                    onClick={() =>
                                                        toggleAccordion(
                                                            item.title
                                                        )
                                                    }
                                                    className={`flex items-center justify-between w-full px-2 py-2 rounded hover:bg-muted transition ${
                                                        active
                                                            ? "bg-primary text-white"
                                                            : "text-muted-foreground"
                                                    }`}
                                                >
                                                    <span className='flex items-center gap-2'>
                                                        {item.icon}
                                                        {item.title}
                                                    </span>
                                                    <ChevronDown
                                                        className={`h-4 w-4 transition-transform ${
                                                            openAccordions[
                                                                item.title
                                                            ]
                                                                ? "rotate-180"
                                                                : ""
                                                        }`}
                                                    />
                                                </button>

                                                {openAccordions[item.title] && (
                                                    <div className='pl-4 space-y-1 pt-1'>
                                                        {item.items?.map(
                                                            (subItem) => {
                                                                const subHasChildren =
                                                                    !!subItem
                                                                        .items
                                                                        ?.length;
                                                                const subActive =
                                                                    isItemActive(
                                                                        subItem,
                                                                        pathname
                                                                    );

                                                                return (
                                                                    <div
                                                                        key={
                                                                            subItem.title
                                                                        }
                                                                        className='flex flex-col'
                                                                    >
                                                                        {subHasChildren ? (
                                                                            <>
                                                                                <button
                                                                                    onClick={() =>
                                                                                        toggleAccordion(
                                                                                            subItem.title
                                                                                        )
                                                                                    }
                                                                                    className={`flex items-center justify-between w-full px-2 py-1 text-sm rounded hover:bg-muted ${
                                                                                        subActive
                                                                                            ? "text-primary"
                                                                                            : "text-muted-foreground"
                                                                                    }`}
                                                                                >
                                                                                    <span className='flex items-center gap-2'>
                                                                                        {
                                                                                            subItem.icon
                                                                                        }
                                                                                        {
                                                                                            subItem.title
                                                                                        }
                                                                                    </span>
                                                                                    <ChevronDown
                                                                                        className={`h-4 w-4 transition-transform ${
                                                                                            openAccordions[
                                                                                                subItem
                                                                                                    .title
                                                                                            ]
                                                                                                ? "rotate-180"
                                                                                                : ""
                                                                                        }`}
                                                                                    />
                                                                                </button>
                                                                                {openAccordions[
                                                                                    subItem
                                                                                        .title
                                                                                ] && (
                                                                                    <div className='pl-4 space-y-1'>
                                                                                        {subItem.items?.map(
                                                                                            (
                                                                                                child
                                                                                            ) => (
                                                                                                <NavLink
                                                                                                    key={
                                                                                                        child.title
                                                                                                    }
                                                                                                    to={
                                                                                                        child.url
                                                                                                    }
                                                                                                    onClick={
                                                                                                        handleNavClick
                                                                                                    }
                                                                                                    className={({
                                                                                                        isActive,
                                                                                                    }) =>
                                                                                                        `flex items-center gap-2 text-xs px-2 py-1 rounded hover:text-primary ${
                                                                                                            isActive
                                                                                                                ? "text-primary"
                                                                                                                : "text-muted-foreground"
                                                                                                        }`
                                                                                                    }
                                                                                                >
                                                                                                    {
                                                                                                        child.icon
                                                                                                    }
                                                                                                    {
                                                                                                        child.title
                                                                                                    }
                                                                                                </NavLink>
                                                                                            )
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                            </>
                                                                        ) : (
                                                                            <NavLink
                                                                                to={
                                                                                    subItem.url
                                                                                }
                                                                                onClick={
                                                                                    handleNavClick
                                                                                }
                                                                                className={({
                                                                                    isActive,
                                                                                }) =>
                                                                                    `flex items-center gap-2 px-2 py-1 text-sm rounded hover:text-primary ${
                                                                                        isActive
                                                                                            ? "text-primary"
                                                                                            : "text-muted-foreground"
                                                                                    }`
                                                                                }
                                                                            >
                                                                                {
                                                                                    subItem.icon
                                                                                }
                                                                                {
                                                                                    subItem.title
                                                                                }
                                                                            </NavLink>
                                                                        )}
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <SidebarMenuButton asChild>
                                                <NavLink
                                                    to={item.url}
                                                    onClick={handleNavClick}
                                                    className={({ isActive }) =>
                                                        `flex items-center gap-2 py-2 px-2 rounded hover:text-foreground transition ${
                                                            isActive
                                                                ? "bg-primary text-white"
                                                                : "text-muted-foreground"
                                                        }`
                                                    }
                                                >
                                                    {item.icon}
                                                    {item.title}
                                                </NavLink>
                                            </SidebarMenuButton>
                                        )}
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}

export default Sidebar;
