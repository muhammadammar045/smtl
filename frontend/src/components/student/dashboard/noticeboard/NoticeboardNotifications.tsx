import DOMPurify from "dompurify";
import { PageTitle } from "@/components/common/parts/BreadCrumb";
import { Card } from "@/components/ui/card";
import {
    selectNoticeBoardNotifications,
    useGetNoticeBoardNotificationsQuery,
} from "@/store/slices/noticeboard/noticeboard.slice";
import { useSelector } from "react-redux";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

function NoticeboardNotifications() {
    const { isLoading, error } = useGetNoticeBoardNotificationsQuery();
    const noticeboardNotifications = useSelector(
        selectNoticeBoardNotifications
    );

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error</div>;

    return (
        <>
            <PageTitle
                title='Notice Board'
                description=''
            />

            <Card className='p-4'>
                <Accordion
                    type='single'
                    collapsible
                    className='w-full'
                >
                    {noticeboardNotifications?.map((notification) => (
                        <AccordionItem
                            key={notification.id}
                            value={`item-${notification.id}`}
                            className='border-b'
                        >
                            <AccordionTrigger className='flex justify-between items-center gap-2'>
                                <div className='flex items-center gap-2 text-left'>
                                    <span className='text-primary font-medium'>
                                        {notification.title}
                                    </span>
                                    {notification.notification_id ===
                                        "unread" && (
                                        <span className='bg-red-500 text-white text-xs px-1.5 py-0.5 rounded'>
                                            New
                                        </span>
                                    )}
                                </div>
                            </AccordionTrigger>

                            <AccordionContent>
                                <div
                                    className='text-sm text-muted-foreground mt-2'
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(
                                            notification.message
                                        ),
                                    }}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </Card>
        </>
    );
}

export default NoticeboardNotifications;
