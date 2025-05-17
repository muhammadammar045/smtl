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

export interface IUser {
    id: string;
    username: string;
    role: string;
    is_active: boolean;
    def_status: string;
}