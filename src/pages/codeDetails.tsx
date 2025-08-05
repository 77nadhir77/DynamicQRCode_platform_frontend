import { Button } from '@/components/ui/button';
import Code from '@/utils/Code';
import useAxios from '@/utils/useAxios';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import { ArrowLeft, Download, FileText, Pencil } from 'lucide-react';
import Spinner from '@/components/Spinner';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const CodeDetails = () => {
  let api = useAxios();
  const { id } = useParams<{ id: string }>();
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [code, setCode] = useState<Code>({
    id: 0,
    link: '',
    image: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [open, setOpen] = useState(false);
  const [newLink, setNewLink] = useState<string>('');

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleEdit = () => {
    setIsEditing(true);
    api
      .put(`api/update/${id}`, { link: newLink })
      .then(() => {
        setIsEditing(false);
        setOpen(false);
        getCode(); // Refresh the code details after editing
      })
      .catch((error) => {
        console.error('Error updating code:', error);
      })
      .finally(() => {
        setIsEditing(false);
      });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const img = new Image();
    img.src = code.image;

    img.onload = () => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const imgWidth = 200;
      const imgHeight = 200;

      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      doc.addImage(img, 'PNG', x, y, imgWidth, imgHeight);
      doc.save(`qr-code-${code.id}.pdf`);
    };
  };

  const handleDownloadImage = () => {
    const image = new Image();
    image.crossOrigin = 'anonymous'; // Avoid CORS issues

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = 4; // Increase for higher resolution
      canvas.width = image.width * scale;
      canvas.height = image.height * scale;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(scale, scale);
        ctx.drawImage(image, 0, 0);
        const link = document.createElement('a');
        link.download = `qr-code-${code.id}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    };

    image.src = code.image;
  };

  const getCode = async () => {
    try {
      setLoadingImage(true);
      const response = await api.get(`api/qrcode/${id}`);
      setCode(response.data);
      console.log('Code details fetched successfully:', response.data);
    } catch (error) {
      console.error('Error fetching code details:', error);
    } finally {
      setLoadingImage(false);
    }
  };
  useEffect(() => {
    getCode();
  }, []);
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div
        className="mt-10 bg-white p-6 border rounded shadow relative
    flex justify-between items-center
    max-sm:flex-col max-sm:w-full
    sm:max-w-screen-md "
      >
        <div className="cursor-pointer absolute top-4 left-4 outline rounded-full bg-gray-200 p-2">
          <Link to="/">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        {/* Left section with image and details */}
        <div className="flex flex-2 flex-col items-center p-4 h-full sm:w-full">
          <h1 className=" text-2xl font-semibold mb-2">Details du code QR</h1>
          <p className="mb-4">
            <strong>Id:</strong> {code.id}
          </p>
          <div className="flex justify-center items-center w-full h-auto border rounded overflow-hidden">
            {loadingImage ? (
              <Spinner />
            ) : (
              code.image && (
                <img
                  src={code.image}
                  alt={`QR Code for ${code.link}`}
                  className="w-full h-auto object-contain"
                />
              )
            )}
          </div>
        </div>

        {/* Right section with link and actions */}
        <div className="flex max-sm:w-full sm:flex-1 flex-col w-full h-full p-4">
          <div className="mb-6 space-y-3">
            <p>
              <strong>URL:</strong>{' '}
              <a
                href={code.link}
                className="text-blue-600 underline break-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                {code.link}
              </a>
            </p>
            <p>
              <strong>Date de création:</strong>{' '}
              {new Date(code.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Date de modification:</strong>{' '}
              {new Date(code.updatedAt).toLocaleString()}
            </p>
          </div>

          <div className="flex max-sm:flex-col justify-between w-full items-center">
            <Button
              className="max-sm:w-50 max-sm:mb-2 ml-2"
              variant="outline"
              onClick={handleExportPDF}
            >
              Exporter en PDF <FileText />
            </Button>
            <Button
              className="max-sm:w-50 max-sm:mb-2 ml-2"
              variant="outline"
              onClick={handleDownloadImage}
            >
              Download <Download />
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="max-sm:w-50 max-sm:mb-2 ml-2">
                  Editer <Pencil />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Modefication du lien QR Code</DialogTitle>
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
                  {isEditing ? (
                    <Button disabled>Chargement ...</Button>
                  ) : (
                    <Button onClick={handleEdit}>Modifier</Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeDetails;
