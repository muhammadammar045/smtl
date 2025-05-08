import React from "react";
import { IProfileData } from "@/interfaces/interfaces";
import { Card, CardContent } from "@/components/ui/card";
import { PageTitle } from "@/components/common/parts/BreadCrumb";

interface ProfileTabProps {
    profileData: IProfileData;
}

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

function ProfileTab({ profileData }: ProfileTabProps) {
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
                                src='/student.png'
                                alt={profileData.name}
                                className='w-full h-full object-cover'
                            />
                        </div>
                        <h2 className='text-xl font-bold my-2'>
                            {profileData.name}
                        </h2>
                        <div className='w-full my-2 space-y-4'>
                            <InfoRow
                                label='Roll Number'
                                value={profileData.rollNumber}
                            />
                            <InfoRow
                                label='Class'
                                value={profileData.class}
                            />
                            <InfoRow
                                label='Section'
                                value={profileData.section}
                            />
                            <InfoRow
                                label='RTE'
                                value={profileData.rte}
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
                                    value={profileData.campus}
                                />
                                <InfoRow
                                    label='Group'
                                    value={profileData.group}
                                />
                                <InfoRow
                                    label='Student Mobile No.'
                                    value={profileData.studentMobile}
                                />
                                <InfoRow
                                    label='Religion'
                                    value={profileData.religion}
                                />
                                <InfoRow
                                    label='Email'
                                    value={profileData.email}
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
                                    value={profileData.addresses.current}
                                />
                                <InfoRow
                                    label='Postal Address'
                                    value={profileData.addresses.postal}
                                />
                                <InfoRow
                                    label='Permanent Address'
                                    value={profileData.addresses.permanent}
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
                                            src='/student.png'
                                            alt="Father's picture"
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                </div>
                                <InfoRow
                                    label='Father Name'
                                    value={profileData.parentDetails.fatherName}
                                />

                                <InfoRow
                                    label='Father/Guardian Mobile No 2'
                                    value={
                                        profileData.parentDetails.fatherMobile2
                                    }
                                />
                                <InfoRow
                                    label='Father/Guardian Occupation'
                                    value={
                                        profileData.parentDetails
                                            .fatherOccupation
                                    }
                                />
                                {/* Additional Details Column */}
                                <InfoRow
                                    label='Father/Guardian Mobile No 1'
                                    value={
                                        profileData.parentDetails.fatherMobile1
                                    }
                                />
                                <InfoRow
                                    label='Father/Guardian Email'
                                    value={
                                        profileData.parentDetails.guardianEmail
                                    }
                                />
                                <InfoRow
                                    label='Guardian Address'
                                    value={
                                        profileData.parentDetails
                                            .guardianAddress
                                    }
                                />
                            </div>

                            {/* Middle Column */}
                            <div className='md:col-span-4 space-y-4'>
                                <div className='w-24 h-24 flex-shrink-0'>
                                    <div className='w-full h-full rounded-full overflow-hidden bg-gray-100'>
                                        <img
                                            src='/student.png'
                                            alt="Father's picture"
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                </div>
                                <InfoRow
                                    label='Mother Name'
                                    value={profileData.parentDetails.motherName}
                                />

                                <InfoRow
                                    label='Mother Phone'
                                    value={
                                        profileData.parentDetails.motherPhone
                                    }
                                />
                                <InfoRow
                                    label='Mother Occupation'
                                    value={
                                        profileData.parentDetails
                                            .motherOccupation
                                    }
                                />
                            </div>

                            {/* Right Column */}
                            <div className='md:col-span-4 space-y-4'>
                                <div className='w-24 h-24 flex-shrink-0'>
                                    <div className='w-full h-full rounded-full overflow-hidden bg-gray-100'>
                                        <img
                                            src='/student.png'
                                            alt="Father's picture"
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                </div>
                                <InfoRow
                                    label='Guardian Name'
                                    value={
                                        profileData.parentDetails.guardianName
                                    }
                                />

                                <InfoRow
                                    label='Guardian Relation'
                                    value={
                                        profileData.parentDetails
                                            .guardianRelation
                                    }
                                />
                                <InfoRow
                                    label='Guardian Occupation'
                                    value={
                                        profileData.parentDetails
                                            .guardianOccupation
                                    }
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
                                    value={profileData.miscellaneous.bloodGroup}
                                />
                                <InfoRow
                                    label='Student House'
                                    value={
                                        profileData.miscellaneous.studentHouse
                                    }
                                />
                                <InfoRow
                                    label='Height'
                                    value={profileData.miscellaneous.height}
                                />
                                <InfoRow
                                    label='Weight'
                                    value={profileData.miscellaneous.weight}
                                />
                            </div>

                            {/* Middle Column */}
                            <div className='space-y-4'>
                                <InfoRow
                                    label='As on Date'
                                    value={profileData.miscellaneous.asOnDate}
                                />
                                <InfoRow
                                    label='Previous School Details'
                                    value={
                                        profileData.miscellaneous
                                            .previousSchoolDetails
                                    }
                                />
                                <InfoRow
                                    label='National Identification Number'
                                    value={
                                        profileData.miscellaneous
                                            .nationalIdentificationNumber
                                    }
                                />
                                <InfoRow
                                    label='Local Identification Number'
                                    value={
                                        profileData.miscellaneous
                                            .localIdentificationNumber
                                    }
                                />
                            </div>

                            {/* Right Column */}
                            <div className='space-y-4'>
                                <InfoRow
                                    label='Bank Account Number'
                                    value={
                                        profileData.miscellaneous
                                            .bankAccountNumber
                                    }
                                />
                                <InfoRow
                                    label='Bank Name'
                                    value={profileData.miscellaneous.bankName}
                                />
                                <InfoRow
                                    label='Branch Code'
                                    value={profileData.miscellaneous.branchCode}
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
