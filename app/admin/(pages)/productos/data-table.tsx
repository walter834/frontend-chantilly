"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  ChevronUp,
  Image,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import {
  getVariantsByProduct,
  setPrimaryImageVariant,
} from "@/service/variant/costumizeVariantService";
import { VariantFileUploadDialog } from "./VariantFileUpdateDialog";
import { toast } from "sonner";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onPageChange?: (page: number) => void;
  initialPageIndex?: number;
}

interface Variant {
  id: number;
  product_id: number;
  description: string;
  portions?: string;
  price?: string;
  hours?: number;
  images: VariantImage[];
  primaryImage?: string;
}

interface VariantImage {
  id: number;
  url: string;
  is_primary: number;
}

const VariantRows = ({
  productId,
  isExpanded,
  columnsCount,
}: {
  productId: number;
  isExpanded: boolean;
  columnsCount: number;
}) => {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (isExpanded && !hasLoaded) {
      loadVariants();
    }
  }, [isExpanded, productId, hasLoaded]);

  useEffect(() => {
    if (isExpanded) {
      setHasLoaded(false);
    }
  }, [productId]);

  useEffect(() => {
    const handleVariantUpdate = () => {
      if (isExpanded) {
        setHasLoaded(false);
      }
    };

    window.addEventListener("variantUpdated", handleVariantUpdate);

    return () => {
      window.removeEventListener("variantUpdated", handleVariantUpdate);
    };
  }, [isExpanded]);

  const loadVariants = async () => {
    setLoading(true);
    try {
      const productVariants = await getVariantsByProduct(productId);
      setVariants(productVariants);
      setHasLoaded(true);
    } catch (error) {
      setVariants([]);
      setHasLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  // Si no está expandido, no renderizar nada
  if (!isExpanded) {
    return null;
  }

  if (loading) {
    return (
      <TableRow className="bg-blue-50/30">
        <TableCell colSpan={columnsCount} className="h-16">
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            Cargando variantes...
          </div>
        </TableCell>
      </TableRow>
    );
  }

  if (hasLoaded && variants.length === 0) {
    return (
      <TableRow className="bg-blue-50/30">
        <TableCell
          colSpan={columnsCount}
          className="h-16 text-center text-gray-500"
        >
          No hay variantes disponibles para este producto
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {variants.map((variant, index) => (
        <TableRow
          key={`variant-${variant.id}`}
          className="bg-red-50/30 border-b-2 [&>td]:border-b-2 [&>td]:border-b-red-100"
        >
          {/* Columna de imágenes de variante */}
          {/* Columna de imágenes de variante */}
          
          <TableCell className="py-3 border-l-4 border-l-red-300 ">
            <div className="flex flex-wrap gap-2 max-w-xs">
              {variant.images && variant.images.length > 0 ? (
                variant.images.map((image, index) => {
                  const handleSetPrimary = async (
                    imageIndex: number,
                    currentPrimary: boolean
                  ) => {
                    if (currentPrimary) {
                      return;
                    }

                    try {
                      await setPrimaryImageVariant(variant.id, imageIndex);
                      toast.success("Imagen principal de variante actualizada");

                      // Disparar evento para refrescar variantes
                      window.dispatchEvent(new CustomEvent("variantUpdated"));
                    } catch (error) {
                      toast.error(
                        "Error al establecer imagen principal de variante"
                      );
                      console.error("Error:", error);
                    }
                  };

                  return (
                    <div key={image.id} className="relative flex-shrink-0">
                      <img
                        src={image.url}
                        alt={`Variante ${variant.description}`}
                        className={`w-12 h-12 object-cover rounded border-2 transition-all cursor-pointer ${
                          image.is_primary === 1
                            ? "border-red-700"
                            : "border-transparent hover:border-red-500 hover:scale-105"
                        }`}
                        onClick={() =>
                          handleSetPrimary(index, image.is_primary === 1)
                        }
                        title={
                          image.is_primary === 1
                            ? "Imagen principal actual"
                            : "Click para establecer como principal"
                        }
                      />
                      {image.is_primary === 1 && (
                        <div className="absolute -top-1 -right-1 bg-red-700 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center pointer-events-none">
                          ★
                        </div>
                      )}
                    </div>
                  );
                })
              ) : variant.primaryImage ? (
                <div className="relative">
                  <img
                    src={variant.primaryImage}
                    alt={`Variante ${variant.description}`}
                    className="w-12 h-12 object-cover rounded border-2 border-red-700"
                  />
                  <div className="absolute -top-1 -right-1 bg-red-700 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    ★
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-400">Sin imágenes</div>
              )}
            </div>
          </TableCell>

          {/* Columna de descripción de variante */}
          <TableCell className="py-3">
            <div className="font-medium text-sm text-red-800">
              {variant.description}
            </div>
          </TableCell>

          {/* Columna de descripción (vacía para variantes) */}
          <TableCell className="py-3">
            <span className="text-xs text-gray-400 italic">
              Variante del producto
            </span>
          </TableCell>

          {/* Columna de tipo (vacía para variantes) */}
          <TableCell className="py-3">
            <span className="text-xs text-gray-400">-</span>
          </TableCell>

          {/* Columna de acciones de variante */}
          <TableCell className="py-3">
            {/* Aquí puedes agregar acciones específicas para variantes */}
            <VariantFileUploadDialog id={variant.id} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export function DataTable<TData, TValue>({
  columns,
  data,
  onPageChange,
  initialPageIndex = 0,
}: DataTableProps<TData, TValue>) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: initialPageIndex,
      },
    },
  });

  useEffect(() => {
    if (onPageChange) {
      const currentPageIndex = table.getState().pagination.pageIndex;
      const maxPage = table.getPageCount() - 1;
      
      // Si la página actual es mayor que el máximo disponible, ir a la última página válida
      if (currentPageIndex > maxPage && maxPage >= 0) {
        table.setPageIndex(maxPage);
        onPageChange(maxPage);
      } else if (initialPageIndex !== currentPageIndex) {
        table.setPageIndex(initialPageIndex);
      }
    }
  }, [data, initialPageIndex, table, onPageChange]);

   useEffect(() => {
    const currentPage = table.getState().pagination.pageIndex;
    if (onPageChange && currentPage !== initialPageIndex) {
      onPageChange(currentPage);
    }
  }, [table.getState().pagination.pageIndex]);
  
  useEffect(() => {
    if (initialPageIndex !== undefined) {
      table.setPageIndex(initialPageIndex);
    }
  }, [initialPageIndex]);

  const uniqueProductsTypes = [
    ...new Map(
      data.map((item: any) => [item.product_type_id, item.product_type_name])
    ).entries(),
  ].map(([id, name]) => ({ id, name }));

  const toggleRowExpansion = (rowId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(rowId)) {
      newExpandedRows.delete(rowId);
    } else {
      newExpandedRows.add(rowId);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <div className="w-full space-y-6">
      <div className="w-full flex flex-col sm:flex-row gap-2 justify-between">
        <Input
          placeholder="Filtrar por nombre..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="w-full sm:max-w-[350px] xl:w-[200px]"
        />
        <Select
          value={
            (
              table.getColumn("product_type_name")?.getFilterValue() as string
            )?.toString() ?? ""
          }
          onValueChange={(value) => {
            if (value === "all") {
              table.getColumn("product_type_name")?.setFilterValue("");
            } else {
              table.getColumn("product_type_name")?.setFilterValue(value);
            }
          }}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tipos de Producto</SelectLabel>
              <SelectItem value="all">Todos los tipos</SelectItem>
              {uniqueProductsTypes.map((type) => (
                <SelectItem key={type.id} value={type.name}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              <>
                {table.getRowModel().rows.map((row) => {
                  const rowId = `product-${row.id}`;
                  const isExpanded = expandedRows.has(rowId);

                  return (
                    <React.Fragment key={rowId}>
                      {/* Fila principal del producto */}
                      <TableRow className="hover:bg-gray-50">
                        {row.getVisibleCells().map((cell, index) => (
                          <TableCell key={cell.id}>
                            {/* Si es la última celda (acciones), agregamos el botón de expansión */}
                            {index === row.getVisibleCells().length - 1 ? (
                              <div className="flex items-center gap-2">
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleRowExpansion(rowId)}
                                  className="h-8 w-8 p-0"
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">
                                    {isExpanded
                                      ? "Ocultar variantes"
                                      : "Ver variantes"}
                                  </span>
                                </Button>
                              </div>
                            ) : (
                              flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )
                            )}
                          </TableCell>
                        ))}
                      </TableRow>

                      {/* Filas de variantes */}
                      <VariantRows
                        productId={(row.original as any).id}
                        isExpanded={isExpanded}
                        columnsCount={columns.length}
                      />
                    </React.Fragment>
                  );
                })}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8 justify-end pt-4">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
