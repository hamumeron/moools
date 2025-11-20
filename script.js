(() => {
  const currentEl = document.getElementById('current');
  const outputEl = document.getElementById('output');
  const dotBtn = document.getElementById('dotBtn');
  const dashBtn = document.getElementById('dashBtn');
  const commitBtn = document.getElementById('commitBtn');
  const spaceBtn = document.getElementById('spaceBtn');
  const backBtn = document.getElementById('backBtn');
  const clearBtn = document.getElementById('clearBtn');
  const copyBtn = document.getElementById('copyBtn');

  let buffer = '';
  let output = '';

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  function beep(durationMs) {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.value = 700;
    o.connect(g);
    g.connect(audioCtx.destination);
    g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + 0.01);
    o.start();
    setTimeout(() => {
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.02);
      setTimeout(() => o.stop(), 30);
    }, durationMs);
  }

  function updateUI() {
    currentEl.textContent = buffer || '(なし)';
    outputEl.textContent = output || '(なし)';
  }

  function pushDot() {
    buffer += '・';
    beep(120);
    updateUI();
  }

  function pushDash() {
    buffer += 'ー';
    beep(360);
    updateUI();
  }

  function commitLetter() {
    if (buffer === '') return;
    if (output) output += ' ';
    output += buffer;
    buffer = '';
    updateUI();
  }

  function insertWordSpace() {
    if (output && !output.endsWith(' /')) output += ' /';
    updateUI();
  }

  function backspace() {
    if (buffer.length > 0) {
      buffer = buffer.slice(0, -1);
    } else if (output.length > 0) {
      const parts = output.trimEnd().split(' ');
      parts.pop();
      output = parts.join(' ');
    }
    updateUI();
  }

  function clearAll() {
    buffer = '';
    output = '';
    updateUI();
  }

  dotBtn.addEventListener('click', pushDot);
  dashBtn.addEventListener('click', pushDash);
  commitBtn.addEventListener('click', commitLetter);
  spaceBtn.addEventListener('click', insertWordSpace);
  backBtn.addEventListener('click', backspace);
  clearBtn.addEventListener('click', clearAll);

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(output);
      copyBtn.textContent = 'コピー済み';
      setTimeout(() => (copyBtn.textContent = 'コピー'), 1000);
    } catch {
      alert('コピーに失敗しました');
    }
  });

  window.addEventListener('keydown', (ev) => {
    if (['ArrowUp','ArrowLeft','Enter',' ','Backspace'].includes(ev.key)) ev.preventDefault();

    if (ev.key === 'ArrowUp') pushDot();
    else if (ev.key === 'ArrowLeft') pushDash();
    else if (ev.key === 'Enter') commitLetter();
    else if (ev.key === ' ') insertWordSpace();
    else if (ev.key === 'Backspace') backspace();
  });

  updateUI();
})();
