import { PageTitle } from "@/components/common/parts/BreadCrumb";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";

interface TimeTableI {
    name: string;
    date: string;
    type: string;
    action: string;
}

function TimeTable() {
    const data: TimeTableI[] = [
        {
            name: "Mathematics",
            date: "17-04-2025",
            type: "Theory",
            action: "View Details",
        },
        {
            name: "English",
            date: "17-04-2025",
            type: "Theory",
            action: "View Details",
        },
        {
            name: "Physics",
            date: "17-04-2025",
            type: "Theory",
            action: "View Details",
        },
        {
            name: "Chemistry",
            date: "17-04-2025",
            type: "Theory",
            action: "View Details",
        },
    ];
    const columns: ColumnDef<TimeTableI>[] = [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "date",
            header: "Date",
        },
        {
            accessorKey: "type",
            header: "Type",
        },
        {
            accessorKey: "action",
            header: "Action",
        },
    ];
    return (
        <>
            <PageTitle
                title='Time Table'
                description=''
            />

            <TenStackReactTable
                data={data}
                columns={columns}
            />
        </>
    );
}

export default TimeTable;
