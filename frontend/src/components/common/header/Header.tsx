import { Link, useNavigate } from "react-router-dom";
import { Calendar, UserCircle, ListTodo } from "lucide-react";
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
        login: { title: string; url: string };
        signup: { title: string; url: string };
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

    const currentSession = `${new Date().getFullYear()}-${
        new Date().getFullYear() + 1
    }`;
    const todayDate = new Date().toDateString();

    return (
        <header className='h-[100px] w-full bg-background shadow-md relative z-50'>
            <div className='h-full w-full px-4 flex items-center'>
                {/* Desktop Header */}
                <nav className='hidden justify-between w-full lg:flex'>
                    {/* Left Section: Logo + School Info */}
                    <div className='flex items-center gap-6'>
                        <Link
                            to={logo.url}
                            className='flex items-center gap-3'
                        >
                            <img
                                src={logo.src}
                                className='max-h-20'
                                alt={logo.alt}
                            />
                        </Link>
                        <div className='flex flex-col leading-snug'>
                            <h2 className='text-2xl font-bold'>{logo.title}</h2>
                            <p className='text-sm'>
                                <span className='text-primary font-semibold'>
                                    Current Session:
                                </span>{" "}
                                {currentSession}
                            </p>
                            <p className='text-sm'>
                                <span className='text-primary font-semibold'>
                                    Today:
                                </span>{" "}
                                {todayDate}
                            </p>
                        </div>
                    </div>

                    {/* Right Section: Action Icons */}
                    <div className='flex items-center gap-3'>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <ModeToggle />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Theme</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant='ghost'
                                        size='icon'
                                        className='hover:bg-accent rounded-full'
                                        onClick={() =>
                                            navigate("/dashboard/todo")
                                        }
                                    >
                                        <ListTodo className='h-5 w-5' />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Todo List</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant='ghost'
                                        size='icon'
                                        className='hover:bg-accent rounded-full'
                                        onClick={() =>
                                            navigate("/dashboard/calendar")
                                        }
                                    >
                                        <Calendar className='h-5 w-5' />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Calendar</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant='ghost'
                                        size='icon'
                                        className='hover:bg-accent rounded-full'
                                        onClick={() =>
                                            (window.location.href =
                                                "/dashboard/profile")
                                        }
                                    >
                                        <UserCircle className='h-5 w-5' />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Profile</p>
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
                <div className='flex items-center justify-between w-full lg:hidden'>
                    {/* Logo */}
                    <Link
                        to={logo.url}
                        className='flex items-center gap-2'
                    >
                        <img
                            src={logo.src}
                            className='max-h-10'
                            alt={logo.alt}
                        />
                    </Link>

                    {/* Mobile Actions */}
                    <div className='flex items-center gap-2'>
                        <Button
                            variant='ghost'
                            size='icon'
                            className='hover:bg-accent rounded-full'
                            onClick={() => navigate("/dashboard/todo")}
                        >
                            <ListTodo className='h-5 w-5' />
                        </Button>
                        <Button
                            variant='ghost'
                            size='icon'
                            className='hover:bg-accent rounded-full'
                            onClick={() => navigate("/dashboard/calendar")}
                        >
                            <Calendar className='h-5 w-5' />
                        </Button>
                        <Button
                            variant='ghost'
                            size='icon'
                            className='hover:bg-accent rounded-full'
                            onClick={() =>
                                (window.location.href = "/dashboard/profile")
                            }
                        >
                            <UserCircle className='h-5 w-5' />
                        </Button>

                        {/* Mobile Menu Button */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    className='rounded-full'
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
