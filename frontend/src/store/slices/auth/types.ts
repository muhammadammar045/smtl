export interface IUser {
    status: string;
    role: string;
    redirect_url: string;
    session: {
        id: string;
        student_id: string;
        role: string;
        username: string;
        date_format: string;
        currency_symbol: string;
        timezone: string;
        sch_name: string;
        language: {
            lang_id: string;
            language: string;
        };
        is_rtl: string;
        theme: string;
        image: string;
    };
}
