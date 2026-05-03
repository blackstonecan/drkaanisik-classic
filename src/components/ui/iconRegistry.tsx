import {
  HeartPulse,
  Activity,
  Waves,
  Stethoscope,
  DoorOpen,
  Armchair,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react'

type IconKey =
  | 'heart-pulse'
  | 'activity'
  | 'waves'
  | 'stethoscope'
  | 'door-open'
  | 'armchair'
  | 'clipboard-list'

const REGISTRY: Record<IconKey, LucideIcon> = {
  'heart-pulse': HeartPulse,
  activity: Activity,
  waves: Waves,
  stethoscope: Stethoscope,
  'door-open': DoorOpen,
  armchair: Armchair,
  'clipboard-list': ClipboardList,
}

function getIconKey(value: string): IconKey {
  return (value in REGISTRY ? value : 'heart-pulse') as IconKey
}

type IconProps = {
  iconKey: string
  className?: string
}

export function CategoryIcon({ iconKey, className }: IconProps) {
  const key = getIconKey(iconKey)
  switch (key) {
    case 'heart-pulse':
      return <HeartPulse className={className} aria-hidden />
    case 'activity':
      return <Activity className={className} aria-hidden />
    case 'waves':
      return <Waves className={className} aria-hidden />
    case 'stethoscope':
      return <Stethoscope className={className} aria-hidden />
    case 'door-open':
      return <DoorOpen className={className} aria-hidden />
    case 'armchair':
      return <Armchair className={className} aria-hidden />
    case 'clipboard-list':
      return <ClipboardList className={className} aria-hidden />
  }
}
