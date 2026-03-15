import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, Loader2, Check, RotateCcw } from 'lucide-react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ImageScannerProps {
  onTextDetected: (text: string) => void;
  onClose: () => void;
  ocrFunction?: string;
  variant?: 'arabic' | 'latin';
}

function getCroppedImage(image: HTMLImageElement, crop: PixelCrop): string {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(
    image,
    crop.x * scaleX, crop.y * scaleY,
    crop.width * scaleX, crop.height * scaleY,
    0, 0,
    canvas.width, canvas.height,
  );
  return canvas.toDataURL('image/jpeg', 0.9);
}

const ImageScanner = ({ onTextDetected, onClose, ocrFunction = 'ocr-arabic', variant = 'arabic' }: ImageScannerProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  const { toast } = useToast();

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropWidth = width * 0.8;
    const cropHeight = height * 0.8;
    setCrop({
      unit: 'px',
      x: (width - cropWidth) / 2,
      y: (height - cropHeight) / 2,
      width: cropWidth,
      height: cropHeight,
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setCrop(undefined);
        setCompletedCrop(undefined);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleCropConfirm = async () => {
    if (!imgRef.current || !completedCrop) return;
    setIsProcessing(true);

    try {
      const croppedBase64 = getCroppedImage(imgRef.current, completedCrop);
      setPreviewUrl(croppedBase64);

      const { data, error } = await supabase.functions.invoke(ocrFunction, {
        body: { image: croppedBase64 },
      });

      if (error) {
        console.error('OCR Error:', error);

        if (error.message?.includes('429')) {
          toast({
            title: t('scanError'),
            description: 'Rate limit exceeded. Please wait a moment and try again.',
            variant: 'destructive',
          });
        } else if (error.message?.includes('402')) {
          toast({
            title: t('scanError'),
            description: 'AI credits exhausted. Please add credits to continue.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: t('scanError'),
            description: t('scanErrorDesc'),
            variant: 'destructive',
          });
        }
        return;
      }

      const extractedText = data?.text?.trim();

      if (extractedText) {
        onTextDetected(extractedText);
        toast({
          title: t('scanSuccess'),
          description: t(variant === 'latin' ? 'scanLatinSuccessDesc' : 'scanSuccessDesc'),
        });
        onClose();
      } else {
        toast({
          title: t('scanNoText'),
          description: t(variant === 'latin' ? 'scanLatinNoTextDesc' : 'scanNoTextDesc'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('OCR Error:', error);
      toast({
        title: t('scanError'),
        description: t('scanErrorDesc'),
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReselect = () => {
    setImageSrc(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setPreviewUrl(null);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">{t(variant === 'latin' ? 'scanLatinImage' : 'scanImage')}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            disabled={isProcessing}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isProcessing ? (
          /* Processing State */
          <div className="text-center py-8">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Processing"
                className="w-32 h-32 object-cover rounded-lg mx-auto mb-4 opacity-50"
              />
            )}
            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-sm text-muted-foreground mb-2">{t(variant === 'latin' ? 'scanLatinProcessing' : 'scanProcessing')}</p>
            <p className="text-xs text-muted-foreground">Analyzing with AI Vision...</p>
          </div>
        ) : imageSrc ? (
          /* Cropping State */
          <div>
            <div className="flex justify-center mb-4 rounded-xl bg-black">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Crop"
                  onLoad={onImageLoad}
                  className="max-w-full object-contain"
                />
              </ReactCrop>
            </div>
            <p className="text-xs text-muted-foreground text-center mb-4">
              Drag edges or corners to adjust crop area
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleReselect}
                className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-border hover:bg-muted/50 transition-all"
              >
                <RotateCcw className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Reselect</span>
              </button>
              <button
                onClick={handleCropConfirm}
                disabled={!completedCrop}
                className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Scan</span>
              </button>
            </div>
          </div>
        ) : (
          /* Selection State */
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center mb-6">
              {t(variant === 'latin' ? 'scanLatinDescription' : 'scanDescription')}
            </p>

            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all"
            >
              <Upload className="w-6 h-6 text-primary" />
              <span className="font-medium">{t('uploadImage')}</span>
            </button>

            {/* Camera Button */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all"
            >
              <Camera className="w-6 h-6 text-primary" />
              <span className="font-medium">{t('takePhoto')}</span>
            </button>

            {/* Hidden Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />

            <p className="text-xs text-muted-foreground text-center pt-2">
              {t('scanTip')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageScanner;
