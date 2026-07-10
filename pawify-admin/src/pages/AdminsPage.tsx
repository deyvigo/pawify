import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Table } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { SortIcon } from '@/components/icons/SortIcon'
import { useDebounce } from '@/hooks/useDebounce'
import { useAdmin } from '@/hooks/useAdmin'
import { formatDate } from '@/utils/date'

const titles = [
  {
    name: 'ID',
    center: false,
    key: 'id',
    sortable: true,
  },
  {
    name: 'USERNAME',
    center: false,
    key: 'username',
    sortable: true,
  },
  {
    name: 'FIRST NAME',
    center: false,
    key: 'firstName',
    sortable: true,
  },
  {
    name: 'LAST NAME',
    center: false,
    key: 'lastName',
    sortable: true,
  },
  {
    name: 'DNI',
    center: false,
    key: 'dniNumber',
    sortable: false,
  },
  {
    name: 'FECHA DE CREACIÓN',
    center: false,
    key: 'createdAt',
    sortable: true,
  },
]

export const AdminsPage = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState('id,asc')
  const debouncedSearch = useDebounce(search, 300)

  const { adminsPage } = useAdmin({ search: debouncedSearch, size: 15, page, sort })

  const handlePageChangeToNext = () => {
    if (adminsPage?.last) return
    setPage(page + 1)
  }

  const handlePageChangeToPrev = () => {
    if (adminsPage?.first) return
    setPage(page - 1)
  }

  const handleSort = (key: string) => {
    const actualSort = sort.split(',')
    if (key === actualSort[0]) {
      setSort(`${key},${actualSort[1] === 'asc' ? 'desc' : 'asc'}`)
    } else {
      setSort(`${key},asc`)
    }
  }

  return (
    <div className="w-full p-6 min-h-full flex flex-col gap-4 bg-secondary">
      <h1 className="text-white text-2xl px-2">Administradores</h1>
      <div className="w-full flex gap-2">
        <Input
          name="Buscar"
          type="text"
          placeholder="Buscar por username"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1"
          labelStyle="hidden"
          inputStyle="h-10"
        />
      </div>
      <Table>
        <thead>
          <tr className="border-primary-border border-b text-left last:border-b-0">
            {titles.map(({ center, name, key, sortable }) => (
              <th key={key} className="px-4 py-3">
                <div className={`flex items-center gap-2 ${center ? 'justify-center' : 'justify-start'}`}>
                  {name}
                  {sortable && (
                    <button className="w-fit h-fit bg-transparent cursor-pointer" onClick={() => handleSort(key)}>
                      <SortIcon className="w-3 h-3 text-white" />
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {adminsPage?.content?.map(admin => (
            <tr key={admin.id} className="border-primary-border border-b last:border-b-0 first:border-t text-left">
              <td className="px-4 py-3">{admin.id}</td>
              <td className="px-4 py-3">{admin.username}</td>
              <td className="px-4 py-3">{admin.first_name}</td>
              <td className="px-4 py-3">{admin.last_name}</td>
              <td className="px-4 py-3">{admin.dni_number}</td>
              <td className="px-4 py-3">{formatDate(admin.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination
        currentPage={page}
        totalPages={adminsPage?.total_pages!}
        onNextPage={handlePageChangeToNext}
        onPrevPage={handlePageChangeToPrev}
      />
    </div>
  )
}
