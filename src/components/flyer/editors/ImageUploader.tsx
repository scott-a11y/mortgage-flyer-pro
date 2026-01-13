import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, User, Building } from "lucide-react";

interface ImageUploaderProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  type: "headshot" | "logo";
  placeholder?: string;
}

export function ImageUploader({ label, value, onChange, type, placeholder }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label className="editor-label">{label}</Label>
      <div className="flex items-center gap-3">
        {/* Preview */}
        <div 
          className={`flex-shrink-0 flex items-center justify-center bg-muted border rounded-lg overflow-hidden ${
            type === "headshot" ? "w-14 h-14 rounded-full" : "w-20 h-12"
          }`}
        >
          {value ? (
            <img 
              src={value} 
              alt={label} 
              className="w-full h-full object-cover"
            />
          ) : (
            type === "headshot" ? (
              <User className="w-6 h-6 text-muted-foreground" />
            ) : (
              <Building className="w-6 h-6 text-muted-foreground" />
            )
          )}
        </div>

        {/* Upload/Clear buttons */}
        <div className="flex flex-col gap-1.5 flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            className="w-full text-xs"
          >
            <Upload className="w-3 h-3 mr-1.5" />
            {value ? "Change" : "Upload"}
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="w-full text-xs text-destructive hover:text-destructive"
            >
              <X className="w-3 h-3 mr-1.5" />
              Remove
            </Button>
          )}
        </div>
      </div>
      {placeholder && !value && (
        <p className="text-xs text-muted-foreground">{placeholder}</p>
      )}
    </div>
  );
}
