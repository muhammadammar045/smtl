import { Badge } from "@/components/ui/badge"; // Import Badge from shadcn
import Loader from "@/components/common/loader/Loader";
import { useGetAttendanceDetailsQuery } from "@/store/slices/attendance/attendance.slice";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface AttendanceDetailModalProps {
    month: string;
    year: number;
    onClose: () => void;
}

const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const AttendanceDetailModal: React.FC<AttendanceDetailModalProps> = ({
    month,
    year,
    onClose,
}) => {
    const { data, isLoading, isError } = useGetAttendanceDetailsQuery({
        month,
        year,
        search: "", // Optional: pass student ID if required
    });

    const attendanceData =
        data?.data?.table_data?.flatMap((monthData: any) =>
            monthData.weeks.flatMap((week: any) =>
                week.days.map((day: any) => ({
                    date: day.date,
                    dayName: new Date(day.date).toLocaleDateString("en-US", {
                        weekday: "long",
                    }),
                    status: day.status,
                    remarks: "", // Add remarks if available
                }))
            )
        ) ?? [];

    const groupedByDay: Record<
        string,
        { date: string; status: string; remarks: string }[]
    > = {};

    daysOfWeek.forEach((day) => {
        groupedByDay[day] = [];
    });

    attendanceData.forEach((entry) => {
        if (groupedByDay[entry.dayName]) {
            groupedByDay[entry.dayName].push({
                date: entry.date,
                status: entry.status,
                remarks: entry.remarks,
            });
        }
    });

    const maxLength = Math.max(
        1,
        ...Object.values(groupedByDay).map((arr) => arr.length)
    );

    const statusVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case "present":
                return "success";
            case "leave":
                return "outline";
            case "absent":
                return "destructive";
            case "weekend":
                return "secondary";
            default:
                return "default";
        }
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 md:p-10'>
            <div className='relative w-full max-w-5xl overflow-hidden rounded-3xl border border-border/60 bg-background/95 shadow-2xl shadow-black/20 backdrop-blur-sm'>
                {/* Close Button */}
                <button
                    className='absolute right-4 top-4 rounded-full border border-border/60 bg-background/80 p-2 text-muted-foreground transition hover:scale-105 hover:text-foreground'
                    onClick={onClose}
                    aria-label='Close modal'
                >
                    ✕
                </button>

                <div className='space-y-6 px-5 py-6 sm:px-8 sm:py-8'>
                    <header className='space-y-1 text-center sm:text-left'>
                        <h2 className='text-xl font-semibold text-primary sm:text-2xl'>
                            Attendance detail — {month} {year}
                        </h2>
                        <p className='text-sm text-muted-foreground sm:text-base'>
                            Review daily statuses to understand your attendance
                            pattern for the month.
                        </p>
                    </header>

                    {isLoading ? (
                        <div className='flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/10'>
                            <Loader
                                variant='dots'
                                size={36}
                            />
                        </div>
                    ) : isError || !data ? (
                        <div className='rounded-2xl border border-dashed border-border/60 bg-destructive/5 p-6 text-center text-sm text-destructive sm:text-base'>
                            We couldn&apos;t load the attendance detail this
                            time. Please try again shortly.
                        </div>
                    ) : (
                        <div className='overflow-x-auto'>
                            <Table className='min-w-[680px] rounded-2xl border border-border/60'>
                                <TableHeader>
                                    <TableRow className='bg-muted/30'>
                                        {daysOfWeek.map((day) => (
                                            <TableHead
                                                key={day}
                                                className='px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground sm:text-sm'
                                            >
                                                {day}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[...Array(maxLength)].map((_, rowIndex) => (
                                        <TableRow
                                            key={rowIndex}
                                            className='border-border/50'
                                        >
                                            {daysOfWeek.map((day) => {
                                                const dayEntry =
                                                    groupedByDay[day][rowIndex];
                                                return (
                                                    <TableCell
                                                        key={`${day}-${rowIndex}`}
                                                        className='h-full px-4 py-5 text-center align-top text-xs text-muted-foreground sm:text-sm'
                                                    >
                                                        {dayEntry ? (
                                                            <div className='space-y-2'>
                                                                <div className='text-sm font-semibold text-foreground'>
                                                                    {dayEntry.date}
                                                                </div>
                                                                <Badge
                                                                    className='px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]'
                                                                    variant={statusVariant(
                                                                        dayEntry.status
                                                                    )}
                                                                >
                                                                    {dayEntry.status}
                                                                </Badge>
                                                            </div>
                                                        ) : (
                                                            <span className='text-muted-foreground/60'>
                                                                —
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendanceDetailModal;
