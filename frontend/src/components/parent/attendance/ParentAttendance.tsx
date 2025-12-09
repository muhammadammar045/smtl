import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAttendanceQuery, useGetAttendanceDetailsQuery } from "@/store/slices/parent/attendance/parentAttendance.slice";
import Loader from "@/components/common/loader/Loader";
import { Button } from "@/components/ui/button";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { ColumnDef } from "@tanstack/react-table";

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

function ParentAttendance() {
    const { childId } = useParams<{ childId: string }>();
    const hasValidChildId = childId && childId.trim() !== "";
    
    const {
        data: attendanceData,
        isLoading,
        isError,
    } = useGetAttendanceQuery(childId || "", {
        skip: !hasValidChildId,
    });

    const [selectedMonthYear, setSelectedMonthYear] = useState<{
        month: string;
        year: number;
    } | null>(null);

    const {
        data: attendanceDetailsData,
        isLoading: isLoadingDetails,
    } = useGetAttendanceDetailsQuery(
        {
            childId: childId || "",
            month: selectedMonthYear?.month || "",
            year: selectedMonthYear?.year || 0,
            search: "search",
        },
        {
            skip: !hasValidChildId || !selectedMonthYear,
        }
    );

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

    if (isError || !attendanceData || !childId) {
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

    const attendanceStudent = attendanceData.data?.attendance_student || {};
    const rows: AttendanceRow[] = Object.entries(attendanceStudent).map(([month, data]: [string, any], index) => {
        const attendanceRate = data.working_days > 0
            ? ((data.count_present / data.working_days) * 100).toFixed(1)
            : "0";
        return {
            id: index + 1,
            month,
            displayMonth: month,
            workingDays: data.working_days || 0,
            present: data.count_present || 0,
            late: data.count_late || 0,
            absent: data.absent || 0,
            halfDay: data.half_day || 0,
            holiday: data.count_holiday || 0,
            leave: data.count_leave || 0,
            off: data.off || 0,
            attendanceRate: parseFloat(attendanceRate),
        };
    });

    const columns: ColumnDef<AttendanceRow>[] = [
        { accessorKey: "displayMonth", header: "Month" },
        { accessorKey: "workingDays", header: "Working Days" },
        { accessorKey: "present", header: "Present" },
        { accessorKey: "late", header: "Late" },
        { accessorKey: "absent", header: "Absent" },
        { accessorKey: "halfDay", header: "Half Day" },
        { accessorKey: "holiday", header: "Holiday" },
        { accessorKey: "leave", header: "Leave" },
        { accessorKey: "off", header: "Off" },
        {
            accessorKey: "attendanceRate",
            header: "Attendance Rate (%)",
            cell: ({ row }) => `${row.original.attendanceRate}%`,
        },
        {
            accessorKey: "action",
            header: "Action",
            cell: ({ row }) => (
                <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                        const [monthName, yearStr] = row.original.month.split(" ");
                        setSelectedMonthYear({
                            month: monthName,
                            year: parseInt(yearStr),
                        });
                    }}
                >
                    View Details
                </Button>
            ),
        },
    ];

    return (
        <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
            <CardHeader className='border-b border-border pb-3'>
                <CardTitle className='text-3xl font-bold text-primary'>
                    Attendance
                </CardTitle>
            </CardHeader>
            <CardContent className='p-6'>
                <TenStackReactTable
                    data={rows}
                    columns={columns}
                />
                {selectedMonthYear && isLoadingDetails && (
                    <div className='mt-4'>
                        <Loader variant='dots' size={24} />
                    </div>
                )}
                {selectedMonthYear && attendanceDetailsData && (
                    <div className='mt-4 p-4 bg-muted rounded-lg'>
                        <h3 className='font-semibold mb-2'>
                            Details for {selectedMonthYear.month} {selectedMonthYear.year}
                        </h3>
                        <pre className='text-sm overflow-auto'>
                            {JSON.stringify(attendanceDetailsData.data, null, 2)}
                        </pre>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default ParentAttendance;

