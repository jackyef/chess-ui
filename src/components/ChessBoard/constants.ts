export const ROWS = [1, 2, 3, 4, 5, 6, 7, 8] as const
export const COLUMNS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const

export type Rows = (typeof ROWS)[number]
export type Columns = (typeof COLUMNS)[number]

export type PieceColor = 'white' | 'black'
export type Piece = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king'
export type PieceNotation = '' | 'r' | 'n' | 'b' | 'q' | 'k'
