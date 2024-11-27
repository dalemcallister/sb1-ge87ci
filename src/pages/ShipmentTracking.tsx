import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { useShipmentStore } from '../store/shipmentStore';
import { Shipment } from '../types';
import { format } from 'date-fns';
import { Package, Clock, MapPin, Truck } from 'lucide-react';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 0,
  lng: 0,
};

export default function ShipmentTracking() {
  const { id } = useParams<{ id: string }>();
  const { shipments, updateShipmentLocation } = useShipmentStore();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    const foundShipment = shipments.find(s => s.id === id);
    if (foundShipment) {
      setShipment(foundShipment);
      // Calculate route
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: foundShipment.origin.address,
          destination: foundShipment.destination.address,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK') {
            setDirections(result);
          }
        }
      );
    }
  }, [id, shipments]);

  if (!shipment) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const statusColors = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'in-transit': 'bg-blue-100 text-blue-800',
    'delivered': 'bg-green-100 text-green-800',
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              Shipment Tracking
            </h1>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[shipment.status]}`}>
                  {shipment.status}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Driver</p>
                  <p className="text-sm text-gray-500">{shipment.driver}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Vehicle</p>
                  <p className="text-sm text-gray-500">{shipment.vehicle}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Departure Time</p>
                  <p className="text-sm text-gray-500">
                    {shipment.departureTime ? format(new Date(shipment.departureTime), 'PPpp') : 'Not set'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Estimated Arrival</p>
                  <p className="text-sm text-gray-500">
                    {shipment.estimatedArrival ? format(new Date(shipment.estimatedArrival), 'PPpp') : 'Not set'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <p className="text-sm font-medium text-gray-900">Origin</p>
                </div>
                <p className="text-sm text-gray-500 ml-7">{shipment.origin.address}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <p className="text-sm font-medium text-gray-900">Destination</p>
                </div>
                <p className="text-sm text-gray-500 ml-7">{shipment.destination.address}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden">
            <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={shipment.currentLocation || defaultCenter}
                zoom={12}
              >
                {shipment.currentLocation && (
                  <Marker
                    position={shipment.currentLocation}
                    icon={{
                      url: 'https://maps.google.com/mapfiles/ms/icons/truck.png',
                      scaledSize: new google.maps.Size(32, 32),
                    }}
                  />
                )}
                {directions && <DirectionsRenderer directions={directions} />}
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      </div>

      {shipment.products && shipment.products.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Shipment Contents</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Number</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shipment.products.map((product) => (
                  <tr key={product.productId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.productId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.batchNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}