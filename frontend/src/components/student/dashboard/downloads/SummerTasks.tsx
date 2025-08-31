import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { ColumnDef } from "@tanstack/react-table";
import { useGetOtherSummerTasksQuery } from "@/store/slices/download/download.slice"; // ✅ assume this hook exists
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import envVars from "@/envExporter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/common/loader/Loader";

// ✅ Local interface
interface SummerTaskRow {
    name: string;
    date: string;
    type: string;
    file?: string; // optional for downloads
}

function SummerTasks() {
    const { data, isLoading, isError } = useGetOtherSummerTasksQuery();

    // ✅ Transform API response → rows
    const summerTasks: SummerTaskRow[] =
        data?.data?.downloads.map((item: any) => ({
            name: item.title,
            date: new Date(item.date).toLocaleDateString("en-GB"),
            type: item.type,
            file: item.file,
        })) || [];

    const columns: ColumnDef<SummerTaskRow>[] = [
        { accessorKey: "name", header: "Name" },
        { accessorKey: "date", header: "Date" },
        { accessorKey: "type", header: "Type" },
        {
            accessorKey: "action",
            header: "Action",
            cell: ({ row }) => {
                const fileUrl = row.original.file;
                return fileUrl ? (
                    <a
                        href={`${envVars.BACKEND_URL}/${fileUrl}`}
                        download
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Button
                            variant='outline'
                            className='flex items-center gap-2 rounded-lg border-border text-primary hover:bg-muted hover:text-primary'
                        >
                            <Download className='h-4 w-4' />
                            <span>Download</span>
                        </Button>
                    </a>
                ) : (
                    <span className='text-muted-foreground'>—</span>
                );
            },
        },
    ];

    if (isLoading) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Summer Tasks
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

    if (isError || !summerTasks) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Summer Tasks
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-8 flex justify-center items-center text-destructive'>
                    Error loading summer tasks
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card className='shadow-md shadow-muted/30 border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Summer Tasks
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-4'>
                    <TenStackReactTable
                        data={summerTasks}
                        columns={columns}
                    />
                </CardContent>
            </Card>
        </>
    );
}

export default SummerTasks;
