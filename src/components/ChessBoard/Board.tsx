import { cx } from '~/utils/styles'
import { COLUMNS, ROWS } from './constants'
import { useState } from 'react'
import { Square as Coordinate } from 'chess.js'
import { Square } from './Square'

export const Board = () => {
  const [isBoardFlipped, setIsBoardFlipped] = useState(false)

  return (
    <div>
      <div
        className={cx('w-full flex', 'rounded-lg border border-lime-700', {
          'flex-col-reverse': !isBoardFlipped, // White is at bottom
          'flex-col': isBoardFlipped
        })}
      >
        {ROWS.map((row) => (
          <div key={row} className={cx('flex flex-row w-full')}>
            {COLUMNS.map((column) => {
              const coordinate = `${column}${row}` as Coordinate

              return (
                <Square
                  key={coordinate}
                  coordinate={coordinate}
                  isBoardFlipped={isBoardFlipped}
                />
              )
            })}
          </div>
        ))}
      </div>

      <div className={cx('flex my-4 justify-end')}>
        <button
          className={cx(
            'px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-600 text-white'
          )}
          onClick={() => setIsBoardFlipped((prev) => !prev)}
        >
          Flip board
        </button>
      </div>
    </div>
  )
}
