import { useEffect, useState } from "react";
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
} from "lucide-react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

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

const mockChildren = [
    {
        id: "1",
        name: "Muhammad Senan",
        rollNumber: "afsss-B17-00093",
    },
    {
        id: "2",
        name: "Muhammad Ammar",
        rollNumber: "affss-B17-00094",
    },
    {
        id: "3",
        name: "Muhammad Maaz",
        rollNumber: "afsas-B17-00094",
    },
];

// Check if current user is parent (in real app, get from auth context)
const isParent = window.location.pathname.includes("/parent");

const studentLinks = [
    {
        title: "My Profile",
        url: "/dashboard/profile",
        icon: Users,
    },
    {
        title: "Notice Board",
        url: "/dashboard/notice-board",
        icon: Bell,
    },
    {
        title: "Attendance",
        url: "/dashboard/attendance",
        icon: ClipboardList,
    },
    {
        title: "Live Classes",
        url: "/dashboard/live-classes",
        icon: BookOpen,
    },
    {
        title: "IN/OUT Time Log",
        url: "/dashboard/time-log",
        icon: Clock,
    },
    {
        title: "Diary",
        url: "/dashboard/diary",
        icon: FileText,
    },
    {
        title: "Examinations",
        url: "/dashboard/examinations",
        icon: FileText,
        items: [
            {
                title: "Exam Schedule",
                url: "/dashboard/exams/schedule",
                icon: CalendarSearchIcon,
            },
            {
                title: "Exam Results",
                url: "/dashboard/exams/results",
                icon: FileText,
            },
            {
                title: "Progress Report",
                url: "/dashboard/progress/report",
                icon: FileText,
            },
        ],
    },
    {
        title: "Download Center",
        url: "/dashboard/downloads",
        icon: Download,
        items: [
            {
                title: "Time Table",
                url: "/dashboard/downloads/timetable",
                icon: Calendar,
            },
            {
                title: "Homework",
                url: "/dashboard/downloads/homework",
                icon: BookCopy,
            },
            {
                title: "Study Material",
                url: "/dashboard/downloads/study-material",
                icon: Book,
            },
            {
                title: "Syllabus",
                url: "/dashboard/downloads/syllabus",
                icon: FileText,
            },
            {
                title: "Summer Tasks",
                url: "/dashboard/downloads/summer-tasks",
                icon: Sun,
            },
        ],
    },
    {
        title: "Subjects",
        url: "/dashboard/subjects",
        icon: BookOpen,
    },
    {
        title: "Transport Routes",
        url: "/dashboard/transport",
        icon: Bus,
    },
];

const generateParentLinks = () => {
    const links: LinkItem[] = [];

    mockChildren.forEach((child) => {
        links.push({
            title: child.name,
            url: `/parent/child/${child.id}`,
            icon: User,
            items: [
                {
                    title: "Profile",
                    url: `/parent/child/${child.id}/profile`,
                    icon: Users,
                },
                {
                    title: "Notice Board",
                    url: `/parent/child/${child.id}/notice-board`,
                    icon: Bell,
                },
                {
                    title: "Attendance",
                    url: `/parent/child/${child.id}/attendance`,
                    icon: ClipboardList,
                },
                {
                    title: "Live Classes",
                    url: `/parent/child/${child.id}/live-classes`,
                    icon: BookOpen,
                },
                {
                    title: "IN/OUT Time Log",
                    url: `/parent/child/${child.id}/time-log`,
                    icon: Clock,
                },
                {
                    title: "Diary",
                    url: `/parent/child/${child.id}/diary`,
                    icon: FileText,
                },
                {
                    title: "Examinations",
                    url: `/parent/child/${child.id}/examinations`,
                    icon: FileText,
                    items: [
                        {
                            title: "Exam Schedule",
                            url: `/parent/child/${child.id}/exams/schedule`,
                            icon: CalendarSearchIcon,
                        },
                        {
                            title: "Exam Results",
                            url: `/parent/child/${child.id}/exams/results`,
                            icon: FileText,
                        },
                        {
                            title: "Progress Report",
                            url: `/parent/child/${child.id}/progress/report`,
                            icon: FileText,
                        },
                    ],
                },
            ],
        });
    });

    return links;
};

const Links = isParent ? generateParentLinks() : studentLinks;

interface LinkItem {
    title: string;
    url: string;
    icon: React.ComponentType;
    items?: LinkItem[];
}

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
    const [openAccordion, setOpenAccordion] = useState<string | undefined>(
        undefined
    );

    useEffect(() => {
        // when URL changes, auto open correct accordion
        const activeItem = Links.find((item) =>
            isItemActive(item, location.pathname)
        );
        if (activeItem && activeItem.items) {
            setOpenAccordion(activeItem.title);
        } else {
            setOpenAccordion(undefined);
        }
    }, [location.pathname]);

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <p className='text-sm py-3 text-start px-4 bg-primary'>
                        Current Session : <span>2023-2024</span>
                    </p>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {Links.map((item) => {
                                const active = isItemActive(
                                    item,
                                    location.pathname
                                );

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        {item.items ? (
                                            <Accordion
                                                type='single'
                                                collapsible
                                                value={openAccordion}
                                                onValueChange={setOpenAccordion}
                                            >
                                                <AccordionItem
                                                    key={item.title}
                                                    value={item.title}
                                                    className='border-none'
                                                >
                                                    <AccordionTrigger
                                                        className={`px-2 py-2 hover:no-underline ${
                                                            active
                                                                ? "bg-primary text-foreground rounded-md"
                                                                : ""
                                                        }`}
                                                    >
                                                        <div className='flex items-center gap-2'>
                                                            <item.icon className='h-4 w-4' />
                                                            <span>
                                                                {item.title}
                                                            </span>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className='flex flex-col gap-2 px-3'>
                                                            {item.items.map(
                                                                (subItem) => (
                                                                    <NavLink
                                                                        key={
                                                                            subItem.title
                                                                        }
                                                                        to={
                                                                            subItem.url
                                                                        }
                                                                        className={({
                                                                            isActive,
                                                                        }) =>
                                                                            `flex items-center gap-2 py-2 text-sm hover:text-foreground ${
                                                                                isActive
                                                                                    ? "bg-primary text-foreground rounded-md px-2"
                                                                                    : "text-muted-foreground"
                                                                            }`
                                                                        }
                                                                    >
                                                                        <subItem.icon className='h-4 w-4' />
                                                                        <span>
                                                                            {
                                                                                subItem.title
                                                                            }
                                                                        </span>
                                                                    </NavLink>
                                                                )
                                                            )}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
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
                                                    <item.icon className='h-4 w-4' />
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
