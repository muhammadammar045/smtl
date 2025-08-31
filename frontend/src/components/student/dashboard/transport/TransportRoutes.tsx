import Loader from "@/components/common/loader/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

interface TransportRoute {
    routeTitle: string;
    Vehicle: string;
}

function TransportRoutes() {
    const [isLoading, setIsLoading] = useState(true);
    const isError = false;

    const data: TransportRoute[] = [
        {
            routeTitle: "Route 1",
            Vehicle: "Bus 1",
        },
        {
            routeTitle: "Route 2",
            Vehicle: "Bus 2",
        },
        {
            routeTitle: "Route 3",
            Vehicle: "Bus 3",
        },
    ];
    const columns: ColumnDef<TransportRoute>[] = [
        {
            accessorKey: "routeTitle",
            header: "Route Title",
        },
        {
            accessorKey: "Vehicle",
            header: "Vehicle",
        },
    ];

    setTimeout(() => {
        setIsLoading(false);
    }, 1000);

    if (isLoading) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Transport Routes
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
                        Transport Routes
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-8 flex justify-center items-center text-destructive'>
                    Error loading transport routes
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card className='shadow-md shadow-muted/30 border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Transport Routes
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

export default TransportRoutes;
