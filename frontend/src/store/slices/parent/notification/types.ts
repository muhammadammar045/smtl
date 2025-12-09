export interface Notification {
    id: string;
    title: string;
    publish_date: string;
    date: string;
    message: string;
    notification_id: string;
}

export interface ParentNoticeBoardData {
    title?: string;
    student_id?: string | null;
    notificationlist: Notification[];
}

