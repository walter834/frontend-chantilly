import { columns } from "./columns";
import { getBanner } from "@/service/bannerService";
import { DataTable } from "./data-table";
import { ApiBanner } from "@/types/api";

async function getData(): Promise<ApiBanner[]> {
  try {
    return await getBanner();
  } catch (error) {
    return [];
  }
}

export default async function Banners() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
