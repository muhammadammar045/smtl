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

const generateParentLinks = (): LinkItem[] =>
    studentLinks.map((link) =>
        link.items
            ? {
                  ...link,
                  items: link.items.map((subItem) => ({
                      ...subItem,
                      items: mockChildren.map((child) => ({
                          title: child.name,
                          url: `/parent/child/${
                              child.id
                          }${subItem.url.substring("/dashboard".length)}`,
                          icon: <User />,
                      })),
                  })),
              }
            : {
                  ...link,
                  items: mockChildren.map((child) => ({
                      title: child.name,
                      url: `/parent/child/${child.id}${link.url.substring(
                          "/dashboard".length
                      )}`,
                      icon: <User />,
                  })),
              }
    );

const isItemActive = (item: LinkItem, pathname: string): boolean =>
    pathname.startsWith(item.url) ||
    (item.items?.some((sub) => isItemActive(sub, pathname)) ?? false);

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

    const toggleAccordion = (key: string) =>
        setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));

    const handleNavClick = () => {
        if (isMobile) setOpenMobile(false);
    };

    return (
        <Sidebar>
            <SidebarContent className='px-2 py-3 space-y-3'>
                <SidebarGroup className='rounded-xl bg-muted/30 p-3'>
                    <SidebarGroupLabel className='text-lg font-semibold mb-2'>
                        Application
                    </SidebarGroupLabel>

                    <p className='text-sm py-2 px-3 bg-primary text-white rounded-lg mb-3 shadow'>
                        Current Session:{" "}
                        <span>
                            {new Date().getFullYear()} -{" "}
                            {new Date().getFullYear() + 1}
                        </span>
                    </p>

                    <SidebarGroupContent>
                        <SidebarMenu className='space-y-1'>
                            {Links.map((item) => {
                                const active = isItemActive(item, pathname);
                                const hasChildren = !!item.items?.length;

                                return (
                                    <SidebarMenuItem
                                        key={item.title}
                                        className='rounded-lg overflow-hidden'
                                    >
                                        {hasChildren ? (
                                            <div className='flex flex-col'>
                                                <button
                                                    onClick={() =>
                                                        toggleAccordion(
                                                            item.title
                                                        )
                                                    }
                                                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition ${
                                                        active
                                                            ? "bg-primary text-white shadow"
                                                            : "text-muted-foreground hover:bg-muted"
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
                                                    <div className='pl-3 border-l mt-1 space-y-1'>
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
                                                                                    className={`flex items-center justify-between w-full px-3 py-1 text-sm rounded-lg transition ${
                                                                                        subActive
                                                                                            ? "bg-muted font-medium"
                                                                                            : "text-muted-foreground hover:bg-muted/50"
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
                                                                                    <div className='pl-3 border-l mt-1 space-y-1'>
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
                                                                                                        `flex items-center gap-2 text-xs px-3 py-1 rounded-lg transition ${
                                                                                                            isActive
                                                                                                                ? "bg-primary text-white"
                                                                                                                : "text-muted-foreground hover:text-primary"
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
                                                                                    `flex items-center gap-2 px-3 py-1 text-sm rounded-lg transition ${
                                                                                        isActive
                                                                                            ? "bg-primary text-white"
                                                                                            : "text-muted-foreground hover:text-primary"
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
                                                        `flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                                                            isActive
                                                                ? "bg-primary text-white shadow"
                                                                : "text-muted-foreground hover:bg-muted"
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

export default AppSidebar;
