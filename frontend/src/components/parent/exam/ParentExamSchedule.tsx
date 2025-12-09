import { useParams } from "react-router-dom";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ExamScheduleDetail,
    ExamSchedule as IExamSchedule,
} from "@/store/slices/examSchedule/types";
import { ColumnDef } from "@tanstack/react-table";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { useGetExamTimetableQuery } from "@/store/slices/parent/exam/parentExam.slice";
import Loader from "@/components/common/loader/Loader";

interface ExamScheduleRow {
    subject: string;
    teacher: string;
    date: string;
    startTime: string;
    endTime: string;
    fullMarks: number;
    passingMarks: number;
}

interface TransformedExam {
    id: string;
    testName: string;
    resultDate: string;
    schedule: ExamScheduleRow[];
}

function ParentExamSchedule() {
    const { childId } = useParams<{ childId: string }>();
    const { data, isLoading, isError } = useGetExamTimetableQuery(childId || "", {
        skip: !childId,
    });

    const columns: ColumnDef<ExamScheduleRow>[] = [
        { accessorKey: "subject", header: "Subject" },
        { accessorKey: "teacher", header: "Teacher" },
        { accessorKey: "date", header: "Date" },
        { accessorKey: "startTime", header: "Start Time" },
        { accessorKey: "endTime", header: "End Time" },
        { accessorKey: "fullMarks", header: "Full Marks" },
        { accessorKey: "passingMarks", header: "Passing Marks" },
    ];

    if (isLoading) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Exam Schedule
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
                        Exam Schedule
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-8 flex justify-center items-center text-destructive'>
                    Error loading exam schedule
                </CardContent>
            </Card>
        );
    }

    // Transform API response - parent API returns single object with examSchedule array
    const examScheduleData: TransformedExam[] =
        data?.data?.examSchedule?.map((exam: IExamSchedule) => ({
            id: exam.id,
            testName: exam.name,
            resultDate: exam.result_date || "—",
            schedule:
                exam.exam_schedule_details?.map((d: ExamScheduleDetail) => ({
                    subject: d.name,
                    teacher: d.staff_name,
                    date: new Date(d.date_of_exam).toLocaleDateString("en-GB"),
                    startTime: d.start_to,
                    endTime: d.end_from,
                    fullMarks: Number(d.full_marks) || 0,
                    passingMarks: Number(d.passing_marks) || 0,
                })) ?? [],
        })) ?? [];

    return (
        <Card className='shadow-md shadow-muted/20 border border-border bg-card text-card-foreground rounded-2xl hover:shadow-lg hover:shadow-primary/20 transition-shadow'>
            <CardHeader className='border-b border-border pb-3'>
                <CardTitle className='text-2xl font-bold text-primary'>
                    📝 Exam Schedule
                </CardTitle>
            </CardHeader>

            <CardContent className='p-4'>
                {examScheduleData.length === 0 ? (
                    <div className='text-center text-muted-foreground py-6'>
                        No exam schedules available.
                    </div>
                ) : (
                    <Accordion
                        type='single'
                        collapsible
                        className='w-full space-y-4'
                    >
                        {examScheduleData.map((exam) => (
                            <AccordionItem
                                key={exam.id}
                                value={exam.id}
                                className='border border-border rounded-xl bg-background overflow-hidden hover:shadow-md hover:shadow-muted/30 transition'
                            >
                                <AccordionTrigger className='px-4 py-3 flex flex-col items-start text-left font-semibold text-foreground hover:bg-accent hover:text-accent-foreground transition-colors'>
                                    <span className='text-base font-semibold'>
                                        {exam.testName}
                                    </span>
                                    <span className='text-sm text-muted-foreground'>
                                        📅 Result Date: {exam.resultDate}
                                    </span>
                                </AccordionTrigger>

                                <AccordionContent className='px-4 py-3'>
                                    {exam.schedule.length > 0 ? (
                                        <TenStackReactTable
                                            data={exam.schedule}
                                            columns={columns}
                                        />
                                    ) : (
                                        <div className='text-center text-muted-foreground py-4'>
                                            No subjects scheduled for this test.
                                        </div>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
            </CardContent>
        </Card>
    );
}

export default ParentExamSchedule;

