// 우리채 — 모든 페이지 공통 스크립트
// 헤더 스크롤 그림자 / 캔버스 유틸 / 아코디언 / 감소된 모션 대응

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// 헤더: 스크롤하면 하단 보더 + 그림자
(function () {
  const header = document.getElementById('site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// 캔버스를 부모 크기에 맞춰 리사이즈 (레티나 대응)
function fitCanvas(canvas) {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = Math.max(1, rect.width * dpr);
  canvas.height = Math.max(1, rect.height * dpr);
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  return { w: canvas.width, h: canvas.height };
}

// 흐린 배경 보케 원 (실사 대신 쓰는 무드 아트의 공통 재료)
function drawBokeh(ctx, w, h, spots, time) {
  ctx.save();
  ctx.filter = `blur(${Math.max(6, w * 0.016)}px)`;
  spots.forEach((s) => {
    const drift = reduceMotion ? 0 : Math.sin(time * 0.45 + s.seed) * 0.013;
    const x = (s.x + drift) * w;
    const y = s.y * h;
    const r = s.r * Math.max(w, h);
    ctx.globalAlpha = s.a ?? 0.8;
    ctx.fillStyle = s.c;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
  ctx.globalAlpha = 1;
}

// 아코디언 (이용안내 FAQ)
document.addEventListener('click', (e) => {
  const q = e.target.closest('.acc-q');
  if (!q) return;
  const item = q.closest('.acc-item');
  const wasOpen = item.classList.contains('open');
  item.parentElement.querySelectorAll('.acc-item.open').forEach((el) => el.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
});

// 필터 칩 (공간 목록)
function initChipGroup(groupSelector, onChange) {
  const group = document.querySelector(groupSelector);
  if (!group) return;
  group.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    if (group.dataset.multi === 'true') {
      chip.classList.toggle('on');
    } else {
      group.querySelectorAll('.chip').forEach((c) => c.classList.remove('on'));
      chip.classList.add('on');
    }
    onChange && onChange();
  });
}

// 주소 복사 버튼 (오시는길)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-copy]');
  if (!btn) return;
  const text = btn.getAttribute('data-copy');
  navigator.clipboard?.writeText(text).then(() => {
    const original = btn.textContent;
    btn.textContent = '복사했어요 ✓';
    setTimeout(() => { btn.textContent = original; }, 1800);
  });
});
