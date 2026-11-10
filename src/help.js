import './base.css';
import './help.css';
import { sprite, svgUrl, LOGO, WORKER, PAPERS, ICONS } from './pixel.js';
import { officeDisplay } from './scene.js';

document.querySelector('.logo-img').src = svgUrl(sprite(LOGO.rows, LOGO.palette, 10));

// Red boxes that point at each part of the panel, in panel pixels.
const MARKS = {
  0: [],
  1: [[392, 165, 98, 30]],
  2: [[79, 195, 709, 30]],
  3: [[309, 217, 258, 44]],
  4: [[26, 255, 824, 116]],
  5: [[10, 375, 325, 52], [547, 375, 326, 52]],
};

const loadImg = (src) =>
  new Promise((ok) => {
    const im = new Image();
    im.onload = () => ok(im);
    im.src = src;
  });

const FONT = 'Neodgm';
const GOTHIC = "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";

// Draws the typing panel (880 x 431) as a still picture, like a screenshot of the game.
function drawPanel(ctx, art, { source, sentence, marks }) {
  const box = (x, y, w, h, r, fill) => {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fillStyle = fill;
    ctx.fill();
  };
  const text = (t, x, y, size, color, align = 'left', font = FONT) => {
    ctx.font = font === FONT ? `${size}px ${FONT}` : `700 ${size}px ${font}`;
    ctx.letterSpacing = font === FONT ? '0px' : '1px';
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillText(t, x, y);
    return ctx.measureText(t).width;
  };

  // display
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, 880, 187, [8, 8, 0, 0]);
  ctx.clip();
  ctx.drawImage(art.display, 0, 0, 880, 187);
  ctx.restore();
  box(816, 9, 55, 20, 4, '#ffffff59');
  text('BETA', 843.5, 19.5, 12, '#f1f1f1', 'center');
  ctx.drawImage(art.worker, 419, 97, 42, 56);
  ctx.drawImage(art.papers, 570, 113, 48, 40);
  box(408, 180, 66, 5, 3, '#817878');

  // stats
  box(0, 194, 880, 33, 6, '#ffffff');
  for (const [label, x] of [['SPD:', 92], ['ACC:', 401], ['CNT:', 709]]) {
    const w = text(label, x, 211, 12, '#aaaaaa');
    text('0', x + w + 6, 211, 20, '#777777');
  }

  // input area
  box(0, 231, 880, 200, 8, '#ffffff');
  box(325, 227, 231, 22, [0, 0, 8, 8], '#344136');
  text('SPD: XX / ACC: XX / MAX: XX', 440.5, 238.5, 11, '#ffffff', 'center');
  text(`- ${source} -`, 37, 268, 16, '#c8c8c8', 'left', GOTHIC);
  text(sentence, 37, 295, 20, '#a7a7a7', 'left', GOTHIC);
  box(37, 313, 2, 22, 0, '#a7a7a7');
  text('위 문장을 타이핑 하세요.', 41, 324, 20, '#e2e2e2', 'left', GOTHIC);
  box(37, 361, 798, 3, 0, '#c8c9ca');

  // stamina (pink) and coffee (grey) gauges
  box(22, 390, 299, 24, 7, '#542331');
  box(25, 393, 293, 18, 4, '#542532');
  box(25, 393, 293, 6, 0, '#f299b2');
  box(25, 399, 293, 5, 0, '#9d6272');
  for (let x = 28; x < 312; x += 7) box(x, 393 + ((x * 5) % 9), 3, 3, 0, ['#ffffff', '#9d6272', '#f299b2', '#542532'][x % 4]);
  box(304, 395, 9, 9, 0, '#ffffff');
  box(559, 390, 299, 24, 7, '#ababab');
  box(562, 393, 293, 18, 4, '#cbcbcb');
  box(562, 393, 293, 3, 0, '#ffffff');
  box(562, 406, 293, 5, 0, '#b9b9b9');

  // buttons
  [367, 419, 472].forEach((x, i) => {
    box(x, 388, 43, 32, 3, '#a1a1a1');
    box(x + 2, 390, 39, 28, 2, '#d4d4d4');
    const ic = art.icons[i];
    ctx.drawImage(ic, x + (43 - ic.width) / 2, 388 + (32 - ic.height) / 2);
  });

  // pointers
  ctx.strokeStyle = '#ff0000';
  ctx.lineWidth = 2;
  for (const [x, y, w, h] of marks) ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
}

async function drawFigures() {
  await document.fonts.load(`20px ${FONT}`, '가A');
  const [display, worker, papers, ...icons] = await Promise.all([
    loadImg(svgUrl(officeDisplay())),
    loadImg(svgUrl(sprite(WORKER.rows, WORKER.palette, 3))),
    loadImg(svgUrl(sprite(PAPERS.rows, PAPERS.palette, 4))),
    ...['help', 'home', 'gear'].map((k) => loadImg(svgUrl(sprite(ICONS[k].rows, ICONS[k].palette, 3)))),
  ]);
  const art = { display, worker, papers, icons };
  const dpr = Math.max(1, Math.ceil(window.devicePixelRatio || 1));
  for (const img of document.querySelectorAll('.fig')) {
    const n = Number(img.dataset.fig);
    const std = n === 0;
    const w = std ? 922 : 961;
    const h = std ? 492 : 509;
    const canvas = document.createElement('canvas');
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;
    ctx.translate(std ? 26 : 48, std ? 23 : 33);
    drawPanel(ctx, art, {
      source: std ? '회의록' : '업무 일지',
      sentence: std ? '이번 분기 목표는 고객 만족도를 높이는 것입니다.' : '커피 한 잔과 함께 오늘의 업무를 시작합니다.',
      marks: MARKS[n],
    });
    img.src = canvas.toDataURL('image/png');
  }
}
drawFigures();
