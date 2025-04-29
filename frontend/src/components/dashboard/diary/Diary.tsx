import { PageTitle } from "@/components/common/parts/BreadCrumb";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";

interface Diary {
    sr: string;
    diaryDate: string;
    evaluationDate: string;
    completionPercentage: string;
    actions: string;
}

function Diary() {
    const data: Diary[] = [
        {
            sr: "1",
            diaryDate: "17-04-2025",
            evaluationDate: "17-04-2025",
            completionPercentage: "100%",
            actions: "View Details",
        },
        {
            sr: "2",
            diaryDate: "17-04-2025",
            evaluationDate: "17-04-2025",
            completionPercentage: "100%",
            actions: "View Details",
        },
        {
            sr: "3",
            diaryDate: "17-04-2025",
            evaluationDate: "17-04-2025",
            completionPercentage: "100%",
            actions: "View Details",
        },
        {
            sr: "4",
            diaryDate: "17-04-2025",
            evaluationDate: "17-04-2025",
            completionPercentage: "100%",
            actions: "View Details",
        },
    ];
    const columns: ColumnDef<Diary>[] = [
        {
            accessorKey: "sr",
            header: "Sr.",
        },
        {
            accessorKey: "diaryDate",
            header: "Diary Date",
        },
        {
            accessorKey: "evaluationDate",
            header: "Evaluation Date",
        },
        {
            accessorKey: "completionPercentage",
            header: "Completion Percentage",
        },
        {
            accessorKey: "actions",
            header: "Actions",
        },
    ];
    return (
        <>
            <PageTitle
                title='Diary'
                description=''
            />

            <TenStackReactTable
                data={data}
                columns={columns}
            />
        </>
    );
}

export default Diary;
