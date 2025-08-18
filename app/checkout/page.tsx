import Image from 'next/image';
import Link from 'next/link';
import { FaMagnifyingGlass, FaPencil } from "react-icons/fa6";
import Header from "./components/header";

export default function Contact() {
    return (
        <>
            <Header />
            <main>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 pr-24 pl-24 pb-24'>
                    <div className='pl-5 pr-5 pt-5 bg-white'>
                        <h1 className='text-[25px] font-bold text-black mb-5'>Confirma y paga tu compra
                        </h1>
                        <div className='flex justify-center mb-2 bg-[#c41c1a] p-2'>
                            <h2 className='text-[18px] font-bold text-white'>Datos del Cliente</h2>
                        </div>
                        <div className='border-b-2 border-[#c41c1a] pt-3'>
                            <h2 className='text-[18px] font-bold text-[#c41c1a]'>DATOS PERSONALES</h2>
                        </div>
                        <div className='pb-5 pt-2 font-bold text-[15px]'>
                            Solicitamos unicamente la información esencial para la finalización de la compra
                        </div>
                        <div className='grid grid-cols-2 gap-2'>
                            <div className='grid grid-cols-1'>
                                <label htmlFor="name">Nombres (obligatorio)</label>
                                <input className='border-2 border-[#c41c1a]' type="text" name="name" id="name" placeholder="Nombres" />
                            </div>
                            <div className='grid grid-cols-1'>
                                <label htmlFor="lastName">Apellidos (obligatorio)</label>
                                <input className='border-2 border-[#c41c1a]' type="text" name="lastName" id="lastName" placeholder="Apellidos" />
                            </div>
                            <div className='grid grid-cols-1'>
                                <label htmlFor="address">Dirección</label>
                                <input className='border-2 border-[#c41c1a]' type="text" name="address" id="address" placeholder="Dirección" />
                            </div>
                            <div className='grid grid-cols-1'>
                                <label htmlFor="phone">Celular (obligatorio)</label>
                                <input className='border-2 border-[#c41c1a]' type="tel" name="phone" id="phone" placeholder="Celular" />
                            </div>
                            <div className='grid grid-cols-1'>
                                <label htmlFor="document">Documento de identidad</label>
                                <select name="document" id="document" className='border-2 border-[#c41c1a]'>
                                    <option value="CC">DOCUMENTO NACIONAL DE IDENTIDAD</option>
                                    <option value="CE">CARNET DE EXTRANJERIA</option>
                                    <option value="TI">PASAPORTE</option>
                                    <option value="TI">CARNET PTP</option>
                                </select>
                            </div>
                            <div className='grid grid-cols-1'>
                                <label htmlFor="documentNumber">Numero de documento de identidad</label>
                                <input className='border-2 border-[#c41c1a]' type="text" name="documentNumber" id="documentNumber" placeholder="Numero de documento de identidad" />
                            </div>
                        </div>
                        <div className='flex justify-center mt-4'>
                            <button className='bg-[#c41c1a] text-white py-2 px-4 rounded cursor-pointer'>Confirmar tus datos</button>
                        </div>
                    </div>
                    <div className='p-6 bg-white'>
                        <div className='flex justify-between'>
                            <h1 className='text-[25px] font-bold text-black mb-2'>Resumen de la compra</h1>
                            <a href="#" className='flex items-center gap-2 text-[#c41c1a] hover:text-[#c41c1a]'> <FaPencil /> Editar carrito </a>
                        </div>
                        <div>
                            <table className='w-full'>
                                <thead className='bg-[#c41c1a] text-white h-12'>
                                    <tr>
                                        <th>Imagen</th>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio S/</th>
                                        <th>Total S/</th>
                                    </tr>
                                </thead>
                                <tbody className='bg-[#f5f5f5] text-center border-b-2 border-[#c41c1a]'>
                                    <tr>
                                        <td><Image src="/logo.png" alt="logo" width={50} height={50} /></td>
                                        <td className='text-left max-w-[200px]'>TORTA BAUTIZO NIÑO CELESTE CON NUBES
                                            <ul className='list-none text-gray-500'>
                                                <li>Porciones: 35 a 40 porciones</li>
                                                <li>Medidas: 32cm x 24cm</li>
                                                <li>Keke: Keke de Novia</li>
                                                <li>Relleno: Manjar de Casa</li>
                                                <li>Recojo: 2025-08-20</li>
                                                <li>Dedicatoria: 1</li>
                                            </ul>
                                        </td>
                                        <td>1</td>
                                        <td>100.00</td>
                                        <td>100.00</td>
                                    </tr>
                                </tbody>
                                <tfoot className='text-[#c41c1a]'>
                                    <tr className='text-[20px]'>
                                        <td colSpan={4} className="text-left font-bold pr-4">TOTAL</td>
                                        <td className="text-right font-bold">S/ 100.00</td>
                                    </tr>
                                </tfoot>
                            </table>
                            <div className='grid grid-cols-1 gap-2 pt-3'>
                                <div className='flex items-center gap-2'>
                                    <input type="checkbox" name="terms" id="terms" />
                                    <label htmlFor="terms" className='text-[18px]'>He leído y acepto las condiciones de <Link target="_blank" href="/politicas-privacidad" className='text-[#0C37ED]'>tratamiento de datos personales</Link></label>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <input type="checkbox" name="conditions" id="conditions" />
                                    <label htmlFor="conditions" className='text-[18px]'>He leído y acepta nuestros <Link target="_blank" href="/terminos-condiciones" className='text-[#0C37ED]'>términos y condiciones</Link></label>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-center mt-4'>
                            <button className='bg-[#c41c1a] text-white py-2 w-full rounded cursor-pointer'>PAGAR</button>
                        </div>
                    </div>
                    <div className='pl-5 pr-5 p-5 bg-white'>
                        <div className='flex justify-center mb-2 bg-[#c41c1a] p-2'>
                            <h2 className='text-[18px] font-bold text-white'>Datos de facturación</h2>
                        </div>
                        <div className='border-b-2 border-[#c41c1a] pt-3'>
                            <h2 className='text-[18px] font-bold text-[#c41c1a]'>DOCUMENTO DE VENTA                            </h2>
                        </div>
                        <div className='flex justify-around items-center gap-5'>
                            <div className='pb-5 pt-2 text-[15px]'>
                                <input type="radio" name="receipt" value="receipt" id='receipt' />
                                <label className="ml-2" htmlFor="receipt">BOLETA DE VENTA</label>
                            </div>
                            <div className='pb-5 pt-2 text-[15px]'>
                                <input type="radio" name="receipt" value="invoice" id='invoice' />
                                <label className="ml-2" htmlFor="invoice">FACTURA</label>
                            </div>
                        </div>
                        <div className='border-b-2 border-[#c41c1a] pb-3'>
                            <h2 className='text-[18px] font-bold text-black'>Datos de la Empresa</h2>
                        </div>
                        <div className='grid grid-cols-1 gap-2 pt-3'>
                            <div className="grid grid-cols-1">
                                <label htmlFor="ruc">RUC</label>
                                <div className="grid grid-cols-[1fr_auto] gap-2">
                                    <input className="border-2 border-[#c41c1a]" type="text" name="ruc" id="ruc" placeholder="RUC" />
                                    <button className="bg-[#c41c1a] text-white py-2 px-4 rounded cursor-pointer">
                                        <FaMagnifyingGlass />
                                    </button>
                                </div>
                            </div>
                            <div className='grid grid-cols-1'>
                                <label htmlFor="razonSocial">Razón Social</label>
                                <input className='border-2 border-[#c41c1a]' type="text" name="razonSocial" id="razonSocial" placeholder="Razón Social" />
                            </div>
                            <div className='grid grid-cols-1'>
                                <label htmlFor="address">Domicilio Fiscal</label>
                                <input className='border-2 border-[#c41c1a]' type="text" name="address" id="address" placeholder="Domicilio Fiscal" />
                            </div>
                        </div>
                        <div className='pt-5'>
                            <div className='flex justify-center mb-2 bg-[#c41c1a] p-2'>
                                <h2 className='text-[18px] font-bold text-white'>Datos para la entrega</h2>
                            </div>
                            <div className='border-b-2 border-[#c41c1a] pt-3'>
                                <h2 className='text-[18px] font-bold text-[#c41c1a]'>TIPO DE ENTREGA                            </h2>
                            </div>
                            <div className='flex justify-around items-center gap-5'>
                                <div className='pb-5 pt-2 text-[15px]'>
                                    <input type="radio" name="deliveryType" value="deliveryType" id='deliveryType' defaultChecked />
                                    <label className="ml-2" htmlFor="deliveryType">Recoger <b>GRATIS</b> en tienda</label>
                                </div>
                            </div>
                            <div className='border-b-2 border-[#c41c1a] pb-3'>
                                <h2 className='text-[18px] font-bold text-black'>Elige el local más cercano a ti:</h2>
                            </div>
                            <div className='grid grid-cols-1 gap-2 pt-3'>

                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );

}
