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
    const { data, isLoading, error } = useGetAttendanceDetailsQuery({
        month,
        year,
        search: "", // or pass student id if required
    });

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

                {/* States */}
                {isLoading && (
                    <p className='text-muted-foreground'>Loading details...</p>
                )}
                {error && (
                    <p className='text-destructive'>Failed to load details.</p>
                )}

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
