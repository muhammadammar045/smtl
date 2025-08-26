import { PageTitle } from "@/components/common/parts/BreadCrumb";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { IStudentDueFee } from "@/store/slices/dashboard/types";

function FeeTab({ studentFee }: { studentFee: IStudentDueFee[] }) {
    return (
        <>
            <PageTitle
                title='Fee'
                fontSize='text-2xl'
            />

            {studentFee.length === 0 ? (
                <div className='text-center text-muted-foreground mt-10'>
                    <p>No fee records found.</p>
                </div>
            ) : (
                <div className='space-y-6'>
                    {studentFee.map((fee) => (
                        <div
                            key={fee.id}
                            className='border rounded-md overflow-hidden shadow-sm'
                        >
                            {/* Header */}
                            <div className='bg-primary text-white px-4 py-3 flex justify-between items-center text-sm sm:text-base'>
                                <span className='font-medium'>
                                    {fee.fee_monthly_code} — Balance: Rs.{" "}
                                    {fee.amount}
                                </span>
                                {fee.fee_master_due && (
                                    <span className='text-sm'>
                                        Due Date: {fee.fee_master_due}
                                    </span>
                                )}
                            </div>

                            {/* Fee Table */}
                            <div className='overflow-x-auto'>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Installment</TableHead>
                                            <TableHead>Amount (Rs.)</TableHead>
                                            <TableHead>
                                                Discount (Rs.)
                                            </TableHead>
                                            <TableHead>Payable</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Paid Date</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {fee.heads.map((head) => {
                                            let detail: any = null;

                                            if (
                                                head.amount_detail &&
                                                head.amount_detail !== "0"
                                            ) {
                                                const parsed = JSON.parse(
                                                    head.amount_detail
                                                );
                                                detail =
                                                    parsed[
                                                        Object.keys(parsed)[0]
                                                    ];
                                            }

                                            const amount = parseFloat(
                                                head.amount
                                            );
                                            const discount = parseFloat(
                                                head.installment_discount || "0"
                                            );
                                            const payableAmount =
                                                amount - discount;
                                            const status =
                                                head.student_fees_deposite_id &&
                                                head.student_fees_deposite_id !==
                                                    "0"
                                                    ? "Paid"
                                                    : "Unpaid";

                                            const paidDate =
                                                detail?.date || "-";

                                            return (
                                                <TableRow key={head.id}>
                                                    <TableCell>
                                                        {
                                                            head.installment_number
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {amount.toFixed(2)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {discount.toFixed(2)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {payableAmount.toFixed(
                                                            2
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                status ===
                                                                "Paid"
                                                                    ? "default"
                                                                    : "destructive"
                                                            }
                                                        >
                                                            {status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {paidDate}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default FeeTab;
