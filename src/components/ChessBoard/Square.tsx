import { cx } from '~/utils/styles'
import { Coordinate } from './constants'
import { useChessBoardContext } from './context'
import { Piece } from './Piece'
import { isValidPiece } from './helpers'

type Props = {
  coordinate: Coordinate
}

export const Square = ({ coordinate }: Props) => {
  const { boardState } = useChessBoardContext()
  const piece = boardState[coordinate]
  const isBlackSquare =
    (coordinate[0].charCodeAt(0) + Number(coordinate[1])) % 2 === 0

  return (
    <div
      className={cx(
        'w-[12.5%] aspect-square relative flex items-center justify-center',
        isBlackSquare ? 'bg-lime-700' : 'bg-lime-50'
      )}
    >
      <div className={cx('absolute top-1 left-1 text-xs')}>{coordinate}</div>
      {isValidPiece(piece) && (
        <Piece piece={piece.piece} pieceColor={piece.color} />
      )}
    </div>
  )
}
