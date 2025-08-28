import DOMPurify from "dompurify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

    if (isLoading)
        return (
            <div className='text-center py-10 text-muted-foreground'>
                Loading...
            </div>
        );

    if (error)
        return (
            <div className='text-center py-10 text-destructive'>
                Something went wrong.
            </div>
        );

    return (
        <>
            <Card className='shadow-md shadow-muted/30 border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Notice Board
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-4'>
                    {noticeboardNotifications?.length === 0 ? (
                        <div className='text-center text-muted-foreground'>
                            No notices available.
                        </div>
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
                                    className='border border-border rounded-lg overflow-hidden bg-background'
                                >
                                    <AccordionTrigger className='flex justify-between items-center w-full px-4 py-3 transition-colors hover:bg-accent hover:text-accent-foreground'>
                                        <div className='flex items-center gap-3 text-left font-semibold text-primary'>
                                            <span>{notification.title}</span>
                                            {notification.notification_id ===
                                                "unread" && (
                                                <span className='text-xs font-bold px-2 py-0.5 rounded-full bg-primary text-secondary-foreground'>
                                                    NEW
                                                </span>
                                            )}
                                        </div>
                                    </AccordionTrigger>

                                    <AccordionContent className='px-5 py-4 text-sm leading-relaxed border-t border-border text-muted-foreground'>
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
                </CardContent>
            </Card>
        </>
    );
}

export default NoticeboardNotifications;
