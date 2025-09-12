import {
    Bell,
    Book,
    BookCopy,
    BookOpen,
    Bus,
    Calendar,
    CalendarSearchIcon,
    ChevronDown,
    ClipboardList,
    Clock,
    Download,
    FileText,
    Sun,
    User,
    Users,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { useEffect, useMemo, useState } from "react";

import { selectAuth } from "@/store/slices/auth/auth.slice";
import { useAppSelector } from "@/store/hooks/hooks";

// Mocked children
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
        url: "/dashboard/exams/schedule",
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
        url: "/dashboard/downloads/timetable",
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

// recursively check if active
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

    useEffect(() => {
        const expandActiveItems = (
            items: LinkItem[],
            acc: Record<string, boolean> = {}
        ) => {
            items.forEach((item) => {
                if (isItemActive(item, pathname)) {
                    acc[item.title] = true;
                    if (item.items) {
                        expandActiveItems(item.items, acc);
                    }
                }
            });
            return acc;
        };
        setOpenAccordions(expandActiveItems(Links));
    }, [pathname, Links]);

    return (
        <Sidebar>
            <SidebarContent className='px-2 py-3 space-y-3'>
                <SidebarGroup className='rounded-xl bg-card shadow-sm border border-border p-3'>
                    <SidebarGroupLabel className='text-lg font-semibold mb-3 text-card-foreground'>
                        Application
                    </SidebarGroupLabel>

                    <p className='bg-primary text-sm text-primary-foreground py-2 px-3 rounded-lg mb-4 shadow-sm'>
                        Current Session:{" "}
                        <span className='font-semibold'>
                            {new Date().getFullYear()} -{" "}
                            {new Date().getFullYear() + 1}
                        </span>
                    </p>

                    <SidebarGroupContent>
                        <SidebarMenu className='space-y-1'>
                            {Links.map((item) => {
                                const hasChildren = !!item.items?.length;
                                const active = isItemActive(item, pathname);

                                return (
                                    <SidebarMenuItem
                                        key={item.title}
                                        className='rounded-lg overflow-hidden'
                                    >
                                        <div className='flex flex-col'>
                                            <div className='flex items-center justify-between w-full'>
                                                <NavLink
                                                    to={item.url}
                                                    onClick={handleNavClick}
                                                    className={({ isActive }) =>
                                                        `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors w-full 
                            ${
                                isActive || active
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "hover:bg-muted hover:text-foreground"
                            }`
                                                    }
                                                >
                                                    {item.icon}
                                                    {item.title}
                                                </NavLink>
                                                {hasChildren && (
                                                    <button
                                                        onClick={() =>
                                                            toggleAccordion(
                                                                item.title
                                                            )
                                                        }
                                                        className='px-2 text-muted-foreground hover:text-foreground transition-colors'
                                                    >
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
                                                )}
                                            </div>

                                            {hasChildren &&
                                                openAccordions[item.title] && (
                                                    <div className='pl-3 border-l border-border mt-1 space-y-1'>
                                                        {item.items?.map(
                                                            (subItem) => {
                                                                const subActive =
                                                                    isItemActive(
                                                                        subItem,
                                                                        pathname
                                                                    );
                                                                const subHasChildren =
                                                                    !!subItem
                                                                        .items
                                                                        ?.length;

                                                                return (
                                                                    <div
                                                                        key={
                                                                            subItem.title
                                                                        }
                                                                        className='flex flex-col'
                                                                    >
                                                                        <div className='flex items-center justify-between w-full'>
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
                                                                                    `flex items-center gap-2 px-3 py-1 text-sm rounded-lg transition-colors w-full 
                                      ${
                                          isActive || subActive
                                              ? "bg-primary text-primary-foreground shadow-sm"
                                              : "hover:bg-muted hover:text-foreground"
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
                                                                            {subHasChildren && (
                                                                                <button
                                                                                    onClick={() =>
                                                                                        toggleAccordion(
                                                                                            subItem.title
                                                                                        )
                                                                                    }
                                                                                    className='px-2 text-muted-foreground hover:text-foreground transition-colors'
                                                                                >
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
                                                                            )}
                                                                        </div>

                                                                        {subHasChildren &&
                                                                            openAccordions[
                                                                                subItem
                                                                                    .title
                                                                            ] && (
                                                                                <div className='pl-3 border-l border-border mt-1 space-y-1'>
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
                                                                                                    `flex items-center gap-2 text-xs px-3 py-1 rounded-lg transition-colors 
                                          ${
                                              isActive
                                                  ? "bg-primary text-primary-foreground shadow-sm"
                                                  : "hover:bg-muted hover:text-foreground"
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
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                )}
                                        </div>
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
