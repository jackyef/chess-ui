import { cx } from '~/utils/styles'
import { COLUMNS, ROWS } from './constants'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Square as Coordinate } from 'chess.js'
import { Square } from './Square'
import { useChessBoardContext } from './context'
import { Piece } from './Piece'

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
            <div key={row} className={cx('flex flex-row w-full')}>
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
        <button
          className={cx(
            'px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-600 text-white'
          )}
          onClick={() => setIsBoardFlipped((prev) => !prev)}
        >
          Flip board
        </button>

        <button
          className={cx(
            'px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-600 text-white'
          )}
          onClick={() => setShowAttackedSquare((prev) => !prev)}
        >
          Toggle show attacked squares
        </button>

        <button
          className={cx(
            'px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-600 text-white'
          )}
          onClick={() => reset()}
        >
          Reset
        </button>
      </div>
    </div>
  )
}
