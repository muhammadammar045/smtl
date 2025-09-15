import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ColumnDef } from "@tanstack/react-table";
import { Conference } from "@/store/slices/conference/types";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { useGetLiveClassesQuery } from "@/store/slices/conference/conference.slice";

function LiveClasses() {
    const { data } = useGetLiveClassesQuery();

    const conferences = data?.data.conferences || [];

    const columns: ColumnDef<Conference>[] = [];

    return (
        <>
            <Card className='shadow-md shadow-muted/30 border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Live Classes
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-4'>
                    <TenStackReactTable
                        data={conferences}
                        columns={columns}
                    />
                </CardContent>
            </Card>
        </>
    );
}

export default LiveClasses;
