import clsx from "clsx"
import { twMerge } from "tailwind-merge"

export const cx = (...classNames: (Parameters<typeof clsx>)) => {
  return twMerge(clsx(...classNames))
}
