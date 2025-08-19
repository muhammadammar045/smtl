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
            <div className='bg-white rounded-lg shadow-lg w-[600px] p-6 relative'>
                <button
                    className='absolute top-3 right-3 text-gray-600 hover:text-black'
                    onClick={onClose}
                >
                    ✖
                </button>
                <h2 className='text-xl font-semibold mb-4'>
                    Attendance Detail – {month}/{year}
                </h2>

                {isLoading && <p>Loading details...</p>}
                {error && (
                    <p className='text-red-500'>Failed to load details.</p>
                )}

                {data && (
                    <div className='overflow-x-auto'>
                        <table className='w-full border border-gray-200'>
                            <thead>
                                <tr className='bg-gray-100'>
                                    <th className='border p-2'>Date</th>
                                    <th className='border p-2'>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.attendance_data.map(
                                    (day: any, idx: number) => (
                                        <tr key={idx}>
                                            <td className='border p-2'>
                                                {day.date}
                                            </td>
                                            <td
                                                className='border p-2'
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
