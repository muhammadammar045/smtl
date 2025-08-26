import { Card, CardContent } from "@/components/ui/card";
import { PageTitle } from "@/components/common/parts/BreadCrumb";
import envVars from "@/envExporter";
import { IGetSetting, IStudent } from "@/store/slices/dashboard/types";

interface InfoRowProps {
    label: string;
    value?: string | number;
    horizontal?: boolean;
}

function InfoRow({ label, value = "-", horizontal = false }: InfoRowProps) {
    return horizontal ? (
        <div className='flex justify-between text-sm border-b py-1'>
            <span className='text-muted-foreground'>{label}</span>
            <span className='font-medium'>{value}</span>
        </div>
    ) : (
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
                <Card className='lg:col-span-3 shadow-md'>
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
                        <h2 className='text-xl font-bold mb-4 text-center'>
                            {fullName}
                        </h2>
                        <div className='w-full space-y-1'>
                            <InfoRow
                                label='Roll Number'
                                value={student.roll_no}
                                horizontal
                            />
                            <InfoRow
                                label='Class'
                                value={student.class}
                                horizontal
                            />
                            <InfoRow
                                label='Section'
                                value={student.section}
                                horizontal
                            />
                            <InfoRow
                                label='RTE'
                                value={getSetting.is_rtl}
                                horizontal
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column */}
                <div className='lg:col-span-9 space-y-6'>
                    {/* Basic Info */}
                    <Card className='shadow-sm'>
                        <CardContent className='py-6'>
                            <h3 className='text-lg font-semibold mb-4 border-b pb-2'>
                                Basic Information
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <InfoRow
                                    label='Campus'
                                    value={student.campus}
                                    horizontal
                                />
                                <InfoRow
                                    label='Group'
                                    value={student.group}
                                    horizontal
                                />
                                <InfoRow
                                    label='Mobile'
                                    value={student.mobileno}
                                    horizontal
                                />
                                <InfoRow
                                    label='Religion'
                                    value={student.religion}
                                    horizontal
                                />
                                <InfoRow
                                    label='Email'
                                    value={student.email ?? "-"}
                                    horizontal
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Address Info */}
                    <Card className='shadow-sm'>
                        <CardContent className='py-6'>
                            <h3 className='text-lg font-semibold mb-4 border-b pb-2'>
                                Address Details
                            </h3>
                            <div className='space-y-2'>
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

                    {/* Parent/Guardian - Horizontal Scroll */}
                    <Card className='shadow-sm'>
                        <CardContent className='py-6'>
                            <h3 className='text-lg font-semibold mb-4 border-b pb-2'>
                                Parent / Guardian Details
                            </h3>
                            <div className='flex space-x-6 overflow-x-auto pb-2'>
                                {/* Father */}
                                <div className='flex-shrink-0 w-56 bg-muted/10 rounded-xl p-4 text-center space-y-2 border'>
                                    <div className='w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-primary'>
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
                                <div className='flex-shrink-0 w-56 bg-muted/10 rounded-xl p-4 text-center space-y-2 border'>
                                    <div className='w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-primary'>
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
                                <div className='flex-shrink-0 w-56 bg-muted/10 rounded-xl p-4 text-center space-y-2 border'>
                                    <div className='w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-primary'>
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
                    <Card className='shadow-sm'>
                        <CardContent className='py-6'>
                            <h3 className='text-lg font-semibold mb-4 border-b pb-2'>
                                Miscellaneous Details
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                                <div>
                                    <InfoRow
                                        label='Blood Group'
                                        value={student.blood_group ?? "-"}
                                        horizontal
                                    />
                                    <InfoRow
                                        label='House'
                                        value={student.house_name ?? "-"}
                                        horizontal
                                    />
                                    <InfoRow
                                        label='Height'
                                        value={student.height ?? "-"}
                                        horizontal
                                    />
                                    <InfoRow
                                        label='Weight'
                                        value={student.weight ?? "-"}
                                        horizontal
                                    />
                                </div>
                                <div>
                                    <InfoRow
                                        label='Measurement Date'
                                        value={student.measurement_date}
                                        horizontal
                                    />
                                    <InfoRow
                                        label='Previous School'
                                        value={student.previous_school ?? "-"}
                                        horizontal
                                    />
                                    <InfoRow
                                        label='National ID Number'
                                        value={student.student_cnic}
                                        horizontal
                                    />
                                    <InfoRow
                                        label='Local ID Number'
                                        value={student.student_cnic}
                                        horizontal
                                    />
                                </div>
                                <div>
                                    <InfoRow
                                        label='Bank Acct. No.'
                                        value={getSetting.bank_account_1}
                                        horizontal
                                    />
                                    <InfoRow
                                        label='Bank Name'
                                        value={getSetting.bank_account_1_name}
                                        horizontal
                                    />
                                    <InfoRow
                                        label='Branch Code'
                                        value={getSetting.branch_code}
                                        horizontal
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
