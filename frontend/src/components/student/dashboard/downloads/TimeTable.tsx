import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Loader from "@/components/common/loader/Loader";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";

interface TimeTableI {
    name: string;
    date: string;
    type: string;
    action: string;
}

function TimeTable() {
    const [isLoading, setIsLoading] = useState(true);
    const isError = false;

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

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const columns: ColumnDef<TimeTableI>[] = [
        { accessorKey: "name", header: "Name" },
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
            cell: () => (
                <Button
                    variant='outline'
                    size='sm'
                    className='flex items-center gap-2 rounded-lg'
                >
                    <Eye className='h-4 w-4' />
                    <span>View</span>
                </Button>
            ),
        },
    ];

    if (isLoading) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Time Table
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

    if (isError) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Time Table
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-8 flex justify-center items-center'>
                    <span className='text-destructive font-medium'>
                        Error loading timetable
                    </span>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl transition hover:shadow-lg'>
            <CardHeader className='border-b border-border pb-3'>
                <CardTitle className='text-3xl font-bold text-primary'>
                    Time Table
                </CardTitle>
            </CardHeader>
            <CardContent className='p-4'>
                {data.length > 0 ? (
                    <TenStackReactTable
                        data={data}
                        columns={columns}
                    />
                ) : (
                    <p className='text-center text-muted-foreground py-6'>
                        No timetable available
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

export default TimeTable;
