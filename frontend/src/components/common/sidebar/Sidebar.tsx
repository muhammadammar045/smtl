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
} from "@/components/ui/sidebar";
import { useAppSelector } from "@/store/hooks/hooks";
import { selectAuthRole } from "@/store/slices/auth/auth.slice";

const mockChildren = [
    {
        id: "1",
        name: "Muhammad Senan",
    },
    {
        id: "2",
        name: "Muhammad Ammar",
    },
    {
        id: "3",
        name: "Muhammad Maaz",
    },
];

interface LinkItem {
    title: string;
    url: string;
    icon: React.ReactNode;
    items?: LinkItem[];
}

const studentLinks: LinkItem[] = [
    {
        title: "My Profile",
        url: "/dashboard/profile",
        icon: <Users />,
    },
    {
        title: "Notice Board",
        url: "/dashboard/notice-board",
        icon: <Bell />,
    },
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
    {
        title: "IN/OUT Time Log",
        url: "/dashboard/time-log",
        icon: <Clock />,
    },
    {
        title: "Diary",
        url: "/dashboard/diary",
        icon: <FileText />,
    },
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
    {
        title: "Subjects",
        url: "/dashboard/subjects",
        icon: <BookOpen />,
    },
    {
        title: "Transport Routes",
        url: "/dashboard/transport",
        icon: <Bus />,
    },
];

const generateParentLinks = (): LinkItem[] => {
    return studentLinks.map((link) => {
        const newLink: LinkItem = {
            title: link.title,
            url: link.url,
            icon: link.icon,
        };

        if (link.items) {
            newLink.items = link.items.map((subItem) => ({
                ...subItem,
                // Add children to each sub-item
                items: mockChildren.map((child) => ({
                    title: child.name,
                    url: `/parent/child/${child.id}${subItem.url.substring(
                        "/dashboard".length
                    )}`,
                    icon: <User />,
                })),
            }));
        } else {
            // For simple links, add children directly
            newLink.items = mockChildren.map((child) => ({
                title: child.name,
                url: `/parent/child/${child.id}${link.url.substring(
                    "/dashboard".length
                )}`,
                icon: <User />,
            }));
        }

        return newLink;
    });
};

const isItemActive = (item: LinkItem, pathname: string) => {
    if (item.url && pathname.startsWith(item.url)) {
        return true;
    }
    if (item.items) {
        return item.items.some((subItem: LinkItem) =>
            pathname.startsWith(subItem.url)
        );
    }
    return false;
};

export function AppSidebar() {
    const location = useLocation();
    const role = useAppSelector(selectAuthRole);

    const Links = useMemo(
        () => (role?.parent ? generateParentLinks() : studentLinks),
        [role]
    );

    const [openAccordions, setOpenAccordions] = useState<
        Record<string, boolean>
    >({});

    const toggleAccordion = (title: string) => {
        setOpenAccordions((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <p className='text-sm py-3 text-start px-4 mb-2 bg-primary'>
                        Current Session : <span>2023-2024</span>
                    </p>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {Links.map((item) => {
                                const active = isItemActive(
                                    item,
                                    location.pathname
                                );
                                const hasChildren =
                                    item.items && item.items.length > 0;

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
                                                    className={`flex items-center justify-between w-full px-2 py-2 text-muted-foreground hover:no-underline ${
                                                        active
                                                            ? "bg-primary text-foreground rounded-md"
                                                            : ""
                                                    }`}
                                                >
                                                    <div className='flex items-center gap-2'>
                                                        {item.icon}
                                                        <span>
                                                            {item.title}
                                                        </span>
                                                    </div>
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
                                                    <div className='pl-6'>
                                                        {item.items?.map(
                                                            (subItem) => {
                                                                const subHasChildren =
                                                                    subItem.items &&
                                                                    subItem
                                                                        .items
                                                                        .length >
                                                                        0;

                                                                return (
                                                                    <div
                                                                        key={
                                                                            subItem.title
                                                                        }
                                                                        className='mt-1'
                                                                    >
                                                                        {subHasChildren ? (
                                                                            <div className='flex flex-col'>
                                                                                <button
                                                                                    onClick={() =>
                                                                                        toggleAccordion(
                                                                                            subItem.title
                                                                                        )
                                                                                    }
                                                                                    className={`flex items-center justify-between w-full px-2 py-2 text-sm text-muted-foreground hover:no-underline ${
                                                                                        isItemActive(
                                                                                            subItem,
                                                                                            location.pathname
                                                                                        )
                                                                                            ? "text-primary rounded-md"
                                                                                            : ""
                                                                                    }`}
                                                                                >
                                                                                    <div className='flex items-center gap-2'>
                                                                                        {
                                                                                            subItem.icon
                                                                                        }
                                                                                        <span>
                                                                                            {
                                                                                                subItem.title
                                                                                            }
                                                                                        </span>
                                                                                    </div>
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
                                                                                    <div className='pl-4'>
                                                                                        {subItem.items?.map(
                                                                                            (
                                                                                                childItem
                                                                                            ) => (
                                                                                                <NavLink
                                                                                                    key={
                                                                                                        childItem.title
                                                                                                    }
                                                                                                    to={
                                                                                                        childItem.url
                                                                                                    }
                                                                                                    className={({
                                                                                                        isActive,
                                                                                                    }) =>
                                                                                                        `flex items-center gap-2 py-1 px-2 text-xs hover:text-primary ${
                                                                                                            isActive
                                                                                                                ? "text-primary rounded-md"
                                                                                                                : "text-muted-foreground"
                                                                                                        }`
                                                                                                    }
                                                                                                >
                                                                                                    {
                                                                                                        childItem.icon
                                                                                                    }
                                                                                                    <span>
                                                                                                        {
                                                                                                            childItem.title
                                                                                                        }
                                                                                                    </span>
                                                                                                </NavLink>
                                                                                            )
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            <NavLink
                                                                                to={
                                                                                    subItem.url
                                                                                }
                                                                                className={({
                                                                                    isActive,
                                                                                }) =>
                                                                                    `flex items-center gap-2 py-1 px-2 text-sm hover:text-primary ${
                                                                                        isActive
                                                                                            ? "text-primary rounded-md"
                                                                                            : "text-muted-foreground"
                                                                                    }`
                                                                                }
                                                                            >
                                                                                {
                                                                                    subItem.icon
                                                                                }
                                                                                <span>
                                                                                    {
                                                                                        subItem.title
                                                                                    }
                                                                                </span>
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
                                                    className={`flex items-center gap-2 py-2 hover:text-foreground ${
                                                        active
                                                            ? "bg-primary text-foreground rounded-md px-2"
                                                            : "text-muted-foreground"
                                                    }`}
                                                >
                                                    {item.icon}
                                                    <span>{item.title}</span>
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
