interface Local {
  id: number;
  name: string;
  image: string;
  address: string;
  department: string;
  province: string;
  district: string;
  start_time: string;
  end_time: string;
  link_local: string;
  latitud: string;
  longitud: string;
  company_id: number | null;
  distance: number;
}

interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

 interface GeolocationError {
  code: number;
  message: string;
}