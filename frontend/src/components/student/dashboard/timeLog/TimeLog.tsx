import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { ColumnDef } from "@tanstack/react-table";

interface TimeLog {
    sr: string;
    date: string;
    classSection: string;
    startTime: string;
    endTime: string;
}

function TimeLog() {
    const data: TimeLog[] = [
        {
            sr: "1",
            date: "17-04-2025",
            classSection: "I",
            startTime: "10:00 AM",
            endTime: "11:00 AM",
        },
        {
            sr: "2",
            date: "17-04-2025",
            classSection: "I",
            startTime: "10:00 AM",
            endTime: "11:00 AM",
        },
    ];
    const columns: ColumnDef<TimeLog>[] = [
        {
            accessorKey: "sr",
            header: "Sr.",
        },
        {
            accessorKey: "date",
            header: "Date",
        },
        {
            accessorKey: "classSection",
            header: "Class Section",
        },
        {
            accessorKey: "startTime",
            header: "Start Time",
        },
        {
            accessorKey: "endTime",
            header: "End Time",
        },
    ];

    return (
        <>
            <Card className='shadow-md shadow-muted/30 border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Time Log
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-4'>
                    <TenStackReactTable
                        data={data}
                        columns={columns}
                    />
                </CardContent>
            </Card>
        </>
    );
}

export default TimeLog;
