export interface ApiResponse<T> {
    statusCode: number;
    data: T;
    message: string;
    success: boolean;
}


export interface IProfileData {
    name: string;
    rollNumber: string;
    class: string;
    section: string;
    rte: string;
    campus: string;
    group: string;
    studentMobile: string;
    religion: string;
    email: string;
    addresses: {
        current: string;
        postal: string;
        permanent: string;
    };
    parentDetails: {
        fatherName: string;
        fatherMobile1: string;
        fatherMobile2: string;
        fatherOccupation: string;
        motherName: string;
        motherPhone: string;
        motherOccupation: string;
        guardianName: string;
        guardianEmail: string;
        guardianRelation: string;
        guardianOccupation: string;
        guardianAddress: string;
    };
    miscellaneous: {
        bloodGroup: string;
        studentHouse: string;
        height: string;
        weight: string;
        asOnDate: string;
        previousSchoolDetails: string;
        nationalIdentificationNumber: string;
        localIdentificationNumber: string;
        bankAccountNumber: string;
        bankName: string;
        branchCode: string;
    };
}

export interface ISchoolSettings {
    date_format: string;
    currency_symbol: string;
    timezone: string;
    sch_name: string;
    language: {
        lang_id: number;
        language: string;
    };
    is_rtl: boolean;
    theme: string;
}

export interface IStudentUser {
    id: number;
    student_id: number;
    role: "student";
    username: string;
    image: string;
    settings: ISchoolSettings;
}

export interface IParentChild {
    student_id: number;
    name: string;
}

export interface IParentUser {
    id: number;
    student_id: number; // Often 0 or null for parent itself
    role: "parent";
    username: string;
    image: string;
    settings: ISchoolSettings;
    children: IParentChild[];
}

export interface IUser {
    student?: IStudentUser;
    parent?: IParentUser;
}
