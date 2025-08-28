import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { ColumnDef } from "@tanstack/react-table";
import { useGetSyllabusQuery } from "@/store/slices/download/download.slice";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import envVars from "@/envExporter";

interface SyllabusRow {
    name: string;
    date: string;
    type: string;
    file?: string;
}

function Syllabus() {
    const { data } = useGetSyllabusQuery();

    const syllabusList: SyllabusRow[] =
        data?.data?.syllabus.map((item: any) => ({
            name: item.title,
            date: new Date(item.date).toLocaleDateString("en-GB"),
            type: item.type,
            file: item.file,
        })) || [];

    const columns: ColumnDef<SyllabusRow>[] = [
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

    return (
        <>
            <Card className='shadow-md shadow-muted/30 border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Syllabus
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-4'>
                    <TenStackReactTable
                        data={syllabusList}
                        columns={columns}
                    />
                </CardContent>
            </Card>
        </>
    );
}

export default Syllabus;
