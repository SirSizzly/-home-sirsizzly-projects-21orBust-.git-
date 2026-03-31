export default function BlindPanel({ blind }) {
  if (!blind) return null;

  return (
    <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700">
      <div className="text-sm uppercase tracking-wide text-slate-400 mb-2">
        Blind
      </div>

      <div className="text-lg font-semibold capitalize">{blind.blind_type}</div>

      <div className="mt-2 text-sm">
        Target: <span className="font-semibold">{blind.target_score}</span>
      </div>

      <div className="text-sm">
        Score: <span className="font-semibold">{blind.accumulated_score}</span>
      </div>

      <div className="text-sm">
        Hands Played:{" "}
        <span className="font-semibold">{blind.hands_played}</span>
      </div>

      {blind.boss_key && (
        <div className="mt-2 text-rose-400 text-sm">Boss: {blind.boss_key}</div>
      )}
    </div>
  );
}
