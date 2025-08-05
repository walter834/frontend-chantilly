import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Paginations() {
  return (
    <div className="w-full flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" className="text-red-600 hover:rounded-full"/>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#"  className="bg-red-600 rounded-full text-white hover:bg-red-700 hover:text-white">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="bg-gray-400 rounded-full text-white hover:bg-gray-500 hover:text-white" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="bg-gray-400 rounded-full text-white hover:bg-gray-500 hover:text-white">3</PaginationLink>
            </PaginationItem>
            
            <PaginationItem>
              <PaginationNext href="#" className="text-red-600 hover:rounded-full"/>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
  )
}
