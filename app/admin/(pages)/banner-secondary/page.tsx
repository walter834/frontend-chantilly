import { columns } from "./columns";
import { DataTable } from "./data-table";
import {
  BannerSecondary,
  getBannerSecondary,
} from "@/service/bannerFooter/bannerFooterService";

async function getData(): Promise<BannerSecondary[]> {
  try {
    return await getBannerSecondary();
  } catch (error) {
    return [];
  }
}

export default async function BannerFooter() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
