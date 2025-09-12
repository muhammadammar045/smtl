import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { IStudentDueFee } from "@/store/slices/dashboard/types";
import { PageTitle } from "@/components/common/parts/BreadCrumb";

function FeeTab({ studentFee }: { studentFee: IStudentDueFee[] }) {
    return (
        <>
            <PageTitle
                title='💰 Fee'
                fontSize='text-2xl text-primary'
            />

            {studentFee.length === 0 ? (
                <div className='text-center text-muted-foreground mt-10'>
                    <p>No fee records found.</p>
                </div>
            ) : (
                <div className='space-y-8'>
                    {studentFee.map((fee) => (
                        <Card
                            key={fee.id}
                            className='shadow-md shadow-muted/20 overflow-hidden border border-border bg-card text-card-foreground rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-shadow'
                        >
                            {/* Card header */}
                            <div className='bg-primary text-primary-foreground px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                                <div className='font-semibold text-base'>
                                    {fee.fee_monthly_code}
                                </div>
                                <div className='flex items-center gap-3'>
                                    <Badge className='bg-accent text-accent-foreground hover:bg-accent/90'>
                                        Balance: Rs. {fee.amount}
                                    </Badge>
                                    {fee.fee_master_due && (
                                        <span className='text-sm text-muted-foreground'>
                                            Due Date: {fee.fee_master_due}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Card body */}
                            <CardContent className='p-0'>
                                <div className='overflow-x-auto'>
                                    <Table>
                                        <TableHeader>
                                            <TableRow className='bg-muted/20'>
                                                <TableHead>
                                                    Installment
                                                </TableHead>
                                                <TableHead>
                                                    Amount (Rs.)
                                                </TableHead>
                                                <TableHead>
                                                    Discount (Rs.)
                                                </TableHead>
                                                <TableHead>Payable</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Paid Date</TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {fee.heads.map((head, index) => {
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
                                                            Object.keys(
                                                                parsed
                                                            )[0]
                                                        ];
                                                }

                                                const amount = parseFloat(
                                                    head.amount
                                                );
                                                const discount = parseFloat(
                                                    head.installment_discount ||
                                                        "0"
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
                                                    <TableRow
                                                        key={head.id}
                                                        className={
                                                            index % 2 === 0
                                                                ? "bg-muted/30"
                                                                : "bg-background"
                                                        }
                                                    >
                                                        <TableCell>
                                                            {
                                                                head.installment_number
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {amount.toFixed(2)}
                                                        </TableCell>
                                                        <TableCell>
                                                            {discount.toFixed(
                                                                2
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {payableAmount.toFixed(
                                                                2
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                className={
                                                                    status ===
                                                                    "Paid"
                                                                        ? "bg-success text-success-foreground hover:bg-success/90"
                                                                        : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </>
    );
}

export default FeeTab;
