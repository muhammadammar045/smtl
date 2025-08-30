import Loader from "@/components/common/loader/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetSubjectsQuery } from "@/store/slices/subject/subject.slice";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { ColumnDef } from "@tanstack/react-table";

function Subjects() {
    const { data: subjects, isLoading, isError } = useGetSubjectsQuery();

    if (isLoading) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Subjects
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

    if (isError || !subjects) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Subjects
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-8 flex justify-center items-center text-destructive'>
                    Error loading subjects
                </CardContent>
            </Card>
        );
    }

    const columns: ColumnDef<any>[] = [
        { accessorKey: "name", header: "Subject Name" },
        { accessorKey: "code", header: "Subject Code" },
        { accessorKey: "teacher_name", header: "Teacher" },
        { accessorKey: "type", header: "Subject Type" },
    ];

    return (
        <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
            <CardHeader className='border-b border-border pb-3'>
                <CardTitle className='text-3xl font-bold text-primary'>
                    Subjects
                </CardTitle>
            </CardHeader>
            <CardContent className='p-4'>
                <TenStackReactTable
                    data={subjects.data.subjectlist}
                    columns={columns}
                />
            </CardContent>
        </Card>
    );
}

export default Subjects;
