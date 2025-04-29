import { PageTitle } from "@/components/common/parts/BreadCrumb";
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
            <PageTitle
                title='Live Classes'
                description=''
            />
            <TenStackReactTable
                data={data}
                columns={columns}
            />
        </>
    );
}

export default TimeLog;
