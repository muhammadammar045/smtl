import { PageTitle } from "@/components/common/parts/BreadCrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    time: string;
}

function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<"Month" | "Week" | "Day">("Month");

    // Time slots for Day and Week views
    const timeSlots = Array.from({ length: 24 }, (_, i) => {
        const hour = i % 12 || 12;
        const ampm = i < 12 ? "am" : "pm";
        return `${hour}${ampm}`;
    });

    // Get calendar data for month view
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const days = [];
        const startPadding = firstDay.getDay();

        for (let i = 0; i < startPadding; i++) {
            const prevDate = new Date(year, month, -i);
            days.unshift({ date: prevDate, isCurrentMonth: false });
        }

        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push({ date: new Date(year, month, i), isCurrentMonth: true });
        }

        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                date: new Date(year, month + 1, i),
                isCurrentMonth: false,
            });
        }

        return days;
    };

    // Get days for week view
    const getDaysInWeek = (date: Date) => {
        const week = [];
        const first = date.getDate() - date.getDay();

        for (let i = 0; i < 7; i++) {
            const day = new Date(
                date.getFullYear(),
                date.getMonth(),
                first + i
            );
            week.push({
                date: day,
                isCurrentMonth: day.getMonth() === date.getMonth(),
            });
        }

        return week;
    };

    const navigate = (direction: "prev" | "next") => {
        const newDate = new Date(currentDate);
        switch (view) {
            case "Month":
                newDate.setMonth(
                    currentDate.getMonth() + (direction === "next" ? 1 : -1)
                );
                break;
            case "Week":
                newDate.setDate(
                    currentDate.getDate() + (direction === "next" ? 7 : -7)
                );
                break;
            case "Day":
                newDate.setDate(
                    currentDate.getDate() + (direction === "next" ? 1 : -1)
                );
                break;
        }
        setCurrentDate(newDate);
    };

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Sample events
    const events: CalendarEvent[] = [
        {
            id: "1",
            title: "Meeting",
            date: new Date(2025, 3, 1),
            time: "12a",
        },
        {
            id: "2",
            title: "Presentation",
            date: new Date(2025, 3, 17),
            time: "12a",
        },
    ];

    const renderMonthView = () => {
        const days = getDaysInMonth(currentDate);
        return (
            <div className='grid grid-cols-7 gap-px bg-muted'>
                {daysOfWeek.map((day) => (
                    <div
                        key={day}
                        className='p-2 text-center font-medium'
                    >
                        {day}
                    </div>
                ))}

                {days.map((day, index) => {
                    const dayEvents = events.filter(
                        (event) =>
                            event.date.toDateString() ===
                            day.date.toDateString()
                    );

                    return (
                        <div
                            key={index}
                            className={`min-h-[100px] p-1 border ${
                                day.isCurrentMonth
                                    ? "bg-background"
                                    : "bg-muted/50"
                            }`}
                        >
                            <span
                                className={`text-sm ${
                                    day.isCurrentMonth
                                        ? ""
                                        : "text-muted-foreground"
                                }`}
                            >
                                {day.date.getDate()}
                            </span>

                            {dayEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className='mt-1 p-1 text-xs bg-black text-white rounded'
                                >
                                    {event.time} {event.title}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderWeekView = () => {
        const days = getDaysInWeek(currentDate);
        return (
            <div className='grid grid-cols-8 gap-px bg-muted h-[600px] overflow-y-auto'>
                <div className='sticky top-0 bg-background'></div>
                {days.map((day, index) => (
                    <div
                        key={index}
                        className='sticky top-0 bg-background p-2 text-center'
                    >
                        <div className='font-medium'>{daysOfWeek[index]}</div>
                        <div className='text-sm'>{day.date.getDate()}</div>
                    </div>
                ))}

                {timeSlots.map((time, i) => (
                    <>
                        <div
                            key={`time-${i}`}
                            className='p-2 border-t text-sm'
                        >
                            {time}
                        </div>
                        {days.map((day, j) => (
                            <div
                                key={`slot-${i}-${j}`}
                                className='border-t border-l p-1 min-h-[60px]'
                            >
                                {/* Event slot s */}
                            </div>
                        ))}
                    </>
                ))}
            </div>
        );
    };

    const renderDayView = () => {
        return (
            <div className='grid grid-cols-1 gap-px bg-muted h-[600px] overflow-y-auto'>
                <div className='text-center p-2 font-medium sticky top-0 bg-background'>
                    {currentDate.toLocaleDateString("default", {
                        weekday: "long",
                    })}
                </div>

                {timeSlots.map((time, i) => (
                    <div
                        key={i}
                        className='grid grid-cols-[100px_1fr] border-t'
                    >
                        <div className='p-2 text-sm'>{time}</div>
                        <div className='border-l p-1 min-h-[60px]'>
                            {/* Event slots */}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className='space-y-4'>
            <PageTitle
                title='Calendar'
                description=''
            />

            <Card className='p-4'>
                <div className='flex justify-between items-center mb-4'>
                    <div className='flex items-center gap-2'>
                        <Button
                            variant='outline'
                            onClick={() => setCurrentDate(new Date())}
                        >
                            Today
                        </Button>
                        <div className='flex items-center gap-1'>
                            <Button
                                size='icon'
                                variant='outline'
                                onClick={() => navigate("prev")}
                            >
                                <ChevronLeft className='h-4 w-4' />
                            </Button>
                            <Button
                                size='icon'
                                variant='outline'
                                onClick={() => navigate("next")}
                            >
                                <ChevronRight className='h-4 w-4' />
                            </Button>
                        </div>
                        <h2 className='text-xl font-semibold'>
                            {currentDate.toLocaleString("default", {
                                month: "long",
                                year: "numeric",
                                ...(view !== "Month" && { day: "numeric" }),
                            })}
                        </h2>
                    </div>

                    <div className='flex gap-2'>
                        <Button
                            variant={view === "Month" ? "default" : "outline"}
                            onClick={() => setView("Month")}
                        >
                            Month
                        </Button>
                        <Button
                            variant={view === "Week" ? "default" : "outline"}
                            onClick={() => setView("Week")}
                        >
                            Week
                        </Button>
                        <Button
                            variant={view === "Day" ? "default" : "outline"}
                            onClick={() => setView("Day")}
                        >
                            Day
                        </Button>
                    </div>
                </div>

                {view === "Month" && renderMonthView()}
                {view === "Week" && renderWeekView()}
                {view === "Day" && renderDayView()}
            </Card>
        </div>
    );
}

export default Calendar;
