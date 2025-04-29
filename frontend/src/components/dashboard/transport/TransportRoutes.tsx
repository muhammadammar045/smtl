import { PageTitle } from "@/components/common/parts/BreadCrumb";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";

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
            <PageTitle
                title='Transport Routes'
                description=''
            />

            <TenStackReactTable
                data={data}
                columns={columns}
            />
        </>
    );
}

export default TransportRoutes;
