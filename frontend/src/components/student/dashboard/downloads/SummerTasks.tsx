import { PageTitle } from "@/components/common/parts/BreadCrumb";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { ColumnDef } from "@tanstack/react-table";
import { useGetOtherSummerTasksQuery } from "@/store/slices/download/download.slice"; // ✅ assume this hook exists
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// ✅ Local interface
interface SummerTaskRow {
    name: string;
    date: string;
    type: string;
    file?: string; // optional for downloads
}

function SummerTasks() {
    const { data } = useGetOtherSummerTasksQuery();

    // ✅ Transform API response → rows
    const summerTasks: SummerTaskRow[] =
        data?.data?.map((item: any) => ({
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
                    <span className='text-gray-400'>—</span> // show dash if no file
                );
            },
        },
    ];

    return (
        <>
            <PageTitle
                title='Summer Tasks'
                description=''
            />

            <TenStackReactTable
                data={summerTasks}
                columns={columns}
            />
        </>
    );
}

export default SummerTasks;
