import { PageTitle } from "@/components/common/parts/BreadCrumb";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { ColumnDef } from "@tanstack/react-table";
import { useGetSyllabusQuery } from "@/store/slices/download/download.slice"; // ✅ assume RTKQ hook exists
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// ✅ Local interface
interface SyllabusRow {
    name: string;
    date: string;
    type: string;
    file?: string; // optional for download
}

function Syllabus() {
    const { data } = useGetSyllabusQuery();

    // ✅ Transform API response into rows
    const syllabusList: SyllabusRow[] =
        data?.data?.map((item: any) => ({
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
                title='Syllabus'
                description=''
            />

            <TenStackReactTable
                data={syllabusList}
                columns={columns}
            />
        </>
    );
}

export default Syllabus;
