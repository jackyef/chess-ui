import { Piece as PieceType, PieceColor } from "./constants";

type Props = {
  piece: PieceType
  pieceColor: PieceColor
}

export const Piece = ({ piece, pieceColor }: Props) => {
  if (!piece) return null

  return (
    // TODO: Replace with image of the piece
    <div className="text-center">{`${pieceColor} ${piece}`}</div>
  )
};
