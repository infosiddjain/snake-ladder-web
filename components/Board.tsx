import {
  BOARD_SIZE,
  cellToSquare,
  FINAL_SQUARE,
  LADDERS,
  Player,
  SNAKES,
  squareCenter,
} from "@/lib/game";

const CELL_COLORS = ["#f7e7c4", "#dcebd2", "#f5d3cf", "#d6e4f2", "#fbeccb"];
const SNAKE_SKINS = [
  { body: "#2e7d32", stripe: "#f9d34a", head: "#1b5e20" },
  { body: "#b71c1c", stripe: "#1f1f1f", head: "#8e1414" },
  { body: "#6a1b9a", stripe: "#f3d98b", head: "#4a148c" },
  { body: "#0d47a1", stripe: "#e3f2fd", head: "#0a3378" },
  { body: "#e65100", stripe: "#3e2723", head: "#bf4300" },
];
const RUNG_GAP = 3.2;
const RAIL_OFFSET = 1.6;

const Ladder = ({ from, to }: { from: number; to: number }) => {
  const a = squareCenter(from);
  const b = squareCenter(to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy);
  // Unit normal, to set the two rails apart.
  const nx = (-dy / length) * RAIL_OFFSET;
  const ny = (dx / length) * RAIL_OFFSET;
  const rungs = Math.floor(length / RUNG_GAP);
  return (
    <g stroke="#8b5a2b" strokeLinecap="round">
      {Array.from({ length: rungs }, (_, i) => {
        const t = (i + 0.5) / rungs;
        const x = a.x + dx * t;
        const y = a.y + dy * t;
        return (
          <line key={i} x1={x - nx} y1={y - ny} x2={x + nx} y2={y + ny} strokeWidth={0.7} stroke="#c8894d" />
        );
      })}
      <line x1={a.x - nx} y1={a.y - ny} x2={b.x - nx} y2={b.y - ny} strokeWidth={0.9} />
      <line x1={a.x + nx} y1={a.y + ny} x2={b.x + nx} y2={b.y + ny} strokeWidth={0.9} />
    </g>
  );
};

const Snake = ({ head, tail, skin }: { head: number; tail: number; skin: number }) => {
  const h = squareCenter(head);
  const t = squareCenter(tail);
  const colors = SNAKE_SKINS[skin % SNAKE_SKINS.length];
  // Bend the body sideways so it reads as a snake, not a line.
  const dx = t.x - h.x;
  const dy = t.y - h.y;
  const bend = skin % 2 === 0 ? 0.35 : -0.35;
  const c1 = { x: h.x + dx * 0.3 - dy * bend, y: h.y + dy * 0.3 + dx * bend };
  const c2 = { x: h.x + dx * 0.7 + dy * bend, y: h.y + dy * 0.7 - dx * bend };
  const d = `M ${h.x} ${h.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${t.x} ${t.y}`;
  return (
    <g>
      <path d={d} fill="none" stroke={colors.body} strokeWidth={2.4} strokeLinecap="round" />
      <path d={d} fill="none" stroke={colors.stripe} strokeWidth={0.6} strokeDasharray="1 1.4" strokeLinecap="round" />
      <circle cx={h.x} cy={h.y} r={2} fill={colors.head} />
      <circle cx={h.x - 0.7} cy={h.y - 0.5} r={0.45} fill="#fff" />
      <circle cx={h.x + 0.7} cy={h.y - 0.5} r={0.45} fill="#fff" />
      <circle cx={h.x - 0.7} cy={h.y - 0.5} r={0.22} fill="#111" />
      <circle cx={h.x + 0.7} cy={h.y - 0.5} r={0.22} fill="#111" />
    </g>
  );
};

const ROWS = Array.from({ length: BOARD_SIZE }, (_, i) => i);
// Tokens sharing a square fan out around its centre.
const TOKEN_OFFSETS = [
  { x: -1.6, y: -1.6 },
  { x: 1.6, y: -1.6 },
  { x: -1.6, y: 1.6 },
  { x: 1.6, y: 1.6 },
];

export default function Board({ players }: { players: Player[] }) {
  return (
    <div className="board-frame">
      <div className="board">
        <div className="board-grid">
          {ROWS.map((row) =>
            ROWS.map((col) => {
              const square = cellToSquare(row, col);
              return (
                <div
                  key={square}
                  className="board-cell"
                  style={{
                    background:
                      square === FINAL_SQUARE ? "#e9c75a" : CELL_COLORS[square % CELL_COLORS.length],
                  }}
                >
                  {square === FINAL_SQUARE ? "♛" : square}
                </div>
              );
            }),
          )}
        </div>
        <svg className="board-overlay" viewBox="0 0 100 100" aria-hidden>
          {Object.entries(LADDERS).map(([from, to]) => (
            <Ladder key={from} from={+from} to={to} />
          ))}
          {Object.entries(SNAKES).map(([head, tail], i) => (
            <Snake key={head} head={+head} tail={tail} skin={i} />
          ))}
        </svg>
        {players.map((p) => {
          if (p.position === 0) {
            return null;
          }
          const { x, y } = squareCenter(p.position);
          const offset = players.filter((o) => o.position === p.position).length > 1
            ? TOKEN_OFFSETS[p.id]
            : { x: 0, y: 0 };
          return (
            <div
              key={p.id}
              className="token"
              title={p.name}
              style={{ left: `${x + offset.x}%`, top: `${y + offset.y}%`, background: p.color }}
            />
          );
        })}
      </div>
    </div>
  );
}
