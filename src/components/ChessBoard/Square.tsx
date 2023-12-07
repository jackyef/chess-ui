import { cx } from '~/utils/styles'
import { Coordinate } from './constants'
import { useChessBoardContext } from './context'
import { Piece } from './Piece'
import { isValidPiece } from './helpers'

type Props = {
  coordinate: Coordinate
}

export const Square = ({ coordinate }: Props) => {
  const { boardState, toMove, setSelectedSquare, selectedSquare } =
    useChessBoardContext()
  const piece = boardState[coordinate]
  const isBlackSquare =
    (coordinate[0].charCodeAt(0) + Number(coordinate[1])) % 2 === 0
  const isSelectedSquare = selectedSquare === coordinate

  return (
    <button
      className={cx(
        'w-[12.5%] aspect-square relative',
        isBlackSquare ? 'bg-lime-700 text-lime-50' : 'bg-lime-50 text-lime-800',
        toMove !== piece?.color && 'pointer-events-none cursor-not-allowed'
      )}
      onClick={() => setSelectedSquare(coordinate)}
    >
      {isSelectedSquare && (
        <div
          className={cx(
            'absolute inset-0 pointer-events-none z-0',
            isBlackSquare ? 'bg-lime-600' : 'bg-lime-200'
          )}
        />
      )}
      <div className={cx('absolute top-1 left-1 text-xs')}>{coordinate}</div>
      {isValidPiece(piece) && (
        <div
          className={cx(
            'absolute inset-0 flex items-center justify-center z-1'
          )}
        >
          <Piece piece={piece.piece} pieceColor={piece.color} />
        </div>
      )}
    </button>
  )
}
