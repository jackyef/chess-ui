import { cx } from '~/utils/styles'

export const Button = ({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cx(
        'px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-600 text-white',
        className
      )}
      {...props}
    />
  )
}
