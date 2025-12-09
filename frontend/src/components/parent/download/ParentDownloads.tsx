import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDownloadsQuery } from "@/store/slices/parent/download/parentDownload.slice";
import Loader from "@/components/common/loader/Loader";

function ParentDownloads() {
    const { childId } = useParams<{ childId: string }>();
    const {
        data: downloadsData,
        isError,
        isLoading,
    } = useGetDownloadsQuery(childId || "", {
        skip: !childId,
    });

    if (isLoading) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Downloads
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

    if (isError || !downloadsData || !childId) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Downloads
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-8 flex justify-center items-center text-destructive'>
                    Error loading downloads
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
            <CardHeader className='border-b border-border pb-3'>
                <CardTitle className='text-3xl font-bold text-primary'>
                    Downloads
                </CardTitle>
            </CardHeader>
            <CardContent className='p-6'>
                <div className='space-y-4'>
                    <pre className='bg-muted p-4 rounded-lg overflow-auto'>
                        {JSON.stringify(downloadsData.data, null, 2)}
                    </pre>
                </div>
            </CardContent>
        </Card>
    );
}

export default ParentDownloads;

