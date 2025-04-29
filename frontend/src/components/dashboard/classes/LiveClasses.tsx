import { PageTitle } from "@/components/common/parts/BreadCrumb";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { ColumnDef } from "@tanstack/react-table";

interface LiveClasses {
    sr: string;
    classTitle: string;
    class: string;
    startTime: string;
    endTime: string;
    classHost: string;
    status: string;
    action: string;
}

function LiveClasses() {
    const data: LiveClasses[] = [
        {
            sr: "1",
            classTitle: "Mathematics",
            class: "I",
            startTime: "10:00 AM",
            endTime: "11:00 AM",
            classHost: "Mr. John Doe",
            status: "Live",
            action: "Join",
        },
        {
            sr: "2",
            classTitle: "English",
            class: "I",
            startTime: "11:00 AM",
            endTime: "12:00 PM",
            classHost: "Ms. Jane Doe",
            status: "Upcoming",
            action: "Join",
        },
    ];
    const columns: ColumnDef<LiveClasses>[] = [
        {
            accessorKey: "sr",
            header: "Sr.",
        },
        {
            accessorKey: "classTitle",
            header: "Class Title",
        },
        {
            accessorKey: "class",
            header: "Class",
        },
        {
            accessorKey: "startTime",
            header: "Start Time",
        },
        {
            accessorKey: "endTime",
            header: "End Time",
        },
        {
            accessorKey: "classHost",
            header: "Class Host",
        },
        {
            accessorKey: "status",
            header: "Status",
        },
        {
            accessorKey: "action",
            header: "Action",
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

export default LiveClasses;
