import { PageTitle } from "@/components/common/parts/BreadCrumb";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { ColumnDef } from "@tanstack/react-table";

interface Subject {
    subject: string;
    subjectCode: string;
    teacher: string;
    subjectType: string;
}

function Subjects() {
    const data: Subject[] = [
        {
            subject: "Mathematics",
            subjectCode: "MATH101",
            teacher: "Mr. John Doe",
            subjectType: "Theory",
        },
        {
            subject: "English",
            subjectCode: "ENG101",
            teacher: "Ms. Jane Doe",
            subjectType: "Theory",
        },
        {
            subject: "Physics",
            subjectCode: "PHY101",
            teacher: "Mr. David Smith",
            subjectType: "Theory",
        },
        {
            subject: "Chemistry",
            subjectCode: "CHEM101",
            teacher: "Ms. Sarah Johnson",
            subjectType: "Theory",
        },
    ];
    const columns: ColumnDef<Subject>[] = [
        {
            accessorKey: "subject",
            header: "Subject",
        },
        {
            accessorKey: "subjectCode",
            header: "Subject Code",
        },
        {
            accessorKey: "teacher",
            header: "Teacher",
        },
        {
            accessorKey: "subjectType",
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
                data={data}
                columns={columns}
            />
        </>
    );
}

export default Subjects;
