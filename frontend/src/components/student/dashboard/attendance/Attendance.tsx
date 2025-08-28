import { useState } from "react";
import { useGetAttendanceQuery } from "@/store/slices/attendance/attendance.slice";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { ColumnDef } from "@tanstack/react-table";
import AttendanceDetailModal from "./AttendanceDetailModal";
import { Button } from "@/components/ui/button"; // using your theme-based Button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AttendanceRow = {
    id: number;
    month: string; // e.g. "2025-04"
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
    const { data: attendanceData, isLoading } = useGetAttendanceQuery();
    const [selectedMonthYear, setSelectedMonthYear] = useState<{
        month: number;
        year: number;
    } | null>(null);

    if (isLoading)
        return (
            <p className='text-center py-6 text-muted-foreground'>Loading...</p>
        );

    if (!attendanceData)
        return (
            <p className='text-center py-6 text-destructive'>No data found.</p>
        );

    const apiData = attendanceData.data.attendance_student;

    const tableData: AttendanceRow[] = Object.entries(apiData).map(
        ([month, values]: [string, any], index) => ({
            id: index + 1,
            month, // "2025-04"
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
                const [year, month] = row.original.month.split("-").map(Number);

                return (
                    <Button
                        variant='default'
                        size='sm'
                        onClick={() => setSelectedMonthYear({ month, year })}
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
