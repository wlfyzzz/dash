import { type LucideIcon } from 'lucide-react'

export interface Badge {
  name: string;
  priority: number;
  icon?: LucideIcon;
}

export function sortBadges(badges: Badge[]): Badge[] {
  return badges.sort((a, b) => a.priority - b.priority);
}

