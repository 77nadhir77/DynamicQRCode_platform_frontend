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
import { Spinner } from '@/pages/Spinner';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDeleteSelected: (selectedIds: number[]) => void;
  isDeleting: boolean;
  onResetSelectionRequest?: (resetFn: () => void) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  links: string[];
  setLinks: React.Dispatch<React.SetStateAction<string[]>>;
  linkStatuses: string[]; // 👈 ajouté
  setLinkStatuses: React.Dispatch<React.SetStateAction<string[]>>; // 👈 ajouté
  isCreating: boolean;
  handleCreate: () => void;
  onDownloadSelected?: (selectedIds: number[]) => void; // 👈 added
}

export function DataTable<TData extends { id: number }, TValue>({
  columns,
  data,
  onDeleteSelected,
  isDeleting,
  onResetSelectionRequest,
  open,
  setOpen,
  links,
  setLinks,
  linkStatuses, // 👈 ajouté
  setLinkStatuses, // 👈 ajouté
  isCreating,
  handleCreate,
  onDownloadSelected, // 👈 added
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState({
    pageIndex: localStorage.getItem('pageIndex')
      ? Number(localStorage.getItem('pageIndex'))
      : 0,
    pageSize: localStorage.getItem('pageSize')
      ? Number(localStorage.getItem('pageSize'))
      : 5,
  });

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination,
      columnFilters,
    },
    autoResetPageIndex: false,
    onPaginationChange: setPagination,
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
  // Expose the reset function to parent
  useEffect(() => {
    localStorage.setItem('pageIndex', String(pagination.pageIndex));
    localStorage.setItem('pageSize', String(pagination.pageSize));
  }, [pagination.pageIndex, pagination.pageSize]);


  const addLinks = () => {
    setLinks((prevLinks) => [...prevLinks, '']);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="justify-between items-center flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="w-full ">
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
            className="sm:max-w-sm w-full"
          />
        </div>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) setLinks(['']);
          }}
        >
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto cursor-pointer">
              ➕ Ajouter un QR Code
            </Button>
          </DialogTrigger>
          <DialogContent
            className="w-[90vw] max-w-md"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Creation d'un QR Code</DialogTitle>
              <DialogDescription>
                Enter le lien de redirection du QR Code.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex justify-end">
                <Button
                  onClick={addLinks}
                  className="w-[30px] h-[30px] flex items-center justify-center cursor-pointer"
                >
                  +
                </Button>
              </div>
              <div className="grid grid-cols-5 items-center gap-4">
                {links.map((link, index) => (
                  <React.Fragment key={index}>
                    <Label
                      htmlFor={`link-${index}`}
                      className="text-right col-span-2"
                    >
                      Lien de redirection
                    </Label>

                    <div className="col-span-3 flex items-center gap-2">
                      <Input
                        id={`link-${index}`}
                        value={link}
                        onChange={(e) => {
                          const updatedLinks = [...links];
                          updatedLinks[index] = e.target.value;
                          setLinks(updatedLinks);
                        }}
                        className="flex-1"
                        placeholder="https://example.com"
                      />

                      {/* Spinner avec statut spécifique */}
                      <Spinner
                        status={
                          (linkStatuses[index] || 'idle') as
                            | 'idle'
                            | 'loading'
                            | 'success'
                        }
                      />
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
            <DialogFooter>
              {isCreating ? (
                <Button disabled>Chargment ...</Button>
              ) : (
                <Button className="cursor-pointer" onClick={handleCreate}>
                  Ajouter
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-2/3 flex-col overflow-x-auto rounded-md border">
        <Table className="min-w-full text-sm">
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
                  chargement...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm">Lignes par page:</span>
          <select
            value={pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
              setPagination({
                ...pagination,
                pageSize: Number(e.target.value),
              });
              setPagination({
                ...pagination,
                pageSize: Number(e.target.value),
              });
            }}
            className="border rounded px-2 py-1 text-sm"
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
            Précédent
          </Button>
          <span className="text-sm">
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
      <div className="flex flex-wrap gap-2">
        {/* Trigger for delete confirmation */}
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="w-full sm:w-auto cursor-pointer"
              disabled={table.getSelectedRowModel().rows.length === 0}
            >
              {isDeleting ? 'Suppression...' : 'Supprimer la sélection'} (
              {table.getSelectedRowModel().rows.length})
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="w-[90vw] max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible et supprimera{' '}
                {table.getSelectedRowModel().rows.length} élément(s).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="cursor-pointer"
                onClick={() => table.resetRowSelection()}
              >
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                className="cursor-pointer"
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

        {/* Download button should NOT be inside AlertDialogTrigger */}
        <Button
          variant="secondary"
          className="w-full sm:w-auto cursor-pointer"
          disabled={table.getSelectedRowModel().rows.length === 0}
          onClick={() => {
            const selectedIds = table
              .getSelectedRowModel()
              .rows.map((row) => row.original.id);
            if (onDownloadSelected) {
              onDownloadSelected(selectedIds);
            }
          }}
        >
          Télécharger la sélection ({table.getSelectedRowModel().rows.length})
        </Button>
      </div>
    </div>
  );
}
