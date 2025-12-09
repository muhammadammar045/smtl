export interface IChild {
    id: string;
    firstname: string;
    lastname: string;
    admission_no: string;
    class: string;
    section: string;
    image: string;
    [key: string]: any;
}

export interface IParentDashboardData {
    student_list: IChild[];
}

