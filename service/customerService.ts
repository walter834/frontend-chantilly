import api, { API_ROUTES } from "./api";
import { ApiCustomer, TransformedCustomer, transformCustomer, UpdateCustomerPayload } from "@/types/api";

export async function getCustomerById(id: string): Promise<TransformedCustomer | null> {
    try {
        const endpoint = `${API_ROUTES.CUSTOMERS}/${id}`;
        const { data } = await api.get<ApiCustomer>(endpoint);
        console.log("customer", data);
        return transformCustomer(data);
    } catch (error) {
        console.error('Error fetching customer by id:', error);
        return null;
    }
}

export async function updateCustomer(id: string, customer: UpdateCustomerPayload): Promise<TransformedCustomer | null> {
    try {

        const endpoint = `${API_ROUTES.CUSTOMERS}/${id}`;
        const dataexample = {
            name: customer.name,
            lastname: customer.lastname,
            address: customer.address,
            phone: customer.phone,
            id_document_type: customer.id_document_type,
            document_number: customer.document_number,
        };
        let dataexamplejson = JSON.stringify(dataexample)
        const { data } = await api.put<ApiCustomer>(endpoint, dataexamplejson, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });
        return transformCustomer(data);
    } catch (error: any) {
        if (error.response) {
            console.error('Error updating customer:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers,
            });
        } else {
            console.error('Error updating customer (no response):', error?.message || error);
        }
        return null;
    }
}
