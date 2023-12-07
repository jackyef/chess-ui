'use client';

import { Board } from "./Board";
import { ChessBoardContextProvider } from "./context"

export const ChessBoard = () => {
  return (
    <ChessBoardContextProvider>
      <Board />
    </ChessBoardContextProvider>
  )
}
