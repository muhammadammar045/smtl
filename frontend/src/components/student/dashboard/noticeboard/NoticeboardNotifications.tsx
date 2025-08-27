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

    if (isLoading) return <div className='text-center py-10'>Loading...</div>;
    if (error)
        return <div className='text-center py-10'>Something went wrong.</div>;

    return (
        <>
            <PageTitle
                title='📢 Notice Board'
                description='Latest updates and important announcements.'
            />

            <Card className='p-6 shadow-md rounded-lg'>
                {noticeboardNotifications?.length === 0 ? (
                    <div className='text-center'>No notices available.</div>
                ) : (
                    <Accordion
                        type='single'
                        collapsible
                        className='space-y-4'
                    >
                        {noticeboardNotifications.map((notification) => (
                            <AccordionItem
                                key={notification.id}
                                value={`item-${notification.id}`}
                                className='border rounded-lg overflow-hidden'
                            >
                                <AccordionTrigger className='flex justify-between items-center w-full px-4 py-3 transition-colors'>
                                    <div className='flex items-center gap-3 text-left font-semibold'>
                                        <span>{notification.title}</span>
                                        {notification.notification_id ===
                                            "unread" && (
                                            <span className='text-xs font-bold px-2 py-0.5 rounded-full shadow-sm'>
                                                NEW
                                            </span>
                                        )}
                                    </div>
                                </AccordionTrigger>

                                <AccordionContent className='px-5 py-4 text-sm leading-relaxed border-t'>
                                    <div
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
                )}
            </Card>
        </>
    );
}

export default NoticeboardNotifications;
