import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageTitle } from "@/components/common/parts/BreadCrumb";

interface FeeRecord {
    feeCode: string;
    amount: number;
    discount: number;
    payableAmount: number;
    status: "Paid" | "Unpaid";
    paidDate?: string;
}

interface MonthlyFeeData {
    month: string;
    balance: number;
    dueDate?: string;
    records: FeeRecord[];
}

function FeeTab() {
    // Generate 12 months of data starting from current month
    const generateFeeData = (): MonthlyFeeData[] => {
        const months = [];
        const currentDate = new Date();

        for (let i = 0; i < 12; i++) {
            const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + i,
                1
            );
            const monthYear = date.toLocaleString("default", {
                month: "long",
                year: "numeric",
            });

            const isCurrentMonth = i === 0;
            const isPastMonth = i < 0;

            months.push({
                month: monthYear,
                balance: isCurrentMonth ? 8700 : 0,
                dueDate: `10-${(date.getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}-${date.getFullYear()}`,
                records: [
                    {
                        feeCode: "Monthly Fee (Monthly)",
                        amount: 8700.0,
                        discount: 0,
                        payableAmount: 8700,
                        status: (isPastMonth || isCurrentMonth
                            ? "Paid"
                            : "Unpaid") as "Paid" | "Unpaid",
                        paidDate:
                            isPastMonth || isCurrentMonth
                                ? `${Math.floor(Math.random() * 28) + 1}-${(
                                      date.getMonth() + 1
                                  )
                                      .toString()
                                      .padStart(2, "0")}-${date.getFullYear()}`
                                : undefined,
                    },
                    // Add more fee records if needed
                ],
            });
        }
        return months;
    };

    const feeData = generateFeeData();

    return (
        <>
            <PageTitle
                title='Fee'
                description=''
                fontSize='text-2xl'
            />

            <div className='space-y-6'>
                {feeData.map((monthData, index) => (
                    <div
                        key={index}
                        className='rounded-md border'
                    >
                        <div className='bg-green-800 text-white p-3 flex justify-between'>
                            <span>
                                {monthData.month} - Balance: {monthData.balance}
                            </span>
                            {monthData.dueDate && (
                                <span>Due Date {monthData.dueDate}</span>
                            )}
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fee Code</TableHead>
                                    <TableHead>Amount (Rs.)</TableHead>
                                    <TableHead>Discount (Rs.)</TableHead>
                                    <TableHead>Payable Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Paid Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {monthData.records.map(
                                    (record, recordIndex) => (
                                        <TableRow key={recordIndex}>
                                            <TableCell>
                                                {record.feeCode}
                                            </TableCell>
                                            <TableCell>
                                                {record.amount.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                {record.discount}
                                            </TableCell>
                                            <TableCell>
                                                {record.payableAmount}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        record.status === "Paid"
                                                            ? "default"
                                                            : "destructive"
                                                    }
                                                >
                                                    {record.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {record.paidDate || "-"}
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </div>
                ))}
            </div>
        </>
    );
}

export default FeeTab;
