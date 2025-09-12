import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Trophy, Users, XCircle } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { PageTitle } from "@/components/common/parts/BreadCrumb";
import { useGetExamResultsQuery } from "@/store/slices/examSchedule/examSchedule.slice";

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
    const { data } = useGetExamResultsQuery();
    console.log("🚀 -----------------------------------------------------🚀");
    console.log("🚀 ~ ExamsResult.tsx:53 ~ ExamsResult ~ data==>", data);
    console.log("🚀 -----------------------------------------------------🚀");
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
                    <Card className='shadow-md shadow-muted/20 border border-border bg-card text-card-foreground rounded-2xl hover:shadow-lg hover:shadow-primary/20 transition-shadow'>
                        <CardHeader className='border-b border-border py-3'>
                            <CardTitle className='text-xl font-bold text-primary'>
                                📚 Subject-wise Results
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='p-4'>
                            <Table>
                                <TableHeader>
                                    <TableRow className='bg-muted/40'>
                                        {[
                                            "Subject",
                                            "Full Marks",
                                            "Passing Marks",
                                            "Obtained",
                                            "Result",
                                            "Position",
                                            "Grade",
                                        ].map((head) => (
                                            <TableHead
                                                key={head}
                                                className='font-semibold text-foreground'
                                            >
                                                {head}
                                            </TableHead>
                                        ))}
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
                                                    {result.obtainedMarks ===
                                                    "Absent" ? (
                                                        <span className='italic text-muted-foreground'>
                                                            Absent
                                                        </span>
                                                    ) : (
                                                        result.obtainedMarks
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {result.result ===
                                                    "Pass" ? (
                                                        <Badge
                                                            variant='default'
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
                                                            <Trophy className='w-4 h-4' />
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
                        <Card className='shadow-md shadow-muted/20 border border-border bg-card text-card-foreground rounded-2xl'>
                            <CardHeader className='border-b border-border py-3'>
                                <CardTitle className='text-primary font-bold flex items-center gap-2'>
                                    <Users className='w-5 h-5 text-primary' />
                                    Student Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='p-4'>
                                <ul className='space-y-3 text-sm text-muted-foreground'>
                                    {[
                                        [
                                            "Obtained Marks",
                                            session.studentSummary
                                                .obtainedMarks,
                                        ],
                                        [
                                            "Full Marks",
                                            session.studentSummary.fullMarks,
                                        ],
                                        [
                                            "Percentage",
                                            session.studentSummary.percentage,
                                        ],
                                        [
                                            "Position",
                                            session.studentSummary.position,
                                        ],
                                        ["Grade", session.studentSummary.grade],
                                    ].map(([label, value]) => (
                                        <li
                                            key={label}
                                            className='flex justify-between'
                                        >
                                            <span>{label}</span>
                                            <span className='font-medium text-foreground'>
                                                {value}
                                            </span>
                                        </li>
                                    ))}
                                    <li className='flex justify-between'>
                                        <span>Result</span>
                                        {session.studentSummary.result ===
                                        "PASS" ? (
                                            <Badge
                                                variant='success'
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
                        <Card className='shadow-md shadow-muted/20 border border-border bg-card text-card-foreground rounded-2xl'>
                            <CardHeader className='border-b border-border py-3'>
                                <CardTitle className='text-primary font-bold flex items-center gap-2'>
                                    <Trophy className='w-5 h-5 text-primary' />
                                    Class Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='p-4'>
                                <ul className='space-y-3 text-sm text-muted-foreground'>
                                    {[
                                        [
                                            "First Position",
                                            session.classSummary.firstPosition,
                                        ],
                                        [
                                            "Last Position",
                                            session.classSummary.lastPosition,
                                        ],
                                        [
                                            "No. Students Passed",
                                            session.classSummary
                                                .noStudentsPassed,
                                        ],
                                        [
                                            "Class Size",
                                            session.classSummary.classSize,
                                        ],
                                        [
                                            "Pass Rate",
                                            session.classSummary.passRate,
                                        ],
                                        [
                                            "Class Average",
                                            session.classSummary.classAverage,
                                        ],
                                    ].map(([label, value]) => (
                                        <li
                                            key={label}
                                            className='flex justify-between'
                                        >
                                            <span>{label}</span>
                                            <span className='font-medium text-foreground'>
                                                {value}
                                            </span>
                                        </li>
                                    ))}
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
