import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeLog as ITimeLog, TimeLogRow } from "@/store/slices/timelog/types";

import { ColumnDef } from "@tanstack/react-table";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { useGetTimeLogsQuery } from "@/store/slices/timelog/timelog.slice";

const TimeLog = () => {
    // Fetch raw API response (with rows inside `data.data`)
    const { data, isLoading, error } = useGetTimeLogsQuery();

    // Map raw row arrays into formatted TimeLog objects for the table
    const timeLogRows: ITimeLog[] =
        data?.data?.data?.map((row: TimeLogRow) => ({
            id: row[0],
            attendanceDate: row[1],
            inTime: row[2],
            outTime: row[3],
            fullName: row[4].trim(),
            className: row[5],
        })) || [];

    // Define columns for TanStack Table
    const columns: ColumnDef<ITimeLog>[] = [
        { header: "ID", accessorKey: "id" },
        { header: "Date", accessorKey: "attendanceDate" },
        { header: "In Time", accessorKey: "inTime" },
        { header: "Out Time", accessorKey: "outTime" },
        { header: "Student Name", accessorKey: "fullName" },
        { header: "Class", accessorKey: "className" },
    ];

    if (isLoading) return <div>Loading time logs...</div>;
    if (error) return <div>Error loading time logs</div>;

    return (
        <Card className='shadow-md shadow-muted/30 border border-border bg-card text-card-foreground rounded-xl'>
            <CardHeader className='border-b border-border pb-3'>
                <CardTitle className='text-3xl font-bold text-primary'>
                    Time Log
                </CardTitle>
            </CardHeader>
            <CardContent className='p-4'>
                <TenStackReactTable
                    data={timeLogRows}
                    columns={columns}
                />
            </CardContent>
        </Card>
    );
};

export default TimeLog;
