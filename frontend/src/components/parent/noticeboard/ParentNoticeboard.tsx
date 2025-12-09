import { useParams } from "react-router-dom";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetNotificationsQuery } from "@/store/slices/parent/notification/parentNotification.slice";
import Loader from "@/components/common/loader/Loader";
import { Notification } from "@/store/slices/parent/notification/types";
import DOMPurify from "dompurify";

function ParentNoticeboard() {
    const { childId } = useParams<{ childId: string }>();
    const {
        data: notificationData,
        isError,
        isLoading,
    } = useGetNotificationsQuery(childId || "", {
        skip: !childId,
    });

    if (isLoading) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Notice Board
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

    if (isError || !notificationData || !childId) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Notice Board
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-8 flex justify-center items-center text-destructive'>
                    Error loading notifications
                </CardContent>
            </Card>
        );
    }

    const notifications: Notification[] = notificationData.data?.notificationlist || [];

    
    return (
        <Card className='shadow-md shadow-muted/20 border border-border bg-card text-card-foreground rounded-2xl hover:shadow-lg hover:shadow-primary/20 transition-shadow'>
            <CardHeader className='border-b border-border pb-3'>
                <CardTitle className='text-2xl font-bold text-primary'>
                    📢 Notice Board
                </CardTitle>
            </CardHeader>

            <CardContent className='p-4'>
                {notifications.length === 0 ? (
                    <div className='text-center text-muted-foreground py-6'>
                        No notices available.
                    </div>
                ) : (
                    <Accordion
                        type='single'
                        collapsible
                        className='space-y-4'
                    >
                        {notifications.map((notification) => (
                            <AccordionItem
                                key={notification.id}
                                value={`item-${notification.id}`}
                                className='border border-border rounded-xl bg-background overflow-hidden transition hover:shadow-md hover:shadow-muted/30'
                            >
                                <AccordionTrigger className='flex justify-between items-center w-full px-4 py-3 text-left font-semibold text-foreground hover:bg-accent hover:text-accent-foreground transition-colors'>
                                    <div className='flex items-center gap-3 flex-1'>
                                        <span className='text-primary'>
                                            {notification.title}
                                        </span>
                                        {notification.notification_id ===
                                            "unread" && (
                                            <span className='text-xs font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground'>
                                                NEW
                                            </span>
                                        )}
                                    </div>
                                    {(notification.date || notification.publish_date) && (
                                        <span className='text-xs text-muted-foreground ml-2'>
                                            {new Date(
                                                notification.date || notification.publish_date
                                            ).toLocaleDateString()}
                                        </span>
                                    )}
                                </AccordionTrigger>

                                <AccordionContent className='px-5 py-4 text-sm leading-relaxed border-t border-border text-muted-foreground'>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                                notification.message || ""
                                            ),
                                        }}
                                    />
                                    {(notification.date || notification.publish_date) && (
                                        <div className='mt-3 pt-3 border-t border-border text-xs text-muted-foreground'>
                                            Published:{" "}
                                            {new Date(
                                                notification.publish_date || notification.date
                                            ).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
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

export default ParentNoticeboard;

