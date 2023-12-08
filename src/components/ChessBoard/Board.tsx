import { cx } from '~/utils/styles'
import { COLUMNS, ROWS } from './constants'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Square as Coordinate } from 'chess.js'
import { Square } from './Square'
import { useChessBoardContext } from './context'
import { Piece } from './Piece'
import { Button } from '../Button'

export const Board = () => {
  const { chess, pieceIdMap, reset } = useChessBoardContext()
  const [isBoardFlipped, setIsBoardFlipped] = useState(false)
  const [showAttackedSquare, setShowAttackedSquare] = useState(false)

  return (
    <div>
      <div
        className={cx(
          'w-full flex',
          'rounded-lg border border-lime-700 select-none',
          {
            'flex-col-reverse': !isBoardFlipped, // White is at bottom
            'flex-col': isBoardFlipped
          }
        )}
      >
        <AnimatePresence>
          {ROWS.map((row) => (
            <div
              key={row}
              className={cx('flex w-full', {
                'flex-row-reverse': isBoardFlipped,
                'flex-row': !isBoardFlipped // White is at bottom
              })}
            >
              {COLUMNS.map((column) => {
                const coordinate = `${column}${row}` as Coordinate
                const piece = chess.get(coordinate)
                const hasPiece = Boolean(piece)

                return (
                  <div
                    key={coordinate}
                    className={cx('w-full aspect-square relative')}
                  >
                    <div className={cx('absolute inset-0 z-0')}>
                      <Square
                        coordinate={coordinate}
                        isBoardFlipped={isBoardFlipped}
                        showAttackedSquare={showAttackedSquare}
                      />
                    </div>
                    {hasPiece && (
                      <motion.div
                        key={pieceIdMap[coordinate]}
                        data-testid={coordinate}
                        className={cx(
                          'absolute inset-0 z-50 pointer-events-none'
                        )}
                        layoutId={pieceIdMap[coordinate]}
                        transition={{
                          ease: 'easeOut',
                          duration: 0.2
                        }}
                      >
                        <motion.div
                          className={cx('flex items-center justify-center')}
                        >
                          <Piece
                            pieceType={piece.type}
                            pieceColor={piece.color}
                          />
                        </motion.div>
                      </motion.div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </AnimatePresence>
      </div>

      <div className={cx('flex my-4 justify-end gap-2')}>
        <Button onClick={() => setIsBoardFlipped((prev) => !prev)}>
          Flip board
        </Button>

        <Button onClick={() => setShowAttackedSquare((prev) => !prev)}>
          {showAttackedSquare ? 'Hide' : 'Show'} attacked squares
        </Button>

        <Button onClick={() => reset()}>Reset</Button>
      </div>
    </div>
  )
}
