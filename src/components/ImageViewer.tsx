import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ImageViewerProps {
  src: string;
  onClose: () => void;
}

export default function ImageViewer({ src, onClose }: ImageViewerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200
                  ${visible ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/0'}`}
      onClick={handleClose}
    >
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20
                   flex items-center justify-center hover:bg-white/30 transition-colors z-10"
      >
        <X size={20} className="text-white" />
      </button>
      <img
        src={src}
        alt=""
        className={`max-w-[90vw] max-h-[90vh] rounded-2xl object-contain transition-all duration-300
                    ${visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}