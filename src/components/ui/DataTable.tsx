import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  type ReactElement,
  type ReactNode,
} from 'react'

const HeadersContext = createContext<string[]>([])

export function DataTable({
  headers,
  children,
  cardOnMobile = true,
}: {
  headers: string[]
  children: ReactNode
  cardOnMobile?: boolean
}) {
  const rows = Children.map(children, (row) => {
    if (!isValidElement(row)) return row
    const rowEl = row as ReactElement<{ children?: ReactNode }>
    const cells = Children.map(rowEl.props.children, (cell, index) => {
      if (!isValidElement(cell)) return cell
      const cellEl = cell as ReactElement<{ label?: string }>
      return cloneElement(cellEl, {
        label: cellEl.props.label ?? headers[index],
      })
    })
    return cloneElement(rowEl, {}, cells)
  })

  return (
    <HeadersContext.Provider value={headers}>
      <div className="-mx-1 overflow-x-auto rounded-xl border border-slate-200/90 bg-white shadow-sm sm:mx-0">
        <table
          className={`min-w-full divide-y divide-slate-200 text-left text-sm ${
            cardOnMobile ? 'table-card-mode' : ''
          }`}
        >
          <thead className="bg-slate-soft/90">
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-steel sm:px-3.5"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white [&>tr]:transition-colors [&>tr:hover]:bg-slate-50/80">
            {rows}
          </tbody>
        </table>
      </div>
    </HeadersContext.Provider>
  )
}

export function Td({
  children,
  className = '',
  label,
}: {
  children: ReactNode
  className?: string
  label?: string
}) {
  useContext(HeadersContext)
  return (
    <td
      data-label={label}
      className={`min-w-0 px-3 py-2.5 text-navy-800 sm:px-3.5 ${className}`}
    >
      <div className="min-w-0 sm:contents">{children}</div>
    </td>
  )
}

export function ActionCell({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-1.5 min-[380px]:flex-row min-[380px]:flex-wrap min-[380px]:justify-end sm:justify-start [&>button]:w-full min-[380px]:[&>button]:w-auto">
      {children}
    </div>
  )
}
