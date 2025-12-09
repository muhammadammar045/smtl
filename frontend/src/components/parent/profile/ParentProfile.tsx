import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetStudentQuery } from "@/store/slices/parent/student/parentStudent.slice";
import Loader from "@/components/common/loader/Loader";
import { PageTitle } from "@/components/common/parts/BreadCrumb";
import envVars from "@/envExporter";

interface InfoRowProps {
    label: string;
    value?: string | number | null;
}

function InfoRow({ label, value = "-" }: InfoRowProps) {
    return (
        <div className='flex justify-between text-sm border-b border-border py-2'>
            <span className='text-muted-foreground'>{label}</span>
            <span className='font-medium text-foreground'>{value || "-"}</span>
        </div>
    );
}

function ParentProfile() {
    const { childId } = useParams<{ childId: string }>();
    const {
        data: studentData,
        isError,
        isLoading,
    } = useGetStudentQuery(childId || "", {
        skip: !childId,
    });

    if (isLoading) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Student Profile
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

    if (isError || !studentData || !childId || !studentData.data?.student) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Student Profile
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-8 flex justify-center items-center text-destructive'>
                    Error loading student profile
                </CardContent>
            </Card>
        );
    }

    const student = studentData.data.student;
    const getSetting = studentData.data.getSetting || {};
    const fullName = `${student.firstname || ""} ${student.lastname || ""}`.trim();
    const imgBase = envVars.IMAGE_BASE_URL;

    return (
        <>
            {/* Title */}
            <PageTitle
                title='🎓 Student Profile'
                fontSize='text-3xl text-primary'
            />

            {/* Profile Header */}
            <div className='w-full shadow-md shadow-muted/40 rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 border border-border bg-card text-card-foreground'>
                {/* Profile Image */}
                <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-border ring-2 ring-ring ring-offset-2 transition-transform duration-300 hover:scale-105'>
                    <img
                        src={`${imgBase}/${
                            student.image ||
                            "uploads/student_images/no_image.png"
                        }`}
                        alt={fullName}
                        className='w-full h-full object-cover'
                    />
                </div>

                {/* Student Info */}
                <div className='flex-1 text-center md:text-left space-y-2'>
                    <h2 className='text-3xl font-bold text-foreground'>
                        {fullName}
                    </h2>
                    <div className='text-sm text-muted-foreground space-y-1'>
                        <p>
                            <span className='font-medium text-foreground'>
                                Class:
                            </span>{" "}
                            {student.class || "-"}
                        </p>
                        <p>
                            <span className='font-medium text-foreground'>
                                Section:
                            </span>{" "}
                            {student.section || "-"}
                        </p>
                        <p>
                            <span className='font-medium text-foreground'>
                                Admission No:
                            </span>{" "}
                            {student.admission_no || "-"}
                        </p>
                        {student.roll_no && (
                            <p>
                                <span className='font-medium text-foreground'>
                                    Roll No:
                                </span>{" "}
                                {student.roll_no}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Info Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {[
                    {
                        title: "Basic Info",
                        rows: [
                            { label: "Campus", value: student.campus },
                            { label: "Group", value: student.group },
                            { label: "Mobile", value: student.mobileno },
                            { label: "Religion", value: student.religion },
                            { label: "Email", value: student.email },
                            { label: "Date of Birth", value: student.dob },
                            { label: "Gender", value: student.gender },
                        ],
                    },
                    {
                        title: "Address Info",
                        rows: [
                            {
                                label: "Current Address",
                                value: student.current_address,
                            },
                            {
                                label: "Postal Address",
                                value: student.postal_address,
                            },
                            {
                                label: "Permanent Address",
                                value: student.permanent_address,
                            },
                        ],
                    },
                    {
                        title: "Father Details",
                        rows: [
                            { label: "Name", value: student.father_name },
                            { label: "Phone", value: student.father_phone },
                            {
                                label: "Occupation",
                                value: student.father_occupation,
                            },
                            { label: "CNIC", value: student.father_cnic },
                        ],
                    },
                    {
                        title: "Mother Details",
                        rows: [
                            { label: "Name", value: student.mother_name },
                            { label: "Phone", value: student.mother_phone },
                            {
                                label: "Occupation",
                                value: student.mother_occupation,
                            },
                        ],
                    },
                    {
                        title: "Guardian Details",
                        rows: [
                            { label: "Name", value: student.guardian_name },
                            {
                                label: "Relation",
                                value: student.guardian_relation,
                            },
                            { label: "Phone", value: student.guardian_phone },
                            {
                                label: "Occupation",
                                value: student.guardian_occupation,
                            },
                            { label: "Email", value: student.guardian_email },
                            {
                                label: "Address",
                                value: student.guardian_address,
                            },
                        ],
                    },
                    {
                        title: "Misc Info",
                        rows: [
                            {
                                label: "Blood Group",
                                value: student.blood_group,
                            },
                            { label: "House", value: student.house_name },
                            { label: "Height", value: student.height },
                            { label: "Weight", value: student.weight },
                            {
                                label: "Measurement Date",
                                value: student.measurement_date,
                            },
                            {
                                label: "Previous School",
                                value: student.previous_school || student.last_attended_school,
                            },
                            {
                                label: "Admission Date",
                                value: student.admission_date,
                            },
                        ],
                    },
                    {
                        title: "Bank Details",
                        rows: [
                            {
                                label: "Account No.",
                                value: getSetting.bank_account_1,
                            },
                            {
                                label: "Bank Name",
                                value: getSetting.bank_account_1_name,
                            },
                            {
                                label: "Account Title",
                                value: getSetting.bank_account_1_title,
                            },
                            {
                                label: "Branch Code",
                                value: getSetting.branch_code,
                            },
                        ],
                    },
                ].map((section, idx) => (
                    <Card
                        key={idx}
                        className=''
                    >
                        <CardContent className='p-5 space-y-2'>
                            <h3 className='text-lg font-semibold text-primary mb-2'>
                                {section.title}
                            </h3>
                            {section.rows.map((row, i) => (
                                <InfoRow
                                    key={i}
                                    label={row.label}
                                    value={row.value || "-"}
                                />
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
}

export default ParentProfile;

