// dynamic_ui.js (überarbeitet)
// Fügt Header am Anfang ein, prüft Duplikate und injiziert minimale Styles.
// Nutzung: <script src="dynamic_ui.js" defer></script> im iframe / Dokument.

const INFO_FILE = './info.txt'; // Pfad ggf. anpassen

// Wenn UI bereits vorhanden ist, nichts tun (verhindert Doppel-Insert)
if (!document.getElementById('site-header')) {
  // --- Minimaler Style-Block (nur falls keine externe CSS geladen) ---
  if (!document.getElementById('dynamic-ui-styles')) {
    const s = document.createElement('style');
    s.id = 'dynamic-ui-styles';
    s.textContent = `
      :root{font-family:system-ui,-apple-system,Segoe UI,Roboto,"Helvetica Neue",Arial;line-height:1.4}
      html,body{margin:0;padding:0;background:#f7f7f7;color:#111}
      header#site-header{display:flex;align-items:center;justify-content:space-between;padding:0px 6px;background:lightgray;box-shadow:0 1px 0 rgba(0,0,0,0.06);z-index:10}
      header#site-header h1{font-size:16px;margin:0}
      #info-btn{width:44px;height:38px;border-radius:8px;border:1px solid black;background:cyan;font-weight:700;font-size:16px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}
      main{padding:0px}
      #info-modal{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.45);padding:20px;z-index:9999}
      #info-modal.hidden{display:none}
      .modal-panel{width:100%;max-width:640px;max-height:80vh;overflow:auto;background:#fff;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,0.25);padding:12px}
      .modal-header{display:flex;align-items:center;justify-content:space-between}
      .modal-header h2{font-size:18px;margin:6px 0}
      #info-close{background:none;border:0;font-size:20px;cursor:pointer}
      #info-content{white-space:pre-wrap;font-size:15px;padding:6px 0}
    `;
    document.head.appendChild(s);
  }

  // Helfer zum Erzeugen von Elementen
  function el(tag, attrs = {}, text = '') {
    const e = document.createElement(tag);
    for (const k in attrs) {
      if (k === 'class') e.className = attrs[k];
      else if (k.startsWith('aria')) e.setAttribute(k, attrs[k]);
      else e[k] = attrs[k];
    }
    if (text) e.textContent = text;
    return e;
  }

  function buildUI() {
    // HEADER
    const header = el('header', { id: 'site-header' });
    const h1 = el('h1', {}, 'HTML und CSS / Editor');
    const infoBtn = el('button', {
      id: 'info-btn',
      ariaHaspopup: 'dialog',
      ariaControls: 'info-modal',
      ariaLabel: 'Information'
    }, 'i');
    header.appendChild(h1);
    header.appendChild(infoBtn);

    // MAIN (falls nicht vorhanden: erstelle einen)
    let main = document.querySelector('main');
    if (!main) main = el('main');

    // Wenn body schon Inhalt hat: wir wollen den Header an den Anfang stellen.
    // Verwende insertBefore um Header vor dem ersten Kind einzufügen.
    const body = document.body;
    if (body.firstChild) {
      body.insertBefore(header, body.firstChild);
      // Wenn wir main neu erzeugt haben, hängen wir ihn nach dem header ein.
      if (!document.querySelector('main')) body.insertBefore(main, header.nextSibling);
    } else {
      // leerer body -> einfach anhängen
      body.appendChild(header);
      body.appendChild(main);
    }

    // Falls main leer ist (neu erzeugt), setze Beispieltext
    if (!main.querySelector('*')) {
      main.appendChild(el('p', {}, ''));
    }

    // MODAL
    if (!document.getElementById('info-modal')) {
      const modal = el('div', { id: 'info-modal', role: 'dialog', 'aria-modal': 'true' });
      modal.classList.add('hidden');

      const panel = el('div', { class: 'modal-panel', role: 'document' });
      const modalHeader = el('div', { class: 'modal-header' });
      const title = el('h2', { id: 'info-title' }, 'Information');
      const closeBtn = el('button', { id: 'info-close', ariaLabel: 'Schließen' }, '✕');
      modalHeader.appendChild(title);
      modalHeader.appendChild(closeBtn);

      const infoContent = el('div', { id: 'info-content' }, 'Lädt…');

      panel.appendChild(modalHeader);
      panel.appendChild(infoContent);
      modal.appendChild(panel);
      body.appendChild(modal);

      // Interaktivität
      let lastFocus = null;

      async function openModal() {
        lastFocus = document.activeElement;
        modal.classList.remove('hidden');
        closeBtn.focus();
        try {
          const res = await fetch(INFO_FILE, { cache: 'no-store' });
          if (!res.ok) throw new Error('Datei nicht gefunden (' + res.status + ')');
          const txt = await res.text();
          infoContent.textContent = txt;
        } catch (err) {
          infoContent.textContent = 'Fehler beim Laden von ' + INFO_FILE + '\n' + err.message;
        }
      }

      function closeModal() {
        modal.classList.add('hidden');
        if (lastFocus) lastFocus.focus();
      }

      infoBtn.addEventListener('click', openModal);
      closeBtn.addEventListener('click', closeModal);
      modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal(); });
    }
  }

  // DOM-Ready: falls schon geladen, direkt aufrufen
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildUI);
  } else {
    buildUI();
  }
} // Ende: falls bereits vorhanden, nichts machen