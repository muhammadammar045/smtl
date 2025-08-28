import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { ColumnDef } from "@tanstack/react-table";

interface TransportRoute {
    routeTitle: string;
    Vehicle: string;
}

function TransportRoutes() {
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
