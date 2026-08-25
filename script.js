document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('subjectList');
  const countTag = document.getElementById('countTag');
  if (!list) return;

  let totalVideos = 0;

  SUBJECTS.forEach((subject) => {
    const subjectEl = document.createElement('div');
    subjectEl.className = 'subject';

    const topicCount = subject.topics.length;
    const videoCount = subject.topics.reduce((n, t) => n + t.videos.length, 0);
    totalVideos += videoCount;

    subjectEl.innerHTML = `
      <button class="subject-head" type="button">
        <span class="dot"></span>
        <span class="meta">
          <h2>${subject.title}</h2>
          <span class="sub">${subject.tagline || ''} · ${topicCount} topics · ${videoCount} recordings</span>
        </span>
        <svg class="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div class="topic-panel"></div>
    `;

    const panel = subjectEl.querySelector('.topic-panel');

    subject.topics.forEach((topic, i) => {
      const topicEl = document.createElement('div');
      topicEl.className = 'topic';
      topicEl.innerHTML = `
        <button class="topic-head" type="button">
          <span class="fret-num">${String(i + 1).padStart(2, '0')}</span>
          <span class="t-title">${topic.title}</span>
          <span class="t-count">${topic.videos.length}</span>
          <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <div class="video-panel">
          <div class="video-grid"></div>
        </div>
      `;

      const grid = topicEl.querySelector('.video-grid');
      topic.videos.forEach((v) => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
          <div class="video-thumb">
            <span class="play">
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </span>
          </div>
          <div class="video-info">
            <p class="v-title">${v.title}</p>
            <span class="v-dur">${v.duration}</span>
          </div>
        `;
        card.addEventListener('click', () => openPlayer(v));
        grid.appendChild(card);
      });

      topicEl.querySelector('.topic-head').addEventListener('click', () => {
        topicEl.classList.toggle('open');
      });

      panel.appendChild(topicEl);
    });

    subjectEl.querySelector('.subject-head').addEventListener('click', () => {
      subjectEl.classList.toggle('open');
    });

    list.appendChild(subjectEl);
  });

  if (countTag) {
    countTag.textContent = `${SUBJECTS.length} subjects · ${totalVideos} recordings`;
  }

  // density toggle
  const densityBtns = document.querySelectorAll('.density-toggle button');
  densityBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      densityBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.density;
      document.querySelectorAll('.video-grid').forEach((g) => {
        g.classList.remove('dense', 'roomy');
        if (mode !== 'default') g.classList.add(mode);
      });
    });
  });

  // player overlay
  const overlay = document.getElementById('playerOverlay');
  const playerVideo = document.getElementById('playerVideo');
  const playerTitle = document.getElementById('playerTitle');
  const closeBtn = document.getElementById('closePlayer');

  function openPlayer(v) {
    playerTitle.textContent = v.title;
    playerVideo.src = v.file;
    overlay.classList.add('show');
    playerVideo.play().catch(() => {});
  }
  function closePlayer() {
    overlay.classList.remove('show');
    playerVideo.pause();
    playerVideo.removeAttribute('src');
    playerVideo.load();
  }
  closeBtn.addEventListener('click', closePlayer);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePlayer();
  });
  window.openPlayer = openPlayer;
});
