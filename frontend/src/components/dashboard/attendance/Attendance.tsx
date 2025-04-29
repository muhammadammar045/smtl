import { PageTitle } from "@/components/common/parts/BreadCrumb";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { ColumnDef } from "@tanstack/react-table";

interface AttendanceData {
    id: number;
    name: string;
    rollNumber: string;
    class: string;
    section: string;
    rte: string;
    campus: string;
    group: string;
    studentMobile: string;
    religion: string;
}

function Attendance() {
    const data: AttendanceData[] = [
        {
            id: 1,
            name: "Parisa Zainab",
            rollNumber: "afss-B17-00604",
            class: "I",
            section: "Blue Bells",
            rte: "Yes",
            campus: "Junior School",
            group: "Science",
            studentMobile: "03327755522",
            religion: "Islam",
        },
        {
            id: 2,
            name: "Parisa Zainab",
            rollNumber: "afss-B17-00604",
            class: "I",
            section: "Blue Bells",
            rte: "Yes",
            campus: "Junior School",
            group: "Science",
            studentMobile: "03327755522",
            religion: "Islam",
        },
        {
            id: 3,
            name: "Parisa Zainab",
            rollNumber: "afss-B17-00604",
            class: "I",
            section: "Blue Bells",
            rte: "Yes",
            campus: "Junior School",
            group: "Science",
            studentMobile: "03327755522",
            religion: "Islam",
        },
        {
            id: 4,
            name: "Parisa Zainab",
            rollNumber: "afss-B17-00604",
            class: "I",
            section: "Blue Bells",
            rte: "Yes",
            campus: "Junior School",
            group: "Science",
            studentMobile: "03327755522",
            religion: "Islam",
        },
        {
            id: 5,
            name: "Parisa Zainab",
            rollNumber: "afss-B17-00604",
            class: "I",
            section: "Blue Bells",
            rte: "Yes",
            campus: "Junior School",
            group: "Science",
            studentMobile: "03327755522",
            religion: "Islam",
        },
        {
            id: 6,
            name: "Parisa Zainab",
            rollNumber: "afss-B17-00604",
            class: "I",
            section: "Blue Bells",
            rte: "Yes",
            campus: "Junior School",
            group: "Science",
            studentMobile: "03327755522",
            religion: "Islam",
        },
        {
            id: 7,
            name: "Parisa Zainab",
            rollNumber: "afss-B17-00604",
            class: "I",
            section: "Blue Bells",
            rte: "Yes",
            campus: "Junior School",
            group: "Science",
            studentMobile: "03327755522",
            religion: "Islam",
        },
        {
            id: 8,
            name: "Parisa Zainab",
            rollNumber: "afss-B17-00604",
            class: "I",
            section: "Blue Bells",
            rte: "Yes",
            campus: "Junior School",
            group: "Science",
            studentMobile: "03327755522",
            religion: "Islam",
        },
        {
            id: 9,
            name: "Parisa Zainab",
            rollNumber: "afss-B17-00604",
            class: "I",
            section: "Blue Bells",
            rte: "Yes",
            campus: "Junior School",
            group: "Science",
            studentMobile: "03327755522",
            religion: "Islam",
        },
        {
            id: 10,
            name: "Parisa Zainab",
            rollNumber: "afss-B17-00604",
            class: "I",
            section: "Blue Bells",
            rte: "Yes",
            campus: "Junior School",
            group: "Science",
            studentMobile: "03327755522",
            religion: "Islam",
        },
        {
            id: 11,
            name: "Parisa Zainab",
            rollNumber: "afss-B17-00604",
            class: "I",
            section: "Blue Bells",
            rte: "Yes",
            campus: "Junior School",
            group: "Science",
            studentMobile: "03327755522",
            religion: "Islam",
        },
        {
            id: 12,
            name: "Parisa Zainab",
            rollNumber: "afss-B17-00604",
            class: "I",
            section: "Blue Bells",
            rte: "Yes",
            campus: "Junior School",
            group: "Science",
            studentMobile: "03327755522",
            religion: "Islam",
        },
        {
            id: 13,
            name: "Parisa Zainab",
            rollNumber: "afss-B17-00604",
            class: "I",
            section: "Blue Bells",
            rte: "Yes",
            campus: "Junior School",
            group: "Science",
            studentMobile: "03327755522",
            religion: "Islam",
        },
        {
            id: 14,
            name: "Parisa Zainab",
            rollNumber: "afss-B17-00604",
            class: "I",
            section: "Blue Bells",
            rte: "Yes",
            campus: "Junior School",
            group: "Science",
            studentMobile: "03327755522",
            religion: "Islam",
        },
        {
            id: 15,
            name: "Parisa Zainab",
            rollNumber: "afss-B17-00604",
            class: "I",
            section: "Blue Bells",
            rte: "Yes",
            campus: "Junior School",
            group: "Science",
            studentMobile: "03327755522",
            religion: "Islam",
        },
        {
            id: 16,
            name: "Parisa Zainab",
            rollNumber: "afss-B17-00604",
            class: "I",
            section: "Blue Bells",
            rte: "Yes",
            campus: "Junior School",
            group: "Science",
            studentMobile: "03327755522",
            religion: "Islam",
        },
        {
            id: 17,
            name: "Parisa Zainab",
            rollNumber: "afss-B17-00604",
            class: "I",
            section: "Blue Bells",
            rte: "Yes",
            campus: "Junior School",
            group: "Science",
            studentMobile: "03327755522",
            religion: "Islam",
        },
        {
            id: 18,
            name: "Parisa Zainab",
            rollNumber: "afss-B17-00604",
            class: "I",
            section: "Blue Bells",
            rte: "Yes",
            campus: "Junior School",
            group: "Science",
            studentMobile: "03327755522",
            religion: "Islam",
        },
        {
            id: 19,
            name: "Parisa Zainab",
            rollNumber: "afss-B17-00604",
            class: "I",
            section: "Blue Bells",
            rte: "Yes",
            campus: "Junior School",
            group: "Science",
            studentMobile: "03327755522",
            religion: "Islam",
        },
        {
            id: 20,
            name: "Parisa Zainab",
            rollNumber: "afss-B17-00604",
            class: "I",
            section: "Blue Bells",
            rte: "Yes",
            campus: "Junior School",
            group: "Science",
            studentMobile: "03327755522",
            religion: "Islam",
        },
    ];

    const columns: ColumnDef<AttendanceData>[] = [
        {
            accessorKey: "id",
            header: "ID",
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "rollNumber",
            header: "Roll Number",
        },
        {
            accessorKey: "class",
            header: "Class",
        },
        {
            accessorKey: "section",
            header: "Section",
        },
        {
            accessorKey: "rte",
            header: "RTE",
        },
        {
            accessorKey: "campus",
            header: "Campus",
        },
        {
            accessorKey: "group",
            header: "Group",
        },
        {
            accessorKey: "studentMobile",
            header: "Mobile",
        },
        {
            accessorKey: "religion",
            header: "Religion",
        },
    ];

    return (
        <>
            <PageTitle
                title='Attendance'
                description=''
            />
            <TenStackReactTable
                data={data}
                columns={columns}
            />
        </>
    );
}

export default Attendance;
