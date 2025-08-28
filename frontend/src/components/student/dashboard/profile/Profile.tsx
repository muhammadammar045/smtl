import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "./profile-tabs/ProfileTab";
import FeeTab from "./profile-tabs/FeeTab";
import DocumentTab from "./profile-tabs/DocumentTab";
import TimelineTab from "./profile-tabs/TimelineTab";
import { useGetDashboardDetailsQuery } from "@/store/slices/dashboard/dashboard.slice";

function Profile() {
    const {
        data: dashboardData,
        error,
        isLoading,
    } = useGetDashboardDetailsQuery();

    if (isLoading)
        return <div className='text-muted-foreground'>Loading...</div>;
    if (error)
        return (
            <div className='text-destructive'>
                Error: {JSON.stringify(error)}
            </div>
        );
    if (!dashboardData?.data)
        return <div className='text-muted-foreground'>No data found</div>;

    return (
        <>
            <Card className='shadow-md shadow-muted/30 border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Dashboard
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-4'>
                    <Tabs
                        defaultValue='profile'
                        className='w-full'
                    >
                        {/* Tabs header */}
                        <TabsList className='grid w-full grid-cols-4 max-w-[400px] bg-card text-card-foreground rounded-lg border border-border'>
                            <TabsTrigger
                                value='profile'
                                className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
                            >
                                Profile
                            </TabsTrigger>
                            <TabsTrigger
                                value='fee'
                                className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
                            >
                                Fee
                            </TabsTrigger>
                            <TabsTrigger
                                value='documents'
                                className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
                            >
                                Documents
                            </TabsTrigger>
                            <TabsTrigger
                                value='timeline'
                                className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
                            >
                                Timeline
                            </TabsTrigger>
                        </TabsList>

                        {/* Profile Tab */}
                        <TabsContent value='profile'>
                            <Card className='bg-card text-card-foreground border border-border shadow-sm'>
                                <CardContent className='p-6'>
                                    <ProfileTab
                                        student={dashboardData.data.student}
                                        getSetting={
                                            dashboardData.data.getSetting
                                        }
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Fee Tab */}
                        <TabsContent value='fee'>
                            <Card className='bg-card text-card-foreground border border-border shadow-sm'>
                                <CardContent className='p-6'>
                                    <FeeTab
                                        studentFee={
                                            dashboardData.data.student_due_fee
                                        }
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Documents Tab */}
                        <TabsContent value='documents'>
                            <Card className='bg-card text-card-foreground border border-border shadow-sm'>
                                <CardContent className='p-6'>
                                    <DocumentTab />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Timeline Tab */}
                        <TabsContent value='timeline'>
                            <Card className='bg-card text-card-foreground border border-border shadow-sm'>
                                <CardContent className='p-6'>
                                    <TimelineTab />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>{" "}
        </>
    );
}

export default Profile;
