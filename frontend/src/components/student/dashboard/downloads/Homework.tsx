import Loader from "@/components/common/loader/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

interface HomeWorkI {
    name: string;
    date: string;
    type: string;
    action: string;
}

function Homework() {
    const [isLoading, setIsLoading] = useState(true);
    const isError = false;

    setTimeout(() => {
        setIsLoading(false);
    }, 2000);

    const data: HomeWorkI[] = [
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
    const columns: ColumnDef<HomeWorkI>[] = [
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

    if (isLoading) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Home Work
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

    if (isError || !data) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Home Work
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-8 flex justify-center items-center text-destructive'>
                    Error loading Home work
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card className='shadow-md shadow-muted/30 border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Homework
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

export default Homework;
