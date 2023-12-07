import { cx } from "~/utils/styles"
import { Square } from "./Square"
import { COLUMNS, Coordinate, ROWS } from "./constants"


export const Board = () => {
  
  return (<div className={cx('w-full')}>
    {ROWS.map((row) => (
      <div key={row} className={cx('flex flex-row w-full')}>
        {COLUMNS.map((column) => {
          const coordinate = `${column}${row}` as Coordinate

          return (
            <Square key={coordinate} coordinate={coordinate} />
          )
        })}
      </div>
    ))}
  </div>)
}
