import { useState, useEffect, useCallback } from 'react';
import {
  getPeruvianDepartments,
  getPeruvianProvinces,
  getPeruvianDistricts,
} from '@/service/ubigeo/ubigeoService';

interface UseUbigeoReturn {
  departments: UbigeoDepartment[];
  provinces: UbigeoProvince[];
  districts: UbigeoDistrict[];
  loadingDepartments: boolean;
  loadingProvinces: boolean;
  loadingDistricts: boolean;
  handleDepartmentChange: (departmentId: string) => Promise<void>;
  handleProvinceChange: (provinceId: string) => Promise<void>;
  resetProvinces: () => void;
  resetDistricts: () => void;
  resetAll: () => void;
  selectedDepartment: string;
  selectedProvince: string;
}

export const useUbigeo = (): UseUbigeoReturn => {
  const [departments, setDepartments] = useState<UbigeoDepartment[]>([]);
  const [provinces, setProvinces] = useState<UbigeoProvince[]>([]);
  const [districts, setDistricts] = useState<UbigeoDistrict[]>([]);

  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<string>('');

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setLoadingDepartments(true);
        const depts = await getPeruvianDepartments();
        setDepartments(depts);
      } catch (error) {
        console.error('Error cargando departamentos:', error);
      } finally {
        setLoadingDepartments(false);
      }
    };
    loadDepartments();
  }, []);

  const handleDepartmentChange = useCallback(async (departmentId: string): Promise<void> => {
    if (!departmentId) {
      resetProvinces();
      return;
    }

    try {
      setLoadingProvinces(true);
      setSelectedDepartment(departmentId);

      setProvinces([]);
      setDistricts([]);
      setSelectedProvince('');

      const newProvinces = await getPeruvianProvinces(departmentId);
      setProvinces(newProvinces);
    } catch (error) {
      console.error('Error cargando provincias:', error);
      setProvinces([]);
    } finally {
      setLoadingProvinces(false);
    }
  }, []);

  const handleProvinceChange = useCallback(async (provinceId: string): Promise<void> => {
    if (!provinceId) {
      resetDistricts();
      return;
    }

    try {
      setLoadingDistricts(true);
      setSelectedProvince(provinceId);

      setDistricts([]);

      const newDistricts = await getPeruvianDistricts(provinceId);
      setDistricts(newDistricts);
    } catch (error) {
      console.error('Error cargando distritos:', error);
      setDistricts([]);
    } finally {
      setLoadingDistricts(false);
    }
  }, []);

  const resetProvinces = useCallback(() => {
    setProvinces([]);
    setDistricts([]);
    setSelectedDepartment('');
    setSelectedProvince('');
  }, []);

  const resetDistricts = useCallback(() => {
    setDistricts([]);
    setSelectedProvince('');
  }, []);

  const resetAll = useCallback(() => {
    setProvinces([]);
    setDistricts([]);
    setSelectedDepartment('');
    setSelectedProvince('');
  }, []);

  return {
    departments,
    provinces,
    districts,
    loadingDepartments,
    loadingProvinces,
    loadingDistricts,
    handleDepartmentChange,
    handleProvinceChange,
    resetProvinces,
    resetDistricts,
    resetAll,
    selectedDepartment,
    selectedProvince,
  };
};
