import { ChessBoard } from '~/components/ChessBoard'
import { cx } from '~/utils/styles'

export default function Home() {
  return (
    <main
      className={cx(
        'my-0 mx-auto px-2 py-2 w-full max-w-3xl',
        'md:px-4 md:py-6'
      )}
    >
      <div>
        <ChessBoard />
      </div>
    </main>
  )
}
