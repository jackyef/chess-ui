import blackBishop from './assets/black-bishop.svg'
import whiteBishop from './assets/white-bishop.svg'
import blackKing from './assets/black-king.svg'
import whiteKing from './assets/white-king.svg'
import blackKnight from './assets/black-knight.svg'
import whiteKnight from './assets/white-knight.svg'
import blackPawn from './assets/black-pawn.svg'
import whitePawn from './assets/white-pawn.svg'
import blackQueen from './assets/black-queen.svg'
import whiteQueen from './assets/white-queen.svg'
import blackRook from './assets/black-rook.svg'
import whiteRook from './assets/white-rook.svg'
import Image from 'next/image'
import { cx } from '~/utils/styles'
import { Color, PieceSymbol } from 'chess.js'

const pieceImages = {
  'b-b': blackBishop,
  'w-b': whiteBishop,
  'b-k': blackKing,
  'w-k': whiteKing,
  'b-n': blackKnight,
  'w-n': whiteKnight,
  'b-p': blackPawn,
  'w-p': whitePawn,
  'b-q': blackQueen,
  'w-q': whiteQueen,
  'b-r': blackRook,
  'w-r': whiteRook
} as const

type Props = {
  pieceType: PieceSymbol
  pieceColor: Color
}

export const Piece = ({ pieceType, pieceColor }: Props) => {
  if (!pieceType) return null

  return (
    <Image
      priority
      className={cx('w-11/12 h-w-11/12')}
      draggable
      alt={`${pieceColor} ${pieceType}`}
      src={pieceImages[`${pieceColor}-${pieceType}`]}
    />
  )
}
