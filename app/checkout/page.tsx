'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FaMagnifyingGlass, FaPencil } from "react-icons/fa6";
import Header from "./components/header";
import { useRouter } from 'next/navigation';
import { store } from '@/store/store';
import { useEffect, useState } from 'react';
import { getCustomerById, updateCustomer } from '@/service/customerService';
import { TransformedCustomer } from '@/types/api';
import Loading from './components/loading';
import { LocalService } from '@/service/local/localService';
import { CustomAlert } from '@/components/ui/custom-alert';
import PayButtom from './components/payButtom';

type FormData = {
    name: string;
    lastname: string;
    address: string;
    phone: string;
    id_document_type: number;
    document_number: string;
};

type TextKeys = 'name' | 'lastname' | 'address' | 'phone' | 'document_number';

export default function Contact() {
    const customer = store.getState().auth.customer;
    const [isClickEdit, setIsClickEdit] = useState(false);
    const [isClickFact, setIsClickFact] = useState(false);
    const [voucherType, setVoucherType] = useState('BOLETA');
    const [listShopping, setListShopping] = useState([]);
    const [ruc, setRuc] = useState('');
    const [razonSocial, setRazonSocial] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [loadingText, setLoadingText] = useState('');
    const [customerData, setCustomerData] = useState<TransformedCustomer | null>(null);
    const [form, setForm] = useState<FormData>({
        name: '',
        lastname: '',
        address: '',
        phone: '',
        id_document_type: 0,
        document_number: '',
    });
    const [locals, setLocals] = useState<Local[]>([]);
    const [loadingLocals, setLoadingLocals] = useState(false);
    const [localsError, setLocalsError] = useState<string | null>(null);
    const [localSelected, setLocalSelected] = useState<Local | null>(null);
    const [termsChecked, setTermsChecked] = useState(false);
    const [conditionsChecked, setConditionsChecked] = useState(false);
    const [cartChecked, setCartChecked] = useState(false);

    // Redirigir solo cuando ya intentamos cargar el carrito
    useEffect(() => {
        console.log('listShopping', listShopping)
        if (!cartChecked) return;
        if (Array.isArray(listShopping) && listShopping.length === 0) {
            router.replace('/');
        }
    }, [cartChecked, listShopping, router]);
    
    const arrayOrder = {
        "customer_id": customer?.id,
        "voucher_type": voucherType,
        "local_id": localSelected?.id,
        "subtotal": listShopping.reduce((total: number, item: any) => total + item.product.price * item.quantity, 0),
        "total_amount": listShopping.reduce((total: number, item: any) => total + item.product.price * item.quantity, 0),
        "billing_data": {
            "ruc": voucherType === 'BOLETA' ? '' : ruc,
            "razon_social": voucherType === 'BOLETA' ? '' : razonSocial || '',
            "tax_address": voucherType === 'BOLETA' ? '' : address || '',
        },
        "items": listShopping,
    };

    const getMapEmbedUrl = (local: Local): string | null => {
        if (!local) return null;
        const lat = (local.latitud || '').toString().trim();
        const lng = (local.longitud || '').toString().trim();

        if (lat && lng) {
            return `https://www.google.com/maps?q=${encodeURIComponent(lat)},${encodeURIComponent(lng)}&z=15&output=embed`;
        }

        if (local.link_local) {
            try {
                const url = new URL(local.link_local);
                const isGoogleMaps = /(^|\.)google\.(com|[a-z]{2})(\.[a-z]{2})?$/i.test(url.hostname) && url.pathname.startsWith('/maps');
                if (isGoogleMaps) {
                    if (!url.searchParams.has('output')) {
                        url.searchParams.set('output', 'embed');
                    }
                    return url.toString();
                }
                return local.link_local;
            } catch {
                return null;
            }
        }

        return null;
    };

    useEffect(() => {
        let active = true;
        const load = async () => {
            setLoading(true);
            setLoadingText('Cargando datos del cliente...');
            try {
                const data = await getCustomerById(customer?.id?.toString() || '');
                if (!active) return;
                setCustomerData(data);
                if (data) {
                    setForm({
                        name: data.name ?? '',
                        lastname: data.lastname ?? '',
                        address: data.address ?? '',
                        phone: data.phone ?? '',
                        id_document_type: data.id_document_type ?? 0,
                        document_number: data.document_number ?? '',
                    });
                }
            } finally {
                if (active) setLoading(false);
            }
        };
        load();
        return () => {
            active = false;
        };
    }, [customer?.id]);

    useEffect(() => {
        let active = true;
        const run = async () => {
            try {
                setLoadingLocals(true);
                setLocalsError(null);
                const data = await LocalService.findNearbyLocals();
                if (active) setLocals(data);
            } catch (e: any) {
                if (active) setLocalsError(e?.message || 'No se pudo obtener los locales.');
            } finally {
                if (active) setLoadingLocals(false);
            }
        };
        run();
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        const loadCart = () => {
            const savedCart = localStorage.getItem('chantilly-cart');
            if (savedCart) {
                const parsed = JSON.parse(savedCart);
                setListShopping(parsed?.items || []);
            }
            // Marcar que ya intentamos cargar el carrito al menos una vez
            setCartChecked(true);
        };

        loadCart();

        const handleStorageChange = () => loadCart();
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement & { name: TextKeys }>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setForm((prev) => ({ ...prev, id_document_type: Number(value) }));
    };

    const handleEditClick = () => {
        setIsClickEdit(true);
    };

    const handleLocalSelect = (local: Local) => {
        setLocalSelected(local);
    };

    const handleConfirmData = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingText('Actualizando datos...');
        setLoading(true);
        try {
            await updateCustomer(customer?.id?.toString() || '', form);
            setIsClickEdit(false);
            CustomAlert('Datos actualizados exitosamente', 'success', 'bottom-right');
        } catch (error) {
            console.error('Error updating customer:', error);
            CustomAlert('Error al actualizar los datos', 'error', 'bottom-right')
        } finally {
            setLoading(false);
        }
    };

    const searchCompany = async () => {
        if (!ruc) {
            CustomAlert('Ingresa un RUC para buscar', 'error', 'bottom-right');
            return;
        }
        setLoadingText('Buscando...');
        setLoading(true);
        const url = `/api/sunat?ruc=${encodeURIComponent(ruc)}`;
        try {
            const response = await fetch(url);
            const resultado = await response.json();
            console.log(resultado);
            if (resultado !== 'No se ha encontrado el RUC consultado') {
                setRuc(resultado.ruc);
                setRazonSocial(resultado.razonSocial);
                setAddress(resultado.direccion);
                CustomAlert('Empresa encontrada', 'success', 'bottom-right');
            } else {
                setRuc('');
                setRazonSocial('');
                setAddress('');
                CustomAlert(resultado, 'error', 'bottom-right');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const total = (listShopping as any[]).reduce((sum, item) => sum + ((item?.price || 0) * (item?.quantity || 0)), 0);
    return (
        <>
            {loading && <Loading text={loadingText} />}
            <Header />
            <main>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 sm:px-6 lg:px-24 pb-24'>
                    <div className='pl-5 pr-5 pt-5 bg-white'>
                        <h1 className='text-[25px] font-bold text-black mb-5'>Confirma y paga tu compra</h1>
                        <div className='flex justify-center mb-2 bg-[#c41c1a] p-2'>
                            <h2 className='text-[18px] font-bold text-white'>Datos del Cliente</h2>
                        </div>
                        <div className='border-b-2 border-[#c41c1a] pt-3'>
                            <h2 className='text-[18px] font-bold text-[#c41c1a]'>DATOS PERSONALES</h2>
                        </div>
                        <div className='pb-5 pt-2 font-bold text-[15px]'>
                            Solicitamos unicamente la información esencial para la finalización de la compra
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            <div className='grid grid-cols-1'>
                                <label htmlFor="name">Nombres (obligatorio)</label>
                                <input disabled={!isClickEdit} className={`w-full py-2 pl-2 pr-2 rounded border-2 border-[#c41c1a] ${!isClickEdit ? 'text-gray-500' : 'text-black'}`} type="text" name="name" id="name" placeholder="Nombres" value={form.name} onChange={handleChange} />
                            </div>
                            <div className='grid grid-cols-1'>
                                <label htmlFor="lastName">Apellidos (obligatorio)</label>
                                <input disabled={!isClickEdit} className={`w-full py-2 pl-2 pr-2 rounded border-2 border-[#c41c1a] ${!isClickEdit ? 'text-gray-500' : 'text-black'}`} type="text" name="lastname" id="lastName" placeholder="Apellidos" value={form.lastname} onChange={handleChange} />
                            </div>
                            <div className='grid grid-cols-1'>
                                <label htmlFor="address">Dirección</label>
                                <input disabled={!isClickEdit} className={`w-full py-2 pl-2 pr-2 rounded border-2 border-[#c41c1a] ${!isClickEdit ? 'text-gray-500' : 'text-black'}`} type="text" name="address" id="address" placeholder="Dirección" value={form.address} onChange={handleChange} />
                            </div>
                            <div className='grid grid-cols-1'>
                                <label htmlFor="phone">Celular (obligatorio)</label>
                                <input disabled={!isClickEdit} className={`w-full py-2 pl-2 pr-2 rounded border-2 border-[#c41c1a] ${!isClickEdit ? 'text-gray-500' : 'text-black'}`} type="tel" name="phone" id="phone" placeholder="Celular" value={form.phone} onChange={handleChange} />
                            </div>
                            <div className='grid grid-cols-1'>
                                <label htmlFor="document">Documento de identidad</label>
                                <select disabled={!isClickEdit}
                                    name="id_document_type"
                                    id="document"
                                    className={`w-full py-2 pl-2 pr-2 rounded border-2 border-[#c41c1a] ${!isClickEdit ? 'text-gray-500' : 'text-black'}`}
                                    value={form.id_document_type}
                                    onChange={handleSelectChange}
                                >
                                    <option value="1">DOCUMENTO NACIONAL DE IDENTIDAD</option>
                                    <option value="2">CARNET DE EXTRANJERIA</option>
                                    <option value="3">PASAPORTE</option>
                                    <option value="4">CARNET PTP</option>
                                </select>
                            </div>
                            <div className='grid grid-cols-1'>
                                <label htmlFor="documentNumber">Numero de documento de identidad</label>
                                <input disabled={!isClickEdit} className={`w-full py-2 pl-2 pr-2 rounded border-2 border-[#c41c1a] ${!isClickEdit ? 'text-gray-500' : 'text-black'}`} type="text" name="document_number" id="documentNumber" placeholder="Numero de documento de identidad" value={form.document_number} onChange={handleChange} />
                            </div>
                        </div>
                        <div className='flex justify-center mt-4 pb-4'>
                            {isClickEdit ? (
                                <button className='bg-[#c41c1a] text-white py-2 px-4 rounded cursor-pointer' type="submit" onClick={handleConfirmData}>Confirmar tus Datos</button>
                            ) : (
                                <a className='flex items-center gap-2 text-[#c41c1a] hover:text-[#c41c1a] cursor-pointer' onClick={handleEditClick}> <FaPencil /> Editar Datos </a>
                            )}
                        </div>

                        {/* DATOS DE FACTURACION */}

                        <div className='flex justify-center mb-2 bg-[#c41c1a] p-2'>
                            <h2 className='text-[18px] font-bold text-white'>Datos de facturación</h2>
                        </div>
                        <div className='border-b-2 border-[#c41c1a] pt-3'>
                            <h2 className='text-[18px] font-bold text-[#c41c1a]'>DOCUMENTO DE VENTA</h2>
                        </div>
                        <div className='flex flex-col sm:flex-row sm:justify-around items-start sm:items-center gap-3 sm:gap-5'>
                            <div className='pb-5 pt-2 text-[15px]'>
                                <input type="radio" name="receipt" value="receipt" id='receipt' onChange={() => { setIsClickFact(false); setVoucherType('BOLETA'); }} defaultChecked />
                                <label className="ml-2" htmlFor="receipt">BOLETA DE VENTA</label>
                            </div>
                            <div className='pb-5 pt-2 text-[15px]'>
                                <input type="radio" name="receipt" value="invoice" id='invoice' onChange={() => { setIsClickFact(true); setVoucherType('FACTURA'); }} />
                                <label className="ml-2" htmlFor="invoice">FACTURA</label>
                            </div>
                        </div>
                        {isClickFact && (
                            <>
                                <div className='border-b-2 border-[#c41c1a] pb-3'>
                                    <h2 className='text-[18px] font-bold text-black'>Datos de la Empresa</h2>
                                </div>
                                <div className='grid grid-cols-1 gap-2 pt-3'>
                                    <div className="grid grid-cols-1">
                                        <label htmlFor="ruc">RUC</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
                                            <input className="w-full py-2 pl-2 pr-2 rounded border-2 border-[#c41c1a]" type="text" name="ruc" id="ruc" placeholder="RUC" value={ruc} onChange={(e) => setRuc(e.target.value)} />
                                            <button className="bg-gray-500 text-white py-2 px-4 rounded cursor-pointer" onClick={() => searchCompany()}>
                                                <FaMagnifyingGlass />
                                            </button>
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-1'>
                                        <label htmlFor="razonSocial">Razón Social</label>
                                        <input className='w-full py-2 pl-2 pr-2 rounded border-2 border-[#c41c1a]' type="text" name="razonSocial" id="razonSocial" placeholder="Razón Social" value={razonSocial} onChange={(e) => setRazonSocial(e.target.value)} />
                                    </div>
                                    <div className='grid grid-cols-1'>
                                        <label htmlFor="address">Domicilio Fiscal</label>
                                        <input className='w-full py-2 pl-2 pr-2 rounded border-2 border-[#c41c1a]' type="text" name="address" id="address" placeholder="Domicilio Fiscal" value={address} onChange={(e) => setAddress(e.target.value)} />
                                    </div>
                                </div>
                            </>
                        )}
                        <div className='pt-5'>
                            <div className='flex justify-center mb-2 bg-[#c41c1a] p-2'>
                                <h2 className='text-[18px] font-bold text-white'>Datos para la entrega</h2>
                            </div>
                            <div className='border-b-2 border-[#c41c1a] pt-3'>
                                <h2 className='text-[18px] font-bold text-[#c41c1a]'>TIPO DE ENTREGA</h2>
                            </div>
                            <div className='flex flex-col sm:flex-row sm:justify-around items-start sm:items-center gap-3 sm:gap-5'>
                                <div className='pb-5 pt-2 text-[15px]'>
                                    <input type="radio" name="deliveryType" value="deliveryType" id='deliveryType' defaultChecked />
                                    <label className="ml-2" htmlFor="deliveryType">Recoger <b>GRATIS</b> en tienda</label>
                                </div>
                            </div>
                            <div className='pb-3'>
                                <h2 className='text-[18px] font-bold text-black'>Elige el local más cercano a ti:</h2>
                            </div>
                            {localSelected ? (
                                <div className='space-y-3 pt-2'>
                                    <div className='flex justify-between items-start'>
                                        <div>
                                            <div className='text-[#c41c1a] font-extrabold text-lg uppercase'>
                                                {localSelected.name}
                                            </div>
                                            <div className='text-black font-semibold'>
                                                {localSelected.address}
                                            </div>
                                            <div className='text-gray-700'>
                                                Lunes a Domingo de {localSelected.start_time} a {localSelected.end_time} horas
                                            </div>
                                        </div>
                                        <button
                                            type='button'
                                            className='text-[#0C37ED] underline cursor-pointer'
                                            onClick={() => setLocalSelected(null)}
                                        >
                                            Cambiar tienda
                                        </button>
                                    </div>
                                    {(() => {
                                        const embedUrl = localSelected ? getMapEmbedUrl(localSelected) : null;
                                        return embedUrl ? (
                                            <iframe
                                                src={embedUrl}
                                                width="100%"
                                                height="300"
                                                loading='lazy'
                                                referrerPolicy='no-referrer-when-downgrade'
                                                style={{ border: 0 }}
                                                allowFullScreen
                                                aria-label={`Mapa de ${localSelected?.name || 'local'}`}
                                            />
                                        ) : null;
                                    })()}
                                </div>
                            ) : (
                                <div className='grid grid-cols-1 gap-2 pt-3 scroll-y h-[450px] overflow-y-auto'>
                                    {loadingLocals && <p>Buscando locales cercanos...</p>}
                                    {localsError && <p className='text-red-600'>{localsError}</p>}
                                    {!loadingLocals && !localsError && locals.length === 0 && (
                                        <p>No se encontraron locales cercanos.</p>
                                    )}
                                    {!loadingLocals && !localsError && locals.map((local) => (
                                        <div key={local.id} className='border border-gray-300 rounded p-3 bg-[#c41c1a] cursor-pointer' onClick={() => handleLocalSelect(local)}>
                                            <div className='font-bold text-white'>{local.name}</div>
                                            <div className='text-sm text-white'>{local.address}</div>
                                            <div className='text-xs text-white'>Horario: {local.start_time} - {local.end_time}</div>
                                            {local.link_local && (
                                                <a href={local.link_local} target='_blank' rel='noreferrer' className='text-white text-sm mt-1 inline-block'>Ver en mapa</a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='p-6 bg-white'>
                        <div className='flex justify-between'>
                            <h1 className='text-[25px] font-bold text-black mb-2'>Resumen de la compra</h1>
                            <a
                                className='flex items-center gap-2 text-[#c41c1a] hover:text-[#c41c1a] cursor-pointer'
                                onClick={() => router.push('/?openCart=1')}
                            >
                                <FaPencil /> Editar carrito
                            </a>
                        </div>
                        <div className='overflow-x-auto'>
                            <table className='w-full min-w-[640px]'>
                                <thead className='bg-[#c41c1a] text-white h-12'>
                                    <tr>
                                        <th>Imagen</th>
                                        <th className='text-left'>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio S/</th>
                                        <th>Total S/</th>
                                    </tr>
                                </thead>
                                <tbody className='bg-[#f5f5f5] text-center border-b-2 border-[#c41c1a]'>
                                    {(listShopping as any[]).map((item: any) => (
                                        <tr key={item?.id} className='border-b-2 border-gray-300'>
                                            <td>
                                                {item?.product?.image ? (
                                                    <Image className='border rounded-md' src={item.product.image} alt={item?.product?.name || 'Producto'} width={150} height={150} />
                                                ) : (
                                                    <span>-</span>
                                                )}
                                            </td>
                                            <td className='text-left max-w-[200px]'>
                                                {item?.product?.name || '-'}
                                                <div className='mt-1 text-xs text-gray-700 space-y-0.5'>
                                                    {item?.product?.portion && (
                                                        <p>Porciones: {item.product.portion}</p>
                                                    )}
                                                    {item?.product?.diameter && (
                                                        <p>Diámetro: {item.product.diameter}</p>
                                                    )}
                                                    {item?.product?.cakeFlavorName && (
                                                        <p>Sabor: {item.product.cakeFlavorName}</p>
                                                    )}
                                                    {item?.product?.fillingName && (
                                                        <p>Relleno: {item.product.fillingName}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td>{item?.quantity ?? 0}</td>
                                            <td>{item?.price.toFixed(2) ?? 0.00}</td>
                                            <td>{((item?.price.toFixed(2) || 0.00) * (item?.quantity || 0)).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className='text-[#c41c1a]'>
                                    <tr className='text-[20px]'>
                                        <td colSpan={4} className="text-left font-bold pr-4">TOTAL</td>
                                        <td className="text-right font-bold">S/ {total.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                            <div className='grid grid-cols-1 gap-2 pt-3'>
                                <div className='flex items-center gap-2'>
                                    <input type="checkbox" name="terms" id="terms" onChange={(e) => setTermsChecked(e.target.checked)} />
                                    <label htmlFor="terms" className='text-[18px]'>He leído y acepto las condiciones de <Link target="_blank" href="/politicas-privacidad" className='text-[#0C37ED]'>tratamiento de datos personales</Link></label>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <input type="checkbox" name="conditions" id="conditions" onChange={(e) => setConditionsChecked(e.target.checked)} />
                                    <label htmlFor="conditions" className='text-[18px]'>He leído y acepta nuestros <Link target="_blank" href="/terminos-condiciones" className='text-[#0C37ED]'>términos y condiciones</Link></label>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-center mt-4'>
                            {termsChecked && conditionsChecked ? (
                                <PayButtom arrayOrder={arrayOrder} />
                            ) : (
                                <button type="button" className='bg-[#c41c1a]/50 text-white py-2 w-full rounded cursor-pointer' disabled>
                                    PAGAR
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );

}
