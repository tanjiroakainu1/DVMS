import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-steel">
      {children}
    </span>
  )
}

export function FieldInput(
  props: InputHTMLAttributes<HTMLInputElement> & { className?: string },
) {
  const { className = '', ...rest } = props
  return <input className={`field-input ${className}`} {...rest} />
}

export function FieldSelect(
  props: SelectHTMLAttributes<HTMLSelectElement> & { className?: string },
) {
  const { className = '', children, ...rest } = props
  return (
    <select className={`field-input ${className}`} {...rest}>
      {children}
    </select>
  )
}

export function FieldTextarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string },
) {
  const { className = '', ...rest } = props
  return <textarea className={`field-input resize-y ${className}`} {...rest} />
}

export function Field({
  label,
  children,
  className = '',
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <FieldLabel>{label}</FieldLabel>
      {children}
    </label>
  )
}

/** Responsive form layout: 1 col → 2 at sm → optional 3 at lg */
export function FormGrid({
  children,
  cols = 2,
}: {
  children: ReactNode
  cols?: 2 | 3
}) {
  return (
    <div
      className={`grid grid-cols-1 gap-3.5 sm:grid-cols-2 ${
        cols === 3 ? 'lg:grid-cols-3' : ''
      }`}
    >
      {children}
    </div>
  )
}

export function FormActions({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 pt-1 min-[420px]:flex-row min-[420px]:flex-wrap sm:col-span-2 lg:col-span-full">
      {children}
    </div>
  )
}
