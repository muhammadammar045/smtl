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
                description=''
                fontSize='text-2xl'
            />
            <div className='space-y-6'>
                {studentFee.map((fee) => (
                    <div
                        key={fee.id}
                        className='rounded-md border'
                    >
                        <div className='bg-green-800 text-white p-3 flex justify-between'>
                            <span>
                                {fee.fee_monthly_code} - Balance: {fee.amount}
                            </span>
                            {fee.fee_master_due && (
                                <span>Due Date: {fee.fee_master_due}</span>
                            )}
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fee Type</TableHead>
                                    <TableHead>Amount (Rs.)</TableHead>
                                    <TableHead>Discount (Rs.)</TableHead>
                                    <TableHead>Payable Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Paid Date</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {fee.heads.map((head) => {
                                    // Parse amount_detail if it’s not "0"
                                    let detail: any = null;
                                    if (
                                        head.amount_detail &&
                                        head.amount_detail !== "0"
                                    ) {
                                        const parsed = JSON.parse(
                                            head.amount_detail
                                        );
                                        // amount_detail is an object with keys like "1"
                                        detail = parsed[Object.keys(parsed)[0]];
                                    }

                                    const amount = parseFloat(head.amount);
                                    const discount = parseFloat(
                                        head.installment_discount || "0"
                                    );
                                    const payableAmount = amount - discount;
                                    const status =
                                        head.student_fees_deposite_id &&
                                        head.student_fees_deposite_id !== "0"
                                            ? "Paid"
                                            : "Unpaid";
                                    const paidDate = detail?.date || null;

                                    return (
                                        <TableRow key={head.id}>
                                            <TableCell>
                                                {head.installment_number}
                                            </TableCell>
                                            <TableCell>
                                                {amount.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                {discount.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                {payableAmount.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        status === "Paid"
                                                            ? "default"
                                                            : "destructive"
                                                    }
                                                >
                                                    {status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {paidDate || "-"}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                ))}
            </div>
        </>
    );
}

export default FeeTab;
