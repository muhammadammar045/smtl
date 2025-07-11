import { PageTitle } from "@/components/common/parts/BreadCrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "./profile-tabs/ProfileTab";
import FeeTab from "./profile-tabs/FeeTab";
import DocumentTab from "./profile-tabs/DocumentTab";
import TimelineTab from "./profile-tabs/TimelineTab";
import {
    selectStudent,
    useGetStudentDetailsQuery,
} from "@/store/slices/student/student.slice";
import { useSelector } from "react-redux";

function Profile() {
    const user = localStorage.getItem("user");
    const studentId = user ? JSON.parse(user).user.student_id : null;

    const { error, isLoading } = useGetStudentDetailsQuery(studentId);

    const student = useSelector(selectStudent);

    if (!student) return <div>Loading...</div>;

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error</div>;

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
                                <ProfileTab
                                    student={student.student}
                                    getSetting={student.getSetting}
                                />
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
