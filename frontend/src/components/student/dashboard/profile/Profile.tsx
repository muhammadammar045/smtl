import { PageTitle } from "@/components/common/parts/BreadCrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "./profile-tabs/ProfileTab";
import FeeTab from "./profile-tabs/FeeTab";
import DocumentTab from "./profile-tabs/DocumentTab";
import TimelineTab from "./profile-tabs/TimelineTab";
import { IProfileData } from "@/interfaces/interfaces";

function Profile() {
    const profileData: IProfileData = {
        name: "Parisa Zainab",
        rollNumber: "afss-B17-00604",
        class: "I",
        section: "Blue Bells",
        rte: "Yes",
        campus: "Junior School",
        group: "Science",
        studentMobile: "03327755522",
        religion: "Islam",
        email: "example@email.com",
        addresses: {
            current: "123 Main Street",
            postal: "H # 14/0, St # 10, Block C1, B-17",
            permanent: "Same as postal address",
        },
        parentDetails: {
            fatherName: "Babar Mughal",
            fatherMobile1: "03358448355",
            fatherMobile2: "03452342423",
            fatherOccupation: "Manager",
            motherName: "Zunaira",
            motherPhone: "03452342423",
            motherOccupation: "Housewife",
            guardianName: "Muhammad Aqib",
            guardianEmail: "abcd@example.com",
            guardianRelation: "Cousin",
            guardianOccupation: "Labour",
            guardianAddress: "Dak",
        },
        miscellaneous: {
            bloodGroup: "B+",
            studentHouse: "Red House",
            height: "152 cm",
            weight: "45 kg",
            asOnDate: "15-03-2022",
            previousSchoolDetails: "Beacon House School System",
            nationalIdentificationNumber: "13501-1234567-1",
            localIdentificationNumber: "LID-2023-1234",
            bankAccountNumber: "PK36BAHL1234567890123",
            bankName: "Bank Al Habib",
            branchCode: "0123",
        },
    };
    return (
        <>
            <PageTitle
                title='Profile Information'
                description=''
            />
            <div className='container py-2'>
                <Tabs
                    defaultValue='profile'
                    className='w-full'
                >
                    <TabsList className='grid w-full grid-cols-4 max-w-[400px]'>
                        <TabsTrigger value='profile'>Profile</TabsTrigger>
                        <TabsTrigger value='fee'>Fee</TabsTrigger>
                        <TabsTrigger value='documents'>Documents</TabsTrigger>
                        <TabsTrigger value='timeline'>Timeline</TabsTrigger>
                    </TabsList>

                    <TabsContent value='profile'>
                        <Card>
                            <CardContent className='p-6'>
                                <ProfileTab profileData={profileData} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value='fee'>
                        <Card>
                            <CardContent className='p-6'>
                                <FeeTab />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value='documents'>
                        <Card>
                            <CardContent className='p-6'>
                                <DocumentTab />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value='timeline'>
                        <Card>
                            <CardContent className='p-6'>
                                <TimelineTab />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}

export default Profile;
