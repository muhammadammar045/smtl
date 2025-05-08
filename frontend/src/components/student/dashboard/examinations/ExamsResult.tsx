import React from "react";
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
            title: "Result: Weekly Test 2 Session(2025-26)",
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
            title: "Result: Weekly Test 1 Session 2025-26",
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
        <div className='space-y-8'>
            {examSessions.map((session, sessionIndex) => (
                <div
                    key={sessionIndex}
                    className='space-y-6'
                >
                    <PageTitle
                        title={session.title}
                        description=''
                    />

                    <Card>
                        <CardContent className='p-6'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Full Marks</TableHead>
                                        <TableHead>Passing Marks</TableHead>
                                        <TableHead>Obtain Marks</TableHead>
                                        <TableHead>Result</TableHead>
                                        <TableHead>Subject Position</TableHead>
                                        <TableHead>Grade</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {session.examResults.map(
                                        (result, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {result.subject}
                                                </TableCell>
                                                <TableCell>
                                                    {result.fullMarks}
                                                </TableCell>
                                                <TableCell>
                                                    {result.passingMarks}
                                                </TableCell>
                                                <TableCell>
                                                    {result.obtainedMarks}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            result.result ===
                                                            "Pass"
                                                                ? "default"
                                                                : "destructive"
                                                        }
                                                    >
                                                        {result.result}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {result.subjectPosition ||
                                                        "-"}
                                                </TableCell>
                                                <TableCell>
                                                    {result.grade}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <div className='grid grid-cols-2 gap-6'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Student Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                Obtained Marks
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    session.studentSummary
                                                        .obtainedMarks
                                                }
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Full Marks</TableCell>
                                            <TableCell>
                                                {
                                                    session.studentSummary
                                                        .fullMarks
                                                }
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Percentage</TableCell>
                                            <TableCell>
                                                {
                                                    session.studentSummary
                                                        .percentage
                                                }
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Position</TableCell>
                                            <TableCell>
                                                {
                                                    session.studentSummary
                                                        .position
                                                }
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Grade</TableCell>
                                            <TableCell>
                                                {session.studentSummary.grade}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>RESULT</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        session.studentSummary
                                                            .result === "PASS"
                                                            ? "default"
                                                            : "destructive"
                                                    }
                                                >
                                                    {
                                                        session.studentSummary
                                                            .result
                                                    }
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Class Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                First Position
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    session.classSummary
                                                        .firstPosition
                                                }
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Last Position</TableCell>
                                            <TableCell>
                                                {
                                                    session.classSummary
                                                        .lastPosition
                                                }
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                No Students Passed
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    session.classSummary
                                                        .noStudentsPassed
                                                }
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Class Size</TableCell>
                                            <TableCell>
                                                {session.classSummary.classSize}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Pass Rate</TableCell>
                                            <TableCell>
                                                {session.classSummary.passRate}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Class Average</TableCell>
                                            <TableCell>
                                                {
                                                    session.classSummary
                                                        .classAverage
                                                }
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ExamsResult;
