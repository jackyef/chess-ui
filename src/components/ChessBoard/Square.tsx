import { cx } from '~/utils/styles'
import { useChessBoardContext } from './context'
import { Piece } from './Piece'
import { Square as Coordinate } from 'chess.js'

type Props = {
  coordinate: Coordinate
  isBoardFlipped: boolean
}

export const Square = ({ coordinate, isBoardFlipped }: Props) => {
  const {
    chess,
    toMove,
    setSelectedSquare,
    selectedSquare,
    movePiece,
    squaresWithValidMove,
    lastMovedSquare
  } = useChessBoardContext()
  const piece = chess.get(coordinate)
  const isBlackSquare =
    (coordinate[0].charCodeAt(0) + Number(coordinate[1])) % 2 === 0
  const isSelectedSquare = selectedSquare === coordinate
  const isValidMovePosition = squaresWithValidMove.includes(coordinate)
  const hasPiece = Boolean(piece)
  const isLastMovedSquare = lastMovedSquare === coordinate

  return (
    <button
      className={cx(
        'w-[12.5%] aspect-square relative',
        isBlackSquare ? 'bg-lime-700 text-lime-50' : 'bg-lime-50 text-lime-800',
        toMove !== piece?.color &&
          !isValidMovePosition &&
          'pointer-events-none cursor-not-allowed',

        // Handling pesky rounded corners
        {
          'rounded-tl-lg': isBoardFlipped
            ? coordinate === 'a1'
            : coordinate === 'a8',
          'rounded-tr-lg': isBoardFlipped
            ? coordinate === 'h1'
            : coordinate === 'h8',
          'rounded-bl-lg': isBoardFlipped
            ? coordinate === 'a8'
            : coordinate === 'a1',
          'rounded-br-lg': isBoardFlipped
            ? coordinate === 'h8'
            : coordinate === 'h1'
        }
      )}
      onClick={() => {
        if (isValidMovePosition) {
          movePiece(selectedSquare!, coordinate)
        } else {
          setSelectedSquare(coordinate)
        }
      }}
    >
      {isSelectedSquare && (
        <div
          className={cx(
            'absolute inset-0 pointer-events-none z-0',
            isBlackSquare ? 'bg-lime-600' : 'bg-lime-200'
          )}
        />
      )}
      {isLastMovedSquare && (
        <div
          className={cx(
            'absolute inset-0 pointer-events-none z-0',
            isBlackSquare ? 'bg-yellow-700' : 'bg-yellow-300'
          )}
        />
      )}
      {isValidMovePosition && (
        <div
          className={cx(
            'absolute inset-0 z-2 flex items-center justify-center'
          )}
        >
          {hasPiece ? (
            <div
              className={cx(
                'rounded-full w-full aspect-square z-1 opacity-50 border-8',
                isBlackSquare ? 'border-gray-200' : 'border-gray-600'
              )}
            ></div>
          ) : (
            <div
              className={cx(
                'rounded-full w-1/4 aspect-square z-1 opacity-50',
                isBlackSquare ? 'bg-gray-200' : 'bg-gray-600'
              )}
            ></div>
          )}
        </div>
      )}
      <div className={cx('absolute top-1 left-1 text-xs select-none')}>
        {coordinate}
      </div>
      {hasPiece && (
        <div
          className={cx(
            'absolute inset-0 flex items-center justify-center z-1'
          )}
        >
          <Piece pieceType={piece.type} pieceColor={piece.color} />
        </div>
      )}
    </button>
  )
}
