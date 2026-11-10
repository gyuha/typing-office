import './base.css';
import './panel.css';
import './home.css';
import { sprite, svgUrl, LOGO, WORKER, COLLEAGUE } from './pixel.js';
import { officeBackdrop } from './scene.js';
import { mountGame } from './game.js';
import { PACKS } from './sentences.js';
import { getName, setName, getRecords, getPack, setPack } from './store.js';

// Pixel art is shown as background pictures (no extra elements on the page).
const pic = (svg, w, h) => `background-image:url("${svgUrl(svg)}");background-size:100% 100%;width:${w}px;height:${h}px`;
const spr = (s, size) => pic(sprite(s.rows, s.palette, size), s.rows[0].length * size, s.rows.length * size);
document.querySelector('.stage-art').style.backgroundImage = `url("${svgUrl(officeBackdrop())}")`;
document.querySelector('.chars').innerHTML =
  `<i style='${spr(COLLEAGUE, 5)}'></i><i style='${spr(WORKER, 5)}'></i>`;
document.querySelector('.logo-img').src = svgUrl(sprite(LOGO.rows, LOGO.palette, 10));

const view = document.getElementById('view');
const dialogs = document.getElementById('dialogs');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/* ---------- views ---------- */
const TITLE = "LET'S GO TO THE OFFICE";
let typer = 0;

function packButtons() {
  const cur = getPack();
  return Object.entries(PACKS)
    .map(([id, p]) => `<button type="button" class="pack${id === cur ? ' on' : ''}" data-id="${id}"><strong>${p.name}</strong><span class="d">${p.desc}<br></span>문장 ${p.lines.length}개</button>`)
    .join('');
}

function home() {
  view.innerHTML = `
    <div class="hero">
      <p class="hero-title"><span class="typed">${TITLE}</span><span class="caret">|</span></p>
      <p class="sub" id="subTitle">Improve your typing speed using a variety of office typing content!</p>
      <div class="pick">
        <p class="pick-t">오늘의 업무를 고르고 Start를 누르세요</p>
        <div class="packs">${packButtons()}</div>
      </div>
      <a class="start" id="profileButton" href="#/game"><button type="button" tabindex="-1">Start</button></a>
    </div>`;
  view.querySelectorAll('.pack').forEach((b) =>
    b.addEventListener('click', () => {
      setPack(b.dataset.id);
      view.querySelectorAll('.pack').forEach((x) => x.classList.toggle('on', x === b));
    }),
  );
  const el = view.querySelector('.typed');
  let i = TITLE.length;
  let dir = -1;
  let wait = 40;
  clearInterval(typer);
  typer = setInterval(() => {
    if (wait-- > 0) return;
    i += dir;
    if (i <= 0) { dir = 1; wait = 4; }
    if (i >= TITLE.length) { dir = -1; wait = 40; }
    el.textContent = TITLE.slice(0, i);
  }, 120);
  return () => clearInterval(typer);
}

function ranking() {
  const list = getRecords();
  const rows = list.length
    ? list.map((r, i) => `<tr><td>${i + 1}</td><td>${esc(r.name)}</td><td>${r.cleared}건</td><td>${r.max}타</td><td>${r.acc}%</td><td>${esc(r.pack)}</td></tr>`).join('')
    : '<tr><td colspan="6">아직 기록이 없어요. 출근해서 첫 기록을 남겨 보세요!</td></tr>';
  view.innerHTML = `<section class="box"><h2>사원 랭킹</h2>
    <table class="rank"><thead><tr><th>#</th><th>이름</th><th>처리 업무</th><th>최고 타수</th><th>정확도</th><th>업무</th></tr></thead><tbody>${rows}</tbody></table>
    <p>순위 기준: 처리한 업무 수가 많은 순, 같으면 최고 타수가 높은 순 (상위 10명).<br>체력이 다 떨어져 게임이 끝날 때 기록되며, 이 기기의 브라우저에만 저장됩니다.</p></section>`;
}

const ROUTES = { '': ['home', home], game: ['home', mountGame.bind(null, view)], ranking: ['ranking', ranking] };
let cleanup = null;
function route() {
  const key = location.hash.replace(/^#\/?/, '').split('/')[0];
  const [nav, fn] = ROUTES[key] || ROUTES[''];
  if (cleanup) cleanup();
  cleanup = fn() || null;
  document.querySelectorAll('.nav a').forEach((a) => a.classList.toggle('on', a.dataset.nav === nav));
}
window.addEventListener('hashchange', route);
route();

/* ---------- login (nickname kept on this device) ---------- */
const loginBtn = document.querySelector('.login');
const paintLogin = () => {
  const n = getName();
  loginBtn.textContent = n ? 'Logout' : 'Login';
  loginBtn.title = n ? `${n} 님` : '닉네임 정하기';
};
paintLogin();
loginBtn.addEventListener('click', () => {
  if (getName()) {
    setName('');
    paintLogin();
    return;
  }
  dialogs.innerHTML = `<div class="dim"></div><form class="ask"><label for="nick">사원 이름</label>
    <input id="nick" maxlength="12" autocomplete="off" placeholder="닉네임을 입력하세요" required />
    <div class="row"><button type="submit">출근 등록</button><button type="button" class="cancel">취소</button></div></form>`;
  const form = dialogs.querySelector('form');
  const close = () => { dialogs.innerHTML = ''; };
  form.querySelector('input').focus();
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    setName(form.querySelector('input').value.trim());
    paintLogin();
    close();
  });
  form.querySelector('.cancel').addEventListener('click', close);
  dialogs.querySelector('.dim').addEventListener('click', close);
});
