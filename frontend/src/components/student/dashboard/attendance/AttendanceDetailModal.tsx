import Loader from "@/components/common/loader/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAttendanceDetailsQuery } from "@/store/slices/attendance/attendance.slice";

interface AttendanceDetailModalProps {
    month: number;
    year: number;
    onClose: () => void;
}

const AttendanceDetailModal: React.FC<AttendanceDetailModalProps> = ({
    month,
    year,
    onClose,
}) => {
    // call your RTK Query
    const { data, isLoading, isError } = useGetAttendanceDetailsQuery({
        month,
        year,
        search: "", // or pass student id if required
    });

    if (isLoading) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Attendance Detail
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

    if (isError || !data) {
        return (
            <Card className='shadow-md border border-border bg-card text-card-foreground rounded-xl'>
                <CardHeader className='border-b border-border pb-3'>
                    <CardTitle className='text-3xl font-bold text-primary'>
                        Attendance Detail
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-8 flex justify-center items-center text-destructive'>
                    Error loading attendance details
                </CardContent>
            </Card>
        );
    }

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'>
            <div className='bg-background text-foreground rounded-lg shadow-lg w-[600px] p-6 relative border border-border'>
                {/* Close Button */}
                <button
                    className='absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors'
                    onClick={onClose}
                >
                    ✖
                </button>

                {/* Title */}
                <h2 className='text-xl font-semibold mb-4'>
                    Attendance Detail – {month}/{year}
                </h2>

                {/* Table */}
                {data && (
                    <div className='overflow-x-auto'>
                        <table className='w-full border border-border'>
                            <thead>
                                <tr className='bg-muted'>
                                    <th className='border border-border p-2 text-left'>
                                        Date
                                    </th>
                                    <th className='border border-border p-2 text-left'>
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.attendance_data.map(
                                    (day: any, idx: number) => (
                                        <tr
                                            key={idx}
                                            className='hover:bg-muted/40'
                                        >
                                            <td className='border border-border p-2'>
                                                {day.date}
                                            </td>
                                            <td
                                                className='border border-border p-2'
                                                dangerouslySetInnerHTML={{
                                                    __html: day.status,
                                                }}
                                            />
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceDetailModal;
