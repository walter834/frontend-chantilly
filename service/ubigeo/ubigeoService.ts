
// Datos estáticos de departamentos del Perú
const DEPARTMENTS: UbigeoDepartment[] = [
  { id: '01', name: 'Amazonas' },
  { id: '02', name: 'Áncash' },
  { id: '03', name: 'Apurímac' },
  { id: '04', name: 'Arequipa' },
  { id: '05', name: 'Ayacucho' },
  { id: '06', name: 'Cajamarca' },
  { id: '07', name: 'Callao' },
  { id: '08', name: 'Cusco' },
  { id: '09', name: 'Huancavelica' },
  { id: '10', name: 'Huánuco' },
  { id: '11', name: 'Ica' },
  { id: '12', name: 'Junín' },
  { id: '13', name: 'La Libertad' },
  { id: '14', name: 'Lambayeque' },
  { id: '15', name: 'Lima' },
  { id: '16', name: 'Loreto' },
  { id: '17', name: 'Madre de Dios' },
  { id: '18', name: 'Moquegua' },
  { id: '19', name: 'Pasco' },
  { id: '20', name: 'Piura' },
  { id: '21', name: 'Puno' },
  { id: '22', name: 'San Martín' },
  { id: '23', name: 'Tacna' },
  { id: '24', name: 'Tumbes' },
  { id: '25', name: 'Ucayali' },
];

// Datos estáticos de provincias (principales)
const PROVINCES: UbigeoProvince[] = [
  // Lima
  { id: '1501', name: 'Lima', department_id: '15' },
  { id: '1502', name: 'Barranca', department_id: '15' },
  { id: '1503', name: 'Cajatambo', department_id: '15' },
  { id: '1504', name: 'Canta', department_id: '15' },
  { id: '1505', name: 'Cañete', department_id: '15' },
  { id: '1506', name: 'Huaral', department_id: '15' },
  { id: '1507', name: 'Huarochirí', department_id: '15' },
  { id: '1508', name: 'Huaura', department_id: '15' },
  { id: '1509', name: 'Oyón', department_id: '15' },
  { id: '1510', name: 'Yauyos', department_id: '15' },
  
  // Callao
  { id: '0701', name: 'Callao', department_id: '07' },
  
  // Arequipa
  { id: '0401', name: 'Arequipa', department_id: '04' },
  { id: '0402', name: 'Camaná', department_id: '04' },
  { id: '0403', name: 'Caravelí', department_id: '04' },
  { id: '0404', name: 'Castilla', department_id: '04' },
  { id: '0405', name: 'Caylloma', department_id: '04' },
  { id: '0406', name: 'Condesuyos', department_id: '04' },
  { id: '0407', name: 'Islay', department_id: '04' },
  { id: '0408', name: 'La Unión', department_id: '04' },
  
  // Cusco
  { id: '0801', name: 'Cusco', department_id: '08' },
  { id: '0802', name: 'Acomayo', department_id: '08' },
  { id: '0803', name: 'Anta', department_id: '08' },
  { id: '0804', name: 'Calca', department_id: '08' },
  { id: '0805', name: 'Canas', department_id: '08' },
  { id: '0806', name: 'Canchis', department_id: '08' },
  { id: '0807', name: 'Chumbivilcas', department_id: '08' },
  { id: '0808', name: 'Espinar', department_id: '08' },
  { id: '0809', name: 'La Convención', department_id: '08' },
  { id: '0810', name: 'Paruro', department_id: '08' },
  { id: '0811', name: 'Paucartambo', department_id: '08' },
  { id: '0812', name: 'Quispicanchi', department_id: '08' },
  { id: '0813', name: 'Urubamba', department_id: '08' },
];

// Datos estáticos de distritos (principales de Lima)
const DISTRICTS: UbigeoDistrict[] = [
  // Lima Metropolitana
  { id: '150101', name: 'Lima', province_id: '1501' },
  { id: '150102', name: 'Ancón', province_id: '1501' },
  { id: '150103', name: 'Ate', province_id: '1501' },
  { id: '150104', name: 'Barranco', province_id: '1501' },
  { id: '150105', name: 'Breña', province_id: '1501' },
  { id: '150106', name: 'Carabayllo', province_id: '1501' },
  { id: '150107', name: 'Chaclacayo', province_id: '1501' },
  { id: '150108', name: 'Chorrillos', province_id: '1501' },
  { id: '150109', name: 'Cieneguilla', province_id: '1501' },
  { id: '150110', name: 'Comas', province_id: '1501' },
  { id: '150111', name: 'El Agustino', province_id: '1501' },
  { id: '150112', name: 'Independencia', province_id: '1501' },
  { id: '150113', name: 'Jesús María', province_id: '1501' },
  { id: '150114', name: 'La Molina', province_id: '1501' },
  { id: '150115', name: 'La Victoria', province_id: '1501' },
  { id: '150116', name: 'Lince', province_id: '1501' },
  { id: '150117', name: 'Los Olivos', province_id: '1501' },
  { id: '150118', name: 'Lurigancho', province_id: '1501' },
  { id: '150119', name: 'Lurin', province_id: '1501' },
  { id: '150120', name: 'Magdalena del Mar', province_id: '1501' },
  { id: '150121', name: 'Magdalena Vieja', province_id: '1501' },
  { id: '150122', name: 'Miraflores', province_id: '1501' },
  { id: '150123', name: 'Pachacámac', province_id: '1501' },
  { id: '150124', name: 'Pucusana', province_id: '1501' },
  { id: '150125', name: 'Puente Piedra', province_id: '1501' },
  { id: '150126', name: 'Punta Hermosa', province_id: '1501' },
  { id: '150127', name: 'Punta Negra', province_id: '1501' },
  { id: '150128', name: 'Rímac', province_id: '1501' },
  { id: '150129', name: 'San Bartolo', province_id: '1501' },
  { id: '150130', name: 'San Borja', province_id: '1501' },
  { id: '150131', name: 'San Isidro', province_id: '1501' },
  { id: '150132', name: 'San Juan de Lurigancho', province_id: '1501' },
  { id: '150133', name: 'San Juan de Miraflores', province_id: '1501' },
  { id: '150134', name: 'San Luis', province_id: '1501' },
  { id: '150135', name: 'San Martín de Porres', province_id: '1501' },
  { id: '150136', name: 'San Miguel', province_id: '1501' },
  { id: '150137', name: 'Santa Anita', province_id: '1501' },
  { id: '150138', name: 'Santa María del Mar', province_id: '1501' },
  { id: '150139', name: 'Santa Rosa', province_id: '1501' },
  { id: '150140', name: 'Santiago de Surco', province_id: '1501' },
  { id: '150141', name: 'Surquillo', province_id: '1501' },
  { id: '150142', name: 'Villa El Salvador', province_id: '1501' },
  { id: '150143', name: 'Villa María del Triunfo', province_id: '1501' },
  
  // Callao
  { id: '070101', name: 'Callao', province_id: '0701' },
  { id: '070102', name: 'Bellavista', province_id: '0701' },
  { id: '070103', name: 'Carmen de la Legua Reynoso', province_id: '0701' },
  { id: '070104', name: 'La Perla', province_id: '0701' },
  { id: '070105', name: 'La Punta', province_id: '0701' },
  { id: '070106', name: 'Ventanilla', province_id: '0701' },
  { id: '070107', name: 'Mi Perú', province_id: '0701' },
];

/**
 * Simular una llamada asíncrona para obtener departamentos
 */
export const getPeruvianDepartments = async (): Promise<UbigeoDepartment[]> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 100));
  return DEPARTMENTS;
};

/**
 * Obtener provincias de un departamento específico
 */
export const getPeruvianProvinces = async (departmentId: string): Promise<UbigeoProvince[]> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (!departmentId) return [];
  
  return PROVINCES.filter(province => province.department_id === departmentId);
};

/**
 * Obtener distritos de una provincia específica
 */
export const getPeruvianDistricts = async (provinceId: string): Promise<UbigeoDistrict[]> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (!provinceId) return [];
  
  return DISTRICTS.filter(district => district.province_id === provinceId);
};

/**
 * Buscar ubicación por nombre (útil para autocompletado)
 */
export const searchLocation = async (query: string) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  try {
    const filteredDepts = DEPARTMENTS.filter(dept => 
      dept.name.toLowerCase().includes(query.toLowerCase())
    );
    
    return {
      departments: filteredDepts,
    };
  } catch (error) {
    console.error('Error en búsqueda:', error);
    return { departments: [] };
  }
};