export const ROWS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
export const COLUMNS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;

export type Rows = typeof ROWS[number];
export type Columns = typeof COLUMNS[number];
export type Coordinate = `${Columns}${Rows}`

export type PieceColor = 'white' | 'black';
export type Piece = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';

export type BoardState = {
  [k in Coordinate]: {
    piece: Piece;
    color: PieceColor;
  } | null
}

export const DEFAULT_BOARD_INITIAL_STATE = (() => {
  const boardState = {} as BoardState;

  Object.values(ROWS).forEach((row) => {
    Object.values(COLUMNS).forEach((column) => {
      if (row === 2 || row === 7) {
        boardState[`${column}${row}`] = {
          piece: 'pawn',
          color: row === 2 ? 'white' : 'black'
        }
      } else if (row === 1 || row === 8) {
        boardState[`${column}${row}`] = {
          piece: ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'][(COLUMNS.indexOf(column))] as Piece,
          color: row === 1 ? 'white' : 'black'
        }
      } else {
        boardState[`${column}${row}`] = null
      }
    })
  })

  return boardState;
})()
