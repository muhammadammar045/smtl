import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import AttendanceDetailModal from "./AttendanceDetailModal";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Loader from "@/components/common/loader/Loader";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { useGetAttendanceQuery } from "@/store/slices/attendance/attendance.slice";
import { useState } from "react";

type AttendanceRow = {
    id: number;
    month: string;
    workingDays: number;
    present: number;
    late: number;
    absent: number;
    halfDay: number;
    holiday: number;
    leave: number;
    off: number;
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
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Attendance
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

    if (isError || !attendanceData) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Attendance
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-8 flex justify-center items-center text-destructive'>
                    Error loading attendance
                </CardContent>
            </Card>
        );
    }

    const apiData = attendanceData.data.attendance_student;

    const tableData: AttendanceRow[] = Object.entries(apiData).map(
        ([month, values]: [string, any], index) => ({
            id: index + 1,
            month,
            workingDays: values.working_days,
            present: values.count_present,
            late: values.count_late,
            absent: values.absent,
            halfDay: values.half_day,
            holiday: values.count_holiday,
            leave: values.count_leave,
            off: values.off,
        })
    );

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
                        variant='default'
                        size='sm'
                        onClick={() =>
                            setSelectedMonthYear({ month: monthName, year })
                        }
                    >
                        View Detail
                    </Button>
                );
            },
        },
        { accessorKey: "month", header: "Months" },
        { accessorKey: "workingDays", header: "Working Days" },
        { accessorKey: "present", header: "Present" },
        { accessorKey: "late", header: "Late" },
        { accessorKey: "absent", header: "Absent" },
        { accessorKey: "halfDay", header: "Half Day" },
        { accessorKey: "holiday", header: "Holiday" },
        { accessorKey: "leave", header: "Leave" },
        { accessorKey: "off", header: "Off" },
    ];

    return (
        <>
            <Card className='shadow-md shadow-muted/30 border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Attendance
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-4'>
                    <TenStackReactTable
                        data={tableData}
                        columns={columns}
                    />
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
