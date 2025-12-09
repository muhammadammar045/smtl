import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DiaryEntry, SessionMonth } from "@/store/slices/diary/types";
import { ColumnDef } from "@tanstack/react-table";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { useGetDiaryQuery } from "@/store/slices/parent/diary/parentDiary.slice";
import Loader from "@/components/common/loader/Loader";

interface TableRow extends SessionMonth {
    diaryContent: string;
}

function ParentDiary() {
    const { childId } = useParams<{ childId: string }>();
    const { data, isLoading, isError } = useGetDiaryQuery(childId || "", {
        skip: !childId,
    });

    if (isLoading) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Diary
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

    if (isError || !data || !childId) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Diary
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-8 flex justify-center items-center text-destructive'>
                    Error loading diary
                </CardContent>
            </Card>
        );
    }

    const sessionMonths = data?.data?.session_months ?? [];
    const diaryMap: Record<string, DiaryEntry | null> =
        data?.data?.diarylist ?? {};

    const tableData: TableRow[] = sessionMonths.map((month) => {
        const diaryEntry = diaryMap[month.session_month];

        return {
            ...month,
            diaryContent: diaryEntry?.content || "No diaries",
        };
    });

    const columns: ColumnDef<TableRow>[] = [
        {
            header: "Year",
            accessorKey: "year",
        },
        {
            header: "Month",
            accessorKey: "month",
        },
        {
            header: "Session Month",
            accessorKey: "session_month",
        },
        {
            header: "Diary",
            accessorKey: "diaryContent",
        },
    ];

    return (
        <Card className='shadow-md shadow-muted/30 border border-border bg-card text-card-foreground rounded-xl'>
            <CardHeader className='border-b border-border pb-3'>
                <CardTitle className='text-3xl font-bold text-primary'>
                    Diary
                </CardTitle>
            </CardHeader>
            <CardContent className='p-4'>
                <TenStackReactTable
                    data={tableData}
                    columns={columns}
                />
            </CardContent>
        </Card>
    );
}

export default ParentDiary;

