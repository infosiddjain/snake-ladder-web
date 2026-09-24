"use client";

import { FormEvent, useEffect, useState } from "react";
import { OnlineGame, useOnlineGame } from "@/lib/useOnlineGame";
import Board from "./Board";
import Dice from "./Dice";

const NAME_KEY = "snakes-ladders:player-name";
const MAX_NAME_LENGTH = 12;
const ROOM_CODE_LENGTH = 6;

const loadName = () => {
  try {
    return localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
};

const saveName = (name: string) => {
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch {
    // Private mode or blocked storage; the name just won't be remembered.
  }
};

function Status({ online }: { online: OnlineGame }) {
  if (online.connection === "closed") {
    return (
      <p className="notice error">
        {online.error || "Lost connection to the game server."}{" "}
        <button type="button" className="link" onClick={online.reconnect}>
          Try again
        </button>
      </p>
    );
  }
  if (online.connection === "connecting") {
    return <p className="notice">Connecting to the game server…</p>;
  }
  return online.error ? <p className="notice error">{online.error}</p> : null;
}

function Entry({ online }: { online: OnlineGame }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    // Read after mount so server and client render the same first.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName((n) => n || loadName());
  }, []);

  const withName = (action: (name: string) => void) => (event: FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    saveName(trimmed);
    action(trimmed);
  };

  return (
    <div className="panel">
      <h1>Play Online</h1>
      <label className="field">
        <span>Your name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          maxLength={MAX_NAME_LENGTH}
          autoComplete="nickname"
        />
      </label>
      <div className="split">
        <form className="card" onSubmit={withName(online.create)}>
          <h3>Start a game</h3>
          <p>Create a room and share its code with your friends.</p>
          <button type="submit" className="btn btn-primary">
            Create Game
          </button>
        </form>
        <form className="card" onSubmit={withName((n) => online.join(code.trim(), n))}>
          <h3>Join a friend</h3>
          <input
            className="code-input"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ROOM CODE"
            maxLength={ROOM_CODE_LENGTH}
            autoCapitalize="characters"
            autoComplete="off"
            aria-label="Room code"
          />
          <button type="submit" className="btn btn-outline">
            Join Game
          </button>
        </form>
      </div>
      <Status online={online} />
    </div>
  );
}

function Lobby({ online }: { online: OnlineGame }) {
  const room = online.room!;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(room.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked; the code is still on screen to read out.
    }
  };

  return (
    <div className="panel">
      <h1>Waiting Room</h1>
      <div className="card center">
        <p className="muted">Room code</p>
        <p className="room-code">{room.code}</p>
        <button type="button" className="btn btn-outline btn-sm" onClick={copy}>
          {copied ? "Copied!" : "Copy code"}
        </button>
      </div>
      <div className="card">
        <h3>Players ({room.players.length}/4)</h3>
        <ul className="players">
          {room.players.map((p) => (
            <li key={p.id}>
              <span className="dot" style={{ background: p.color }} />
              <span className="grow">{p.name}</span>
              <span className="muted">
                {[p.id === room.hostId && "Host", p.id === online.playerId && "You"]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </li>
          ))}
        </ul>
      </div>
      {online.isHost ? (
        <button
          type="button"
          className="btn btn-primary"
          onClick={online.start}
          disabled={room.players.length < 2}
        >
          {room.players.length < 2 ? "Waiting for friends…" : "Start Game"}
        </button>
      ) : (
        <p className="muted center">Waiting for the host to start the game…</p>
      )}
      <button type="button" className="link" onClick={online.leave}>
        Leave room
      </button>
      <Status online={online} />
    </div>
  );
}

function Game({ online }: { online: OnlineGame }) {
  const game = online.game!;
  const room = online.room!;
  const current = game.players[game.currentPlayer];
  const showWinner = game.status === "won" && game.winner && online.phase === "idle";

  let hint = " ";
  if (online.phase === "idle" && current) {
    hint = online.isMyTurn ? "Your turn — click the dice" : `Waiting for ${current.name}…`;
  }

  return (
    <div className="game">
      <p className="muted room-tag">ROOM {room.code}</p>
      <ul className="chips">
        {online.displayPlayers.map((p) => {
          const connected = room.players[p.id]?.connected ?? true;
          return (
            <li
              key={p.id}
              className={`chip ${p.id === game.currentPlayer ? "active" : ""} ${connected ? "" : "left"}`}
            >
              <span className="dot" style={{ background: p.color }} />
              {p.name}
              {p.id === online.playerId && " (you)"}
              <b>{p.position === 0 ? "—" : p.position}</b>
            </li>
          );
        })}
      </ul>
      <Board players={online.displayPlayers} />
      <p className="message">{online.message}</p>
      {current && (
        <div className="dice-area">
          <Dice
            value={online.diceFace}
            color={current.color}
            rolling={online.phase === "rolling"}
            disabled={online.phase !== "idle" || !online.isMyTurn || online.connection !== "open"}
            onRoll={online.roll}
          />
          <p className="muted">{hint}</p>
        </div>
      )}
      <Status online={online} />
      {showWinner && (
        <div className="overlay">
          <div className="trophy">🏆</div>
          <h2 style={{ color: game.winner!.color }}>{game.winner!.name} wins!</h2>
          {online.isHost ? (
            <button type="button" className="btn btn-primary" onClick={online.start}>
              Play Again
            </button>
          ) : (
            <p className="muted">Waiting for the host to start a rematch…</p>
          )}
          <button type="button" className="link" onClick={online.leave}>
            Leave room
          </button>
        </div>
      )}
    </div>
  );
}

export default function OnlinePlay() {
  const online = useOnlineGame();
  if (!online.room) {
    return <Entry online={online} />;
  }
  if (!online.game) {
    return <Lobby online={online} />;
  }
  return <Game online={online} />;
}
