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
  Edit3,
  Save,
  X,
} from "lucide-react";

import { AddBanner } from "./components/AddBanner";
import { useEffect, useRef, useState } from "react";
import dragula from "dragula";
import "dragula/dist/dragula.css";
import AllDeleteBanners from "./components/DeleteAllBanners";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onReorderData?: (newData: TData[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onReorderData,
}: DataTableProps<TData, TValue>) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [reorderedData, setReorderedData] = useState<TData[]>(data);

  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  const dragulaInstance = useRef<any>(null);
  const dragStartIndex = useRef<number>(-1);
  const draggedElement = useRef<any>(null);

  useEffect(() => {
    setReorderedData(data);
  }, [data]);

  // Función para actualizar los display_order
  const updateDisplayOrders = (array: TData[]): TData[] => {
    return array.map(
      (item, index) =>
        ({
          ...item,
          display_order: index + 1,
        } as TData)
    );
  };

  const table = useReactTable({
    data: reorderedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 12,
      },
    },
  });

  const reorderArray = (
    array: TData[],
    fromIndex: number,
    toIndex: number
  ): TData[] => {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= array.length ||
      toIndex >= array.length
    ) {
      return array;
    }

    const newArray = [...array];
    const [movedItem] = newArray.splice(fromIndex, 1);
    newArray.splice(toIndex, 0, movedItem);

    return updateDisplayOrders(newArray);
  };

  const initializeDragula = () => {
    if (dragulaInstance.current) {
      dragulaInstance.current.destroy();
      dragulaInstance.current = null;
    }

    if (tableBodyRef.current && isEditMode) {
      const container = tableBodyRef.current;

      dragulaInstance.current = dragula([container], {
        moves: (el) => isEditMode,
        accepts: () => true,
      });

      // ✅ CAPTURAR información en drag start (datos originales)
      dragulaInstance.current.on("drag", (el: HTMLElement) => {
        const rowId = el.getAttribute("data-row-id");
        if (rowId) {
          dragStartIndex.current = reorderedData.findIndex(
            (item: any) => item.id?.toString() === rowId
          );
          draggedElement.current = reorderedData[dragStartIndex.current];
          console.log(
            `🎯 DRAG START: ID ${rowId} desde índice ${dragStartIndex.current}`
          );
        }
        el.classList.add("opacity-50");
      });

      // ✅ SOLO usar DROP para el reordenamiento final
      dragulaInstance.current.on(
        "drop",
        (
          el: HTMLElement,
          target: HTMLElement,
          source: HTMLElement,
          sibling: HTMLElement | null
        ) => {
          console.log("🎯 DROP EVENT");

          if (dragStartIndex.current === -1 || !draggedElement.current) {
            console.error("❌ Información de drag incompleta");
            return;
          }

          try {
            // ✅ Calcular posición final basándose en el sibling
            let targetIndex: number;

            if (!sibling) {
              // Sin sibling = al final
              targetIndex = reorderedData.length - 1;
            } else {
              // ✅ Buscar el sibling en nuestros datos actuales
              const siblingId = sibling.getAttribute("data-row-id");
              if (siblingId) {
                const siblingDataIndex = reorderedData.findIndex(
                  (item: any) => item.id?.toString() === siblingId
                );

                // 🔧 AQUÍ ESTÁ LA CORRECCIÓN:
                // Si estamos arrastrando hacia abajo, queremos insertar ANTES del sibling
                // Si estamos arrastrando hacia arriba, también ANTES del sibling
                // Pero debemos ajustar por el elemento que se va a remover primero

                if (dragStartIndex.current < siblingDataIndex) {
                  // Arrastrando hacia ABAJO: insertar antes del sibling,
                  // pero restar 1 porque el elemento original se removió primero
                  targetIndex = siblingDataIndex - 1;
                } else {
                  // Arrastrando hacia ARRIBA: insertar antes del sibling
                  targetIndex = siblingDataIndex;
                }

                console.log(
                  `📍 Sibling encontrado en índice ${siblingDataIndex}`
                );
                console.log(
                  `📍 Dirección: ${
                    dragStartIndex.current < siblingDataIndex
                      ? "ABAJO"
                      : "ARRIBA"
                  }`
                );
                console.log(`📍 Target index calculado: ${targetIndex}`);
              } else {
                console.error("❌ No se encontró sibling ID");
                return;
              }
            }

            console.log(
              `🔄 REORDENAMIENTO: desde ${dragStartIndex.current} hacia ${targetIndex}`
            );

            // ✅ Verificar si realmente cambió
            if (dragStartIndex.current !== targetIndex) {
              const newOrder = reorderArray(
                reorderedData,
                dragStartIndex.current,
                targetIndex
              );

              console.log(
                "📋 ORDEN ANTES:",
                reorderedData.map(
                  (item: any, idx) =>
                    `${idx}: ID ${item.id} - order ${item.display_order}`
                )
              );

              console.log(
                "📋 ORDEN DESPUÉS:",
                newOrder.map(
                  (item: any, idx) =>
                    `${idx}: ID ${item.id} - order ${item.display_order}`
                )
              );

              setReorderedData(newOrder);
            } else {
              console.log("⚠️ Sin cambios - mismo índice");
            }
          } catch (error) {
            console.error("❌ Error en drop:", error);
          } finally {
            // ✅ Limpiar referencias
            dragStartIndex.current = -1;
            draggedElement.current = null;
          }
        }
      );

      // ✅ Eventos de limpieza
      dragulaInstance.current.on("dragend", (el: HTMLElement) => {
        el.classList.remove("opacity-50");
      });

      dragulaInstance.current.on("cancel", () => {
        dragStartIndex.current = -1;
        draggedElement.current = null;
        console.log("🚫 DRAG CANCELADO");
      });

      dragulaInstance.current.on(
        "over",
        (el: HTMLElement, container: HTMLElement) => {
          container.classList.add("bg-blue-50");
        }
      );

      dragulaInstance.current.on(
        "out",
        (el: HTMLElement, container: HTMLElement) => {
          container.classList.remove("bg-blue-50");
        }
      );
    }
  };

  const destroyDragula = () => {
    if (dragulaInstance.current) {
      dragulaInstance.current.destroy();
      dragulaInstance.current = null;
    }
    dragStartIndex.current = -1;
    draggedElement.current = null;
  };

  // ✅ Solo reinicializar cuando cambia el modo de edición
  useEffect(() => {
    if (isEditMode) {
      const timer = setTimeout(initializeDragula, 100);
      return () => clearTimeout(timer);
    } else {
      destroyDragula();
    }

    return destroyDragula;
  }, [isEditMode]);

  // ✅ Reinicializar solo cuando los datos cambian SIGNIFICATIVAMENTE
  useEffect(() => {
    if (isEditMode && dragulaInstance.current) {
      console.log("♻️ Datos actualizados, reinicializando Dragula...");
      initializeDragula();
    }
  }, [reorderedData.map((item: any) => item.id).join(",")]); // Solo cuando cambia el orden de IDs

  const handleEditMode = () => {
    setIsEditMode(true);
  };

  const handleSaveOrder = () => {
    setIsEditMode(false);
    if (onReorderData) {
      console.log(
        "💾 GUARDANDO ORDEN FINAL:",
        reorderedData.map(
          (item: any) => `ID ${item.id} - order ${item.display_order}`
        )
      );
      onReorderData(reorderedData);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setReorderedData(data);
    console.log("🔄 ORDEN RESTAURADO AL ORIGINAL");
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex ">
        <AddBanner />
        <AllDeleteBanners />
        <div className="flex gap-2">
          {!isEditMode ? (
            <Button onClick={handleEditMode} variant="outline" size="sm">
              <Edit3 className="h-4 w-4 mr-2" />
              Editar orden
            </Button>
          ) : (
            <>
              <Button onClick={handleSaveOrder} variant="default" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
              <Button onClick={handleCancelEdit} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </>
          )}
        </div>
      </div>

      {isEditMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
          <strong>Modo edición activo:</strong> Arrastra las filas para cambiar
          el orden. Suelta donde quieras posicionar el elemento.
          <br />
          <small className="opacity-75">
            Los elementos se insertarán en la posición exacta donde sueltes.
          </small>
        </div>
      )}

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {isEditMode && <TableHead className="w-16">🎯 Orden</TableHead>}
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
          <TableBody ref={tableBodyRef}>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, tableIndex) => {
                const rowData = row.original as any;
                const displayOrder = rowData.display_order;

                return (
                  <TableRow
                    key={`row-${rowData.id}-${displayOrder}`} // ✅ Key estable basado en orden
                    data-row-id={rowData.id}
                    className={
                      isEditMode
                        ? "cursor-move hover:bg-gray-50 transition-colors duration-150 border-l-4 border-l-blue-400"
                        : ""
                    }
                  >
                    {isEditMode && (
                      <TableCell className="text-center font-mono text-sm">
                        <div className="flex items-center justify-center gap-2">
                          <span className="bg-blue-100 px-2 py-1 rounded text-blue-800">
                            #{displayOrder}
                          </span>
                          <div className="flex flex-col">
                            <div className="w-1 h-1 bg-gray-400 rounded-full mb-0.5"></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full mb-0.5"></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          </div>
                        </div>
                      </TableCell>
                    )}
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (isEditMode ? 1 : 0)}
                  className="h-24 text-center"
                >
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8 justify-end">
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
