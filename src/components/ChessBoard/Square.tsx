import { cx } from '~/utils/styles'
import { useChessBoardContext } from './context'
import { Square as Coordinate } from 'chess.js'
import { motion } from 'framer-motion'

type Props = {
  coordinate: Coordinate
  isBoardFlipped: boolean
  showAttackedSquare: boolean
}

export const Square = ({
  coordinate,
  isBoardFlipped,
  showAttackedSquare
}: Props) => {
  const {
    chess,
    toMove,
    setSelectedSquare,
    selectedSquare,
    movePiece,
    squaresWithValidMove,
    lastMove
  } = useChessBoardContext()
  const piece = chess.get(coordinate)
  const hasPiece = Boolean(piece)
  const isBlackSquare = chess.squareColor(coordinate) === 'dark'
  const isSelectedSquare = selectedSquare === coordinate
  const isValidMovePosition = squaresWithValidMove.includes(coordinate)
  const isLastMovedSquare = lastMove?.to === coordinate
  const isAttackedByWhite = showAttackedSquare
    ? chess.isAttacked(coordinate, 'w')
    : false
  const isAttackedByBlack = showAttackedSquare
    ? chess.isAttacked(coordinate, 'b')
    : false

  const attackedSquareIndicator = (() => {
    if (isAttackedByWhite || isAttackedByBlack) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cx(
            'absolute inset-0 pointer-events-none z-0 transition-colors duration-300',
            isBlackSquare
              ? {
                  'bg-red-400': isAttackedByWhite,
                  'bg-blue-400': isAttackedByBlack,
                  'bg-violet-400': isAttackedByBlack && isAttackedByWhite
                }
              : {
                  'bg-red-200': isAttackedByWhite,
                  'bg-blue-200': isAttackedByBlack,
                  'bg-violet-200': isAttackedByBlack && isAttackedByWhite
                }
          )}
        />
      )
    }
  })()

  return (
    <button
      disabled={toMove !== piece?.color && !isValidMovePosition}
      className={cx(
        'w-full aspect-square relative outline-none',
        isBlackSquare ? 'bg-lime-700 text-lime-50' : 'bg-lime-50 text-lime-800',

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

      {attackedSquareIndicator}

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
    </button>
  )
}
