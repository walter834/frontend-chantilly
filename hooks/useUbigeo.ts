import { useState, useEffect, useCallback } from 'react';
import { ubigeoINEI } from 'peru-utils';

// Interfaces para los tipos de datos que devuelve peru-utils
interface UbigeoItem {
    code: string;
    name: string;
    surfaceArea?: string;
    latitude?: string;
    longitude?: string;
}

export interface Department extends UbigeoItem {}
export interface Province extends UbigeoItem {}
export interface District extends UbigeoItem {}

export const useUbigeo = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    
    const [selectedDepartment, setSelectedDepartment] = useState<string>('');
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');

    // Cargar departamentos al inicializar
    useEffect(() => {
        try {
            const departmentList = ubigeoINEI.getDepartments() || [];
            setDepartments(departmentList.filter(Boolean) as Department[]);
        } catch (error) {
            console.error('Error loading departments:', error);
        }
    }, []);

    // Cargar provincias cuando se selecciona un departamento
    useEffect(() => {
        if (selectedDepartment) {
            try {
                const provinceList = ubigeoINEI.getProvince(selectedDepartment) || [];
                setProvinces(provinceList.filter(Boolean) as Province[]);
                setDistricts([]); // Limpiar distritos
                setSelectedProvince(''); // Limpiar selección de provincia
                setSelectedDistrict(''); // Limpiar selección de distrito
            } catch (error) {
                console.error('Error loading provinces:', error);
                setProvinces([]);
            }
        } else {
            setProvinces([]);
            setDistricts([]);
        }
    }, [selectedDepartment]);

    // Cargar distritos cuando se selecciona una provincia
    useEffect(() => {
        if (selectedProvince) {
            try {
                const districtList = ubigeoINEI.getDistrict(selectedProvince) || [];
                setDistricts(districtList.filter(Boolean) as District[]);
                setSelectedDistrict(''); // Limpiar selección de distrito
            } catch (error) {
                console.error('Error loading districts:', error);
                setDistricts([]);
            }
        } else {
            setDistricts([]);
        }
    }, [selectedProvince]);

    const handleDepartmentChange = useCallback((departmentCode: string) => {
        setSelectedDepartment(departmentCode);
    }, []);

    const handleProvinceChange = useCallback((provinceCode: string) => {
        setSelectedProvince(provinceCode);
    }, []);

    const handleDistrictChange = useCallback((districtCode: string) => {
        setSelectedDistrict(districtCode);
    }, []);

    const getDepartmentName = useCallback((code: string) => {
        return departments.find(dept => dept.code === code)?.name || '';
    }, [departments]);

    const getProvinceName = useCallback((code: string) => {
        return provinces.find(prov => prov.code === code)?.name || '';
    }, [provinces]);

    const getDistrictName = useCallback((code: string) => {
        return districts.find(dist => dist.code === code)?.name || '';
    }, [districts]);

    // Funciones para buscar códigos por nombres
    const getDepartmentCode = useCallback((name: string) => {
        return departments.find(dept => dept.name === name)?.code || '';
    }, [departments]);

    const getProvinceCode = useCallback((name: string) => {
        return provinces.find(prov => prov.name === name)?.code || '';
    }, [provinces]);

    const getDistrictCode = useCallback((name: string) => {
        return districts.find(dist => dist.name === name)?.code || '';
    }, [districts]);

    // Función para inicializar el ubigeo con nombres existentes
    const setUbigeoByNames = useCallback(async (departmentName: string, provinceName?: string, districtName?: string) => {
        if (departmentName && departments.length > 0) {
            const deptCode = departments.find(dept => dept.name === departmentName)?.code;
            if (deptCode) {
                setSelectedDepartment(deptCode);
                
                // Cargar provincias para este departamento
                try {
                    const provinceList = ubigeoINEI.getProvince(deptCode) || [];
                    const filteredProvinces = provinceList.filter(Boolean) as Province[];
                    setProvinces(filteredProvinces);
                      if (provinceName && filteredProvinces.length > 0) {
                        const provCode = filteredProvinces.find(prov => prov.name === provinceName)?.code;
                        if (provCode) {
                            setSelectedProvince(provCode);
                            
                            // Cargar distritos para esta provincia
                            try {
                                const districtList = ubigeoINEI.getDistrict(provCode) || [];
                                const filteredDistricts = districtList.filter(Boolean) as District[];
                                setDistricts(filteredDistricts);
                                
                                if (districtName && filteredDistricts.length > 0) {
                                    const distCode = filteredDistricts.find(dist => dist.name === districtName)?.code;
                                    if (distCode) {
                                        setSelectedDistrict(distCode);
                                    }
                                }
                            } catch (error) {
                                console.error('Error loading districts:', error);
                                setDistricts([]);
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error loading provinces:', error);
                    setProvinces([]);
                }
            }
        }
    }, [departments]);

    const reset = useCallback(() => {
        setSelectedDepartment('');
        setSelectedProvince('');
        setSelectedDistrict('');
        setProvinces([]);
        setDistricts([]);
    }, []);

    return {
        // Datos
        departments,
        provinces,
        districts,
        
        // Selecciones actuales
        selectedDepartment,
        selectedProvince,
        selectedDistrict,
        
        // Manejadores de cambio
        handleDepartmentChange,
        handleProvinceChange,
        handleDistrictChange,
        
        // Utilidades
        getDepartmentName,
        getProvinceName,
        getDistrictName,
        getDepartmentCode,
        getProvinceCode,
        getDistrictCode,
        setUbigeoByNames,
        reset
    };
};