import * as Popover from '@radix-ui/react-popover'
import { Check, ChevronDown } from 'lucide-react'

type Option<T extends string> = { id: T; title: string; image: string }

export function ModelPicker<T extends string>({ label, value, placeholder, options, onChange, compact = false, container }: {
  label: string
  value: T | ''
  placeholder: string
  options: Option<T>[]
  onChange: (id: T) => void
  compact?: boolean
  container?: HTMLElement | null
}) {
  const selected = options.find(option => option.id === value)
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button type="button" aria-label={label} className={`flex min-h-11 max-w-full items-center gap-2 rounded-xl border border-[#14120F]/15 bg-[#fffdf8] px-2.5 text-start text-[#27231d] shadow-sm focus-visible:outline-2 ${compact ? '' : 'w-full'}`}>
          {selected && <img src={selected.image} alt="" width="48" height="34" className={`rounded-md object-cover ${compact ? 'h-7 w-9' : 'h-9 w-12'}`} />}
          <span className="min-w-0 flex-1 text-[13px] font-semibold leading-tight">
            {!compact && <span className="block text-[10px] font-normal text-[#635a4e]">{label}</span>}
            {selected?.title ?? placeholder}
          </span>
          <ChevronDown aria-hidden size={15} />
        </button>
      </Popover.Trigger>
      <Popover.Portal container={container}>
        <Popover.Content align="start" side="bottom" sideOffset={6} collisionPadding={8} aria-label={label} className="z-[85] max-h-[var(--radix-popover-content-available-height)] w-[min(22rem,calc(100vw-24px))] overflow-y-auto overscroll-contain rounded-2xl border border-[#d6cfc0] bg-[#fcfaf6] p-2.5 shadow-[0_14px_40px_#30251935]">
          <div className="grid grid-cols-2 gap-1.5">
            {options.map(option => (
              <Popover.Close asChild key={option.id}>
                <button type="button" aria-pressed={value === option.id} onClick={() => onChange(option.id)} className="relative flex min-h-14 flex-col overflow-hidden rounded-lg border border-[#d9d2c5] bg-white text-start text-xs font-medium text-[#302b24] focus-visible:outline-2 aria-pressed:border-[#4d5859]">
                  <img src={option.image} alt="" width="140" height="66" className="h-[clamp(36px,6svh,60px)] w-full object-contain bg-[#f0ebe2]" />
                  <span className="px-2 py-1.5">{option.title}</span>
                  {value === option.id && <Check aria-hidden size={15} className="absolute end-1 top-1 rounded-full bg-[#263135] p-0.5 text-white" />}
                </button>
              </Popover.Close>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
