import React from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { useRoom } from "../net/useRoom";
import pinkel from "../assets/pinkel.svg";
import mettenden from "../assets/mettenden.svg";

export function PlayerRoom() {
  const nav = useNavigate();
  const params = useParams();
  const roomCode = ((params as any).roomCode as string)?.toUpperCase() || "";

  const { connect, send, selfId, state, error, ws } = useRoom();

  const [name, setName] = React.useState("");
  const [joined, setJoined] = React.useState(false);

  React.useEffect(() => {
    connect();
  }, [connect]);

  const doJoin = () => {
    if (!name.trim()) return;
    send({ type: "join", roomCode, name: name.trim(), role: "player" });
    setJoined(true);
  };

  const me = state?.participants.find(p => p.id === selfId);
  const others = (state?.participants ?? []).filter(p => p.id !== selfId);

  const giveBonus = (toId: string) => {
    if (!selfId) return;
    send({ type: "player/giveBonus", roomCode, fromId: selfId, toId, amount: 1 });
  };

  const answerQuiz = (answerIndex: number) => {
    if (!selfId) return;
    send({ type: "quiz/answer", roomCode, fromId: selfId, answerIndex });
  };

  const submitted = !!(state?.quiz && selfId && state.quiz.submissions[selfId] !== undefined);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
      <div className="max-w-md mx-auto space-y-6">
        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-white rounded-2xl shadow-xl p-6 border-4 border-green-600">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl text-green-900">Spieler*in</h1>
              <p className="text-green-800">Raum: <span className="font-mono font-bold">{roomCode}</span></p>
            </div>
            <button onClick={() => nav("/")} className="px-4 py-2 rounded-lg border-2 border-green-200 hover:bg-green-50">
              Start
            </button>
          </div>

          {!state && (
            <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-900">
              Noch nicht verbunden… {error ? `(${error})` : ""}
            </div>
          )}

          {!joined && !selfId && (
            <div className="mt-4">
              <label className="block text-sm text-green-900 mb-1">Dein Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z.B. Erik"
                className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:border-green-500 text-lg"
              />
              <button
                onClick={doJoin}
                className="mt-3 w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg"
              >
                Beitreten
              </button>
              <p className="text-xs text-green-700 mt-2">
                Tipp: Wenn du „Nicht verbunden“ siehst, fehlt der WebSocket-Server.
              </p>
            </div>
          )}

          {me && (
            <div className="mt-4 bg-green-50 p-3 rounded-lg">
              <div className="text-green-900 font-semibold">{me.name}</div>
              <div className="text-sm text-green-700 flex items-center gap-3">
                <span className="inline-flex items-center gap-1"><img src={pinkel} className="w-4 h-4" alt="" /> {me.pinkel}</span>
                <span className="inline-flex items-center gap-1"><img src={mettenden} className="w-4 h-4" alt="" /> {me.mettenden}</span>
              </div>
              <div className="text-xs text-green-700 mt-1">Stage: {state?.stage ?? "—"}</div>
            </div>
          )}
        </motion.div>

        {/* Stage content */}
        {state?.stage === "lobby" && me && (
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-white rounded-2xl shadow-xl p-6 border-4 border-green-600">
            <h2 className="text-2xl text-green-900 mb-3">Lobby</h2>
            <p className="text-green-800 mb-4">Warte, bis der Host ein Spiel startet.</p>

            <div className="border-t pt-4">
              <h3 className="text-lg text-green-900 mb-2">Bonus geben (1 Mettende)</h3>
              <div className="space-y-2">
                {others.map(p => (
                  <button
                    key={p.id}
                    onClick={() => giveBonus(p.id)}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-green-50 hover:bg-green-100 border border-green-200"
                  >
                    <span className="text-green-900">{p.name}</span>
                    <span className="inline-flex items-center gap-1 text-red-700">
                      <img src={mettenden} className="w-4 h-4" alt="" /> schenken
                    </span>
                  </button>
                ))}
                {others.length === 0 && <div className="text-green-700">Noch niemand sonst da.</div>}
              </div>
            </div>
          </motion.div>
        )}

        {state?.stage === "scoreboard" && (
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-white rounded-2xl shadow-xl p-6 border-4 border-green-600">
            <h2 className="text-2xl text-green-900 mb-3">Scoreboard</h2>
            <div className="space-y-2">
              {(state.participants ?? [])
                .slice()
                .sort((a,b)=> (b.pinkel + b.mettenden) - (a.pinkel + a.mettenden))
                .map(p => (
                  <div key={p.id} className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                    <span className="text-green-900">{p.name}</span>
                    <span className="text-green-900 flex items-center gap-3">
                      <span className="inline-flex items-center gap-1"><img src={pinkel} className="w-4 h-4" alt="" /> {p.pinkel}</span>
                      <span className="inline-flex items-center gap-1"><img src={mettenden} className="w-4 h-4" alt="" /> {p.mettenden}</span>
                    </span>
                  </div>
                ))}
            </div>
          </motion.div>
        )}

        {state?.stage === "quiz" && state.quiz && me && (
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-white rounded-2xl shadow-xl p-6 border-4 border-green-600">
            <h2 className="text-2xl text-green-900 mb-2">Quiz</h2>
            <div className="text-green-900 mb-4">{state.quiz.question.question}</div>

            <div className="space-y-2">
              {state.quiz.question.answers.map((a, i) => {
                const isMine = state.quiz.submissions[selfId!] === i;
                const isCorrect = state.quiz.question.correct === i;
                const revealed = state.quiz.status === "revealed";
                return (
                  <button
                    key={i}
                    disabled={submitted || revealed}
                    onClick={() => answerQuiz(i)}
                    className={[
                      "w-full text-left p-3 rounded-lg border transition-colors",
                      isMine ? "border-green-600 bg-green-50" : "border-green-200 bg-white",
                      revealed && isCorrect ? "border-green-600 bg-green-50" : "",
                      (submitted || revealed) ? "opacity-80" : "hover:bg-green-50"
                    ].join(" ")}
                  >
                    <div className="text-green-900">
                      <span className="font-mono mr-2">{String.fromCharCode(65 + i)}</span>
                      {a}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 text-sm text-green-700">
              {submitted ? "Antwort gesendet. Warte auf Auflösung…" : "Tippe deine Antwort."}
              {state.quiz.status === "revealed" && (
                <div className="mt-2 text-green-900">
                  Richtige Antwort: {String.fromCharCode(65 + state.quiz.question.correct)}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {state?.stage === "winner" && (
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-white rounded-2xl shadow-xl p-6 border-4 border-green-600 text-center">
            <h2 className="text-3xl text-green-900 mb-3">Kohlkönig / Kohlkönigin</h2>
            {state.winnerId ? (
              <div className="text-2xl text-green-900">
                🎉 {(state.participants.find(p=>p.id===state.winnerId)?.name) ?? "—"} 🎉
              </div>
            ) : (
              <div className="text-green-800">Der Host entscheidet gleich…</div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
