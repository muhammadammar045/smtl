import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetBioLogQuery } from "@/store/slices/parent/bioLog/parentBioLog.slice";
import Loader from "@/components/common/loader/Loader";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { ColumnDef } from "@tanstack/react-table";
import { TimeLogRow } from "@/store/slices/timelog/types";
import { TimeLog } from "@/store/slices/timelog/types";

function ParentBioLog() {
    const { childId } = useParams<{ childId: string }>();
    const {
        data: bioLogData,
        isLoading,
        isError,
    } = useGetBioLogQuery(childId || "", {
        skip: !childId,
    });

    const timeLogRows: TimeLog[] =
        bioLogData?.data?.data?.map((row: TimeLogRow) => ({
            id: row[0],
            attendanceDate: row[1],
            inTime: row[2],
            outTime: row[3],
            fullName: row[4].trim(),
            className: row[5],
        })) || [];

    const columns: ColumnDef<TimeLog>[] = [
        { header: "ID", accessorKey: "id" },
        { header: "Date", accessorKey: "attendanceDate" },
        { header: "In Time", accessorKey: "inTime" },
        { header: "Out Time", accessorKey: "outTime" },
        { header: "Student Name", accessorKey: "fullName" },
        { header: "Class", accessorKey: "className" },
    ];

    if (isLoading) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Bio Log
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

    if (isError || !bioLogData || !childId) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Bio Log
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-8 flex justify-center items-center text-destructive'>
                    Error loading bio log
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
            <CardHeader className='border-b border-border pb-3'>
                <CardTitle className='text-3xl font-bold text-primary'>
                    Bio Log
                </CardTitle>
            </CardHeader>
            <CardContent className='p-4'>
                <TenStackReactTable
                    data={timeLogRows}
                    columns={columns}
                />
            </CardContent>
        </Card>
    );
}

export default ParentBioLog;

