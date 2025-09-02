'use client';
import Header from "@/components/HeaderIndi/header";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LocalService } from '@/service/local/localService';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFileAlt, FaBuilding, FaRegCheckCircle } from "react-icons/fa";
import { createComplaint, getNextNumber } from '@/service/reclamacion/claimService';
import { CustomAlert } from '@/components/ui/custom-alert';
import Loading from '../checkout/components/loading';
import { useAuth } from "@/hooks/useAuth";
import Select from 'react-select'

interface ComplaintFormData {
    number_complaint: string;
    local_id: number;
    customer_name: string;
    customer_lastname: string;
    dni_ruc: string;
    department: string;
    province: string;
    district: string;
    address: string;
    email: string;
    phone: string;
    parent_data: string;
    well_hired: 'Producto' | 'Servicio';
    amount: string;
    description: string;
    type_complaint: 'Reclamo' | 'Queja';
    detail_complaint: string;
    order: string;
    date_complaint: string;
    observations: string;
    path_evidence: File[];
    path_customer_signature: File | null;
    signaturePreview?: string;
}

type Local = {
    id: number;
    name: string;
};

export default function LibroReclamaciones() {
    const router = useRouter();
    const fechaActual = new Date().toISOString().split('T')[0];
    const [locals, setLocals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated, customerId, name, lastname, email, phone, address, documentNumber } = useAuth();
    const [confirmData, setConfirmData] = useState(false);

    useEffect(() => {
        const fetchLocals = async () => {
            try {
                const data = await LocalService.getLocalsAll();
                const options = data.map((local: any) => ({
                    value: local.id,
                    label: local.name,
                }));
                setLocals(options);
            } catch (error) {
                console.error('Error fetching locals:', error);
            }
        };

        if (isAuthenticated && customerId) {
            formData.customer_name = name;
            formData.customer_lastname = lastname;
            formData.dni_ruc = documentNumber;
            formData.email = email;
            formData.phone = phone;
            formData.address = address;

        }

        fetchLocals();

    }, [isAuthenticated, customerId]);

    useEffect(() => {
        const fetchNextNumber = async () => {
            try {
                const data = await getNextNumber();
                setFormData(prev => ({ ...prev, number_complaint: data.number_complaint }));
            } catch (error) {
                console.error('Error fetching next number:', error);
            }
        };

        fetchNextNumber();
    }, []);

    const [formData, setFormData] = useState<ComplaintFormData>({
        number_complaint: '',
        local_id: 0,
        customer_name: '',
        customer_lastname: '',
        dni_ruc: '',
        department: 'Lima',
        province: 'Lima',
        district: '',
        address: '',
        email: '',
        phone: '',
        parent_data: '',
        well_hired: 'Producto',
        amount: '',
        description: '',
        type_complaint: 'Reclamo',
        detail_complaint: '',
        order: '',
        date_complaint: new Date().toISOString().split('T')[0],
        observations: '',
        path_evidence: [],
        path_customer_signature: null,
        signaturePreview: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | any, { name, value }: { name?: string; value?: any } = {}) => {
        if (e && e.value !== undefined) {
            setFormData(prev => ({ ...prev, [e.name]: e.value }));
        } 
        else if (e && e.target) {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        else if (name && value !== undefined) {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFormData(prev => ({
                ...prev,
                path_evidence: [file]
            }));
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const formDataToSend = new FormData();
        console.log(formData);

        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'path_evidence' && value.length > 0) {
                formDataToSend.append('path_evidence', value[0]);
            } else if (key === 'path_customer_signature' && value) {
                formDataToSend.append('path_customer_signature', value as File);
            } else if (key === 'amount') {
                formDataToSend.append(key, parseFloat(value as string).toString() || '0');
            } else if (value !== '' && value !== null && value !== undefined && key !== 'signaturePreview') {
                formDataToSend.append(key, value as string);
            }
        });

        try {
            const response = await createComplaint(formDataToSend);
            CustomAlert('Reclamo enviado exitosamente. Verifica tu correo', 'success', 'bottom-right');
            setConfirmData(true);
        } catch (error) {
            CustomAlert('Error al enviar el reclamo', 'error', 'bottom-right');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            {isLoading && <Loading text="Enviando reclamo..." />}
            <main className="bg-gray-50 z-0 py-8">
                <div className="container mx-auto px-4">
                    {!confirmData ? (
                        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="bg-[#c41c1a] text-white py-4 px-6">
                                <h1 className="text-2xl font-bold">Libro de Reclamaciones</h1>
                                <p className="text-sm opacity-90">Todos los campos son obligatorios (*)</p>
                            </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-[#c41c1a] border-b-2 border-[#c41c1a] pb-2 mb-4">
                                    <FaBuilding className="inline mr-2" />
                                    Datos generales
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha">Fecha</label>
                                        <input type="date" id="fecha" name="fecha" value={fechaActual} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#c41c1a] focus:border-transparent" disabled />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numeroHoja">Hoja de reclamación</label>
                                        <input type="text" id="numeroHoja" name="numeroHoja" value={formData.number_complaint} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#c41c1a] focus:border-transparent" disabled />
                                    </div>
                                    <div>
                                        <label htmlFor="proveedor" className="block text-gray-700 text-sm font-bold mb-2">Proveedor</label>
                                        <p><b>Razón Social:</b>COMERCIALIZADORA AR LA CASA DEL CHANTILLY S.A.C</p>
                                        <p><b>RUC:</b> 20552150148</p>
                                        <p><b>Dirección fiscal:</b> Lote. 176 Int. 2b Fnd. Chacra Cerro (a 3 Cdras Parad Acuario Av Universitaria)</p>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <label htmlFor="local_id" className="block text-gray-700 text-sm font-bold mb-2">Establecimiento *</label>
                                            <Select
                                                name="local_id"
                                                placeholder="Seleccione un establecimiento"
                                                options={locals} 
                                                onChange={(selectedOption) => handleChange({ 
                                                    name: 'local_id', 
                                                    value: selectedOption?.value 
                                                })}
                                            />
                                </div>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-[#c41c1a] border-b-2 border-[#c41c1a] pb-2 mb-4">
                                    <FaUser className="inline mr-2" />
                                    Datos del Reclamante
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dni_ruc">
                                            DNI/RUC *
                                        </label>
                                        <input
                                            type="text"
                                            id="dni_ruc"
                                            name="dni_ruc"
                                            value={formData.dni_ruc}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#c41c1a] focus:border-transparent"
                                            required
                                            placeholder="Ingrese DNI o RUC"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customer_name">
                                            Nombres *
                                        </label>
                                        <input
                                            type="text"
                                            id="customer_name"
                                            name="customer_name"
                                            value={formData.customer_name}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#c41c1a] focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customer_lastname">
                                            Apellidos *
                                        </label>
                                        <input
                                            type="text"
                                            id="customer_lastname"
                                            name="customer_lastname"
                                            value={formData.customer_lastname}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#c41c1a] focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                            Correo Electrónico *
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                <FaEnvelope className="text-gray-400" />
                                            </span>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full pl-10 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#c41c1a] focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                                            Teléfono / Celular *
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                <FaPhone className="text-gray-400" />
                                            </span>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full pl-10 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#c41c1a] focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                                            Dirección (Calle, Número, Dpto, etc.) *
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                <FaMapMarkerAlt className="text-gray-400" />
                                            </span>
                                            <input
                                                type="text"
                                                id="address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="w-full pl-10 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#c41c1a] focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="parent_data">Datos del apoderado (si es menor de edad)</label>
                                        <textarea
                                            placeholder="Nombre/Domicilio/Celular/Correo"
                                            id="parent_data"
                                            name="parent_data"
                                            value={formData.parent_data}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#c41c1a] focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-[#c41c1a] border-b-2 border-[#c41c1a] pb-2 mb-4">
                                    <FaFileAlt className="inline mr-2" />
                                    Detalles de la Reclamación
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <p className="block text-gray-700 text-sm font-bold mb-3">Tipo de bien contratado *</p>
                                        <div className="flex flex-wrap gap-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="well_hired"
                                                    value="Producto"
                                                    checked={formData.well_hired === 'Producto'}
                                                    onChange={handleChange}
                                                    className="text-[#c41c1a] focus:ring-[#c41c1a]"
                                                    required
                                                />
                                                <span className="ml-2">Producto</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="well_hired"
                                                    value="Servicio"
                                                    checked={formData.well_hired === 'Servicio'}
                                                    onChange={handleChange}
                                                    className="text-[#c41c1a] focus:ring-[#c41c1a]"
                                                />
                                                <span className="ml-2">Servicio</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                            Descripción del {formData.well_hired === 'Producto' ? 'Producto' : 'Servicio'} *
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#c41c1a] focus:border-transparent"
                                            required
                                            placeholder={`Describa el ${formData.well_hired === 'Producto' ? 'producto' : 'servicio'} por el que presenta esta reclamación`}
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="detail_complaint">
                                            Detalle del Reclamo *
                                        </label>
                                        <textarea
                                            id="detail_complaint"
                                            name="detail_complaint"
                                            value={formData.detail_complaint}
                                            onChange={handleChange}
                                            rows={5}
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#c41c1a] focus:border-transparent"
                                            required
                                            placeholder="Describa con el mayor detalle posible los hechos que originan su reclamo, indicando fechas, lugares, personas con las que se contactó, etc."
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="order">
                                            Número de Pedido *
                                        </label>
                                        <input
                                            type="text"
                                            id="order"
                                            name="order"
                                            required
                                            value={formData.order}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#c41c1a] focus:border-transparent"
                                            placeholder="Ingrese el número de pedido si aplica"
                                        />
                                    </div>

                                    <div className="w-full md:w-1/2">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                                            Monto (S/) *
                                        </label>
                                        <input
                                            type="number"
                                            id="amount"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleChange}
                                            min="0"
                                            step="0.01"
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#c41c1a] focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div className="w-full md:w-1/2">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date_complaint">
                                            Fecha del Reclamo *
                                        </label>
                                        <input
                                            type="date"
                                            id="date_complaint"
                                            name="date_complaint"
                                            value={formData.date_complaint}
                                            onChange={handleChange}
                                            max={new Date().toISOString().split('T')[0]}
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#c41c1a] focus:border-transparent"
                                            required
                                            disabled
                                        />
                                    </div>

                                    <div>
                                        <p className="block text-gray-700 text-sm font-bold mb-3">Tipo de Reclamo *</p>
                                        <div className="flex flex-wrap gap-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="type_complaint"
                                                    value="Reclamo"
                                                    checked={formData.type_complaint === 'Reclamo'}
                                                    onChange={handleChange}
                                                    className="text-[#c41c1a] focus:ring-[#c41c1a]"
                                                    required
                                                />
                                                <span className="ml-2">Reclamo</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="type_complaint"
                                                    value="Queja"
                                                    checked={formData.type_complaint === 'Queja'}
                                                    onChange={handleChange}
                                                    className="text-[#c41c1a] focus:ring-[#c41c1a]"
                                                />
                                                <span className="ml-2">Queja</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="observations">
                                            Observaciones *
                                        </label>
                                        <textarea
                                            id="observations"
                                            name="observations"
                                            value={formData.observations}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#c41c1a] focus:border-transparent"
                                            required
                                            placeholder="Ingrese cualquier observación adicional sobre su reclamo"
                                        ></textarea>
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="path_evidence" className="block text-gray-700 mb-2">
                                            Evidencia (1 imagen)
                                            {formData.path_evidence.length > 0 && (
                                                <span className="text-green-600 text-sm ml-2">
                                                    ✓ Imagen cargada
                                                </span>
                                            )}
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                                            {formData.path_evidence.length > 0 ? (
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-700 truncate">
                                                        {formData.path_evidence[0].name}
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({
                                                            ...prev,
                                                            path_evidence: []
                                                        }))}
                                                        className="text-red-500 hover:text-red-700 text-sm mt-2 flex items-center justify-center mx-auto"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        Cambiar imagen
                                                    </button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="text-gray-500 mb-2">Arrastra una imagen o haz clic para seleccionar</p>
                                                    <input
                                                        type="file"
                                                        id="path_evidence"
                                                        name="path_evidence"
                                                        className="hidden"
                                                        onChange={handleFileChange}
                                                        accept=".jpg,.jpeg,.png"
                                                    />
                                                    <label
                                                        htmlFor="path_evidence"
                                                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer inline-block"
                                                    >
                                                        Seleccionar imagen
                                                    </label>
                                                    <p className="text-xs text-gray-500 mt-2">Formatos: JPG, PNG (Máx. 5MB)</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 mb-2">Firma del Cliente *</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                                            {formData.path_customer_signature ? (
                                                <div className="mt-2">
                                                    <p className="text-green-600 text-sm mb-2">Firma cargada correctamente</p>
                                                    <div className="flex items-center justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData(prev => {
                                                                    if (prev.signaturePreview) {
                                                                        URL.revokeObjectURL(prev.signaturePreview);
                                                                    }
                                                                    return {
                                                                        ...prev,
                                                                        path_customer_signature: null,
                                                                        signaturePreview: ''
                                                                    };
                                                                });
                                                            }}
                                                            className="text-red-500 hover:text-red-700 text-sm flex items-center"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                            Eliminar firma
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="text-gray-500 mb-2">Suba una imagen de su firma</p>
                                                    <input
                                                        type="file"
                                                        id="path_customer_signature"
                                                        name="path_customer_signature"
                                                        accept=".jpg,.jpeg,.png,.webp"
                                                        className="hidden"
                                                        required
                                                        onChange={(e) => {
                                                            if (e.target.files && e.target.files[0]) {
                                                                const file = e.target.files[0];
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    path_customer_signature: file,
                                                                    signaturePreview: URL.createObjectURL(file)
                                                                }));
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor="path_customer_signature"
                                                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer inline-block"
                                                    >
                                                        Seleccionar archivo de firma
                                                    </label>
                                                    <p className="text-xs text-gray-500 mt-2">Formatos aceptados: JPG, JPEG, PNG, WEBP (Máx. 5MB)</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
                                <button
                                    type="button"
                                    onClick={() => router.push('/')}
                                    className="px-6 py-2 bg-gray-300 text-white rounded hover:bg-gray-400 transition-colors cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-[#c41c1a] text-white rounded hover:bg-[#a01818] transition-colors cursor-pointer"
                                >
                                    Enviar Reclamo
                                </button>
                            </div>
                        </form>
                    </div>
                    ) : (
                    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden al">
                        <div className="bg-[#c41c1a] text-white py-4 px-6">
                            <h1 className="text-2xl font-bold">Reclamo</h1>
                            <p className="text-sm opacity-90">Gracias por tu reclamo, pronto nos pondremos en contacto contigo.</p>
                            <p className="text-sm opacity-90">revisa tu <b>correo electronico</b> para confirmar tu reclamo</p>
                        </div>
                        <div className="p-6 flex justify-center">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center justify-center ">
                                    <FaRegCheckCircle className="text-green-600 text-4xl mb-4" />
                                </div>
                                <div className="flex items-center justify-center gap-4 text-gray-600 text-2xl mb-4 font-semibold">
                                    <p>Numero de reclamo: </p>
                                    <p className="text-black font-bold"> {formData.number_complaint}</p>
                                </div>
                                <div className="flex items-center justify-center ">
                                    <button
                                        type="button"
                                        onClick={() => router.push('/')}
                                        className="px-6 py-2 bg-gray-300 text-white rounded hover:bg-gray-400 transition-colors cursor-pointer"
                                    >
                                        Volver al inicio
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                    )}
                </div>

            </main>
        </>
    );
}