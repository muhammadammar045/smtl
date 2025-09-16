

export interface ExamScheduleData {
    title: string;
    class_id: string;
    section_id: string;
    campus_id: string;
    examSchedule: ExamSchedule[];
}

// Main exam schedule object
export interface ExamSchedule {
    id: string;
    name: string;
    campus_id: string;
    result_template: string;
    sesion_id: string;
    result_date: string;
    note: string | null;
    is_active: string;
    created_at: string;
    updated_at: string;
    gradeTermID: string;
    session_id: string;
    exam_id: string;
    teacher_subject_id: string;
    date_of_exam: string;
    start_to: string;
    end_from: string;
    room_no: string | null;
    coefficient: string | null;
    full_marks: string;
    passing_marks: string;
    teacherclass_id: string;
    class_name: string;
    section_id: string;
    section_name: string;
    exam_schedule_details: ExamScheduleDetail[];
}

// Single subject/row inside exam_schedule_details
export interface ExamScheduleDetail {
    staff_name: string;
    id: string;
    session_id: string;
    exam_id: string;
    teacher_subject_id: string;
    date_of_exam: string;
    start_to: string;
    end_from: string;
    room_no: string | null;
    coefficient: string | null;
    full_marks: string; // API sends as string
    passing_marks: string; // API sends as string
    note: string | null;
    is_active: string;
    created_at: string;
    updated_at: string;
    exam_schedule_id: string;
    sub_full_marks: string;
    program_applied_for: string;
    name: string; // subject name
    subject_id: string;
    type: string; // e.g. "Theory"
    sub_modules: any[]; // array but empty for now
}












// progress report


export interface ExamProgressReportData {
    student_session_idz: string;
    admission_no: string;
    student_name: string;
    classLanguage: string;
    result_card_template: string;
    getSetting: SchoolSetting;
    student_section: string;
    gradelist: GradeReport[];
    classlist: ClassList[];
    examSchedule_combine: ExamScheduleCombine;
    gradeList: GradeScale[];
}

export interface SchoolSetting {
    branch_code: string;
    branch_name: string;
    passing_percentage: string;
    num_subject_fail: string;
    school_city: string | null;
    start_of_session: string;
    result_template: string;
    due_school_fine: string;
    due_school_days: string;
    signature: string;
    attendance_num: string;
    id: string;
    lang_id: string;
    is_rtl: string;
    discipline1: string;
    discipline2: string;
    fee_due_days: string;
    class_teacher: string;
    cron_secret_key: string;
    timezone: string;
    name: string;
    email: string;
    phone: string;
    language: string;
    parent_signature: string;
    principal_signature: string;
    address: string;
    dise_code: string;
    fee_system: string;
    date_format: string;
    bank_account_1: string;
    bank_account_1_name: string;
    bank_account_1_title: string;
    bank_account_2: string;
    bank_account_2_name: string;
    bank_account_2_title: string;
    start_month_session: string;
    end_month_session: string;
    currency: string;
    currency_symbol: string;
    start_month: string;
    session_id: string;
    image: string | null;
    theme: string;
    session: string;
    zoom_api_key: string | null;
    zoom_api_secret: string | null;
}

export interface GradeReport {
    id: string;
    campus_id: string;
    name: string;
    exam_ids: string;
    sign_date: string;
    ads_text: string;
    campus: string;
}

export interface ClassList {
    id: string;
    order_priority: string | null;
    class: string;
    campus_id: string;
    is_active: string;
    created_at: string;
    updated_at: string;
    language: string;
    playlist_id: string;
    zoom_api_key: string;
    zoom_secret_key: string;
    pre_school: string;
}

export interface ExamScheduleCombine {
    examSchedule: {
        [gradeId: string]: {
            [studentId: string]: {
                studentDetails: StudentDetails;
                ExamData: any[]; // Can refine if ExamData structure is known
            };
        };
    };
}

export interface StudentDetails {
    class_id: string;
    student_session_id: string;
    id: string;
    class: string;
    section_id: string;
    section: string;
    admission_no: string;
    roll_no: string;
    admission_date: string;
    firstname: string;
    lastname: string;
    father_phone: string;
    smobno2: string;
    image: string;
    mobileno: string;
    email: string | null;
    guardian_email: string;
    state: string | null;
    city: string | null;
    pincode: string | null;
    religion: string;
    dob: string;
    birthofplace: string;
    current_address: string | null;
    permanent_address: string | null;
    category_id: string;
    category: string;
    adhar_no: string | null;
    samagra_id: string | null;
    bank_account_no: string | null;
    bank_name: string | null;
    ifsc_code: string | null;
    guardian_name: string;
    guardian_relation: string;
    guardian_phone: string;
    guardian_address: string;
    is_active: string;
    created_at: string;
    updated_at: string | null;
    father_name: string;
    parent_id: string;
    rte: string;
    gender: string;
    campus_main_id: string;
    campus: string;
}

export interface GradeScale {
    id: string;
    campus_id: string;
    name: string;
    point: string | null;
    mark_from: string;
    mark_upto: string;
    remarks: string;
    description: string;
    is_active: string;
    created_at: string;
    updated_at: string;
    campus: string;
}
