import { useState } from "react";
import { PageTitle } from "@/components/common/parts/BreadCrumb";
import { useGetAttendanceQuery } from "@/store/slices/attendance/attendance.slice";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { ColumnDef } from "@tanstack/react-table";
import AttendanceDetailModal from "./AttendanceDetailModal";

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

    if (isLoading) return <p>Loading...</p>;
    if (!attendanceData) return <p>No data found</p>;

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
            cell: ({ row }) => (
                <button
                    className='btn btn-primary'
                    onClick={() => {
                        const [year, month] = row.original.month
                            .split("-")
                            .map(Number);
                        setSelectedMonthYear({ month, year });
                    }}
                >
                    View Detail
                </button>
            ),
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
            <PageTitle
                title='Attendance'
                description=''
            />
            <TenStackReactTable
                data={tableData}
                columns={columns}
            />

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
