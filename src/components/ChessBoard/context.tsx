import { createContext, useContext, useEffect, useState } from 'react'
import { cx } from '~/utils/styles'
import { Chess, Color, Move, SQUARES, Square } from 'chess.js'
import { PieceIdMap, PieceWithColor } from './constants'
import { Button } from '../Button'

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

  try {
    selectedPiece = chess.get(selectedSquare!)
  } catch {}

  useEffect(() => {
    // Construct initial pieceIdMap
    const pieceIdMap: PieceIdMap = {}
    const seenPieces: Partial<Record<PieceWithColor, number>> = {}

    SQUARES.forEach((square) => {
      try {
        const piece = chess.get(square)
        if (piece) {
          const piecePrefix = `${piece.color}_${piece.type}` as PieceWithColor
          seenPieces[piecePrefix] = (seenPieces[piecePrefix] ?? 0) + 1

          pieceIdMap[square] = `${piecePrefix}_${
            seenPieces[piecePrefix] as number
          }`
        }
      } catch {}
    })

    setPieceIdMap(pieceIdMap)
  }, [chess])

  const undoMove = () => {
    const move = chess.undo()

    if (!move) return

    setUndoneMoves((prev) => [...prev, move])
    setPieceIdMap((prev) => {
      const newMap = { ...prev }

      if (move.captured) {
        const piece = chess.get(move.to)
        const piecePrefix = `${piece.color}_${piece.type}` as PieceWithColor
        const currentNumberOfSamePieceOnTheBoard = (() => {
          let count = 0
          SQUARES.forEach((square) => {
            try {
              const piece = chess.get(square)
              if (piece) {
                const prefix = `${piece.color}_${piece.type}` as PieceWithColor

                if (piecePrefix === prefix) {
                  count += 1
                }
              }
            } catch {}
          })

          return count
        })()

        if (piece) {
          newMap[move.to] = `${piece.color}_${piece.type}_${
            currentNumberOfSamePieceOnTheBoard + 1
          }`
        } else {
          delete newMap[move.to]
        }
      } else if (move.san === 'O-O') {
        // Castle kingside
        // We need to update rook position too
        const square = move.color === 'w' ? 'f1' : 'f8'
        const targetSquare = move.color === 'w' ? 'h1' : 'h8'
        const rook = chess.get(targetSquare)

        if (rook) {
          const pieceId = pieceIdMap[square]
          newMap[targetSquare] = pieceId
        }
      } else if (move.san === 'O-O-O') {
        // Castle queenside
        // We need to update rook position too
        const square = move.color === 'w' ? 'd1' : 'd8'
        const targetSquare = move.color === 'w' ? 'a1' : 'a8'
        const rook = chess.get(targetSquare)

        if (rook) {
          const pieceId = pieceIdMap[square]
          newMap[targetSquare] = pieceId
        }
      } else {
        delete newMap[move.to]
      }

      return {
        ...newMap,
        [move.from]: prev[move.to]
      }
    })
  }
  const movePiece = (
    from: Square,
    to: Square,
    shouldClearUndoneMoves = true
  ) => {
    if (chess.isGameOver()) return

    let move: Move | null = null
    // Do move
    try {
      move = chess.move({ from, to })
    } catch {}

    if (!move) {
      // TODO: Show UI to pick promotion.
      // For now just auto-promote to queen
      try {
        move = chess.move({ from, to, promotion: 'q' })
      } catch {}
    }

    if (!move) {
      // TODO: Show toast error
      // Show toast if invalid move
    }

    // Update pieceIdMap
    if (pieceIdMap[from]) {
      setPieceIdMap((prev) => {
        const newMap = { ...prev }
        delete newMap[from]

        if (!move) return newMap

        if (move.san === 'O-O') {
          // Castle kingside
          // We need to update rook position too
          const square = move.color === 'w' ? 'h1' : 'h8'
          const targetSquare = move.color === 'w' ? 'f1' : 'f8'
          const rook = chess.get(targetSquare)

          if (rook) {
            const pieceId = prev[square]
            newMap[targetSquare] = pieceId
          }
        } else if (move.san === 'O-O-O') {
          // Castle queenside
          // We need to update rook position too
          const square = move.color === 'w' ? 'a1' : 'a8'
          const targetSquare = move.color === 'w' ? 'd1' : 'd8'
          const rook = chess.get(targetSquare)

          if (rook) {
            const pieceId = prev[square]
            newMap[targetSquare] = pieceId
          }
        }

        return {
          ...newMap,
          [to]: prev[from]
        }
      })
    }

    // Clear undone moves.
    if (shouldClearUndoneMoves) {
      setUndoneMoves([])
    }

    // TODO: Check if game is over
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
                movePiece(undoneMove.from, undoneMove.to, false)
              }
            } catch {}
          } else if (e.code === 'ArrowLeft') {
            try {
              undoMove()
            } catch {}
          }
        }}
      >
        {children}
      </div>

      <div className={cx('border border-gray-500 bg-gray-100 p-4 rounded-md')}>
        {!lastMove && !undoneMoves.length ? (
          <form
            className={cx('w-full')}
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              const pgnString = formData.get('pgn') as string
              setChess(getInitialChessboard(pgnString))
            }}
          >
            <textarea
              className="w-full bg-transparent font-mono"
              name="pgn"
              placeholder="Paste PGN here (optional)"
            ></textarea>

            <Button type="submit">Load PGN</Button>
          </form>
        ) : (
          <pre className={cx('break-words')}>
            {chess.pgn({ maxWidth: 50, newline: '\n' })}
          </pre>
        )}
      </div>
    </ChessBoardContext.Provider>
  )
}
