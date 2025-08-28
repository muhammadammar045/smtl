import { PageTitle } from "@/components/common/parts/BreadCrumb";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Trophy, Users } from "lucide-react";

interface ExamResult {
    subject: string;
    fullMarks: number;
    passingMarks: number;
    obtainedMarks: number | "Absent";
    result: "Pass" | "Fail";
    subjectPosition?: number;
    grade?: string;
}

interface ResultSummary {
    obtainedMarks: number;
    fullMarks: number;
    percentage: string;
    position: string;
    grade: string;
    result: "PASS" | "FAIL";
}

interface ClassSummary {
    firstPosition: string;
    lastPosition: string;
    noStudentsPassed: number;
    classSize: number;
    passRate: string;
    classAverage: string;
}

interface ExamSession {
    title: string;
    examResults: ExamResult[];
    studentSummary: ResultSummary;
    classSummary: ClassSummary;
}

function ExamsResult() {
    const examSessions: ExamSession[] = [
        {
            title: "Result: Weekly Test 2 Session (2025-26)",
            examResults: [
                {
                    subject: "Science",
                    fullMarks: 10,
                    passingMarks: 4,
                    obtainedMarks: "Absent",
                    result: "Fail",
                    grade: "-",
                },
            ],
            studentSummary: {
                obtainedMarks: 0,
                fullMarks: 10,
                percentage: "N/A",
                position: "22/22",
                grade: "-",
                result: "FAIL",
            },
            classSummary: {
                firstPosition: "100%",
                lastPosition: "0%",
                noStudentsPassed: 13,
                classSize: 22,
                passRate: "45.97%",
                classAverage: "37.25",
            },
        },
        {
            title: "Result: Weekly Test 1 Session (2025-26)",
            examResults: [
                {
                    subject: "Science",
                    fullMarks: 10,
                    passingMarks: 4,
                    obtainedMarks: "Absent",
                    result: "Fail",
                    grade: "-",
                },
                {
                    subject: "English",
                    fullMarks: 10,
                    passingMarks: 4,
                    obtainedMarks: 10,
                    result: "Pass",
                    subjectPosition: 1,
                    grade: "A++",
                },
            ],
            studentSummary: {
                obtainedMarks: 10,
                fullMarks: 20,
                percentage: "50.00%",
                position: "7/22",
                grade: "B",
                result: "PASS",
            },
            classSummary: {
                firstPosition: "100%",
                lastPosition: "0%",
                noStudentsPassed: 13,
                classSize: 22,
                passRate: "59.09%",
                classAverage: "45.83",
            },
        },
    ];

    return (
        <div className='space-y-12'>
            {examSessions.map((session, sessionIndex) => (
                <div
                    key={sessionIndex}
                    className='space-y-6'
                >
                    {/* Title */}
                    <PageTitle title={session.title} />

                    {/* Subject Results */}
                    <Card className='shadow-md shadow-muted/30 border border-border bg-card text-card-foreground rounded-xl'>
                        <CardHeader className='border-b border-border pb-3'>
                            <CardTitle className='text-lg font-semibold text-primary'>
                                Subject-wise Results
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='p-4'>
                            <Table>
                                <TableHeader>
                                    <TableRow className='bg-muted/30'>
                                        <TableHead className='font-semibold text-foreground'>
                                            Subject
                                        </TableHead>
                                        <TableHead className='font-semibold text-foreground'>
                                            Full Marks
                                        </TableHead>
                                        <TableHead className='font-semibold text-foreground'>
                                            Passing Marks
                                        </TableHead>
                                        <TableHead className='font-semibold text-foreground'>
                                            Obtained
                                        </TableHead>
                                        <TableHead className='font-semibold text-foreground'>
                                            Result
                                        </TableHead>
                                        <TableHead className='font-semibold text-foreground'>
                                            Position
                                        </TableHead>
                                        <TableHead className='font-semibold text-foreground'>
                                            Grade
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {session.examResults.map(
                                        (result, index) => (
                                            <TableRow
                                                key={index}
                                                className='hover:bg-muted/30 transition-colors'
                                            >
                                                <TableCell>
                                                    {result.subject}
                                                </TableCell>
                                                <TableCell>
                                                    {result.fullMarks}
                                                </TableCell>
                                                <TableCell>
                                                    {result.passingMarks}
                                                </TableCell>
                                                <TableCell className='font-medium'>
                                                    {result.obtainedMarks}
                                                </TableCell>
                                                <TableCell>
                                                    {result.result ===
                                                    "Pass" ? (
                                                        <Badge
                                                            variant='secondary'
                                                            className='flex items-center gap-1 px-2 py-1'
                                                        >
                                                            <CheckCircle className='w-4 h-4' />
                                                            Pass
                                                        </Badge>
                                                    ) : (
                                                        <Badge
                                                            variant='destructive'
                                                            className='flex items-center gap-1 px-2 py-1'
                                                        >
                                                            <XCircle className='w-4 h-4' />
                                                            Fail
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {result.subjectPosition ? (
                                                        <div className='flex items-center gap-1 text-primary font-medium'>
                                                            <Trophy className='w-4 h-4' />{" "}
                                                            {
                                                                result.subjectPosition
                                                            }
                                                        </div>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </TableCell>
                                                <TableCell className='font-medium'>
                                                    {result.grade}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Summaries */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {/* Student Summary */}
                        <Card className='shadow-md shadow-muted/30 border border-border bg-card text-card-foreground rounded-xl'>
                            <CardHeader className='border-b border-border pb-3'>
                                <CardTitle className='text-primary font-semibold flex items-center gap-2'>
                                    <Users className='w-5 h-5' />
                                    Student Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='p-4'>
                                <ul className='space-y-3 text-sm text-muted-foreground'>
                                    <li className='flex justify-between'>
                                        <span>Obtained Marks</span>
                                        <span className='font-medium text-foreground'>
                                            {
                                                session.studentSummary
                                                    .obtainedMarks
                                            }
                                        </span>
                                    </li>
                                    <li className='flex justify-between'>
                                        <span>Full Marks</span>
                                        <span className='font-medium text-foreground'>
                                            {session.studentSummary.fullMarks}
                                        </span>
                                    </li>
                                    <li className='flex justify-between'>
                                        <span>Percentage</span>
                                        <span className='font-medium text-foreground'>
                                            {session.studentSummary.percentage}
                                        </span>
                                    </li>
                                    <li className='flex justify-between'>
                                        <span>Position</span>
                                        <span className='font-medium text-foreground'>
                                            {session.studentSummary.position}
                                        </span>
                                    </li>
                                    <li className='flex justify-between'>
                                        <span>Grade</span>
                                        <span className='font-medium text-foreground'>
                                            {session.studentSummary.grade}
                                        </span>
                                    </li>
                                    <li className='flex justify-between'>
                                        <span>Result</span>
                                        {session.studentSummary.result ===
                                        "PASS" ? (
                                            <Badge
                                                variant='secondary'
                                                className='flex items-center gap-1 px-2 py-1'
                                            >
                                                <CheckCircle className='w-4 h-4' />
                                                PASS
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant='destructive'
                                                className='flex items-center gap-1 px-2 py-1'
                                            >
                                                <XCircle className='w-4 h-4' />
                                                FAIL
                                            </Badge>
                                        )}
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Class Summary */}
                        <Card className='shadow-md shadow-muted/30 border border-border bg-card text-card-foreground rounded-xl'>
                            <CardHeader className='border-b border-border pb-3'>
                                <CardTitle className='text-primary font-semibold flex items-center gap-2'>
                                    <Trophy className='w-5 h-5' />
                                    Class Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='p-4'>
                                <ul className='space-y-3 text-sm text-muted-foreground'>
                                    <li className='flex justify-between'>
                                        <span>First Position</span>
                                        <span className='font-medium text-foreground'>
                                            {session.classSummary.firstPosition}
                                        </span>
                                    </li>
                                    <li className='flex justify-between'>
                                        <span>Last Position</span>
                                        <span className='font-medium text-foreground'>
                                            {session.classSummary.lastPosition}
                                        </span>
                                    </li>
                                    <li className='flex justify-between'>
                                        <span>No. Students Passed</span>
                                        <span className='font-medium text-foreground'>
                                            {
                                                session.classSummary
                                                    .noStudentsPassed
                                            }
                                        </span>
                                    </li>
                                    <li className='flex justify-between'>
                                        <span>Class Size</span>
                                        <span className='font-medium text-foreground'>
                                            {session.classSummary.classSize}
                                        </span>
                                    </li>
                                    <li className='flex justify-between'>
                                        <span>Pass Rate</span>
                                        <span className='font-medium text-foreground'>
                                            {session.classSummary.passRate}
                                        </span>
                                    </li>
                                    <li className='flex justify-between'>
                                        <span>Class Average</span>
                                        <span className='font-medium text-foreground'>
                                            {session.classSummary.classAverage}
                                        </span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ExamsResult;
