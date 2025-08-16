import { Card, CardContent } from "@/components/ui/card";
import { PageTitle } from "@/components/common/parts/BreadCrumb";
import envVars from "@/envExporter";
import { IGetSetting, IStudent } from "@/store/slices/dashboard/types";

interface InfoRowProps {
    label: string;
    value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
    return (
        <div className='flex flex-col'>
            <span className='text-sm text-muted-foreground'>{label}</span>
            <span className='font-medium'>{value}</span>
        </div>
    );
}

function ProfileTab({
    student,
    getSetting,
}: {
    student: IStudent;
    getSetting: IGetSetting;
}) {
    return (
        <>
            <PageTitle
                title='Profile'
                description=''
                fontSize='text-2xl'
            />
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                {/* Left Profile Card */}
                <Card className='md:col-span-1'>
                    <CardContent className='p-6 flex flex-col items-center'>
                        <div className='w-32 h-32 rounded-full overflow-hidden mb-4'>
                            <img
                                src={`${envVars.IMAGE_BASE_URL}/${
                                    student.image ||
                                    "/uploads/student_images/no_image.png"
                                }`}
                                alt={student.firstname + " " + student.lastname}
                                className='w-full h-full object-cover'
                            />
                        </div>
                        <h2 className='text-xl font-bold my-2'>
                            {student.firstname + " " + student.lastname}
                        </h2>
                        <div className='w-full my-2 space-y-4'>
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

                {/* Right Details Cards */}
                <div className='md:col-span-3 space-y-6'>
                    {/* Basic Information */}
                    <Card>
                        <CardContent className='p-6'>
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
                                    label='Student Mobile No.'
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

                    {/* Address Information */}
                    <Card>
                        <CardContent className='p-6'>
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
                                    value={student.postal_address}
                                />
                                <InfoRow
                                    label='Permanent Address'
                                    value={student.permanent_address ?? "-"}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Parent/Guardian Details Card - Full Width */}
                <Card className='md:col-span-4'>
                    <CardContent className='p-6'>
                        <h3 className='text-lg font-semibold mb-4'>
                            Parent / Guardian Details
                        </h3>
                        <div className='grid grid-cols-1 md:grid-cols-12 gap-6'>
                            {/* Left Column */}
                            <div className='md:col-span-4 space-y-4'>
                                <div className='w-24 h-24 flex-shrink-0'>
                                    <div className='w-full h-full rounded-full overflow-hidden bg-gray-100'>
                                        <img
                                            src={`${envVars.IMAGE_BASE_URL}/${
                                                student.father_pic ||
                                                "/uploads/student_images/no_image.png"
                                            }`}
                                            alt="Father's picture"
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                </div>
                                <InfoRow
                                    label='Father Name'
                                    value={student.father_name}
                                />

                                <InfoRow
                                    label='Father/Guardian Mobile No 2'
                                    value={student.father_phone}
                                />
                                <InfoRow
                                    label='Father/Guardian Occupation'
                                    value={student.father_occupation ?? "-"}
                                />
                                {/* Additional Details Column */}
                                <InfoRow
                                    label='Father/Guardian Mobile No 1'
                                    value={student.guardian_phone}
                                />
                                <InfoRow
                                    label='Father/Guardian Email'
                                    value={student.guardian_email}
                                />
                                <InfoRow
                                    label='Guardian Address'
                                    value={student.guardian_address}
                                />
                            </div>

                            {/* Middle Column */}
                            <div className='md:col-span-4 space-y-4'>
                                <div className='w-24 h-24 flex-shrink-0'>
                                    <div className='w-full h-full rounded-full overflow-hidden bg-gray-100'>
                                        <img
                                            src={`${envVars.IMAGE_BASE_URL}/${
                                                student.mother_pic ||
                                                "/uploads/student_images/no_image.png"
                                            }`}
                                            alt="Father's picture"
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                </div>
                                <InfoRow
                                    label='Mother Name'
                                    value={student.mother_name}
                                />

                                <InfoRow
                                    label='Mother Phone'
                                    value={student.mother_phone}
                                />
                                <InfoRow
                                    label='Mother Occupation'
                                    value={student.mother_occupation}
                                />
                            </div>

                            {/* Right Column */}
                            <div className='md:col-span-4 space-y-4'>
                                <div className='w-24 h-24 flex-shrink-0'>
                                    <div className='w-full h-full rounded-full overflow-hidden bg-gray-100'>
                                        <img
                                            src={`${envVars.IMAGE_BASE_URL}/${
                                                student.guardian_pic ||
                                                "/uploads/student_images/no_image.png"
                                            }`}
                                            alt="Father's picture"
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                </div>
                                <InfoRow
                                    label='Guardian Name'
                                    value={student.guardian_name}
                                />

                                <InfoRow
                                    label='Guardian Relation'
                                    value={student.guardian_relation}
                                />
                                <InfoRow
                                    label='Guardian Occupation'
                                    value={student.guardian_occupation}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Miscellaneous Details Card - Full Width */}
                <Card className='md:col-span-4'>
                    <CardContent className='p-6'>
                        <h3 className='text-lg font-semibold mb-4'>
                            Miscellaneous Details
                        </h3>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            {/* Left Column */}
                            <div className='space-y-4'>
                                <InfoRow
                                    label='Blood Group'
                                    value={student.blood_group ?? "-"}
                                />
                                <InfoRow
                                    label='Student House'
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

                            {/* Middle Column */}
                            <div className='space-y-4'>
                                <InfoRow
                                    label='As on Date'
                                    value={student.admission_date}
                                />
                                <InfoRow
                                    label='Previous School Details'
                                    value={student.previous_school ?? "-"}
                                />
                                <InfoRow
                                    label='National Identification Number'
                                    value={student.student_cnic}
                                />
                                <InfoRow
                                    label='Local Identification Number'
                                    value={student.student_cnic}
                                />
                            </div>

                            {/* Right Column */}
                            <div className='space-y-4'>
                                <InfoRow
                                    label='Bank Account Number'
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
        </>
    );
}

export default ProfileTab;
