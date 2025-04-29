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