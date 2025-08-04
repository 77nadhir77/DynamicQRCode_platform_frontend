import React, { useEffect, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // if you're using shadcn button
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from './ui/label';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDeleteSelected: (selectedIds: number[]) => void;
  isDeleting: boolean;
  onResetSelectionRequest?: (resetFn: () => void) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newLink: string;
  setNewLink: React.Dispatch<React.SetStateAction<string>>;
  isCreating: boolean;
  handleCreate: () => void;
}

export function DataTable<TData extends { id: number }, TValue>({
  columns,
  data,
  onDeleteSelected,
  isDeleting,
  onResetSelectionRequest,
  open,
  setOpen,
  newLink,
  setNewLink,
  isCreating,
  handleCreate,
}: DataTableProps<TData, TValue>) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination: {
        pageSize,
        pageIndex,
      },
      columnFilters,
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === 'function'
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(next.pageIndex);
      setPageSize(next.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  // Expose the reset function to parent
  useEffect(() => {
    if (onResetSelectionRequest) {
      onResetSelectionRequest(() => table.resetRowSelection());
    }
  }, [table, onResetSelectionRequest]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="w-full">
          <Input
            type="number"
            placeholder="Rechercher par ID..."
            value={table.getColumn('id')?.getFilterValue()?.toString() ?? ''}
            onChange={(event) => {
              const value = event.target.value;
              table
                .getColumn('id')
                ?.setFilterValue(value ? Number(value) : undefined);
            }}
            className="max-w-sm w-full"
          />
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>➕ Ajouter un QR Code</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Creation d'un QR Code</DialogTitle>
              <DialogDescription>
                Enter le lien de redirection du QR Code.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="link" className="text-right">
                  Lien de redirection
                </Label>
                <Input
                  id="link"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  className="col-span-3"
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <DialogFooter>
              {isCreating ? (
                <Button disabled>Chargment ...</Button>
              ) : (
                <Button onClick={handleCreate}>Ajouter</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-2/3 flex-col overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-2">
          <span>Lignes par page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
              setPageSize(Number(e.target.value));
            }}
            className="border rounded px-2 py-1"
          >
            {[5, 10, 20, 30].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Precédent
          </Button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} sur{' '}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Suivant
          </Button>
        </div>
      </div>
      {/* Delete Button and Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            disabled={table.getSelectedRowModel().rows.length === 0}
          >
            {isDeleting ? 'Supression en cours...' : 'supprimer la selection'}(
            {table.getSelectedRowModel().rows.length})
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible et supprimera{' '}
              {table.getSelectedRowModel().rows.length} élément(s).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => table.resetRowSelection()}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const selectedIds = table
                  .getSelectedRowModel()
                  .rows.map((row) => row.original.id);

                onDeleteSelected(selectedIds);
                setDialogOpen(false);
              }}
            >
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
