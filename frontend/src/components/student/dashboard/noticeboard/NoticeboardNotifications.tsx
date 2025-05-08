import { PageTitle } from "@/components/common/parts/BreadCrumb";
import { Card } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";

interface Notice {
    title: string;
    date: string;
    isNew?: boolean;
}

function NoticeboardNotifications() {
    const notices: Notice[] = [
        { title: "EID Milan Party Notice", date: "17-04-2025", isNew: true },
        { title: "Eid ul Fitr Notice", date: "27-03-2025", isNew: true },
        { title: "Grammar books Notice", date: "26-03-2025", isNew: true },
        { title: "Kashmir Day Notice", date: "04-02-2025" },
        { title: "4th Parents Teacher Meeting Notice", date: "16-01-2025" },
        { title: "Final Term Exam fee Notice", date: "08-01-2025" },
    ];

    return (
        <>
            <PageTitle
                title='Notice Board'
                description=''
            />

            <Card className='p-4'>
                <div className='flex flex-col gap-2'>
                    {notices.map((notice, index) => (
                        <div
                            key={index}
                            className='flex items-center justify-between py-3 border-b last:border-b-0'
                        >
                            <div className='flex items-center gap-2'>
                                <span className='text-primary hover:text-primary/80 cursor-pointer'>
                                    {notice.title}
                                </span>
                                {notice.isNew && (
                                    <span className='bg-red-500 text-white text-xs px-1.5 py-0.5 rounded'>
                                        New
                                    </span>
                                )}
                            </div>
                            <div className='flex items-center gap-2 text-muted-foreground text-sm'>
                                <CalendarIcon className='h-4 w-4' />
                                <span>Date: {notice.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </>
    );
}

export default NoticeboardNotifications;
