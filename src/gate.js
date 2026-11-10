// Password gate. Client-side only: it keeps casual visitors out, it is not real security.
const HASH = '2348d07f5cff07d94ccb97660ba20828b7c5259b2d4233b2f6e99ed0ed7c34fd';
const KEY = 'to.unlocked';

const sha256 = async (s) =>
  [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))]
    .map((b) => b.toString(16).padStart(2, '0')).join('');

const unlocked = () => {
  try { return sessionStorage.getItem(KEY) === HASH; } catch { return false; }
};

export async function unlock() {
  if (unlocked()) return;
  document.documentElement.style.visibility = 'hidden';
  const box = document.createElement('form');
  box.style.cssText = 'position:fixed;inset:0;z-index:9999;visibility:visible;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:#393638;color:#fff;font-family:var(--font-pixel)';
  box.innerHTML = `<label for="pw">암호를 입력하세요</label>
    <input id="pw" type="password" autocomplete="off" style="padding:8px;font:inherit;text-align:center" />
    <button type="submit" style="padding:6px 16px;font:inherit">입장</button>
    <p class="err" style="margin:0;color:#ff8a80;min-height:1em"></p>`;
  document.body.appendChild(box);
  box.querySelector('input').focus();
  await new Promise((done) => {
    box.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (await sha256(box.querySelector('input').value) === HASH) {
        try { sessionStorage.setItem(KEY, HASH); } catch { /* ignore */ }
        done();
      } else {
        box.querySelector('.err').textContent = '암호가 틀렸습니다.';
      }
    });
  });
  box.remove();
  document.documentElement.style.visibility = '';
}
