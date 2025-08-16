// types.ts
export interface ILanguage {
    lang_id: string;
    language: string;
}

export interface ISession {
    id: string;
    student_id: string;
    role: "student" | "parent";
    username: string;
    date_format: string;
    currency_symbol: string;
    timezone: string;
    sch_name: string;
    language: ILanguage;
    is_rtl: "enabled" | "disabled";
    theme: string;
    image: string;
}

export interface IUser {
    status: "success" | "error";
    role: "student" | "parent";
    redirect_url: string;
    session: ISession;
}
