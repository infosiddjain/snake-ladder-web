"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { playEffect } from "./audio";
import { WS_URL } from "./config";
import {
  ClientMessage,
  DICE_ANIMATION_MS,
  DICE_FRAME_MS,
  GameState,
  getMovePath,
  Room,
  rollDie,
  ServerMessage,
  SLIDE_MS,
  SLIDE_PAUSE_MS,
  STEP_MS,
} from "./game";

type Phase = "idle" | "rolling" | "moving";
export type Connection = "connecting" | "open" | "closed";

/**
 * Live game through Snake-backend, the same protocol the app uses. The server
 * rolls and owns the state; each roll is replayed with an animation, one
 * message at a time so every player sees the same thing.
 */
export const useOnlineGame = () => {
  const [connection, setConnection] = useState<Connection>("connecting");
  const [room, setRoom] = useState<Room | null>(null);
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [game, setGame] = useState<GameState | null>(null);
  // Where each token is drawn; trails `game` while a move is animating.
  const [positions, setPositions] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [diceFace, setDiceFace] = useState(1);
  const [moveNote, setMoveNote] = useState("");
  const [attempt, setAttempt] = useState(0);

  const socket = useRef<WebSocket | null>(null);
  const gameRef = useRef<GameState | null>(null);
  const queue = useRef<ServerMessage[]>([]);
  const animating = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const diceTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  // Room we are in, to rejoin after a reconnect.
  const seat = useRef<{ code: string; name: string } | null>(null);
  const myId = useRef<number | null>(null);

  // Messages sent while the socket is still opening go out once it opens.
  const pending = useRef<ClientMessage[]>([]);

  const send = useCallback((message: ClientMessage) => {
    const ws = socket.current;
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else if (ws?.readyState === WebSocket.CONNECTING) {
      pending.current.push(message);
    } else {
      setError("Not connected to the server.");
    }
  }, []);

  const stopAnimation = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (diceTimer.current) {
      clearInterval(diceTimer.current);
      diceTimer.current = null;
    }
    queue.current = [];
    animating.current = false;
  }, []);

  useEffect(() => {
    const schedule = (fn: () => void, delay: number) => {
      timers.current.push(setTimeout(fn, delay));
    };

    const showGame = (next: GameState | null) => {
      gameRef.current = next;
      setGame(next);
      setPositions(next ? next.players.map((p) => p.position) : []);
    };

    const moveToken = (id: number, square: number) =>
      setPositions((prev) => prev.map((p, i) => (i === id ? square : p)));

    const animateRoll = (id: number, roll: number, next: GameState) => {
      const player = gameRef.current?.players[id];
      if (!player) {
        showGame(next);
        return;
      }
      animating.current = true;
      setPhase("rolling");
      playEffect("dice");
      diceTimer.current = setInterval(() => setDiceFace(rollDie()), DICE_FRAME_MS);

      const { steps, jumpTo } = getMovePath(player.position, roll);
      let delay = DICE_ANIMATION_MS;
      schedule(() => {
        if (diceTimer.current) {
          clearInterval(diceTimer.current);
          diceTimer.current = null;
        }
        setDiceFace(roll);
        setPhase("moving");
        setMoveNote(`${player.name} rolled ${roll}…`);
      }, delay);
      steps.forEach((square) => {
        schedule(() => {
          playEffect("step");
          moveToken(id, square);
        }, delay);
        delay += STEP_MS;
      });
      if (jumpTo !== null) {
        delay += SLIDE_PAUSE_MS;
        const climb = jumpTo > player.position + roll;
        schedule(() => {
          playEffect(climb ? "step" : "snake");
          setMoveNote(climb ? "Ladder!" : "Snake bite!");
          moveToken(id, jumpTo);
        }, delay);
        delay += SLIDE_MS;
      }
      schedule(() => {
        showGame(next);
        setPhase("idle");
        animating.current = false;
        drain();
      }, delay);
    };

    const handle = (message: ServerMessage) => {
      switch (message.type) {
        case "joined":
          myId.current = message.playerId;
          setPlayerId(message.playerId);
          if (seat.current) {
            seat.current.code = message.code;
          }
          break;
        case "room": {
          // The server may rename us ("Asha 2"); rejoin under that name.
          const me = message.room.players[myId.current ?? -1];
          if (seat.current && me) {
            seat.current.name = me.name;
          }
          setRoom(message.room);
          showGame(message.room.game);
          break;
        }
        case "rolled":
          animateRoll(message.playerId, message.roll, message.game);
          break;
        case "error":
          setError(message.message);
          break;
      }
    };

    // Rolls take a while to animate; later messages wait their turn.
    const drain = () => {
      while (!animating.current && queue.current.length > 0) {
        handle(queue.current.shift()!);
      }
    };

    const ws = new WebSocket(WS_URL);
    socket.current = ws;
    ws.onopen = () => {
      setConnection("open");
      setError("");
      const queued = pending.current;
      pending.current = [];
      // After a reconnect, take our seat back first. A queued create/join
      // replaces it anyway, so skip the rejoin then.
      const joining = queued.some((m) => m.type === "create" || m.type === "join");
      if (seat.current && !joining) {
        ws.send(JSON.stringify({ type: "join", ...seat.current }));
      }
      queued.forEach((m) => ws.send(JSON.stringify(m)));
    };
    ws.onmessage = (event) => {
      queue.current.push(JSON.parse(String(event.data)));
      drain();
    };
    ws.onerror = () => setError("Could not reach the game server.");
    ws.onclose = () => setConnection("closed");

    return () => {
      ws.onclose = null;
      ws.close();
      stopAnimation();
    };
  }, [attempt, stopAnimation]);

  const create = (name: string) => {
    seat.current = { code: "", name };
    setError("");
    send({ type: "create", name });
  };

  const join = (code: string, name: string) => {
    seat.current = { code, name };
    setError("");
    send({ type: "join", code, name });
  };

  const leave = () => {
    seat.current = null;
    myId.current = null;
    send({ type: "leave" });
    stopAnimation();
    setRoom(null);
    setPlayerId(null);
    setGame(null);
    gameRef.current = null;
    setPhase("idle");
  };

  const isMyTurn =
    game?.status === "playing" &&
    playerId !== null &&
    game.currentPlayer === playerId;

  const roll = () => {
    if (isMyTurn && phase === "idle") {
      send({ type: "roll" });
    }
  };

  const displayPlayers = useMemo(
    () =>
      (game?.players ?? []).map((p) => ({
        ...p,
        position: positions[p.id] ?? p.position,
      })),
    [game, positions],
  );

  return {
    connection,
    room,
    playerId,
    isHost: room !== null && room.hostId === playerId,
    error,
    game,
    displayPlayers,
    phase,
    diceFace,
    isMyTurn,
    message: phase === "idle" ? (game?.message ?? "") : moveNote,
    create,
    join,
    start: () => send({ type: "start" }),
    roll,
    leave,
    reconnect: () => {
      setConnection("connecting");
      setAttempt((n) => n + 1);
    },
  };
};

export type OnlineGame = ReturnType<typeof useOnlineGame>;
