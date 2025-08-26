import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { Calendar, UserCircle, ListTodo } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/contexts/themeContext/toggleButton";

interface MenuItem {
    title: string;
    url: string;
    description?: string;
    icon?: React.ReactNode;
    items?: MenuItem[];
}

interface HeaderProps {
    logo?: {
        url: string;
        src: string;
        alt: string;
        title: string;
    };
    menu?: MenuItem[];
    auth?: {
        login: {
            title: string;
            url: string;
        };
        signup: {
            title: string;
            url: string;
        };
    };
}

export const Header = ({
    logo = {
        url: "/dashboard",
        src: "/logo.png",
        alt: "logo",
        title: "Air Foundation School System",
    },
}: HeaderProps) => {
    const navigate = useNavigate();

    const currentYear = new Date().getFullYear();

    return (
        <header className='h-[100px] w-full bg-background border-b shadow-sm sticky top-0 z-50'>
            <div className='h-full w-full px-4 flex items-center justify-between max-w-7xl mx-auto'>
                {/* Desktop Header */}
                <nav className='hidden lg:flex items-center justify-between w-full'>
                    {/* Logo and School Info */}
                    <div className='flex items-center gap-6'>
                        <Link
                            to={logo.url}
                            className='flex items-center gap-3'
                        >
                            <img
                                src={logo.src}
                                className='h-16'
                                alt={logo.alt}
                            />
                        </Link>
                        <div className='flex flex-col'>
                            <h1 className='text-xl font-semibold text-foreground'>
                                {logo.title}
                            </h1>
                            <p className='text-sm text-muted-foreground'>
                                <span className='font-medium text-primary'>
                                    Current Session:
                                </span>{" "}
                                {currentYear}-{currentYear + 1}
                            </p>
                            <p className='text-sm text-muted-foreground'>
                                <span className='font-medium text-primary'>
                                    Today:
                                </span>{" "}
                                {new Date().toDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className='flex items-center gap-3'>
                        <TooltipProvider>
                            {[
                                {
                                    icon: <ListTodo className='h-5 w-5' />,
                                    label: "Todo List",
                                    onClick: () => navigate("/dashboard/todo"),
                                },
                                {
                                    icon: <Calendar className='h-5 w-5' />,
                                    label: "Calendar",
                                    onClick: () =>
                                        navigate("/dashboard/calendar"),
                                },
                                {
                                    icon: <UserCircle className='h-5 w-5' />,
                                    label: "Profile",
                                    onClick: () =>
                                        (window.location.href =
                                            "/dashboard/profile"),
                                },
                            ].map(({ icon, label, onClick }, index) => (
                                <Tooltip key={index}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant='ghost'
                                            size='icon'
                                            onClick={onClick}
                                            className='hover:bg-muted'
                                        >
                                            {icon}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{label}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ))}

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <ModeToggle />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Toggle Theme</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <SidebarTrigger />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Sidebar</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </nav>

                {/* Mobile Header */}
                <div className='flex lg:hidden items-center justify-between w-full'>
                    <Link
                        to={logo.url}
                        className='flex items-center gap-2'
                    >
                        <img
                            src={logo.src}
                            className='h-10'
                            alt={logo.alt}
                        />
                    </Link>
                    <div className='flex items-center gap-2'>
                        {[<ListTodo />, <Calendar />, <UserCircle />].map(
                            (Icon, i) => (
                                <Button
                                    key={i}
                                    variant='ghost'
                                    size='icon'
                                    className='hover:bg-muted'
                                >
                                    <Icon.type className='h-5 w-5' />
                                </Button>
                            )
                        )}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant='outline'
                                    size='icon'
                                >
                                    <SidebarTrigger />
                                </Button>
                            </SheetTrigger>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
};
