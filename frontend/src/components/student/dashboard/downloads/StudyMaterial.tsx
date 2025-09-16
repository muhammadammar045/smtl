import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";
import Loader from "@/components/common/loader/Loader";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import envVars from "@/envExporter";
import { useGetStudyMaterialQuery } from "@/store/slices/download/download.slice";

// ✅ Local interface (separate from backend type)
interface StudyMaterialRow {
    name: string;
    date: string;
    type: string;
    file?: string; // optional now
}

function StudyMaterial() {
    const { data, isLoading, isError } = useGetStudyMaterialQuery();

    // ✅ Transform API response into table rows
    const studyMaterials: StudyMaterialRow[] =
        data?.data?.list.map((item: any) => ({
            name: item.title,
            date: new Date(item.date).toLocaleDateString("en-GB"),
            type: item.type,
            file: item.file, // may be undefined
        })) || [];

    const columns: ColumnDef<StudyMaterialRow>[] = [
        { accessorKey: "name", header: "Name" },
        { accessorKey: "date", header: "Date" },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => (
                <Badge
                    variant='default'
                    className='px-3 py-1'
                >
                    {row.original.type}
                </Badge>
            ),
        },
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
                            size='sm'
                            className='flex items-center gap-2 rounded-lg'
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
                        Study Material
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
                        Study Material
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-8 flex justify-center items-center'>
                    <span className='text-destructive font-medium'>
                        Error loading study material
                    </span>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl transition hover:shadow-lg'>
            <CardHeader className='border-b border-border pb-3'>
                <CardTitle className='text-3xl font-bold text-primary'>
                    Study Material
                </CardTitle>
            </CardHeader>
            <CardContent className='p-4'>
                {studyMaterials.length > 0 ? (
                    <TenStackReactTable
                        data={studyMaterials}
                        columns={columns}
                    />
                ) : (
                    <p className='text-center text-muted-foreground py-6'>
                        No study material available
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

export default StudyMaterial;
