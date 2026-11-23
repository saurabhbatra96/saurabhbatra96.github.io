// One scripted demo per project. Each gets a Playwright page that has already
// loaded the project's live URL, plus helpers. Recording of the clip starts
// when the demo calls `h.start()`, so slow loading never ends up in the clip.

const ORIGIN = 'https://saurabhbatra96.github.io';

export const demos = {
  async 'chess-lessons'(page, h) {
    await page.waitForSelector('.lead h1');
    h.start();
    await h.pause(1200);
    await h.clickText('Start lesson one');
    const puzzle = page.locator('.inline-puzzle .puzzle').first();
    await puzzle.waitFor();
    await h.pause(700);
    await h.scrollTo(puzzle, -40);
    await page.locator('.board--live').first().waitFor();
    const slug = decodeURIComponent(page.url().split('#/lesson/')[1] ?? '').split(/[/?]/)[0];
    const id = await puzzle.getAttribute('data-puzzle-id');
    const all = await (await fetch(`${ORIGIN}/chess-lessons/data/tactics/${slug}.json`)).json();
    const p = all.find((x) => x.id === id);
    const solver = p.fen.split(' ')[1] === 'w' ? 'b' : 'w';
    const board = puzzle.locator('.board');
    const at = async (sq) => {
      const box = await board.boundingBox();
      const f = 'abcdefgh'.indexOf(sq[0]);
      const r = +sq[1] - 1;
      const col = solver === 'w' ? f : 7 - f;
      const row = solver === 'w' ? 7 - r : r;
      return { x: box.x + ((col + 0.5) * box.width) / 8, y: box.y + ((row + 0.5) * box.height) / 8 };
    };
    for (let i = 1; i < p.moves.length; i += 2) {
      await page.locator('.board--live').first().waitFor();
      await h.pause(500);
      const uci = p.moves[i];
      await h.clickAt(await at(uci.slice(0, 2)));
      await h.pause(250);
      await h.clickAt(await at(uci.slice(2, 4)));
      if (uci[4]) await puzzle.locator('.board__promotion').first().click();
    }
    await h.pause(2200);
  },

  async 'graphics-lab'(page, h) {
    await page.waitForTimeout(2500);
    h.start();
    await h.pause(4500);
    await h.clickText('2 · Umbra 2D');
    await h.pause(800);
    await h.moveTo({ x: 640, y: 400 });
    for (const [x, y] of [[420, 300], [860, 480], [620, 620], [760, 260]]) await h.moveTo({ x, y }, 40);
    await page.keyboard.down('ArrowRight');
    await h.pause(1600);
    await page.keyboard.up('ArrowRight');
    await page.keyboard.down('ArrowUp');
    await h.pause(900);
    await page.keyboard.up('ArrowUp');
    await h.pause(1000);
  },

  async wololoop(page, h) {
    await page.waitForFunction(() => !document.body.innerText.includes('starting…'), null, { timeout: 60000 });
    await page.waitForTimeout(800);
    h.start();
    await h.pause(800);
    await h.clickText('Start');
    await h.pause(500);
    const editor = page.locator('.CodeMirror').first();
    const box = await editor.boundingBox();
    await h.clickAt({ x: box.x + box.width * 0.5, y: box.y + box.height - 30 });
    await page.keyboard.press('Meta+ArrowDown');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await page.keyboard.type('print(net_positions(SAMPLE_TRADES))', { delay: 45 });
    await h.pause(400);
    await h.click(page.locator('#btn-run'));
    await h.pause(1800);
    await h.click(page.locator('#btn-test'));
    await h.pause(2200);
  },

  async 'dog-game'(page, h) {
    await page.waitForFunction(() => {
      const s = document.querySelector('#status');
      return !s || getComputedStyle(s).display === 'none' || getComputedStyle(s).visibility === 'hidden';
    }, null, { timeout: 90000 });
    await page.waitForTimeout(1500);
    await page.mouse.click(640, 400);
    h.start();
    await h.pause(600);
    const hold = async (key, ms) => { await page.keyboard.down(key); await h.pause(ms); await page.keyboard.up(key); };
    await hold('KeyD', 1400);
    await page.keyboard.down('KeyD');
    await hold('Space', 250);
    await h.pause(700);
    await hold('Space', 250);
    await h.pause(900);
    await page.keyboard.up('KeyD');
    await h.pause(400);
    await hold('KeyF', 200);
    await h.pause(1400);
    await hold('KeyA', 900);
    await hold('Space', 250);
    await h.pause(1200);
  },

  async 'systematic-trading'(page, h) {
    await page.waitForTimeout(800);
    h.start();
    await h.pause(900);
    await h.click(page.getByRole('link', { name: 'The research process' }).first());
    await h.pause(1200);
    await h.wheel(1400, 2200);
    await h.pause(600);
    await h.click(page.getByRole('button', { name: /Switch to dark mode/ }).first());
    await h.pause(900);
    await h.wheel(700, 1200);
    await h.pause(800);
  },

  async 'life-in-the-uk'(page, h) {
    await page.waitForTimeout(800);
    h.start();
    await h.pause(700);
    await h.click(page.getByRole('button', { name: '3.6 The Tudors and Stuarts' }));
    await h.pause(800);
    await h.wheel(600, 1400);
    await h.pause(400);
    await h.wheel(-600, 600);
    await h.click(page.getByRole('button', { name: /Quiz/ }));
    for (let i = 0; i < 2; i++) {
      await h.pause(900);
      await h.click(page.locator('.quiz-opt').nth(i === 0 ? 2 : 0));
      await h.pause(1300);
      const next = page.getByRole('button', { name: /Next|Skip/ }).first();
      if (await next.isVisible()) await h.click(next);
    }
    await h.pause(800);
  },

  async 'dino-bot'(page, h) {
    await page.waitForTimeout(800);
    h.start();
    await h.pause(700);
    await h.click(page.locator('#toggle-train'));
    await h.pause(2500);
    const slider = page.locator('#speed-range');
    const b = await slider.boundingBox();
    await h.moveTo({ x: b.x + 4, y: b.y + b.height / 2 });
    await page.mouse.down();
    await h.moveTo({ x: b.x + b.width * 0.7, y: b.y + b.height / 2 }, 25);
    await page.mouse.up();
    await h.pause(4500);
  },

  async 'nextgen-tetris'(page, h) {
    await page.waitForTimeout(800);
    await page.keyboard.press('Space');
    await page.waitForTimeout(400);
    // The speed tag cycles NORMAL -> 10x -> 100x. Start at 10x so the board fills up,
    // then step up to 100x on camera.
    const tag = page.getByText('NORMAL', { exact: true }).first();
    const box = await tag.boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(6000);
    h.start();
    await h.pause(3000);
    await h.clickAt({ x: box.x + box.width / 2, y: box.y + box.height / 2 });
    await h.moveTo({ x: 1100, y: 640 });
    await h.pause(4500);
  },

  async 'the-human-engineer'(page, h) {
    await page.waitForTimeout(1200);
    h.start();
    await h.pause(1200);
    await h.moveTo({ x: 700, y: 34 }, 30);
    await h.pause(500);
    await h.wheel(1300, 2600);
    await h.pause(500);
    await h.wheel(1100, 2400);
    await h.pause(900);
  },

  async 'not-your-ai-overlords'(page, h) {
    await page.waitForTimeout(1200);
    h.start();
    await h.pause(1200);
    await h.moveTo({ x: 200, y: 500 }, 30);
    await h.pause(400);
    await h.wheel(1500, 2600);
    await h.pause(500);
    await h.click(page.getByRole('link', { name: 'Read the latest finding' }).first(), { scroll: true });
    await h.pause(1200);
    await h.wheel(1000, 2000);
    await h.pause(600);
  },

  async thekickassrepo(page, h) {
    await page.waitForTimeout(500);
    await page.locator('#audioFile').setInputFiles(h.audioFile);
    await page.waitForTimeout(1500);
    h.start();
    await h.pause(8000);
  },
};
