import React, { useEffect, useState } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface GeoLocationProps {
  onLocation: (location: { lat: number; lng: number }) => void;
}

export function GeoLocation({ onLocation }: GeoLocationProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLoading(false);
      },
      (error) => {
        setError('Unable to retrieve your location');
        setLoading(false);
      }
    );
  }, [onLocation]);

  if (loading) {
    return (
      <Alert>
        <MapPin className="h-4 w-4" />
        <AlertTitle>Location</AlertTitle>
        <AlertDescription>Getting your current location...</AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert>
      <MapPin className="h-4 w-4" />
      <AlertTitle>Location Retrieved</AlertTitle>
      <AlertDescription>Your location has been captured successfully</AlertDescription>
    </Alert>
  );
}
