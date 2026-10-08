import { useNotch, type Hud as HudKind, type Transient } from './store';
import { Cover, Visualizer } from './Cover';
import { trackAt } from './tracks';
import { useNow } from './useNow';
import { ringBell } from './bell';
import { useEffect } from 'react';

const NOTCH_W = 200;

export function closedWidth(transient: Transient | null, timer: boolean) {
  if (!transient) return NOTCH_W + (timer ? 130 : 100);
  return { hud: 380, battery: 360, peek: 420, download: NOTCH_W + 90, join: 400, unlock: NOTCH_W + 70 }[transient.kind];
}

const hudIcon: Record<HudKind, string> = { volume: '🔊', brightness: '☀', backlight: '⌨' };

function Hud({ hud, value }: { hud: HudKind; value: number }) {
  return (
    <div className="closed closed-hud" role="status" aria-label={`${hud} ${Math.round(value * 100)}%`}>
      <span className="closed-hud-icon" aria-hidden>{hudIcon[hud]}</span>
      <span className="closed-hud-bar"><i style={{ width: `${value * 100}%` }} /></span>
    </div>
  );
}

export function Closed() {
  const track = trackAt(useNotch((s) => s.track));
  const playing = useNotch((s) => s.playing);
  const transient = useNotch((s) => s.transient);

  if (transient?.kind === 'hud') return <Hud hud={transient.hud} value={transient.value} />;
  if (transient?.kind === 'download') {
    return (
      <div className="closed closed-download" role="status" aria-label={`Downloading in ${transient.app}`}>
        <span />
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden>
          <circle cx="10" cy="10" r="8" fill="none" stroke="rgb(255 255 255 / 0.2)" strokeWidth="2.5" />
          <circle className="closed-download-ring" cx="10" cy="10" r="8" fill="none" stroke="#0a84ff" strokeWidth="2.5" strokeLinecap="round" pathLength="100" transform="rotate(-90 10 10)" />
        </svg>
      </div>
    );
  }
  if (transient?.kind === 'join') {
    return (
      <div className="closed closed-join" role="status">
        <span className="closed-join-title">{transient.title}</span>
        <span className="closed-join-pill">Join {transient.app}</span>
      </div>
    );
  }
  if (transient?.kind === 'peek') {
    return (
      <div className="closed closed-peek" role="status" aria-label={`Now playing ${track.title} by ${track.artist}`}>
        <Cover track={track} size={22} linked={false} />
        <span className="closed-peek-text"><b>{track.title}</b> · {track.artist}</span>
        <Visualizer playing={playing} />
      </div>
    );
  }
  return (
    <div className="closed">
      <Cover track={track} size={22} linked={false} />
      <TimerOrVisualizer playing={playing} />
    </div>
  );
}

// The right wing shows a running timer instead of the visualizer, and rings the bell when it ends.
function TimerOrVisualizer({ playing }: { playing: boolean }) {
  const end = useNotch((s) => s.timerEnd);
  const now = useNow(500).getTime();
  const left = end ? Math.max(0, end - now) : 0;
  const done = end !== null && left === 0;
  useEffect(() => {
    if (!done) return;
    ringBell();
    useNotch.getState().stopTimer();
  }, [done]);
  if (!end) return <Visualizer playing={playing} />;
  const s = Math.ceil(left / 1000);
  return <span className="closed-timer">{Math.floor(s / 60)}:{String(s % 60).padStart(2, '0')}</span>;
}
