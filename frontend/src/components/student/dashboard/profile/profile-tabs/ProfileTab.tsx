import { Card, CardContent } from "@/components/ui/card";
import { PageTitle } from "@/components/common/parts/BreadCrumb";
import envVars from "@/envExporter";
import { IGetSetting, IStudent } from "@/store/slices/dashboard/types";

interface InfoRowProps {
    label: string;
    value?: string | number;
}

function InfoRow({ label, value = "-" }: InfoRowProps) {
    return (
        <div className='flex flex-col'>
            <span className='text-sm text-muted-foreground'>{label}</span>
            <span className='font-medium'>{value}</span>
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
            <PageTitle
                title='Profile'
                fontSize='text-2xl'
            />

            <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
                {/* Sidebar Card */}
                <Card className='lg:col-span-3'>
                    <CardContent className='flex flex-col items-center py-8'>
                        <div className='w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-primary'>
                            <img
                                src={`${imgBase}/${
                                    student.image ||
                                    "uploads/student_images/no_image.png"
                                }`}
                                alt={fullName}
                                className='w-full h-full object-cover'
                            />
                        </div>
                        <h2 className='text-xl font-bold mb-2'>{fullName}</h2>
                        <div className='w-full space-y-3'>
                            <InfoRow
                                label='Roll Number'
                                value={student.roll_no}
                            />
                            <InfoRow
                                label='Class'
                                value={student.class}
                            />
                            <InfoRow
                                label='Section'
                                value={student.section}
                            />
                            <InfoRow
                                label='RTE'
                                value={getSetting.is_rtl}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column */}
                <div className='lg:col-span-9 space-y-6'>
                    {/* Basic Info */}
                    <Card>
                        <CardContent className='py-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <InfoRow
                                    label='Campus'
                                    value={student.campus}
                                />
                                <InfoRow
                                    label='Group'
                                    value={student.group}
                                />
                                <InfoRow
                                    label='Mobile'
                                    value={student.mobileno}
                                />
                                <InfoRow
                                    label='Religion'
                                    value={student.religion}
                                />
                                <InfoRow
                                    label='Email'
                                    value={student.email ?? "-"}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Address Info */}
                    <Card>
                        <CardContent className='py-6'>
                            <h3 className='text-lg font-semibold mb-4'>
                                Address
                            </h3>
                            <div className='space-y-4'>
                                <InfoRow
                                    label='Current Address'
                                    value={student.current_address ?? "-"}
                                />
                                <InfoRow
                                    label='Postal Address'
                                    value={student.postal_address ?? "-"}
                                />
                                <InfoRow
                                    label='Permanent Address'
                                    value={student.permanent_address ?? "-"}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Parent/Guardian */}
                    <Card>
                        <CardContent className='py-6'>
                            <h3 className='text-lg font-semibold mb-4'>
                                Parent / Guardian Details
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                                {/* Father */}
                                <div className='space-y-3 text-center'>
                                    <div className='w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-100 mb-2 border-2 border-primary'>
                                        <img
                                            src={`${imgBase}/${
                                                student.father_pic ||
                                                "uploads/student_images/no_image.png"
                                            }`}
                                            alt='Father'
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                    <InfoRow
                                        label='Father Name'
                                        value={student.father_name}
                                    />
                                    <InfoRow
                                        label='Mobile No 1'
                                        value={student.father_phone}
                                    />
                                    <InfoRow
                                        label='Occupation'
                                        value={student.father_occupation ?? "-"}
                                    />
                                </div>

                                {/* Mother */}
                                <div className='space-y-3 text-center'>
                                    <div className='w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-100 mb-2 border-2 border-primary'>
                                        <img
                                            src={`${imgBase}/${
                                                student.mother_pic ||
                                                "uploads/student_images/no_image.png"
                                            }`}
                                            alt='Mother'
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                    <InfoRow
                                        label='Mother Name'
                                        value={student.mother_name}
                                    />
                                    <InfoRow
                                        label='Mobile'
                                        value={student.mother_phone}
                                    />
                                    <InfoRow
                                        label='Occupation'
                                        value={student.mother_occupation}
                                    />
                                </div>

                                {/* Guardian */}
                                <div className='space-y-3 text-center'>
                                    <div className='w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-100 mb-2 border-2 border-primary'>
                                        <img
                                            src={`${imgBase}/${
                                                student.guardian_pic ||
                                                "uploads/student_images/no_image.png"
                                            }`}
                                            alt='Guardian'
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                    <InfoRow
                                        label='Guardian Name'
                                        value={student.guardian_name}
                                    />
                                    <InfoRow
                                        label='Relation'
                                        value={student.guardian_relation}
                                    />
                                    <InfoRow
                                        label='Occupation'
                                        value={student.guardian_occupation}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Miscellaneous */}
                    <Card>
                        <CardContent className='py-6'>
                            <h3 className='text-lg font-semibold mb-4'>
                                Miscellaneous Details
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                                <div className='space-y-3'>
                                    <InfoRow
                                        label='Blood Group'
                                        value={student.blood_group ?? "-"}
                                    />
                                    <InfoRow
                                        label='House'
                                        value={student.house_name ?? "-"}
                                    />
                                    <InfoRow
                                        label='Height'
                                        value={student.height ?? "-"}
                                    />
                                    <InfoRow
                                        label='Weight'
                                        value={student.weight ?? "-"}
                                    />
                                </div>
                                <div className='space-y-3'>
                                    <InfoRow
                                        label='Measurement Date'
                                        value={student.measurement_date}
                                    />
                                    <InfoRow
                                        label='Previous School'
                                        value={student.previous_school ?? "-"}
                                    />
                                    <InfoRow
                                        label='National ID Number'
                                        value={student.student_cnic}
                                    />
                                    <InfoRow
                                        label='Local ID Number'
                                        value={student.student_cnic}
                                    />
                                </div>
                                <div className='space-y-3'>
                                    <InfoRow
                                        label='Bank Acct. No.'
                                        value={getSetting.bank_account_1}
                                    />
                                    <InfoRow
                                        label='Bank Name'
                                        value={getSetting.bank_account_1_name}
                                    />
                                    <InfoRow
                                        label='Branch Code'
                                        value={getSetting.branch_code}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default ProfileTab;
