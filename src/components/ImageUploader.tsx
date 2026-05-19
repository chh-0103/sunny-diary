import { useRef } from 'react';
import { Image, X } from 'lucide-react';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    let loaded = 0;

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`图片 "${file.name}" 超过 5MB，已跳过`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        newImages.push(reader.result as string);
        loaded++;
        if (loaded === files.length || loaded === newImages.length) {
          onChange([...images, ...newImages].slice(0, 9));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-text-soft">添加图片（可选）</label>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((img, i) => (
            <div key={i} className="relative group rounded-xl overflow-hidden">
              <img src={img} alt="" className="w-full aspect-square object-cover rounded-xl" />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/40
                           flex items-center justify-center opacity-0 group-hover:opacity-100
                           transition-opacity duration-200"
              >
                <X size={14} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length < 9 && (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-apricot/60 rounded-2xl py-8
                     flex flex-col items-center gap-2 text-text-muted
                     hover:border-warmbrown/40 hover:bg-apricot/10 transition-all duration-300"
        >
          <Image size={28} />
          <span className="text-sm">点击上传图片</span>
          <span className="text-xs text-text-muted/60">最多9张，每张不超过5MB</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}