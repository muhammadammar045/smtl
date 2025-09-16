import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Diary, DiaryEntry, SessionMonth } from "@/store/slices/diary/types";

import { ColumnDef } from "@tanstack/react-table";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { useGetDiaryQuery } from "@/store/slices/diary/diary.slice";

interface TableRow extends SessionMonth {
    diaryContent: string;
}

function DiaryComponent() {
    const { data } = useGetDiaryQuery();

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

export default DiaryComponent;
