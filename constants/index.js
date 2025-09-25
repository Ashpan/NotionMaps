export const TORONTO_CENTER = {
  lat: 43.651432,
  lng: -79.389569,
};

export const SERVER_OPTIONS = () => {
  return {
    method: "GET",
    url: `/api/locations`,
  };
};

export const DB_CONFIG_OPTIONS = () => {
  return {
    method: "GET",
    url: `/api/filters`,
  };
};
