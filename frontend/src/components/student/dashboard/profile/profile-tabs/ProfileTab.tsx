import { Card, CardContent } from "@/components/ui/card";
import { IGetSetting, IStudent } from "@/store/slices/dashboard/types";

import { PageTitle } from "@/components/common/parts/BreadCrumb";
import envVars from "@/envExporter";

interface InfoRowProps {
    label: string;
    value?: string | number;
}

function InfoRow({ label, value = "-" }: InfoRowProps) {
    return (
        <div className='flex justify-between text-sm border-b border-border py-2'>
            <span className='text-muted-foreground'>{label}</span>
            <span className='font-medium text-foreground'>{value}</span>
        </div>
    );
}

interface ProfileTabProps {
    student: IStudent;
    getSetting: IGetSetting;
}

export function ProfileTab({ student, getSetting }: ProfileTabProps) {
    const fullName = `${student.firstname} ${student.lastname}`;
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
                            {student.class}
                        </p>
                        <p>
                            <span className='font-medium text-foreground'>
                                Section:
                            </span>{" "}
                            {student.section}
                        </p>
                        <p>
                            <span className='font-medium text-foreground'>
                                Roll No:
                            </span>{" "}
                            {student.roll_no}
                        </p>
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
                            { label: "Email", value: student.email ?? "-" },
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
                                value: student.previous_school,
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

export default ProfileTab;
