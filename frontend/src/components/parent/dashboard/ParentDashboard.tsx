import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetParentDashboardQuery } from "@/store/slices/parent/dashboard/parentDashboard.slice";
import Loader from "@/components/common/loader/Loader";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { IChild } from "@/store/slices/parent/dashboard/types";

function ParentDashboard() {
    const {
        data: dashboardData,
        isError,
        isLoading,
    } = useGetParentDashboardQuery();
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Parent Dashboard
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

    if (isError || !dashboardData) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Parent Dashboard
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-8 flex justify-center items-center text-destructive'>
                    Error loading dashboard
                </CardContent>
            </Card>
        );
    }

    const children: IChild[] = dashboardData.data?.student_list || [];

    return (
        <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
            <CardHeader className='border-b border-border pb-3'>
                <CardTitle className='text-3xl font-bold text-primary'>
                    Parent Dashboard
                </CardTitle>
            </CardHeader>
            <CardContent className='p-6'>
                <div className='space-y-4'>
                    <h2 className='text-xl font-semibold'>Select a child to view their information:</h2>
                    {children.length === 0 ? (
                        <p className='text-muted-foreground'>No children found.</p>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {children.map((child) => {
                                const fullName = `${child.firstname} ${child.lastname || ""}`.trim();
                                return (
                                    <Card
                                        key={child.id}
                                        className='hover:shadow-lg transition-shadow cursor-pointer'
                                        onClick={() => navigate(`/parent/child/${child.id}/profile`)}
                                    >
                                        <CardContent className='p-6'>
                                            <h3 className='text-lg font-semibold mb-2'>{fullName}</h3>
                                            <p className='text-sm text-muted-foreground mb-2'>
                                                {child.class} - {child.section}
                                            </p>
                                            <p className='text-xs text-muted-foreground mb-4'>
                                                Admission: {child.admission_no}
                                            </p>
                                            <Button
                                                variant='outline'
                                                className='w-full'
                                            >
                                                View Profile
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default ParentDashboard;

