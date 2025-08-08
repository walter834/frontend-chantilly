interface UbigeoDepartment {
  id: string;
  name: string;
}

interface UbigeoProvince {
  id: string;
  name: string;
  department_id: string;
}

interface UbigeoDistrict {
  id: string;
  name: string;
  province_id: string;
}