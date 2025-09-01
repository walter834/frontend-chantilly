"use client";
import { useRef, useState } from "react";
import { CustomAlert } from "@/components/ui/custom-alert";
import { ApiOrder } from "@/types/api";
import { createNiubizSession } from "@/service/orderService";
import { DeliveryDateAlert } from "@/components/ui/delivery-date-alert";

export default function PayButtom({ arrayOrder }: { arrayOrder: any }) {
    const currentSession = useRef<any>(null);
    const [loading, setLoading] = useState(false);
    const [showDateAlert, setShowDateAlert] = useState(false);
    const [deliveryInfo, setDeliveryInfo] = useState({
        deadline: new Date(),
        maxHours: 0,
        products: [] as Array<{ name: string, hours: number, imageUrl?: string }>
    });

    function validateDate(maxHour: number): boolean {
        const dateInput = document.getElementById('date') as HTMLInputElement;
        if (!dateInput || !dateInput.value) {
            CustomAlert('Por favor seleccione una fecha de entrega', 'error', 'bottom-right');
            return false;
        }

        const selectedDate = new Date(dateInput.value);
        const now = new Date();

        const deadline = new Date(now);
        deadline.setHours(deadline.getHours() + maxHour);

        if (deadline.getHours() >= 18) {
            deadline.setDate(deadline.getDate() + 1);
            deadline.setHours(9, 0, 0, 0);
        }

        if (selectedDate < deadline) {
            const products = arrayOrder.items
                .filter((item: any) => item.product?.hour)
                .map((item: any) => ({
                    name: item.product?.name || 'Producto sin nombre',
                    hours: item.product?.hour,
                    imageUrl: item.product?.image
                }));

            setDeliveryInfo({
                deadline,
                maxHours: maxHour,
                products
            });
            setShowDateAlert(true);
            return false;
        }
        return true;
    }

    function validateData() {
        console.log('arrayOrder.items', arrayOrder.items);

        const maxHour = Math.max(
            ...arrayOrder.items
                .map((item: any) => item.product?.hour)
                .filter((hour: any): hour is number => typeof hour === 'number')
        ) || 0;
        console.log('maxHour', maxHour);

        if (maxHour > 0 && !validateDate(maxHour)) {
            return false;
        }

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
            const productId = item.product.id;
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
                product_id: (variantId === null) ? productId : null,
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
        console.log('order items', order.items);
        if (!order.customer_id) {
            CustomAlert('Cliente inválido.', 'error', 'bottom-right');
            return;
        }
        if (!Array.isArray(order.items) || order.items.length === 0) {
            CustomAlert('El carrito está vacío.', 'error', 'bottom-right');
            return;
        }
        if (order.local_id <= 0) {
            CustomAlert('Selecione un local.', 'error', 'bottom-right');
            return;
        }

        try {
            await initSessionNiubiz(order);

        } catch (err: any) {
            const data = err?.response?.data;
            let message = err?.message || 'Error al crear la orden';
            console.error('Order creation failed. Payload:', order, 'Response:', data, "message", message);
            CustomAlert(message, 'error', 'bottom-right');
        }
    }

    async function initSessionNiubiz(order: any) {
        try {
            setLoading(true);
            const session = await createNiubizSession(order);
            if (!session) {
                CustomAlert('No se pudo crear la sesión de niubiz.', 'error', 'bottom-right');
                return;
            }
            // Guarda la sesión actual
            currentSession.current = session;
            console.log('session', session.data);
            const paymentData = {
                sessionToken: session.data.sessionToken,
                channel: 'web',
                merchantId: session.data.merchant_id,
                orderId: session.data.purchase_number,
                amount: session.data.amount,
                currency: 'PEN',
                customer_id: session.data.order_data.customer_id,
                merchantLogo: session.data.merchant_logo,
                orderData: session.data.order_data,
            };

            localStorage.setItem('temporal-order', JSON.stringify(session.data.order_data));
            console.log('paymentData', paymentData);
            showNiubizPaymentForm(paymentData);

        } catch (err: any) {
            const data = err?.response?.data;
            let message = err?.message || 'Error al crear la sesión de niubiz';
            console.error('Session creation failed. Payload:', order, 'Response:', data, "message", message);
            CustomAlert('Error al crear la sesión de niubiz', 'error', 'bottom-right');
        } finally {
            setLoading(false);
        }
    }

    async function showNiubizPaymentForm(paymentData: any) {
        VisanetCheckout.configure({
            sessiontoken: paymentData.sessionToken,
            channel: paymentData.channel,
            merchantid: paymentData.merchantId,
            purchasenumber: paymentData.orderId,
            amount: paymentData.amount,
            currency: paymentData.currency,
            formbuttoncolor: '#c41c1a',
            merchantlogo: paymentData.merchantLogo,
            action: 'http://192.168.18.28:8000/api/niubiz/pay-response',
            timeouturl: "http://localhost/pagos/error.php",
        });
        VisanetCheckout.open();
    }

    return (
        <>
            <button type="button" {...(loading && { hidden: true })} onClick={handlePayOrder} className='bg-[#c41c1a] text-white py-2 w-full rounded cursor-pointer'>
                PAGAR
            </button>
            {loading && <button type="button" className='bg-[#c41c1a]/50 text-white py-2 w-full rounded cursor-not-allowed '>
                <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                </svg>
                ABRIENDO NIUBIZ...
            </button>}
            <DeliveryDateAlert
                open={showDateAlert}
                onClose={() => setShowDateAlert(false)}
                deadline={deliveryInfo.deadline}
                maxHours={deliveryInfo.maxHours}
                products={deliveryInfo.products}
            />
        </>
    );
}