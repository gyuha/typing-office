// The office typing game: clear paperwork piles by typing sentences.
import { panelHTML } from './panel.js';
import { sprite, BOSS, PAPERS } from './pixel.js';
import { PACKS } from './sentences.js';
import { saveRecord, getPack, getName } from './store.js';

// Keystrokes for one character (Korean syllables count their letters, like a typing test).
const DOUBLE_VOWEL = new Set([9, 10, 11, 14, 15, 16, 19]);
const DOUBLE_FINAL = new Set([3, 5, 6, 9, 10, 11, 12, 13, 14, 15, 18]);
export function strokes(text) {
  let n = 0;
  for (const ch of text) {
    const c = ch.charCodeAt(0) - 0xac00;
    if (c >= 0 && c < 11172) {
      const jung = Math.floor(c / 28) % 21;
      const jong = c % 28;
      n += 1 + (DOUBLE_VOWEL.has(jung) ? 2 : 1) + (jong === 0 ? 0 : DOUBLE_FINAL.has(jong) ? 2 : 1);
    } else n += 1;
  }
  return n;
}

// Fair random order (Fisher-Yates shuffle).
function shuffled(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function mountGame(root) {
  const packId = getPack();
  const pack = PACKS[packId];
  root.innerHTML = `<div class="fit"><div class="over"><strong></strong><span></span><button type="button">다시 출근하기</button></div>${panelHTML({ source: pack.name, sentence: '', live: true })}</div>
  <p class="tip">Enter: 제출 · ESC: 지우기 · 커피 게이지가 가득 차면 빈 입력창에 '커피' 입력</p>`;
  const panel = root.querySelector('.panel');
  panel.classList.add('live');
  const fit = root.querySelector('.fit');
  const $ = (sel) => panel.querySelector(sel);
  const field = $('.pv-field');
  const sentenceEl = $('.pv-sentence');
  const k = (key) => panel.querySelector(`[data-k="${key}"]`);
  const over = root.querySelector('.over');

  let st;
  function reset() {
    st = {
      hp: 100, mp: 0, combo: 0, cnt: 0, cleared: 0, maxSpd: 0,
      accSum: 0, line: '', order: [], idx: 0, started: 0, lastLen: 0,
      enemy: null, attackAt: 0, alive: true,
    };
    st.order = shuffled(pack.lines);
    k('spd').textContent = '0'; k('acc').textContent = '0'; k('cnt').textContent = '0';
    k('rspd').textContent = 'XX'; k('racc').textContent = 'XX'; k('rmax').textContent = 'XX';
    over.classList.remove('show');
    field.value = '';
    field.disabled = false;
    nextLine();
    spawn();
    draw();
    field.focus();
  }

  function nextLine() {
    if (st.idx >= st.order.length) {
      // every sentence was shown once: shuffle again, never repeating the last one first
      const last = st.line;
      st.order = shuffled(pack.lines);
      if (st.order.length > 1 && st.order[0] === last) st.order.push(st.order.shift());
      st.idx = 0;
    }
    st.line = st.order[st.idx];
    st.idx++;
    st.started = 0;
    st.lastLen = 0;
    paintSentence('');
  }

  function spawn() {
    const boss = (st.cleared + 1) % 5 === 0;
    const max = boss ? 90 : 30 + st.cleared * 3;
    st.enemy = { boss, hp: max, max };
    st.attackAt = performance.now() + (boss ? 5000 : 8000);
    const box = $('.pv-enemy');
    box.classList.toggle('boss', boss);
    $('.pv-enemy-art').innerHTML = boss ? sprite(BOSS.rows, BOSS.palette, 4) : sprite(PAPERS.rows, PAPERS.palette, 4);
    $('.pv-enemy-name').textContent = boss ? '부장님 결재' : `서류 더미 Lv.${st.cleared + 1}`;
  }

  function paintSentence(typed) {
    let html = '';
    const chars = [...st.line];
    const t = [...typed];
    chars.forEach((ch, i) => {
      if (i >= t.length) html += esc(ch);
      else if (t[i] === ch) html += `<span class="ok">${esc(ch)}</span>`;
      else if (i === t.length - 1) html += esc(ch); // still being composed
      else html += `<span class="bad">${esc(ch)}</span>`;
    });
    sentenceEl.innerHTML = html;
  }

  function pop(text) {
    const p = $('.pv-pop');
    p.textContent = text;
    p.classList.remove('show');
    void p.offsetWidth;
    p.classList.add('show');
  }

  function draw() {
    $('.pv-hp i').style.width = `${Math.max(0, st.hp)}%`;
    $('.pv-mp i').style.width = `${st.mp}%`;
    $('.pv-mp').classList.toggle('full', st.mp >= 100);
    $('.pv-combo i').style.width = `${st.combo}%`;
    $('.pv-enemy-hp i').style.width = `${(st.enemy.hp / st.enemy.max) * 100}%`;
  }

  function speedNow(text) {
    if (!st.started) return 0;
    const min = (performance.now() - st.started) / 60000;
    return min > 0 ? Math.round(strokes(text) / min) : 0;
  }

  function hurt(n, msg) {
    st.hp -= n;
    pop(msg);
    $('.pv-worker').classList.remove('hit');
    void panel.offsetWidth;
    $('.pv-worker').classList.add('hit');
    if (st.hp <= 0) end();
    draw();
  }

  function end() {
    st.alive = false;
    field.disabled = true;
    const acc = st.cnt ? Math.round(st.accSum / st.cnt) : 0;
    saveRecord({ name: getName() || '익명 사원', cleared: st.cleared, max: st.maxSpd, acc, pack: pack.name, at: Date.now() });
    over.querySelector('strong').textContent = '야근 확정...';
    over.querySelector('span').textContent = `처리한 업무 ${st.cleared}건 · 최고 ${st.maxSpd}타 · 정확도 ${acc}%`;
    over.classList.add('show');
  }

  field.addEventListener('input', () => {
    if (!st.alive) return;
    const v = field.value;
    if (!st.started && v) st.started = performance.now();
    paintSentence(v);
    const spd = speedNow(v);
    k('spd').textContent = String(spd);
    if (v.length > st.lastLen) {
      st.combo = Math.min(100, st.combo + (spd >= 150 ? 8 : 3));
      const i = v.length - 1;
      if (st.combo > 20 && v[i] === st.line[i]) {
        const dmg = 1 + Math.floor(st.combo / 34);
        st.enemy.hp -= dmg;
        if (st.enemy.hp <= 0) {
          st.cleared++;
          pop(st.enemy.boss ? '결재 완료!' : '업무 처리!');
          spawn();
        }
      }
    }
    st.lastLen = v.length;
    draw();
  });

  field.addEventListener('keydown', (e) => {
    if (e.isComposing || !st.alive) return;
    if (e.key === 'Escape') {
      field.value = '';
      st.lastLen = 0;
      paintSentence('');
      return;
    }
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const v = field.value.trim();
    if (!v) return;
    if (v === '커피') {
      if (st.mp >= 100) {
        st.hp = Math.min(100, st.hp + 30);
        st.mp = 0;
        pop('체력 +30');
      } else pop('커피 게이지 부족');
      field.value = '';
      st.lastLen = 0;
      draw();
      return;
    }
    const target = [...st.line];
    const typed = [...v];
    let right = 0;
    target.forEach((ch, i) => { if (typed[i] === ch) right++; });
    const acc = Math.round((right / Math.max(target.length, typed.length)) * 100);
    const spd = speedNow(v);
    st.cnt++;
    st.accSum += acc;
    st.maxSpd = Math.max(st.maxSpd, spd);
    st.mp = Math.min(100, st.mp + Math.round(acc / 8));
    k('cnt').textContent = String(st.cnt);
    k('acc').textContent = String(acc);
    k('rspd').textContent = String(spd);
    k('racc').textContent = String(acc);
    k('rmax').textContent = String(st.maxSpd);
    field.value = '';
    nextLine();
    const wrong = target.length - right;
    if (wrong > 0) hurt(Math.min(20, wrong * 3), `오타 ${wrong}개`);
    draw();
  });

  over.querySelector('button').addEventListener('click', reset);

  const timer = setInterval(() => {
    if (!st.alive) return;
    st.combo = Math.max(0, st.combo - 2);
    if (performance.now() > st.attackAt) {
      st.attackAt = performance.now() + (st.enemy.boss ? 5000 : 8000);
      hurt(st.enemy.boss ? 8 : 4, st.enemy.boss ? '부장님 잔소리!' : '업무 추가!');
    }
    draw();
  }, 150);

  const scale = () => {
    const s = Math.min(1, (document.documentElement.clientWidth - 20) / 880);
    panel.style.transform = `scale(${s})`;
    fit.style.width = `${880 * s}px`;
    fit.style.height = `${431 * s}px`;
    over.style.transform = `scale(${s})`;
    over.style.transformOrigin = '0 0';
    over.style.width = '880px';
  };
  scale();
  window.addEventListener('resize', scale);
  reset();

  return () => {
    clearInterval(timer);
    window.removeEventListener('resize', scale);
  };
}
