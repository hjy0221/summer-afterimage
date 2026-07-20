import { useEffect, useState } from 'react';
import { ChevronRight, Flame, LockKeyhole, RotateCcw, Shuffle, Sparkles, Volume2, VolumeX, Waves, X } from 'lucide-react';

type Moment = {
  id: string;
  emoji: string;
  title: string;
  note: string;
  color: string;
};

const MOMENTS: Moment[] = [
  { id: 'watermelon', emoji: '🍉', title: '수박의 가장 달콤한 한입', note: '첫입은 생각보다 더 여름 같았다.', color: '#ff6b73' },
  { id: 'wave-sound', emoji: '🌊', title: '파도 소리 10초 듣기', note: '아무것도 안 해도 괜찮은 소리.', color: '#3182f6' },
  { id: 'green-shade', emoji: '🌿', title: '초록 그늘 아래 잠깐 멈추기', note: '도시는 그늘에서 조금 느려진다.', color: '#35b980' },
  { id: 'coolest-moment', emoji: '🍧', title: '오늘 가장 시원했던 순간', note: '얼음이 녹기 전에 웃음이 먼저 났다.', color: '#8b78ed' },
  { id: 'sunset-sky', emoji: '🌇', title: '저녁 7시 하늘 올려다보기', note: '하루가 가장 예쁜 색으로 사라졌다.', color: '#ff9d4d' },
  { id: 'cold-wrist', emoji: '💦', title: '차가운 물로 손목 적시기', note: '작은 시원함이 하루를 바꿨다.', color: '#4cc9d8' },
  { id: 'summer-sound', emoji: '🎐', title: '여름을 닮은 소리 찾기', note: '바람은 보이지 않아도 도착했다.', color: '#71a8ff' },
  { id: 'barefoot-grass', emoji: '🦶', title: '풀밭을 맨발로 10초 느끼기', note: '발끝에서 여름의 온도가 전해졌다.', color: '#57b86b' },
  { id: 'ice-sound', emoji: '🧊', title: '컵 속 얼음 소리에 귀 기울이기', note: '짤랑이는 소리가 더위를 잠깐 밀어냈다.', color: '#61aef2' },
  { id: 'cloud-shape', emoji: '☁️', title: '구름에서 재미있는 모양 찾기', note: '하늘이 잠깐 나만의 그림책이 됐다.', color: '#7ca9de' },
  { id: 'fan-breeze', emoji: '🌀', title: '선풍기 바람에 눈 감아보기', note: '익숙한 바람도 눈을 감으면 여행이 된다.', color: '#6caadf' },
  { id: 'summer-fruit', emoji: '🍑', title: '제철 과일 향 천천히 맡기', note: '달콤한 향 하나로 계절이 선명해졌다.', color: '#ff8d8d' },
  { id: 'sunlight-photo', emoji: '📷', title: '바닥의 햇빛 모양 사진 찍기', note: '빛과 그림자가 오늘만의 무늬를 만들었다.', color: '#f2ad45' },
  { id: 'blue-object', emoji: '🩵', title: '주변에서 파란색 세 개 찾기', note: '작은 파랑들이 모여 시원한 풍경이 됐다.', color: '#4d9be8' },
  { id: 'summer-song', emoji: '🎧', title: '여름 노래 한 소절 흥얼거리기', note: '짧은 멜로디가 오늘의 배경음이 됐다.', color: '#9a7bea' },
  { id: 'cool-floor', emoji: '🧘', title: '시원한 바닥에 발바닥 대보기', note: '열 걸음 대신 잠깐의 멈춤을 골랐다.', color: '#4e9fc5' },
  { id: 'morning-light', emoji: '🌤️', title: '아침 햇빛에 손바닥 비춰보기', note: '손바닥 위에 하루의 첫 빛이 머물렀다.', color: '#f5b947' },
  { id: 'rain-smell', emoji: '🌦️', title: '비 온 뒤 공기 냄새 기억하기', note: '젖은 공기 속에서 여름의 향을 찾았다.', color: '#648ed1' },
  { id: 'cold-sip', emoji: '🥤', title: '차가운 음료 첫 모금 천천히 마시기', note: '한 모금이 목을 지나며 작은 파도를 만들었다.', color: '#43b8ba' },
  { id: 'leaf-shadow', emoji: '🌳', title: '나뭇잎 그림자 10초 바라보기', note: '흔들리는 그림자가 조용한 영화를 보여줬다.', color: '#3ea16d' },
  { id: 'night-walk', emoji: '🌙', title: '해 진 뒤 천천히 열 걸음 걷기', note: '낮의 열기가 빠진 길에서 여름밤을 만났다.', color: '#4d62a5' },
];

const COLLECTION_KEY = 'summer-collected-moment-ids';
const LAST_SHOWN_KEY = 'summer-last-moment-id';

const loadCollectedMoments = () => {
  const savedIds = localStorage.getItem(COLLECTION_KEY);

  if (savedIds !== null) {
    try {
      const ids = JSON.parse(savedIds);
      if (Array.isArray(ids)) {
        const uniqueIds = [...new Set(ids.filter((id): id is string => typeof id === 'string'))];
        return uniqueIds
          .map(id => MOMENTS.find(moment => moment.id === id))
          .filter((moment): moment is Moment => Boolean(moment))
          .slice(0, 7);
      }
    } catch {
      // 기존 저장값이 손상되었으면 아래의 이전 버전 진행도로 복구해요.
    }
  }

  const legacyCount = Math.max(0, Math.min(Number(localStorage.getItem('summer-count') || 3) || 0, 7));
  return MOMENTS.slice(0, legacyCount);
};

const randomIndex = (length: number) => {
  if (window.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0] % length;
  }
  return Math.floor(Math.random() * length);
};

const pickNextMoment = (collected: Moment[], lastShownId: string | null) => {
  const excludedIds = new Set(collected.map(moment => moment.id));
  if (lastShownId) excludedIds.add(lastShownId);

  let candidates = MOMENTS.filter(moment => !excludedIds.has(moment.id));
  if (candidates.length === 0) {
    candidates = MOMENTS.filter(moment => !collected.some(item => item.id === moment.id));
  }
  if (candidates.length === 0) candidates = MOMENTS;

  return candidates[randomIndex(candidates.length)];
};

function App() {
  const [collected, setCollected] = useState<Moment[]>(loadCollectedMoments);
  const [today, setToday] = useState<Moment | null>(null);
  const [lastShownId, setLastShownId] = useState<string | null>(() => localStorage.getItem(LAST_SHOWN_KEY));
  const [toast, setToast] = useState('');
  const [soundOn, setSoundOn] = useState(true);
  const [resetOpen, setResetOpen] = useState(false);

  const count = collected.length;
  const progress = Math.round((count / 7) * 100);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const playWave = () => {
    if (!soundOn) return;
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
    gain.connect(ctx.destination);
    [220, 330, 440].forEach((frequency, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = frequency;
      osc.connect(gain);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + 1.5);
    });
  };

  const discover = () => {
    playWave();
    const nextMoment = pickNextMoment(collected, lastShownId);
    setToday(nextMoment);
    setLastShownId(nextMoment.id);
    localStorage.setItem(LAST_SHOWN_KEY, nextMoment.id);
  };

  const collect = () => {
    if (count >= 7) {
      setToast('이번 여름 파도를 모두 완성했어요!');
      setToday(null);
      return;
    }
    if (!today) return;

    const nextCollection = [...collected, today].slice(0, 7);
    const next = nextCollection.length;
    setCollected(nextCollection);
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(nextCollection.map(moment => moment.id)));
    localStorage.setItem('summer-count', String(next));
    setToday(null);
    setToast(next === 7 ? '나만의 여름 파도가 완성됐어요 🌊' : `${next}번째 여름 조각을 담았어요`);
  };

  const reset = () => {
    setCollected([]);
    setToday(null);
    setLastShownId(null);
    localStorage.setItem(COLLECTION_KEY, '[]');
    localStorage.removeItem(LAST_SHOWN_KEY);
    localStorage.setItem('summer-count', '0');
    setResetOpen(false);
    setToast('새로운 여름을 시작했어요');
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark"><span>여름잔상</span><span className="season">SUMMER 2026</span></div>
        <button className="icon-button" aria-label={soundOn ? '소리 끄기' : '소리 켜기'} onClick={() => setSoundOn(v => !v)}>
          {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </header>

      <section className="hero">
        <div className="sun sun-one" />
        <div className="sun sun-two" />
        <div className="eyebrow"><Sparkles size={14} /> 오늘의 여름 도착</div>
        <h1>이번 여름은<br /><em>그냥 보내지 말아요.</em></h1>
        <p>하루에 하나, 10초면 충분해요.<br />평범한 오늘에서 여름을 발견해 보세요.</p>
        <div className="wave-stage" aria-label={`여름 파도 ${progress}% 완성`}>
          <div className="wave-back" />
          <div className="wave-mid" />
          <div className="float-card">
            <span className="float-label">나의 여름 파도</span>
            <strong>{progress}<small>%</small></strong>
            <span className="float-caption">조각 {count}개를 모았어요</span>
          </div>
          <div className="spark spark-a">✦</div>
          <div className="spark spark-b">·</div>
        </div>
      </section>

      <section className="content">
        <div className="section-head">
          <div><span className="kicker">7 DAYS OF SUMMER</span><h2>나의 여름 조각</h2></div>
          <button className="reset-link" onClick={() => setResetOpen(true)}><RotateCcw size={14} /> 다시 시작</button>
        </div>

        <div className="moment-grid">
          {Array.from({ length: 7 }, (_, index) => {
            const moment = collected[index];
            const unlocked = index < count;
            const isNext = index === count;
            return (
              <button
                className={`moment ${unlocked ? 'unlocked' : ''} ${isNext ? 'next' : ''}`}
                key={`summer-day-${index + 1}`}
                style={{ '--moment-color': moment?.color || '#3182f6' } as React.CSSProperties}
                onClick={() => unlocked && moment ? setToast(`${index + 1}일차 · ${moment.title}`) : isNext ? discover() : setToast('앞의 여름 조각을 먼저 만나보세요')}
              >
                <span className="day">DAY {index + 1}</span>
                <span className="moment-icon">{unlocked && moment ? moment.emoji : isNext ? <Sparkles size={22} /> : <LockKeyhole size={18} />}</span>
                <span className="moment-title">{unlocked && moment ? moment.title : isNext ? '오늘의 조각 열기' : '아직 잠겨 있어요'}</span>
                {unlocked && <span className="check">✓</span>}
              </button>
            );
          })}
        </div>

        <article className="quote-card">
          <div className="quote-icon"><Waves size={22} /></div>
          <blockquote>“여름은 계절이 아니라,<br />기억해 낼 수 있는 순간의 수예요.”</blockquote>
          <span>여름잔상 수집 노트</span>
        </article>
      </section>

      <div className="bottom-space" />
      <div className="bottom-cta">
        <button onClick={discover} disabled={count >= 7}>
          <span>{count >= 7 ? '여름 파도 완성!' : '오늘의 여름 발견하기'}</span>
          {count >= 7 ? <Sparkles size={20} /> : <ChevronRight size={21} />}
        </button>
        <p><Flame size={13} /> {Math.max(count, 1)}일째 여름을 발견하는 중</p>
      </div>

      {today && (
        <div className="modal-backdrop" role="presentation" onClick={() => setToday(null)}>
          <section className="discovery-sheet" role="dialog" aria-modal="true" aria-labelledby="discovery-title" onClick={e => e.stopPropagation()}>
            <button className="sheet-close" aria-label="닫기" onClick={() => setToday(null)}><X size={20} /></button>
            <div className="discovery-orbit"><span>{today.emoji}</span></div>
            <span className="sheet-kicker">TODAY'S SUMMER</span>
            <h2 id="discovery-title">{today.title}</h2>
            <p>21가지 여름 중 지금 만난 하나예요.<br />10초 뒤, 오늘이 조금 더 여름다워질 거예요.</p>
            <div className="ten-seconds"><span>10</span><small>SECONDS</small></div>
            <div className="discovery-actions">
              <button className="reroll-button" onClick={discover}><Shuffle size={17} /> 다른 여름 발견하기</button>
              <button className="collect-button" onClick={collect}>이 순간, 내 여름에 담기</button>
            </div>
          </section>
        </div>
      )}

      {resetOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setResetOpen(false)}>
          <section className="confirm" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
            <div className="confirm-emoji">🏖️</div>
            <h3>새로운 여름을 시작할까요?</h3>
            <p>모아둔 조각은 사라지고<br />첫날부터 다시 시작해요.</p>
            <div className="confirm-actions"><button onClick={() => setResetOpen(false)}>아니요</button><button onClick={reset}>시작할래요</button></div>
          </section>
        </div>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}

export default App;
