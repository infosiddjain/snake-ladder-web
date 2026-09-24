// Board and types shared with the app (SnakeGame/src/constants/board.ts,
// SnakeGame/src/types) and the server — keep them in sync.

export const BOARD_SIZE = 10;
export const FINAL_SQUARE = BOARD_SIZE * BOARD_SIZE;

// Snake head -> tail
export const SNAKES: Record<number, number> = {
  17: 7, 54: 34, 62: 19, 64: 60, 87: 36, 93: 73, 95: 75, 98: 79,
};
// Ladder bottom -> top
export const LADDERS: Record<number, number> = {
  1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 51: 67, 72: 91, 80: 99,
};

// Same pacing as the app, so everyone in a room sees moves finish together.
export const DICE_ANIMATION_MS = 700;
export const DICE_FRAME_MS = 80;
export const STEP_MS = 280;
export const SLIDE_PAUSE_MS = 250;
export const SLIDE_MS = 800;

export interface Player {
  id: number;
  name: string;
  color: string;
  position: number;
}

export interface GameState {
  players: Player[];
  currentPlayer: number;
  lastRoll: number | null;
  status: "playing" | "won";
  winner: Player | null;
  message: string;
}

export interface RoomPlayer {
  id: number;
  name: string;
  color: string;
  connected: boolean;
}

export interface Room {
  code: string;
  hostId: number;
  players: RoomPlayer[];
  game: GameState | null;
}

export type ServerMessage =
  | { type: "joined"; code: string; playerId: number }
  | { type: "room"; room: Room }
  | { type: "rolled"; playerId: number; roll: number; game: GameState }
  | { type: "error"; message: string };

export type ClientMessage =
  | { type: "create"; name: string }
  | { type: "join"; code: string; name: string }
  | { type: "start" }
  | { type: "roll" }
  | { type: "leave" };

export const rollDie = () => Math.floor(Math.random() * 6) + 1;

const resolveSquare = (square: number) =>
  SNAKES[square] ?? LADDERS[square] ?? square;

/** Squares a token walks through one by one, plus any snake/ladder jump. */
export const getMovePath = (position: number, roll: number) => {
  const landed = position + roll;
  if (landed > FINAL_SQUARE) {
    return { steps: [] as number[], jumpTo: null };
  }
  const steps = Array.from({ length: roll }, (_, i) => position + i + 1);
  const final = resolveSquare(landed);
  return { steps, jumpTo: final === landed ? null : final };
};

/**
 * Squares zig-zag upward: the bottom row runs left to right, the next right
 * to left, and so on. Row 0 is the top row.
 */
export const squareToCell = (square: number) => {
  const index = square - 1;
  const rowFromBottom = Math.floor(index / BOARD_SIZE);
  const offset = index % BOARD_SIZE;
  const col = rowFromBottom % 2 === 0 ? offset : BOARD_SIZE - 1 - offset;
  return { row: BOARD_SIZE - 1 - rowFromBottom, col };
};

export const cellToSquare = (row: number, col: number) => {
  const rowFromBottom = BOARD_SIZE - 1 - row;
  const offset = rowFromBottom % 2 === 0 ? col : BOARD_SIZE - 1 - col;
  return rowFromBottom * BOARD_SIZE + offset + 1;
};

/** Centre of a square in board units, where the board is 100 x 100. */
export const squareCenter = (square: number) => {
  const { row, col } = squareToCell(square);
  const cell = 100 / BOARD_SIZE;
  return { x: (col + 0.5) * cell, y: (row + 0.5) * cell };
};
