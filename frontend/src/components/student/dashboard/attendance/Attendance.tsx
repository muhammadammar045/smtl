import { useState } from "react";

import { Button } from "@/components/ui/button";
import Loader from "@/components/common/loader/Loader";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { useGetAttendanceQuery } from "@/store/slices/attendance/attendance.slice";
import { ColumnDef } from "@tanstack/react-table";
import {
    AlarmClock,
    CalendarCheck,
    CalendarDays,
    Meh,
} from "lucide-react";

import AttendanceDetailModal from "./AttendanceDetailModal";

type AttendanceRow = {
    id: number;
    month: string;
    displayMonth: string;
    workingDays: number;
    present: number;
    late: number;
    absent: number;
    halfDay: number;
    holiday: number;
    leave: number;
    off: number;
    attendanceRate: number;
};

function Attendance() {
    const {
        data: attendanceData,
        isLoading,
        isError,
    } = useGetAttendanceQuery();

    const [selectedMonthYear, setSelectedMonthYear] = useState<{
        month: string; // This will now be month name, e.g., "April"
        year: number;
    } | null>(null);

    if (isLoading) {
        return (
            <Card className='relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-background text-card-foreground shadow-lg shadow-primary/10'>
                <CardHeader className='border-b border-border/50 bg-background/60 px-6 py-6 backdrop-blur-sm sm:px-8 sm:py-7'>
                    <CardTitle className='text-2xl font-semibold text-primary sm:text-3xl'>
                        Attendance insights
                    </CardTitle>
                </CardHeader>
                <CardContent className='flex min-h-[220px] items-center justify-center px-6 py-10 sm:px-8 sm:py-14'>
                    <Loader
                        variant='dots'
                        size={36}
                    />
                </CardContent>
            </Card>
        );
    }

    if (isError || !attendanceData) {
        return (
            <Card className='relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-destructive/5 via-background to-background text-card-foreground shadow-lg shadow-destructive/10'>
                <CardHeader className='border-b border-border/50 bg-background/60 px-6 py-6 backdrop-blur-sm sm:px-8 sm:py-7'>
                    <CardTitle className='text-2xl font-semibold text-destructive sm:text-3xl'>
                        Attendance insights
                    </CardTitle>
                </CardHeader>
                <CardContent className='px-6 py-10 text-center text-sm text-destructive sm:px-8 sm:py-12 sm:text-base'>
                    Something went wrong while loading your attendance. Please
                    try again in a moment.
                </CardContent>
            </Card>
        );
    }

    const apiData = attendanceData.data.attendance_student;

    const tableData: AttendanceRow[] = Object.entries(apiData)
        .map(([month, values]: [string, any], index) => {
            const [year, monthNumber] = month.split("-").map(Number);
            const pointerDate = new Date(year, monthNumber - 1);
            const displayMonth = `${pointerDate.toLocaleString("default", {
                month: "long",
            })} ${year}`;
            const workingDays = values.working_days ?? 0;
            const present = values.count_present ?? 0;
            const attendanceRate =
                workingDays > 0
                    ? Math.round((present / workingDays) * 100)
                    : 0;

            return {
                id: index + 1,
                month,
                displayMonth,
                workingDays,
                present,
                late: values.count_late ?? 0,
                absent: values.absent ?? 0,
                halfDay: values.half_day ?? 0,
                holiday: values.count_holiday ?? 0,
                leave: values.count_leave ?? 0,
                off: values.off ?? 0,
                attendanceRate,
            };
        })
        .sort(
            (a, b) =>
                new Date(b.month).getTime() - new Date(a.month).getTime()
        );

    const totals = tableData.reduce(
        (acc, row) => {
            acc.workingDays += row.workingDays;
            acc.present += row.present;
            acc.absent += row.absent;
            acc.late += row.late;
            return acc;
        },
        {
            workingDays: 0,
            present: 0,
            absent: 0,
            late: 0,
        }
    );

    const overallAttendanceRate =
        totals.workingDays > 0
            ? Math.round((totals.present / totals.workingDays) * 100)
            : 0;

    const latestMonth = tableData[0];
    const bestMonth =
        tableData.length > 0
            ? tableData.reduce((best, current) =>
                  current.attendanceRate > best.attendanceRate ? current : best
              )
            : undefined;

    const highlightCards =
        tableData.length > 0
            ? [
                  {
                      label: "Overall attendance",
                      value: `${overallAttendanceRate}%`,
                      description: `${totals.present} of ${
                          totals.workingDays
                      } working days present`,
                      icon: CalendarCheck,
                  },
                  {
                      label: "Latest month",
                      value: latestMonth?.displayMonth ?? "—",
                      description: `Attendance rate ${latestMonth?.attendanceRate ?? 0}%`,
                      icon: CalendarDays,
                  },
                  {
                      label: "Top month",
                      value: bestMonth?.displayMonth ?? "—",
                      description: `Best streak at ${bestMonth?.attendanceRate ?? 0}%`,
                      icon: AlarmClock,
                  },
                  {
                      label: "Areas to improve",
                      value: `${totals.absent} days`,
                      description: `${totals.late} late arrivals recorded`,
                      icon: Meh,
                  },
              ]
            : [];

    const columns: ColumnDef<AttendanceRow>[] = [
        {
            accessorKey: "action",
            header: "Action",
            cell: ({ row }) => {
                const [year, monthNumber] = row.original.month
                    .split("-")
                    .map(Number);
                const monthName = new Date(
                    year,
                    monthNumber - 1
                ).toLocaleString("default", {
                    month: "long",
                });

                return (
                    <Button
                        variant='outline'
                        size='sm'
                        className='rounded-xl border-primary/30 bg-primary/10 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground sm:text-sm'
                        onClick={() =>
                            setSelectedMonthYear({ month: monthName, year })
                        }
                    >
                        View details
                    </Button>
                );
            },
            meta: {
                headerClassName: "text-center",
                cellClassName: "text-center",
            },
        },
        {
            accessorKey: "displayMonth",
            header: "Month",
            cell: ({ row }) => (
                <span className='text-sm font-semibold text-foreground sm:text-base'>
                    {row.original.displayMonth}
                </span>
            ),
            meta: {
                headerClassName: "text-left",
                cellClassName: "text-left",
            },
        },
        {
            accessorKey: "workingDays",
            header: "Working Days",
            meta: {
                headerClassName: "text-center",
                cellClassName: "text-center",
            },
        },
        {
            accessorKey: "present",
            header: "Present",
            cell: ({ getValue }) => (
                <span className='font-semibold text-emerald-500'>
                    {getValue<number>()}
                </span>
            ),
            meta: {
                headerClassName: "text-center",
                cellClassName: "text-center text-emerald-500",
            },
        },
        {
            accessorKey: "late",
            header: "Late",
            meta: {
                headerClassName: "text-center",
                cellClassName: "text-center text-amber-500",
            },
        },
        {
            accessorKey: "absent",
            header: "Absent",
            cell: ({ getValue }) => (
                <span className='font-semibold text-rose-500'>
                    {getValue<number>()}
                </span>
            ),
            meta: {
                headerClassName: "text-center",
                cellClassName: "text-center text-rose-500",
            },
        },
        {
            accessorKey: "halfDay",
            header: "Half Day",
            meta: {
                headerClassName: "text-center",
                cellClassName: "text-center",
            },
        },
        {
            accessorKey: "holiday",
            header: "Holiday",
            meta: {
                headerClassName: "text-center",
                cellClassName: "text-center",
            },
        },
        {
            accessorKey: "leave",
            header: "Leave",
            meta: {
                headerClassName: "text-center",
                cellClassName: "text-center",
            },
        },
        {
            accessorKey: "off",
            header: "Off",
            meta: {
                headerClassName: "text-center",
                cellClassName: "text-center",
            },
        },
    ];

    return (
        <>
            <Card className='relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-background text-card-foreground shadow-lg shadow-primary/10'>
                <CardHeader className='flex flex-col gap-4 border-b border-border/50 bg-background/60 px-6 py-6 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-7'>
                    <div className='space-y-1.5 sm:space-y-2'>
                        <CardTitle className='text-2xl font-semibold text-primary sm:text-3xl'>
                            Attendance insights
                        </CardTitle>
                        <p className='text-sm text-muted-foreground sm:text-base'>
                            Track your monthly attendance trends and catch up
                            before you miss a beat.
                        </p>
                    </div>
                </CardHeader>
                <CardContent className='space-y-6 px-6 py-6 sm:space-y-7 sm:px-8 sm:py-8'>
                    {highlightCards.length > 0 ? (
                        <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
                            {highlightCards.map(
                                ({ label, value, description, icon: Icon }) => (
                                    <div
                                        key={label}
                                        className='flex items-start gap-3 rounded-2xl border border-border/40 bg-background/80 p-4 shadow-sm shadow-muted/40 sm:p-5'
                                    >
                                        <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary'>
                                            <Icon className='h-5 w-5' />
                                        </div>
                                        <div className='space-y-1'>
                                            <p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
                                                {label}
                                            </p>
                                            <p className='text-lg font-semibold text-foreground sm:text-2xl'>
                                                {value}
                                            </p>
                                            <p className='text-xs text-muted-foreground sm:text-sm'>
                                                {description}
                                            </p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <div className='rounded-2xl border border-dashed border-border/60 bg-muted/10 p-6 text-center text-sm text-muted-foreground sm:text-base'>
                            Attendance records will appear here once available.
                        </div>
                    )}

                    <div className='space-y-2'>
                        <div className='flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between'>
                            <div>
                                <h3 className='text-base font-semibold text-foreground sm:text-lg'>
                                    Monthly breakdown
                                </h3>
                                <p className='text-xs text-muted-foreground sm:text-sm'>
                                    Use the table below to explore monthly
                                    details and open the modal for a deep dive.
                                </p>
                            </div>
                        </div>

                        <TenStackReactTable
                            data={tableData}
                            columns={columns}
                            className='mt-2'
                            emptyMessage='No attendance records to display just yet.'
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Modal */}
            {selectedMonthYear && (
                <AttendanceDetailModal
                    month={selectedMonthYear.month}
                    year={selectedMonthYear.year}
                    onClose={() => setSelectedMonthYear(null)}
                />
            )}
        </>
    );
}

export default Attendance;
