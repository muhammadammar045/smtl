import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Loader from "@/components/common/loader/Loader";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";

interface HomeWorkI {
    name: string;
    date: string;
    type: string;
    action: string;
}

function Homework() {
    const [isLoading, setIsLoading] = useState(true);
    const isError = false;

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

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
        { accessorKey: "name", header: "Subject" },
        { accessorKey: "date", header: "Date" },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => (
                <Badge
                    variant='default'
                    className='px-3 py-1'
                >
                    {row.original.type}
                </Badge>
            ),
        },
        {
            accessorKey: "action",
            header: "Action",
            cell: ({ row }) => (
                <Button
                    size='sm'
                    variant='outline'
                >
                    {row.original.action}
                </Button>
            ),
        },
    ];

    if (isLoading) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Homework
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
                        Homework
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-8 flex justify-center items-center'>
                    <span className='text-destructive font-medium'>
                        Error loading homework
                    </span>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl transition hover:shadow-lg'>
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
    );
}

export default Homework;
