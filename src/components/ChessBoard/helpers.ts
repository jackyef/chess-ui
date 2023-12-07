import {
  BoardState,
  COLUMNS,
  Columns,
  Coordinate,
  Piece,
  ROWS,
  Rows
} from './constants'

export const isValidPiece = (piece: any): piece is Piece => {
  return Boolean(piece?.piece && piece?.color)
}

export const splitCoordinate = (coordinate: Coordinate): [Columns, Rows] => {
  return coordinate.split('') as [Columns, Rows]
}

type Direction =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'upLeft'
  | 'upRight'
  | 'downLeft'
  | 'downRight'

const isWithinBounds = (n: number, min: number, max: number) => {
  return n >= min && n <= max
}

export const getRelativeCoordinates = (
  anchor: Coordinate,
  direction: Direction,
  maxDistance = Number.MAX_SAFE_INTEGER
) => {
  const [anchorColumn, anchorRow] = splitCoordinate(anchor)

  const columnNumber = COLUMNS.indexOf(anchorColumn) + 1
  const rowNumber = Number(anchorRow)
  const xDirection = direction.includes('left')
    ? -1
    : direction.includes('right')
    ? 1
    : 0
  const yDirection = direction.includes('up')
    ? 1
    : direction.includes('down')
    ? -1
    : 0

  const possibleCoordinates: Coordinate[] = []

  if (xDirection !== 0 && yDirection !== 0) {
    let currCol = columnNumber + xDirection
    let currRow = rowNumber + yDirection
    let counter = maxDistance

    while (
      isWithinBounds(currCol, 1, 8) &&
      isWithinBounds(currRow, 1, 8) &&
      counter > 0
    ) {
      possibleCoordinates.push(
        `${COLUMNS[currCol - 1]}${ROWS[currRow - 1]}` as Coordinate
      )

      currCol = currCol + xDirection
      currRow = currRow + yDirection
      counter = counter - 1
    }
  } else if (yDirection !== 0) {
    let curr = rowNumber + yDirection
    let counter = maxDistance

    while (curr > 0 && curr < 9 && counter > 0) {
      possibleCoordinates.push(`${anchorColumn}${ROWS[curr - 1]}` as Coordinate)

      curr = curr + yDirection
      counter = counter - 1
    }
  } else if (xDirection !== 0) {
    let curr = columnNumber + xDirection
    let counter = maxDistance

    while (curr > 0 && curr < 9 && counter > 0) {
      possibleCoordinates.push(`${COLUMNS[curr - 1]}${anchorRow}` as Coordinate)

      curr = curr + xDirection
      counter = counter - 1
    }
  }

  return possibleCoordinates
}

export const calculateValidMoves = (
  boardState: BoardState,
  selectedSquare: Coordinate
): Coordinate[] => {
  const selectedPiece = boardState[selectedSquare]

  if (!selectedPiece) {
    return []
  }

  const validMoves: Coordinate[] = []

  if (selectedPiece.piece === 'pawn') {
    // Pawns can only move forward. For white piece, that means up. For black piece, that means down.
    const direction = selectedPiece.color === 'white' ? 'up' : 'down'
    // If the pawn is still in its starting position, it can move two squares forward.
    const maxForwardDistance =
      selectedSquare.endsWith('2') || selectedSquare.endsWith('7') ? 2 : 1

    validMoves.push(
      ...getRelativeCoordinates(selectedSquare, direction, maxForwardDistance)
    )

    // Pawns can also capture diagonally.
    const diagonalDirections =
      selectedPiece.color === 'white'
        ? (['upLeft', 'upRight'] as const)
        : (['downLeft', 'downRight'] as const)

    const possibleDiagonalSquares = [
      ...getRelativeCoordinates(selectedSquare, diagonalDirections[0], 1),
      ...getRelativeCoordinates(selectedSquare, diagonalDirections[1], 1)
    ].filter((coordinate) => {
      // Only include squares that have opposing piece.
      const piece = boardState[coordinate]

      return Boolean(piece && piece.color !== selectedPiece.color)
    })

    validMoves.push(...possibleDiagonalSquares)
  }

  return validMoves
}
