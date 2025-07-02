import { PageTitle } from "@/components/common/parts/BreadCrumb";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { ColumnDef } from "@tanstack/react-table";

interface DocumentTab {
    title: string;
    name: string;
    action: string;
}

function DocumentTab() {
    const data: DocumentTab[] = [
        {
            title: "Mathematics",
            name: "Mathematics",
            action: "View Details",
        },
        {
            title: "English",
            name: "English",
            action: "View Details",
        },
    ];
    const columns: ColumnDef<DocumentTab>[] = [
        {
            accessorKey: "title",
            header: "Title",
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: "action",
            header: "Action",
            cell: (info) => info.getValue(),
        },
    ];
    return (
        <>
            <PageTitle
                title='Documents'
                description=''
                fontSize='text-2xl'
            />

            <TenStackReactTable
                data={data}
                columns={columns}
            />
        </>
    );
}

export default DocumentTab;
