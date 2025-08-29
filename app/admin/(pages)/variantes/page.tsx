import { columns, Variant } from "./columns";
import { DataTable } from "./data-table";
import { getVariants } from "@/service/variant/costumizeVariantService";

async function getData(): Promise<Variant[]> {
 
  try{
    return await getVariants();
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
