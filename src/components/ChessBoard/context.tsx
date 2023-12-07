import { createContext, useContext, useState } from 'react'
import { cx } from '~/utils/styles'
import { Chess, Color, Square } from 'chess.js'

type ChessBoardContextType = {
  chess: Chess
  toMove: Color
  movePiece: (from: Square, to: Square) => void
  selectedSquare: Square | null
  setSelectedSquare: (coordinate: Square | null) => void
  squaresWithValidMove: Square[]
  lastMovedSquare: Square | null
}

const ChessBoardContext = createContext<ChessBoardContextType>({
  chess: new Chess(),
  toMove: 'w',
  movePiece: () => {},
  selectedSquare: null,
  setSelectedSquare: () => {},
  squaresWithValidMove: [],
  lastMovedSquare: null
})

export const useChessBoardContext = () => {
  return useContext(ChessBoardContext)
}

const getInitialChessboard = (pgnString?: string): Chess => {
  const chess = new Chess()

  if (pgnString) {
    chess.loadPgn(pgnString)
  }

  return chess
}

type Props = {
  //See: https://www.chess.com/terms/chess-pgn
  pgnString?: string
  children?: React.ReactNode
}

export const ChessBoardContextProvider = ({
  pgnString = '',
  children
}: Props) => {
  const [, setBooleanValue] = useState(false)
  const forceRerender = () => setBooleanValue((prev) => !prev)
  const [chess] = useState(() => {
    return getInitialChessboard(pgnString)
  })
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
  let selectedPiece = null

  try {
    selectedPiece = chess.get(selectedSquare!)
  } catch {}

  const movePiece = (from: Square, to: Square) => {
    if (chess.isGameOver()) return

    // Do move
    chess.move({ from, to })
    // Show toast if invalid move
    // Check if game is over

    forceRerender()
  }

  const squaresWithValidMove = selectedPiece
    ? chess
        .moves({
          square: selectedSquare!,
          verbose: true
        })
        .map((move) => move.to)
    : []

  return (
    <ChessBoardContext.Provider
      value={{
        chess,
        movePiece,
        toMove: chess.turn(),
        selectedSquare,
        setSelectedSquare,
        lastMovedSquare: chess.history({ verbose: true }).slice(-1)[0]?.to,
        squaresWithValidMove
      }}
    >
      {children}

      <div className={cx('border border-gray-500 bg-gray-200')}>
        <pre>{chess.pgn()}</pre>
      </div>
    </ChessBoardContext.Provider>
  )
}
