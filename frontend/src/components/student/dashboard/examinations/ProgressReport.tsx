import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ColumnDef } from "@tanstack/react-table";
import Loader from "@/components/common/loader/Loader";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { useState } from "react";

interface TransportRoute {
    routeTitle: string;
    Vehicle: string;
}

function ProgressReport() {
    const [isLoading, setIsLoading] = useState(true);
    const isError = false;

    const data: TransportRoute[] = [];
    const columns: ColumnDef<TransportRoute>[] = [];

    setTimeout(() => {
        setIsLoading(false);
    }, 1000);

    if (isLoading) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Progress Report
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
                        Progress Report
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-8 flex justify-center items-center text-destructive'>
                    Error loading progress report
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card className='shadow-md shadow-muted/30 border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Progress Report
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

export default ProgressReport;
