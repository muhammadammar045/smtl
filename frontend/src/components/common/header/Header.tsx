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
    return (
        <section className='h-[100px] w-full bg-background border-b relative'>
            <div className='h-full w-full px-4 flex items-center'>
                {/* Desktop Menu */}
                <nav className='hidden justify-between w-full lg:flex'>
                    <div className='flex items-center gap-6'>
                        {/* Logo */}
                        <Link
                            to={logo.url}
                            className='flex items-center gap-2'
                        >
                            <img
                                src={logo.src}
                                className='max-h-24 '
                                alt={logo.alt}
                            />
                        </Link>
                        <div className='flex flex-col'>
                            <h2 className='text-2xl font-bold'>
                                Air Foundation School System
                            </h2>
                            <p className='text-sm'>
                                <span className='text-primary font-bold'>
                                    Current Session :
                                </span>{" "}
                                <span>
                                    {new Date().getFullYear()}-
                                    {new Date().getFullYear() + 1}
                                </span>
                            </p>
                            <p className='text-sm'>
                                <span className='text-primary font-bold'>
                                    Today Date :
                                </span>{" "}
                                <span>{new Date().toDateString()}</span>
                            </p>
                        </div>
                    </div>

                    {/* New Icons Section */}
                    <div className='flex items-center gap-4'>
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
                                        className='hover:bg-accent'
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
                                        className='hover:bg-accent'
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
                                        className='hover:bg-accent'
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

                {/* Mobile Menu */}
                <div className='block w-full lg:hidden'>
                    <div className='flex items-center justify-between'>
                        {/* Logo */}
                        <Link
                            to={logo.url}
                            className='flex items-center gap-2'
                        >
                            <img
                                src={logo.src}
                                className='max-h-8'
                                alt={logo.alt}
                            />
                        </Link>
                        <div className='flex items-center gap-2'>
                            {/* Mobile Icons */}
                            <Button
                                variant='ghost'
                                size='icon'
                                className='hover:bg-accent'
                            >
                                <ListTodo className='h-5 w-5' />
                            </Button>
                            <Button
                                variant='ghost'
                                size='icon'
                                className='hover:bg-accent'
                            >
                                <Calendar className='h-5 w-5' />
                            </Button>
                            <Button
                                variant='ghost'
                                size='icon'
                                className='hover:bg-accent'
                            >
                                <UserCircle className='h-5 w-5' />
                            </Button>

                            {/* Mobile Menu Button */}
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
            </div>
        </section>
    );
};
