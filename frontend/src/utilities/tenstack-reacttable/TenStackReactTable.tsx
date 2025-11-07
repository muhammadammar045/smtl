import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Copy,
    FileArchive,
    FileSpreadsheet,
    FileText,
    Printer,
    SlidersHorizontal,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

    const renderPageNumbers = () => {
        const totalPages = table.getPageCount();
        const currentPage = table.getState().pagination.pageIndex;
        const maxVisible = 2; // pages around current
        const pages: number[] = [];

        let start = Math.max(0, currentPage - maxVisible);
        let end = Math.min(totalPages - 1, currentPage + maxVisible);

        if (currentPage <= maxVisible) {
            end = Math.min(totalPages - 1, 2 * maxVisible);
        }
        if (currentPage + maxVisible >= totalPages) {
            start = Math.max(0, totalPages - 1 - 2 * maxVisible);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return (
            <>
                {start > 0 && (
                    <PaginationItem>
                        <PaginationLink onClick={() => table.setPageIndex(0)}>
                            1
                        </PaginationLink>
                    </PaginationItem>
                )}
                {start > 1 && (
                    <PaginationItem>
                        <span className='px-2'>...</span>
                    </PaginationItem>
                )}
                {pages.map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            onClick={() => table.setPageIndex(page)}
                            isActive={currentPage === page}
                            className='cursor-pointer'
                        >
                            {page + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                {end < totalPages - 2 && (
                    <PaginationItem>
                        <span className='px-2'>...</span>
                    </PaginationItem>
                )}
                {end < totalPages - 1 && (
                    <PaginationItem>
                        <PaginationLink
                            onClick={() => table.setPageIndex(totalPages - 1)}
                        >
                            {totalPages}
                        </PaginationLink>
                    </PaginationItem>
                )}
            </>
        );
    };

    return (
        <div className='p-2'>
            {/* Search + Actions */}
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
                            onClick={() => handleAction(label)}
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
                            {/* Add column toggles here */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Table */}
            <div className='grid grid-cols-12 max-w-screen overflow-x-hidden'>
                <div className='col-span-12 overflow-x-hidden'>
                    <Table>
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

                        {/* Footer */}
                        <TableFooter>
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className='pt-5'
                                >
                                    <div className='flex flex-col sm:flex-row justify-between items-center gap-2 p-2'>
                                        {/* Records count */}
                                        <div className='text-sm text-muted-foreground'>
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

                                        {/* Pagination */}
                                        <Pagination className='justify-end'>
                                            <PaginationContent className='flex-wrap'>
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        onClick={() => {
                                                            if (
                                                                table.getCanPreviousPage()
                                                            )
                                                                table.previousPage();
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

                                                {/* Desktop pagination */}
                                                <div className='hidden sm:flex'>
                                                    {renderPageNumbers()}
                                                </div>

                                                {/* Mobile pagination (just page info) */}
                                                <div className='sm:hidden px-2 text-sm'>
                                                    Page{" "}
                                                    {table.getState().pagination
                                                        .pageIndex + 1}{" "}
                                                    of {table.getPageCount()}
                                                </div>

                                                <PaginationItem>
                                                    <PaginationNext
                                                        onClick={() => {
                                                            if (
                                                                table.getCanNextPage()
                                                            )
                                                                table.nextPage();
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
