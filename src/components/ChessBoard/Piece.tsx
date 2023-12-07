import { Piece as PieceType, PieceColor } from './constants'

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

const pieceImages = {
  'black-bishop': blackBishop,
  'white-bishop': whiteBishop,
  'black-king': blackKing,
  'white-king': whiteKing,
  'black-knight': blackKnight,
  'white-knight': whiteKnight,
  'black-pawn': blackPawn,
  'white-pawn': whitePawn,
  'black-queen': blackQueen,
  'white-queen': whiteQueen,
  'black-rook': blackRook,
  'white-rook': whiteRook
} as const

type Props = {
  piece: PieceType
  pieceColor: PieceColor
}

export const Piece = ({ piece, pieceColor }: Props) => {
  if (!piece) return null

  return (
    <Image
      priority
      className={cx('w-11/12 h-w-11/12')}
      draggable
      alt={`${pieceColor} ${piece}`}
      src={pieceImages[`${pieceColor}-${piece}`]}
    />
  )
}
