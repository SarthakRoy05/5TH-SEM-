document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('notesSubjectList');
  const countTag = document.getElementById('notesCountTag');
  if (!list) return;

  let totalNotes = 0;

  const pdfIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 15h1.5a1.5 1.5 0 0 0 0-3H9v5"/><path d="M13.5 12v5"/><path d="M13.5 12h1.2a1.5 1.5 0 0 1 0 3h-1.2"/></svg>`;
  const eyeIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>`;
  const downloadIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>`;

  NOTES_SUBJECTS.forEach((subject) => {
    const subjectEl = document.createElement('div');
    subjectEl.className = 'subject';

    const topicCount = subject.topics.length;
    const noteCount = subject.topics.reduce((n, t) => n + t.notes.length, 0);
    totalNotes += noteCount;

    subjectEl.innerHTML = `
      <button class="subject-head" type="button">
        <span class="dot"></span>
        <span class="meta">
          <h2>${subject.title}</h2>
          <span class="sub">${subject.tagline || ''} · ${topicCount} modules · ${noteCount} PDFs</span>
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
          <span class="t-count">${topic.notes.length}</span>
          <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <div class="video-panel">
          <div class="video-grid"></div>
        </div>
      `;

      const grid = topicEl.querySelector('.video-grid');
      topic.notes.forEach((n) => {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.innerHTML = `
          <div class="note-thumb">${pdfIcon}</div>
          <div class="note-info">
            <p class="n-title">${n.title}</p>
            <div class="note-actions">
              <a href="${n.file}" target="_blank" rel="noopener">${eyeIcon} View</a>
              <a href="${n.file}" download class="dl">${downloadIcon} Download</a>
            </div>
          </div>
        `;
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
    countTag.textContent = `${NOTES_SUBJECTS.length} subjects · ${totalNotes} PDFs`;
  }

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
});
