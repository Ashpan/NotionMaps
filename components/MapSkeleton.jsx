import React from 'react';

const MapSkeleton = () => {
  return (
    <div className="map-skeleton">
      {/* Control buttons skeleton */}
      <div className="skeleton-controls">
        <div className="skeleton-button"></div>
        <div className="skeleton-button"></div>
      </div>

      {/* Map area skeleton */}
      <div className="skeleton-map">
        {/* Animated pulse markers */}
        <div className="skeleton-marker skeleton-marker-1"></div>
        <div className="skeleton-marker skeleton-marker-2"></div>
        <div className="skeleton-marker skeleton-marker-3"></div>
        <div className="skeleton-marker skeleton-marker-4"></div>
        <div className="skeleton-marker skeleton-marker-5"></div>
      </div>

      {/* Loading text */}
      <div className="skeleton-loading-text">
        <div className="skeleton-text-line"></div>
        <div className="skeleton-text-line short"></div>
      </div>

      {/* Current location button skeleton */}
      <div className="skeleton-location-button"></div>
    </div>
  );
};

export default MapSkeleton;