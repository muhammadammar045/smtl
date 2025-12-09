import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColumnDef } from "@tanstack/react-table";
import Loader from "@/components/common/loader/Loader";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { useGetDashboardDetailsQuery } from "@/store/slices/dashboard/dashboard.slice";

interface TimelineItem {
    [key: string]: any;
}

function ProgressReport() {
    const {
        data: dashboardData,
        isLoading,
        isError,
    } = useGetDashboardDetailsQuery();

    const timelineList: TimelineItem[] = dashboardData?.data?.timeline_list || [];

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

    if (isError || !dashboardData) {
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

    // Generate columns dynamically based on the first timeline item's keys
    const columns: ColumnDef<TimelineItem>[] = timelineList.length > 0
        ? Object.keys(timelineList[0]).map((key) => ({
              accessorKey: key,
              header: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
          }))
        : [];

    return (
        <>
            <Card className='shadow-md shadow-muted/30 border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Progress Report
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-4'>
                    {timelineList.length === 0 ? (
                        <p className='text-center text-muted-foreground py-6'>
                            No timeline data available
                        </p>
                    ) : (
                        <TenStackReactTable
                            data={timelineList}
                            columns={columns}
                        />
                    )}
                </CardContent>
            </Card>
        </>
    );
}

export default ProgressReport;
