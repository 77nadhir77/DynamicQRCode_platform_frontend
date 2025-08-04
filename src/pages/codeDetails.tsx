import { Button } from '@/components/ui/button';
import Code from '@/utils/Code';
import useAxios from '@/utils/useAxios';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
const CodeDetails = () => {
  let api = useAxios();
  const { id } = useParams<{ id: string }>();
  const [code, setCode] = React.useState<Code>({
    id: 0,
    link: '',
    image: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

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
      const response = await api.get(`api/qrcode/${id}`);
      setCode(response.data);
      console.log('Code details fetched successfully:', response.data);
    } catch (error) {
      console.error('Error fetching code details:', error);
    }
  };
  useEffect(() => {
    getCode();
  }, []);
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 w-[800px] border rounded shadow flex justify-around items-center">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-2xl font-semibold mb-4">QR Code Details</h1>
          <div className="text-center mb-6">
            <p>
              <strong>ID:</strong> {code.id}
            </p>
            <div className="my-4 flex justify-center items-center mx-3">
              {code.image && (
                <img
                  src={code.image}
                  alt={`QR Code for ${code.link}`}
                  className="w-full h-auto max-w-xs rounded"
                />
              )}
            </div>
          </div>
        </div>

        <div className="ml-8">
          <p>
            <strong>URL:</strong>{' '}
            <a
              href={code.link}
              className="text-blue-600 underline"
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
          <Button className="mt-4">
            <Link to="/">Back</Link>
          </Button>
          <Button variant="outline" className="mt-4" onClick={handleExportPDF}>
            Exporter en PDF
          </Button>
          <Button
            variant="outline"
            className="mt-4 mr-2"
            onClick={handleDownloadImage}
          >
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodeDetails;
