import React, { use, useRef } from 'react';
import { useState, useEffect } from 'react';
import useAxios from '../utils/useAxios';
import Code from '@/utils/Code';
import { DataTable } from '@/components/data-table';
import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import Logout from '@/components/Logout'; // ✅ On importe ton composant Logout

import {
  Button,
} from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';

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
      <div className="w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] overflow-hidden whitespace-nowrap text-ellipsis text-left">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('createdAt', {
    header: 'date de création',
    cell: (info) => new Date(info.getValue()).toLocaleString(),
  }),
  columnHelper.accessor('updatedAt', {
    header: 'date de modification',
    cell: (info) => new Date(info.getValue()).toLocaleString(),
  }),
  columnHelper.display({
    id: 'details',
    header: 'Détails',
    cell: ({ row }) => (
      <Link to={`/qrcode/${row.original.id}`}>
        <Button
          variant="outline"
          size="icon"
          className="bg-green-500 hover:bg-green-600 text-white rounded p-2"
        >
          <Eye className="h-4 w-4" />
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
  const [links, setLinks] = useState<Array<string>>(['']);
  const [linkStatuses, setLinkStatuses] = useState<string[]>([]);

  const handleCreate = async () => {
    const trimmedLinks = links.map((link) => link.trim());
    const hasValidLinks = trimmedLinks.some((link) => link !== '');
    if (!hasValidLinks) {
      await Swal.fire({
        icon: 'warning',
        title: 'Aucun lien valide',
        text: 'Veuillez saisir au moins un lien non vide.',
      });
      return;
    }

    const initialStatuses = trimmedLinks.map((link) =>
      link === '' ? '' : 'loading'
    );
    setLinkStatuses(initialStatuses);
    setIsCreating(true);

    try {
      const validLinks = trimmedLinks.filter((link) => link !== '');
      const res1 = await api.post('/api/create', { redirectUrl: validLinks });

      let validIndex = 0;
      for (let i = 0; i < trimmedLinks.length; i++) {
        if (trimmedLinks[i] === '') continue;

        const qr = res1.data.qrCodes[validIndex++];
        if (!qr) continue;

        try {
          const qrCode = new QRCodeStyling({
            width: 1400,
            height: 1400,
            type: 'svg',
            data: `${import.meta.env.VITE_APP_QRCODE_LINK}/${qr.id}`,
            image:
              'https://res.cloudinary.com/dpxpmkxhw/image/upload/v1754582477/uploads/dylkxxi7zp9g8gwingsz.png',
            dotsOptions: { color: '#222222', type: 'rounded' },
            backgroundOptions: { color: 'transparent' },
            imageOptions: { crossOrigin: 'anonymous' },
          });

          const blob = await qrCode.getRawData('png');
          const formData = new FormData();
          formData.append('file', blob as Blob, `qrcode_${qr.id}.png`);
          formData.append('qrCodeId', qr.id);

          await api.post('/api/create/qrcodeimage', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          setLinkStatuses((prev) => {
            const updated = [...prev];
            updated[i] = 'success';
            return updated;
          });
        } catch (err) {
          console.error('Erreur QR:', err);
          setLinkStatuses((prev) => {
            const updated = [...prev];
            updated[i] = 'error';
            return updated;
          });
        }
      }

      getCodes();
      setLinkStatuses([]);
      setOpen(false);
      setLinks(['']);
    } catch (error) {
      console.error('Failed to create QR Codes', error);
    } finally {
      setIsCreating(false);
    }
  };

  const getCodes = () => {
    api
      .get('/')
      .then((response) => {
        setCodes(response.data.QRCodes);
      })
      .catch((error) => {
        console.error('Error fetching codes:', error);
      });
  };

  const handleDownloadSelected = async (selectedIds: number[]) => {
    try {
      const zip = new JSZip();
      for (const id of selectedIds) {
        const res = await api.get(`/api/qrcode/${id}`);
        const { image } = res.data;
        const imgRes = await fetch(image);
        const blob = await imgRes.blob();
        zip.file(`qr-code-${id}.png`, blob);
      }
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'qrcodes.zip');
    } catch (error) {
      console.error('Error downloading selected QR codes:', error);
    }
  };

  const handleDeleteSelected = (selectedIds: number[]) => {
    setIsDeleting(true);
    api
      .delete('/api/delete', { data: { selectedIds } })
      .then(() => {
        getCodes();
        resetSelectionRef.current();
      })
      .catch((error) => {
        console.error('Error deleting codes:', error);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  useEffect(() => {
    getCodes();
  }, []);

  return (
    <>

      {/* 📄 Contenu principal */}
      <div className="mt-24 px-4 py-6 md:px-10 w-full h-full flex flex-col justify-center items-center gap-4">
        <div className="w-full max-w-[1200px]">
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
            links={links}
            setLinks={setLinks}
            linkStatuses={linkStatuses}
            setLinkStatuses={setLinkStatuses}
            isCreating={isCreating}
            handleCreate={handleCreate}
            onDownloadSelected={handleDownloadSelected}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
