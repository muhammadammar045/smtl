import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge"; // Import Badge from shadcn
import Loader from "@/components/common/loader/Loader";
import { useGetAttendanceDetailsQuery } from "@/store/slices/attendance/attendance.slice";

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

    if (isLoading) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Attendance Detail
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-8 flex justify-center items-center'>
                    <Loader
                        variant='dots'
                        size={36}
                    />
                </CardContent>
            </Card>
        );
    }

    if (isError || !data) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Attendance Detail
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-8 flex justify-center items-center text-destructive'>
                    Error loading attendance details
                </CardContent>
            </Card>
        );
    }

    // Extract all days from data
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

    // Group dates by dayName
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

    // Find max length of dates in any day to create rows accordingly
    const maxLength = Math.max(
        ...Object.values(groupedByDay).map((arr) => arr.length)
    );

    // Map status to badge variants
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
        <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4 sm:p-6 md:p-10'>
            <div className='bg-background text-foreground rounded-lg shadow-lg w-full max-w-5xl p-6 relative border border-border overflow-x-auto'>
                {/* Close Button */}
                <button
                    className='absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors text-xl'
                    onClick={onClose}
                    aria-label='Close modal'
                >
                    ✖
                </button>

                {/* Title */}
                <h2 className='text-2xl font-semibold mb-6 text-center sm:text-left'>
                    Attendance Detail – {month}/{year}
                </h2>

                <Table>
                    <TableHeader>
                        <TableRow>
                            {daysOfWeek.map((day) => (
                                <TableHead
                                    key={day}
                                    className='text-center'
                                >
                                    {day}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(maxLength)].map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {daysOfWeek.map((day) => {
                                    const dayEntry =
                                        groupedByDay[day][rowIndex];
                                    return (
                                        <TableCell
                                            key={day}
                                            className='align-top text-center p-2'
                                        >
                                            {dayEntry ? (
                                                <>
                                                    <div className='font-medium'>
                                                        {dayEntry.date}
                                                    </div>
                                                    <Badge
                                                        variant={statusVariant(
                                                            dayEntry.status
                                                        )}
                                                    >
                                                        {dayEntry.status}
                                                    </Badge>
                                                </>
                                            ) : (
                                                <span className='text-muted-foreground'>
                                                    -
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
        </div>
    );
};

export default AttendanceDetailModal;
