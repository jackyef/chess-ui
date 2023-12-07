import { Piece } from './constants'

export const isValidPiece = (piece: any): piece is Piece => {
  return Boolean(piece?.piece && piece?.color)
}
