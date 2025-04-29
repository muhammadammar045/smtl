import React from "react";
import { PageTitle } from "@/components/common/parts/BreadCrumb";
import TenStackReactTable from "@/utilities/tenstack-reacttable/TenStackReactTable";
import { ColumnDef } from "@tanstack/react-table";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface ExamScheduleData {
    subject: string;
    date: string;
    startTime: string;
    endTime: string;
    fullMarks: number;
    passingMarks: number;
}

const examScheduleData = {
    "Weekly Test 1 Session 2025-26": {
        resultDate: "24-03-2025 11:13",
        schedule: [
            {
                subject: "Computer",
                date: "2025-02-24",
                startTime: "08:30 AM",
                endTime: "11:30 AM",
                fullMarks: 10,
                passingMarks: 4,
            },
            {
                subject: "English",
                date: "2025-02-24",
                startTime: "08:30 AM",
                endTime: "11:30 AM",
                fullMarks: 10,
                passingMarks: 4,
            },
            {
                subject: "Islamiat",
                date: "2025-02-24",
                startTime: "08:30 AM",
                endTime: "11:30 AM",
                fullMarks: 10,
                passingMarks: 4,
            },
            {
                subject: "Mathematics",
                date: "2025-02-24",
                startTime: "08:30 AM",
                endTime: "11:30 AM",
                fullMarks: 10,
                passingMarks: 4,
            },
            {
                subject: "Science",
                date: "2025-02-24",
                startTime: "08:30 AM",
                endTime: "11:30 AM",
                fullMarks: 10,
                passingMarks: 4,
            },
            {
                subject: "Social Studies",
                date: "2025-02-24",
                startTime: "08:30 AM",
                endTime: "11:30 AM",
                fullMarks: 10,
                passingMarks: 4,
            },
            {
                subject: "Urdu",
                date: "2025-02-24",
                startTime: "08:30 AM",
                endTime: "11:30 AM",
                fullMarks: 10,
                passingMarks: 4,
            },
            {
                subject: "Values",
                date: "2025-02-24",
                startTime: "08:30 AM",
                endTime: "11:30 AM",
                fullMarks: 0,
                passingMarks: 0,
            },
        ],
    },
    "Weekly Test 2 Session(2025-26)": {
        resultDate: "07-04-2025 10:07",
        schedule: [],
    },
    "Weekly Test 3 Session (2025-26)": {
        resultDate: "14-04-2025 10:05",
        schedule: [],
    },
};

function ExamSchedule() {
    const columns: ColumnDef<ExamScheduleData>[] = [
        {
            accessorKey: "subject",
            header: "Subject",
        },
        {
            accessorKey: "date",
            header: "Date",
        },
        {
            accessorKey: "startTime",
            header: "Start Time",
        },
        {
            accessorKey: "endTime",
            header: "End Time",
        },
        {
            accessorKey: "fullMarks",
            header: "Full Marks",
        },
        {
            accessorKey: "passingMarks",
            header: "Passing Marks",
        },
    ];

    return (
        <>
            <PageTitle
                title='Exam Schedule'
                description=''
                fontSize='text-2xl'
            />

            <Accordion
                type='single'
                collapsible
                className='w-full'
            >
                {Object.entries(examScheduleData).map(
                    ([testName, testData]) => (
                        <AccordionItem
                            key={testName}
                            value={testName}
                        >
                            <AccordionTrigger className='px-4'>
                                <div className='flex flex-col items-start'>
                                    <span className='text-base font-semibold'>
                                        {testName}
                                    </span>
                                    <span className='text-sm text-muted-foreground'>
                                        Result Date: {testData.resultDate}
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className='px-4'>
                                <TenStackReactTable
                                    data={testData.schedule}
                                    columns={columns}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    )
                )}
            </Accordion>
        </>
    );
}

export default ExamSchedule;
