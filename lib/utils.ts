import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000000000) {
    return `$${(num / 1000000000000).toFixed(2)} ტრილიონი`
  } else if (num >= 1000000000) {
    return `$${(num / 1000000000).toFixed(2)} მილიარდი`
  } else if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(2)} მილიონი`
  } else if (num >= 1000) {
    return `$${(num / 1000).toFixed(2)} ათასი`
  } else {
    return `$${num.toFixed(2)}`
  }
}
