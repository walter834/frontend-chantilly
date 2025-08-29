import { getProducts } from "@/service/product/customizeProductService";
import { columns, Product } from "./columns";
import { DataTable } from "./data-table";


async function getData(): Promise<Product[]> {
 
  try{
    return await getProducts();
  }catch(error){
    return[]
  }
  
}

export default async function Products() {
  const data = await getData();
 
 
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
