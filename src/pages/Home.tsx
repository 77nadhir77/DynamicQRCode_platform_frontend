import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import useAxios from '../utils/useAxios';
import Code from '@/utils/Code';
import { DataTable } from '@/components/data-table';
import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

const columnHelper = createColumnHelper<Code>();

const columns = [
  columnHelper.display({
    id: 'action',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="select-all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="select-row"
      />
    ),
  }),
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
    filterFn: (row, columnId, filterValue) => {
      return String(row.getValue(columnId)).includes(String(filterValue));
    },
  }),
  columnHelper.accessor('link', {
    header: 'url',
    cell: (info) => (
      <div className="w-[200px] overflow-hidden whitespace-nowrap text-ellipsis text-left">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('createdAt', {
    header: 'date de création',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('updatedAt', {
    header: 'date de modification',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'details',
    header: 'Détails',
    cell: ({ row }) => (
      <Link to={`/qrcode/${row.original.id}`}>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer bg-green-500 p-2"
        >
          <Eye className="text-white h-4 w-4 cursor-pointer" />
        </Button>
      </Link>
    ),
  }),
];

const Home = () => {
  const [codes, setCodes] = useState<Code[]>([]);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const resetSelectionRef = useRef<() => void>(() => {});

  const api = useAxios();
  const [open, setOpen] = useState(false);
  const [newLink, setNewLink] = useState<string>('');

  const handleCreate = () => {
    if (!newLink) return;
    setIsCreating(true);
    api
      .post('/api/create', { redirectUrl: newLink })
      .then(() => {
        getCodes(); // Refresh the list
        setOpen(false); // Close dialog
        setNewLink(''); // Reset input
      })
      .catch((err) => {
        console.error('Failed to create QR Code', err);
      })
      .finally(() => {
        setIsCreating(false);
      });
  };

  const getCodes = () => {
    api
      .get('/')
      .then((response) => {
        setCodes(response.data.QRCodes);
        console.log('Codes fetched:', response.data.QRCodes);
      })
      .catch((error) => {
        console.error('Error fetching codes:', error);
      });
  };

  const handleDeleteSelected = (selectedIds: number[]) => {
    // Optional: Call your API to delete by IDs
    setIsDeleting(true);
    api
      .delete('/api/delete', {
        data: { selectedIds: selectedIds },
      })
      .then(() => {
        getCodes();
        resetSelectionRef.current(); // Reset selection after deletion
      })
      .catch((error) => {
        console.error('Error deleting codes:', error);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  useEffect(() => {
    console.log('useEffect called');
    getCodes();
  }, []);

  return (
    <div className="p-10 w-full h-full flex-col justify-center items-center gap-4">
      <DataTable<Code, any>
        data={codes}
        columns={columns}
        onDeleteSelected={handleDeleteSelected}
        isDeleting={isDeleting}
        onResetSelectionRequest={(resetFn) => {
          resetSelectionRef.current = resetFn;
        }}
        open={open}
        setOpen={setOpen}
        newLink={newLink}
        setNewLink={setNewLink}
        isCreating={isCreating}
        handleCreate={handleCreate}
      />
    </div>
  );
};

export default Home;
