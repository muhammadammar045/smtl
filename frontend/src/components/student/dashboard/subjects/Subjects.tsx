import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
            <Card className='shadow-md shadow-muted/30 border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Subjects
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-4'>
                    <TenStackReactTable
                        data={subjects.data}
                        columns={columns}
                    />
                </CardContent>
            </Card>
        </>
    );
}

export default Subjects;
