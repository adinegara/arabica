import { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ImageScannerProps {
  onTextDetected: (text: string) => void;
  onClose: () => void;
}

const ImageScanner = ({ onTextDetected, onClose }: ImageScannerProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  const { toast } = useToast();

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);

    // Create preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    try {
      // Convert file to base64
      const base64Image = await fileToBase64(file);

      // Call edge function for OCR
      const { data, error } = await supabase.functions.invoke('ocr-arabic', {
        body: { image: base64Image },
      });

      if (error) {
        console.error('OCR Error:', error);
        
        // Handle specific error codes
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
          description: t('scanSuccessDesc'),
        });
        onClose();
      } else {
        toast({
          title: t('scanNoText'),
          description: t('scanNoTextDesc'),
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
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">{t('scanImage')}</h3>
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
            <p className="text-sm text-muted-foreground mb-2">{t('scanProcessing')}</p>
            <p className="text-xs text-muted-foreground">Analyzing with AI Vision...</p>
          </div>
        ) : (
          /* Selection State */
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center mb-6">
              {t('scanDescription')}
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
