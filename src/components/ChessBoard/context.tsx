import { createContext, useContext, useEffect, useState } from 'react'
import { cx } from '~/utils/styles'
import { Chess, Color, Move, SQUARES, Square } from 'chess.js'
import { PieceIdMap } from './constants'

type ChessBoardContextType = {
  chess: Chess
  toMove: Color
  movePiece: (from: Square, to: Square) => void
  selectedSquare: Square | null
  setSelectedSquare: (coordinate: Square | null) => void
  squaresWithValidMove: Square[]
  lastMove: Move | null
  turnCount: number
  reset: () => void
  pieceIdMap: PieceIdMap
}

const ChessBoardContext = createContext<ChessBoardContextType>({
  chess: new Chess(),
  toMove: 'w',
  movePiece: () => {},
  selectedSquare: null,
  setSelectedSquare: () => {},
  squaresWithValidMove: [],
  lastMove: null,
  turnCount: 0,
  reset: () => {},
  pieceIdMap: {}
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
  const [undoneMoves, setUndoneMoves] = useState<Move[]>([])
  const [pieceIdMap, setPieceIdMap] = useState<PieceIdMap>({})
  const [chess, setChess] = useState(() => {
    return getInitialChessboard(pgnString)
  })
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
  let selectedPiece = null

  useEffect(() => {
    // Construct initial pieceIdMap
    SQUARES.forEach((square) => {
      try {
        const piece = chess.get(square)
        if (piece) {
          setPieceIdMap((prev) => ({
            ...prev,
            [square]: `${piece.color}_${piece.type}_${square}`
          }))
        }
      } catch {}
    })
  }, [chess])

  try {
    selectedPiece = chess.get(selectedSquare!)
  } catch {}

  const movePiece = (from: Square, to: Square) => {
    if (chess.isGameOver()) return

    let hasMovedSuccessfully = false
    // Do move
    try {
      chess.move({ from, to })
      hasMovedSuccessfully = true
    } catch {}

    if (!hasMovedSuccessfully) {
      // TODO: Show UI to pick promotion.
      // For now just auto-promote to queen
      try {
        chess.move({ from, to, promotion: 'q' })
        hasMovedSuccessfully = true
      } catch {}
    }

    if (!hasMovedSuccessfully) {
      // TODO: Show toast error
      // Show toast if invalid move
    }

    // Update pieceIdMap
    if (pieceIdMap[from]) {
      setPieceIdMap((prev) => {
        const newMap = { ...prev }
        delete newMap[from]

        return {
          ...newMap,
          [to]: prev[from]
        }
      })
    }

    // Check if game is over

    setSelectedSquare(null)
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
  const lastMove = chess.history({ verbose: true }).slice(-1)[0]

  return (
    <ChessBoardContext.Provider
      value={{
        chess,
        movePiece,
        toMove: chess.turn(),
        selectedSquare,
        setSelectedSquare,
        lastMove,
        turnCount: chess.history().length,
        squaresWithValidMove,
        reset: () => {
          setChess(getInitialChessboard())
          setSelectedSquare(null)
          forceRerender()
        },
        pieceIdMap
      }}
    >
      <div
        onKeyDown={(e) => {
          if (e.code === 'ArrowRight') {
            try {
              const undoneMove = undoneMoves.pop()

              if (undoneMove) {
                movePiece(undoneMove.from, undoneMove.to)
              }
              forceRerender()
            } catch {}
          } else if (e.code === 'ArrowLeft') {
            try {
              const move = chess.undo()

              if (move) {
                setUndoneMoves((prev) => [...prev, move])
                setPieceIdMap((prev) => {
                  const newMap = { ...prev }
                  delete newMap[move.to]

                  return {
                    ...newMap,
                    [move.from]: prev[move.to]
                  }
                })
              }

              forceRerender()
            } catch {}
          }
        }}
      >
        {children}
      </div>

      <div className={cx('border border-gray-500 bg-gray-200 p-4 rounded-md')}>
        <pre className={cx('break-words')}>
          {chess.pgn({ maxWidth: 50, newline: '\n' })}
        </pre>
      </div>
    </ChessBoardContext.Provider>
  )
}
