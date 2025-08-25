import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderCard } from "./components/OrderCard";
import OrdersList from "./components/OrdersList";
export default function myOrders() {
  return (
    <div className="py-10 min-h-screen">

      <h1 className="text-center">MIS COMPRAS</h1>
      <div className="flex justify-between mx-auto  px-20">
        <div className="flex w-full max-w-sm items-center gap-2">
          <Input type="email" placeholder="Email" />
          <Button type="submit" variant="outline">
            Subscribe
          </Button>
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-center items-center mt-10">
        <OrdersList/>
      </div>
    </div>
  );
}
