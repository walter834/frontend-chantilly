import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationsProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export default function Paginations({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  hasNextPage = false,
  hasPrevPage = false
}: PaginationsProps) {
  
  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Si hay 5 páginas o menos, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Si hay más de 5 páginas, mostrar páginas alrededor de la actual
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="w-full flex justify-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => hasPrevPage && handlePageChange(currentPage - 1)}
              className={`text-red-600 hover:rounded-full ${
                !hasPrevPage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            />
          </PaginationItem>
          
          {pageNumbers.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page)}
                className={`rounded-full text-white hover:bg-red-700 hover:text-white cursor-pointer ${
                  page === currentPage
                    ? 'bg-red-600'
                    : 'bg-gray-400 hover:bg-gray-500'
                }`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext
              onClick={() => hasNextPage && handlePageChange(currentPage + 1)}
              className={`text-red-600 hover:rounded-full ${
                !hasNextPage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
