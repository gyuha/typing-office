// The typing panel (display, stats, record board, input, gauges).
// Used live in the game and as still pictures on the help page.
import { sprite, svgUrl, WORKER, PAPERS, ICONS } from './pixel.js';
import { officeDisplay } from './scene.js';

export function panelHTML({ source, sentence, live = false, marks = [] } = {}) {
  const field = live
    ? '<input class="pv-field" type="text" autocomplete="off" spellcheck="false" placeholder="위 문장을 타이핑 하세요." aria-label="문장 입력" />'
    : '<div class="pv-field pv-fake"><span class="pv-caret"></span>위 문장을 타이핑 하세요.</div>';
  return `
  <div class="panel">
    <div class="pv-display">
      <img class="pv-bg" alt="" src="${svgUrl(officeDisplay())}" />
      <span class="pv-beta">BETA</span>
      <div class="pv-worker">${sprite(WORKER.rows, WORKER.palette, 3)}</div>
      <div class="pv-enemy">
        <div class="pv-enemy-name"></div>
        <div class="pv-enemy-hp"><i></i></div>
        <div class="pv-enemy-art">${sprite(PAPERS.rows, PAPERS.palette, 4)}</div>
      </div>
      <div class="pv-combo"><i></i></div>
      <div class="pv-pop"></div>
    </div>
    <div class="pv-stats">
      <span class="s1"><em>SPD:</em> <b data-k="spd">0</b></span>
      <span class="s2"><em>ACC:</em> <b data-k="acc">0</b></span>
      <span class="s3"><em>CNT:</em> <b data-k="cnt">0</b></span>
    </div>
    <div class="pv-input">
      <div class="pv-record">SPD: <span data-k="rspd">XX</span> / ACC: <span data-k="racc">XX</span> / MAX: <span data-k="rmax">XX</span></div>
      <p class="pv-source">- ${source} -</p>
      <p class="pv-sentence">${sentence}</p>
      ${field}
      <div class="pv-line"></div>
      <div class="pv-bottom">
        <div class="pv-bar pv-hp" title="체력"><i></i></div>
        <a class="pv-btn" href="Help/Help_Kor.html" title="도움말">${sprite(ICONS.help.rows, ICONS.help.palette, 3)}</a>
        <a class="pv-btn" href="#/" title="홈">${sprite(ICONS.home.rows, ICONS.home.palette, 3)}</a>
        <a class="pv-btn" href="#/" title="업무 선택">${sprite(ICONS.gear.rows, ICONS.gear.palette, 3)}</a>
        <div class="pv-bar pv-mp" title="커피 게이지"><i></i></div>
      </div>
    </div>
    ${marks.map(([x, y, w, h]) => `<span class="pv-mark" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"></span>`).join('')}
  </div>`;
}
