import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ColumnDef } from "@tanstack/react-table";
import Loader from "@/components/common/loader/Loader";
import { Route } from "@/store/slices/transport/types";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { useGetTransportQuery } from "@/store/slices/transport/transport.slice";

function TransportRoutes() {
    const { data, isLoading, isError } = useGetTransportQuery();

    const routes: Route[] = data?.data?.listroute || [];

    const columns: ColumnDef<Route>[] = [
        {
            accessorKey: "route_id",
            header: "ID",
        },
        {
            accessorKey: "route_name",
            header: "Route Name",
        },
    ];

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
                <CardContent className='p-8 flex justify-center items-center'>
                    <span className='text-destructive font-medium'>
                        Error loading transport routes
                    </span>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl transition hover:shadow-lg'>
            <CardHeader className='border-b border-border pb-3'>
                <CardTitle className='text-3xl font-bold text-primary'>
                    Transport Routes
                </CardTitle>
            </CardHeader>
            <CardContent className='p-4'>
                {routes.length > 0 ? (
                    <TenStackReactTable
                        data={routes}
                        columns={columns}
                    />
                ) : (
                    <p className='text-center text-muted-foreground py-6'>
                        No transport routes found
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

export default TransportRoutes;
