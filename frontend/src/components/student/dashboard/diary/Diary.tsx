import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { ColumnDef } from "@tanstack/react-table";

interface Diary {
    sr: string;
    diaryDate: string;
    evaluationDate: string;
    completionPercentage: string;
    actions: string;
}

function Diary() {
    const data: Diary[] = [
        {
            sr: "1",
            diaryDate: "17-04-2025",
            evaluationDate: "17-04-2025",
            completionPercentage: "100%",
            actions: "View Details",
        },
        {
            sr: "2",
            diaryDate: "17-04-2025",
            evaluationDate: "17-04-2025",
            completionPercentage: "100%",
            actions: "View Details",
        },
        {
            sr: "3",
            diaryDate: "17-04-2025",
            evaluationDate: "17-04-2025",
            completionPercentage: "100%",
            actions: "View Details",
        },
        {
            sr: "4",
            diaryDate: "17-04-2025",
            evaluationDate: "17-04-2025",
            completionPercentage: "100%",
            actions: "View Details",
        },
    ];
    const columns: ColumnDef<Diary>[] = [
        {
            accessorKey: "sr",
            header: "Sr.",
        },
        {
            accessorKey: "diaryDate",
            header: "Diary Date",
        },
        {
            accessorKey: "evaluationDate",
            header: "Evaluation Date",
        },
        {
            accessorKey: "completionPercentage",
            header: "Completion Percentage",
        },
        {
            accessorKey: "actions",
            header: "Actions",
        },
    ];
    return (
        <>
            <Card className='shadow-md shadow-muted/30 border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Diary
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-4'>
                    <TenStackReactTable
                        data={data}
                        columns={columns}
                    />
                </CardContent>
            </Card>
        </>
    );
}

export default Diary;
