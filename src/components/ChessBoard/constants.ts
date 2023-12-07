import { Color, Square, PieceSymbol } from 'chess.js'

export const ROWS = [1, 2, 3, 4, 5, 6, 7, 8] as const
export const COLUMNS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const

export type Rows = (typeof ROWS)[number]
export type Columns = (typeof COLUMNS)[number]

export type PieceId = `${Color}_${PieceSymbol}_${Square}`

// Map to keep track of square with pieces
export type PieceIdMap = Partial<Record<Square, PieceId>>
