"use client";
import { CustomAlert } from "@/components/ui/custom-alert";
import { createOrder } from "@/service/orderService";
import { ApiOrder, ApiInitSessionNiubizTransformed } from "@/types/api";
import { createInitSessionNiubiz, processPayment } from "@/service/orderService";
import { useRouter } from "next/navigation";

export default function PayButtom({ arrayOrder }: { arrayOrder: any }) {
    const router = useRouter();

    async function loadNiubizScript(src: string): Promise<void> {
        return new Promise((resolve, reject) => {
            // If already loaded, resolve immediately
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('No se pudo cargar el script de Niubiz'));
            document.body.appendChild(script);
        });
    }

    async function waitForCheckoutApi(maxWaitMs = 5000, intervalMs = 100): Promise<'VisanetCheckout' | 'Niubiz' | null> {
        const w = window as any;
        const start = Date.now();
        return new Promise((resolve) => {
            const check = () => {
                if (w?.VisanetCheckout && typeof w.VisanetCheckout.configure === 'function') {
                    resolve('VisanetCheckout');
                    return;
                }
                if (w?.Niubiz && (typeof w.Niubiz.open === 'function' || typeof w.Niubiz.configure === 'function')) {
                    resolve('Niubiz');
                    return;
                }
                if (Date.now() - start >= maxWaitMs) {
                    resolve(null);
                    return;
                }
                setTimeout(check, intervalMs);
            };
            check();
        });
    }

    function validateData() {
        switch (arrayOrder.voucher_type) {
            case 'FACTURA':
                const rucDigits = String(arrayOrder?.billing_data?.ruc || '').replace(/\D/g, '');
                const razon = String(arrayOrder?.billing_data?.razon_social || '').trim();
                const address = String(arrayOrder?.billing_data?.tax_address || '').trim();
                if (!rucDigits || !razon || !address) {
                    CustomAlert('Debe completar los datos de la empresa', 'error', 'bottom-right');
                    return false;
                }
                if (rucDigits.length !== 11) {
                    CustomAlert('El RUC debe tener exactamente 11 dígitos', 'error', 'bottom-right');
                    return false;
                }
                break;
        }
        return true;
    }

    function adaptFormatToProducts() {
        return arrayOrder.items.map((item: any) => {
            const parsedVariant = Number(item?.product?.productVariant);
            const variantId = Number.isFinite(parsedVariant) && parsedVariant > 0 ? parsedVariant : null;
            const cakeFlavorRaw = item?.product?.cakeFlavor;
            const cakeFlavorId = cakeFlavorRaw ? Number(cakeFlavorRaw) : null;
            const quantity = Number(item?.quantity) || 0;
            const unitPrice = Number(item?.product?.price) || 0;
            const subtotal = unitPrice * quantity;
            const dedication = String(item?.product?.dedication || "");
            const deliveryDateRaw = item?.product?.pickupDate;
            const deliveryDate = typeof deliveryDateRaw === 'string' && deliveryDateRaw.trim() !== '' ? deliveryDateRaw : null;

            return {
                product_variant_id: variantId,
                cake_flavor_id: cakeFlavorId,
                quantity,
                unit_price: unitPrice,
                subtotal,
                dedication_text: dedication.trim() === '' ? null : dedication,
                delivery_date: deliveryDate,
            };
        });
    }

    function adaptFormatToOrder(): ApiOrder {
        return {
            customer_id: Number(arrayOrder.customer_id) || 0,
            voucher_type: String(arrayOrder.voucher_type || ''),
            local_id: Number(arrayOrder.local_id) || 2,
            subtotal: Number(arrayOrder.subtotal) || 0,
            total_amount: Number(arrayOrder.total_amount) || 0,
            billing_data: (String(arrayOrder.voucher_type || '') === 'FACTURA') ? {
                ruc: String(arrayOrder?.billing_data?.ruc || '').replace(/\D/g, ''),
                razon_social: String(arrayOrder?.billing_data?.razon_social || '').trim(),
                tax_address: String(arrayOrder?.billing_data?.tax_address || '').trim(),
            } : {},
            items: adaptFormatToProducts(),
        };
    }

    const handlePayOrder = async () => {
        const isValid = validateData();
        if (!isValid) return;
        const order = adaptFormatToOrder();
        if (!order.customer_id) {
            CustomAlert('Cliente inválido.', 'error', 'bottom-right');
            return;
        }
        if (!Array.isArray(order.items) || order.items.length === 0) {
            CustomAlert('El carrito está vacío.', 'error', 'bottom-right');
            return;
        }
        try {
            const response = await createOrder(order);
           
            if (response) {
                console.log('response order',response);
                CustomAlert('Orden creada correctamente', 'success', 'bottom-right');
                await initSessionNiubiz(response);
            } else {
                CustomAlert('No se pudo crear la orden.', 'error', 'bottom-right');
            }
        } catch (err: any) {
            const data = err?.response?.data;
            let message = err?.message || 'Error al crear la orden';
            if (data) {
                if (typeof data === 'string') {
                    message = data;
                } else if (data.message) {
                    message = data.message;
                } else if (data.errors && typeof data.errors === 'object') {
                    const firstKey = Object.keys(data.errors)[0];
                    const firstVal = data.errors[firstKey];
                    if (Array.isArray(firstVal) && firstVal.length) {
                        message = firstVal[0];
                    } else if (typeof firstVal === 'string') {
                        message = firstVal;
                    }
                }
            }
            console.error('Order creation failed. Payload:', order, 'Response:', data);
            CustomAlert(message, 'error', 'bottom-right');
        }
    }

    async function initSessionNiubiz(order: any) {
        const payload: ApiInitSessionNiubizTransformed = {
            amount: order.order.total,
            order_id: order.order.id,
            description: order.order.voucher_type,
        };

        const sessionResponse = await createInitSessionNiubiz(payload);
        if (!sessionResponse) {
            CustomAlert('No se pudo crear la sesión de niubiz.', 'error', 'bottom-right');
            return;
        }
        console.log('sessionResponse', sessionResponse);

        // Cargar script de Niubiz (usar QAS si estás en ambiente de pruebas)
        // La librería que define window.VisanetCheckout es checkout.js
        const NIUBIZ_SCRIPT_PROD = 'https://static-content.vnforapps.com/v2/js/checkout.js';
        const NIUBIZ_SCRIPT_QAS = 'https://static-content-qas.vnforapps.com/v2/js/checkout.js';
        const scriptUrl = NIUBIZ_SCRIPT_QAS; // usar QAS para pruebas; cambia a PROD en producción

        // Endpoints de acción requeridos por el checkout
        const ACTION_QAS = 'https://apitestenv.vnforappstest.com/api.payments/v4/formCreate';
        const ACTION_PROD = 'https://apiprod.vnforapps.com/api.payments/v4/formCreate';
        const actionUrl = scriptUrl === NIUBIZ_SCRIPT_QAS ? ACTION_QAS : ACTION_PROD;

        try {
            await loadNiubizScript(scriptUrl);
        } catch (e: any) {
            CustomAlert(e?.message || 'Error cargando Niubiz', 'error', 'bottom-right');
            return;
        }

        // Esperar a que la API esté disponible en window
        const apiFound = await waitForCheckoutApi();
        if (!apiFound) {
            console.error('La librería Niubiz no expuso su API en window dentro del tiempo esperado');
            CustomAlert('No se pudo inicializar el formulario de Niubiz. Intente nuevamente.', 'error', 'bottom-right');
            return;
        }

        const { sessionToken, merchant_id, purchase_number, amount } = sessionResponse.data || {};
        if (!sessionToken || !merchant_id || !purchase_number || !amount) {
            console.error('Respuesta de sesión inválida:', sessionResponse);
            CustomAlert('Sesión de Niubiz inválida.', 'error', 'bottom-right');
            return;
        }
        const formattedAmount = Number(amount).toFixed(2);
        const purchaseNumberStr = String(purchase_number);

        // Abrir formulario Regular Button
        let tokenPromise!: Promise<string>;
        try {
            const w = window as any;
            const origin = window.location.origin;
            const currentUrl = window.location.href;
            const timeoutUrl = currentUrl; // si expira
            const successUrl = `${origin}/checkout/success`;
            const failureUrl = `${origin}/checkout?status=failure`;

            // Esperar tokenId desde el popup de Niubiz mediante postMessage
            const allowedOrigins = [
                'https://static-content-qas.vnforapps.com',
                'https://static-content.vnforapps.com',
                'https://apitestenv.vnforappstest.com',
                'https://apiprod.vnforapps.com'
            ];
            tokenPromise = new Promise((resolve) => {
                const handler = (event: MessageEvent) => {
                    try {
                        if (!event.origin) return;
                        const ok = allowedOrigins.some(o => event.origin.startsWith(o));
                        if (!ok) return;
                        const data: any = event.data || {};
                        const tokenId = data?.tokenId || data?.token || data?.callBackPayment?.tokenId;
                        if (tokenId) {
                            window.removeEventListener('message', handler);
                            resolve(String(tokenId));
                        }
                    } catch {}
                };
                window.addEventListener('message', handler);
            });

            if (w.VisanetCheckout && typeof w.VisanetCheckout.configure === 'function') {
                // API clásica
                w.VisanetCheckout.configure({
                    action: actionUrl,
                    sessiontoken: sessionToken,
                    merchantid: merchant_id,
                    purchasenumber: purchaseNumberStr,
                    amount: formattedAmount,
                    channel: 'web',
                    timeouturl: timeoutUrl,
                    // Opcionales de UI
                    // cardholdername: '',
                    // merchantlogo: 'https://tu-dominio/logo.png',
                    formbuttoncolor: '#c41c1a',
                });
                w.VisanetCheckout.open();
                // no return; seguimos para esperar token
            }

            if (w.Niubiz && typeof w.Niubiz.open === 'function') {
                // API nueva (si aplica)
                w.Niubiz.open({
                    action: actionUrl,
                    sessiontoken: sessionToken,
                    merchantid: merchant_id,
                    purchasenumber: purchaseNumberStr,
                    amount: formattedAmount,
                    channel: 'web',
                    timeouturl: timeoutUrl,
                    successurl: successUrl,
                    failureurl: failureUrl,
                });
                // no return; seguimos para esperar token
            }

            console.error('No se encontró la API de Niubiz/Visanet en window');
            CustomAlert('No se pudo abrir el formulario de Niubiz.', 'error', 'bottom-right');
        } catch (e) {
            console.error('Error abriendo Niubiz:', e);
            CustomAlert('Error abriendo el formulario de Niubiz.', 'error', 'bottom-right');
            return;
        }

        // Una vez abierto, esperar el token y procesar el pago en el backend
        try {
            const tokenId = await tokenPromise;
            if (!tokenId) {
                CustomAlert('No se recibió token de pago.', 'error', 'bottom-right');
                return;
            }
            const payload = {
                tokenId,
                amount: Number(amount),
                purchaseNumber: purchase_number,
            };
            const result = await processPayment(payload);
            // Guardar resultado para la página de éxito
            try { localStorage.setItem('lastPaymentResult', JSON.stringify(result)); } catch {}
            router.push('/checkout/success');
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.message || 'Error procesando el pago';
            CustomAlert(msg, 'error', 'bottom-right');
        }
    }

    return (
        <button type="button" onClick={handlePayOrder} className='bg-[#c41c1a] text-white py-2 w-full rounded cursor-pointer'>
            PAGAR
        </button>
    );
}