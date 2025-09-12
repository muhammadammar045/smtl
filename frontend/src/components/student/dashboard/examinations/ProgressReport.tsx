import { useGetResultProgressQuery } from "@/store/slices/examSchedule/examSchedule.slice";

function ProgressReport() {
    const { data } = useGetResultProgressQuery();
    console.log("🚀 ------------------------------------------------------🚀");
    console.log("🚀 ~ ExamsResult.tsx:122 ~ ExamsResult ~ data==>", data);
    console.log("🚀 ------------------------------------------------------🚀");
    return (
        <div className='p-6'>
            <h1 className='text-2xl font-bold'>Progress Report</h1>
        </div>
    );
}

export default ProgressReport;
