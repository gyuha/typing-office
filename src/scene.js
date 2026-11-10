// Pixel-style office scenes drawn with plain SVG rectangles.

const r = (x, y, w, h, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;

// Wide landing backdrop, 1440x810, floor line at y=661 (same place the original's ground sits).
export function officeBackdrop() {
  let s = '';
  // back wall and its lower bands
  s += r(0, 0, 1440, 422, '#889686');
  s += r(0, 422, 1440, 113, '#7b8b7d');
  s += r(0, 535, 1440, 90, '#6f8474');
  s += r(0, 625, 1440, 36, '#647264');
  // ceiling lights
  for (let x = 60; x < 1440; x += 280) {
    s += r(x, 0, 150, 10, '#7c897a') + r(x + 6, 10, 138, 8, '#95a692');
  }
  // big windows with a city skyline
  const windows = [[40, 70, 300], [400, 60, 330], [790, 70, 300], [1150, 60, 260]];
  for (const [x, y, w] of windows) {
    const h = 300;
    s += r(x - 8, y - 8, w + 16, h + 16, '#83917f');
    s += r(x, y, w, h, '#93a48f');
    // skyline
    let bx = x + 6;
    let i = 0;
    while (bx < x + w - 20) {
      const bw = 26 + ((i * 37) % 30);
      const bh = 60 + ((i * 53) % 120);
      s += r(bx, y + h - bh, Math.min(bw, x + w - bx), bh, '#8a9b87');
      for (let wy = y + h - bh + 10; wy < y + h - 10; wy += 18) {
        for (let wx = bx + 5; wx < bx + bw - 6 && wx < x + w - 6; wx += 10) s += r(wx, wy, 4, 6, '#93a48f');
      }
      bx += bw + 6;
      i++;
    }
    // mullions
    s += r(x + w / 2 - 3, y, 6, h, '#83917f') + r(x, y + h / 2 - 3, w, 6, '#83917f');
  }
  // wall clock
  s += r(1095, 395, 40, 40, '#6d7b6c') + r(1100, 400, 30, 30, '#a6b8a2') + r(1114, 404, 3, 13, '#5b665a') + r(1114, 414, 10, 3, '#5b665a');
  // wainscot rail
  s += r(0, 452, 1440, 6, '#717f72');
  // cubicle partitions and desks
  for (let x = 20; x < 1440; x += 240) {
    s += r(x, 470, 200, 8, '#6c7b6d'); // partition top
    s += r(x, 478, 200, 60, '#738375');
    // monitor
    s += r(x + 60, 500, 70, 46, '#5a675b') + r(x + 66, 506, 58, 34, '#72857b') + r(x + 90, 546, 10, 12, '#5a675b');
    // desk
    s += r(x - 10, 558, 220, 12, '#6c7466') + r(x - 4, 570, 10, 91, '#626f63') + r(x + 194, 570, 10, 91, '#626f63');
    // drawers
    s += r(x + 140, 580, 50, 81, '#6b7a69') + r(x + 146, 590, 38, 3, '#5a675a') + r(x + 146, 620, 38, 3, '#5a675a');
    // chair
    s += r(x + 30, 590, 50, 30, '#5e6c60') + r(x + 52, 620, 6, 34, '#57625a') + r(x + 34, 654, 42, 7, '#57625a');
  }
  // plants
  for (const x of [215, 700, 1180]) {
    s += r(x, 600, 24, 61, '#7d6a52') + r(x - 14, 560, 52, 40, '#5f7a5c') + r(x - 4, 540, 32, 22, '#6c8a68');
  }
  // wooden floor
  s += r(0, 661, 1440, 16, '#7b6b59');
  for (let x = 0; x < 1440; x += 96) s += r(x, 661, 3, 16, '#6e5f4f');
  s += r(0, 668, 1440, 2, '#6e5f4f');
  s += r(0, 677, 1440, 4, '#4a4440');
  return `<svg viewBox="0 0 1440 810" preserveAspectRatio="xMidYMax slice" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${s}</svg>`;
}

// The small display inside the typing panel, 880x187.
export function officeDisplay() {
  let s = '';
  // upper wall with windows
  s += r(0, 0, 880, 62, '#909fa5');
  for (const x of [180, 300, 400, 660]) {
    s += r(x, 6, 80, 50, '#8a979c') + r(x + 4, 10, 72, 42, '#95a4a9');
    s += r(x + 4, 34, 18, 18, '#94a3a8') + r(x + 26, 24, 16, 28, '#94a3a8') + r(x + 46, 38, 14, 14, '#94a3a8') + r(x + 62, 30, 14, 22, '#94a3a8');
    s += r(x + 38, 10, 4, 42, '#7d8a8f');
  }
  // wooden pillars and bookshelves (where the original has tree trunks)
  for (const [x, w] of [[44, 17], [151, 25], [264, 32], [620, 31], [675, 13], [741, 9]]) {
    s += r(x, 0, w, 102, '#756552') + r(x, 0, 4, 102, '#836e58') + r(x + w - 4, 0, 4, 102, '#5b5145');
  }
  const folders = ['#836e58', '#5b5145', '#907d67', '#595046', '#756652'];
  for (const [x, w] of [[77, 50], [528, 57], [774, 50]]) {
    s += r(x, 0, w, 102, '#5b5145');
    for (let y = 4; y < 100; y += 24) {
      s += r(x, y + 18, w, 4, '#756552');
      for (let i = 0; x + 3 + i * 7 < x + w - 6; i++) s += r(x + 3 + i * 7, y + 2 + (i % 3) * 2, 6, 16 - (i % 3) * 2, folders[(i + y) % 5]);
    }
  }
  // cubicle partitions
  s += r(0, 62, 880, 4, '#8c9796') + r(0, 66, 880, 22, '#848f8a');
  for (const x of [20, 190, 330, 470, 610, 780]) s += r(x, 70, 60, 30, '#5f6a60') + r(x + 4, 74, 52, 22, '#77857a');
  s += r(0, 88, 880, 14, '#6e776f') + r(0, 102, 880, 43, '#4f524c');
  for (let x = 0; x < 880; x += 140) s += r(x, 102, 4, 43, '#2c2d2c');
  // rows of potted plants along the cubicles
  const leaf = ['#5a645d', '#626d64', '#66706a', '#4f5850', '#6d776d'];
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  for (let x = 0; x < 880; x += 5) {
    const top = 84 + Math.floor(rnd() * 26);
    for (let y = top; y < 150; y += 5) if (rnd() < 0.55) s += r(x, y, 5, 5, leaf[Math.floor(rnd() * 5)]);
  }
  s += r(0, 145, 880, 7, '#56615a');
  // floor
  s += r(0, 152, 880, 18, '#4b4436') + r(0, 170, 880, 17, '#393028');
  for (let x = 20; x < 880; x += 70) s += r(x, 172, 20, 3, '#342b23');
  return `<svg viewBox="0 0 880 187" preserveAspectRatio="none" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${s}</svg>`;
}
