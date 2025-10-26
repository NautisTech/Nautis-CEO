// MUI Imports
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'

// Third Party Imports
import type { useReactTable } from '@tanstack/react-table'

const TablePaginationComponent = ({
  table,
  totalRows
}: {
  table: ReturnType<typeof useReactTable>
  totalRows?: number
}) => {
  // Para paginação server-side (manual), usar totalRows passado como prop
  // Para paginação client-side, usar getFilteredRowModel
  const isManualPagination = table.options.manualPagination
  const rowCount = isManualPagination && totalRows !== undefined ? totalRows : table.getFilteredRowModel().rows.length
  const pageCount = isManualPagination && totalRows !== undefined
    ? Math.ceil(totalRows / table.getState().pagination.pageSize)
    : Math.ceil(table.getFilteredRowModel().rows.length / table.getState().pagination.pageSize)

  return (
    <div className='flex justify-between items-center flex-wrap pli-6 border-bs bs-auto plb-[12.5px] gap-2'>
      <Typography color='text.disabled'>
        {`Showing ${
          rowCount === 0
            ? 0
            : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1
        }
        to ${Math.min(
          (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
          rowCount
        )} of ${rowCount} entries`}
      </Typography>
      <Pagination
        shape='rounded'
        color='primary'
        variant='tonal'
        count={pageCount}
        page={table.getState().pagination.pageIndex + 1}
        onChange={(_, page) => {
          table.setPageIndex(page - 1)
        }}
        showFirstButton
        showLastButton
      />
    </div>
  )
}

export default TablePaginationComponent
