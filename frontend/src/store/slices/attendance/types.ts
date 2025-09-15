

export interface Student {
    chara_from: string | null;
    chara_to: string | null;
    session_year: string | null;
    examination_held: string | null;
    board: string | null;
    board_roll_no_new: string | null;
    registration_no: string | null;
    board_marks_obt: string | null;
    board_grade: string | null;
    board_division: string | null;
    character_certi: string | null;
    school_leaving_date: string | null;
    student_progress: string;
    student_conduct: string;
    leaving_reason: string;
    leaving_remarks: string;
    official_address: string | null;
    shift: string;
    noc: string;
    other_documents: string | null; // serialized PHP array
    clc_last_college: string;
    character_certificate: string;
    academic_info: string | null;
    award_info: string | null;
    know_about_college: string | null;
    fbise_number: string;
    emergency_medication: string;
    program_applied_for: string;
    transport_fees: string;
    vehroute_id: string;
    route_id: string | null;
    vehicle_id: string | null;
    route_title: string | null;
    vehicle_no: string | null;
    room_no: string | null;
    driver_name: string | null;
    driver_contact: string | null;
    hostel_id: string | null;
    hostel_name: string | null;
    room_type_id: string | null;
    room_type: string | null;
    hostel_room_id: string;
    student_session_id: string;
    fees_discount: string;
    playlist_id: string;
    class_id: string;
    class: string;
    section_id: string;
    section: string;
    id: string;
    admission_no: string;
    roll_no: string;
    admission_date: string;
    firstname: string;
    lastname: string;
    image: string;
    mobileno: string;
    email: string | null;
    state: string | null;
    city: string | null;
    pincode: string | null;
    note: string | null;
    religion: string;
    cast: string | null;
    house_name: string | null;
    dob: string;
    birthofplace: string;
    def_status: string;
    current_address: string | null;
    previous_school: string | null;
    guardian_is: string | null;
    parent_id: string;
    student_cnic: string;
    nationality: string;
    smobno2: string;
    father_cnic: string;
    father_income: string;
    postal_address: string;
    residential_phone: string;
    last_exam_passed: string;
    exam_passing_year: string;
    obtained_marks: string;
    total_marks: string;
    name_of_board: string;
    board_roll_no: string;
    student_photograph: string;
    father_cnic_picture: string;
    student_cnic_picture: string;
    mark_sheet_picture: string;
    permanent_address: string | null;
    group: string;
    category_id: string | null;
    adhar_no: string | null;
    samagra_id: string | null;
    bank_account_no: string | null;
    bank_name: string | null;
    ifsc_code: string | null;
    guardian_name: string;
    father_pic: string | null;
    height: string | null;
    weight: string | null;
    measurement_date: string;
    mother_pic: string | null;
    guardian_pic: string | null;
    guardian_relation: string;
    guardian_phone: string;
    guardian_address: string;
    is_active: string;
    created_at: string;
    updated_at: string | null;
    father_name: string;
    father_phone: string;
    blood_group: string | null;
    school_house_id: string | null;
    father_occupation: string | null;
    mother_name: string;
    mother_phone: string;
    mother_occupation: string;
    guardian_occupation: string;
    gender: string;
    rte: string;
    guardian_email: string;
    unsuited: string;
    discount_fees: string | null;
    campus_main_id: string;
    campus: string;
    last_attended_school: string;
    percentage_last_school: string | null;
}

export interface Settings {
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

export interface AttendanceMonth {
    month_days: number;
    sunday_no: number;
    working_days: number;
    absent: number;
    count_present: number;
    count_late: number;
    half_day: number;
    count_leave: number;
    count_holiday: number;
    off: number;
    final_working: number;
}

export interface AttendanceStudent {
    [month: string]: AttendanceMonth;
}

export interface AttendanceType {
    type: string;
    key_value: string;
}

export interface AttendanceTypes {
    [id: string]: AttendanceType;
}

export interface AttendanceData {
    student: Student;
    settings: Settings;
    attendance_student: AttendanceStudent;
    attendance_types: AttendanceTypes;
}











// AttendanceDetailData Data



interface Day {
    date: string;      // e.g., "2022-05-01"
    status: string;    // e.g., "Present", "Absent", "Weekend"
}

interface Week {
    week: number;
    days: Day[];
}

interface TableData {
    month: string;   // e.g., "05"
    year: string;    // e.g., "2022"
    weeks: Week[];
}

export interface AttendanceDetailsData {
    from_date: string;
    to_date: string;
    student_id: string;
    getSetting: Settings;
    month_selected: string;
    studentlist: Student[];
    total_working: number;
    table_data: TableData[];
    count_working_days: number;
    count_absent: number;
    count_present: number;
    count_late: number;
    count_holiday: number;
    count__half: number;
    count_leave: number;
    html_table: string;
    monthAttendance: any; // unknown type, null in example
    resultlist: any;      // unknown type, null in example
    attendence_array: any; // unknown type, null in example
    student_array: any;   // unknown type, null in example
}

