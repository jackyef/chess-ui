import { cx } from "~/utils/styles"
import { Coordinate } from "./constants"
import { useChessBoardContext } from "./context"
import { Piece } from "./Piece"
import { isValidPiece } from "./helpers"

type Props = {
  coordinate: Coordinate
}

export const Square = ({ coordinate }: Props) => {
  const { boardState } = useChessBoardContext()
  const piece = boardState[coordinate]
  const squareColor = (coordinate[0].charCodeAt(0) + Number(coordinate[1])) % 2 === 0 ? 'bg-gray-300' : 'bg-gray-700'
  
  return (
    <div className={cx('w-[12.5%] aspect-square relative flex items-center', squareColor)}>
      <div className={cx('absolute top-1 left-1 text-xs')}>{coordinate}</div>
      {isValidPiece(piece) && <Piece piece={piece.piece} pieceColor={piece.color}  />}
    </div>
  )
}
