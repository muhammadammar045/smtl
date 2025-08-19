import { PageTitle } from "@/components/common/parts/BreadCrumb";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { ColumnDef } from "@tanstack/react-table";
import { useGetStudyMaterialQuery } from "@/store/slices/download/download.slice";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// ✅ Local interface (separate from backend type)
interface StudyMaterialRow {
    name: string;
    date: string;
    type: string;
    file?: string; // optional now
}

function StudyMaterial() {
    const { data } = useGetStudyMaterialQuery();

    // ✅ Transform API response into table rows
    const studyMaterials: StudyMaterialRow[] =
        data?.data?.map((item: any) => ({
            name: item.title,
            date: new Date(item.date).toLocaleDateString("en-GB"),
            type: item.type,
            file: item.file, // may be undefined
        })) || [];

    const columns: ColumnDef<StudyMaterialRow>[] = [
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
                        href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${fileUrl}`}
                        download
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Button
                            size='icon'
                            variant='ghost'
                            className='rounded-full hover:bg-blue-100'
                        >
                            <Download className='h-4 w-4' />
                        </Button>
                    </a>
                ) : (
                    <span className='text-gray-400'>—</span> // placeholder if no file
                );
            },
        },
    ];

    return (
        <>
            <PageTitle
                title='Study Material'
                description=''
            />
            <TenStackReactTable
                data={studyMaterials}
                columns={columns}
            />
        </>
    );
}

export default StudyMaterial;
