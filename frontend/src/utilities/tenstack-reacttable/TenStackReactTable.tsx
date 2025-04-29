import * as React from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter,
} from "@/components/ui/table";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    Copy,
    FileSpreadsheet,
    FileText,
    Printer,
    FileArchive,
    SlidersHorizontal,
} from "lucide-react";

interface TenStackReactTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
}
const actions = [
    { icon: Copy, label: "Copy" },
    { icon: FileSpreadsheet, label: "Excel" },
    { icon: FileText, label: "CSV" },
    { icon: FileArchive, label: "PDF" },
    { icon: Printer, label: "Print" },
];

function TenStackReactTable<TData>({
    data,
    columns,
}: TenStackReactTableProps<TData>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),

        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });
    function handleAction(action: string) {
        switch (action) {
            case "Copy":
                console.log("Copying...");
                break;
            case "Excel":
                console.log("Exporting to Excel...");
                break;
            case "CSV":
                console.log("Exporting to CSV...");
                break;
            case "PDF":
                console.log("Exporting to PDF...");
                break;
            case "Print":
                console.log("Printing...");
                break;
            default:
                break;
        }
    }

    return (
        <div className='p-2'>
            <div className='flex flex-col md:flex-row gap-4 justify-between mb-4'>
                <Input
                    placeholder='Search...'
                    value={table.getState().globalFilter ?? ""}
                    onChange={(e) => table.setGlobalFilter(e.target.value)}
                    className='max-w-sm'
                />
                <div className='flex items-center gap-2'>
                    {actions.map(({ icon: Icon, label }, idx) => (
                        <Button
                            key={idx}
                            variant='outline'
                            size='sm'
                            title={label}
                            className='flex items-center justify-center'
                            onClick={() => handleAction(label)} // handle actions here
                        >
                            <Icon className='w-4 h-4' />
                        </Button>
                    ))}

                    {/* Column visibility toggler */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant='outline'
                                size='sm'
                                title='Columns'
                            >
                                <SlidersHorizontal className='w-4 h-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {/* Columns visibility items here */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className='grid grid-cols-12 max-w-screen overflow-x-hidden'>
                <div className='col-span-12 overflow-x-hidden'>
                    <Table>
                        {/* Table Header */}
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className='h-24 text-center'
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>

                        {/* Table Footer */}
                        <TableFooter>
                            {/* Footer with left and right alignment */}
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className='p-0'
                                >
                                    <div className='flex justify-between items-center p-2'>
                                        {/* Left side: Total entries */}
                                        <div className='text-left text-sm text-muted-foreground'>
                                            Records:{" "}
                                            {table.getState().pagination
                                                .pageIndex *
                                                table.getState().pagination
                                                    .pageSize +
                                                1}{" "}
                                            to{" "}
                                            {Math.min(
                                                (table.getState().pagination
                                                    .pageIndex +
                                                    1) *
                                                    table.getState().pagination
                                                        .pageSize,
                                                table.getPrePaginationRowModel()
                                                    .rows.length
                                            )}{" "}
                                            of{" "}
                                            {
                                                table.getPrePaginationRowModel()
                                                    .rows.length
                                            }
                                        </div>

                                        {/* Right side: Pagination */}
                                        <div className='text-right'>
                                            <Pagination>
                                                <PaginationContent>
                                                    <PaginationItem>
                                                        <PaginationPrevious
                                                            onClick={() => {
                                                                if (
                                                                    table.getCanPreviousPage()
                                                                ) {
                                                                    table.previousPage();
                                                                }
                                                            }}
                                                            aria-disabled={
                                                                !table.getCanPreviousPage()
                                                            }
                                                            className={
                                                                !table.getCanPreviousPage()
                                                                    ? "pointer-events-none opacity-50"
                                                                    : "cursor-pointer"
                                                            }
                                                        />
                                                    </PaginationItem>

                                                    {Array.from(
                                                        {
                                                            length: table.getPageCount(),
                                                        },
                                                        (_, i) => (
                                                            <PaginationItem
                                                                key={i}
                                                            >
                                                                <PaginationLink
                                                                    onClick={() => {
                                                                        if (
                                                                            table.getState()
                                                                                .pagination
                                                                                .pageIndex !==
                                                                            i
                                                                        ) {
                                                                            table.setPageIndex(
                                                                                i
                                                                            );
                                                                        }
                                                                    }}
                                                                    isActive={
                                                                        table.getState()
                                                                            .pagination
                                                                            .pageIndex ===
                                                                        i
                                                                    }
                                                                    className='cursor-pointer'
                                                                >
                                                                    {i + 1}
                                                                </PaginationLink>
                                                            </PaginationItem>
                                                        )
                                                    )}

                                                    <PaginationItem>
                                                        <PaginationNext
                                                            onClick={() => {
                                                                if (
                                                                    table.getCanNextPage()
                                                                ) {
                                                                    table.nextPage();
                                                                }
                                                            }}
                                                            aria-disabled={
                                                                !table.getCanNextPage()
                                                            }
                                                            className={
                                                                !table.getCanNextPage()
                                                                    ? "pointer-events-none opacity-50"
                                                                    : "cursor-pointer"
                                                            }
                                                        />
                                                    </PaginationItem>
                                                </PaginationContent>
                                            </Pagination>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </div>
        </div>
    );
}

export default TenStackReactTable;
