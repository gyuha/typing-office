// Tiny pixel-art helper: each sprite is a list of rows, one character per pixel.
// '.' is transparent; every other character maps to a colour in the palette.

export function sprite(rows, palette, size = 1, extra = '') {
  const w = rows[0].length;
  const h = rows.length;
  let rects = '';
  rows.forEach((row, y) => {
    let x = 0;
    while (x < w) {
      const ch = row[x];
      let run = 1;
      while (x + run < w && row[x + run] === ch) run++;
      if (ch !== '.' && palette[ch]) {
        rects += `<rect x="${x}" y="${y}" width="${run}" height="1" fill="${palette[ch]}"/>`;
      }
      x += run;
    }
  });
  return `<svg ${extra} width="${w * size}" height="${h * size}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${rects}</svg>`;
}

const SKIN = '#f2c9a0';
const HAIR = '#2b2420';

// Turn an SVG string into something an <img> can show.
export const svgUrl = (svg) => `data:image/svg+xml,${encodeURIComponent(svg)}`;

// Office worker in a white shirt and blue tie.
export const WORKER = {
  rows: [
    '....HHHHH...',
    '...HHHHHHH..',
    '..HHHHHHHHH.',
    '..HHSSSSSHH.',
    '..HSSESSESH.',
    '..SSSSSSSSS.',
    '...SSSRRSS..',
    '....SSSSS...',
    '..WWWWTWWWW.',
    '.WWWWWTWWWWW',
    '.SWWWWTWWWWS',
    '.SWWWWTWWWWS',
    '..PPPPPPPPP.',
    '..PPP...PPP.',
    '..PPP...PPP.',
    '..KKK...KKK.',
  ],
  palette: { H: HAIR, S: SKIN, E: '#1b1b1b', R: '#c97a6a', W: '#c9c9c9', T: '#3b5ea8', P: '#5a5e66', K: '#1e1e1e' },
};

// Colleague holding a coffee cup.
export const COLLEAGUE = {
  rows: [
    '..BBBBBBB.....',
    '.BBBBBBBBB....',
    'BBBBBBBBBBB...',
    'BBSSSSSSSBB...',
    'BBSESSSESBB...',
    'BBSSSSSSSBB...',
    'BB.SSRRSS.B...',
    '....SSSSS.....',
    '..CCCCCCCCC...',
    '.CCCCCCCCCCC..',
    '.SCCCCCCCCCSMM',
    '.SCCCCCCCCCSMMm',
    '..GGGGGGGGG.MM',
    '..GGG...GGG...',
    '..GGG...GGG...',
    '..KKK...KKK...',
  ].map((r) => r.padEnd(15, '.')),
  palette: { B: '#7a4a2a', S: SKIN, E: '#1b1b1b', R: '#c97a6a', C: '#7a4f3a', G: '#3d3f45', K: '#1e1e1e', M: '#f4f1ea', m: '#f4f1ea' },
};

// Big boss with a paper crown, sunglasses and a stack of yellow sign-off papers.
export const BOSS = {
  rows: [
    '..............NNNN....',
    '.............NNNNNN...',
    '............NNNNNNNN..',
    '...........NNnNNNNNNN.',
    '...........NNNNNNNNNNN',
    '..........yNNnnnNNNNNN',
    '..........yyNNNNNNNNNN',
    '..........yyyNNnnNNNNN',
    '..........yyyNNNNNNNNN',
    '....C.C.C.yyyyNNNNNNN.',
    '....CCCCC.yyyyyNNNNN..',
    '...HHHHHHH.yyyyyNNN...',
    '..HHHHHHHHHdyyyy......',
    '..HSSSSSSSHddyyy......',
    '..SGGGSGGGSdddDD......',
    '..SGgGSGgGSddDDDD.....',
    '..SSSSSSSSSdDDDDDD....',
    '..SSSBBBSSSDDDDDDDD...',
    '...SBBBBBSDDDDDDDDDD..',
    '...DkWTWkDDkDDkDDkDD..',
    '..DkDWTWDkDDkdDkDDkDD.',
    '.kDDkDTDkDDkDDkDDkkDkk',
    '.kDDkDTDkDDkDDkDkkkkkk',
    '.kkDkDDDkDkkDkkkkkkkkk',
  ],
  palette: { N: '#f6e08a', n: '#e0b04a', y: '#f2c94c', C: '#f6c933', H: '#2a1d14', S: '#8a5a3a', G: '#121212', g: '#ffe46c', B: '#3a2418', D: '#c99a3a', d: '#8a6424', W: '#f3efe2', T: '#5a3a1e', k: '#3a2418' },
};

// A pile of paperwork: the "monster" of the office.
export const PAPERS = {
  rows: [
    '...LLLLLLL..',
    '..LWWWWWWWL.',
    '..LWAAAAAWL.',
    '.LLLLLLLLLL.',
    '.LWWWWWWWWWL',
    '.LWAAAAAAAWL',
    'LLLLLLLLLLLL',
    'LWWWWWWWWWWL',
    'LWAAAAAAAAWL',
    'LLLLLLLLLLLL',
  ],
  palette: { L: '#6f6f6a', W: '#b8b6ae', A: '#9a988f' },
};

// Logo: a keyboard with a coffee mug.
export const LOGO = {
  rows: [
    '..........s.s..',
    '...........s...',
    '..........s.s..',
    '.........MMMMM.',
    '.........MCCCMm',
    '.........MCCCMm',
    '.........MMMMM.',
    '...............',
    'KKKKKKKKKKKKKKK',
    'KwKwKwKwKwKwKwK',
    'KKKKKKKKKKKKKKK',
    'KwKwKwKwKwKwKwK',
    'KKKKKKKKKKKKKKK',
    'KKKwwwwwwwwwKKK',
    'KKKKKKKKKKKKKKK',
  ],
  palette: { s: '#d8d8d8', M: '#e9e8e1', m: '#e9e8e1', C: '#7a4a2a', K: '#3b3b3b', w: '#d6d6d6' },
};

// Little icons for the panel buttons.
export const ICONS = {
  help: {
    rows: ['.QQQ.', 'Q...Q', '...Q.', '..Q..', '..Q..', '.....', '..Q..'],
    palette: { Q: '#8f8f8f' },
  },
  home: {
    rows: ['...Q...', '..QQQ..', '.QQQQQ.', 'QQQQQQQ', '.QQ.QQ.', '.QQ.QQ.', '.QQ.QQ.'],
    palette: { Q: '#8f8f8f' },
  },
  gear: {
    rows: ['.Q.Q.Q.', 'QQQQQQQ', '.QQ.QQ.', 'QQ...QQ', '.QQ.QQ.', 'QQQQQQQ', '.Q.Q.Q.'],
    palette: { Q: '#8f8f8f' },
  },
};
