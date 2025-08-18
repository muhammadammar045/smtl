import { PageTitle } from "@/components/common/parts/BreadCrumb";
import { useGetSubjectsQuery } from "@/store/slices/subject/subject.slice";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { ColumnDef } from "@tanstack/react-table";

function Subjects() {
    const { data: subjects, isLoading, isError } = useGetSubjectsQuery();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !subjects) {
        return <div>Error loading subjects</div>;
    }

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "subject_name",
            header: "Subject Name",
        },
        {
            accessorKey: "code",
            header: "Subject Code",
        },
        {
            accessorKey: "teachers",
            header: "Teacher",
        },
        {
            accessorKey: "type",
            header: "Subject Type",
        },
    ];

    return (
        <>
            <PageTitle
                title='Subjects'
                description=''
            />

            <TenStackReactTable
                data={subjects.data}
                columns={columns}
            />
        </>
    );
}

export default Subjects;
