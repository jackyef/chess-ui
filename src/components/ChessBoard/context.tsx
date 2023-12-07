import { createContext, useContext, useState } from 'react'
import {
  BoardState,
  Coordinate,
  DEFAULT_BOARD_INITIAL_STATE,
  PieceColor
} from './constants'

type ChessBoardContextType = {
  boardState: BoardState
  toMove: PieceColor
  movePiece: (from: Coordinate, to: Coordinate) => void
  selectedSquare: Coordinate | null
  setSelectedSquare: (coordinate: Coordinate | null) => void
}

const ChessBoardContext = createContext<ChessBoardContextType>({
  boardState: DEFAULT_BOARD_INITIAL_STATE,
  toMove: 'white',
  movePiece: () => {},
  selectedSquare: null,
  setSelectedSquare: () => {}
})

export const useChessBoardContext = () => {
  return useContext(ChessBoardContext)
}

const getInitialBoardState = (boardStateSeed?: string): BoardState => {
  if (boardStateSeed) {
    // TODO: Generate board state from PGN string somehow
    return DEFAULT_BOARD_INITIAL_STATE
  }

  return DEFAULT_BOARD_INITIAL_STATE
}

type Props = {
  // A PGN string See: https://www.chess.com/terms/chess-pgn
  boardStateSeed?: string
  children?: React.ReactNode
}

export const ChessBoardContextProvider = ({
  boardStateSeed,
  children
}: Props) => {
  const [boardState, setBoardState] = useState(() => {
    return getInitialBoardState(boardStateSeed)
  })
  const [selectedSquare, setSelectedSquare] = useState<Coordinate | null>(null)

  const toMove = boardState.turnCount % 2 === 0 ? 'white' : 'black'

  const movePiece = (from: Coordinate, to: Coordinate) => {
    const piece = boardState[from]

    // Check if the move is valid
    if (!piece) {
      console.error(`No piece found at ${from}`)
    }

    // TODO: Do other checks

    // Move the piece
    setBoardState((prevBoardState) => {
      const newBoardState = { ...prevBoardState }
      newBoardState[to] = piece
      newBoardState[from] = null

      return newBoardState
    })
  }

  return (
    <ChessBoardContext.Provider
      value={{
        boardState,
        movePiece,
        toMove,
        selectedSquare,
        setSelectedSquare
      }}
    >
      {children}
    </ChessBoardContext.Provider>
  )
}
