import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { Camera, RefreshCw } from 'lucide-react';

interface CameraProps {
  onCapture: (photoData: string) => void;
}

export function CameraComponent({ onCapture }: CameraProps) {
  const webcamRef = useRef<Webcam>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPhoto(imageSrc);
      onCapture(imageSrc);
    }
  }, [webcamRef, onCapture]);

  const retake = () => {
    setPhoto(null);
  };

  if (photo) {
    return (
      <div className="flex flex-col items-center gap-4">
        <img src={photo} alt="captured" className="w-full max-w-sm rounded-lg" />
        <Button onClick={retake} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retake Photo
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-full max-w-sm rounded-lg"
      />
      <Button onClick={capture}>
        <Camera className="mr-2 h-4 w-4" />
        Capture Photo
      </Button>
    </div>
  );
}
