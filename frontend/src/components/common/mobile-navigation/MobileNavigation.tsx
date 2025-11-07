import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { selectAuth } from "@/store/slices/auth/auth.slice";
import { useAppSelector } from "@/store/hooks/hooks";
import {
    Bell,
    Book,
    BookCopy,
    BookOpen,
    Bus,
    Calendar,
    CalendarSearchIcon,
    ChevronLeft,
    ClipboardList,
    Clock,
    Download,
    FileText,
    Sun,
    User,
    Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

export function MobileNavigation() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const user = useAppSelector(selectAuth);
    const role = user?.role;
    const isMobile = useIsMobile();

    const Links = useMemo(
        () => (role === "parent" ? generateParentLinks() : studentLinks),
        [role]
    );

    // Navigation stack to handle nested items
    const [navStack, setNavStack] = useState<LinkItem[][]>([Links]);
    const currentItems = navStack[navStack.length - 1];
    const isNested = navStack.length > 1;

    // Check if we're on the dashboard home page (show navigation) or on a specific page (hide navigation)
    const isDashboardHome = pathname === "/dashboard" || pathname === "/parent";
    const showNavigation = isDashboardHome;

    // Reset navigation stack when Links change
    useEffect(() => {
        setNavStack([Links]);
    }, [Links]);

    const handleItemClick = (item: LinkItem) => {
        if (item.items && item.items.length > 0) {
            // If item has children, show them without leaving the navigation
            setNavStack((prev) => [...prev, item.items!]);
            return;
        }

        // Leaf items navigate away from the navigation overlay
        navigate(item.url);
        setNavStack([Links]);
    };

    const handleBack = () => {
        if (navStack.length > 1) {
            setNavStack((prev) => prev.slice(0, -1));
        }
    };

    const handleBackToNavigation = () => {
        // Navigate back to dashboard home to show navigation
        if (role === "parent") {
            navigate("/parent");
        } else {
            navigate("/dashboard");
        }
        setNavStack([Links]);
    };

    // Only show on mobile
    if (!isMobile) {
        return null;
    }

    // Show full-screen navigation when on dashboard home
    if (showNavigation) {
        return (
            <div className="fixed inset-0 z-50 bg-background md:hidden flex flex-col">
                {/* Back Button - Only show when in nested view */}
                {isNested && (
                    <div className="px-4 pt-4 pb-3 border-b border-border">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleBack}
                            className="flex items-center gap-2 w-full justify-start"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Back
                        </Button>
                    </div>
                )}

                {/* Card Grid - Full screen */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {currentItems.map((item) => {
                            const hasChildren = !!item.items?.length;
                            const isActive = pathname === item.url || pathname.startsWith(item.url + "/");

                            return (
                                <Card
                                    key={item.title}
                                    onClick={() => handleItemClick(item)}
                                    className={cn(
                                        "cursor-pointer p-4 flex flex-col items-center justify-center gap-2 min-h-[120px] transition-all",
                                        isActive
                                            ? "bg-primary text-primary-foreground border-primary shadow-lg"
                                            : "hover:shadow-lg hover:border-primary/50"
                                    )}
                                >
                                    <div className={cn(
                                        "flex items-center justify-center text-2xl",
                                        isActive ? "text-primary-foreground" : "text-primary"
                                    )}>
                                        {item.icon}
                                    </div>
                                    <span className={cn(
                                        "text-sm font-medium text-center leading-tight",
                                        isActive ? "text-primary-foreground" : "text-foreground"
                                    )}>
                                        {item.title}
                                    </span>
                                    {hasChildren && (
                                        <span className={cn(
                                            "text-xs mt-auto",
                                            isActive ? "text-primary-foreground/70" : "text-muted-foreground"
                                        )}>
                                            {item.items?.length} items
                                        </span>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // Show back button when on a page (not on dashboard home)
    return (
        <Button
            variant="default"
            size="lg"
            onClick={handleBackToNavigation}
            className="fixed bottom-4 left-4 right-4 z-50 md:hidden shadow-lg"
        >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Navigation
        </Button>
    );
}

