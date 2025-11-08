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
import { cn } from "@/lib/utils";
import Loader from "@/components/common/loader/Loader";

type ColumnMeta = {
    headerClassName?: string;
    cellClassName?: string;
};

interface TenStackReactTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
    className?: string;
    emptyMessage?: string;
    isLoading?: boolean;
    loadingMessage?: string;
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
    className,
    emptyMessage = "No results.",
    isLoading = false,
    loadingMessage = "Fetching latest records…",
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
        <div className={cn("space-y-4", className)}>
            {/* Search + Actions */}
            <div className='flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm shadow-muted/40 backdrop-blur-sm md:flex-row md:items-center md:justify-between'>
                <Input
                    placeholder='Search...'
                    value={table.getState().globalFilter ?? ""}
                    onChange={(e) => table.setGlobalFilter(e.target.value)}
                    className='min-h-[48px] max-w-md rounded-xl border-border/60 bg-background text-sm placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-primary/40 md:text-base'
                />
                <div className='flex items-center gap-2'>
                    {actions.map(({ icon: Icon, label }, idx) => (
                        <Button
                            key={idx}
                            variant='secondary'
                            size='sm'
                            title={label}
                            className='flex h-10 w-10 items-center justify-center rounded-xl border-border/40 bg-muted/30 text-muted-foreground transition hover:bg-primary/10 hover:text-primary'
                            onClick={() => handleAction(label)}
                        >
                            <Icon className='w-4 h-4' />
                        </Button>
                    ))}

                    {/* Column visibility toggler */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant='secondary'
                                size='sm'
                                title='Columns'
                                className='flex h-10 w-10 items-center justify-center rounded-xl border-border/40 bg-muted/30 text-muted-foreground transition hover:bg-primary/10 hover:text-primary'
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
            <div className='relative overflow-hidden rounded-3xl border border-border/60 shadow-sm shadow-muted/40'>
                <div className={cn("overflow-x-auto", isLoading && "pointer-events-none opacity-50 blur-[0.2px] transition")}>
                    <Table className='min-w-full'>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className={cn(
                                                "bg-muted/30 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80 sm:text-xs",
                                                (
                                                    header.column.columnDef
                                                        .meta as ColumnMeta | undefined
                                                )?.headerClassName
                                            )}
                                        >
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
                                    <TableRow
                                        key={row.id}
                                        className='border-b border-border/50 last:border-none hover:bg-primary/5'
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className={cn(
                                                    "px-4 py-4 text-xs font-medium text-muted-foreground sm:text-sm",
                                                    (
                                                        cell.column.columnDef
                                                            .meta as ColumnMeta | undefined
                                                    )?.cellClassName
                                                )}
                                            >
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
                                        className='h-24 px-4 text-center text-sm font-medium text-muted-foreground'
                                    >
                                        {emptyMessage}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>

                        {/* Footer */}
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={columns.length}>
                                    <div className='flex flex-col items-center gap-3 rounded-b-3xl bg-muted/10 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:text-sm'>
                                        {/* Records count */}
                                        <div>
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
                                        <Pagination className='justify-center sm:justify-end'>
                                            <PaginationContent className='flex-wrap gap-1'>
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
                                                        className={cn(
                                                            !table.getCanPreviousPage()
                                                                ? "pointer-events-none opacity-50"
                                                                : "cursor-pointer"
                                                        )}
                                                    />
                                                </PaginationItem>

                                                {/* Desktop pagination */}
                                                <div className='hidden sm:flex'>
                                                    {renderPageNumbers()}
                                                </div>

                                                {/* Mobile pagination (just page info) */}
                                                <div className='px-2 text-xs sm:hidden'>
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
                                                        className={cn(
                                                            !table.getCanNextPage()
                                                                ? "pointer-events-none opacity-50"
                                                                : "cursor-pointer"
                                                        )}
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
                {isLoading && (
                    <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/75 backdrop-blur-sm'>
                        <Loader
                            variant='dots'
                            size={32}
                        />
                        <p className='text-sm font-medium text-muted-foreground'>
                            {loadingMessage}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TenStackReactTable;
