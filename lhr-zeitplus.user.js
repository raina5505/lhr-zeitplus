// ==UserScript==
// @name         LHR Zeit+
// @namespace    lhr-zeitplus
// @version      5.26.5
// @description  High-End-Dashboard für die LHR-Zeitdatenliste: Live-Arbeitszeit, Feierabend, Saldo, Mittag/Raucherpausen, Woche, Monat, Timer, Hinweise, frei anordnen, Themes mit Effekten
// @match        *://lohnselfservice/*
// @include      /^https?:\/\/lohnselfservice(\.[^\/]+)*(:\d+)?\/.*$/
// @updateURL    https://raw.githubusercontent.com/raina5505/lhr-zeitplus/main/lhr-zeitplus.user.js
// @downloadURL  https://raw.githubusercontent.com/raina5505/lhr-zeitplus/main/lhr-zeitplus.user.js
// @homepageURL  https://github.com/raina5505/lhr-zeitplus
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';
    if (window.top !== window && /^zp-/.test(window.name || '')) return;     // Hintergrund-Rahmen für den Jahres-PDF-Export: Zeit+ dort nicht starten
    const VERSION = '5.26.5';
    try { console.info('%c[Zeit+] v' + VERSION + ' geladen', 'color:#7c8cff;font-weight:bold'); } catch (e) { }

    /* ════════════════════ ICONS (SVG, Lucide-Stil) ════════════════════ */
    const IC = {
        clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
        scale: '<path d="M12 3v18M7 21h10M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z"/>',
        calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
        utensils: '<path d="M5.5 3v5a2.5 2.5 0 0 0 5 0V3"/><path d="M8 3v18"/><path d="M17.5 3.2C15.6 4.4 14.6 7 14.6 10c0 1.5.4 2.6 1.2 3.2h1.7z" fill="currentColor"/><path d="M17.2 13.5V21"/>',
        wind: '<path d="M3 8h10a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7"/>',
        target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
        trend: '<path d="M3 17l6-6 4 4 8-8M14 7h7v7"/>',
        sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
        door: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>',
        timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>',
        pencil: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
        palette: '<circle cx="13.5" cy="6.5" r="1.2"/><circle cx="17.5" cy="10.5" r="1.2"/><circle cx="8.5" cy="7.5" r="1.2"/><circle cx="6.5" cy="12.5" r="1.2"/><path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.3A5.7 5.7 0 0 0 22 9.7C22 5.4 17.5 2 12 2z"/>',
        sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
        chevron: '<path d="M6 9l6 6 6-6"/>',
        x: '<path d="M18 6L6 18M6 6l12 12"/>',
        eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
        width: '<path d="M21 12H3M7 8l-4 4 4 4M17 8l4 4-4 4"/>',
        bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
        layout: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
        calc: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h8"/>',
        zap: '<path d="M13 2L3 14h9l-1 8 10-12h-9z"/>',
        alert: '<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/>',
        check: '<path d="M20 6L9 17l-5-5"/>',
        up: '<path d="M18 15l-6-6-6 6"/>',
        down: '<path d="M6 9l6 6 6-6"/>',
        sparkle: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/>',
        arrowUp: '<path d="M12 19V5M5 12l7-7 7 7"/>',
        rows: '<path d="M3 6h18M3 12h18M3 18h18"/>',
        table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/>',
        ext: '<path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
        plus: '<path d="M12 5v14M5 12h14"/>',
        home: '<path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
        pointer: '<path d="M9 11V5a2 2 0 0 1 4 0v5M13 10V8a2 2 0 0 1 4 0v3M17 11a2 2 0 0 1 4 0v4a7 7 0 0 1-7 7h-1a7 7 0 0 1-6-3.4L4.5 15a2 2 0 0 1 3.4-2.1L9 14.5"/>',
        file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/>',
        users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
        grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
        planner: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4M7 13h4M13 13h4M7 17h4"/>',
        left: '<path d="M15 18l-6-6 6-6"/>',
        right: '<path d="M9 18l6-6-6-6"/>',
        refresh: '<path d="M21 12a9 9 0 0 1-15.5 6.2L3 16M3 12A9 9 0 0 1 18.5 5.8L21 8M21 3v5h-5M3 21v-5h5"/>',
        pdf: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3"/>',
        send: '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
        user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
        help: '<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
        logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
        globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
        minimize: '<path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3"/>',
        maximize: '<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>'
    };
    const ico = (n, s) => `<svg class="ic" width="${s || 16}" height="${s || 16}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n] || ''}</svg>`;

    /* ════════════════════ KARTEN ════════════════════ */
    const CARD_DEFS = {
        heute:  { name: 'Heute netto',     icon: 'clock',    tip: 'Netto-Arbeitszeit heute (nach Pausen-Abzug), Fortschritt zum Soll' },
        saldo:  { name: 'Saldo',           icon: 'scale',    tip: 'Gleitzeitsaldo inkl. heute, live' },
        woche:  { name: 'Woche',           icon: 'calendar', tip: 'Ist/Soll dieser Woche mit Tagesbalken' },
        pause:  { name: 'Mittagspause',    icon: 'utensils', tip: 'Größte Lücke im Mittagsfenster. Fehlt etwas zur Pflichtpause, zieht das System es ab.' },
        rauch:  { name: 'Raucherpausen',   icon: 'wind',     tip: 'Alle anderen Ausstempel-Lücken – zählen nicht als Arbeit' },
        wunsch: { name: 'Gehen um …',      icon: 'target',   tip: 'Was passiert mit dem Saldo, wenn du zu dieser Uhrzeit gehst?' },
        monat:  { name: 'Monat',           icon: 'trend',    tip: 'Saldo-Verlauf im Monat und Ist/Soll' },
        urlaub: { name: 'Resturlaub',      icon: 'sun',      tip: 'Resturlaub – umschaltbar: per Monatsende (LHR) oder Jahresende (noch nicht eingetragen, aus dem Kalender)' },
        kommen: { name: 'Stempelblöcke',   icon: 'door',     tip: 'Alle Kommen/Gehen-Blöcke von heute' },
        brwe:   { name: 'Wochenend-Dienste', icon: 'zap',      tip: 'Wochenenden mit tatsächlich gestempelter Arbeit (Sa ab 13:00 / So) in den letzten 365 Tagen – laut KV IT max. 10' }
    };
    const DEF_LAYOUT = [
        { id: 'heute', on: true, wide: false }, { id: 'saldo', on: true, wide: false }, { id: 'woche', on: true, wide: false },
        { id: 'monat', on: true, wide: false }, { id: 'pause', on: false, wide: false }, { id: 'rauch', on: false, wide: false },
        { id: 'wunsch', on: false, wide: false }, { id: 'urlaub', on: false, wide: false }, { id: 'kommen', on: false, wide: false },
        { id: 'brwe', on: false, wide: false }
    ];

    /* ════════════════════ APP-LEISTE ════════════════════ */
    const NAV_ICON = { zm_buchen: 'pointer', zm_zeitdatenliste: 'rows', anzBn: 'bell', anzOa: 'file', zm_kalender: 'calendar', zm_abw_uebersicht: 'users', zm_tableau: 'grid', zm_planer: 'planner' };
    const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    const shell = { nav: [], menu: [], pdf: [], per: null };
    const origClick = elx => { try { elx.click(); } catch (e) { reportError('Aktion', e); } };
    function readShellSource() {
        shell.nav = [...document.querySelectorAll('.navmenu a.navmenu_a')].map(a => {
            const lbEl = a.querySelector('.navmenu_icon_beschriftung');
            const label = (lbEl ? lbEl.textContent : a.textContent).replace(/\s+/g, ' ').trim();
            let on = !!(lbEl && lbEl.classList.contains('active'));
            try { if (!on && new URL(a.href, location.href).pathname === location.pathname) on = true; } catch (e) { }
            const short = { anzBn: 'Mitteilungen', zm_abw_uebersicht: 'Abwesenheiten' }[a.id] || label.replace(/übersicht$/i, '');
            return { a, id: a.id, label, short, href: a.getAttribute('href'), on, icon: NAV_ICON[a.id] || 'grid' };
        }).filter(x => x.label);
        const seen = new Set();
        shell.menu = [...document.querySelectorAll('.hbmbutton a, .hbmbutton button, .hbmbutton input[type=button]')].filter(a => { if (seen.has(a)) return false; seen.add(a); return true; })
            .map(a => ({ a, label: (a.textContent || a.value || '').replace(/\s+/g, ' ').trim() })).filter(x => x.label && !/^men(ü|u)$/i.test(x.label));
        shell.pdf = [...document.querySelectorAll('#pdflst a')].map(a => ({ a, label: a.textContent.replace(/\s+/g, ' ').trim() })).filter(x => x.label);
        const per = document.getElementById('periode');
        if (per) {
            const back = document.getElementById('periode_a'), fwd = document.getElementById('periode_a2');
            const pv = (document.getElementById('zdl_periode') || {}).getAttribute ? document.getElementById('zdl_periode').getAttribute('value') : null;
            const inp = document.getElementById('zdlMonth');
            const val = pv || (inp && inp.value) || '';
            let mm = val.match(/(\d{1,2})\.(\d{4})/);
            if (!mm) {           // andere Seiten mit Monatsleiste (z.B. Planer): Monat aus dem Text der LHR-Leiste lesen
                const tx = (per.textContent || '').replace(/\s+/g, ' ');
                const mn = ['jän', 'feb', 'mär', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dez'];
                const mt = tx.toLowerCase().match(/(jän|jan|feb|mär|mar|apr|mai|jun|jul|aug|sep|okt|nov|dez)[a-zä]*\.?\s*(\d{4})/);
                if (mt) { const i = mt[1] === 'jan' ? 0 : mt[1] === 'mar' ? 2 : mn.indexOf(mt[1]); if (i >= 0) mm = [mt[0], String(i + 1), mt[2]]; }
                else mm = tx.match(/(\d{1,2})\.(\d{4})/);
            }
            const spans = [...per.querySelectorAll('.periode_span')];
            const fertig = per.querySelector('a[id^="fertigmeld"]');
            const lpt = document.getElementById('le_periode_text');
            if (lpt && !document.getElementById('zdl_periode')) {        // Planer: Woche/Monat/Jahr per Buttons
                const gc = per.closest('#general-controls');
                if (gc && gc.classList.contains('hidden')) { shell.per = null; return; }
                shell.per = null; per.classList.remove('zp-hide-orig');          // Planer: eigene Monats-Navigation in der Seite (planerNav)
                return;
            }
            const ym = ((document.getElementById('periode_text') || {}).textContent || '').match(/(\d{4})/);
            if (ym && !document.getElementById('zdl_periode')) {      // Kalender: Jahres-Navigation statt Monat
                shell.per = { el: per, back, fwd, yearMode: true, y: +ym[1], status: '', fertig: null, fertigTxt: '', recalc: null };
                return;
            }
            shell.per = {
                el: per, back, fwd, m: mm ? +mm[1] : new Date().getMonth() + 1, y: mm ? +mm[2] : new Date().getFullYear(),
                status: spans.length ? spans[0].textContent.replace(/\s+/g, ' ').trim() : '', fertig, fertigTxt: fertig ? fertig.textContent.replace(/\s+/g, ' ').trim() : '',
                recalc: document.getElementById('periode_pe')
            };
        } else shell.per = null;
    }
    function periodUrl(val) {
        const src = (shell.per && (shell.per.back || shell.per.fwd)) ? (shell.per.back || shell.per.fwd).getAttribute('href') : null;
        try {
            const u = new URL(src || location.href, location.href);
            u.searchParams.set('periode', val);
            return u.pathname + u.search;
        } catch (e) { return location.pathname + '?modulId=0&periode=' + encodeURIComponent(val); }
    }
    function userInfo() {
        const t = (document.getElementById('welcome_name_text') || {}).textContent || '';
        const raw = t.replace(/\s+/g, ' ').trim();
        const nr = (raw.match(/\((\d+)\)/) || [])[1] || '';
        const name = raw.replace(/\(\d+\)/, '').trim().split(' ').map(w => w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w).join(' ');
        const img = document.getElementById('welcome_name_img');
        const st = img ? (img.getAttribute('title') || '') : '';
        return { name: name || 'Benutzer', nr, initials: name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('') || '?', present: /anwesend/i.test(st) && !/abwesend/i.test(st), status: st };
    }
    function buildShell() {
        readShellSource();
        if (!shell.nav.length && !document.getElementById('welcome_name')) return false;
        const host = el('div');
        host.id = 'zp-shell-host';
        document.body.insertBefore(host, document.body.firstChild);
        SH = mkRoot(host);
        const box = el('div', 'zp-font');
        box.id = 'zs';
        SH.appendChild(box);
        const pop = el('div'); pop.id = 'zs-pop';   // außerhalb von #zs (backdrop-filter würde position:fixed einfangen)
        SH.appendChild(pop);
        pop.addEventListener('click', onShellClick);
        if (shell.menu.length || !document.querySelector('.hbmbutton')) document.querySelectorAll('.hbmbutton').forEach(x => x.classList.add('zp-hide-orig'));
        if (shell.per) shell.per.el.classList.add('zp-hide-orig');
        renderShell();
        box.addEventListener('click', onShellClick);
        document.addEventListener('click', e => { if (!inPath(e, box) && !inPath(e, pop)) closePops(); });
        window.addEventListener('scroll', () => closePops(), { passive: true });
        return true;
    }
    function countdown() {
        if (!S.cdOn) return null;
        const t0 = new Date(); t0.setHours(0, 0, 0, 0);
        let d = null, name = (S.cdName || '').trim() || 'Weihnachtsfeier';
        const m = String(S.cdDate || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (m) d = new Date(+m[1], +m[2] - 1, +m[3]);
        else { d = new Date(t0.getFullYear(), 11, 24); if (d < t0) d = new Date(t0.getFullYear() + 1, 11, 24); if (!S.cdName || S.cdName === 'Weihnachtsfeier') name = 'Weihnachten'; }
        const n = Math.round((d - t0) / 864e5);
        if (n < 0) return { name, n, d, over: true };
        return { name, n, d };
    }
    function renderShell() {
        if (shell.per && shell.per.el && !shell.per.el.classList.contains('zp-hide-orig')) shell.per.el.classList.add('zp-hide-orig');
        const box = $('zs');
        if (!box) return;
        const u = userInfo(), P = shell.per;
        const cd = countdown(), mc = themeKey() === 'maci';
        const cdHtml = cd && cd.over ? `<button type="button" class="zs-cd over" data-act="cd" title="${esc(cd.name)} ist vorbei – klicken für einen neuen Countdown">${ico('plus', 13)}<span>Neuen Zieltermin festlegen</span></button>` : cd ? `<button type="button" class="zs-cd${mc ? ' maci' : ''}" data-act="cd" title="${esc(cd.name)} am ${pad(cd.d.getDate())}.${pad(cd.d.getMonth() + 1)}.${cd.d.getFullYear()} – klicken zum Einstellen"><span class="e">${mc ? '🎄' : '🎉'}</span><span class="t">${esc(cd.name)}</span><b class="num">${cd.n === 0 ? 'heute!' : cd.n === 1 ? 'morgen' : cd.n + ' Tage'}</b></button>` : '';
        const active = shell.nav.find(n => n.on);
        const navHtml = shell.nav.map((n, i) => {
            const bgEl = n.a.querySelector('.navmenu_anzahl_bg'), cnt = n.a.querySelector('.navmenu_anzahl');
            const c = cnt ? cnt.textContent.trim() : '';
            const badge = bgEl && !bgEl.classList.contains('hidden') && c && c !== '?' && c !== '0' ? `<span class="zs-badge num">${esc(c)}</span>` : '';
            return `<a href="${esc(n.href || '#')}" class="${n.on ? 'on' : ''}" title="${esc(n.label)}" data-nav="${i}">${ico(n.icon, 17)}<span class="lb">${esc(n.short)}</span>${badge}</a>`;
        }).join('');
        let sub = '';
        if (P && P.planer) {
            sub = `<div class="zs-sub">
                <div class="zs-title">${esc(active ? active.label : 'Planer')}</div>
                <div class="zs-month">
                  <button type="button" data-act="prev" title="Vorherige Ansicht">${ico('left', 16)}</button>
                  <span class="m num">${esc(P.label || '')}</span>
                  <button type="button" data-act="next" title="Nächste Ansicht">${ico('right', 16)}</button>
                </div>${cdHtml}<span class="sp"></span></div>`;
        } else if (P && P.yearMode) {
            const ur = readUrlaub();
            const urTxt = ur && !/ermittelt/i.test(ur) ? ur.replace(/^Resturlaub\s*/i, '').replace(/^per Ende\s*/i, 'Ende ') : '';
            sub = `<div class="zs-sub">
                <div class="zs-title">${esc(active ? active.label : 'Kalender')}</div>
                <div class="zs-month">
                  <button type="button" data-act="prev" title="Vorjahr"${P.back && P.back.getAttribute('href') ? '' : ' disabled'}>${ico('left', 16)}</button>
                  <span class="m num">Jahr ${P.y}</span>
                  <button type="button" data-act="next" title="Folgejahr"${P.fwd && P.fwd.getAttribute('href') ? '' : ' disabled'}>${ico('right', 16)}</button>
                  ${P.y !== new Date().getFullYear() ? '<button type="button" class="t" data-act="thisyear">Aktuelles Jahr</button>' : ''}
                </div>
                ${cdHtml}<span class="sp"></span>
                ${shell.menu.length ? `<button type="button" class="zp-btn pri" data-act="new">${ico('plus', 15)} Neu ${ico('chevron', 13)}</button>` : ''}
              </div>`;
        } else if (P) {
            const ur = readUrlaub();
            const urTxt = ur && !/ermittelt/i.test(ur) ? ur.replace(/^Resturlaub\s*/i, '').replace(/^per Ende\s*/i, 'Ende ') : '';
            const done = /fertig|genehmigt|abgerechnet/i.test(P.status) && !/bearbeitung/i.test(P.status);
            sub = `<div class="zs-sub full">
                <div class="zs-title">${esc(active ? active.label : 'Zeitdatenliste')}</div>
                <div class="zs-month">
                  <button type="button" data-act="prev" title="Vormonat"${P.back ? '' : ' disabled'}>${ico('left', 16)}</button>
                  <button type="button" class="m num" data-act="month">${MONTHS[P.m - 1]} ${P.y} ${ico('chevron', 14)}</button>
                  <button type="button" data-act="next" title="Nächster Monat"${P.fwd && P.fwd.getAttribute('href') ? '' : ' disabled'}>${ico('right', 16)}</button>
                  <button type="button" class="t" data-act="today">Heute</button>
                </div>
                ${P.status ? `<span class="zs-chip st${done ? ' ok' : ''}">${ico(done ? 'check' : 'pencil', 13)}${esc(P.status)}</span>` : ''}
                ${urTxt ? `<span class="zs-chip ur" title="Resturlaub ${esc(urTxt)}">${ico('sun', 13)}<b class="num">${esc((urTxt.match(/:\s*(-?[\d.,]+\s*\S*)/) || [])[1] || urTxt)}</b></span>` : ''}
                ${cdHtml}<span class="sp"></span>
                ${shell.menu.length ? `<button type="button" class="zp-btn" data-act="new">${ico('plus', 15)} Neu ${ico('chevron', 13)}</button>` : ''}
                ${P.recalc ? `<button type="button" class="zp-btn" data-act="recalc" title="Berechnung bis Monatsende">${ico('refresh', 15)} Berechnen</button>` : ''}
                ${shell.pdf.length ? `<button type="button" class="zp-btn" data-act="pdf">${ico('pdf', 15)} PDF ${ico('chevron', 13)}</button>` : ''}
                ${P.fertig ? `<button type="button" class="zp-btn pri" data-act="fertig">${ico('send', 15)} ${esc(P.fertigTxt ? P.fertigTxt[0].toUpperCase() + P.fertigTxt.slice(1) : 'Fertigmelden')}</button>` : ''}
              </div>`;
        }
        if (!P && !shell.menu.length && cdHtml) sub = `<div class="zs-sub"><div class="zs-title">${esc(active ? active.label : document.title || 'LHR')}</div>${cdHtml}<span class="sp"></span></div>`;
        if (!P && shell.menu.length) {      // Seiten ohne Monatsleiste (Kalender, Anträge …): eigenes Menü trotzdem erreichbar
            sub = `<div class="zs-sub"><div class="zs-title">${esc(active ? active.label : document.title || 'LHR')}</div>${cdHtml}<span class="sp"></span>
                <button type="button" class="zp-btn pri" data-act="new">${ico('plus', 15)} Neu ${ico('chevron', 13)}</button></div>`;
        }
        const keepLive = box.classList.contains('live-on');
        box.innerHTML = `<div class="zs-in">
            <div class="zs-bar">
              <a class="zs-brand" href="/Self?modulId=0" title="Hauptseite">${LOGO}<span>LHR Zeit +</span></a>
              <nav class="zs-nav">${navHtml}</nav>
              <div class="zs-live num" id="zs-live" data-act="top" title="Nach oben"></div>
              <div class="zs-right">
                ${updAvail() ? `<button type="button" class="zs-upd" data-act="upd" title="Neue Version ${esc(updState().latest)} – klicken, dann in Tampermonkey auf „Aktualisieren“">${ico('refresh', 15)}<span>Update ${esc(updState().latest)}</span></button>` : ''}
                <button type="button" class="zp-icon" data-act="theme" title="Theme wechseln (Alt+T)">${ico('palette', 17)}</button>
                <button type="button" class="zp-icon" data-act="gear" title="Zeit+ Einstellungen (Alt+S)">${ico('sliders', 16)}</button>
                <button type="button" class="zs-user" data-act="user" title="${esc(u.status)}"><span class="zs-av">${esc(u.initials)}<i class="${u.present ? 'on' : ''}"></i></span><span class="nm">${esc(u.name)}${u.nr ? `<small class="num">${esc(u.nr)}</small>` : ''}</span>${ico('chevron', 14)}</button>
              </div>
            </div>${sub}</div>`;
        box.classList.toggle('live-on', keepLive);
    }
    function closePops() { const p = $('zs-pop'); if (p) p.innerHTML = ''; }
    function openPop(btn, html, width) {
        const p = $('zs-pop');
        if (!p) return;
        if (p.dataset.for === btn.dataset.act && p.innerHTML) { closePops(); p.dataset.for = ''; return; }
        p.dataset.for = btn.dataset.act;
        p.innerHTML = `<div class="zs-pop zp-font">${html}</div>`;
        const pop = p.firstChild, r = btn.getBoundingClientRect(), w = width || 240;
        pop.style.minWidth = w + 'px';
        const left = Math.max(12, Math.min(r.right - w, innerWidth - w - 12));
        pop.style.left = (r.left + w > innerWidth - 12 ? left : Math.max(12, r.left)) + 'px';
        pop.style.top = (r.bottom + 8) + 'px';
    }
    let pickYear = null;
    function monthPicker(btn) {
        const P = shell.per; if (!P) return;
        if (pickYear == null) pickYear = P.y;
        const now = new Date();
        openPop(btn, `<div class="zs-yr"><button type="button" data-act="yr-" title="Vorjahr">${ico('left', 15)}</button><b class="num">${pickYear}</b><button type="button" data-act="yr+" title="Folgejahr">${ico('right', 15)}</button></div>
            <div class="zs-months">${MONTHS.map((n, i) => `<button type="button" data-month="${i + 1}" class="${P.y === pickYear && P.m === i + 1 ? 'on' : ''}${now.getFullYear() === pickYear && now.getMonth() === i ? ' now' : ''}">${n.slice(0, 3)}</button>`).join('')}</div>`, 250);
    }
    function onShellClick(e) {
        const t = e.target.closest('[data-act],[data-month],[data-mi],[data-pdf],[data-lang]');
        if (!t) return;
        const P = shell.per;
        if (t.dataset.month) { location.href = periodUrl(pad(+t.dataset.month) + '.' + pickYear); return; }
        if (t.dataset.mi != null) { closePops(); const m = shell.menu[+t.dataset.mi]; if (m) origClick(m.a); return; }
        if (t.dataset.pdf != null) { closePops(); const m = shell.pdf[+t.dataset.pdf]; if (m) origClick(m.a); return; }
        if (t.dataset.lang) { closePops(); if (typeof window.changeLang === 'function') window.changeLang(t.dataset.lang); return; }
        const act = t.dataset.act;
        if (act === 'yr-' || act === 'yr+') { e.stopPropagation(); pickYear += act === 'yr-' ? -1 : 1; const b = $('zs').querySelector('[data-act="month"]'); const p = $('zs-pop'); p.dataset.for = ''; monthPicker(b); return; }
        if ((act === 'prev' || act === 'next') && P && P.planer) { const b = act === 'prev' ? P.back : P.fwd; if (b) { b.click(); setTimeout(() => safe('App-Leiste', () => { readShellSource(); renderShell(); }), 900); } return; }
        if (act === 'prev' && P && P.back) { location.href = P.back.getAttribute('href'); return; }
        if (act === 'next' && P && P.fwd && P.fwd.getAttribute('href')) { location.href = P.fwd.getAttribute('href'); return; }
        if (act === 'today') { location.href = periodUrl(''); return; }
        if (act === 'thisyear') { try { const u = new URL((P.back || P.fwd).getAttribute('href'), location.href); u.searchParams.delete('jahr'); location.href = u.pathname + u.search; } catch (er) { location.href = location.pathname; } return; }
        if (act === 'month') { pickYear = null; monthPicker(t); return; }
        if (act === 'recalc' && P && P.recalc) { location.href = P.recalc.getAttribute('href'); return; }
        if (act === 'fertig' && P && P.fertig) { origClick(P.fertig); return; }
        if (act === 'new') { openPop(t, `<h5>Neu erfassen</h5>${shell.menu.map((m, i) => `<button type="button" class="zs-mi" data-mi="${i}">${ico(/pause/i.test(m.label) ? 'utensils' : /notiz/i.test(m.label) ? 'file' : /abwesen/i.test(m.label) ? 'sun' : /umbuch/i.test(m.label) ? 'refresh' : /mehrfach/i.test(m.label) ? 'rows' : 'plus', 15)}${esc(m.label[0].toUpperCase() + m.label.slice(1))}</button>`).join('')}`, 250); return; }
        if (act === 'pdf') { openPop(t, `<h5>Report drucken</h5>${shell.pdf.map((m, i) => `<button type="button" class="zs-mi" data-pdf="${i}">${ico('pdf', 15)}${esc(m.label)}</button>`).join('')}<div class="zs-sepl"></div><button type="button" class="zs-mi" data-act="pdfyear">${ico('calendar', 15)}Ganzes Jahr herunterladen…</button>`, 250); return; }
        if (act === 'pdfyear') { closePops(); openYearPdf(); return; }
        if (act === 'upd') { closePops(); openUpdate(); return; }
        if (act === 'updcheck') { closePops(); openUpdate(); return; }
        if (act === 'theme') { cycleTheme(); return; }
        if (act === 'gear') { openModal(); return; }
        if (act === 'cd') { openModal('extra'); return; }
        if (act === 'top') { const h = document.getElementById('zp-host'); if (h) h.scrollIntoView({ behavior: 'smooth', block: 'start' }); else window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
        if (act === 'user') {
            const u = userInfo();
            const link = (id, icon, label, cls, blank) => { const a = document.getElementById(id); return a ? `<a class="zs-mi ${cls || ''}" href="${esc(a.getAttribute('href'))}"${blank ? ' target="_blank"' : ''}>${ico(icon, 15)}${label}</a>` : ''; };
            const sel = document.getElementById('ml_select');
            const langs = sel ? [...sel.options].map(o => `<button type="button" data-lang="${esc(o.textContent.trim())}" class="${o.selected ? 'on' : ''}">${esc(o.textContent.trim().toUpperCase())}</button>`).join('') : '';
            openPop(t, `<h5>${esc(u.name)}${u.nr ? ' · ' + esc(u.nr) : ''}${u.status ? ' · ' + esc(u.status) : ''}</h5>
                ${link('change_pw', 'user', 'Benutzerdaten ändern')}${link('call_hilfe', 'help', 'LHR-Hilfe', '', true)}
                <a class="zs-mi" href="https://github.com/raina5505/lhr-zeitplus#readme" target="_blank" rel="noopener">${ico('file', 15)}Hilfe zu LHR Zeit +<small style="margin-left:auto;opacity:.6">Anleitung</small></a>
                ${langs ? `<div class="zs-sepl"></div><h5>${ico('globe', 12)} Sprache</h5><div class="zs-langs">${langs}</div>` : ''}
                <div class="zs-sepl"></div><button type="button" class="zs-mi" data-act="${updAvail() ? 'upd' : 'updcheck'}">${ico('refresh', 15)}${updAvail() ? 'Update auf ' + esc(updState().latest) + ' installieren' : 'Nach Updates suchen'}<small style="margin-left:auto;opacity:.6">v${VERSION}</small></button>
                <div class="zs-sepl"></div>${link('logout', 'logout', 'Abmelden', 'danger')}`, 250);
        }
    }

    /* ════════════════════ KALENDER (Jahresübersicht) ════════════════════ */
    const KAL_NAMES = { U: 'Urlaub', F: 'Feiertag', K: 'Krankenstand', A: 'Arzt', R: 'Remotearbeit', Z: 'Zeitausgleich', S: 'Sonderurlaub', D: 'Dienstreise', P: 'Pflegefreistellung', B: 'Berufsschule', H: 'Homeoffice', G: 'Gleittag' };
    const WD_LONG = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const WD_SHORT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    const rgbOf = s => { const m = String(s || '').match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?/); if (!m) return null; let a = m[4] == null ? 1 : parseFloat(m[4]); if (/%$/.test(m[4] || '')) a /= 100; else if (a > 1) a /= 255; return { r: +m[1], g: +m[2], b: +m[3], a }; };
    const lumOf = c => (0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b) / 255;
    const cssRgb = c => `rgb(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)})`;
    const colDist = (a, b) => Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b);
    const inkOf = c => lumOf(c) > .52 ? '#17130e' : '#fff';
    let kalData = null, kalLastSig = '';

    function readKal() {
        const tab = document.getElementById('kalendertab');
        if (!tab) return null;
        const y = +((((document.getElementById('periode_text') || {}).textContent || '').match(/(\d{4})/) || [])[1]) || new Date().getFullYear();
        const legend = [];
        const sum = document.getElementById('kalendertab_summe');
        if (sum) sum.querySelectorAll('tbody tr').forEach(tr => {
            const nmEl = tr.querySelector('[id="kal_td_abwesenheit"]');
            if (!nmEl) return;
            const sw = [...tr.children].find(td => td.hasAttribute('style')) || null;
            const cls = sw ? sw.className : '';
            const col = sw ? rgbOf(sw.style.backgroundColor) : null;
            legend.push({
                name: nmEl.textContent.replace(/\s+/g, ' ').trim(),
                letter: sw ? sw.textContent.replace(/\s+/g, '').trim() : '',
                color: col && col.a > .05 ? col : null,
                tage: ((tr.querySelector('[id="kal_td_tage"]') || {}).textContent || '').trim(),
                std: ((tr.querySelector('[id="kal_td_stunden"]') || {}).textContent || '').trim(),
                cb: tr.querySelector('input[type="checkbox"]'),
                kind: /kalTag_sa/.test(cls) ? 'sa' : /kalTag_so_fe/.test(cls) ? 'so' : 'abs'
            });
        });
        const absLeg = legend.filter(l => l.kind === 'abs');
        legSave(legend);
        const findLeg = (letter, col) => {
            const same = absLeg.filter(l => l.letter === letter);
            if (col) { const m = same.find(l => l.color && colDist(l.color, col) < 30); if (m) return m; }
            if (!col) { const m = same.find(l => !l.color); if (m) return m; }
            return same.find(l => !!l.color === !!col) || null;
        };
        const t0 = new Date(); t0.setHours(0, 0, 0, 0);
        const brs = brStore();
        const months = [];
        tab.querySelectorAll('tbody > tr').forEach((tr, idx) => {
            const nm = ((tr.querySelector('[id="monatsname"]') || tr.children[0] || {}).textContent || '').trim();
            let mi = MONTHS.indexOf(nm); if (mi < 0) mi = idx;
            const days = [];
            [...tr.children].slice(1).forEach((td, i) => {
                const dt = new Date(y, mi, i + 1);
                if (dt.getMonth() !== mi) return;
                const cls = td.className || '';
                const a = td.querySelector('a[href]');
                const letter = td.textContent.replace(/\s+/g, '').trim().slice(0, 3);
                let col = rgbOf(td.style.backgroundColor); if (col && col.a <= .05) col = null;
                const wd = dt.getDay();
                const pend = !!td.querySelector('[style*="italic"]');
                const leg = letter ? findLeg(letter, col) : null;
                let kind = null, name = '';
                if (letter) {
                    if (col || (leg && leg.color)) { kind = 'abs'; col = col || leg.color; }
                    else kind = 'work';
                    name = leg ? leg.name : (KAL_NAMES[letter[0]] || letter);
                }
                days.push({
                    d: i + 1, dt, key: dayKey(dt), wd, letter, col, kind, name, pend,
                    we: wd === 0 || wd === 6 || /kalTag_sa/.test(cls),
                    hol: (/kalTag_so_fe/.test(cls) && wd !== 0) || letter === 'F',
                    past: dt < t0, today: /kalTagHeute/.test(cls) || dt.getTime() === t0.getTime(),
                    href: a ? a.getAttribute('href') : null, br: brs[dayKey(dt)] || 0
                });
            });
            months.push({ mi, name: MONTHS[mi], days });
        });
        months.sort((a, b) => a.mi - b.mi);
        const ru = (document.getElementById('resturlaub_kalender') || {}).textContent || '';
        return { y, legend, months, ru: ru.replace(/\s+/g, ' ').trim() };
    }

    function buildKal() {
        const content = document.getElementById('content');
        if (!content || !document.getElementById('kalendertab')) return false;
        const host = el('div');
        host.id = 'zp-kal-host';
        const err = document.getElementById('error_urlaubmaxdate_div');
        if (err && err.parentElement === content) err.after(host); else content.insertBefore(host, content.firstChild);
        K = mkRoot(host);
        const box = el('div', 'zp-font');
        box.id = 'zk';
        K.appendChild(box);
        box.addEventListener('click', e => {
            const v = e.target.closest('[data-kv]');
            if (v) { S.kalView = v.dataset.kv; saveS(); applyTheme(); return; }
            if (e.target.closest('[data-brt]')) { S.brCollapsed = !S.brCollapsed; saveS(); kalLastSig = ''; renderKal(); return; }
            const y = e.target.closest('[data-ky]');
            if (y) { const a = document.getElementById(y.dataset.ky === '-' ? 'periode_a' : 'periode_a2'); if (a && a.getAttribute('href')) location.href = a.getAttribute('href'); return; }
            const cb = e.target.closest('[data-cb]');
            if (cb && kalData) { const l = kalData.legend[+cb.dataset.cb]; if (l && l.cb) origClick(l.cb); return; }
            const d = e.target.closest('[data-k]');
            if (d && kalData) {
                const day = kalData.byKey.get(d.dataset.k);
                if (day && day.href) location.href = day.href;
                else if (day && day.kind === 'abs') toast(WD_LONG[day.wd] + ', ' + day.key, day.name + (day.pend ? ' – beantragt, noch nicht genehmigt.' : '.') + ' Ändern/Stornieren geht über „Anträge“.', { icon: 'calendar' });
            }
        });
        renderKal();
        setTimeout(() => safe('Bereitschaft', syncBRKal), 1200);
        return true;
    }

    /* Bereitschaftstage für den Kalender direkt aus den Zeitdatenlisten holen (im Hintergrund, aktueller Monat zuletzt) */
    let brSyncing = false;
    function syncBRKal() { if (kalData) return syncBR(kalData.y, () => { kalLastSig = ''; renderKal(); }); }
    async function syncBR(y, onChange, fromIdx) {
        if (brSyncing) return; brSyncing = true;
        try {
            const now = new Date(), cy = now.getFullYear(), cm = now.getMonth();
            let seen = {}; try { seen = JSON.parse(localStorage.getItem('zplus_brm') || '{}') || {}; } catch (e) { }
            const list = [];
            for (let m = 0; m < 12; m++) {
                const idx = (y - cy) * 12 + (m - cm);          // 0 = aktueller Monat
                if (idx > 1) continue;                        // Zukunft: nur nächster Monat
                if (fromIdx != null && idx < fromIdx) continue;   // z.B. nur die letzten 12 Monate
                const per = pad(m + 1) + '.' + y, age = Date.now() - (seen[per] || 0);
                const maxAge = idx >= -1 ? 3 * 3600e3 : 20 * 86400e3;
                if (age > maxAge) list.push({ per, idx });
            }
            if (!list.length) return;
            list.sort((a, b) => (a.idx === 0) - (b.idx === 0));
            const nav = document.getElementById('zm_zeitdatenliste');
            const base = nav ? nav.getAttribute('href') : '/Self/zeiterfassung/zdliste?modulId=0&periode=';
            let changed = false;
            for (const { per } of list) {
                let html = '';
                try { const u = new URL(base, location.href); u.searchParams.set('periode', per); const r = await fetch(u.pathname + u.search, { credentials: 'same-origin' }); if (!r.ok) continue; html = await r.text(); } catch (e) { continue; }
                const doc = new DOMParser().parseFromString(html, 'text/html'), map = new Map();
                doc.querySelectorAll('tr[data-periode]').forEach(r => { const k = r.getAttribute('data-periode'); if (!/^\d\d\.\d\d\.\d{4}$/.test(k) || k.slice(3) !== per) return; if (!map.has(k)) map.set(k, []); map.get(k).push(r); });
                if (map.size) {
                    const before = localStorage.getItem(BR_KEY) || '';
                    rememberBR(map);
                    if ((localStorage.getItem(BR_KEY) || '') !== before) changed = true;
                }
                seen[per] = Date.now();
                try { localStorage.setItem('zplus_brm', JSON.stringify(seen)); } catch (e) { }
            }
            if (changed && onChange) onChange();
        } finally { brSyncing = false; }
    }

    function renderKal() {
        const box = $('zk');
        if (!box) return;
        const k = readKal();
        if (!k) return;
        kalData = k;
        k.byKey = new Map();
        k.months.forEach(m => m.days.forEach(d => k.byKey.set(d.key, d)));
        const t0 = new Date(); t0.setHours(0, 0, 0, 0);
        const all = k.months.flatMap(m => m.days);
        // Brückentage: kurze Arbeitstag-Lücken (1–3 Tage) zwischen freien Tagen, an mindestens einem Feiertag
        const bridges = [];
        {
            // frei = nur Wochenende oder Feiertag – eigener Urlaub zählt NICHT mit, sonst wären es keine echten Brückentage
            const offAbs = d => d.kind === 'abs' && !/remote|home|dienst|berufsschul|seminar|schulung|kurs|arzt|bereitschaft|reise/i.test(d.name || '');
            const free = d => d.we || d.hol;
            let i = 0;
            while (i < all.length) {
                if (free(all[i])) { i++; continue; }
                let j = i; while (j < all.length && !free(all[j])) j++;
                const L = j - i;
                if (L <= 3 && i > 0 && j < all.length) {
                    let a = i - 1; while (a > 0 && free(all[a - 1])) a--;
                    let b = j; while (b < all.length - 1 && free(all[b + 1])) b++;
                    const span = all.slice(a, b + 1), work = all.slice(i, j);
                    const hasHol = span.some(d => d.hol && d.wd !== 0 && d.wd !== 6);
                    if (hasHol && work.every(d => d.dt > t0) && !work.every(offAbs)) {      // schon komplett genommen → kein Vorschlag mehr
                        const planned = [];
                        const tot = L;
                        bridges.push({ work, planned, from: span[0], to: span[span.length - 1], len: span.length, cost: L, tot, ratio: span.length / tot, holName: (span.find(d => d.hol && d.wd !== 0 && d.wd !== 6) || {}).key });
                    }
                }
                i = j;
            }
            bridges.sort((x, y) => y.ratio - x.ratio || x.from.dt - y.from.dt);
        }
        const bridgeDays = new Set(bridges.flatMap(b => b.work.map(d => d.key)));
        const view = S.kalView;

        // Kennzahlen
        const ruNum = (k.ru.match(/:\s*(-?[\d.,]+)\s*(Tag\w*|Std\w*|h)?/i) || []);
        const ruPer = (k.ru.match(/Ende\s+([\d.]+)/i) || [])[1] || '';
        const urlLeg = k.legend.find(l => /urlaub/i.test(l.name) && l.kind === 'abs');
        const pend = all.filter(d => d.pend);
        const future = all.filter(d => !d.past && d.kind === 'abs' && d.letter !== 'F');
        let next = null;
        if (future.length) {        // zusammenhängender Block (Wochenenden/Feiertage dazwischen erlaubt)
            const f = future[0]; let last = f;
            for (const d of all) {
                if (d.dt <= f.dt) continue;
                if (d.kind === 'abs' && d.name === f.name) { last = d; continue; }
                if (d.we || d.hol) continue;
                break;
            }
            const n = Math.round((f.dt - t0) / 864e5);
            next = { f, last, n };
        }
        const nextHol = all.find(d => !d.past && d.hol && !d.today && d.wd !== 0 && d.wd !== 6);
        const fmtD = d => WD_SHORT[d.wd] + ' ' + pad(d.d) + '.' + pad(d.dt.getMonth() + 1) + '.';
        const inTxt = n => n === 0 ? 'heute' : n === 1 ? 'morgen' : 'in ' + n + ' Tagen';
        // Urlaubstage im Jahr: schon genommen / noch verplant (Wochenenden und Feiertage zählen nicht)
        const urlDays = all.filter(d => d.kind === 'abs' && /urlaub/i.test(d.name || '') && !/sonder/i.test(d.name || '') && !d.we && !d.hol);
        const urTaken = urlDays.filter(d => d.dt < t0 && !d.pend).length, urPlan = urlDays.filter(d => d.dt >= t0 && !d.pend).length, urPend = urlDays.filter(d => d.pend).length;
        const urSub = urlDays.length ? [urTaken + ' gebucht', urPlan + ' verplant', urPend ? urPend + ' beantragt' : ''].filter(Boolean).join(' · ') : (ruNum[1] ? 'noch kein Urlaub eingetragen' : 'wird von LHR ermittelt');
        if (ruNum[1] && k.y === new Date().getFullYear()) { try { localStorage.setItem('zplus_ruy', JSON.stringify({ y: k.y, val: ruNum[1], unit: ruNum[2] || 'Tage', per: ruPer, plan: urPlan, pend: urPend, taken: urTaken, ts: Date.now() })); } catch (e) { } }
        const stat = (icon, label, val, sub, cls) => `<div class="zk-st ${cls || ''}"><small>${ico(icon, 13)}${label}</small><b class="num">${val}</b><span>${sub}</span></div>`;
        const stats = `<div class="zk-stats">
            ${stat('sun', 'Resturlaub ' + k.y, ruNum[1] ? esc(ruNum[1]) + ' <em>' + esc(ruNum[2] || 'Tage') + '</em>' : (/ermittelt/i.test(k.ru) || !k.ru ? '…' : esc(k.ru)), urSub, 'acc')}
            ${stat('calendar', 'Urlaub ' + k.y, urlLeg ? esc(urlLeg.tage || '0') + ' <em>Tage</em>' : '0 <em>Tage</em>', urlLeg ? 'im Kalender eingetragen' : 'noch nichts eingetragen')}
            ${stat('send', 'Beantragt', pend.length + ' <em>' + (pend.length === 1 ? 'Tag' : 'Tage') + '</em>', pend.length ? 'offen: ' + pend.slice(0, 3).map(fmtD).join(', ') + (pend.length > 3 ? ' …' : '') : 'keine offenen Anträge', pend.length ? 'warn' : '')}
            ${stat('target', 'Nächste Abwesenheit', next ? esc(fmtD(next.f)) + (next.last !== next.f ? ' – ' + esc(fmtD(next.last)) : '') : '—', next ? esc(next.f.name) + (next.f.pend ? ' (beantragt)' : '') + ' · ' + inTxt(next.n) : 'nichts geplant' + (nextHol ? ' · nächster Feiertag ' + esc(fmtD(nextHol)) : ''))}
          </div>`;

        // Tageszelle
        const cell = (d, strip) => {
            if (!d) return '<span class="zk-d blank"></span>';
            let cls = 'zk-d', style = '', tip = WD_LONG[d.wd] + ', ' + d.key;
            if (d.we && !d.br) cls += ' we';                 // Bereitschaft am Wochenende = Arbeitstag, nicht matt
            if (d.hol) { cls += ' hol'; if (d.letter !== 'F') tip += ' · Feiertag'; }
            if (d.past) cls += ' past';
            if (d.today) { cls += ' today'; tip += ' · heute'; }
            if (d.kind === 'abs') { cls += ' abs'; style = `--c:${cssRgb(d.col)};--ink:${inkOf(d.col)}`; tip += ' · ' + d.name; }
            else if (d.kind === 'work') { cls += ' work'; tip += ' · ' + d.name; }
            if (d.pend) { cls += ' pend'; tip += ' (beantragt)'; }
            if (d.br) { cls += ' brd'; tip += ' · Bereitschaft'; }
            if (d.kind === 'abs' && /remote|home/i.test(d.name || '')) cls += ' rem';
            if (bridgeDays.has(d.key)) { cls += ' bridge'; tip += ' · Brückentag-Tipp'; }
            if (d.href) { cls += ' add'; tip += '\nKlicken: Urlaub / Abwesenheit eintragen'; }
            const inner = strip ? (d.kind === 'abs' ? `<b>${esc(d.letter)}</b>` : '') : `<b>${d.d}</b>${d.kind === 'abs' ? `<i>${esc(d.letter)}</i>` : ''}`;
            return `<button type="button" class="${cls}" style="${style}" title="${esc(tip)}" data-k="${d.key}">${inner}</button>`;
        };

        let body = '';
        if (view === 'months') {
            body = `<div class="zk-months">${k.months.map(m => {
                const first = m.days[0] ? (m.days[0].wd + 6) % 7 : 0;
                const cur = m.days.some(d => d.today);
                const cnt = new Map();
                m.days.forEach(d => { if (d.kind === 'abs' && d.letter !== 'F') { const c = cnt.get(d.name) || { n: 0, col: d.col }; c.n++; cnt.set(d.name, c); } });
                const badges = [...cnt].map(([nm, c]) => `<span class="zk-bd" style="--c:${cssRgb(c.col)}" title="${esc(nm)}: ${c.n} Tag${c.n === 1 ? '' : 'e'}"><i></i>${c.n}</span>`).join('');
                const isPast = m.days.length && m.days[m.days.length - 1].past;
                return `<div class="zk-m${cur ? ' cur' : ''}${isPast ? ' gone' : ''}">
                    <div class="zk-mh"><b>${m.name}</b><span>${badges}</span></div>
                    <div class="zk-wd">${['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(w => `<span>${w}</span>`).join('')}</div>
                    <div class="zk-g">${'<span class="zk-d blank"></span>'.repeat(first)}${m.days.map(d => cell(d)).join('')}</div>
                  </div>`;
            }).join('')}</div>`;
        } else if (view === 'strip') {
            let h = '<span></span>';
            for (let i = 1; i <= 31; i++) h += `<span class="hd num">${i}</span>`;
            body = `<div class="zk-stripw"><div class="zk-strip">${h}${k.months.map(m => {
                let r = `<span class="mn${m.days.some(d => d.today) ? ' cur' : ''}">${m.name}</span>`;
                for (let i = 1; i <= 31; i++) { const d = m.days.find(x => x.d === i); r += d ? cell(d, true) : '<span class="zk-d none"></span>'; }
                return r;
            }).join('')}</div></div>`;
        }

        // Legende
        const legAbs = k.legend.map((l, i) => ({ l, i })).filter(x => x.l.kind === 'abs');
        const hasF = all.some(d => d.letter === 'F') && !legAbs.some(x => x.l.letter === 'F');
        const legend = `<div class="zk-leg">
            ${legAbs.map(({ l, i }) => {
                const off = l.cb && !l.cb.checked;
                const sw = l.color ? `<span class="zk-sw" style="--c:${cssRgb(l.color)};--ink:${inkOf(l.color)}">${esc(l.letter)}</span>` : `<span class="zk-sw work">${esc(l.letter)}</span>`;
                return `<${l.cb ? 'button type="button"' : 'span'} class="zk-li${off ? ' off' : ''}"${l.cb ? ` data-cb="${i}" title="${off ? 'Im Kalender einblenden' : 'Im Kalender ausblenden'}"` : ''}>${sw}<span>${esc(l.name)}</span><em class="num">${esc(l.tage || '0')} T${l.std ? ' · ' + esc(l.std) + ' h' : ''}</em>${l.cb ? ico(off ? 'x' : 'eye', 13) : ''}</${l.cb ? 'button' : 'span'}>`;
            }).join('')}
            ${hasF ? `<span class="zk-li"><span class="zk-sw" style="--c:rgb(255,192,0);--ink:#17130e">F</span><span>Feiertag</span></span>` : ''}
            ${all.some(d => d.br) ? `<span class="zk-li ghost" title="Aus der Zeitdatenliste übernommen – Monate, die du dort geöffnet hast"><span class="zk-sw brs"></span><span>Bereitschaft (${all.filter(d => d.br).length})</span></span>` : ''}
            <span class="zk-li ghost"><span class="zk-sw we"></span><span>Wochenende</span></span>
            <span class="zk-li ghost"><span class="zk-sw hol"></span><span>Feiertag (kommend)</span></span>
            <span class="zk-li ghost"><span class="zk-sw pend"></span><span>beantragt</span></span>
            <span class="zk-li ghost"><span class="zk-sw today"></span><span>Heute</span></span>
          </div>`;

        const yNav = !(SH && S.shell) ? `<div class="zk-yn"><button type="button" data-ky="-" title="Vorjahr">${ico('left', 15)}</button><b class="num">${k.y}</b><button type="button" data-ky="+" title="Folgejahr">${ico('right', 15)}</button></div>` : '';
        const head = `<div class="zk-head">
            <div class="zl-title">${ico('calendar', 17)}<span>Jahresübersicht ${k.y}</span></div>${yNav}
            <span class="sp"></span>
            <div class="zp-segc">${[['months', 'Monate'], ['strip', 'Leiste'], ['orig', 'Original']].map(([v, l]) => `<button type="button" data-kv="${v}" class="${view === v ? 'on' : ''}">${l}</button>`).join('')}</div>
          </div>`;
        const sig = view + '|' + bridges.length + '|' + S.brCollapsed + '|' + all.filter(d => d.br).length + '|' + k.ru + '|' + k.legend.map(l => l.tage + (l.cb && l.cb.checked)).join(',') + '|' + (SH && S.shell) + '|' + all.length + '|' + t0.getTime();
        if (sig === kalLastSig && box.innerHTML) return;
        kalLastSig = sig;
        box.classList.toggle('orig', view === 'orig');
        const fmtR = b => fmtD(b.from) + (b.from !== b.to ? ' – ' + fmtD(b.to) : '');
        const brHtml = `<div class="zk-card${S.brCollapsed ? ' slim' : ''}"><div class="zk-head zk-tog" data-brt="1" title="Ein-/ausklappen"><div class="zl-title">${ico('sparkle', 17)}<span>Brückentage ${k.y}</span></div><span class="zk-sub">${S.brCollapsed ? (bridges.length ? bridges.length + ' Tipp' + (bridges.length > 1 ? 's' : '') + ' · bester: ' + (bridges[0].planned.length ? '+' : '') + bridges[0].cost + ' → ' + bridges[0].len + ' Tage frei' : 'keine mehr') : 'mit wenig Urlaub möglichst lange frei'}</span><span class="sp"></span><span class="zk-chev${S.brCollapsed ? '' : ' open'}">${ico('chevron', 16)}</span></div>
            ${S.brCollapsed ? '' : bridges.length ? `<div class="zk-brs">${bridges.slice(0, 8).map(b => `<button type="button" class="zk-br" data-k="${b.work[0].key}" title="Urlaub an: ${esc(b.work.map(fmtD).join(', '))}\nKlicken: ersten Tag eintragen">
                ${b.planned.length ? `<b class="num">+${b.cost} <em>Urlaubstag${b.cost > 1 ? 'e' : ''}</em> → ${b.len} <em>Tage frei</em></b>
                <span>${esc(fmtR(b))}</span>
                <small class="pl">${ico('check', 12)} ${b.planned.length} schon eingetragen${b.planned.some(d => d.pend) ? ' (' + b.planned.filter(d => d.pend).length + ' beantragt)' : ''}: ${esc(b.planned.map(fmtD).join(', '))}</small>
                <small>Dazu nehmen: ${esc(b.work.map(fmtD).join(', '))} · <b class="tot">insgesamt ${b.tot} Tage Urlaub → ${b.len} frei</b></small>`
                : `<b class="num">${b.cost} <em>Urlaubstag${b.cost > 1 ? 'e' : ''}</em> → ${b.len} <em>Tage frei</em></b>
                <span>${esc(fmtR(b))}</span><small>Urlaub: ${esc(b.work.map(fmtD).join(', '))}</small>`}</button>`).join('')}</div>`
                : `<div class="zk-none">${ico('check', 14)} Für den Rest von ${k.y} gibt es keine Brückentage mehr${k.y === new Date().getFullYear() ? ' – im nächsten Jahr schauen (Pfeil oben).' : '.'}</div>`}
          </div>`;
        box.innerHTML = view === 'orig'
            ? `<div class="zk-card slim">${head}</div>`
            : `<div class="zk-card">${head}${stats}</div>${brHtml}
               <div class="zk-card">${body}
                 <div class="zk-foot">${legend}<div class="zk-hint">${ico('pointer', 14)}<span>Auf einen <b>freien Tag</b> klicken, um Urlaub oder eine andere Abwesenheit einzutragen.</span></div></div>
               </div>`;
    }


    /* ════════════════════ JAHRES-PDF: alle 12 Monate der Zeitdatenliste ════════════════════ */
    const PDF_FN = /^javascript:\s*([A-Za-z_$][\w$]*)\s*\((.*)\)\s*;?\s*$/;
    const parseArgs = a => { try { return JSON.parse('[' + a.replace(/'/g, '"') + ']'); } catch (e) { return null; } };
    const savePdf = (blob, name) => { const u = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = u; a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(u); a.remove(); }, 4000); };
    let yearRun = null;
    function openYearPdf() {
        const root = overlay();
        let dlg = root.getElementById('zp-ypdf');
        if (dlg) dlg.remove();
        const cy = new Date().getFullYear(), cm = new Date().getMonth() + 1;
        const fmts = shell.pdf.length ? shell.pdf.map(x => x.label) : ['Standardformat'];
        let year = (shell.per && shell.per.y) || cy;
        dlg = el('div', 'zp-font'); dlg.id = 'zp-ypdf';
        root.appendChild(dlg);
        const draw = () => {
            const maxM = year < cy ? 12 : year === cy ? cm : 0;
            dlg.innerHTML = `<div class="zy-box">
                <div class="zy-h"><b>${ico('pdf', 17)} Zeitdatenliste – ganzes Jahr</b><button type="button" class="zp-icon" data-y="x" title="Schließen">${ico('x', 15)}</button></div>
                <div class="zy-yr"><button type="button" class="zp-icon" data-y="-">${ico('left', 16)}</button><b class="num">${year}</b><button type="button" class="zp-icon" data-y="+"${year >= cy ? ' disabled' : ''}>${ico('right', 16)}</button></div>
                <label class="zy-l">Format</label>
                <div class="zp-segc zy-f">${fmts.map((f, i) => `<button type="button" data-f="${i}" class="${(S.ypdfFmt || 0) === i ? 'on' : ''}">${esc(f.replace(/format$/i, '').trim() || f)}</button>`).join('')}</div>
                <div class="zy-ms">${MONTHS.map((n, i) => `<span class="zy-m${i + 1 > maxM ? ' off' : ''}" data-m="${i + 1}"><i></i>${n.slice(0, 3)}</span>`).join('')}</div>
                <p class="zy-t" id="zy-t">${maxM ? `${maxM} PDF${maxM > 1 ? 's' : ''} (${maxM === 12 ? 'Jänner–Dezember' : 'Jänner–' + MONTHS[maxM - 1]}) werden nacheinander heruntergeladen. Chrome fragt evtl. einmal, ob mehrere Downloads erlaubt sind – „Zulassen“.` : 'Für dieses Jahr gibt es noch keine Monate.'}</p>
                <div class="zy-b"><button type="button" class="zp-btn" data-y="x">Abbrechen</button><button type="button" class="zp-btn pri" data-y="go"${maxM ? '' : ' disabled'}>${ico('pdf', 15)} ${maxM} PDFs herunterladen</button></div>
              </div>`;
        };
        draw();
        dlg.addEventListener('click', async e => {
            if (e.target === dlg && !yearRun) { dlg.remove(); return; }
            const f = e.target.closest('[data-f]'); if (f && !yearRun) { S.ypdfFmt = +f.dataset.f; saveS(); draw(); return; }
            const b = e.target.closest('[data-y]'); if (!b) return;
            const a = b.dataset.y;
            if (a === 'x') { if (yearRun) yearRun.stop = true; dlg.remove(); return; }
            if (yearRun) return;
            if (a === '-') { year--; draw(); }
            if (a === '+' && year < cy) { year++; draw(); }
            if (a === 'go') { const maxM = year < cy ? 12 : cm; await runYearPdf(year, maxM, S.ypdfFmt || 0, dlg); }
        });
    }
    function monthUrl(per) {
        try {
            const src = (shell.per && (shell.per.back || shell.per.fwd)) ? (shell.per.back || shell.per.fwd).getAttribute('href') : '/Self/zeiterfassung/zdliste?modulId=0';
            const u = new URL(src, location.href); u.searchParams.set('periode', per); return u.pathname + u.search;
        } catch (e) { return '/Self/zeiterfassung/zdliste?modulId=0&periode=' + encodeURIComponent(per); }
    }
    function oneMonthPdf(per, fmt) {
        return new Promise(resolve => {
            const fr = document.createElement('iframe');
            fr.name = 'zp-pdf-' + Date.now();
            fr.style.cssText = 'position:fixed;left:-4000px;top:0;width:1200px;height:900px;opacity:0;pointer-events:none';
            let phase = 0, done = false, timer = null;
            const finish = (ok, msg) => { if (done) return; done = true; clearTimeout(timer); setTimeout(() => fr.remove(), 1500); resolve({ ok, msg }); };
            const grab = async url => {
                try {
                    const r = await fetch(url, { credentials: 'include' });
                    const bl = await r.blob();
                    if (!r.ok || !/pdf|octet/i.test(bl.type || r.headers.get('content-type') || '')) return finish(false, 'kein PDF erhalten');
                    savePdf(bl, 'Zeitdatenliste_' + per.replace('.', '-') + '.pdf'); finish(true);
                } catch (e) { finish(false, 'Download fehlgeschlagen'); }
            };
            fr.addEventListener('load', () => {
                let w, doc;
                try { w = fr.contentWindow; doc = fr.contentDocument; } catch (e) { return finish(false, 'kein Zugriff'); }
                if (phase === 0) {
                    phase = 1;
                    const links = [...doc.querySelectorAll('#pdflst a')];
                    const a = links[fmt] || links[0];
                    if (!a) return finish(false, 'kein PDF-Menü im Monat');
                    const href = a.getAttribute('href') || '';
                    try { w.open = url => { if (url) grab(new URL(url, w.location.href).href); return null; }; } catch (e) { }
                    try {          // LHR speichert selbst (Link mit download / blob:) → sofort weiter
                        const oc = w.HTMLAnchorElement.prototype.click;
                        w.HTMLAnchorElement.prototype.click = function () { const r = oc.apply(this, arguments); if (this.download || /^blob:|^data:/.test(this.href || '')) setTimeout(() => finish(true, 'per LHR gespeichert'), 1200); return r; };
                    } catch (e) { }
                    const m = href.match(PDF_FN);
                    try {
                        if (m && typeof w[m[1]] === 'function') { const args = parseArgs(m[2]); w[m[1]].apply(w, args || []); }
                        else if (/^javascript:/i.test(href)) w.eval(href.replace(/^javascript:/i, ''));
                        else if (href) return grab(new URL(href, w.location.href).href);
                    } catch (e) { return finish(false, 'LHR-Fehler: ' + e.message); }
                    timer = setTimeout(() => finish(true, 'per LHR gespeichert'), 9000);      // LHR lädt selbst herunter (AJAX)
                } else {
                    // Rahmen hat zur PDF-Adresse gewechselt → abholen und speichern
                    let url = ''; try { url = w.location.href; } catch (e) { }
                    const ct = (doc && doc.contentType) || '';
                    if (url && /pdf/i.test(ct)) grab(url);
                    else if (url && !/zdliste/i.test(url)) grab(url);
                }
            });
            fr.src = monthUrl(per);
            document.body.appendChild(fr);
            setTimeout(() => finish(false, 'Zeitüberschreitung'), 45000);
        });
    }
    async function runYearPdf(year, maxM, fmt, dlg) {
        yearRun = { stop: false };
        const t = dlg.querySelector('#zy-t'), go = dlg.querySelector('[data-y="go"]');
        if (go) go.disabled = true;
        let ok = 0;
        for (let m = 1; m <= maxM; m++) {
            if (yearRun.stop) break;
            const per = pad(m) + '.' + year;
            const chip = dlg.querySelector(`.zy-m[data-m="${m}"]`); if (chip) chip.className = 'zy-m run';
            if (t) t.textContent = `${MONTHS[m - 1]} ${year} wird erstellt … (${m}/${maxM})`;
            const r = await oneMonthPdf(per, fmt);
            if (chip) { chip.className = 'zy-m ' + (r.ok ? 'ok' : 'bad'); chip.title = r.msg || 'fertig'; }
            if (r.ok) ok++;
            await sleep(800);
        }
        if (t) t.textContent = yearRun.stop ? 'Abgebrochen.' : `Fertig: ${ok} von ${maxM} PDFs. Sie liegen in deinem Download-Ordner.`;
        if (go) { go.disabled = false; go.innerHTML = ico('check', 15) + ' Nochmal'; }
        yearRun = null;
    }
    /* ════════════════════ MONATSLISTE ════════════════════ */
    const listState = { open: new Set(), future: null };
    let listDays = new Map();
    const mod = t => { const d = new Date(t); return d.getHours() * 60 + d.getMinutes(); };
    const isoWeek = dt => { const d = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate())); const n = d.getUTCDay() || 7; d.setUTCDate(d.getUTCDate() + 4 - n); const y = new Date(Date.UTC(d.getUTCFullYear(), 0, 1)); return Math.ceil(((d - y) / 864e5 + 1) / 7); };
    function lunchOf(segs) {
        const wF = mod(at(S.lunchFrom)), wT = mod(at(S.lunchTo));
        let best = null;
        for (let i = 1; i < segs.length; i++) {
            const a = segs[i - 1].e, b = segs[i].s;
            if (a == null || b <= a) continue;
            const mid = (mod(a) + mod(b)) / 2, len = b - a;
            if (mid >= wF && mid <= wT && len >= S.lunchMinLen * M && (!best || len > best.len)) best = { s: a, e: b, len, i };
        }
        return best;
    }
    function buildList(host) {
        L = mkRoot(host);
        const box = el('div', 'zp-font');
        box.id = 'zl';
        box.innerHTML = `<div class="zl-head">
            <div class="zl-title">${ico('rows', 17)}<span>Monatsübersicht</span><span id="zl-month" style="display:none"></span></div>
            <span id="zl-sum" style="display:contents"></span><span class="sp"></span>
            <div class="zl-cw"><button type="button" class="zp-btn sm" data-act="cols" title="Spalten ein-/ausblenden">${ico('sliders', 14)} Spalten</button><div class="zl-colpop" id="zl-colpop"></div></div>
            <div class="zp-segc" id="zl-view"><button type="button" data-v="list">${'Zeit+ Liste'}</button><button type="button" data-v="orig">Original-Tabelle</button></div>
          </div>
          <div class="zl-body">
            <div class="zl-cols" id="zl-cols"><span>Tag</span><span>Buchungen</span><span class="tlh">Verlauf</span><span class="r isth">Ist</span><span class="r">+/− Tag</span><span class="r">Saldo</span><span></span></div>
            <div id="zl-rows"></div>
          </div>`;
        L.appendChild(box);
        box.querySelectorAll('#zl-view button').forEach(b => b.addEventListener('click', () => {
            S.tableView = b.dataset.v; saveS(); applyTheme(); render();
            try { window.dispatchEvent(new Event('resize')); } catch (e) { }
        }));
        // Spalten per Drag & Drop umsortieren
        let dragCol = null;
        const hdr = box.querySelector('#zl-cols');
        const clearMarks = () => hdr.querySelectorAll('.drop-l,.drop-r,.dragging').forEach(x => x.classList.remove('drop-l', 'drop-r', 'dragging'));
        hdr.addEventListener('dragstart', e => { const h = e.target.closest('[data-col]'); if (!h) return; dragCol = h.dataset.col; h.classList.add('dragging'); try { e.dataTransfer.setData('text/plain', dragCol); e.dataTransfer.effectAllowed = 'move'; } catch (er) { } });
        hdr.addEventListener('dragover', e => {
            const h = e.target.closest('[data-col]'); if (!h || !dragCol) return;
            e.preventDefault(); hdr.querySelectorAll('.drop-l,.drop-r').forEach(x => x.classList.remove('drop-l', 'drop-r'));
            if (h.dataset.col === dragCol) return;
            const r = h.getBoundingClientRect(); h.classList.add(e.clientX < r.left + r.width / 2 ? 'drop-l' : 'drop-r');
        });
        hdr.addEventListener('dragleave', e => { const h = e.target.closest('[data-col]'); if (h) h.classList.remove('drop-l', 'drop-r'); });
        hdr.addEventListener('drop', e => {
            e.preventDefault();
            const h = e.target.closest('[data-col]'); const from = dragCol; clearMarks(); dragCol = null;
            if (!h || !from || h.dataset.col === from) return;
            const r = h.getBoundingClientRect(), after = e.clientX >= r.left + r.width / 2;
            const order = (listState.cols || []).filter(k => k !== from);
            let at = order.indexOf(h.dataset.col); if (at < 0) return; if (after) at++;
            order.splice(at, 0, from);
            const prev = Array.isArray(S.colOrder) ? S.colOrder.filter(k => !order.includes(k)) : [];
            S.colOrder = order.concat(prev); saveS(); render();
        });
        hdr.addEventListener('dragend', () => { clearMarks(); dragCol = null; });
        hdr.addEventListener('dblclick', e => { if (e.target.closest('[data-col]') && Array.isArray(S.colOrder) && S.colOrder.length) { S.colOrder = []; saveS(); render(); toast('Spalten', 'Reihenfolge zurückgesetzt (wie in LHR).', { icon: 'check' }); } });
        box.addEventListener('change', e => {
            const t = e.target.closest('[data-colt]'); if (!t) return;
            const k = t.dataset.colt; let h = Array.isArray(S.colHidden) ? S.colHidden.slice() : [];
            if (t.checked) h = h.filter(x => x !== k); else if (!h.includes(k)) h.push(k);
            S.colHidden = h; saveS(); render(); safe('Spalten', syncDtPopup);
        });
        document.addEventListener('click', e => { if (listState.colPop && !inPath(e, box.querySelector('.zl-cw'))) { listState.colPop = false; render(); } });
        box.addEventListener('click', e => {
            if (e.target.closest('.zl-colpop')) {
                const a = e.target.closest('[data-act]');
                if (a && a.dataset.act === 'colsall') { S.colHidden = []; saveS(); render(); safe('Spalten', syncDtPopup); }
                if (a && a.dataset.act === 'colsreset') { S.colOrder = []; saveS(); render(); }
                e.stopPropagation(); return;
            }
            const cb0 = e.target.closest('[data-act="cols"]');
            if (cb0) { e.stopPropagation(); listState.colPop = !listState.colPop; render(); return; }
            const chip = e.target.closest('[data-href]');
            if (chip) { e.stopPropagation(); location.href = chip.dataset.href; return; }
            const act = e.target.closest('[data-act]');
            if (act) {
                e.stopPropagation();
                const day = listDays.get(act.dataset.k);
                if (act.dataset.act === 'mfe' && day) { const d0 = day.first.querySelector('.td_datum_item.popup-link'); if (d0) d0.click(); else toast('Nicht verfügbar', 'Für diesen Tag gibt es keine Mehrfacherfassung.'); }
                if (act.dataset.act === 'pay') { const img = document.getElementById('img_euro'); if (img) { const a = img.closest('a'); origClick(a || img); } return; }
                if (act.dataset.act === 'future') { const cur = listState.futureEff; listState.future = !cur; S.futureDays = cur ? 'hide' : 'show'; saveS(); render(); }
                return;
            }
            if (e.target.closest('.zl-det')) return;
            const row = e.target.closest('.zl-row');
            if (!row || !row.dataset.k) return;
            const k = row.dataset.k;
            if (listState.open.has(k)) listState.open.delete(k); else listState.open.add(k);
            render();
        });
    }

    /* Zusatzspalten aus der LHR-Tabelle (FZS, ZA, 50%, 100%, IstW …): alles, was LHR gerade anzeigt und Werte hat */
    const BASE_COLS = /^(Datum|ZM|Soll|Pause|Zeitdaten|Notiz|Ist|\+\/-TG|Saldo)\b/i;
    function extraCols(days) {
        const tb = tbody(), table = tb && tb.closest('table');
        const thead = table && table.querySelector('thead');
        if (!thead || !tb) return [];
        const hr = thead.querySelector('tr');
        if (!hr) return [];
        const hcells = [...hr.children];
        const sample = [...tb.querySelectorAll('tr[data-periode]')].filter(r => r.children.length === hcells.length).slice(0, 6);
        const isShown = e => {                                 // so, wie LHR es anzeigt (unser eigenes Leer-Ausblenden ignorieren)
            const had = e.classList.contains('zp-colhide');
            if (had) e.classList.remove('zp-colhide');
            const cs = getComputedStyle(e);
            const ok = cs.display !== 'none' && cs.visibility !== 'collapse' && !e.hidden && e.getBoundingClientRect().width > 1;
            if (had) e.classList.add('zp-colhide');
            return ok;
        };
        const out = [];
        hcells.forEach((th, idx) => {
            const label = th.getAttribute('data-ueberschrift');
            if (!label || BASE_COLS.test(label)) return;
            let nr = null;
            for (const r of sample) { const td = r.children[idx]; if (td && td.getAttribute('data-zsp-nr')) { nr = td.getAttribute('data-zsp-nr'); break; } }
            if (!nr || !isShown(th)) return;
            out.push({ key: 'z' + nr, nr, short: th.textContent.replace(/\s+/g, ' ').trim() || label, title: th.getAttribute('data-tippy-content') || label });
        });
        return out;
    }
    /* LHR-Spaltenmenü (.dt_popup) ↔ Zeit+ Liste: Häkchen = in der Liste sichtbar */
    function colKeyMap() {
        const tb = tbody(), table = tb && tb.closest('table'), hr = table && table.querySelector('thead tr');
        const map = new Map();
        if (!hr) return map;
        const hcells = [...hr.children];
        const sample = [...tb.querySelectorAll('tr[data-periode]')].filter(r => r.children.length === hcells.length).slice(0, 6);
        hcells.forEach((th, idx) => {
            const label = normT(th.getAttribute('data-ueberschrift'));
            if (!label) return;
            if (/^Ist\b/i.test(label)) { map.set(label, 'ist'); return; }
            if (/^\+\/-TG\b/i.test(label)) { map.set(label, 'tg'); return; }
            if (/^Saldo\b/i.test(label)) { map.set(label, 'sal'); return; }
            if (BASE_COLS.test(label)) { map.set(label, null); return; }       // feste Spalten der Liste
            for (const r of sample) { const td = r.children[idx]; const nr = td && td.getAttribute('data-zsp-nr'); if (nr) { map.set(label, 'z' + nr); break; } }
        });
        return map;
    }
    const normT = t => String(t || '').replace(/\s+/g, ' ').trim();
    /* Gesamtstunden = Saldo + FZSA + FZSP + ZA + Überstunden 50 % ×1,5 + 100 % ×2 (so viel ZA ergeben sie) */
    const GES_COLS = [[/^FZSA\b/i, 'Fahrzeit aktiv', 1], [/^FZSP\b/i, 'Fahrzeit passiv', 1], [/^ZA\b/i, 'ZA', 1], [/^50%p/i, 'Üst 50% pfl.', 1.5], [/^50%f/i, 'Üst 50% frei', 1.5], [/^100%p/i, 'Üst 100% pfl.', 2], [/^100%f/i, 'Üst 100% frei', 2]];
    const parseHrs = t => { t = String(t || '').trim(); if (!t || t === '-' || t === '–') return null; const d = parseDur(t); if (d != null) return d; const m = t.match(/^(-?)(\d+)(?:[.,](\d+))?$/); if (!m) return null; const v = (+m[2] + (m[3] ? +('0.' + m[3]) : 0)) * H; return m[1] ? -v : v; };
    function gesamt(days, saldo) {
        if (saldo == null || !days) return null;
        const km = colKeyMap();
        const t0 = new Date(); t0.setHours(23, 59, 59, 0);
        const parts = [{ name: 'Saldo', v: saldo }];
        let found = 0;
        for (const [label, key] of km) {
            if (!key || key[0] !== 'z') continue;
            const g = GES_COLS.find(([re]) => re.test(label)); if (!g) continue;
            found++;
            const nr = key.slice(1), vals = [];
            let span = 0;
            for (const [k, rows] of days) {
                if (keyDate(k) > t0) break;
                let v = null; rows.forEach(r => { const c = r.querySelector('td[data-zsp-nr="' + nr + '"]'); const x = c && parseHrs(c.textContent); if (x != null) v = x; });
                if (vals.length || v != null) span++;
                if (v != null) vals.push(v);
            }
            // Konto (steht wie der Saldo an fast jedem Tag) → letzter Stand; sonst einzelne Tageswerte → Summe
            const running = vals.length >= 3 && vals.length / span >= .8;
            const v = !vals.length ? 0 : running ? vals[vals.length - 1] : vals.reduce((a, b) => a + b, 0);
            parts.push({ name: g[1], v: v * g[2], raw: v, f: g[2] });
        }
        if (!found) return null;
        return { total: parts.reduce((a, p) => a + p.v, 0), parts, tip: parts.map(p => p.name + ' ' + (p.f && p.f !== 1 && p.raw ? dur(p.raw, true) + ' ×' + String(p.f).replace('.', ',') + ' = ' + dur(p.v, true) : dur(p.v, true))).join(' + ') };
    }
    function syncDtPopup() {
        if (PAGE !== 'zdl') return;
        const pops = document.querySelectorAll('.dt_popup');
        if (!pops.length) return;
        const km = colKeyMap(), hid = Array.isArray(S.colHidden) ? S.colHidden : [];
        pops.forEach(pop => {
            const th0 = pop.querySelector('thead th'); if (th0 && th0.textContent.trim() !== 'Anzeigen') { th0.dataset.zpOrig = th0.textContent; th0.textContent = 'Anzeigen'; }
            pop.querySelectorAll('tbody tr').forEach(tr => {
                const cb = tr.querySelector('input[type="checkbox"]'); if (!cb) return;
                const name = normT((tr.children[1] || tr).textContent);
                if (!name) { tr.style.display = 'none'; return; }
                const key = km.has(name) ? km.get(name) : undefined;
                if (key) { cb.dataset.zpKey = key; cb.disabled = false; cb.checked = !hid.includes(key); tr.title = 'In der Zeit+ Liste anzeigen'; }
                else { cb.removeAttribute('data-zp-key'); cb.checked = true; cb.disabled = true; tr.title = 'Fester Bestandteil der Zeit+ Liste'; tr.classList.add('zp-fixedrow'); }
            });
        });
    }
    function dtPopupGuard() {          // LHR-Fixieren abfangen, stattdessen Zeit+ Sichtbarkeit setzen
        const handle = e => {
            const cb = e.target && e.target.closest && e.target.closest('.dt_popup input[type="checkbox"]');
            if (!cb) return;
            e.stopImmediatePropagation(); e.stopPropagation();
            if (e.type !== 'click' || !cb.dataset.zpKey) return;
            const k = cb.dataset.zpKey; let h = Array.isArray(S.colHidden) ? S.colHidden.slice() : [];
            if (cb.checked) h = h.filter(x => x !== k); else if (!h.includes(k)) h.push(k);
            S.colHidden = h; saveS(); safe('Liste', render);
        };
        ['click', 'change', 'input', 'mousedown', 'mouseup'].forEach(t => document.addEventListener(t, handle, true));
        const td = e => {                // Klick auf den Namen schaltet auch
            if (e.target.closest && e.target.closest('.dt_popup tbody td') && !e.target.closest('input')) {
                const cb = e.target.closest('tr').querySelector('input[data-zp-key]');
                e.stopImmediatePropagation(); e.stopPropagation();
                if (cb && !cb.disabled) cb.click();
            }
        };
        document.addEventListener('click', td, true);
    }
    function watchCols() {                                     // Spalten an-/abhaken → Liste sofort neu
        const tb = tbody(), table = tb && tb.closest('table');
        if (!table) return;
        let t = null, last = '';
        const sig = () => { try { return extraCols(groupDays()).map(x => x.nr).join(','); } catch (e) { return ''; } };   // auch Reihenfolge (LHR Drag & Drop)
        last = sig();
        const check = () => { t = null; const n = sig(); if (n !== last) { last = n; safe('Liste', render); } };
        new MutationObserver(() => { if (!t) t = setTimeout(check, 250); })
            .observe(table, { subtree: true, childList: true, attributes: true, attributeFilter: ['style', 'class', 'hidden'] });
        new MutationObserver(ms => { if (!t && ms.some(m => m.target.tagName === 'TH' || (m.target.querySelector && m.target.querySelector('th')))) t = setTimeout(check, 250); })
            .observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
        document.addEventListener('change', e => { if (e.target && e.target.type === 'checkbox') [120, 500, 1500].forEach(ms => setTimeout(check, ms)); }, true);
    }
    const cellTxt = (rows, nr) => { let v = ''; rows.forEach(r => { const c = r.querySelector('td[data-zsp-nr="' + nr + '"]'); const t = c ? c.textContent.replace(/\s+/g, ' ').trim() : ''; if (t) v = t; }); return v; };
    function renderList(d, c) {
        const rowsBox = $('zl-rows');
        if (!rowsBox) return;
        const now = Date.now(), t0 = new Date(); t0.setHours(0, 0, 0, 0);
        const tk = todayKey();
        const WD = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
        const MON = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
        listDays = new Map();
        const days = [];
        for (const [k, rows] of d.days) {
            const dt = keyDate(k), isT = k === tk, past = dt < t0;
            const segs = [], infos = [];
            let fehl = false, note = '', pause = null, editHref = null;
            rows.forEach(r => {
                if (r.querySelector('img.fehlbuch')) fehl = true;
                const nt = r.querySelector('td.td_notiz');
                if (nt && nt.textContent.trim()) note = nt.textContent.replace(/\s+/g, ' ').trim();
                const pc = r.querySelectorAll('td.td_soll_pause_uz')[1];
                const pv = pc && parseDur(pc.textContent); if (pv != null) pause = (pause || 0) + pv;
                const zd = r.querySelector('td.td_zeitdaten');
                if (!zd) return;
                const a = zd.querySelector('.td_text1_isDate'), b = zd.querySelector('.td_text2_isDate');
                if (a) {
                    const s0 = parseClock(a.textContent);
                    if (s0 == null) return;
                    const la = a.querySelector('a'), lb = b && b.querySelector('a');
                    segs.push({ s: s0, e: b ? parseClock(b.textContent) : null, ta: a.textContent.replace(/\s+/g, '').trim(), tb: b ? b.textContent.replace(/\s+/g, '').trim() : '',
                        ha: la ? la.getAttribute('href') : null, hb: lb ? lb.getAttribute('href') : null });
                } else {
                    const za = zd.querySelector('a[href]'); if (za && !editHref) editHref = za.getAttribute('href');
                    const t = zd.textContent.replace(/[_?]/g, '').replace(/\s+/g, ' ').trim().replace(/\s*\d{1,2}:\d{2}\s*$/, '');
                    if (t && !/^\d{1,2}:\d{2}$/.test(t) && !/Periodenschluss|Abrechnung|Übertrag|Vorträge|keine positiven/i.test(t)) infos.push(t);
                }
            });
            const dow = dt.getDay();
            const day = {
                k, dt, isT, past, future: !past && !isT, we: dow === 0 || dow === 6, segs, info: infos[0] || '', fehl: fehl && past, note, pause, editHref,
                soll: sollOf(rows), edge: rows[0].style.getPropertyValue('--zp-edge') || '', first: rows[0], br: isBR(rows), pabs: partAbs(rows), rem: rows.some(r => /remote|homeoffice/i.test(((r.querySelector('td.td_zeitdaten') || {}).textContent || ''))),
                ist: isT ? c.eff : lastVal(rows, 2), tg: isT ? c.tg : lastVal(rows, 73), sal: isT ? c.saldo : lastVal(rows, 3)
            };
            listDays.set(k, day);
            days.push(day);
        }
        if (!days.length) { rowsBox.innerHTML = ''; return; }
        safe('Bereitschaft', () => rememberBR(d.days));

        // Kopf
        const m0 = days[days.length - 1].dt;
        setText('zl-month', MON[m0.getMonth()] + ' ' + m0.getFullYear());
        const done = days.filter(x => x.past || x.isT);
        const istSum = done.reduce((s, x) => s + (x.ist || 0), 0), sollSum = done.reduce((s, x) => s + x.soll, 0);
        const missing = days.filter(x => x.fehl).length;
        const sc = v => v > M ? 'ok' : v < -M ? 'bad' : '';
        setHtml('zl-sum', `<span class="zl-pill">Ist${days.some(x => x.isT) || days.some(x => x.future) ? ' bis heute' : ''} <b class="num">${dur(istSum)}</b> / ${dur(sollSum)}</span>
            ${c.saldo != null ? `<span class="zl-pill">Saldo <b class="num ${sc(c.saldo)}">${dur(c.saldo, true)}</b></span>` : ''}
            ${(() => { const gs = safe('Gesamt', () => gesamt(d.days, c.saldo)); return gs ? `<span class="zl-pill" title="${esc(gs.tip)}">Gesamt <b class="num ${sc(gs.total)}">${dur(gs.total, true)}</b></span>` : ''; })()}` +
            (() => {
                const brd = days.filter(x => x.br); if (!brd.length) return '';
                const nx = brd.find(x => x.isT || x.future);
                return `<span class="zl-pill br" title="Bereitschaftstage: ${esc(brd.map(x => WD[x.dt.getDay()] + ' ' + pad(x.dt.getDate()) + '.').join(', '))}">${ico('zap', 13)} ${brd.length} Bereitschaft${brd.length > 1 ? 'en' : ''}${nx ? ` · ${nx.isT ? '<b>heute</b>' : 'nächste <b>' + WD[nx.dt.getDay()] + ' ' + pad(nx.dt.getDate()) + '.' + pad(nx.dt.getMonth() + 1) + '.</b>'}` : ''}</span>`;
            })() +
            (missing ? `<span class="zl-pill w">${ico('alert', 13)} ${missing} Tag${missing > 1 ? 'e' : ''} unvollständig</span>` : ''));
        const vb = $('zl-view'); if (vb) vb.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.v === S.tableView));
        if (S.tableView !== 'list') { rowsBox.innerHTML = ''; return; }

        // Wertspalten: Ist, +/−, Saldo + alle in LHR angehakten Spalten (LHR-Reihenfolge), per Drag & Drop umsortierbar
        const XC = extraCols(d.days);
        let VC = [{ key: 'ist', short: 'Ist', title: 'Ist (Tagesstunden)', w: '62px', base: true }, { key: 'tg', short: '+/− Tag', title: '+/− Ist zu Soll', w: '66px', base: true }, { key: 'sal', short: 'Saldo', title: 'Saldo', w: '72px', base: true }]
            .concat(XC.map(x => Object.assign({ w: 'minmax(54px,max-content)' }, x)));
        const ord = Array.isArray(S.colOrder) ? S.colOrder : [];
        VC = VC.map((v, i) => ({ v, i, o: ord.indexOf(v.key) })).sort((a, b) => (a.o < 0 ? 1000 + a.i : a.o) - (b.o < 0 ? 1000 + b.i : b.o)).map(x => x.v);
        const hid = Array.isArray(S.colHidden) ? S.colHidden : [];
        const VCall = VC;
        VC = VCall.filter(v => !hid.includes(v.key));
        listState.cols = VCall.map(v => v.key);
        const cp = $('zl-colpop');
        if (cp) {
            cp.classList.toggle('open', !!listState.colPop);
            cp.innerHTML = listState.colPop ? `<h5>Spalten in der Liste</h5>
                ${VCall.map(v => `<label class="zl-ci"><input type="checkbox" data-colt="${v.key}"${hid.includes(v.key) ? '' : ' checked'}><span>${esc(v.short)}</span><em>${esc(v.title !== v.short ? v.title : '')}</em></label>`).join('')}
                <div class="zl-cf"><button type="button" class="zp-btn sm" data-act="colsall">Alle anzeigen</button><button type="button" class="zp-btn sm" data-act="colsreset" title="Reihenfolge wie in LHR">Reihenfolge zurücksetzen</button></div>
                <p>Tipp: Spalten-Überschrift in der Liste ziehen, um sie zu verschieben.</p>` : '';
        }
        const zlBox = $('zl');
        const nx = VC.filter(v => !v.base).length;
        const tlOff = S.tlMode === 'off', tlIn = !tlOff && (S.tlMode === 'inline' || (S.tlMode !== 'column' && nx > 2)), tlCol = !tlOff && !tlIn;   // viele Spalten → Verlauf als Balken unter den Buchungen
        if (zlBox) {
            zlBox.classList.toggle('tl-in', tlIn);
            zlBox.classList.toggle('many', nx > 4);
            const lh = document.getElementById('zp-list-host'); if (lh) lh.classList.toggle('xwide', nx > 4);
            zlBox.style.setProperty('--zl-grid', `92px minmax(${nx > 6 ? 220 : 260}px,1fr)${tlCol ? ' 190px' : ''} ${VC.map(v => v.base ? v.w : 'minmax(50px,max-content)').join(' ')} 20px`);
            zlBox.style.setProperty('--zl-gridm', `80px 1fr ${VC.filter(v => v.key !== 'ist').map(v => v.key === 'tg' ? '60px' : v.key === 'sal' ? '64px' : 'minmax(50px,max-content)').join(' ')} 18px`);
        }
        // Verlauf-Bereich: normal 06–19 Uhr, wird erweitert, wenn im Monat früher/später gestempelt wurde (z.B. Bereitschaft am Abend)
        let R0 = 360, R1 = 1140;
        days.forEach(x => x.segs.forEach(sg => { const a = mod(sg.s); let b = sg.e != null ? mod(sg.e) : a; if (b < a) b += 1440; R0 = Math.min(R0, Math.floor(a / 60) * 60); R1 = Math.max(R1, Math.min(1440, Math.ceil(b / 60) * 60)); }));
        const tlLab = 'Verlauf ' + pad(R0 / 60) + '–' + pad(R1 / 60) + ' Uhr';
        setHtml('zl-cols', `<span>Tag</span><span>${tlIn ? 'Buchungen · ' + tlLab : 'Buchungen'}</span>${tlCol ? '<span class="tlh" style="white-space:nowrap">' + tlLab + '</span>' : ''}${VC.map(v => `<span class="r zl-vh${v.key === 'ist' ? ' isth' : ''}" draggable="true" data-col="${v.key}" title="${esc(v.title)} – ziehen zum Verschieben">${esc(v.short)}</span>`).join('')}<span></span>`);

        // Kommende Tage: eingeblendet, wenn LHR bis Monatsende berechnet hat (Saldo/Ist schon da) – oder per Einstellung
        const futureDays = days.filter(x => x.future);
        const calc = futureDays.some(x => x.sal != null || x.tg != null);
        listState.futureEff = listState.future != null ? listState.future : S.futureDays === 'show' ? true : S.futureDays === 'hide' ? false : calc;
        // Zeilen
        const XM = m => Math.max(0, Math.min(100, (m - R0) / (R1 - R0) * 100)), X = t => XM(mod(t));
        const rowHtml = x => {
            const lunch = lunchOf(x.segs);
            const open = listState.open.has(x.k);
            const ll = lunch ? mins(lunch.len) : 0;
            let ded = x.pause != null ? mins(x.pause) : null;
            const dedTip = lunch ? `Mittag ${clock(lunch.s)}–${clock(lunch.e)} = ${ll} min` : 'keine Mittagspause gestempelt';
            const dedFull = ded ? `${dedTip}. LHR hat ${ded} min Pause abgezogen (Pause-Spalte, keine Arbeitszeit).` : dedTip + '. Kein Pausenabzug in LHR.';
            const cls = ['zl-row', x.br ? 'br' : '', x.rem ? 'rem' : '', x.isT ? 'today' : '', x.future ? 'future' : '', x.future && calc ? 'calc' : '', x.we && !x.segs.length && !x.br ? 'we' : '', x.edge && !x.isT ? 'edge' : '', open ? 'open' : ''].join(' ');
            let st;
            const live = x.isT && c.open;
            if (x.segs.length) {
                const strip = t => esc(String(t).replace(/^[^0-9]+/, ''));
                st = x.segs.map((sg, i) => {
                    const isLive = live && sg.e == null && i === x.segs.length - 1;
                    const part = (t, h, lbl) => h ? `<span class="zl-p" data-href="${esc(h)}" title="${lbl} ${t} bearbeiten">${t}</span>` : `<span class="zl-p off">${t}</span>`;
                    const endTxt = isLive ? '<b>läuft</b>' : sg.e != null ? strip(sg.tb) : '?';
                    const chip = `<span class="zl-b num${isLive ? ' live' : ''}">${part(strip(sg.ta), sg.ha, 'Kommen')}<em>–</em>${isLive || sg.e == null ? `<span class="zl-p${sg.hb ? '' : ' off'}"${sg.hb ? ` data-href="${esc(sg.hb)}"` : ''}>${endTxt}</span>` : part(endTxt, sg.hb, 'Gehen')}</span>`;
                    const lu = lunch && lunch.i === i + 1 ? `<span class="zl-lunch${ded ? '' : ' ok'}" title="${esc(dedFull)}">${ico('utensils', 12)}${ll}′${ded ? `<b>−${ded}′</b>` : ''}</span>` : '';
                    return chip + lu;
                }).join('');
            } else if (x.info) st = `<span class="zl-tag info">${esc(x.info)}</span>`;
            else if (x.fehl) st = `<span class="zl-tag warn">${ico('alert', 12)} fehlt</span>`;
            else if (x.we) st = `<span class="zl-tag">Wochenende</span>`;
            else if (x.future) st = '';
            else st = '';
            if (x.br) st = `<span class="zl-tag br" title="Bereitschaft (Arbeitsmodell ${esc(zmOf(d.days.get(x.k) || []))})${x.soll ? ' · Soll ' + dur(x.soll) + ' ab ' + S.brStart + ', ohne Pflichtpause' : ''}">${ico('zap', 12)} Bereitschaft${x.soll ? ' · ' + dur(x.soll) : ''}</span>` + st;
            if (x.rem && x.segs.length) st = `<span class="zl-tag rem" title="Remotearbeit">${ico('home', 12)} Remote</span>` + st;
            if (x.segs.length && !lunch && ded) st += `<span class="zl-lunch" title="${esc(dedFull)}">${ico('utensils', 12)}<b>−${ded}′</b></span>`;
            if (x.segs.length && x.fehl) st += ` <span class="zl-tag warn">${ico('alert', 12)}</span>`;
            let bar = '';
            if (lunch) bar += `<i class="lunch" style="left:${X(lunch.s)}%;width:${X(lunch.e) - X(lunch.s)}%"></i>`;
            x.segs.forEach((sg, i) => {
                const e = sg.e != null ? sg.e : (live && i === x.segs.length - 1 ? now : null);
                if (e == null) return;
                const sM = mod(sg.s); let eM = mod(e); if (eM < sM) eM += 1440;          // 24:00 / über Mitternacht
                bar += `<i class="${live && sg.e == null ? 'live' : ''}" style="left:${XM(sM)}%;width:${Math.max(.4, XM(eM) - XM(sM))}%"></i>`;
            });
            const n = (v, signed, extra) => v == null ? `<span class="zl-n mut num ${extra || ''}">–</span>` : `<span class="zl-n num ${extra || ''} ${signed ? sc(v) : ''}">${dur(v, signed)}</span>`;
            const showVals = !x.future || (calc && (x.sal != null || x.tg != null || x.ist != null));
            let det = '';
            if (open) {
                const parts = [];
                let gapSum = 0, gapN = 0;
                x.segs.forEach((sg, i) => {
                    if (i > 0 && x.segs[i - 1].e != null && !(lunch && lunch.i === i)) { const g = sg.s - x.segs[i - 1].e; if (g > 0) { gapSum += g; gapN++; } }
                    if (sg.hb && sg.e != null) parts.push(`<span class="zl-chip" data-href="${esc(sg.hb)}" title="Gehen-Buchung bearbeiten">${ico('pencil', 12)} Gehen ${esc(String(sg.tb).replace(/^[^0-9]+/, ''))}</span>`);
                });
                if (!x.segs.length && x.editHref) parts.push(`<span class="zl-chip" data-href="${esc(x.editHref)}">${ico('pencil', 12)} Tag bearbeiten</span>`);
                parts.push(`<span class="zl-chip act" data-act="mfe" data-k="${x.k}">${ico('plus', 12)} Mehrfacherfassung</span>`);
                const meta = [];
                if (x.soll) meta.push('Soll ' + dur(x.soll));
                if (lunch || ded) meta.push(`<span class="${ded ? 'w' : ''}">${ico('utensils', 12)} ${esc(dedFull)}</span>`);
                if (gapN && !x.br) meta.push(gapN + ' kurze Pausen · ' + mins(gapSum) + ' min');
                if (x.note) meta.push('Notiz: ' + esc(x.note));
                det = `<div class="zl-det">${parts.join('')}${meta.length ? `<span class="meta">${meta.join(' · ')}</span>` : ''}</div>`;
            }
            return `<div class="${cls}" data-k="${x.k}" style="${x.edge ? '--edge:' + x.edge : ''}">
                <div class="zl-date"><span>${WD[x.dt.getDay()]}</span><b class="num">${pad(x.dt.getDate())}.${pad(x.dt.getMonth() + 1)}.</b></div>
                <div class="zl-st">${st}${tlIn ? `<div class="zl-tl in">${bar}</div>` : ''}</div>
                ${tlCol ? `<div class="zl-tl">${bar}</div>` : ''}
                ${VC.map(vc => {
                    if (vc.key === 'ist') return showVals ? n(x.ist, false, 'ist') : `<span class="zl-n mut num ist">${x.soll ? dur(x.soll) : '–'}</span>`;
                    if (vc.key === 'tg') return showVals ? n(x.tg, true) : '<span class="zl-n mut">–</span>';
                    if (vc.key === 'sal') return showVals ? n(x.sal, true) : '<span class="zl-n mut">–</span>';
                    const v = cellTxt(d.days.get(x.k) || [], vc.nr);
                    return `<span class="zl-n num zl-x${/^-/.test(v) ? ' bad' : ''}" title="${esc(vc.title)}">${v ? esc(v) : '<span class="mut">–</span>'}</span>`;
                }).join('')}
                <span class="zl-chev">${ico('chevron', 15)}</span>${det}</div>`;
        };
        let html = '', curWk = null, sepDone = false;
        const showF = listState.futureEff;
        const visible = days.filter(x => !x.future || showF);
        const fBtn = () => { const fs = futureDays.reduce((s, y) => s + y.soll, 0), fw = futureDays.filter(y => y.soll).length;
            return `<button type="button" class="zl-more${showF ? ' sep' : ''}" data-act="future">${ico(showF ? 'up' : 'down', 15)} ${showF ? `Kommende Tage ausblenden${calc ? ' · bis Monatsende berechnet' : ''}` : `Kommende Tage anzeigen · ${fw} Arbeitstage · Soll ${dur(fs)}`}</button>`; };
        visible.forEach(x => {
            if (x.future && !sepDone && showF) { sepDone = true; html += fBtn(); }
            const wk = isoWeek(x.dt);
            if (wk !== curWk) {
                curWk = wk;
                const wd = days.filter(y => isoWeek(y.dt) === wk);
                const wi = wd.filter(y => !y.future).reduce((s, y) => s + (y.ist || 0), 0), ws = wd.reduce((s, y) => s + y.soll, 0);
                html += `<div class="zl-wk">KW ${wk} <b class="num">${dur(wi)} / ${dur(ws)}</b></div>`;
            }
            html += rowHtml(x);
        });
        if (futureDays.length && !showF) html += fBtn();
        // Monatsabschluss: Zeitausgleich / Periodenschluss / Abrechnung / Übertrag + Auszahlung + Monatssumme
        safe('Abschluss', () => {
            const CL = /^(Zeitausgleich|Periodenschluss|Abrechnung|Übertrag|Auszahlung|Vortr)/i;
            const closeRows = [];
            for (const [, rows] of d.days) rows.forEach(r => {
                const sp = r.querySelector('td.td_zeitdaten .td_text1_isnotDate') || r.querySelector('td.td_zeitdaten');
                const lab = sp ? sp.textContent.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim() : '';
                if (lab && CL.test(lab) && !/^Vortr/i.test(lab)) closeRows.push({ r, lab, img: r.querySelector('img') });
            });
            const nrOf = k => k === 'ist' ? '2' : k === 'tg' ? '73' : k === 'sal' ? '3' : k.slice(1);
            const val = (r, nr) => { const c = r.querySelector('td[data-zsp-nr="' + nr + '"]'); return c ? c.textContent.replace(/\s+/g, ' ').trim() : ''; };
            const cell = (v, extra) => `<span class="zl-n num ${extra || ''}${/^-/.test(v) ? ' bad' : ''}">${v ? esc(v) : '<span class="mut">–</span>'}</span>`;
            const tlCell = tlCol ? '<div></div>' : '';
            const doneD = days.filter(x => x.past || x.isT);
            const istS = doneD.reduce((a, x) => a + (x.ist || 0), 0), sollS = days.reduce((a, x) => a + x.soll, 0), sollD = doneD.reduce((a, x) => a + x.soll, 0);
            const tgS = doneD.reduce((a, x) => a + (x.tg || 0), 0);
            let out = `<div class="zl-wk cl">Monatsabschluss</div>`;
            out += `<div class="zl-row close sum"><div class="zl-cl"><b>Summe</b><span class="zl-tag">Soll ${dur(sollD)}${sollS !== sollD ? ' bis heute · ' + dur(sollS) + ' Monat' : ''}</span></div>${tlCell}${VC.map(vc =>
                vc.key === 'ist' ? `<span class="zl-n num ist"><b>${dur(istS)}</b></span>` : vc.key === 'tg' ? `<span class="zl-n num ${sc(tgS)}"><b>${dur(tgS, true)}</b></span>` : vc.key === 'sal' ? `<span class="zl-n num ${sc(c.saldo || 0)}"><b>${c.saldo != null ? dur(c.saldo, true) : '–'}</b></span>` : '<span class="zl-n mut">–</span>').join('')}<span></span></div>`;
            closeRows.forEach(({ r, lab, img }) => {
                let btn = '';
                if (img) {
                    const tt = img.getAttribute('title') || 'Stunden auszahlen';
                    const no = /nein/i.test(img.getAttribute('src') || '') || /keine/i.test(tt);
                    btn = `<button type="button" class="zl-pay${no ? ' no' : ''}" data-act="pay" title="${esc(tt)}"><img src="${esc(img.src)}" alt="">${no ? esc(tt) : 'Stunden auszahlen'}</button>`;
                }
                out += `<div class="zl-row close"><div class="zl-cl"><b>${esc(lab)}</b>${btn}</div>${tlCell}${VC.map(vc => cell(val(r, nrOf(vc.key)), vc.key === 'ist' ? 'ist' : '')).join('')}<span></span></div>`;
            });
            html += out;
        });
        rowsBox.innerHTML = html;
    }

    /* ════════════════════ EINSTELLUNGEN ════════════════════ */
    const KEY = 'zplus_settings';
    const DEF = {
        v: 9,
        theme: 'saison', accent: '', fx: true, fxAmount: 'normal', density: 'normal', radius: 'round', width: 'limited', heroPos: 'top',
        pflicht: 30, abH: 6, lunchFrom: '11:30', lunchTo: '14:00', lunchMinLen: 10, planLunch: 30,
        earliest: '06:30', maxDay: 10, kern: true, kzMoDo: '15:00', kzFr: '12:00',
        notif: { saldo: { on: true, lead: 5 }, soll: { on: false, lead: 5 }, max: { on: true, lead: 15 }, lunch: { on: false, at: '12:00' }, sound: false },
        confetti: true, title: true, sticky: true, hideEmpty: false, todayHl: true, tl: true, legend: true,
        fxScope: 'page', view: 'full', hideNav: true, pretty: true, dimFuture: true, tableView: 'list', shell: true, kalView: 'months', futureDays: 'auto', brStart: '11:45', brSoll: '05:00', kernSaldo: true, brCollapsed: false, coffeeOn: true, coffee: null, sink: '', vol: 70, brZM: 'EITBR', cdOn: true, cdName: 'Weihnachtsfeier', cdDate: '', contrast: 'hoch', tlMode: 'auto', colOrder: [], colHidden: [], favs: [],
        wish: '16:30', collapsed: false, seen: 0
    };
    const REM_DEF = () => [{ t: '09:30', on: false, name: 'Kaffeepause' }, { t: '10:00', on: true, name: 'Daily' }];
    function normalize(s) {
        s = s && typeof s === 'object' ? s : {};
        const old = s.v || 0;
        const o = Object.assign({}, DEF, s);
        o.notif = Object.assign({}, DEF.notif, s.notif || {});
        ['saldo', 'soll', 'max', 'lunch'].forEach(k => { o.notif[k] = Object.assign({}, DEF.notif[k], (s.notif || {})[k] || {}); });
        let lay = Array.isArray(s.layout) ? s.layout.filter(x => x && CARD_DEFS[x.id]).map(x => ({ id: x.id, on: !!x.on, wide: !!x.wide })) : [];
        if (!lay.length) {
            lay = DEF_LAYOUT.map(x => Object.assign({}, x));
            if (s.cards) lay.forEach(x => { if (x.id in s.cards) x.on = !!s.cards[x.id]; });
        }
        DEF_LAYOUT.forEach(d => { if (!lay.find(x => x.id === d.id)) lay.push(Object.assign({}, d)); });
        o.layout = lay;
        if (old < 3 && (!s.lunchFrom || s.lunchFrom === '11:00')) o.lunchFrom = '11:30';
        if (old < 4) {                                   // v4: neue, ruhigere Standards
            if (!s.theme || s.theme === 'saison') o.theme = 'dark';
            o.heroPos = 'top';
            o.layout.forEach(x => { if (x.id === 'monat') x.wide = false; });
            o.seen = 0;
        }
        if (old < 5) {                                   // v4.1: Saison-Standard, schlankeres Dashboard
            o.theme = 'saison';
            o.layout.forEach(x => { if (['pause', 'rauch', 'wunsch', 'urlaub'].includes(x.id)) x.on = false; });
            const order = ['heute', 'saldo', 'woche', 'monat'];
            o.layout.sort((a, b) => (order.indexOf(a.id) < 0 ? 99 : order.indexOf(a.id)) - (order.indexOf(b.id) < 0 ? 99 : order.indexOf(b.id)));
            o.seen = 0;
        }
        if (old < 6) o.tableView = 'list';
        if (!['list', 'orig'].includes(o.tableView)) o.tableView = 'list';
        if (!['full', 'compact'].includes(o.view)) o.view = 'full';
        if (!['months', 'strip', 'orig'].includes(o.kalView)) o.kalView = 'months';
        if (!['auto', 'show', 'hide'].includes(o.futureDays)) o.futureDays = 'auto';
        if (!['auto', 'column', 'inline', 'off'].includes(o.tlMode)) o.tlMode = 'auto';
        if (!['normal', 'hoch'].includes(o.contrast)) o.contrast = 'hoch';
        if (!Array.isArray(o.coffee)) {           // aus dem alten LHR_Simplify übernehmen, sonst Standard
            let old = null; try { old = JSON.parse(localStorage.getItem('lhr_kaffee_pausen') || 'null'); } catch (e) { }
            o.coffee = REM_DEF();
        }
        if (old < 9) {                                  // v5.14: neue Standards – Ton aus, Kaffee 09:30 aus, Daily 10:00 an, Weihnachtsfeier 17.12.
            o.notif.sound = false;
            o.coffee = REM_DEF();
            if (!s.cdDate && (!s.cdName || s.cdName === 'Weihnachtsfeier')) { o.cdName = 'Weihnachtsfeier'; o.cdDate = new Date().getFullYear() + '-12-17'; }
        }
        o.coffee.forEach(x => { if (!x.name) x.name = 'Kaffeepause'; });
        o.coffee = o.coffee.filter(x => x && /^\d{1,2}:\d{2}$/.test(x.t)).slice(0, 8);
        if (!o.sink) { try { const os = localStorage.getItem('lhr_audio_sink'); if (os && os !== 'default') o.sink = os; } catch (e) { } }
        o.vol = Math.max(0, Math.min(100, +o.vol || 0));
        if (old < 7) o.shell = true;
        if (old < 8) o.hideEmpty = false;          // v5.3: LHR-Spaltenwahl gilt, Zeit+ blendet nichts mehr eigenmächtig aus
        delete o.cards; o.v = 9;
        return o;
    }
    const loadS = () => { let s = {}; try { s = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { } return normalize(s); };
    let S = loadS();
    const saveS = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } };
    saveS();

    /* ════════════════════ HELFER ════════════════════ */
    const H = 3600000, M = 60000;
    let R = null, O = null, L = null, SH = null, K = null, PAGE = 'other';      // Shadow-Roots: Dashboard + Overlays (Firmen-CSS kommt da nicht rein)
    const $ = id => document.getElementById(id) || (R && R.getElementById(id)) || (L && L.getElementById(id)) || (SH && SH.getElementById(id)) || (K && K.getElementById(id)) || (O && O.getElementById(id));
    const pad = n => String(n).padStart(2, '0');
    const clock = t => { const d = new Date(t); return pad(d.getHours()) + ':' + pad(d.getMinutes()); };
    const at = hm => { const p = String(hm || '0:0').split(':').map(Number); const d = new Date(); d.setHours(p[0] || 0, p[1] || 0, 0, 0); return d.getTime(); };
    const dur = (ms, signed) => {
        const neg = ms < 0, t = Math.round(Math.abs(ms) / M);
        return (signed ? (neg ? '−' : '+') : (neg ? '−' : '')) + Math.floor(t / 60) + ':' + pad(t % 60);
    };
    const mins = ms => Math.round(ms / M);
    const human = ms => { const t = Math.max(0, Math.round(ms / M)), h = Math.floor(t / 60), m = t % 60; return h ? h + ' h ' + pad(m) + ' min' : m + ' min'; };
    const parseDur = txt => { const m = String(txt || '').match(/(-?)\s*(\d+):(\d{2})/); if (!m) return null; const v = (+m[2] * 60 + +m[3]) * M; return m[1] ? -v : v; };
    const parseClock = txt => { const m = String(txt || '').match(/(\d{1,2}):(\d{2})/); return m ? at(m[1] + ':' + m[2]) : null; };
    const dayKey = d => pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear();
    const todayKey = () => dayKey(new Date());
    const renderBRwe = {};
    let BU_LIVE = null;                        // Buchen-Seite: Stand-Kacheln live nachrechnen
    let TB_OVERRIDE = null;                    // Buchen-Seite: Zeitdatenliste im Hintergrund geladen
    const tbody = () => TB_OVERRIDE || document.getElementById('zdlBody');
    const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const reducedMotion = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const safe = (name, fn) => { try { return fn(); } catch (e) { reportError(name, e); } };
    const rnd = (a, b) => a + Math.random() * (b - a);
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const inPath = (e, node) => !!node && typeof e.composedPath === 'function' && e.composedPath().includes(node);

    /* ════════════════════ THEMES ════════════════════ */
    const THEMES = {
        dark:      { name: 'Midnight',     icon: '🌙', dark: true, fx: null,
            bg: '#12151c', surf: '#181c25', surf2: '#20252f', line: '#272d39', text: '#e7e9ef', muted: '#8b92a4',
            accent: '#7c8cff', accent2: '#4cc9f0', ok: '#3ddc97', warn: '#f5b942', bad: '#ff6b6b',
            page: '#0b0d12', td: '#10131a', td2: '#13161e', th: '#181c25', grid: '#1f242e' },
        light:     { name: 'Hell',         icon: '☀️', dark: false, fx: null,
            bg: '#ffffff', surf: '#f6f7fa', surf2: '#eceef3', line: '#e3e6ec', text: '#141822', muted: '#6b7280',
            accent: '#4f5bd5', accent2: '#0ea5e9', ok: '#16a34a', warn: '#d97706', bad: '#dc2626',
            td: '#ffffff', td2: '#fafbfc', th: '#f6f7fa', grid: '#e8eaf0' },
        graphit:   { name: 'Graphit',      icon: '◼️', dark: true, fx: null,
            bg: '#161618', surf: '#1d1d20', surf2: '#26262a', line: '#2f2f34', text: '#f2f2f3', muted: '#9a9aa3',
            accent: '#c8f560', accent2: '#60a5fa', ok: '#4ade80', warn: '#fbbf24', bad: '#f87171',
            page: '#0e0e10', td: '#131315', td2: '#161618', th: '#1d1d20', grid: '#26262a' },
        winter:    { name: 'Winter',       icon: '❄️', dark: true, fx: 'snow',
            bg: '#0f1826', surf: '#132034', surf2: '#192942', line: '#223553', text: '#e6f1ff', muted: '#8aa4c4',
            accent: '#7dd3fc', accent2: '#c4b5fd', ok: '#5eead4', warn: '#fcd34d', bad: '#fca5a5',
            page: '#08101c', td: '#0c1624', td2: '#0f1a2b', th: '#132034', grid: '#1a2a42' },
        maci:      { name: 'Maci',         icon: '🎄', dark: true, fx: 'maci',
            bg: '#0f1826', surf: '#142238', surf2: '#1b2d48', line: '#2a4064', text: '#eef5ff', muted: '#a3b8d6',
            accent: '#f6c76b', accent2: '#7ee2a8', ok: '#6ee7a8', warn: '#fdba74', bad: '#ff8f8f',
            page: '#08101c', td: '#0c1624', td2: '#0f1a2b', th: '#142238', grid: '#1e3150' },
        neon:      { name: 'Neon',         icon: '🌆', dark: true, fx: 'stars',
            bg: '#0d0b1a', surf: '#141127', surf2: '#1c1836', line: '#2b2550', text: '#f3f0ff', muted: '#a49cd0',
            accent: '#ff4fd8', accent2: '#22e4ff', ok: '#3dffa8', warn: '#ffd23f', bad: '#ff5c7a',
            page: '#07060f', td: '#0b0918', td2: '#0e0c1f', th: '#141127', grid: '#211c3f' },
        wald:      { name: 'Wald',         icon: '🌲', dark: true, fx: null,
            bg: '#0e1612', surf: '#13201a', surf2: '#1a2a22', line: '#24392e', text: '#e8f3ec', muted: '#93ad9d',
            accent: '#6fcf8f', accent2: '#e2b65c', ok: '#7ee2a0', warn: '#f2c255', bad: '#f28b82',
            page: '#08100c', td: '#0c1510', td2: '#0f1914', th: '#13201a', grid: '#1d3026' },
        nord:      { name: 'Nord',         icon: '🧊', dark: true, fx: 'snow',
            bg: '#2e3440', surf: '#353c4a', surf2: '#3b4252', line: '#4c566a', text: '#eceff4', muted: '#b7c0d0',
            accent: '#88c0d0', accent2: '#b48ead', ok: '#a3be8c', warn: '#ebcb8b', bad: '#e5838c',
            page: '#262b35', td: '#2b313c', td2: '#2f3541', th: '#353c4a', grid: '#434c5e' },
        oled:      { name: 'OLED Schwarz', icon: '⚫', dark: true, fx: null,
            bg: '#000000', surf: '#0b0b0d', surf2: '#141417', line: '#26262b', text: '#f5f5f7', muted: '#9a9aa3',
            accent: '#0a84ff', accent2: '#bf5af2', ok: '#30d158', warn: '#ffd60a', bad: '#ff453a',
            page: '#000000', td: '#050506', td2: '#09090a', th: '#0b0b0d', grid: '#1c1c20' },
        kaffee:    { name: 'Kaffee',       icon: '☕', dark: false, fx: null,
            bg: '#fbf7f2', surf: '#f3ece3', surf2: '#eadfd2', line: '#dccdbb', text: '#2b1d14', muted: '#7a6556',
            accent: '#9a5b2e', accent2: '#2f7d6d', ok: '#2f8a4c', warn: '#b7791f', bad: '#c0392b',
            td: '#fffdf9', td2: '#faf5ee', th: '#f3ece3', grid: '#e7dccd' },
        fruehling: { name: 'Frühling',     icon: '🌸', dark: false, fx: 'petals',
            bg: '#fffbfd', surf: '#fdf3f8', surf2: '#f9e6ef', line: '#f1d8e4', text: '#2a1722', muted: '#8a6577',
            accent: '#d6337a', accent2: '#65a30d', ok: '#16a34a', warn: '#d97706', bad: '#dc2626',
            td: '#ffffff', td2: '#fffafc', th: '#fdf3f8', grid: '#f3e1ea' },
        sommer:    { name: 'Sommer',       icon: '🌞', dark: false, fx: 'sun',
            bg: '#fffdf7', surf: '#fff8e6', surf2: '#fdeec4', line: '#f3e3b3', text: '#2b2310', muted: '#86744a',
            accent: '#e8590c', accent2: '#0891b2', ok: '#16a34a', warn: '#ca8a04', bad: '#dc2626',
            td: '#ffffff', td2: '#fffdf7', th: '#fff8e6', grid: '#f3e7c4' },
        herbst:    { name: 'Herbst',       icon: '🍂', dark: true, fx: 'leaves',
            bg: '#17130f', surf: '#1e1914', surf2: '#28211a', line: '#332a21', text: '#f5ebe0', muted: '#b09a86',
            accent: '#f08c3a', accent2: '#e9c46a', ok: '#a3d977', warn: '#f5b942', bad: '#f87171',
            page: '#0f0c09', td: '#14100c', td2: '#17130f', th: '#1e1914', grid: '#2a231b' },
        ozean:     { name: 'Ozean',        icon: '🌊', dark: true, fx: 'bubbles',
            bg: '#0c1a21', surf: '#10232c', surf2: '#152d38', line: '#1c3a47', text: '#e2f6fb', muted: '#86b3c2',
            accent: '#2dd4bf', accent2: '#60a5fa', ok: '#4ade80', warn: '#fbbf24', bad: '#fb7185',
            page: '#071318', td: '#0a1a21', td2: '#0c1e26', th: '#10232c', grid: '#173440' },
        nacht:     { name: 'Sternennacht', icon: '✨', dark: true, fx: 'stars',
            bg: '#120f22', surf: '#18142c', surf2: '#201b3a', line: '#2a244b', text: '#ece9ff', muted: '#9a93c4',
            accent: '#b794f6', accent2: '#22d3ee', ok: '#4ade80', warn: '#facc15', bad: '#fb7185',
            page: '#0a0815', td: '#0e0c1d', td2: '#120f24', th: '#18142c', grid: '#221d40' }
    };
    const THEME_CYCLE = ['dark', 'light', 'graphit', 'winter', 'maci', 'neon', 'wald', 'nord', 'oled', 'kaffee', 'fruehling', 'sommer', 'herbst', 'ozean', 'nacht', 'saison', 'auto'];
    const seasonKey = () => { const m = new Date().getMonth(); return (m === 11 || m < 2) ? 'winter' : m < 5 ? 'fruehling' : m < 8 ? 'sommer' : 'herbst'; };
    const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    function themeKey() {
        if (S.theme === 'auto') return (mq && mq.matches) ? 'dark' : 'light';
        if (S.theme === 'saison') return seasonKey();
        return THEMES[S.theme] ? S.theme : 'dark';
    }
    const theme = () => THEMES[themeKey()];
    const themeLabel = () => S.theme === 'saison' ? 'Saison · ' + theme().name : S.theme === 'auto' ? 'System · ' + theme().name : theme().name;

    function applyTheme() {
        const r = document.documentElement;
        if (!r) return;
        const t = theme();
        ['bg', 'surf', 'surf2', 'line', 'text', 'muted', 'accent', 'accent2', 'ok', 'warn', 'bad', 'page', 'td', 'td2', 'th', 'grid']
            .forEach(k => { if (t[k]) r.style.setProperty('--zp-' + k, t[k]); });
        if (S.accent) r.style.setProperty('--zp-accent', S.accent);
        if (S.contrast !== 'normal') {          // mehr Kontrast: Nebentexte heller/dunkler, Rahmen und Flächen deutlicher
            const mix = (a, b, w) => { const x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16); const c = sh => Math.round(((x >> sh) & 255) * (1 - w) + ((y >> sh) & 255) * w); return '#' + [16, 8, 0].map(sh => c(sh).toString(16).padStart(2, '0')).join(''); };
            try {
                r.style.setProperty('--zp-muted', mix(t.muted, t.text, .3));
                r.style.setProperty('--zp-line', mix(t.line, t.text, t.dark ? .16 : .14));
                r.style.setProperty('--zp-surf2', mix(t.surf2, t.text, t.dark ? .05 : .03));
                if (t.grid) r.style.setProperty('--zp-grid', mix(t.grid, t.text, t.dark ? .1 : .08));
            } catch (e) { }
        }
        try {
            const ac = (S.accent || t.accent || '#7c8cff').replace('#', ''), v = parseInt(ac.length === 3 ? ac.split('').map(x => x + x).join('') : ac.slice(0, 6), 16);
            const ch = x => { x /= 255; return x <= .03928 ? x / 12.92 : Math.pow((x + .055) / 1.055, 2.4); };
            const L = .2126 * ch(v >> 16) + .7152 * ch(v >> 8 & 255) + .0722 * ch(v & 255);
            r.style.setProperty('--zp-onacc', (1.05 / (L + .05)) >= ((L + .05) / .058) ? '#fff' : '#10141c');
            const b = parseInt(String(t.bad || '#ff6b6b').slice(1, 7), 16), Lb = .2126 * ch(b >> 16) + .7152 * ch(b >> 8 & 255) + .0722 * ch(b & 255);
            r.style.setProperty('--zp-onbad', (1.05 / (Lb + .05)) >= ((Lb + .05) / .058) ? '#fff' : '#10141c');
        } catch (e) { }
        r.style.setProperty('--zp-scheme', t.dark ? 'dark' : 'light');
        r.style.setProperty('--zp-rem', t.dark ? '#2dd4bf' : '#0d9488');
        r.style.setProperty('--zp-shadow', t.dark ? '0 1px 0 rgba(255,255,255,.03) inset,0 12px 32px rgba(0,0,0,.35)' : '0 1px 2px rgba(16,24,40,.04),0 8px 24px rgba(16,24,40,.07)');
        r.style.setProperty('--zp-zoom', { compact: .9, normal: 1, large: 1.1 }[S.density] || 1);
        r.style.setProperty('--zp-r', { square: '6px', soft: '11px', round: '16px' }[S.radius] || '16px');
        r.classList.toggle('zp-dark', !!t.dark);
        r.classList.toggle('zp-hidecols', !!S.hideEmpty);
        r.classList.toggle('zp-todayhl', !!S.todayHl);
        r.classList.toggle('zp-nonav', !!S.hideNav);
        r.classList.toggle('zp-pretty', !!S.pretty);
        r.classList.toggle('zp-dimfuture', !!S.dimFuture);
        r.classList.toggle('zp-hidetable', !!L && S.tableView === 'list');
        r.classList.toggle('zp-shell', !!SH && !!S.shell);
        r.classList.toggle('zp-kalview', !!K && S.kalView !== 'orig');
        if (SH && $('zs')) safe('App-Leiste', renderShell);
        if (K) safe('Kalender', renderKal);
        fixColorsSoon();
        const shh = document.getElementById('zp-shell-host'); if (shh) shh.style.display = S.shell ? '' : 'none';
        const dh = document.getElementById('zp-host'); if (dh) dh.classList.toggle('shell', !!SH && !!S.shell);
        const zl = $('zl'); if (zl) zl.classList.toggle('orig', S.tableView !== 'list');
        const zp = $('zp');
        if (zp) {
            zp.classList.toggle('hero-top', S.heroPos === 'top');
            zp.classList.toggle('wide', S.width === 'full');
            zp.classList.toggle('compact', S.view === 'compact');
        }
        const vb = $('zp-view');
        if (vb) { vb.innerHTML = ico(S.view === 'compact' ? 'maximize' : 'minimize', 16); vb.title = S.view === 'compact' ? 'Alles anzeigen (Alt+M)' : 'Kompakt – nur das Wichtigste (Alt+M)'; }
        startFx();
    }

    /* ════════════════════ CSS: SEITE (global) ════════════════════ */
    const PAGE_CSS = `
:root{--zp-soft:color-mix(in srgb,var(--zp-accent) 12%,transparent)}
#zp-host{display:block;margin:12px 0 16px;max-width:1240px}
#zp-host.wide{max-width:none}
html.zp-hidecols .zp-colhide{display:none !important}
html.zp-todayhl.zp-zdl table.tabelle tbody tr.zp-today > td:first-child{box-shadow:inset 3px 0 0 var(--zp-accent) !important}
html.zp-todayhl.zp-zdl table.tabelle tbody tr.zp-today > td.td_datum{color:var(--zp-accent) !important}

html.zp-dark,html.zp-dark body{background:var(--zp-page) !important;color:var(--zp-text) !important}
html.zp-dark header,html.zp-dark header *,html.zp-dark nav,html.zp-dark .nav_head,html.zp-dark .navmenu,html.zp-dark .nav_body,
html.zp-dark #periode,html.zp-dark .periode_span,html.zp-dark section#content,html.zp-dark .scrolldiv,html.zp-dark .tablecontent,
html.zp-dark .info_extra,html.zp-dark .error_urlaubmaxdate_extra,html.zp-dark body > p,html.zp-dark #welcome_name,html.zp-dark #welcome_name_text,html.zp-dark #resturlaub{
  background-color:transparent !important;background-image:none !important;color:var(--zp-text) !important;border-color:var(--zp-grid) !important}
html.zp-dark #logo img{background:#fff;border-radius:8px;padding:3px 8px}
html.zp-dark #logotext{color:var(--zp-muted) !important}
html.zp-dark .nav_main a{background:var(--zp-surf) !important;background-image:none !important;color:var(--zp-text) !important;border:1px solid var(--zp-line) !important;border-radius:9px !important}
html.zp-dark .nav_main a.active{background:var(--zp-accent) !important;border-color:var(--zp-accent) !important;color:var(--zp-onacc,#fff) !important}
html.zp-dark .navmenu_div{background:var(--zp-surf) !important;border-radius:12px;border:1px solid var(--zp-line) !important}
html.zp-dark .navmenu_icon_beschriftung{color:var(--zp-muted) !important}
html.zp-dark .navmenu_icon_beschriftung.active{color:var(--zp-accent) !important;font-weight:700}
html.zp-dark .hbmbutton .menue{background:var(--zp-surf) !important;background-image:none !important;border:1px solid var(--zp-line) !important;border-radius:10px;color:var(--zp-text) !important}
html.zp-dark .textmenue{color:var(--zp-text) !important}
html.zp-dark .overlay,html.zp-dark .uloverlay,html.zp-dark .custom-uloverlay,html.zp-dark .pdfmenue,html.zp-dark #pdfMenue,html.zp-dark .navpkt,
html.zp-dark .ui-dialog,html.zp-dark .ui-widget-content,html.zp-dark .ui-dialog-content,html.zp-dark .flatpickr-calendar{
  background:var(--zp-surf) !important;background-image:none !important;color:var(--zp-text) !important;border-color:var(--zp-line) !important}
html.zp-dark .ui-dialog-titlebar,html.zp-dark .ui-widget-header{background:var(--zp-th) !important;background-image:none !important;color:var(--zp-text) !important;border-color:var(--zp-line) !important}
html.zp-dark .tippy-box{background:var(--zp-surf2) !important;color:var(--zp-text) !important}
html.zp-dark input,html.zp-dark select,html.zp-dark textarea{background-color:var(--zp-surf) !important;color:var(--zp-text) !important;border-color:var(--zp-line) !important}
html.zp-dark input[type=button],html.zp-dark .button_small,html.zp-dark .button_info{background:var(--zp-surf2) !important;background-image:none !important}
html.zp-dark a{color:color-mix(in srgb,var(--zp-accent) 55%,#fff) !important}
html.zp-dark .success{color:var(--zp-ok) !important}
html.zp-dark .error,html.zp-dark .info{color:var(--zp-warn) !important;background:transparent !important}
html.zp-dark table,html.zp-dark thead,html.zp-dark tbody{background:transparent !important;border-color:var(--zp-grid) !important}
html.zp-dark th{background:var(--zp-th) !important;background-image:none !important;color:var(--zp-muted) !important;border-color:var(--zp-grid) !important;font-weight:600 !important}
html.zp-dark th.th_transparent,html.zp-dark th.alert_buchungsfehler{background:var(--zp-page) !important;border:none !important}
html.zp-dark.zp-zdl td{background-color:var(--zp-td) !important;color:var(--zp-text) !important;border-color:var(--zp-grid) !important}
html.zp-dark:not(.zp-zdl) td{color:var(--zp-text);border-color:var(--zp-grid) !important}
html.zp-dark tr.tr_even_date > td{background-color:var(--zp-td2) !important}
html.zp-dark table.tabelle tbody tr[data-zp-tint]{background-color:transparent !important}
html.zp-dark table.tabelle tbody tr[data-zp-tint] > td{background-color:var(--zp-tint) !important;color:color-mix(in srgb,var(--zp-text) 75%,var(--zp-edge)) !important}
html.zp-dark table.tabelle tbody tr[data-zp-tint] > td:first-child{box-shadow:inset 2px 0 0 var(--zp-edge)}
html.zp-dark table.tabelle tbody td[data-zp-tint]{background-color:var(--zp-tint) !important;box-shadow:inset 0 -2px 0 var(--zp-edge)}
html.zp-dark table.tabelle tbody tr:hover > td{filter:brightness(1.18)}
html.zp-dark td[style*="color:black"],html.zp-dark td[style*="color: black"]{color:var(--zp-text) !important}
html.zp-dark td[style*="color:red"],html.zp-dark td[style*="color: red"]{color:var(--zp-bad) !important}
html.zp-dark td[style*="color:green"],html.zp-dark td[style*="color: green"]{color:var(--zp-ok) !important}

/* ───── Zeit+ App-Leiste ersetzt den LHR-Kopf ───── */
#zp-shell-host{display:block;position:sticky;top:0;z-index:2147470000}
html.zp-shell body{margin:0 !important;padding:0 16px 48px !important;box-sizing:border-box;max-width:100%}
html.zp-shell:not(.zp-zdl) body,html.zp-shell.zp-hidetable body{overflow-x:clip !important}
html.zp-shell #zp-shell-host{margin:0 -16px 0}
html.zp-shell body > header,html.zp-shell nav.nav_head,html.zp-shell .navmenu.nav_body,html.zp-shell .zp-hide-orig,html.zp-shell #user-links,html.zp-shell #ul-user-links,html.zp-shell #custom-user-links,html.zp-shell #custom-ul-user-links{display:none !important}
html.zp-shell #zp-host,html.zp-shell #zp-list-host{margin-left:auto;margin-right:auto}
html.zp-shell #zp-host{margin-top:18px}
html.zp-shell:not(.zp-zdl) section#content,html.zp-shell:not(.zp-zdl) #content{margin:18px auto 0 !important;max-width:1600px}
html.zp-shell .info_extra p:not(.hidden),html.zp-shell #info_zeitdatenliste_div p:not(.hidden),html.zp-shell .error_urlaubmaxdate_extra p:not(.hidden){max-width:1240px;margin:14px auto 0 !important;padding:11px 15px !important;border-radius:12px !important;
  background:var(--zp-surf,#f6f7fa) !important;border:1px solid var(--zp-line,#e3e6ec) !important;font-family:'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif !important;font-size:13px !important}
html.zp-shell .success:not(.hidden){border-color:color-mix(in srgb,var(--zp-ok) 45%,transparent) !important;color:var(--zp-ok) !important}
html.zp-shell .error:not(.hidden){border-color:color-mix(in srgb,var(--zp-bad) 45%,transparent) !important;color:var(--zp-bad) !important}

/* ───── Alle LHR-Seiten (Anträge, Kalender, Abwesenheiten, Tableau, Planer …) ───── */
html.zp-dark{color-scheme:dark}
html.zp-dark *{scrollbar-color:color-mix(in srgb,var(--zp-muted) 45%,transparent) transparent}
html.zp-dark ::-webkit-scrollbar{width:11px;height:11px;background:transparent}
html.zp-dark ::-webkit-scrollbar-track,html.zp-dark ::-webkit-scrollbar-corner{background:transparent}
html.zp-dark ::-webkit-scrollbar-thumb{background:color-mix(in srgb,var(--zp-muted) 40%,transparent);border-radius:99px;border:3px solid transparent;background-clip:content-box}
/* Ladeschirm beim Seitenwechsel: kein weißes Aufblitzen */
html.zp-loading,html.zp-loading body{background:var(--zp-page,#0f1115) !important}
html.zp-loading body{opacity:0 !important}
html.zp-loading::after{content:'';position:fixed;left:50%;top:46%;width:30px;height:30px;margin:-15px 0 0 -15px;border-radius:50%;border:3px solid color-mix(in srgb,var(--zp-accent,#7c8cff) 22%,transparent);border-top-color:var(--zp-accent,#7c8cff);animation:zpspin .7s linear infinite;z-index:2147483647}
@keyframes zpspin{to{transform:rotate(360deg)}}
html.zp-ready body{animation:zpfade .22s ease-out}
@keyframes zpfade{from{opacity:0}to{opacity:1}}
html.zp-dark body:not(#zp-a):not(#zp-b) [data-zp-cf="w"]{background-color:var(--zp-surf) !important;background-image:none !important;color:var(--zp-text) !important}
html.zp-dark body:not(#zp-a):not(#zp-b) td[data-zp-cf="w"],html.zp-dark body:not(#zp-a):not(#zp-b) tr[data-zp-cf="w"]{background-color:var(--zp-td) !important}
html.zp-dark body:not(#zp-a):not(#zp-b) [data-zp-cf="s"]{background-color:hsl(var(--zp-cfh) 30% 19%) !important;background-image:none !important;color:hsl(var(--zp-cfh) 60% 88%) !important}
html.zp-dark body:not(#zp-a):not(#zp-b) [data-zp-cf="h"]{background-color:hsl(var(--zp-cfh) 18% 13%) !important;background-image:repeating-linear-gradient(135deg,hsl(var(--zp-cfh) 40% 70% / .09) 0 2px,transparent 2px 7px) !important;color:var(--zp-muted) !important}
html.zp-dark body:not(#zp-a):not(#zp-b) [data-zp-cf="v"],html.zp-dark body:not(#zp-a):not(#zp-b) [data-zp-cf="v"] *{color:#17130e !important}
html.zp-dark body:not(#zp-a):not(#zp-b) [data-zp-cf="d"],html.zp-dark body:not(#zp-a):not(#zp-b) [data-zp-cf="d"] *{color:#fff !important}
html.zp-dark body:not(#zp-a):not(#zp-b) [data-zp-ink]{color:var(--zp-text) !important}
html.zp-dark body:not(#zp-a):not(#zp-b) th[data-zp-cf]{background-color:var(--zp-th) !important;background-image:none !important;color:var(--zp-muted) !important}
/* Kalender: Zeit+ Ansicht statt Original-Tabelle */
#zp-kal-host{display:block;margin:0 auto 28px;max-width:1240px}
html.zp-kalview section#content > :not(#zp-kal-host):not(#error_urlaubmaxdate_div){display:none !important}
html.zp-shell.zp-p-kal section#content{max-width:1240px !important}
html:not(.zp-kalview) #zp-kal-host{margin-bottom:14px}
/* Seiten mit Listen/Filtern (Anträge, Mitteilungen, Abwesenheiten, Tableau, Planer) */
html.zp-shell.zp-p-other section#content{font-family:'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif}
html.zp-pretty.zp-p-other #content select,html.zp-pretty.zp-p-other #content input[type=text],html.zp-pretty.zp-p-other #content input[type=search],html.zp-pretty.zp-p-other #content input:not([type]){border-radius:9px !important;border:1px solid var(--zp-line) !important;padding:5px 9px !important;min-height:32px;box-sizing:border-box;outline:0}
html.zp-pretty.zp-p-other #content select:focus,html.zp-pretty.zp-p-other #content input:focus{border-color:var(--zp-accent) !important;box-shadow:0 0 0 3px color-mix(in srgb,var(--zp-accent) 22%,transparent) !important}
html.zp-pretty.zp-p-other #content hr{border:0 !important;border-top:1px solid var(--zp-line) !important;margin:14px 0 !important}
html.zp-pretty.zp-p-other #content table.dataTable tbody td,html.zp-pretty.zp-p-other #content table.dataTable thead th{border-color:var(--zp-grid) !important}
html.zp-pretty.zp-p-other #content table.dataTable thead th{font-size:12px;letter-spacing:.03em}
html.zp-pretty #tableau_mitarbeiter_container .scrolldiv{border:0 !important;border-radius:0;overflow:visible !important;background:transparent !important;width:100%}
/* Tableau als Karten-Raster */
html.zp-pretty #tableautab2,html.zp-pretty #tableautab{border-collapse:separate !important;border-spacing:8px !important;margin:-8px !important;background:transparent !important;width:calc(100% + 16px) !important;table-layout:fixed !important}
html.zp-pretty #tableautab2 td,html.zp-pretty #tableautab td{min-width:0 !important;width:auto !important;max-width:none !important;height:auto !important;padding:9px 30px 9px 12px !important;border:1px solid var(--zp-line) !important;border-radius:12px !important;background-color:var(--zp-surf,#f6f7fa) !important;font:600 14px/1.25 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif !important;color:var(--zp-text) !important;cursor:pointer;transition:border-color .12s,background-color .12s,transform .1s;vertical-align:middle}
html.zp-pretty #tableautab2 td:empty,html.zp-pretty #tableautab td:empty{border:0 !important;background:transparent !important;cursor:default}
html.zp-pretty #tableautab2 td img,html.zp-pretty #tableautab td img,html.zp-pretty #tableautab2 td > span:first-child,html.zp-pretty #tableautab td > span:first-child{width:22px !important;height:22px !important;vertical-align:middle;margin-right:8px !important}
html.zp-pretty #tableautab2 td:not(:empty):hover,html.zp-pretty #tableautab td:not(:empty):hover{border-color:var(--zp-accent) !important;background-color:color-mix(in srgb,var(--zp-accent) 10%,var(--zp-surf,#f6f7fa)) !important}
html.zp-dark body:not(#zp-a):not(#zp-b) #tableautab2 td:not(:empty),html.zp-dark body:not(#zp-a):not(#zp-b) #tableautab td:not(:empty){background-color:var(--zp-surf) !important}
html.zp-dark body:not(#zp-a):not(#zp-b) #tableautab2 td:not(:empty):hover,html.zp-dark body:not(#zp-a):not(#zp-b) #tableautab td:not(:empty):hover{background-color:color-mix(in srgb,var(--zp-accent) 12%,var(--zp-surf)) !important}
html.zp-pretty #tableautab2 td.zp-me,html.zp-pretty #tableautab td.zp-me{border-color:var(--zp-accent) !important;box-shadow:0 0 0 1px var(--zp-accent) !important}
html.zp-pretty #tableautab2 td.zp-fav,html.zp-pretty #tableautab td.zp-fav{border-color:color-mix(in srgb,#f5c542 70%,transparent) !important;box-shadow:none !important}
html.zp-pretty #dtab_wrapper{margin-top:14px}
/* Detailbereich (Erreichbarkeit/Abwesenheit) erst zeigen, wenn eine Person angeklickt wurde */
html.zp-pretty:not(.zp-tdet) #tableaudetailtab,html.zp-pretty:not(.zp-tdet) .detaildn_name_abt_wrapper,html.zp-pretty:not(.zp-tdet) #tableau_a_zdl{display:none !important}
html.zp-pretty #content > hr.tableauTrennstrich:last-of-type{display:none}
html.zp-pretty.zp-tdet .detaildn_name_abt_wrapper{max-width:1240px;margin:18px auto 6px;font:700 17px/1.3 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif;color:var(--zp-text)}
html.zp-pretty.zp-tdet #detaildn_abteilung{font-size:13px;font-weight:500;color:var(--zp-muted)}
html.zp-pretty #tableaudetailtab{border-collapse:separate !important;border-spacing:12px 0 !important}
html.zp-pretty #tableaudetailtab td.empty{display:none !important}
html.zp-pretty #tableaudetailtab td strong{display:block;margin-bottom:6px;font-size:12px;letter-spacing:.05em;text-transform:uppercase;color:var(--zp-muted)}
html.zp-pretty #tableaudetailtab td span{font-size:14px;line-height:1.6}
html.zp-pretty #tableautab2 td,html.zp-pretty #tableautab td{white-space:nowrap !important;overflow:hidden !important;text-overflow:clip !important;border-color:var(--zp-grid) !important}
html.zp-pretty #tableautab2 td *,html.zp-pretty #tableautab td *{text-overflow:clip !important}
/* Tableau im Dark-Mode: Zellen immer im Theme (LHR färbt ausgewählte Zeilen sonst weiß) */
html.zp-dark #tableautab2 td,html.zp-dark #tableautab td,html.zp-dark #tableautab2 tr,html.zp-dark #tableautab tr{background-color:var(--zp-td,var(--zp-surf)) !important;background-image:none !important;color:var(--zp-text) !important}
html.zp-dark #tableautab2 td *,html.zp-dark #tableautab td *{color:inherit}
html.zp-pretty #tableautab2 tr:hover > td,html.zp-pretty #tableautab tr:hover > td{background-color:color-mix(in srgb,var(--zp-accent) 12%,transparent) !important;cursor:pointer}
html.zp-pretty #tableaudetailtab td:not(.empty){background:var(--zp-surf,#f6f7fa) !important;border:1px solid var(--zp-line) !important;border-radius:14px;padding:12px 16px !important;vertical-align:top}
html.zp-pretty #tableaudetailtab td#tableau_detail_foto{background:transparent !important;border:0 !important}
html.zp-pretty .xlsxexp,html.zp-pretty #pdficon img,html.zp-pretty .print-container img{border-radius:12px;transition:transform .15s}
html.zp-pretty .xlsxexp:hover,html.zp-pretty #pdficon img:hover{transform:translateY(-1px)}
html.zp-dark.zp-pretty #colHide img,html.zp-dark.zp-pretty .xlsxexp,html.zp-dark.zp-pretty #pdficon img{filter:drop-shadow(0 2px 8px rgba(0,0,0,.4))}
html.zp-dark .dataTables_wrapper,html.zp-dark .dataTables_info,html.zp-dark .dataTables_length,html.zp-dark .dataTables_filter,html.zp-dark .dataTables_wrapper label{color:var(--zp-muted) !important}
html.zp-dark table.dataTable,html.zp-dark table.dataTable thead th,html.zp-dark table.dataTable thead td,html.zp-dark table.dataTable tfoot th{border-color:var(--zp-grid) !important}
html.zp-dark table.dataTable tbody tr{background-color:transparent !important}
html.zp-dark table.dataTable.stripe tbody tr.odd > td:not([style*="background-color: rgb("]),html.zp-dark table.dataTable.display tbody tr.odd > td:not([style*="background-color: rgb("]){background-color:var(--zp-td2) !important}
html.zp-dark table.dataTable tbody tr:hover > td:not([style*="background-color: rgb("]){background-color:color-mix(in srgb,var(--zp-accent) 8%,var(--zp-td)) !important}
html.zp-dark table.dataTable thead .sorting,html.zp-dark table.dataTable thead .sorting_asc,html.zp-dark table.dataTable thead .sorting_desc{background-color:var(--zp-th) !important}
html.zp-dark .DTFC_LeftBodyWrapper,html.zp-dark .DTFC_RightBodyWrapper,html.zp-dark .DTFC_LeftHeadWrapper,html.zp-dark .dataTables_scrollHead,html.zp-dark .dataTables_scrollBody,html.zp-dark .fixedHeader-floating{background:var(--zp-page) !important}
html.zp-dark .dataTables_wrapper .dataTables_paginate .paginate_button{color:var(--zp-text) !important;background:var(--zp-surf) !important;border:1px solid var(--zp-line) !important;border-radius:8px !important}
html.zp-dark .dataTables_wrapper .dataTables_paginate .paginate_button.current,html.zp-dark .dataTables_wrapper .dataTables_paginate .paginate_button:hover{background:var(--zp-accent) !important;border-color:var(--zp-accent) !important;color:var(--zp-onacc,#fff) !important}
html.zp-dark .dataTables_wrapper .dataTables_paginate .paginate_button.disabled{opacity:.4}
html.zp-dark input[type=submit],html.zp-dark input[type=reset],html.zp-dark button:not([class*="zp"]),html.zp-dark .ui-button,html.zp-dark .button,html.zp-dark .btn{background:var(--zp-surf2) !important;background-image:none !important;color:var(--zp-text) !important;border-color:var(--zp-line) !important}
html.zp-dark select option{background:var(--zp-surf) !important;color:var(--zp-text) !important}
html.zp-dark fieldset,html.zp-dark legend,html.zp-dark hr{border-color:var(--zp-line) !important;color:var(--zp-text) !important}
html.zp-dark label,html.zp-dark h1,html.zp-dark h2,html.zp-dark h3,html.zp-dark h4,html.zp-dark p,html.zp-dark li{color:inherit}
html.zp-dark .ui-datepicker,html.zp-dark .ui-datepicker-header,html.zp-dark .ui-menu,html.zp-dark .ui-autocomplete,html.zp-dark .ui-tabs,html.zp-dark .ui-tabs-nav,html.zp-dark .ui-accordion-header,html.zp-dark .ui-accordion-content{
  background:var(--zp-surf) !important;background-image:none !important;color:var(--zp-text) !important;border-color:var(--zp-line) !important}
html.zp-dark .ui-state-default,html.zp-dark .ui-widget-content .ui-state-default,html.zp-dark .ui-widget-header .ui-state-default{background:var(--zp-surf2) !important;background-image:none !important;color:var(--zp-text) !important;border-color:var(--zp-line) !important}
html.zp-dark .ui-state-default a,html.zp-dark .ui-state-default a:link{color:var(--zp-text) !important}
html.zp-dark .ui-state-hover,html.zp-dark .ui-state-focus{background:color-mix(in srgb,var(--zp-accent) 20%,var(--zp-surf2)) !important;color:var(--zp-text) !important}
html.zp-dark .ui-state-active,html.zp-dark .ui-widget-content .ui-state-active,html.zp-dark .ui-state-highlight,html.zp-dark .ui-widget-content .ui-state-highlight{background:var(--zp-accent) !important;background-image:none !important;color:var(--zp-onacc,#fff) !important;border-color:var(--zp-accent) !important}
html.zp-dark .ui-state-active a,html.zp-dark .ui-state-highlight a{color:var(--zp-onacc,#fff) !important}
html.zp-dark .ui-widget-overlay{background:rgba(0,0,0,.6) !important;opacity:1 !important}
html.zp-dark .flatpickr-calendar,html.zp-dark .flatpickr-months .flatpickr-month,html.zp-dark .flatpickr-weekdays,html.zp-dark span.flatpickr-weekday,html.zp-dark .flatpickr-monthSelect-month{background:var(--zp-surf) !important;color:var(--zp-text) !important;fill:var(--zp-text) !important}
html.zp-dark .flatpickr-day,html.zp-dark .flatpickr-monthSelect-month{color:var(--zp-text) !important}
html.zp-dark .flatpickr-day.prevMonthDay,html.zp-dark .flatpickr-day.nextMonthDay,html.zp-dark .flatpickr-day.flatpickr-disabled{color:var(--zp-muted) !important}
html.zp-dark .flatpickr-day:hover,html.zp-dark .flatpickr-monthSelect-month:hover{background:var(--zp-surf2) !important}
html.zp-dark .flatpickr-day.selected,html.zp-dark .flatpickr-day.today.selected,html.zp-dark .flatpickr-monthSelect-month.selected{background:var(--zp-accent) !important;border-color:var(--zp-accent) !important;color:var(--zp-onacc,#fff) !important}
html.zp-dark .flatpickr-months .flatpickr-prev-month svg,html.zp-dark .flatpickr-months .flatpickr-next-month svg{fill:var(--zp-text) !important}
html.zp-dark .notiflix-report-content,html.zp-dark .notiflix-confirm-content{background:var(--zp-surf) !important;color:var(--zp-text) !important}
html.zp-dark .notiflix-report-content h5,html.zp-dark .notiflix-confirm-content h5,html.zp-dark .notiflix-report-content p,html.zp-dark .notiflix-confirm-content div{color:var(--zp-text) !important}
html.zp-dark .navmenu_anzahl_bg{background-color:var(--zp-bad) !important;border-radius:99px}
html.zp-dark .navmenu_anzahl{color:var(--zp-onbad,#fff) !important}
html.zp-dark .navmenu_div:hover{border-color:var(--zp-accent) !important}
html.zp-dark .navmenu_img{filter:drop-shadow(0 2px 6px rgba(0,0,0,.35))}
html.zp-dark .js-plotly-plot .plotly .main-svg{background:transparent !important}
html.zp-dark .js-plotly-plot .plotly .bg{fill:var(--zp-surf) !important}
html.zp-dark .js-plotly-plot text{fill:var(--zp-text) !important}

/* Original-Tabelle: alle Rahmen (auch in LHR-Kopien) unsichtbar */
html.zp-pretty.zp-zdl #content table td,html.zp-pretty.zp-zdl #content table tr,html.zp-pretty.zp-zdl #content table tbody{border-color:transparent !important;outline:0 !important}
html.zp-pretty.zp-zdl #content table th{border-color:var(--zp-grid,#e8eaf0) !important}
/* Original-Tabelle ausblenden, wenn die Zeit+ Liste aktiv ist (bleibt im Layout, damit LHR-Scripts weiter rechnen) */
html.zp-hidetable section#content{position:absolute !important;left:-30000px !important;top:0 !important;visibility:hidden !important;pointer-events:none !important}
#zp-list-host{display:block;margin:0 0 28px;max-width:1240px}
#zp-list-host.wide,#zp-list-host.xwide{max-width:none}
/* Navi oben ausblenden */
html.zp-nonav .nav_main,html.zp-nonav #ul-user-links{display:none !important}

/* Menü-Knopf: muss über dem Dashboard liegen (sonst öffnet das Menü unsichtbar dahinter) */
.hbmbutton{position:relative !important;z-index:2147480000 !important;pointer-events:auto !important;cursor:pointer !important}
.hbmbutton .overlay{z-index:2147480001 !important}
/* Menü-Button modern */
html.zp-pretty .hbmbutton{background:none !important;background-image:none !important;border:0 !important;box-shadow:none !important;outline:0 !important}
html.zp-pretty .hbmbutton .menue{background:var(--zp-surf,#f6f7fa) !important;background-image:none !important;border:1px solid var(--zp-line,#e3e6ec) !important;border-image:none !important;
  border-radius:10px !important;box-shadow:none !important;outline:0 !important;transition:border-color .15s,background .15s}
html.zp-pretty .hbmbutton .menue:hover{border-color:var(--zp-accent) !important;background:var(--zp-surf2,#eceef3) !important}
html.zp-pretty .hbmbutton .menue *,html.zp-pretty .textmenue{background:transparent !important;background-image:none !important;box-shadow:none !important;text-shadow:none !important;
  color:var(--zp-text,#141822) !important;font-family:'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif !important;font-weight:600 !important;border:0 !important}
html.zp-pretty .hbmbutton .overlay{border-radius:12px !important;border:1px solid var(--zp-line) !important;box-shadow:0 16px 40px rgba(0,0,0,.3) !important;overflow:hidden}
html.zp-pretty .hbmbutton .overlay .text{display:none !important}
html.zp-pretty .hbmbutton .navpkt a{font-family:'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif !important;text-decoration:none !important}

/* Tabelle modern – NUR Farben, keine Größen/Abstände (LHR richtet fixierte Spalte & Kopf pixelgenau aus) */
html.zp-pretty.zp-zdl table.tabelle th{background:var(--zp-th,#f6f7fa) !important;background-image:none !important;color:var(--zp-muted,#6b7280) !important;border-color:var(--zp-grid,#e8eaf0) !important}
html.zp-pretty.zp-zdl table.tabelle td{border-color:transparent !important;background-color:var(--zp-td,#fff) !important}
html.zp-pretty.zp-zdl table.tabelle tbody tr[id^="tag-"] > td{box-shadow:inset 0 1px 0 var(--zp-grid,#e8eaf0)}
html.zp-pretty.zp-zdl table.tabelle tbody tr:hover > td{background-color:color-mix(in srgb,var(--zp-accent) 7%,var(--zp-td,#fff)) !important;filter:none !important}
html.zp-pretty.zp-zdl table.tabelle tbody td.td_sp{text-align:right}
html.zp-pretty.zp-zdl table.tabelle tbody td a{text-decoration:none !important}
html.zp-pretty.zp-zdl table.tabelle tbody .td_text1_isDate a,html.zp-pretty.zp-zdl table.tabelle tbody .td_text2_isDate a{color:var(--zp-text,#141822) !important;font-weight:600}
html.zp-pretty.zp-zdl table.tabelle tbody .zp-open a{position:relative;color:transparent !important}
html.zp-pretty.zp-zdl table.tabelle tbody .zp-open a::before{content:'läuft';position:absolute;inset:0;display:flex;align-items:center;justify-content:flex-start;color:var(--zp-ok);font-weight:700}
html.zp-pretty.zp-zdl table.tabelle tbody td.td_zeitdaten > a,html.zp-pretty.zp-zdl table.tabelle tbody td.td_zeitdaten > a *{color:var(--zp-muted,#6b7280) !important}
html.zp-pretty.zp-zdl table.tabelle tbody td.td_soll_pause_uz a{color:var(--zp-warn,#d97706) !important}
html.zp-pretty.zp-zdl table.tabelle tbody td.td_notiz a{color:var(--zp-text,#141822) !important}
html.zp-pretty.zp-zdl table.tabelle tbody tr[data-zp-tint] > td{background-color:var(--zp-tintl) !important}
html.zp-pretty.zp-dark.zp-zdl table.tabelle tbody tr[data-zp-tint] > td{background-color:var(--zp-tint) !important}
html.zp-pretty.zp-zdl table.tabelle tbody tr[data-zp-tint] > td:first-child{box-shadow:inset 3px 0 0 var(--zp-edge)}
html.zp-pretty.zp-zdl table.tabelle tbody tr[data-zp-tint] > td.td_datum{color:var(--zp-edge-txt) !important}
html.zp-pretty.zp-zdl table.tabelle tbody td[style*="color:red"],html.zp-pretty.zp-zdl table.tabelle tbody td[style*="color: red"]{color:var(--zp-bad,#dc2626) !important}
html.zp-dimfuture.zp-zdl table.tabelle tbody tr.zp-future > td,html.zp-dimfuture.zp-zdl table.tabelle tbody tr.zp-future > td a{color:color-mix(in srgb,var(--zp-muted,#6b7280) 80%,var(--zp-td,#fff)) !important}
html.zp-dimfuture.zp-zdl table.tabelle tbody tr.zp-future > td[style*="color:red"]{color:color-mix(in srgb,var(--zp-bad,#dc2626) 55%,var(--zp-td,#fff)) !important}
html.zp-dimfuture.zp-zdl table.tabelle tbody tr.zp-future img.fehlbuch{visibility:hidden !important}
html.zp-pretty.zp-todayhl.zp-zdl table.tabelle tbody tr.zp-today > td:first-child{box-shadow:inset 3px 0 0 var(--zp-accent) !important}
html.zp-pretty.zp-todayhl.zp-zdl table.tabelle tbody tr.zp-today > td.td_datum{color:var(--zp-accent) !important}

#zp-cp{display:flex;align-items:center;gap:8px;padding:8px 10px;margin-bottom:6px;font:12px system-ui,'Segoe UI',sans-serif;
  background:var(--zp-surf);border:1px solid var(--zp-line);border-radius:10px;color:var(--zp-text)}
#zp-cp b{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--zp-muted)}
#zp-cp button{padding:4px 12px;border-radius:8px;border:1px solid var(--zp-accent);background:var(--zp-accent);color:var(--zp-onacc,#fff);font:700 12px system-ui,sans-serif;cursor:pointer}
#zp-cp button:disabled{opacity:.5}
#zp-cp span{color:var(--zp-muted)}

html.zp-pretty.zp-zdl table.tabelle tbody td.td_zeitdaten a span.zp-gap-txt,html.zp-pretty.zp-zdl table.tabelle tbody td.td_zeitdaten span.zp-gap-txt{position:relative;color:transparent !important}
html.zp-pretty.zp-zdl table.tabelle tbody td.td_zeitdaten span.zp-gap-txt::before{content:'—';position:absolute;left:0;top:0;color:var(--zp-muted,#6b7280)}

/* Spalten-Menü (LHR „…“-Knopf): wird per JS erkannt (.zp-colbtn / .zp-colmenu), Funktion bleibt LHR */
img.zp-colbtn{width:38px !important;height:38px !important;border-radius:50% !important;cursor:pointer !important;transition:box-shadow .15s !important;transform:none !important}
html.zp-dark img.zp-colbtn{filter:invert(.9) hue-rotate(180deg) brightness(1.1) !important}
img.zp-colbtn:hover{box-shadow:0 0 0 2px var(--zp-accent) !important}
.zp-colmenu{z-index:2147480500 !important;min-width:260px !important;width:max-content !important;max-width:min(440px,92vw) !important;height:auto !important;max-height:min(78vh,680px) !important;overflow:auto !important;
  background:var(--zp-surf,#fff) !important;background-image:none !important;border:1px solid var(--zp-line,#e3e6ec) !important;border-radius:14px !important;box-shadow:0 18px 44px rgba(0,0,0,.4) !important;padding:8px !important;
  font:500 13px 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif !important;color:var(--zp-text,#141822) !important}
.zp-colmenu *{white-space:nowrap !important;max-width:none !important;text-overflow:clip !important;color:var(--zp-text,#141822) !important;font-family:inherit !important;font-size:13px !important}
.zp-colmenu table,.zp-colmenu thead,.zp-colmenu tbody,.zp-colmenu tr,.zp-colmenu td,.zp-colmenu th,.zp-colmenu ul,.zp-colmenu li,.zp-colmenu div{background-color:transparent !important;border-color:transparent !important;box-shadow:none !important;overflow:visible !important}
.zp-colmenu .zp-colhead,.zp-colmenu th{font-size:10.5px !important;font-weight:700 !important;letter-spacing:.07em;text-transform:uppercase;color:var(--zp-muted,#6b7280) !important}
.zp-colmenu li,.zp-colmenu tr,.zp-colmenu label{cursor:pointer}
.zp-colmenu li,.zp-colmenu td,.zp-colmenu th{padding:5px 8px !important}
.zp-colmenu li{border-radius:8px !important;list-style:none !important}
.zp-colmenu ul,.zp-colmenu ol{padding:0 !important;margin:0 !important}
.zp-colmenu table{border-collapse:separate !important;border-spacing:0 2px !important;width:100%}
.zp-colmenu tr > :first-child{border-radius:8px 0 0 8px !important}.zp-colmenu tr > :last-child{border-radius:0 8px 8px 0 !important}
.zp-colmenu li:hover,.zp-colmenu tbody tr:hover > *,.zp-colmenu label:hover{background-color:color-mix(in srgb,var(--zp-accent) 14%,transparent) !important}
.zp-colmenu tr.zp-fixedrow{opacity:.55 !important}
.zp-colmenu input[type=checkbox]:disabled{cursor:default}
.zp-colmenu input[type=checkbox]{accent-color:var(--zp-accent);width:16px !important;height:16px !important;margin:0 8px 0 0 !important;vertical-align:-3px;cursor:pointer}
html.zp-pretty #colMenue:empty{display:none !important}

/* Team: eigene Zeile + Favoriten */
/* Abwesenheitsübersicht (DataTables): fixierte Spalten immer im Theme, Hover ohne Überdeckung der farbigen Tage */
#tabdiv table.dataTable tbody tr:not(.zp-me):not(.zp-favrow) > td:not(.zp-me):not(.zp-fav){box-shadow:none !important}
html.zp-dark #tabdiv table.dataTable tbody td.dtfc-fixed-left,html.zp-dark #tabdiv table.dataTable tbody td.dtfc-fixed-left.sorting_1{background-color:var(--zp-td,var(--zp-surf)) !important;color:var(--zp-text) !important}
html.zp-dark #tabdiv table.dataTable thead th.dtfc-fixed-left{background-color:var(--zp-th,var(--zp-surf)) !important;color:var(--zp-muted) !important}
#tabdiv table.dataTable tbody tr:hover > td.dtfc-fixed-left{background-color:color-mix(in srgb,var(--zp-accent,#4f5bd5) 16%,var(--zp-td,#fff)) !important}
html.zp-dark body:not(#zp-a):not(#zp-b) #tabdiv table.dataTable tbody tr:hover > td.dtfc-fixed-left{background-color:color-mix(in srgb,var(--zp-accent) 18%,var(--zp-td,var(--zp-surf))) !important}
#mehrfacherfassung_submit.zp-mfe-err{box-shadow:0 0 0 2px var(--zp-bad,#e5484d) !important}
html.zp-p-other #content tr.zp-me > td{box-shadow:inset 0 2px 0 var(--zp-accent,#4f5bd5),inset 0 -2px 0 var(--zp-accent,#4f5bd5) !important}
html.zp-p-other #content tr.zp-me > td:first-child{box-shadow:inset 3px 0 0 var(--zp-accent,#4f5bd5),inset 0 2px 0 var(--zp-accent,#4f5bd5),inset 0 -2px 0 var(--zp-accent,#4f5bd5) !important}
html.zp-p-other #content tr.zp-me > td:not([data-zp-cf]):not([style*="background"]){color:var(--zp-accent,#4f5bd5) !important;background-color:color-mix(in srgb,var(--zp-accent,#4f5bd5) 12%,transparent) !important}
html.zp-p-other #content tr.zp-favrow > td{box-shadow:inset 0 1px 0 color-mix(in srgb,var(--zp-accent2,#0ea5e9) 70%,transparent),inset 0 -1px 0 color-mix(in srgb,var(--zp-accent2,#0ea5e9) 70%,transparent) !important}
html.zp-p-other #content tr.zp-favrow > td:first-child{box-shadow:inset 3px 0 0 var(--zp-accent2,#0ea5e9),inset 0 1px 0 color-mix(in srgb,var(--zp-accent2,#0ea5e9) 70%,transparent),inset 0 -1px 0 color-mix(in srgb,var(--zp-accent2,#0ea5e9) 70%,transparent) !important}
html.zp-p-other #content tr.zp-favrow > td:not([data-zp-cf]):not([style*="background"]){color:var(--zp-accent2,#0ea5e9) !important}
#tableautab2 td,#tableautab td{position:relative}
html.zp-pretty #tableautab2 td,html.zp-pretty #tableautab td{padding-right:24px !important}
.zp-star{position:absolute;right:5px;top:50%;transform:translateY(-50%);font-size:15px;line-height:1;cursor:pointer;opacity:0;color:var(--zp-muted,#888) !important;transition:opacity .12s,transform .12s;user-select:none;z-index:2}
td:hover > .zp-star{opacity:.85}
.zp-star:hover{transform:translateY(-50%) scale(1.25)}
td.zp-fav > .zp-star{opacity:1;color:#f5c542 !important}
html.zp-p-other #content td.zp-fav{box-shadow:inset 0 0 0 1.5px color-mix(in srgb,#f5c542 70%,transparent) !important}
html.zp-p-other #content td.zp-me{box-shadow:inset 0 0 0 2px var(--zp-accent,#4f5bd5) !important}
td.zp-flash{animation:zpflash 1.2s ease-out}
@keyframes zpflash{0%{box-shadow:inset 0 0 0 3px var(--zp-accent)}100%{box-shadow:inset 0 0 0 0 transparent}}
#zp-fav-host{display:block;margin:0 0 12px}
/* Planer: Kopfzeilen (Datum / KW / Arbeitstage, DnNr, Dienstnehmer) lesbar statt hellblau mit weißer Schrift */
html.zp-dark.zp-planer body:not(#zp-a):not(#zp-b) #content thead th,html.zp-dark.zp-planer body:not(#zp-a):not(#zp-b) #content thead td,html.zp-dark.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv th,html.zp-dark.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv th *{background-color:var(--zp-th,var(--zp-surf)) !important;background-image:none !important;color:var(--zp-text) !important;border-color:var(--zp-grid) !important;font-weight:600 !important}
html.zp-dark.zp-planer body:not(#zp-a):not(#zp-b) #content thead th *,html.zp-dark.zp-planer body:not(#zp-a):not(#zp-b) #content thead td *{color:inherit !important;background:transparent !important}
html.zp-planer #content thead th,html.zp-planer #content thead td{font-size:12px !important}
/* Planer: kein eigener Scrollbalken zwischen Kopf und Zeilen – Kopf läuft mit den Zeilen mit */
html.zp-planer #tabdiv .dataTables_scrollHead{overflow:hidden !important;scrollbar-width:none;margin-bottom:0 !important;border-bottom:0 !important}
html.zp-planer #tabdiv .dataTables_scrollHead::-webkit-scrollbar{display:none}
html.zp-planer #tabdiv .dataTables_scrollHead table{margin-bottom:0 !important}
html.zp-planer #tabdiv .dataTables_scrollBody{border-top:0 !important;margin-top:0 !important}
/* ───── Planer: Kachel-Raster (Abstände per Schatten → Kopf und Zeilen bleiben exakt untereinander) ───── */
html.zp-pretty.zp-planer #tabdiv{--pg:var(--zp-surf,#f6f7fa);background:var(--pg);border:1px solid var(--zp-line);border-radius:16px;padding:10px 10px 4px;margin-top:10px}
html.zp-pretty.zp-planer #tabdiv .dataTables_wrapper,html.zp-pretty.zp-planer #tabdiv .dataTables_scroll,html.zp-pretty.zp-planer #tabdiv .dataTables_scrollHead,html.zp-pretty.zp-planer #tabdiv .dataTables_scrollBody,html.zp-pretty.zp-planer #tabdiv .dtfc-scrolling-left,html.zp-pretty.zp-planer #tabdiv table{background:transparent !important;border:0 !important}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv thead th,html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv thead td{background:var(--pg) !important;background-image:none !important;border:0 !important;box-shadow:none !important;color:var(--zp-muted) !important;font:600 11px/1.3 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif !important;padding:4px 2px !important;text-align:center}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv thead tr:first-child th{color:var(--zp-text) !important;font-size:12px !important}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody td{border:0 !important;box-shadow:inset 0 0 0 2px var(--pg) !important;border-radius:0 !important;height:32px;padding:0 2px !important;font:700 11px/1 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif !important;text-align:center;vertical-align:middle;position:relative;white-space:nowrap;overflow:visible !important;text-overflow:clip !important;letter-spacing:-.01em}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody td:not([style*="background"]):not(.dtfc-fixed-left),html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody td[style*="rgba(0, 0, 0, 0)"]:not(.dtfc-fixed-left){background-color:var(--zp-surf2,#eceef3) !important}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody td > div{background:transparent !important;border:0 !important}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody td.dtfc-fixed-left{background-color:var(--pg) !important;box-shadow:none !important;text-align:left !important;font:600 13px/32px 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif !important;padding:0 10px !important;white-space:nowrap;color:var(--zp-text) !important}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody td.dtfc-fixed-left:first-child{color:var(--zp-muted) !important;font-weight:500 !important}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody tr:hover > td.dtfc-fixed-left{background-color:color-mix(in srgb,var(--zp-accent) 12%,var(--pg)) !important}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody tr.zp-me > td.dtfc-fixed-left{color:var(--zp-accent) !important}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody tr.zp-me > td.dtfc-fixed-left:first-child,html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody tr.zp-favrow > td.dtfc-fixed-left:first-child{box-shadow:inset 3px 0 0 var(--zp-accent) !important}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody tr.zp-favrow > td.dtfc-fixed-left:first-child{box-shadow:inset 3px 0 0 #f5c542 !important}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody tr.zp-me > td:not(.dtfc-fixed-left),html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody tr.zp-favrow > td:not(.dtfc-fixed-left){outline:0 !important}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody tr.dtrg-group td,html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody tr.dtrg-start td{background:var(--pg) !important;box-shadow:none !important;color:var(--zp-accent) !important;font:700 12px/1 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif !important;letter-spacing:.04em;text-transform:uppercase;text-align:left !important;padding:16px 10px 6px !important;height:auto}
/* Remote nur türkiser Rahmen, Remote + Bereitschaft halb rot / halb türkis */
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody td.zp-rem{background:color-mix(in srgb,var(--zp-rem,#2dd4bf) 8%,var(--pg)) !important;color:var(--zp-rem,#2dd4bf) !important;box-shadow:inset 0 0 0 3px var(--pg),inset 0 0 0 4.5px var(--zp-rem,#2dd4bf) !important}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody td.zp-rem *{color:var(--zp-rem,#2dd4bf) !important}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody td.zp-rb{background:var(--pg) !important;color:var(--zp-text) !important;box-shadow:inset 0 0 0 3px var(--pg) !important}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody td.zp-rb *{color:var(--zp-text) !important}
html.zp-pretty.zp-planer #tabdiv tbody td.zp-rb{isolation:isolate}
html.zp-pretty.zp-planer #tabdiv tbody td.zp-rb::after{content:'';position:absolute;inset:3px;z-index:-1;border:1.5px solid transparent;border-radius:2px;background:linear-gradient(var(--pg),var(--pg)) padding-box,linear-gradient(90deg,var(--zp-bad) 0%,var(--zp-bad) 12%,var(--zp-rem,#2dd4bf) 88%,var(--zp-rem,#2dd4bf) 100%) border-box;pointer-events:none}
html.zp-pretty.zp-planer #tabdiv tbody td:not(.dtfc-fixed-left):hover{filter:brightness(1.12)}
/* Farben gedämpft: Fläche leicht getönt, kräftiger Strich oben, Schrift in der Farbe → ruhig, aber eindeutig */
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody td.zp-col{background:color-mix(in srgb,var(--zc) 38%,var(--zp-surf2,#eceef3)) !important;box-shadow:inset 0 0 0 2px var(--pg),inset 0 5px 0 0 var(--zc) !important;color:color-mix(in srgb,var(--zc) 35%,#fff) !important}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody td:not(.dtfc-fixed-left) *{color:inherit !important;background:transparent !important;border-color:transparent !important;box-shadow:none !important;outline:0 !important}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody td:not(.zp-col):not(.zp-rem):not(.zp-rb):not(.dtfc-fixed-left):not([colspan]),html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody td:not(.zp-col):not(.zp-rem):not(.zp-rb):not(.dtfc-fixed-left):not([colspan]) *{color:var(--zp-muted) !important}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody td:not(.zp-col):not(.zp-rem):not(.zp-rb):not(.dtfc-fixed-left)[style*="background-color"]:not([style*="rgba(0, 0, 0, 0)"]){background:color-mix(in srgb,var(--zp-surf2) 55%,var(--pg)) !important}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody td.zp-rem,html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody td.zp-rem *{font-size:12px !important;font-weight:800 !important}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody td.zp-rem > *,html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody td.zp-rb > *{background:transparent !important}
/* Kopf kompakt */
html.zp-planer #tabdiv thead tr.zp-hidehead{display:none !important}
/* Datum bleibt beim Scrollen über den Zeilen stehen */
html.zp-planer #tabdiv .dataTables_scrollHead{position:sticky !important;top:var(--zp-sh,0px);z-index:6;background:var(--zp-surf,#f6f7fa)}
html.zp-planer #tabdiv .dataTables_scrollHead thead th.dtfc-fixed-left{z-index:7}
html.zp-planer:not(.zp-n1):not(.zp-n2):not(.zp-n3) body:not(#zp-a):not(#zp-b) #tabdiv .dataTables_scrollBody > table > thead > tr > th,html.zp-planer:not(.zp-n1):not(.zp-n2):not(.zp-n3) body:not(#zp-a):not(#zp-b) #tabdiv .dataTables_scrollBody > table > thead > tr > td{padding-top:0 !important;padding-bottom:0 !important;height:0 !important;max-height:0 !important;line-height:0 !important;border-top:0 !important;border-bottom:0 !important;box-shadow:none !important;position:static !important;overflow:hidden !important}
html.zp-planer #tabdiv .dataTables_scrollBody > table > thead .dataTables_sizing{height:0 !important;overflow:hidden !important}
html.zp-planer #tabdiv thead th .grid-vertical-item-img,html.zp-planer #tabdiv thead th .kw-zeile,html.zp-planer #tabdiv thead th .kw-arbeitstage{display:none !important}
html.zp-pretty.zp-planer #tabdiv thead th [class*="grid-vertical"]{background:transparent !important;border:0 !important;color:inherit !important}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv thead th.dtfc-fixed-left{text-align:left !important;vertical-align:bottom;padding:6px 10px !important;color:var(--zp-muted) !important;font-size:11px !important;text-transform:uppercase;letter-spacing:.05em}
html.zp-pretty.zp-planer #tabdiv thead th .zp-kw0{display:block;height:15px}
html.zp-pretty.zp-planer #tabdiv thead th .zp-kw{display:inline-block;margin-top:3px;white-space:nowrap;padding:1px 4px !important;font-size:9px !important}
html.zp-pretty.zp-planer #tabdiv thead th{white-space:nowrap}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv thead th.zp-hol b,html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv thead th.zp-hol .zp-wd{color:var(--zp-warn) !important;opacity:1}
html.zp-pretty.zp-planer #tabdiv thead th .zp-wd{display:block;font-size:10px;font-weight:600;color:var(--zp-muted);text-transform:none}
html.zp-pretty.zp-planer #tabdiv thead th b{display:block;font-size:12px;color:var(--zp-text)}
html.zp-pretty.zp-planer #tabdiv thead th .zp-kw{display:inline-block;margin-top:3px;padding:1px 5px;border-radius:99px;font-size:9.5px;font-weight:700;background:color-mix(in srgb,var(--zp-accent) 18%,transparent);color:var(--zp-accent)}
html.zp-pretty.zp-planer #tabdiv thead th.zp-we b,html.zp-pretty.zp-planer #tabdiv thead th.zp-we .zp-wd{opacity:.5}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv thead th.zp-today{box-shadow:inset 0 -3px 0 var(--zp-accent) !important}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv thead th.zp-today b{color:var(--zp-accent) !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #periode:not(.zp-hide-orig){display:flex !important;align-items:center;gap:8px;background:transparent !important;border:0 !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #periode .periode_span{display:flex;align-items:center;background:transparent !important;border:0 !important;margin:0 !important;padding:0 !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #periode .planer-btn{width:38px !important;height:38px !important;min-width:0 !important;border-radius:12px !important;border:1px solid var(--zp-line,#d0d4dc) !important;background:var(--zp-surf2,#eceef3) !important;background-image:none !important;display:grid !important;place-items:center;cursor:pointer;padding:0 !important;margin:0 !important;box-shadow:none !important;transition:background .15s,border-color .15s,transform .1s}
html.zp-planer body:not(#zp-a):not(#zp-b) #periode .planer-btn:hover{background:color-mix(in srgb,var(--zp-accent,#4f7cff) 16%,var(--zp-surf2,#eceef3)) !important;border-color:var(--zp-accent,#4f7cff) !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #periode .planer-btn:active{transform:scale(.94)}
html.zp-planer body:not(#zp-a):not(#zp-b) #periode .planer-btn img{display:none !important}
html.zp-planer #periode .planer-btn::before{content:'';width:8px;height:8px;border:solid var(--zp-text,#222);border-width:0 0 2.5px 2.5px;border-radius:1px;transform:translateX(2px) rotate(45deg)}
html.zp-planer #periode #periode_a2::before{transform:translateX(-2px) rotate(-135deg)}
html.zp-planer body:not(#zp-a):not(#zp-b) #le_periode_text{text-align:center;font:700 15px/38px 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif !important;color:var(--zp-text) !important;background:transparent !important;border:0 !important}
html.zp-planer #tabdiv{box-sizing:border-box;max-width:100%;overflow-x:clip}
html.zp-planer #tabdiv .dataTables_wrapper,html.zp-planer #tabdiv .dataTables_scroll{max-width:100% !important}
html.zp-planer #tabdiv .dataTables_scrollBody,html.zp-planer #tabdiv .dataTables_scrollFoot{max-width:100% !important}
html.zp-planer #tabdiv .dataTables_scrollBody::-webkit-scrollbar,html.zp-planer #tabdiv .dataTables_scrollFoot::-webkit-scrollbar{height:12px}
html.zp-planer #tabdiv .dataTables_scrollBody::-webkit-scrollbar-thumb,html.zp-planer #tabdiv .dataTables_scrollFoot::-webkit-scrollbar-thumb{background:color-mix(in srgb,var(--zp-muted,#888) 55%,transparent);border-radius:99px;border:3px solid transparent;background-clip:padding-box}
html.zp-planer #tabdiv .dataTables_scrollBody::-webkit-scrollbar-thumb:hover,html.zp-planer #tabdiv .dataTables_scrollFoot::-webkit-scrollbar-thumb:hover{background-color:var(--zp-accent,#4f7cff)}
html.zp-planer #tabdiv .zp-hidesum{display:none !important}
html.zp-planer #tabdiv .dataTables_scrollBody{overscroll-behavior-x:contain;scroll-behavior:auto !important;-webkit-overflow-scrolling:touch}
html.zp-planer #tabdiv tbody td:not(.dtfc-fixed-left){left:auto !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody tr.sum_row > td.sum_cell.dtfc-fixed-left:not(.gesamt_div){position:relative !important;left:auto !important;z-index:auto !important}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody tr.sum_row > td{background:var(--pg) !important;box-shadow:inset 0 2px 0 var(--zp-line,#d0d4dc) !important;height:auto !important;padding:7px 2px 6px !important;vertical-align:middle;color:var(--zp-text) !important;text-align:center;font:600 11px/1.2 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif !important}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody tr.sum_row > td *{background:transparent !important;border:0 !important;box-shadow:none !important;padding:0 !important;margin:0 !important;height:auto !important;width:auto !important;float:none !important}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody tr.sum_row > td .sum_div_bt{display:block;font-size:12.5px !important;font-weight:800 !important;color:var(--zp-text) !important}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody tr.sum_row > td .sum_div{display:block;font-size:10px !important;font-weight:600 !important;color:var(--zp-muted) !important}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody tr.sum_row > td.sum_cell{display:table-cell}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody tr.sum_row > td.sum_cell:not(.dtfc-fixed-left),html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody tr.sum_row > td.sum_cell.dtfc-fixed-left:not(.gesamt_div){position:relative}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody tr.sum_row > td.gesamt_div_verplant{text-align:left !important;padding-left:10px !important;color:var(--zp-accent) !important;font-weight:700 !important;font-size:12px !important;text-transform:uppercase;letter-spacing:.04em}
html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody tr.sum_row > td.gesamt_div{text-align:right !important;padding-right:10px !important}
html.zp-planer.zp-pnav body:not(#zp-a):not(#zp-b) #general-controls{display:none !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #zp-pnav{position:relative !important;display:flex !important;align-items:center !important;gap:6px !important;margin:0 !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #zp-pnav button{all:unset;box-sizing:border-box !important;cursor:pointer !important;height:38px !important;display:inline-flex !important;align-items:center !important;justify-content:center !important;gap:6px !important;border-radius:11px !important;border:1px solid var(--zp-line,#d0d4dc) !important;background:var(--zp-surf2,#eceef3) !important;color:var(--zp-text,#222) !important;font:700 13.5px 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif !important;transition:background .15s,border-color .15s,transform .1s !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #zp-pnav button:hover{border-color:var(--zp-accent,#4f7cff) !important;background:color-mix(in srgb,var(--zp-accent,#4f7cff) 14%,var(--zp-surf2,#eceef3)) !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #zp-pnav button:active{transform:scale(.96) !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #zp-pnav .zp-pn-b{width:38px !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #zp-pnav .zp-pn-l{min-width:150px !important;padding:0 12px !important;font-size:14px !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #zp-pnav .zp-pn-l svg{opacity:.6 !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #zp-pnav .zp-pn-t{padding:0 12px !important;font-size:12.5px !important;color:var(--zp-muted,#667) !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #zp-pnav .zp-pn-t.on{color:var(--zp-accent,#4f7cff) !important;border-color:color-mix(in srgb,var(--zp-accent,#4f7cff) 45%,transparent) !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #zp-pnav.busy .zp-pn-l{opacity:.6 !important;pointer-events:none !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #zp-pnav .zp-pn-pop{position:absolute !important;top:calc(100% + 8px) !important;left:44px !important;z-index:2147480000 !important;width:248px !important;padding:10px !important;border-radius:14px !important;background:var(--zp-bg,#fff) !important;border:1px solid var(--zp-line,#d0d4dc) !important;box-shadow:0 14px 40px rgba(0,0,0,.35) !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #zp-pnav .zp-pn-yh{display:flex !important;align-items:center !important;justify-content:space-between !important;margin-bottom:8px !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #zp-pnav .zp-pn-yh b{font:700 14px 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif !important;color:var(--zp-text) !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #zp-pnav .zp-pn-yh button{width:32px !important;height:32px !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #zp-pnav .zp-pn-grid{display:grid !important;grid-template-columns:repeat(4,1fr) !important;gap:6px !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #zp-pnav .zp-pn-grid button{height:34px !important;font-size:12.5px !important;font-weight:600 !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #zp-pnav .zp-pn-grid button.now{border-color:var(--zp-accent,#4f7cff) !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #zp-pnav .zp-pn-grid button.sel{background:var(--zp-accent,#4f7cff) !important;border-color:var(--zp-accent,#4f7cff) !important;color:#fff !important}
html.zp-planer #tabdiv tbody td.zp-tcol::before{content:'';position:absolute;inset:0 -1px;border-left:1.5px solid color-mix(in srgb,var(--zp-accent,#4f7cff) 70%,transparent);border-right:1.5px solid color-mix(in srgb,var(--zp-accent,#4f7cff) 70%,transparent);background:color-mix(in srgb,var(--zp-accent,#4f7cff) 9%,transparent);pointer-events:none;z-index:1}
html.zp-planer #tabdiv tbody td.zp-tcol.zp-tlast::before{border-bottom:1.5px solid color-mix(in srgb,var(--zp-accent,#4f7cff) 70%,transparent);border-radius:0 0 8px 8px}
html.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv thead th.zp-tcol{position:relative;background:color-mix(in srgb,var(--zp-accent,#4f7cff) 12%,var(--pg,var(--zp-surf))) !important;border-radius:10px 10px 0 0;box-shadow:inset 1.5px 0 0 color-mix(in srgb,var(--zp-accent,#4f7cff) 70%,transparent),inset -1.5px 0 0 color-mix(in srgb,var(--zp-accent,#4f7cff) 70%,transparent),inset 0 1.5px 0 color-mix(in srgb,var(--zp-accent,#4f7cff) 70%,transparent) !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody tr.sum_row > td.zp-tcol,html.zp-pretty.zp-planer body:not(#zp-a):not(#zp-b) #tabdiv tbody td.zp-tcol{position:relative}
html.zp-abwp #tabdiv tbody td.zp-tcol{position:relative}
html.zp-abwp #tabdiv tbody td.zp-tcol::before{content:'';position:absolute;inset:-1.5px -2px;border-left:1.5px solid color-mix(in srgb,var(--zp-accent,#4f7cff) 70%,transparent);border-right:1.5px solid color-mix(in srgb,var(--zp-accent,#4f7cff) 70%,transparent);background:color-mix(in srgb,var(--zp-accent,#4f7cff) 8%,transparent);pointer-events:none;z-index:1}
html.zp-abwp #tabdiv tbody td.zp-tcol.zp-tlast::before{border-bottom:1.5px solid color-mix(in srgb,var(--zp-accent,#4f7cff) 70%,transparent);border-radius:0 0 8px 8px}
html.zp-abwp #tabdiv tbody tr:first-child td.zp-tcol::before{top:0}
html.zp-abwp body:not(#zp-a):not(#zp-b) #tabdiv .dataTables_scrollBody thead th,html.zp-abwp body:not(#zp-a):not(#zp-b) #tabdiv .dataTables_scrollBody thead td{box-shadow:none !important;background:transparent !important;border:0 !important;padding-top:0 !important;padding-bottom:0 !important;height:0 !important;line-height:0 !important}
html.zp-abwp body:not(#zp-a):not(#zp-b) #tabdiv .dataTables_scrollHead thead th.zp-tcol, html.zp-abwp body:not(#zp-a):not(#zp-b) #tabdiv > table thead th.zp-tcol{color:var(--zp-accent,#4f7cff) !important;background:color-mix(in srgb,var(--zp-accent,#4f7cff) 12%,var(--zp-surf,#f6f7fa)) !important;border-radius:8px 8px 0 0 !important;box-shadow:inset 1.5px 0 0 color-mix(in srgb,var(--zp-accent,#4f7cff) 70%,transparent),inset -1.5px 0 0 color-mix(in srgb,var(--zp-accent,#4f7cff) 70%,transparent),inset 0 1.5px 0 color-mix(in srgb,var(--zp-accent,#4f7cff) 70%,transparent) !important}
html.zp-pretty.zp-abwp body:not(#zp-a):not(#zp-b) #tabdiv table.dataTable tbody td.zp-acol{background:var(--zc) !important;background-image:none !important;color:#fff !important;box-shadow:none !important}
html.zp-pretty.zp-abwp body:not(#zp-a):not(#zp-b) #tabdiv table.dataTable tbody td.zp-acol *{background:transparent !important;color:#fff !important}
#zp-ptip{position:fixed;z-index:2147483000;pointer-events:none;max-width:230px;padding:7px 10px 6px;border-radius:10px;background:color-mix(in srgb,var(--zp-bg,#fff) 92%,transparent);backdrop-filter:blur(10px);color:var(--zp-text,#222);border:1px solid var(--zp-line,#d0d4dc);box-shadow:0 8px 24px rgba(0,0,0,.28);font:500 11.5px/1.35 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif;opacity:0;transform:translateY(3px);transition:opacity .1s,transform .1s}
#zp-ptip.on{opacity:1;transform:none}
#zp-ptip .t{display:flex;flex-wrap:wrap;gap:4px 10px;font-weight:700;font-size:12px}
#zp-ptip .t span,#zp-ptip .r{display:flex;align-items:center;gap:6px}
#zp-ptip i{width:8px;height:8px;border-radius:2px;flex:none;display:inline-block}
#zp-ptip .h{font-weight:700;font-size:12px;margin-bottom:3px}
#zp-ptip .r b{margin-left:auto;padding-left:14px;font-weight:700}
#zp-ptip .x{margin-top:3px;color:var(--zp-text,#222);opacity:.85}
#zp-ptip .d{margin-top:3px;color:var(--zp-muted,#667);font-size:10.5px}
html.zp-planer .tippy-box{background:var(--zp-bg,#fff) !important;color:var(--zp-text,#222) !important;border:1px solid var(--zp-line,#d0d4dc) !important;border-radius:10px !important;box-shadow:0 8px 24px rgba(0,0,0,.28) !important;font:500 11.5px/1.35 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif !important;max-width:230px !important}
html.zp-planer .tippy-box *{background:transparent !important;color:inherit !important;font-size:inherit !important;border-color:var(--zp-line,#d0d4dc) !important}
html.zp-planer .tippy-content{padding:6px 10px !important}
html.zp-planer .tippy-arrow{color:var(--zp-bg,#fff) !important}
html.zp-planer #tabdiv thead th .zp-cnt{display:block;margin:4px auto 0;width:max-content;min-width:18px;padding:1px 5px;border-radius:6px;font-size:9.5px;font-weight:700;line-height:14px;color:var(--zp-muted);background:transparent;opacity:.55}
html.zp-planer #tabdiv thead th .zp-cnt[data-l="1"]{opacity:1;color:var(--zp-text);background:color-mix(in srgb,var(--zp-text) 10%,transparent)}
html.zp-planer #tabdiv thead th .zp-cnt[data-l="2"]{opacity:1;color:#1a1306;background:#f5b942}
html.zp-planer #tabdiv thead th .zp-cnt[data-l="3"]{opacity:1;color:#fff;background:var(--zp-bad,#e5484d)}
html.zp-planer #tabdiv thead th[data-zp-stat]{cursor:default}
html.zp-planer body:not(#zp-a):not(#zp-b) #tabdivup .grid-container{display:flex !important;flex-wrap:wrap;align-items:center;gap:10px 12px;padding:10px 12px;margin:6px 0 4px;background:var(--zp-surf,#f6f7fa) !important;border:1px solid var(--zp-line,#d0d4dc);border-radius:16px}
html.zp-planer body:not(#zp-a):not(#zp-b) #tabdivup .grid-container > div{display:flex;align-items:center;gap:8px;margin:0 !important;padding:0 !important;float:none !important;min-height:0}
html.zp-planer body:not(#zp-a):not(#zp-b) #tabdivup .grid-container > div.hidden{display:none !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #tabdivup .grid-container > .grid-item-right:not(.hidden){margin-left:auto !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #tabdivup .grid-container > .grid-item-right:not(.hidden) ~ .grid-item-right{margin-left:0 !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #tabdivup .grid-container > div:has(> p.hidden:only-child),html.zp-planer body:not(#zp-a):not(#zp-b) #tabdivup .grid-container > div:has(> p#buttons > input[style*="display:none"]:only-child),html.zp-planer body:not(#zp-a):not(#zp-b) #tabdivup .grid-container > div:has(> #error_urlaubmaxdate_div + p.hidden + p.hidden){display:none !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #tabdivup .grid-container b{font:600 12px 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif !important;color:var(--zp-muted) !important;text-transform:uppercase;letter-spacing:.04em}
html.zp-planer body:not(#zp-a):not(#zp-b) #tabdivup .grid-container select{height:38px !important;border-radius:10px !important;padding:0 30px 0 12px !important;margin:0 !important;font:600 13px 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #vBis-container p{margin:0 !important;padding:5px 10px !important;border-radius:99px;background:var(--zp-surf2,#eceef3) !important;color:var(--zp-muted) !important;font:600 11px/1.2 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif !important;white-space:nowrap;text-align:center}
html.zp-planer body:not(#zp-a):not(#zp-b) #periode .periode_span:has(#le_periode_text){position:relative;height:38px;min-width:92px;justify-content:center}
html.zp-planer body:not(#zp-a):not(#zp-b) #periode #le_periode_text{top:0 !important;left:0 !important;right:0 !important;bottom:0 !important;margin:0 !important;height:38px;line-height:38px !important;pointer-events:none}
html.zp-planer body:not(#zp-a):not(#zp-b) #periode #select_datum{height:38px !important;min-width:92px;width:92px !important;cursor:pointer;margin:0 !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #colHide{width:38px !important;height:38px !important;border-radius:12px !important;border:1px solid var(--zp-line,#d0d4dc) !important;background:var(--zp-surf2,#eceef3) !important;display:grid !important;place-items:center;cursor:pointer;position:relative;box-sizing:border-box}
html.zp-planer body:not(#zp-a):not(#zp-b) #colHide:hover{border-color:var(--zp-accent,#4f7cff) !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #colHide > img{width:22px !important;height:22px !important;border-radius:50%;opacity:.85;background:transparent !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #behebenBtn{height:38px !important;padding:0 16px !important;border-radius:12px !important;border:0 !important;background:var(--zp-accent,#4f7cff) !important;color:#fff !important;font:700 13px 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif !important;cursor:pointer;margin:0 !important;box-shadow:none !important}
html.zp-planer body:not(#zp-a):not(#zp-b) #behebenBtn:hover{filter:brightness(1.08)}
html.zp-planer #tabdivup .grid-container p#buttons{margin:0 !important}
#zp-team-host{display:block;max-width:1240px;margin:0 auto 16px}
#zp-host.wide ~ #zp-team-host{max-width:none}
#zp-abw-bar{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin:10px 0 12px;font:13px/1.2 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif;color:var(--zp-text)}
#zp-abw-bar .t{display:inline-flex;align-items:center;gap:6px;font-weight:700;color:var(--zp-muted);margin-right:2px}
html body #zp-abw-bar button{height:32px;padding:0 13px;border-radius:10px !important;border:1px solid var(--zp-line) !important;background:var(--zp-surf) !important;background-image:none !important;color:var(--zp-text) !important;font:600 13px/1 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif !important;cursor:pointer;margin:0 !important}
html body #zp-abw-bar button.on{background:var(--zp-accent) !important;border-color:var(--zp-accent) !important;color:var(--zp-onacc,#fff) !important}
#zp-abw-bar button:disabled{opacity:.5;cursor:not-allowed}
#zp-abw-bar .h{color:var(--zp-muted);font-size:12px;margin-left:6px}
html.zp-abwp.zp-abw-only #tabdiv{display:none !important}
/* Abwesenheitsübersicht: Raster wie „Ich + Favoriten“ */
html.zp-pretty.zp-abwp #tabdiv table.dataTable{border-collapse:separate !important;border-spacing:3px !important;background:transparent !important}
html.zp-pretty.zp-abwp #tabdiv table.dataTable thead th{background:var(--zp-surf) !important;border:0 !important;color:var(--zp-muted) !important;font:600 11px/1.2 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif !important;text-align:center;padding:6px 2px !important}
html.zp-pretty.zp-abwp #tabdiv table.dataTable tbody td{border:0 !important;border-radius:6px !important;height:28px;padding:0 !important;font:700 11px/28px 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif !important;text-align:center}
html.zp-pretty.zp-abwp #tabdiv table.dataTable tbody td > div{border-radius:6px;background-color:transparent !important;height:100%;line-height:28px}
html.zp-pretty.zp-abwp body:not(#zp-a):not(#zp-b) #tabdiv table.dataTable tbody td.zp-aempty{background-color:var(--zp-surf2,#eceef3) !important;background-image:none !important}
html.zp-pretty.zp-abwp body:not(#zp-a):not(#zp-b) #tabdiv table.dataTable tbody td.kalTag_sa,html.zp-pretty.zp-abwp body:not(#zp-a):not(#zp-b) #tabdiv table.dataTable tbody td.kalTag_so_fe{background:repeating-linear-gradient(135deg,color-mix(in srgb,var(--zp-muted) 18%,transparent) 0 2px,transparent 2px 6px) !important}
html.zp-pretty.zp-abwp body:not(#zp-a):not(#zp-b) #tabdiv table.dataTable tbody td.zp-rem{background:transparent !important;box-shadow:inset 0 0 0 1.5px var(--zp-rem,#2dd4bf) !important;color:var(--zp-rem,#2dd4bf) !important}
html.zp-pretty.zp-abwp body:not(#zp-a):not(#zp-b) #tabdiv table.dataTable tbody td.zp-rem *{color:var(--zp-rem,#2dd4bf) !important;background:transparent !important}
html.zp-pretty.zp-abwp #tabdiv table.dataTable tbody td.dtfc-fixed-left{background-color:var(--zp-surf,#f6f7fa) !important;text-align:left !important;font:600 13px/28px 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif !important;padding:0 10px !important;white-space:nowrap}
html.zp-pretty.zp-abwp #tabdiv table.dataTable tbody td.dtfc-fixed-left:first-child{color:var(--zp-muted) !important;font-weight:500 !important}
html.zp-pretty.zp-abwp #tabdiv table.dataTable tbody tr.zp-me td.dtfc-fixed-left{color:var(--zp-accent) !important}
html.zp-pretty.zp-abwp body:not(#zp-a):not(#zp-b) #tabdiv tbody tr.zp-me > td:not(.dtfc-fixed-left):not(.zp-rem),html.zp-pretty.zp-abwp body:not(#zp-a):not(#zp-b) #tabdiv tbody tr.zp-favrow > td:not(.dtfc-fixed-left):not(.zp-rem){box-shadow:none !important}
html.zp-pretty.zp-abwp body:not(#zp-a):not(#zp-b) #tabdiv tbody tr.zp-me > td.dtfc-fixed-left{box-shadow:inset 0 0 0 1.5px var(--zp-accent) !important;background-color:color-mix(in srgb,var(--zp-accent) 12%,var(--zp-surf,#f6f7fa)) !important}
html.zp-pretty.zp-abwp body:not(#zp-a):not(#zp-b) #tabdiv tbody tr.zp-favrow > td.dtfc-fixed-left{box-shadow:inset 0 0 0 1px color-mix(in srgb,#f5c542 60%,transparent) !important}
html.zp-pretty.zp-abwp #tabdiv table.dataTable tbody tr:hover > td.dtfc-fixed-left{background-color:color-mix(in srgb,var(--zp-accent) 14%,var(--zp-surf,#f6f7fa)) !important}
html.zp-pretty.zp-abwp #tabdiv .dataTables_wrapper{background:var(--zp-surf);border:1px solid var(--zp-line);border-radius:16px;padding:10px}
html.zp-pretty.zp-abwp #tabdiv .dataTables_scrollHead,html.zp-pretty.zp-abwp #tabdiv .dataTables_scrollBody{border:0 !important;background:transparent !important}
#zp-abw-fav{display:block;margin:0 0 14px}
#tabdiv td.dtfc-fixed-left:has(> .zp-star){padding-right:24px !important}
#tabdiv tr:hover td > .zp-star{opacity:.85}
#tabdiv td.zp-fav > .zp-star{opacity:1;color:#f5c542 !important}

/* Bereitschaft in der Original-Tabelle (nur Farben) */
html.zp-zdl table.tabelle tbody tr.zp-br > td{background-color:color-mix(in srgb,var(--zp-bad,#dc2626) 16%,var(--zp-td,#fff)) !important}
html.zp-zdl table.tabelle tbody tr.zp-br > td.td_zm{color:var(--zp-bad,#dc2626) !important;font-weight:700}
html.zp-zdl table.tabelle tbody tr.zp-br > td:first-child{box-shadow:inset 3px 0 0 var(--zp-bad,#dc2626) !important}

/* In der Zeit+ Liste gibt es „Spalten“ – den LHR-„…“-Knopf dann ausblenden */
html.zp-hidetable img.zp-colbtn,html.zp-hidetable #colHide{display:none !important}

/* leere LHR-Reste unter der App-Leiste */
html.zp-shell body > .zp-gap{display:none !important}
html.zp-shell body > p{margin:0 !important}
`;

    /* ════════════════════ CSS: OBERFLÄCHE (im Shadow DOM, isoliert) ════════════════════ */
    const UI_CSS = `
:host(.shell) .zp-brand .zp-logo,:host(.shell) .zp-name,:host(.shell) #zp-theme,:host(.shell) #zp-gear{display:none !important}
:host(.paused) *,:host(.paused) *::before,:host(.paused) *::after{animation-play-state:paused !important}
:host{all:initial;display:block;color-scheme:var(--zp-scheme,dark);--zp-soft:color-mix(in srgb,var(--zp-accent) 12%,transparent)}
*,*::before,*::after{box-sizing:border-box}
.zp-font,button,input,select{font-family:'Segoe UI Variable Text','Segoe UI Variable','Segoe UI',system-ui,-apple-system,Roboto,sans-serif}
.zp-font{font-size:13px;line-height:1.4;color:var(--zp-text);-webkit-font-smoothing:antialiased}
.num{font-variant-numeric:tabular-nums;font-feature-settings:'tnum' 1}
button{font-size:13px;color:inherit;cursor:pointer;background:none;border:0;margin:0;padding:0;line-height:1.2}
input,select{font-size:13px;margin:0}
.ic{display:block;flex:none}
.hidden{display:none !important}

/* ───── Dashboard ───── */
#zp{zoom:var(--zp-zoom,1);background:var(--zp-bg);border:1px solid var(--zp-line);border-radius:calc(var(--zp-r) + 4px);box-shadow:var(--zp-shadow);
  padding:14px;position:relative;overflow:hidden;isolation:isolate;user-select:none}
#zp > :not(#zp-fx){position:relative;z-index:1}
#zp-fx{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:.7}
#zp-fx,#zp-fxp{overflow:hidden;contain:strict}
#zp-fx .p,#zp-fxp .p{position:absolute;top:0;display:block;will-change:transform;animation:zpfall var(--d) linear var(--dl) infinite}
#zp-fx .p.fix,#zp-fxp .p.fix{animation:none;will-change:auto}
#zp-fx .p > b,#zp-fxp .p > b{display:block;animation:zpsway var(--sd) ease-in-out var(--sdl) infinite alternate}
#zp-fx u,#zp-fxp u{display:block;text-decoration:none}
#zp-fx u.lf,#zp-fxp u.lf{border-radius:50%;opacity:.7;animation:zprot var(--rd) linear var(--rdl) infinite}
#zp-fx u.dt,#zp-fxp u.dt{border-radius:50%}
#zp-fx u.bb,#zp-fxp u.bb{border-radius:50%;border:1px solid;box-sizing:border-box}
#zp-fx u.sn,#zp-fxp u.sn{border-radius:50%;animation:zppulse var(--pd) ease-in-out var(--pdl) infinite alternate}
#zp-fx u.st,#zp-fxp u.st{border-radius:50%;animation:zptw var(--td) ease-in-out var(--tdl) infinite alternate}
#zp-fx u.mc,#zp-fxp u.mc{background:center/contain no-repeat;opacity:.92;animation:zpwob var(--wd) ease-in-out var(--wdl) infinite alternate}
#zp-fx .shoot,#zp-fxp .shoot{position:absolute;left:70%;top:12%;width:60px;height:1.5px;border-radius:2px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.85));transform-origin:right center;opacity:0;animation:zpshoot 8s linear 3s infinite}
@keyframes zpfall{from{transform:translate3d(0,-14px,0)}to{transform:translate3d(0,var(--fh,100vh),0)}}
@keyframes zpsway{from{transform:translate3d(calc(var(--a) * -1),0,0)}to{transform:translate3d(var(--a),0,0)}}
@keyframes zprot{to{transform:rotate(360deg)}}
@keyframes zppulse{from{opacity:.35}to{opacity:.8}}
@keyframes zptw{from{opacity:.3}to{opacity:.9}}
@keyframes zpwob{from{transform:rotate(-16deg)}to{transform:rotate(16deg)}}
@keyframes zpshoot{0%{opacity:0;transform:translate3d(0,0,0) rotate(-22deg)}1%{opacity:1}8%{opacity:1;transform:translate3d(-300px,120px,0) rotate(-22deg)}9%,100%{opacity:0;transform:translate3d(-300px,120px,0) rotate(-22deg)}}

.zp-head{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:0 2px}
.zp-brand{display:flex;align-items:center;gap:10px;min-width:0}
.zp-logo{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;color:var(--zp-onacc,#fff);flex:none;
  background:linear-gradient(135deg,var(--zp-accent),color-mix(in srgb,var(--zp-accent) 55%,var(--zp-accent2)));box-shadow:0 4px 14px color-mix(in srgb,var(--zp-accent) 35%,transparent)}
.zp-name{font-weight:700;font-size:14.5px;letter-spacing:-.01em}
.zp-status{display:inline-flex;align-items:center;gap:7px;height:26px;padding:0 10px;border-radius:99px;background:var(--zp-surf);border:1px solid var(--zp-line);color:var(--zp-muted);font-size:12px;white-space:nowrap}
.zp-dot{width:7px;height:7px;border-radius:50%;background:var(--zp-muted);flex:none;display:inline-block}
.zp-dot.on{background:var(--zp-ok);box-shadow:0 0 0 0 color-mix(in srgb,var(--zp-ok) 55%,transparent);animation:zpPing 2.2s infinite}
@keyframes zpPing{70%,100%{box-shadow:0 0 0 6px transparent}}
.zp-mini{display:none;gap:16px;color:var(--zp-muted);flex-wrap:wrap;font-size:12.5px}
.zp-mini b{color:var(--zp-text);font-weight:650}
.zp-actions{margin-left:auto;display:flex;align-items:center;gap:6px}
.zp-clock{font-weight:600;font-size:15px;margin-right:6px;letter-spacing:.01em}
.zp-icon{width:34px;height:34px;border-radius:10px;border:1px solid var(--zp-line);background:var(--zp-surf);display:inline-grid;place-items:center;color:var(--zp-muted);transition:.15s}
.zp-icon:hover{color:var(--zp-text);border-color:color-mix(in srgb,var(--zp-accent) 60%,var(--zp-line));background:var(--zp-surf2)}
.zp-icon.on{background:var(--zp-accent);border-color:var(--zp-accent);color:var(--zp-onacc,#fff)}
#zp-fold .ic{transition:transform .2s}
#zp.collapsed #zp-fold .ic{transform:rotate(-90deg)}
.zp-timer-pill{display:none;align-items:center;gap:6px;height:34px;padding:0 5px 0 12px;border-radius:99px;background:var(--zp-accent);color:var(--zp-onacc,#fff);font-weight:650}
.zp-timer-pill.on{display:inline-flex}
.zp-timer-pill.urgent{background:var(--zp-bad);animation:zpBlink 1s infinite}
@keyframes zpBlink{50%{opacity:.6}}
.zp-timer-pill button{width:24px;height:24px;border-radius:99px;background:rgba(255,255,255,.2);color:var(--zp-onacc,#fff);display:grid;place-items:center}
#zp.collapsed .zp-body,#zp.collapsed .zp-banner{display:none}
#zp.collapsed .zp-mini{display:flex}

.zp-banner{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:12px;padding:10px 12px 10px 14px;border-radius:var(--zp-r);
  border:1px solid color-mix(in srgb,var(--zp-accent) 35%,transparent);background:color-mix(in srgb,var(--zp-accent) 10%,var(--zp-bg));font-size:12.5px;color:var(--zp-text)}
.zp-banner .ic{color:var(--zp-accent)}
.zp-banner b{font-weight:650}
.zp-banner .sp{flex:1}

.zp-body{display:grid;grid-template-columns:minmax(300px,1fr) 2.2fr;gap:10px;margin-top:14px}
#zp.hero-top .zp-body{grid-template-columns:1fr}
@media (max-width:900px){.zp-body{grid-template-columns:1fr}}
.zp-lbl{font-size:12px;font-weight:600;color:var(--zp-muted);display:flex;align-items:center;gap:7px}
.zp-kz{display:inline-flex;align-items:center;gap:3px;height:20px;padding:0 8px;margin-left:4px;border-radius:99px;border:1px dashed var(--zp-line);font-size:10.5px;font-weight:600;color:var(--zp-muted);transition:.15s}
.zp-kz:hover{border-color:var(--zp-accent);color:var(--zp-text)}
.zp-kz.on{border-style:solid;border-color:color-mix(in srgb,var(--zp-accent) 55%,var(--zp-line));background:color-mix(in srgb,var(--zp-accent) 14%,transparent);color:var(--zp-text)}
.zp-lbl .ic{opacity:.85}

.zp-hero{background:radial-gradient(130% 160% at 0% 0%,var(--zp-soft),transparent 55%),var(--zp-surf);border:1px solid var(--zp-line);
  border-radius:var(--zp-r);padding:16px 20px;display:flex;flex-wrap:wrap;align-items:center;gap:16px 28px;align-self:start}
.zp-ring{position:relative;width:96px;height:96px;flex:none}
.zp-ring svg{width:100%;height:100%;transform:rotate(-90deg)}
.zp-ring circle{fill:none;stroke-width:8;stroke-linecap:round}
.zp-ring .bg{stroke:var(--zp-surf2)}
.zp-ring .fg{stroke:var(--zp-accent);transition:stroke-dashoffset .9s cubic-bezier(.2,.7,.2,1),stroke .4s}
.zp-ring-t{position:absolute;inset:0;display:grid;place-content:center;text-align:center}
.zp-ring-t b{font-size:21px;font-weight:700;line-height:1;letter-spacing:-.02em}
.zp-ring-t span{font-size:10.5px;color:var(--zp-muted);margin-top:3px}
.zp-times{display:flex;align-items:stretch;gap:28px;flex:1 1 360px;min-width:0}
.zp-time{min-width:0}
.zp-sep{width:1px;background:var(--zp-line);flex:none}
.zp-big{font-weight:700;font-size:40px;line-height:1.05;letter-spacing:-.035em;margin-top:6px}
.zp-big.accent{color:var(--zp-accent)}
.zp-big.done{color:var(--zp-ok)}
.zp-cd{font-size:12.5px;font-weight:500;color:var(--zp-muted);margin-top:5px;display:flex;align-items:center;gap:5px}
.zp-cd.ok{color:var(--zp-ok)}
.zp-foot{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px;flex:1 1 100%}
#zp.hero-top .zp-foot{flex:0 1 300px;grid-template-columns:1fr;border-left:1px solid var(--zp-line);padding-left:24px}
@media (max-width:1050px){#zp.hero-top .zp-foot{flex:1 1 100%;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));border-left:0;padding-left:0}}
.zp-cstats{display:none;gap:10px;flex:1 1 auto;flex-wrap:wrap}
.zp-cs{display:flex;flex-direction:column;gap:2px;padding:8px 14px;border-radius:12px;background:color-mix(in srgb,var(--zp-surf2) 70%,transparent);min-width:96px}
.zp-cs span{font-size:11.5px;color:var(--zp-muted);font-weight:500}
.zp-cs b{font-size:19px;font-weight:700;letter-spacing:-.02em}
.zp-cs b.ok{color:var(--zp-ok)}.zp-cs b.bad{color:var(--zp-bad)}.zp-cs b.warn{color:var(--zp-warn)}
#zp.compact .zp-cards,#zp.compact .zp-tl,#zp.compact .zp-foot,#zp.compact .zp-warnbox{display:none !important}
#zp.compact .zp-cstats{display:flex}
#zp.compact .zp-body{grid-template-columns:1fr;margin-top:12px}
#zp.compact .zp-hero{padding:12px 16px;gap:12px 24px}
#zp.compact .zp-ring{width:64px;height:64px}
#zp.compact .zp-ring-t b{font-size:15px}
#zp.compact .zp-ring-t span{display:none}
#zp.compact .zp-big{font-size:30px}
#zp.compact .zp-times{flex:0 1 auto}
.zp-fi{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:6px 10px;border-radius:9px;background:color-mix(in srgb,var(--zp-surf2) 70%,transparent);font-size:12px;color:var(--zp-muted)}
.zp-fi b{color:var(--zp-text);font-weight:650}
.zp-fi.w{background:color-mix(in srgb,var(--zp-warn) 13%,transparent);color:var(--zp-warn)}
.zp-fi.w b{color:var(--zp-warn)}

.zp-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;align-content:start;grid-auto-flow:dense}
#zp.hero-top .zp-cards{grid-template-columns:repeat(4,minmax(0,1fr))}
@media (max-width:1100px){.zp-cards,#zp.hero-top .zp-cards{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:560px){.zp-cards,#zp.hero-top .zp-cards{grid-template-columns:1fr}}
.zp-card{position:relative;background:var(--zp-surf);border:1px solid var(--zp-line);border-radius:var(--zp-r);padding:14px 15px;display:flex;flex-direction:column;gap:2px;min-width:0;transition:border-color .15s,background .15s}
.zp-card:hover{border-color:color-mix(in srgb,var(--zp-accent) 40%,var(--zp-line))}
.zp-card.is-wide{grid-column:span 2}
.zp-card.off{display:none}
.zp-urm{position:absolute;top:12px;right:12px;display:inline-flex;border:1px solid var(--zp-line);border-radius:8px;overflow:hidden;z-index:2}
.zp-urm button{border:0;background:transparent;color:var(--zp-muted);font:600 11px/1 inherit;padding:5px 8px;cursor:pointer}
.zp-urm button.on{background:var(--zp-accent);color:var(--zp-onacc,#fff)}
#zp.editing .zp-urm{display:none}
.zp-val{font-weight:700;font-size:26px;line-height:1.15;letter-spacing:-.025em;margin-top:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.zp-val small{font-size:15px;font-weight:600;color:var(--zp-muted);letter-spacing:0;margin-left:2px}
.zp-val.ok{color:var(--zp-ok)}.zp-val.warn{color:var(--zp-warn)}.zp-val.bad{color:var(--zp-bad)}
.zp-sub{font-size:12px;color:var(--zp-muted);line-height:1.5}
.zp-sub .w{color:var(--zp-warn);font-weight:600}
.zp-bar{height:6px;border-radius:9px;background:var(--zp-surf2);overflow:hidden;margin:8px 0 6px}
.zp-bar i{display:block;height:100%;width:0;border-radius:9px;background:var(--zp-accent);transition:width .7s,background .4s}
.zp-chips{display:flex;gap:5px;flex-wrap:wrap;margin-top:8px}
.zp-chip{height:24px;padding:0 10px;border-radius:99px;border:1px solid var(--zp-line);background:var(--zp-bg);font-size:11.5px;font-weight:600;color:var(--zp-muted);transition:.12s}
.zp-chip:hover{border-color:var(--zp-accent);color:var(--zp-text)}
.zp-chip.on{background:var(--zp-accent);border-color:var(--zp-accent);color:var(--zp-onacc,#fff)}
.zp-wish{margin-top:8px}
.zp-wish input{background:var(--zp-bg);color:var(--zp-text);border:1px solid var(--zp-line);border-radius:9px;padding:4px 8px;font-weight:600;font-size:15px;width:108px;outline:none}
.zp-wish input:focus{border-color:var(--zp-accent)}
.zp-days{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin:10px 0 6px;align-items:end}
.zp-day{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:10.5px;font-weight:600;color:var(--zp-muted)}
.zp-day .col{width:100%;height:30px;border-radius:7px;background:var(--zp-surf2);position:relative;overflow:hidden}
.zp-day .col i{position:absolute;left:0;right:0;bottom:0;background:var(--zp-accent2);border-radius:7px;transition:height .6s}
.zp-day.full .col i{background:var(--zp-ok)}
.zp-day.today{color:var(--zp-text)}
.zp-day.today .col{box-shadow:0 0 0 2px var(--zp-accent)}
.zp-spark{width:100%;height:46px;margin:8px 0 4px;display:block;overflow:visible}

/* Bearbeiten-Modus */
.zp-tools{display:none;position:absolute;top:10px;right:10px;gap:5px;z-index:3}
#zp.editing .zp-tools{display:flex}
.zp-tools button{width:28px;height:28px;border-radius:8px;border:1px solid var(--zp-line);background:var(--zp-bg);display:grid;place-items:center;color:var(--zp-muted)}
.zp-tools button:hover{border-color:var(--zp-accent);color:var(--zp-text)}
.zp-tools button.on{background:var(--zp-accent);border-color:var(--zp-accent);color:var(--zp-onacc,#fff)}
#zp.editing .zp-card{cursor:grab;border-style:dashed;border-color:color-mix(in srgb,var(--zp-accent) 55%,var(--zp-line))}
#zp.editing .zp-card:active{cursor:grabbing}
#zp.editing .zp-card.off{display:flex;opacity:.4}
#zp.editing .zp-card.dragging{opacity:.25}

/* Timeline */
.zp-tl{grid-column:1/-1;background:var(--zp-surf);border:1px solid var(--zp-line);border-radius:var(--zp-r);padding:28px 16px 6px}
.zp-tl.off{display:none}
.zp-track{position:relative;height:22px;border-radius:7px;background:var(--zp-surf2)}
.zp-seg{position:absolute;top:0;bottom:0;background:var(--zp-accent);border-radius:5px;min-width:2px}
.zp-seg.live{background:var(--zp-ok);animation:zpGlow 2.2s ease-in-out infinite}
@keyframes zpGlow{50%{opacity:.7}}
.zp-gap{position:absolute;top:8px;bottom:8px;border-radius:3px}
.zp-gap.lunch{top:2px;bottom:2px;background:repeating-linear-gradient(45deg,color-mix(in srgb,var(--zp-warn) 60%,transparent) 0 3px,transparent 3px 6px);border-radius:4px}
.zp-gap.smoke{background:color-mix(in srgb,var(--zp-muted) 45%,transparent)}
.zp-win{position:absolute;top:-4px;bottom:-4px;border-radius:8px;background:color-mix(in srgb,var(--zp-warn) 6%,transparent);border:1px dashed color-mix(in srgb,var(--zp-warn) 30%,transparent)}
.zp-proj{position:absolute;top:5px;bottom:5px;border-radius:5px;border:1.5px dashed color-mix(in srgb,var(--zp-ok) 80%,transparent)}
.zp-mark{position:absolute;top:-6px;bottom:-6px;width:2px;margin-left:-1px;background:var(--zp-text);border-radius:2px}
.zp-mark span{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);margin-bottom:3px;font-size:10.5px;font-weight:650;white-space:nowrap;
  padding:2px 8px;border-radius:99px;background:var(--zp-text);color:var(--zp-bg)}
.zp-mark.low span{bottom:auto;top:100%;margin:3px 0 0}
.zp-mark.soll{background:var(--zp-accent)}.zp-mark.soll span{background:var(--zp-accent);color:var(--zp-onacc,#fff)}
.zp-mark.sal{background:var(--zp-accent2)}.zp-mark.sal span{background:var(--zp-accent2);color:#0b0d12}
.zp-mark.wish{background:var(--zp-muted)}.zp-mark.wish span{background:var(--zp-surf2);color:var(--zp-text);border:1px solid var(--zp-line)}
.zp-mark.now{background:var(--zp-bad)}.zp-mark.now span{background:var(--zp-bad);color:var(--zp-onbad,#fff)}
.zp-ticks{position:relative;height:16px;margin-top:24px}
.zp-ticks span{position:absolute;transform:translateX(-50%);font-size:10.5px;color:var(--zp-muted)}
.zp-legend{display:flex;gap:16px;flex-wrap:wrap;font-size:11px;color:var(--zp-muted);padding:6px 0 4px}
.zp-legend.off{display:none}
.zp-legend i{display:inline-block;width:12px;height:8px;border-radius:3px;margin-right:5px;vertical-align:middle}
.zp-warnbox{grid-column:1/-1;display:none;align-items:center;gap:8px;font-size:12.5px;padding:9px 13px;border-radius:var(--zp-r);background:color-mix(in srgb,var(--zp-warn) 11%,transparent);color:var(--zp-warn);border:1px solid color-mix(in srgb,var(--zp-warn) 30%,transparent)}
.zp-warnbox a{color:inherit;font-weight:650;text-decoration:underline;cursor:pointer}

.zp-pop{position:absolute;top:52px;right:14px;z-index:20;width:260px;background:var(--zp-bg);border:1px solid var(--zp-line);border-radius:var(--zp-r);
  box-shadow:0 18px 48px rgba(0,0,0,.35);padding:14px;display:flex;flex-direction:column;gap:10px}
.zp-pop h4{margin:0;font-size:13px;font-weight:650;display:flex;align-items:center;gap:7px}
.zp-pop .row{display:flex;gap:6px;align-items:center}
.zp-pop input{background:var(--zp-surf);color:var(--zp-text);border:1px solid var(--zp-line);border-radius:9px;padding:6px 8px;width:80px;outline:none}

/* Buttons */
.zp-btn{height:32px;border:1px solid var(--zp-line);background:var(--zp-surf);border-radius:10px;padding:0 14px;font-weight:600;transition:.15s;color:var(--zp-text);display:inline-flex;align-items:center;gap:7px;white-space:nowrap}
.zp-btn:hover{border-color:color-mix(in srgb,var(--zp-accent) 60%,var(--zp-line));background:var(--zp-surf2)}
.zp-btn.pri{background:var(--zp-accent);border-color:var(--zp-accent);color:var(--zp-onacc,#fff)}
.zp-btn.pri:hover{filter:brightness(1.08)}
.zp-btns{display:flex;gap:8px;flex-wrap:wrap;align-items:center}

/* ───── App-Leiste ───── */
#zs{background:color-mix(in srgb,var(--zp-bg) 84%,transparent);backdrop-filter:blur(16px) saturate(1.4);-webkit-backdrop-filter:blur(16px) saturate(1.4);border-bottom:1px solid var(--zp-line);color:var(--zp-text)}
.zs-in{max-width:1240px;margin:0 auto;padding:0 16px;box-sizing:content-box}
.zs-bar{display:flex;align-items:center;gap:14px;height:60px}
.zs-upd{display:inline-flex;align-items:center;gap:7px;height:34px;padding:0 13px;border-radius:11px;border:1px solid var(--zp-accent);background:color-mix(in srgb,var(--zp-accent) 16%,transparent);color:var(--zp-text);font:600 13px/1 inherit;cursor:pointer;animation:zsupd 2.4s ease-in-out infinite}
.zs-upd:hover{background:var(--zp-accent);color:var(--zp-onacc,#fff)}
@keyframes zsupd{50%{box-shadow:0 0 0 4px color-mix(in srgb,var(--zp-accent) 25%,transparent)}}
.zs-brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--zp-text);font-weight:700;font-size:15px;letter-spacing:-.01em;flex:none}
.zs-brand .zp-logo{width:30px;height:30px}
.zs-nav{display:flex;gap:2px;overflow-x:auto;scrollbar-width:none;flex:1;min-width:0;padding:0 4px}
.zs-nav::-webkit-scrollbar{display:none}
.zs-nav a{position:relative;display:flex;align-items:center;gap:6px;height:38px;padding:0 9px;border-radius:11px;color:var(--zp-muted);text-decoration:none;font-weight:600;font-size:12.5px;white-space:nowrap;transition:background .15s,color .15s;flex:none}
.zs-nav a:hover{background:var(--zp-surf);color:var(--zp-text)}
.zs-nav a.on{background:var(--zp-surf2);color:var(--zp-text);box-shadow:inset 0 0 0 1px var(--zp-line)}
.zs-nav a.on .ic{color:var(--zp-accent)}
.zp-cof{display:flex;flex-wrap:wrap;gap:8px;margin:4px 0 6px}
.zp-cofi{display:inline-flex;align-items:center;gap:6px;padding:4px 4px 4px 8px;border:1px solid var(--zp-line);border-radius:12px;background:var(--zp-surf)}
.zp-cofi .zp-in{width:92px}
.zp-icon.sm{width:26px;height:26px}
.zs-cd{display:inline-flex;align-items:center;gap:7px;height:30px;padding:0 12px 0 9px;border-radius:99px;border:1px solid var(--zp-line);background:var(--zp-surf);color:var(--zp-text);font-size:12.5px;font-weight:600;white-space:nowrap;transition:.15s}
.zs-cd:hover{border-color:var(--zp-accent)}
.zs-cd.over{border-style:dashed;color:var(--zp-muted);font-weight:600}
.zs-cd.over:hover{color:var(--zp-text)}
.zs-cd .e{font-size:15px;line-height:1}
.zs-cd .t{color:var(--zp-muted);font-weight:500;max-width:140px;overflow:hidden;text-overflow:ellipsis}
.zs-cd b{color:var(--zp-accent);font-weight:700}
.zs-cd.maci{background:linear-gradient(135deg,color-mix(in srgb,#ff7a7a 22%,var(--zp-surf)),color-mix(in srgb,#2f9e5b 22%,var(--zp-surf)));border-color:color-mix(in srgb,#ffc979 45%,var(--zp-line))}
.zs-cd.maci b{color:#ffc979}
.zs-sub.full .zs-cd .t{display:none}
.zs-sub.full{gap:8px}.zs-sub.full .zp-btn{padding:0 12px}.zs-sub.full .zs-cd{padding:0 10px 0 8px}
@media (max-width:1180px){.zs-cd .t{display:none}}
.zs-badge{min-width:18px;height:18px;border-radius:99px;background:var(--zp-bad);color:var(--zp-onbad,#fff);font-size:10.5px;font-weight:700;display:inline-grid;place-items:center;padding:0 5px;line-height:1}
@media (max-width:1300px){.zs-nav a:not(.on) .lb{display:none}.zs-nav a{padding:0 10px}}
#zs.live-on .zs-nav a .lb{display:none}
#zs.live-on .zs-nav a.on .lb{display:inline}
.zs-live{display:none;align-items:center;gap:8px;font-size:12.5px;color:var(--zp-muted);white-space:nowrap;padding:0 12px;height:34px;border-radius:99px;background:var(--zp-surf);border:1px solid var(--zp-line);cursor:pointer;flex:none}
.zs-live b{color:var(--zp-text);font-weight:650}
#zs.live-on .zs-live{display:flex}
@media (max-width:1100px){#zs.live-on .zs-live{display:none}}
.zs-right{display:flex;align-items:center;gap:6px;flex:none}
.zs-user{display:flex;align-items:center;gap:9px;height:40px;padding:0 10px 0 4px;border-radius:99px;border:1px solid var(--zp-line);background:var(--zp-surf);color:var(--zp-text);font-weight:600}
.zs-user:hover{border-color:color-mix(in srgb,var(--zp-accent) 55%,var(--zp-line))}
.zs-av{position:relative;width:32px;height:32px;border-radius:50%;display:grid;place-items:center;color:var(--zp-onacc,#fff);font-weight:700;font-size:12px;
  background:linear-gradient(135deg,var(--zp-accent),color-mix(in srgb,var(--zp-accent) 50%,var(--zp-accent2)))}
.zs-av i{position:absolute;right:-1px;bottom:-1px;width:10px;height:10px;border-radius:50%;background:var(--zp-muted);border:2px solid var(--zp-surf)}
.zs-av i.on{background:var(--zp-ok)}
.zs-user .nm{font-size:13px}
.zs-user small{color:var(--zp-muted);font-weight:500;margin-left:4px}
@media (max-width:900px){.zs-user .nm{display:none}}
@media (max-width:1180px){.zs-chip.ur{display:none}.zs-sub .zp-btn{padding:0 10px}}
.zs-sub{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:10px 0 12px;border-top:1px solid color-mix(in srgb,var(--zp-line) 60%,transparent)}
.zs-title{font-size:19px;font-weight:700;letter-spacing:-.02em;margin-right:6px}
.zs-month{display:flex;align-items:center;gap:2px;background:var(--zp-surf);border:1px solid var(--zp-line);border-radius:12px;padding:3px}
.zs-month button{height:30px;min-width:30px;border-radius:9px;display:inline-flex;align-items:center;justify-content:center;gap:6px;color:var(--zp-muted)}
.zs-month button:hover{background:var(--zp-surf2);color:var(--zp-text)}
.zs-month .m{padding:0 12px;font-weight:650;color:var(--zp-text);min-width:140px}
.zs-month .t{padding:0 10px;font-size:12px;font-weight:600}
.zs-chip{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:99px;font-size:12px;font-weight:600;color:var(--zp-muted);background:var(--zp-surf);border:1px solid var(--zp-line);white-space:nowrap}
.zs-chip b{color:var(--zp-text);font-weight:650}
.zs-chip.st{color:var(--zp-warn);border-color:color-mix(in srgb,var(--zp-warn) 35%,var(--zp-line))}
.zs-chip.st.ok{color:var(--zp-ok);border-color:color-mix(in srgb,var(--zp-ok) 35%,var(--zp-line))}
.zs-sub .sp{flex:1}
.zs-sub .zp-btn{height:34px}
.zs-pop{position:fixed;z-index:10;min-width:230px;max-width:320px;background:var(--zp-bg);border:1px solid var(--zp-line);border-radius:14px;box-shadow:0 22px 60px rgba(0,0,0,.4);padding:6px;animation:zpIn .16s ease}
.zs-pop h5{margin:6px 10px 6px;font-size:11px;font-weight:650;letter-spacing:.06em;text-transform:uppercase;color:var(--zp-muted)}
.zs-mi{display:flex;align-items:center;gap:10px;width:100%;height:38px;padding:0 10px;border-radius:9px;text-align:left;color:var(--zp-text);font-weight:500;text-decoration:none}
.zs-mi:hover{background:var(--zp-surf2)}
.zs-mi .ic{color:var(--zp-muted)}
.zs-mi.danger{color:var(--zp-bad)}.zs-mi.danger .ic{color:var(--zp-bad)}
.zs-sepl{height:1px;background:var(--zp-line);margin:5px 4px}
.zs-langs{display:flex;gap:4px;padding:4px 10px 8px}
.zs-langs button{height:26px;padding:0 10px;border-radius:8px;border:1px solid var(--zp-line);font-size:12px;font-weight:600;color:var(--zp-muted)}
.zs-langs button.on,.zs-langs button:hover{border-color:var(--zp-accent);color:var(--zp-text)}
.zs-yr{display:flex;align-items:center;justify-content:space-between;padding:4px 4px 8px}
.zs-yr b{font-size:14px}
.zs-yr button{width:30px;height:30px;border-radius:8px;display:grid;place-items:center;color:var(--zp-muted)}
.zs-yr button:hover{background:var(--zp-surf2);color:var(--zp-text)}
.zs-months{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:0 4px 4px}
.zs-months button{height:36px;border-radius:9px;font-weight:600;font-size:12.5px;color:var(--zp-text)}
.zs-months button:hover{background:var(--zp-surf2)}
.zs-months button.on{background:var(--zp-accent);color:var(--zp-onacc,#fff)}
.zs-months button.now{box-shadow:inset 0 0 0 1px var(--zp-accent)}

/* ───── Favoriten-Leiste (Tableau) ───── */
#zf{zoom:var(--zp-zoom,1)}
.zf-bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:10px 12px;background:var(--zp-bg);border:1px solid var(--zp-line);border-radius:calc(var(--zp-r) + 2px);box-shadow:var(--zp-shadow)}
.zf-t{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--zp-muted);margin-right:4px}
.zf-t .ic{color:#f5c542}
.zf-c{display:inline-flex;align-items:center;gap:8px;height:34px;padding:0 6px 0 6px;border-radius:99px;background:var(--zp-surf);border:1px solid var(--zp-line);font-weight:600;font-size:13px;color:var(--zp-text);transition:.12s}
.zf-c:hover{border-color:#f5c542}
.zf-c img{width:22px;height:22px;border-radius:50%;object-fit:cover}
.zf-c i{width:10px;height:10px;border-radius:50%;background:var(--zp-muted);margin:0 6px}
.zf-c.off{opacity:.5}
.zf-c b{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;color:var(--zp-muted)}
.zf-c b:hover{background:var(--zp-surf2);color:var(--zp-bad)}
.zf-h{font-size:12.5px;color:var(--zp-muted)}
/* ───── Kalender ───── */
.zs-month span.m{display:inline-flex;align-items:center;justify-content:center;height:30px;min-width:96px}
#zk{zoom:var(--zp-zoom,1);display:grid;gap:14px;user-select:none}
.zk-card{background:var(--zp-bg);border:1px solid var(--zp-line);border-radius:calc(var(--zp-r) + 4px);box-shadow:var(--zp-shadow);padding:16px;display:grid;gap:14px;min-width:0}
.zk-card.slim{padding:12px 16px}
.zk-head{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.zk-head .sp{flex:1}
.zk-yn{display:flex;align-items:center;gap:2px;background:var(--zp-surf);border:1px solid var(--zp-line);border-radius:11px;padding:3px}
.zk-yn button{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;color:var(--zp-muted)}
.zk-yn button:hover{background:var(--zp-surf2);color:var(--zp-text)}
.zk-yn b{padding:0 8px;font-weight:650}
.zk-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px}
.zk-st{background:var(--zp-surf);border:1px solid var(--zp-line);border-radius:var(--zp-r);padding:12px 15px;display:grid;gap:4px;min-width:0;position:relative;overflow:hidden}
.zk-st small{font-size:10.5px;font-weight:650;letter-spacing:.07em;text-transform:uppercase;color:var(--zp-muted);display:flex;gap:6px;align-items:center}
.zk-st b{font-size:22px;font-weight:700;letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.zk-st b em{font-style:normal;font-size:13px;font-weight:600;color:var(--zp-muted);letter-spacing:0}
.zk-st span{font-size:12.5px;color:var(--zp-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.zk-st.acc{background:linear-gradient(135deg,color-mix(in srgb,var(--zp-accent) 18%,var(--zp-surf)),var(--zp-surf));border-color:color-mix(in srgb,var(--zp-accent) 35%,var(--zp-line))}
.zk-st.acc small .ic{color:var(--zp-accent)}
.zk-st.warn small .ic,.zk-st.warn b{color:var(--zp-warn)}
.zk-months{display:grid;grid-template-columns:repeat(auto-fill,minmax(248px,1fr));gap:12px}
.zk-m{background:var(--zp-surf);border:1px solid var(--zp-line);border-radius:var(--zp-r);padding:12px 12px 10px;min-width:0}
.zk-m.gone{background:color-mix(in srgb,var(--zp-surf) 55%,transparent)}
.zk-m.cur{border-color:color-mix(in srgb,var(--zp-accent) 60%,var(--zp-line));box-shadow:0 0 0 3px color-mix(in srgb,var(--zp-accent) 14%,transparent)}
.zk-mh{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 2px 8px;min-height:22px}
.zk-mh b{font-size:14px;font-weight:700}
.zk-m.cur .zk-mh b{color:var(--zp-accent)}
.zk-mh span{display:flex;gap:4px}
.zk-bd{display:inline-flex;align-items:center;gap:4px;height:20px;padding:0 7px;border-radius:99px;font-size:11px;font-weight:700;background:color-mix(in srgb,var(--c) 18%,transparent);color:var(--zp-text)}
.zk-bd i{width:7px;height:7px;border-radius:50%;background:var(--c)}
.zk-wd,.zk-g{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:3px}
.zk-wd span{font-size:10px;font-weight:650;color:var(--zp-muted);text-align:center;letter-spacing:.04em;padding-bottom:4px}
.zk-wd span:nth-child(n+6){opacity:.6}
.zk-d{position:relative;height:31px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12.5px;font-weight:600;color:var(--zp-text);background:transparent;transition:background .12s,box-shadow .12s,opacity .12s;cursor:default;min-width:0;padding:0}
.zk-d.blank,.zk-d.none{visibility:hidden}
.zk-d.we{color:var(--zp-muted);background:repeating-linear-gradient(135deg,color-mix(in srgb,var(--zp-muted) 13%,transparent) 0 2px,transparent 2px 6px)}
.zk-d.hol:not(.abs):not(.brd){color:var(--zp-warn);background:color-mix(in srgb,var(--zp-warn) 13%,transparent)}
.zk-d.work::after{content:'';position:absolute;bottom:3px;left:50%;width:4px;height:4px;margin-left:-2px;border-radius:50%;background:color-mix(in srgb,var(--zp-ok) 75%,transparent)}
.zk-d.abs{background:color-mix(in srgb,var(--c) 84%,var(--zp-surf));color:var(--ink);font-weight:700}
.zk-d.abs i{position:absolute;top:1px;right:4px;font-style:normal;font-size:8.5px;font-weight:800;opacity:.7}
.zk-d.past:not(.abs):not(.today){opacity:.5}
.zk-d.past.abs{opacity:.8;filter:saturate(.85)}
.zk-d.pend{background:color-mix(in srgb,var(--c) 20%,transparent);color:var(--zp-text);outline:1.5px dashed var(--c);outline-offset:-2px}
.zk-d.today{box-shadow:0 0 0 2px var(--zp-accent),0 0 14px color-mix(in srgb,var(--zp-accent) 45%,transparent);color:var(--zp-accent);font-weight:800;z-index:1}
.zk-d.abs.today{color:var(--ink)}
.zk-d.bridge:not(.abs){box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--zp-accent2) 75%,transparent);background:color-mix(in srgb,var(--zp-accent2) 12%,transparent)}
.zk-d.brd{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--zp-bad) 75%,transparent)}
.zk-d.brd:not(.abs){background:color-mix(in srgb,var(--zp-bad) 7%,transparent);color:color-mix(in srgb,var(--zp-bad) 70%,var(--zp-text))}
.zk-d.brd.past{opacity:1 !important;filter:none !important}
.zk-d.rem,.zk-d.rem.abs{background:transparent !important;color:var(--zp-text);box-shadow:inset 0 0 0 1.5px var(--zp-rem,#2dd4bf)}
.zk-d.rem.abs i{color:var(--zp-rem,#2dd4bf);opacity:1}
.zk-d.rem.past{opacity:.75}
/* Bereitschaft + Remote: Neon-Rahmen, der rot/türkis durchläuft */
.zk-d.rem.brd,.zk-d.rem.brd.abs{box-shadow:none !important;border:2px solid transparent;background:linear-gradient(var(--zp-surf),var(--zp-surf)) padding-box,linear-gradient(90deg,var(--zp-bad) 0%,var(--zp-bad) 18%,var(--zp-rem,#2dd4bf) 32%,var(--zp-rem,#2dd4bf) 68%,var(--zp-bad) 82%,var(--zp-bad) 100%) border-box !important;background-size:100% 100%,200% 100% !important;animation:zkneon 2.6s linear infinite;filter:drop-shadow(0 0 2px color-mix(in srgb,var(--zp-rem,#2dd4bf) 40%,transparent)) drop-shadow(0 0 2px color-mix(in srgb,var(--zp-bad) 40%,transparent))}
.zk-d.rem.brd::before{display:none}
@keyframes zkneon{to{background-position:0 0,200% 0}}
@media (prefers-reduced-motion:reduce){.zk-d.rem.brd{animation:none}}
.zk-d.brd::before{content:'';position:absolute;top:3px;left:4px;width:5px;height:5px;border-radius:50%;background:var(--zp-bad)}
.zk-d.brd.abs{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--zp-bad) 85%,transparent)}
.zk-sw.brs{box-shadow:inset 0 0 0 2px var(--zp-bad);background:color-mix(in srgb,var(--zp-bad) 12%,transparent)}
.zk-tog{cursor:pointer;user-select:none}
.zk-tog .sp{flex:1}
.zk-chev{color:var(--zp-muted);transition:transform .2s;display:grid}
.zk-chev.open{transform:rotate(180deg)}
.zk-sub{font-size:12px;color:var(--zp-muted)}
.zk-brs{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px}
.zk-br{display:grid;gap:3px;text-align:left;padding:11px 14px;border-radius:var(--zp-r);background:var(--zp-surf);border:1px solid var(--zp-line);transition:.15s;color:var(--zp-text)}
.zk-br:hover{border-color:var(--zp-accent2);transform:translateY(-1px)}
.zk-br b{font-size:15px;font-weight:700}.zk-br b em{font-style:normal;font-weight:500;font-size:12px;color:var(--zp-muted)}
.zk-br span{font-size:13px;font-weight:600;color:var(--zp-accent2)}
.zk-br small{font-size:11.5px;color:var(--zp-muted)}
.zk-br small.pl{display:flex;align-items:center;gap:5px;color:var(--zp-ok)}
.zk-br small b.tot{font-size:11.5px;font-weight:700;color:var(--zp-text)}
.zk-none{font-size:13px;color:var(--zp-muted);display:flex;align-items:center;gap:7px}
.zk-d.add{cursor:pointer}
.zk-d.add:hover{background:color-mix(in srgb,var(--zp-accent) 24%,transparent);color:var(--zp-text);opacity:1}
.zk-d.add:hover::before{content:'+';position:absolute;top:0;right:4px;font-size:11px;font-weight:800;color:var(--zp-accent)}
.zk-d.abs:not(.add){cursor:help}
.zk-stripw{overflow-x:auto;padding-bottom:2px}
.zk-strip{display:grid;grid-template-columns:92px repeat(31,minmax(24px,1fr));gap:3px;min-width:900px;align-items:center}
.zk-strip .hd{text-align:center;color:var(--zp-muted);font-size:10.5px;font-weight:650;padding-bottom:2px}
.zk-strip .mn{font-weight:650;font-size:12.5px;padding-left:2px}
.zk-strip .mn.cur{color:var(--zp-accent)}
.zk-strip .zk-d{height:27px;border-radius:6px;font-size:11px}
.zk-strip .zk-d.today{box-shadow:0 0 0 2px var(--zp-accent)}
.zk-strip .zk-d.work::after{bottom:50%;margin-bottom:-2px}
.zk-foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid var(--zp-line);padding-top:12px}
.zk-leg{display:flex;flex-wrap:wrap;gap:7px;align-items:center}
.zk-li{display:inline-flex;align-items:center;gap:8px;height:32px;padding:0 11px 0 5px;border-radius:10px;border:1px solid var(--zp-line);background:var(--zp-surf);font-size:12.5px;font-weight:600;color:var(--zp-text)}
.zk-li em{font-style:normal;color:var(--zp-muted);font-weight:500;font-size:12px}
.zk-li .ic{color:var(--zp-muted)}
button.zk-li:hover{border-color:var(--zp-accent)}
.zk-li.off{opacity:.5}
.zk-li.ghost{background:transparent;border-color:transparent;padding-right:6px;color:var(--zp-muted);font-weight:500}
.zk-sw{width:22px;height:22px;border-radius:6px;display:grid;place-items:center;font-size:11px;font-weight:800;background:color-mix(in srgb,var(--c) 84%,var(--zp-surf));color:var(--ink)}
.zk-sw.work{background:var(--zp-surf2);color:var(--zp-ok)}
.zk-sw.we{background:repeating-linear-gradient(135deg,color-mix(in srgb,var(--zp-muted) 30%,transparent) 0 2px,transparent 2px 6px);box-shadow:inset 0 0 0 1px var(--zp-line)}
.zk-sw.hol{background:color-mix(in srgb,var(--zp-warn) 22%,transparent)}
.zk-sw.pend{outline:1.5px dashed var(--zp-muted);outline-offset:-3px}
.zk-sw.today{box-shadow:inset 0 0 0 2px var(--zp-accent)}
.zk-hint{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--zp-muted)}
.zk-hint .ic{color:var(--zp-accent)}
.zk-hint b{color:var(--zp-text);font-weight:600}
@media (max-width:700px){.zk-months{grid-template-columns:1fr}}

/* ───── Monatsliste ───── */
#zl{zoom:var(--zp-zoom,1);background:var(--zp-bg);border:1px solid var(--zp-line);border-radius:calc(var(--zp-r) + 4px);box-shadow:var(--zp-shadow);padding:14px 14px 10px;user-select:none}
.zl-head{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:0 2px 10px}
.zl-title{font-weight:700;font-size:15px;letter-spacing:-.01em;display:flex;align-items:center;gap:9px}
.zl-title .ic{color:var(--zp-accent)}
.zl-pill{font-size:12px;color:var(--zp-muted);background:var(--zp-surf);border:1px solid var(--zp-line);border-radius:99px;height:26px;padding:0 11px;display:inline-flex;align-items:center;gap:5px}
.zl-pill b{color:var(--zp-text);font-weight:650}
.zp-fi.br span,.zp-fi.br b{color:var(--zp-bad)}
.zp-fi.br{background:color-mix(in srgb,var(--zp-bad) 12%,var(--zp-surf)) !important;box-shadow:inset 3px 0 0 var(--zp-bad)}
.zp-fi.g small{font-size:10.5px;color:var(--zp-muted);margin-left:4px}
.zl-pill b.ok{color:var(--zp-ok)}.zl-pill b.bad{color:var(--zp-bad)}.zl-pill.w{color:var(--zp-warn);border-color:color-mix(in srgb,var(--zp-warn) 35%,var(--zp-line))}
.zl-head .sp{flex:1}
#zl.orig .zl-body{display:none}
#zl.orig{padding-bottom:4px}
.zl-cols,.zl-row{display:grid;grid-template-columns:var(--zl-grid,92px minmax(200px,1fr) 190px 62px 66px 72px 20px);align-items:center;gap:14px;padding:0 12px}
.zl-cols{font-size:10.5px;font-weight:650;letter-spacing:.06em;text-transform:uppercase;color:var(--zp-muted);height:30px;border-bottom:1px solid var(--zp-line)}
.zl-cols .r,.zl-n{text-align:right}
.zl-wk{display:flex;align-items:center;gap:10px;padding:14px 12px 6px;font-size:11px;font-weight:650;letter-spacing:.06em;text-transform:uppercase;color:var(--zp-muted)}
.zl-wk::after{content:'';flex:1;height:1px;background:var(--zp-line)}
.zl-wk b{color:var(--zp-text);font-weight:600;text-transform:none;letter-spacing:0}
.zl-row{min-height:44px;border-radius:12px;cursor:pointer;position:relative;transition:background .12s}
.zl-row:hover{background:var(--zp-surf)}
.zl-row.open{background:var(--zp-surf);box-shadow:inset 0 0 0 1px var(--zp-line)}
.zl-row.edge::before{content:'';position:absolute;left:0;top:9px;bottom:9px;width:3px;border-radius:3px;background:var(--edge)}
.zl-row.today{background:color-mix(in srgb,var(--zp-accent) 10%,transparent)}
.zl-row.today::before{content:'';position:absolute;left:0;top:7px;bottom:7px;width:3px;border-radius:3px;background:var(--zp-accent)}
.zl-row.we .zl-date,.zl-row.we .zl-st{opacity:.55}
.zl-row.future{opacity:.5}
.zl-row.future.calc{opacity:.78}
.zl-more.sep{margin:14px 0 6px}
.zl-date{display:flex;align-items:baseline;gap:8px}
.zl-date b{font-weight:650;font-size:13.5px}
.zl-date span{font-size:12px;color:var(--zp-muted);font-weight:600;width:22px}
.zl-row.today .zl-date b,.zl-row.today .zl-date span{color:var(--zp-accent)}
.zl-st{font-size:12.5px;display:flex;flex-wrap:wrap;gap:5px 6px;align-items:center;padding:7px 0;min-width:0}
.zl-p{display:inline-flex;align-items:center;height:100%;padding:0 5px;border-radius:5px;cursor:pointer;transition:.12s}
.zl-p:hover{background:color-mix(in srgb,var(--zp-accent) 22%,transparent);color:var(--zp-accent)}
.zl-p.off{cursor:default}.zl-p.off:hover{background:none;color:inherit}
.zl-b{height:24px;padding:0 4px;border-radius:7px;background:var(--zp-surf2);border:1px solid var(--zp-line);font-size:12.5px;font-weight:600;display:inline-flex;align-items:center;gap:5px;color:var(--zp-text);cursor:pointer;white-space:nowrap;transition:.12s}
.zl-b:hover{border-color:color-mix(in srgb,var(--zp-accent) 50%,var(--zp-line))}
.zl-b em{margin:0 -2px}
.zl-b em{font-style:normal;color:var(--zp-muted);font-weight:500}
.zl-b.live{background:color-mix(in srgb,var(--zp-ok) 15%,transparent);border-color:color-mix(in srgb,var(--zp-ok) 45%,transparent)}
.zl-b.live b{color:var(--zp-ok)}
.zl-lunch{display:inline-flex;align-items:center;gap:4px;font-size:11.5px;font-weight:600;color:var(--zp-warn);padding:0 3px}
.zl-lunch.ok{color:var(--zp-muted)}
.zl-lunch b{font-weight:700;margin-left:3px;padding:1px 6px;border-radius:99px;background:color-mix(in srgb,var(--zp-warn) 18%,transparent);color:var(--zp-warn);font-size:11px}
.zl-det .meta .w{color:var(--zp-warn)}
.zl-det .meta .ic{vertical-align:-2px}
.zl-st small{color:var(--zp-muted);margin-left:6px}
.zl-tag{display:inline-flex;align-items:center;gap:5px;height:22px;padding:0 9px;border-radius:99px;font-size:11.5px;font-weight:650;background:var(--zp-surf2);color:var(--zp-muted)}
.zl-tag.ok{background:color-mix(in srgb,var(--zp-ok) 15%,transparent);color:var(--zp-ok)}
.zl-wk.cl{margin-top:10px;color:var(--zp-text)}
.zl-row.close{cursor:default;min-height:38px}
.zl-row.close:hover{background:transparent}
.zl-cl{grid-column:1 / 3;display:flex;align-items:center;gap:12px;min-width:0}
.zl-cl b{font-size:12.5px;white-space:nowrap;min-width:92px}
.zl-row.close.sum{background:var(--zp-surf);box-shadow:inset 0 0 0 1px var(--zp-line)}
.zl-row.close.sum .zl-cl b{color:var(--zp-accent)}
.zl-pay{display:inline-flex;align-items:center;gap:8px;height:30px;padding:0 12px 0 4px;border-radius:99px;border:1px solid color-mix(in srgb,var(--zp-ok) 50%,var(--zp-line));background:color-mix(in srgb,var(--zp-ok) 14%,var(--zp-surf));color:var(--zp-text);font-weight:600;font-size:12.5px;transition:.15s}
.zl-pay:hover{border-color:var(--zp-ok)}
.zl-pay img{width:24px;height:24px;border-radius:50%;background:#fff}
.zl-pay.no{border-color:var(--zp-line);background:var(--zp-surf);color:var(--zp-muted);font-weight:500}
.zl-tag.br{background:color-mix(in srgb,var(--zp-bad) 20%,transparent);color:var(--zp-bad);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--zp-bad) 45%,transparent)}
.zl-tag.br.e{background:var(--zp-bad);color:var(--zp-onbad,#fff);box-shadow:none}
.zl-row.br{background:color-mix(in srgb,var(--zp-bad) 9%,transparent)}
.zl-row.br::after{content:'';position:absolute;left:0;top:7px;bottom:7px;width:3px;border-radius:3px;background:var(--zp-bad)}
.zl-row.br.today{background:color-mix(in srgb,var(--zp-bad) 14%,transparent)}
.zl-pill.br{color:var(--zp-bad);border-color:color-mix(in srgb,var(--zp-bad) 45%,var(--zp-line));background:color-mix(in srgb,var(--zp-bad) 10%,var(--zp-surf))}
.zl-pill.br b{color:var(--zp-bad)}
.zl-tag.warn{background:color-mix(in srgb,var(--zp-warn) 15%,transparent);color:var(--zp-warn)}
.zl-row.rem{box-shadow:inset 0 0 0 1.5px var(--zp-rem,#2dd4bf)}
.zl-row.rem.open{box-shadow:inset 0 0 0 1.5px var(--zp-rem,#2dd4bf)}
.zl-tag.rem{background:color-mix(in srgb,var(--zp-rem,#2dd4bf) 18%,transparent);color:var(--zp-rem,#2dd4bf);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--zp-rem,#2dd4bf) 45%,transparent)}
.zl-row.br.rem,.zl-row.br.rem.open{box-shadow:none}
.zl-row.br.rem::before{content:'';position:absolute;inset:0;width:auto;height:auto;border-radius:inherit;padding:1.5px;background:linear-gradient(90deg,var(--zp-bad) 0%,var(--zp-bad) 6%,var(--zp-rem,#2dd4bf) 19%,var(--zp-rem,#2dd4bf) 31%,var(--zp-bad) 44%,var(--zp-bad) 56%,var(--zp-rem,#2dd4bf) 69%,var(--zp-rem,#2dd4bf) 81%,var(--zp-bad) 94%,var(--zp-bad) 100%) 100% 0/200% 50% repeat-x,linear-gradient(90deg,var(--zp-bad) 0%,var(--zp-bad) 6%,var(--zp-rem,#2dd4bf) 19%,var(--zp-rem,#2dd4bf) 31%,var(--zp-bad) 44%,var(--zp-bad) 56%,var(--zp-rem,#2dd4bf) 69%,var(--zp-rem,#2dd4bf) 81%,var(--zp-bad) 94%,var(--zp-bad) 100%) 0% 100%/200% 50% repeat-x;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;filter:drop-shadow(0 0 3px color-mix(in srgb,var(--zp-rem,#2dd4bf) 22%,transparent));animation:zlflow 10s linear infinite}
.zl-row.br.rem,.zl-row.br.rem.today{background:color-mix(in srgb,color-mix(in srgb,var(--zp-bad) 50%,var(--zp-rem,#2dd4bf)) 8%,transparent)}
.zl-row.br.rem::after{display:none}
@keyframes zlflow{from{background-position:100% 0,0% 100%}to{background-position:0% 0,100% 100%}}
@media (prefers-reduced-motion:reduce){.zl-row.br.rem::before{animation:none}}
.zl-row.br.rem,.zl-row.br.rem.today{background:linear-gradient(90deg,color-mix(in srgb,var(--zp-bad) 10%,transparent),color-mix(in srgb,var(--zp-rem,#2dd4bf) 8%,transparent))}
.zl-row.br.rem::after{background:linear-gradient(180deg,var(--zp-bad),color-mix(in srgb,var(--zp-bad) 40%,var(--zp-rem,#2dd4bf)))}
.zl-row.rem .zl-tag.info{background:color-mix(in srgb,var(--zp-rem,#2dd4bf) 18%,transparent);color:var(--zp-rem,#2dd4bf)}
.zl-tag.info{background:color-mix(in srgb,var(--edge,var(--zp-accent2)) 18%,transparent);color:var(--edge,var(--zp-accent2))}
.zl-tl{position:relative;height:10px;border-radius:5px;background:var(--zp-surf2)}
.zl-tl i{position:absolute;top:0;bottom:0;border-radius:4px;background:var(--zp-accent)}
.zl-tl i.live{background:var(--zp-ok)}
.zl-tl i.lunch{background:repeating-linear-gradient(45deg,color-mix(in srgb,var(--zp-warn) 70%,transparent) 0 2px,transparent 2px 4px);top:-2px;bottom:-2px}
.zl-row.future .zl-tl{background:transparent;border:1px dashed var(--zp-line)}
.zl-tl.in{flex:0 0 100%;height:5px;margin:3px 0 1px;max-width:520px;opacity:.85}
.zl-tl.in i.lunch{top:-1px;bottom:-1px}
.zl-row.future .zl-tl.in,.zl-row.we .zl-tl.in{display:none}
#zl.many .zl-cols,#zl.many .zl-row{gap:10px}
.zl-body{overflow-x:auto;overflow-y:visible}
#zl.many .zl-vh{font-size:10px;letter-spacing:.03em}
#zl.many .zl-n{font-size:12.5px}
.zl-n{font-weight:600;font-size:13px}
.zl-cw{position:relative}
.zp-btn.sm{height:28px;padding:0 10px;font-size:12px;border-radius:9px;gap:6px}
.zl-colpop{display:none;position:absolute;right:0;top:36px;z-index:20;min-width:270px;max-height:min(70vh,560px);overflow:auto;background:var(--zp-surf);border:1px solid var(--zp-line);border-radius:14px;box-shadow:0 18px 44px rgba(0,0,0,.35);padding:10px;user-select:none}
.zl-colpop.open{display:block}
.zl-colpop h5{margin:2px 6px 8px;font-size:10.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--zp-muted)}
.zl-ci{display:flex;align-items:center;gap:9px;padding:6px 8px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;color:var(--zp-text)}
.zl-ci:hover{background:var(--zp-surf2)}
.zl-ci input{accent-color:var(--zp-accent);width:16px;height:16px;margin:0;cursor:pointer}
.zl-ci em{font-style:normal;font-weight:500;color:var(--zp-muted);font-size:12px;margin-left:auto;padding-left:12px;white-space:nowrap}
.zl-cf{display:flex;gap:6px;flex-wrap:wrap;margin:8px 4px 4px;padding-top:8px;border-top:1px solid var(--zp-line)}
.zl-colpop p{margin:6px 6px 2px;font-size:11.5px;color:var(--zp-muted)}
.zl-vh{cursor:grab;border-radius:6px;padding:4px 2px;position:relative;white-space:nowrap;transition:background .12s,color .12s}
.zl-vh:hover{color:var(--zp-text);background:var(--zp-surf2)}
.zl-vh.dragging{opacity:.4}
.zl-vh.drop-l{box-shadow:inset 3px 0 0 var(--zp-accent)}.zl-vh.drop-r{box-shadow:inset -3px 0 0 var(--zp-accent)}
.zl-x{font-weight:550;color:var(--zp-text)}.zl-x .mut{color:var(--zp-muted);font-weight:500}.zl-xh{white-space:nowrap}
.zl-n.ok{color:var(--zp-ok)}.zl-n.bad{color:var(--zp-bad)}.zl-n.mut{color:var(--zp-muted);font-weight:500}
.zl-chev{color:var(--zp-muted);transition:transform .15s;justify-self:end}
.zl-row.open .zl-chev{transform:rotate(180deg)}
.zl-det{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:2px 0 12px 110px;cursor:default}
.zl-chip{height:28px;padding:0 11px;border-radius:9px;background:var(--zp-bg);border:1px solid var(--zp-line);font-size:12.5px;font-weight:600;display:inline-flex;align-items:center;gap:6px;color:var(--zp-text)}
.zl-chip:hover{border-color:var(--zp-accent);color:var(--zp-accent)}
.zl-chip.gap{background:transparent;border-style:dashed;color:var(--zp-muted);font-weight:500;cursor:default}
.zl-chip.gap.lunch{color:var(--zp-warn);border-color:color-mix(in srgb,var(--zp-warn) 45%,transparent)}
.zl-chip.act{background:var(--zp-surf2)}
.zl-det .meta{font-size:12px;color:var(--zp-muted);margin-left:6px}
.zl-more{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin:10px 0 4px;height:38px;border:1px dashed var(--zp-line);border-radius:12px;color:var(--zp-muted);font-weight:600}
.zl-more:hover{color:var(--zp-text);border-color:var(--zp-accent)}
@media (max-width:980px){.zl-cols,.zl-row{grid-template-columns:var(--zl-gridm,80px 1fr 60px 64px 18px)}.zl-tl,.zl-cols .tlh,.zl-n.ist,.zl-cols .isth{display:none}.zl-det{padding-left:0}}

/* ───── Overlays ───── */
#zp-sticky{position:fixed;top:12px;left:50%;transform:translate(-50%,-180%);z-index:2147483000;display:flex;align-items:center;gap:12px;padding:8px 16px;border-radius:99px;
  background:color-mix(in srgb,var(--zp-bg) 88%,transparent);backdrop-filter:blur(12px);color:var(--zp-text);border:1px solid var(--zp-line);box-shadow:var(--zp-shadow);
  transition:transform .35s cubic-bezier(.2,.8,.2,1);cursor:pointer;white-space:nowrap;font-size:12.5px}
#zp-sticky.show{transform:translate(-50%,0)}
#zp-sticky b{font-weight:650}
#zp-sticky .m{color:var(--zp-muted)}

 #zp-ypdf{position:fixed;inset:0;z-index:2147483002;background:rgba(4,6,12,.55);backdrop-filter:blur(5px);display:grid;place-items:center}
.zy-box{width:min(460px,94vw);background:var(--zp-bg);color:var(--zp-text);border:1px solid var(--zp-line);border-radius:18px;box-shadow:0 30px 80px rgba(0,0,0,.5);padding:18px;display:grid;gap:12px}
.zy-h{display:flex;align-items:center;justify-content:space-between}.zy-h b{display:flex;align-items:center;gap:8px;font-size:15px}.zy-h .ic{color:var(--zp-accent)}
.zy-yr{display:flex;align-items:center;justify-content:center;gap:14px}.zy-yr b{font-size:26px;font-weight:700;min-width:80px;text-align:center}
.zy-l{font-size:10.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--zp-muted)}
.zy-f{justify-self:start}
.zy-ms{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}
.zy-m{display:flex;align-items:center;justify-content:center;gap:6px;height:32px;border-radius:9px;background:var(--zp-surf);border:1px solid var(--zp-line);font-size:12.5px;font-weight:600}
.zy-m i{width:7px;height:7px;border-radius:50%;background:var(--zp-muted)}
.zy-m.off{opacity:.35}.zy-m.run i{background:var(--zp-accent);animation:zpspin2 .8s ease-in-out infinite alternate}.zy-m.ok{border-color:color-mix(in srgb,var(--zp-ok) 55%,var(--zp-line))}.zy-m.ok i{background:var(--zp-ok)}.zy-m.bad i{background:var(--zp-bad)}.zy-m.bad{border-color:var(--zp-bad)}
@keyframes zpspin2{to{transform:scale(1.8);opacity:.4}}
.zy-t{margin:0;font-size:12.5px;color:var(--zp-muted);line-height:1.45}
.zy-b{display:flex;justify-content:flex-end;gap:8px}
.zp-btn:disabled{opacity:.5;cursor:default}
#zp-modal{position:fixed;inset:0;z-index:2147483001;background:rgba(4,6,12,.55);backdrop-filter:blur(5px);display:grid;place-items:center}
.zp-dlg{width:min(760px,95vw);height:min(660px,90vh);display:grid;grid-template-columns:190px minmax(0,1fr);background:var(--zp-bg);color:var(--zp-text);
  border:1px solid var(--zp-line);border-radius:calc(var(--zp-r) + 6px);box-shadow:0 40px 100px rgba(0,0,0,.5);overflow:hidden;animation:zpIn .22s cubic-bezier(.2,.8,.2,1)}
@media (max-width:640px){.zp-dlg{grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr)}}
@keyframes zpIn{from{transform:translateY(12px) scale(.98);opacity:0}}
.zp-side{background:var(--zp-surf);border-right:1px solid var(--zp-line);padding:16px 10px;display:flex;flex-direction:column;gap:2px}
@media (max-width:640px){.zp-side{flex-direction:row;overflow:auto;border-right:0;border-bottom:1px solid var(--zp-line)}}
.zp-side .ttl{display:flex;align-items:center;gap:9px;margin:0 6px 14px;font-weight:700;font-size:15px}
.zp-side .ttl .zp-logo{width:26px;height:26px;border-radius:8px}
.zp-tab{display:flex;align-items:center;gap:10px;text-align:left;height:36px;padding:0 10px;border-radius:10px;font-weight:600;color:var(--zp-muted);white-space:nowrap}
.zp-tab:hover{background:var(--zp-surf2);color:var(--zp-text)}
.zp-tab.on{background:var(--zp-bg);color:var(--zp-text);box-shadow:0 0 0 1px var(--zp-line)}
.zp-tab.on .ic{color:var(--zp-accent)}
.zp-side .ver{margin-top:auto;font-size:11px;color:var(--zp-muted);padding:8px 10px;line-height:1.5}
.zp-main{display:flex;flex-direction:column;min-height:0;min-width:0}
.zp-main-head{display:flex;align-items:center;justify-content:space-between;padding:16px 20px 10px;border-bottom:1px solid var(--zp-line)}
.zp-main-head h4{margin:0;font-size:16px;font-weight:700;letter-spacing:-.01em}
.zp-scroll{overflow-y:auto;overflow-x:hidden;padding:14px 20px 22px;flex:1}
.zp-scroll::-webkit-scrollbar{width:10px}.zp-scroll::-webkit-scrollbar-thumb{background:var(--zp-surf2);border-radius:9px;border:3px solid var(--zp-bg)}
.zp-pane{display:none;flex-direction:column;gap:4px}
.zp-pane.on{display:flex}
.zp-sec{font-size:11px;font-weight:650;letter-spacing:.06em;text-transform:uppercase;color:var(--zp-muted);margin:16px 0 6px}
.zp-sec:first-child{margin-top:2px}
.zp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.zp-sw{display:block;width:100%;border:1px solid var(--zp-line);border-radius:13px;padding:8px;background:var(--zp-surf);text-align:left;transition:.15s}
.zp-sw:hover{border-color:color-mix(in srgb,var(--zp-accent) 50%,var(--zp-line));transform:translateY(-1px)}
.zp-sw.on{border-color:var(--zp-accent);box-shadow:0 0 0 3px var(--zp-soft)}
.zp-sw .pv{height:54px;border-radius:9px;background:var(--b);display:flex;flex-direction:column;justify-content:space-between;padding:8px;margin-bottom:8px;border:1px solid rgba(127,127,127,.18)}
.zp-sw .pv .l1{display:flex;gap:4px}
.zp-sw .pv .l1 i{height:6px;border-radius:4px;background:var(--c);flex:1}
.zp-sw .pv .l1 i:first-child{flex:.6;background:var(--a)}
.zp-sw .pv .l2{display:flex;gap:4px;align-items:flex-end}
.zp-sw .pv .l2 i{width:22px;height:18px;border-radius:5px;background:var(--c)}
.zp-sw .pv .l2 i:first-child{background:var(--a);height:24px}
.zp-sw .nm{display:flex;align-items:center;justify-content:space-between;font-size:12.5px;font-weight:600}
.zp-sw .nm .ic{color:var(--zp-accent)}
.zp-row{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:10px 0;border-bottom:1px solid color-mix(in srgb,var(--zp-line) 60%,transparent)}
.zp-row:last-child{border-bottom:0}
.zp-row > span:first-child{min-width:0;font-weight:500}
.zp-row small{display:block;color:var(--zp-muted);font-size:11.5px;margin-top:2px;font-weight:400}
.zp-in{background:var(--zp-surf);color:var(--zp-text);border:1px solid var(--zp-line);border-radius:9px;height:32px;padding:0 9px;width:104px;flex:none;outline:none}
.zp-in:focus{border-color:var(--zp-accent)}
.zp-color{width:42px;height:32px;border:1px solid var(--zp-line);border-radius:9px;background:var(--zp-surf);padding:3px;cursor:pointer}
.zp-segc{display:inline-flex;padding:3px;border:1px solid var(--zp-line);border-radius:11px;background:var(--zp-surf);flex:none;gap:2px}
.zp-segc button{height:26px;padding:0 11px;border-radius:8px;font-size:12px;font-weight:600;color:var(--zp-muted)}
.zp-segc button:hover{color:var(--zp-text)}
.zp-segc button.on{background:var(--zp-accent);color:var(--zp-onacc,#fff)}
.zp-brwe{display:flex;gap:3px;margin:8px 0 6px}
.zp-brwe i{flex:1;height:7px;border-radius:3px;background:var(--zp-surf2,#eceef3);box-shadow:inset 0 0 0 1px var(--zp-line)}
.zp-brwe i.d{background:var(--zp-bad);box-shadow:none}
.zp-brwe i.p{background:color-mix(in srgb,var(--zp-bad) 35%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--zp-bad) 60%,transparent)}
.zp-brwe i.x{outline:1.5px solid var(--zp-bad);outline-offset:1px}
.zp-tg{position:relative;width:40px;height:23px;flex:none;-webkit-appearance:none;appearance:none;border-radius:99px;background:var(--zp-surf2);border:1px solid var(--zp-line);cursor:pointer;transition:.2s;margin:0}
.zp-tg::after{content:'';position:absolute;top:2px;left:2px;width:17px;height:17px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.35);transition:.2s}
.zp-tg:checked{background:var(--zp-accent);border-color:var(--zp-accent)}
.zp-tg:checked::after{left:19px}
.zp-lay{display:flex;flex-direction:column;gap:6px}
.zp-lay-row{display:flex;align-items:center;gap:8px;background:var(--zp-surf);border:1px solid var(--zp-line);border-radius:12px;padding:8px 10px}
.zp-lay-row .ico{width:30px;height:30px;border-radius:9px;background:var(--zp-surf2);display:grid;place-items:center;color:var(--zp-accent);flex:none}
.zp-lay-row .n{flex:1;font-weight:600;min-width:0}
.zp-lay-row .n small{display:block;font-weight:400;color:var(--zp-muted);font-size:11.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.zp-lay-row.off .n,.zp-lay-row.off .ico{opacity:.45}
.zp-mb{width:28px;height:28px;border-radius:8px;border:1px solid var(--zp-line);background:var(--zp-bg);display:grid;place-items:center;flex:none;color:var(--zp-muted)}
.zp-mb:hover{border-color:var(--zp-accent);color:var(--zp-text)}
.zp-mb:disabled{opacity:.3;cursor:default}
.zp-mb.on{background:var(--zp-accent);border-color:var(--zp-accent);color:var(--zp-onacc,#fff)}
.zp-note{font-size:12px;color:var(--zp-muted);background:var(--zp-surf);border:1px solid var(--zp-line);border-radius:12px;padding:10px 12px;line-height:1.55;margin-top:6px}
.zp-note b{color:var(--zp-text);font-weight:600}
.zp-kbd{display:inline-block;padding:1px 6px;border-radius:6px;border:1px solid var(--zp-line);background:var(--zp-surf2);font-size:11px;font-weight:600;color:var(--zp-text)}

#zp-fab{position:fixed;left:16px;bottom:16px;z-index:2147483000;height:38px;padding:0 14px 0 6px;border-radius:99px;border:1px solid var(--zp-line);display:flex;align-items:center;gap:8px;
  background:var(--zp-bg);color:var(--zp-text);font-size:12.5px;font-weight:650;box-shadow:var(--zp-shadow)}
#zp-fab .zp-logo{width:26px;height:26px;border-radius:99px}
#zp-fab.err{border-color:var(--zp-bad);color:var(--zp-bad)}
#zp-toasts{position:fixed;right:18px;bottom:18px;z-index:2147483002;display:flex;flex-direction:column;gap:8px;align-items:flex-end;pointer-events:none}
.zp-toast{pointer-events:auto;max-width:360px;display:flex;gap:11px;align-items:flex-start;padding:12px 15px;border-radius:14px;background:var(--zp-bg);color:var(--zp-text);
  border:1px solid var(--zp-line);box-shadow:0 18px 50px rgba(0,0,0,.4);animation:zpIn .25s ease;cursor:pointer}
.zp-toast .ti{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;flex:none;background:var(--zp-soft);color:var(--zp-accent)}
.zp-toast.bad .ti{background:color-mix(in srgb,var(--zp-bad) 15%,transparent);color:var(--zp-bad)}
.zp-toast b{display:block;font-weight:650;margin-bottom:1px}
.zp-toast span{color:var(--zp-muted);font-size:12px}
#zp-confetti{position:fixed;inset:0;pointer-events:none;z-index:2147483003}
#zp-fxp{position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:2147482990;opacity:.55}
`;

    let fxHoldUntil = 0, fxDown = false;
    const fxBusy = () => fxDown || Date.now() < fxHoldUntil;
    try {
        window.addEventListener('scroll', () => { fxHoldUntil = Date.now() + 350; }, { capture: true, passive: true });
        window.addEventListener('pointerdown', () => { fxDown = true; }, { capture: true, passive: true });
        ['pointerup', 'pointercancel', 'blur'].forEach(t => window.addEventListener(t, () => { fxDown = false; fxHoldUntil = Date.now() + 250; }, { capture: true, passive: true }));
    } catch (e) { }
    try { if (window.CSS && CSS.registerProperty) CSS.registerProperty({ name: '--zpa', syntax: '<angle>', inherits: false, initialValue: '0deg' }); } catch (e) { }
    function injectPageCss() {
        if (document.getElementById('zp-page-style')) return;
        const st = document.createElement('style');
        st.id = 'zp-page-style';
        st.textContent = PAGE_CSS;
        (document.head || document.documentElement).appendChild(st);
    }
    function mkRoot(host) {
        const root = host.attachShadow({ mode: 'open' });
        const st = document.createElement('style');
        st.textContent = UI_CSS;
        root.appendChild(st);
        return root;
    }
    function overlay() {
        if (O) return O;
        const host = document.createElement('div');
        host.id = 'zp-overlay';
        host.style.cssText = 'position:static !important';
        document.body.appendChild(host);
        O = mkRoot(host);
        return O;
    }
    const LOGO = `<span class="zp-logo">${ico('clock', 15)}</span>`;

    /* ════════════════════ FEHLER / TOASTS ════════════════════ */
    let lastErr = null;
    /* ───── Update-Hinweis: fragt GitHub nach der neuesten Version; Klick öffnet den Link → Tampermonkey zeigt „Aktualisieren“ ───── */
    const RAW_URL = 'https://raw.githubusercontent.com/raina5505/lhr-zeitplus/main/lhr-zeitplus.user.js';
    const vNum = v => String(v || '0').split('.').map(n => parseInt(n, 10) || 0);
    const vNewer = (a, b) => { const x = vNum(a), y = vNum(b); for (let i = 0; i < 3; i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); } return false; };
    const updState = () => { try { return JSON.parse(localStorage.getItem('zplus_upd') || '{}') || {}; } catch (e) { return {}; } };
    const updAvail = () => { const u = updState(); return !!(u.latest && vNewer(u.latest, VERSION)); };
    const API_URL = 'https://api.github.com/repos/raina5505/lhr-zeitplus/commits/main';
    const pinUrl = sha => 'https://raw.githubusercontent.com/raina5505/lhr-zeitplus/' + sha + '/lhr-zeitplus.user.js';
    const tfetch = (url, ms, opt) => { let ctl = null; try { ctl = new AbortController(); setTimeout(() => ctl.abort(), ms || 8000); } catch (e) { } return fetch(url, Object.assign({ cache: 'no-store', credentials: 'omit', signal: ctl ? ctl.signal : undefined }, opt || {})); };
    // neueste Version holen – zuerst über den letzten Commit (Link mit Commit-Kennung → kein Zwischenspeicher dazwischen), sonst direkt
    async function latestInfo() {
        const errs = [];
        try {
            const r = await tfetch(API_URL, 8000, { headers: { Accept: 'application/vnd.github+json' } });
            if (!r.ok) throw 'GitHub ' + r.status;
            const sha = ((await r.json()) || {}).sha; if (!sha) throw 'kein Commit';
            const r2 = await tfetch(pinUrl(sha)); if (!r2.ok) throw 'Datei ' + r2.status;
            const m = (await r2.text()).match(/@version\s+([\d.]+)/); if (!m) throw 'keine Version';
            return { latest: m[1], url: pinUrl(sha) };
        } catch (e) { errs.push(String(e && e.name === 'AbortError' ? 'Zeitüberschreitung' : e && e.message || e)); }
        try {
            const r = await tfetch(RAW_URL + '?t=' + Date.now()); if (!r.ok) throw 'Datei ' + r.status;
            const m = (await r.text()).match(/@version\s+([\d.]+)/); if (!m) throw 'keine Version';
            return { latest: m[1], url: RAW_URL };
        } catch (e) { errs.push(String(e && e.name === 'AbortError' ? 'Zeitüberschreitung' : e && e.message || e)); }
        throw errs.join(' / ');
    }
    function openUpdate() {           // Tab muss direkt im Klick aufgehen, sonst blockt ihn der Browser → leer öffnen, Link danach setzen
        let w = null; try { w = window.open('', '_blank'); } catch (e) { }
        const go = url => {
            if (w && !w.closed) { try { w.location.href = url; return; } catch (e) { } }
            const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener';
            try { document.body.appendChild(a); a.click(); a.remove(); } catch (e) { location.href = url; }
        };
        if (w) { try { w.document.write('<title>LHR Zeit + – Update</title><body style="font:15px system-ui;background:#16130f;color:#eee;display:grid;place-items:center;height:90vh">Neueste Version wird geladen …</body>'); } catch (e) { } }
        const u = updState();
        latestInfo().then(i => {
            try { localStorage.setItem('zplus_upd', JSON.stringify({ latest: i.latest, url: i.url, checked: Date.now() })); } catch (e) { }
            if (SH) safe('App-Leiste', renderShell);
            go(i.url);
            toast(vNewer(i.latest, VERSION) ? 'Update ' + i.latest + ' öffnet sich' : 'Du hast schon ' + VERSION, vNewer(i.latest, VERSION) ? 'Im neuen Tab auf <b>„Aktualisieren“</b> klicken, danach diese Seite neu laden.' : 'Im neuen Tab kannst du sie trotzdem neu installieren.', { icon: 'refresh', ms: 12000 });
        }).catch(err => {
            go(u.url || RAW_URL);
            toast('GitHub nicht erreichbar', 'Ich öffne den Update-Link direkt. (' + String(err).slice(0, 120) + ')', { icon: 'alert', ms: 12000 });
        });
    }
    function checkUpdate(manual, force) {
        const u = updState();
        if (!manual && !force && u.checked && Date.now() - u.checked < 15 * 60e3) { if (updAvail() && SH) renderShell(); return; }
        latestInfo().then(i => {
            const latest = i.latest, had = u.latest;
            try { localStorage.setItem('zplus_upd', JSON.stringify({ latest, url: i.url, checked: Date.now() })); } catch (e) { }
            if (SH) safe('App-Leiste', renderShell);
            if (vNewer(latest, VERSION)) {
                if (manual || had !== latest) {
                    const box = overlay(); toast('Update verfügbar: ' + latest, 'Du hast ' + VERSION + '. Hier oder oben auf „Update“ klicken → dann in Tampermonkey „Aktualisieren“.', { icon: 'refresh', ms: 15000 });
                    const ts = box.getElementById('zp-toasts'), t = ts && ts.lastElementChild; if (t) t.addEventListener('click', openUpdate);
                }
            } else if (manual) toast('Alles aktuell', 'Du hast die neueste Version ' + VERSION + '.', { icon: 'check', ms: 5000 });
        }).catch(err => { if (manual) toast('Update-Prüfung fehlgeschlagen', String(err).slice(0, 140), { icon: 'alert', ms: 9000 }); });
    }
    function toast(title, text, opts) {
        opts = opts || {};
        if (!document.body) return;
        const root = overlay();
        let box = root.getElementById('zp-toasts');
        if (!box) { box = el('div', 'zp-font'); box.id = 'zp-toasts'; root.appendChild(box); }
        const t = el('div', 'zp-toast' + (opts.bad ? ' bad' : ''), `<div class="ti">${ico(opts.icon || (opts.bad ? 'alert' : 'bell'), 15)}</div><div><b>${title}</b>${text ? '<span>' + text + '</span>' : ''}</div>`);
        t.addEventListener('click', () => t.remove());
        box.appendChild(t);
        while (box.children.length > 4) box.firstChild.remove();
        setTimeout(() => t.remove(), opts.ms || 9000);
    }
    function reportError(where, e) {
        lastErr = where + ': ' + (e && e.message ? e.message : e);
        try { console.error('[Zeit+]', where, e); } catch (x) { }
        const fab = $('zp-fab');
        if (fab) { fab.classList.add('err'); fab.style.display = 'flex'; fab.title = 'Zeit+ Fehler – ' + lastErr; }
        toast('Zeit+ Fehler', esc(lastErr) + '<br>Ein Screenshot davon hilft beim Fixen.', { bad: true, ms: 15000 });
    }

    /* ════════════════════ DATEN LESEN ════════════════════ */
    function groupDays() {
        const body = tbody(), map = new Map();
        if (!body) return map;
        body.querySelectorAll('tr[data-periode]').forEach(r => {
            const k = r.getAttribute('data-periode');
            if (!/^\d\d\.\d\d\.\d{4}$/.test(k)) return;
            if (!map.has(k)) map.set(k, []);
            map.get(k).push(r);
        });
        return map;
    }
    const lastVal = (rows, nr) => { let v = null; rows.forEach(r => { const c = r.querySelector('td[data-zsp-nr="' + nr + '"]'); const x = c && parseDur(c.textContent); if (x != null) v = x; }); return v; };
    const sollRaw = rows => { const c = rows[0] && rows[0].querySelector('td.td_soll_pause_uz'); return parseDur(c && c.textContent) || 0; };
    // Bereitschaftstag mit Soll → immer das Bereitschafts-Soll (Standard 5:00); ohne Soll (Wochenende/Feiertag) bleibt 0
    const sollOf = rows => { const r = sollRaw(rows); if (r > 0 && isBR(rows)) { const b = parseDur(S.brSoll || '05:00'); if (b != null && b > 0) return b; } return r; };
    /* Bereitschaft: Arbeitsmodell (ZM) z.B. „EITBR“ – Soll meist 5:00, Einsatz = Buchungen an Bereitschaftstagen ohne Soll */
    const brList = () => String(S.brZM || 'EITBR').split(/[,;\s]+/).map(x => x.trim().toUpperCase()).filter(Boolean);
    const zmOf = rows => { for (const r of rows) { const c = r.querySelector('td.td_zm'); const t = c && c.textContent.trim(); if (t) return t.toUpperCase(); } return ''; };
    const isBR = rows => { const z = zmOf(rows); return !!z && brList().includes(z); };
    const BR_KEY = 'zplus_br';
    const brStore = () => { try { return JSON.parse(localStorage.getItem(BR_KEY) || '{}') || {}; } catch (e) { return {}; } };
    /* Wochenend-Dienst nach KV IT § 5 (max. 10 Wochenenden / 12 Monate) – zählt nur tatsächlich gestempelte Arbeit
       in der Wochenendruhe nach ARG § 3: ab Samstag 13:00 durchgehend 36 h (bis Montag 01:00). Reine Rufbereitschaft ohne Einsatz zählt nicht. */
    const WE_KEY = 'zplus_wework';
    const weStore = () => { try { return JSON.parse(localStorage.getItem(WE_KEY) || '{}') || {}; } catch (e) { return {}; } };
    function weMinutes(rows, dt) {
        const dow = dt.getDay(), win = dow === 6 ? [780, 1440] : dow === 0 ? [0, 1440] : dow === 1 ? [0, 60] : null; if (!win) return 0;
        const mm = t => { const m = String(t || '').match(/(\d{1,2}):(\d{2})/); return m ? +m[1] * 60 + +m[2] : null; };
        const isToday = dayKey(dt) === todayKey(), nowM = new Date().getHours() * 60 + new Date().getMinutes();
        let sum = 0;
        rows.forEach(r => {
            const zd = r.querySelector('td.td_zeitdaten'); if (!zd) return;
            const a = zd.querySelector('.td_text1_isDate'), b = zd.querySelector('.td_text2_isDate');
            const s0 = a && mm(a.textContent); if (s0 == null) return;
            let e0 = b ? mm(b.textContent) : null;
            if (e0 == null) { if (!isToday) return; e0 = nowM; }
            if (e0 < s0) e0 += 1440;                     // über Mitternacht
            sum += Math.max(0, Math.min(e0, win[1]) - Math.max(s0, win[0]));
        });
        return sum;
    }
    function rememberBR(days) {                 // Bereitschaftstage merken (für den Kalender)
        try {
            const we = weStore(); let wch = false;
            for (const [k, rows] of days) {
                const dt = keyDate(k), dow = dt.getDay(); if (dow !== 6 && dow !== 0 && dow !== 1) continue;
                const m = weMinutes(rows, dt);
                if (m > 0) { if (we[k] !== m) { we[k] = m; wch = true; } } else if (we[k]) { delete we[k]; wch = true; }
            }
            if (wch) localStorage.setItem(WE_KEY, JSON.stringify(we));
        } catch (e) { }
        try {
            const st = brStore(); let ch = false; const ym = new Set();
            for (const [k] of days) ym.add(k.slice(3));
            Object.keys(st).forEach(k => { if (ym.has(k.slice(3))) { delete st[k]; ch = true; } });   // Monat neu einlesen
            for (const [k, rows] of days) if (isBR(rows)) { st[k] = sollRaw(rows) ? 1 : 2; ch = true; }
            if (ch) localStorage.setItem(BR_KEY, JSON.stringify(st));
        } catch (e) { }
    }
    const ABS_RE = /(\d{1,2}:\d{2})\s*(Urlaub|Zeitausgleich|Arzt|Krank\w*|Sonderurlaub|Pflege\w*|Beh(ö|oe)rde\w*|Kur\w*|Bildungs\w*|Schulung\w*|Feiertag)/i;
    const partAbs = rows => rows.some(r => { const z = r.querySelector('td.td_zeitdaten'); const m = z && z.textContent.replace(/\s+/g, ' ').match(ABS_RE); return !!m; }) && sollOf(rows) > 0;
    const keyDate = k => { const p = k.split('.').map(Number); return new Date(p[2], p[1] - 1, p[0]); };

    function readDay() {
        const days = groupDays();
        const key = todayKey();
        const rows = days.get(key);
        if (!rows || !rows.length) return null;
        const segs = [];
        let pauseCol = null, info = '';
        rows.forEach(r => {
            const pc = r.querySelectorAll('td.td_soll_pause_uz')[1];
            const pv = pc && parseDur(pc.textContent);
            if (pv != null) pauseCol = (pauseCol || 0) + pv;
            const zd = r.querySelector('td.td_zeitdaten');
            if (!zd) return;
            const a = zd.querySelector('.td_text1_isDate'), b = zd.querySelector('.td_text2_isDate');
            if (a) {
                const s = parseClock(a.textContent);
                if (s == null) return;
                segs.push({ s, e: b ? parseClock(b.textContent) : null });
            } else if (!info) {
                const t = zd.textContent.replace(/[_?]/g, '').replace(/\s+/g, ' ').trim();
                if (t && !/^\d{1,2}:\d{2}$/.test(t) && !/Periodenschluss|Abrechnung|Übertrag|Vorträge/.test(t)) info = t;
            }
        });
        let carry = 0;
        for (const [k, rs] of days) { if (k === key) break; const v = lastVal(rs, 3); if (v != null) carry = v; }
        const dToday = new Date().getDate();
        const missingDays = [...tbody().querySelectorAll('tr[id^="tag-"]')].filter(r => parseInt(r.id.slice(4), 10) < dToday && r.querySelector('img.fehlbuch'));
        return { rows, days, soll: sollOf(rows), segs, pauseCol, carry, info, missingDays };
    }

    function readWeek(days, todayEff) {
        const now = new Date();
        const mon = new Date(now); mon.setHours(12, 0, 0, 0); mon.setDate(now.getDate() - ((now.getDay() + 6) % 7));
        let ist = 0, soll = 0, sollToToday = 0, partial = false;
        const list = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(mon); d.setDate(mon.getDate() + i);
            const rows = days.get(dayKey(d));
            const isToday = d.toDateString() === now.toDateString();
            const past = d < now && !isToday;
            if (!rows) { if (i < 5) { partial = partial || past; list.push({ i, ist: null, soll: 0, isToday }); } continue; }
            const s = sollOf(rows);
            soll += s;
            if (past || isToday) sollToToday += s;
            let di = 0;
            if (isToday) di = todayEff; else if (past) di = lastVal(rows, 2) || 0;
            ist += di;
            if (i < 5) list.push({ i, ist: past || isToday ? di : null, soll: s, isToday });
        }
        return { ist, soll, sollToToday, partial, list };
    }

    function readMonth(days, liveEff, liveSaldo) {
        const tk = todayKey(), t0 = new Date(); t0.setHours(0, 0, 0, 0);
        let ist = 0, soll = 0, sollTo = 0, run = null;
        const pts = [];
        for (const [k, rows] of days) {
            const dt = keyDate(k), isT = k === tk, past = dt < t0;
            const s = sollOf(rows);
            soll += s;
            if (past || isT) sollTo += s;
            if (isT) { ist += liveEff; run = liveSaldo; }
            else if (past) { ist += lastVal(rows, 2) || 0; const v = lastVal(rows, 3); if (v != null) run = v; }
            pts.push({ d: dt.getDate(), v: (past || isT) ? (run == null ? 0 : run) : null, isT });
        }
        return { ist, soll, sollTo, pts };
    }

    let ruBusy = false;
    async function ruYearFetch() {           // Kalender unsichtbar laden und „Resturlaub per Ende 12.JJJJ“ auslesen
        if (ruBusy || Date.now() - (ruYearFetch.t || 0) < 5 * 60e3) return; ruBusy = true; ruYearFetch.t = Date.now();
        const a = document.getElementById('zm_kalender');
        const fr = hiddenFrame('zp-kal', a ? a.getAttribute('href') : '/Self/kalender?modulId=0');
        try {
            const el = () => { try { return fr.contentDocument && fr.contentDocument.getElementById('resturlaub_kalender'); } catch (e) { return null; } };
            await zwait(() => { const e = el(); return e && /:\s*-?[\d.,]+/.test(e.textContent); }, 20000);
            const t = ((el() || {}).textContent || '').replace(/\s+/g, ' ').trim(), m = t.match(/:\s*(-?[\d.,]+)\s*(Tag\w*|Std\w*|h)?/i);
            if (m) {
                let old = null; try { old = JSON.parse(localStorage.getItem('zplus_ruy') || 'null'); } catch (e) { }
                const y = new Date().getFullYear(), keep = old && old.y === y ? old : {};
                localStorage.setItem('zplus_ruy', JSON.stringify(Object.assign({}, keep, { y, val: m[1], unit: m[2] || 'Tage', per: (t.match(/Ende\s+([\d.]+)/i) || [])[1] || '', ts: Date.now() })));
                safe('Render', render);
            }
        } catch (e) { }
        ruBusy = false; setTimeout(() => fr.remove(), 500);
    }
    function readUrlaub() {
        const e = document.getElementById('resturlaub') || document.getElementById('resturlaub_kalender');
        return e ? e.textContent.replace(/\s+/g, ' ').trim() : null;
    }

    function kernEnd() {
        if (!S.kern) return null;
        const dow = new Date().getDay();
        if (dow >= 1 && dow <= 4) return at(S.kzMoDo);
        if (dow === 5) return at(S.kzFr);
        return null;
    }

    /* ════════════════════ BERECHNUNG ════════════════════
       • Mittag = größte Ausstempel-Lücke, deren Mitte im Mittagsfenster liegt (≥ Mindestlänge)
       • Fehlt etwas zur Pflichtpause und der Tag ist > 6 h, zieht das System die Differenz ab
       • Alle anderen Lücken = Raucherpausen                                                    */
    function calc(d, now) {
        const br = isBR(d.rows), noPause = br || partAbs(d.rows);
        let segs = d.segs.map(x => Object.assign({}, x));
        let night = [];
        const early = br && S.brStart ? S.brStart : S.earliest;
        if (br && S.brStart) {        // Bereitschaft: Nacht-Buchungen vor dem Beginn zählen nicht zu den 5 h
            const bs = at(S.brStart) - 30 * M;
            night = segs.filter(x => x.e != null && x.e <= bs);
            segs = segs.filter(x => !night.includes(x));
        }
        if (early && segs[0] && segs[0].s < at(early)) segs[0].s = Math.min(at(early), segs[0].e || Infinity);
        let closed = 0, openMs = 0, open = null, broken = 0;
        segs.forEach((x, i) => {
            if (x.e != null) closed += Math.max(0, x.e - x.s);
            else if (i === segs.length - 1) { open = x; openMs = Math.max(0, now - x.s); }
            else broken++;
        });
        const gross = closed + openMs;
        const wF = at(S.lunchFrom), wT = at(S.lunchTo);
        const gaps = [];
        for (let i = 1; i < segs.length; i++) {
            const a = segs[i - 1].e, b = segs[i].s;
            if (a == null || b <= a) continue;
            const mid = (a + b) / 2;
            gaps.push({ s: a, e: b, len: b - a, inWin: mid >= wF && mid <= wT && (b - a) >= S.lunchMinLen * M });
        }
        let lunch = null;
        gaps.forEach(g => { if (g.inWin && (!lunch || g.len > lunch.len)) lunch = g; });
        if (lunch) lunch.lunch = true;
        const smoke = gaps.filter(g => !g.lunch);
        const smokeSum = smoke.reduce((s, g) => s + g.len, 0);
        const pflicht = noPause ? 0 : S.pflicht * M, sixH = S.abH * H;
        const sysDed = d.pauseCol;
        const lunchUpcoming = !noPause && !lunch && sysDed == null && now < wT && (!!open || !segs.length);
        const plannedLen = lunchUpcoming ? S.planLunch * M : 0;
        const lunchLen = lunch ? lunch.len : plannedLen;
        // Pausenabzug NUR aus der LHR-Pause-Spalte (LHR trägt den gesetzlichen Abzug selbst ein)
        const dedFinal = sysDed != null ? sysDed : 0;
        const dedShown = sysDed != null ? sysDed : 0;
        const dedNow = sysDed != null ? sysDed : 0;
        const eff = Math.max(0, gross - dedNow);
        const kz = br ? null : kernEnd();
        const finish = (target, useKern) => {
            if (eff >= target) {         // Ziel schon erreicht – mit Kernzeit trotzdem erst ab Kernzeit-Ende Feierabend
                const reached = now - (eff - target);
                if (useKern && kz && reached < kz) return { done: now >= kz, at: kz, need: 0, kzHit: true };
                return { done: true, at: reached, need: 0 };
            }
            const long = target > sixH;
            const G = long ? target + dedFinal : target;
            const need = Math.max(0, G - gross) + (long && lunchUpcoming ? plannedLen : 0);
            let t = now + need, kzHit = false;
            if (useKern && kz && t < kz) { t = kz; kzHit = true; }
            return { done: false, at: t, need: G - gross, kzHit };
        };
        const effAt = t => {
            let g = gross + (open ? Math.max(0, t - now) : 0);
            let ll = lunch ? lunch.len : 0;
            if (lunchUpcoming && open && t > Math.max(now, wF)) { const taken = Math.min(plannedLen, t - Math.max(now, wF)); g -= taken; ll = taken; }
            const ded = sysDed != null ? sysDed : 0;
            return Math.max(0, g - ded);
        };
        const tg = eff - d.soll;
        return {
            br, noPause, night, nightMs: night.reduce((a, x) => a + (x.e - x.s), 0),
            segs, open, broken, gross, eff, gaps, lunch, smoke, smokeSum, sysDed, dedNow, dedFinal, dedShown, lunchUpcoming, plannedLen, wF, wT,
            sollF: finish(d.soll, true), salF: finish(d.soll - d.carry, S.kernSaldo !== false), maxF: finish(S.maxDay * H, false),
            tg, saldo: d.carry + tg, effAt, windowOver: now >= wT
        };
    }

    /* ════════════════════ DASHBOARD ════════════════════ */
    const CARD_BODY = {
        heute: `<div class="zp-val num" id="zp-net">--:--</div><div class="zp-bar"><i id="zp-bar"></i></div><div class="zp-sub" id="zp-net-sub"></div>`,
        saldo: `<div class="zp-val num" id="zp-saldo">--:--</div><div class="zp-sub" id="zp-saldo-sub"></div>`,
        woche: `<div class="zp-val num" id="zp-week">--:--</div><div class="zp-days" id="zp-wdays"></div><div class="zp-sub" id="zp-week-sub"></div>`,
        pause: `<div class="zp-val num" id="zp-pause">--</div><div class="zp-sub" id="zp-pause-sub"></div><div class="zp-chips" id="zp-chips"></div>`,
        rauch: `<div class="zp-val num" id="zp-smoke">--</div><div class="zp-sub" id="zp-smoke-sub"></div>`,
        wunsch: `<div class="zp-wish"><input type="time" id="zp-wish-in" class="num"></div><div class="zp-val num" id="zp-wish">--</div><div class="zp-sub" id="zp-wish-sub"></div>`,
        monat: `<div class="zp-val num" id="zp-month">--</div><svg class="zp-spark" id="zp-spark" preserveAspectRatio="none"></svg><div class="zp-sub" id="zp-month-sub"></div>`,
        urlaub: `<div class="zp-urm" id="zp-url-mode"><button type="button" data-um="m">Monat</button><button type="button" data-um="j">Jahr</button></div><div class="zp-val num" id="zp-url">–</div><div class="zp-sub" id="zp-url-sub"></div>`,
        kommen: `<div class="zp-val num" id="zp-come">--:--</div><div class="zp-sub num" id="zp-come-sub"></div>`,
        brwe: `<div class="zp-val num" id="zp-brwe">–</div><div class="zp-brwe" id="zp-brwe-bar"></div><div class="zp-sub" id="zp-brwe-sub"></div>`
    };

    function buildDash() {
        const host = el('div');
        host.id = 'zp-host';
        const content = document.getElementById('content');
        content.parentNode.insertBefore(host, content);
        R = mkRoot(host);
        const dash = el('div', 'zp-font');
        dash.id = 'zp';
        if (S.collapsed) dash.classList.add('collapsed');
        dash.innerHTML = `
<div id="zp-fx"></div>
<div class="zp-head">
  <div class="zp-brand">${LOGO}<span class="zp-name">LHR Zeit +</span><span class="zp-status"><span class="zp-dot" id="zp-dot"></span><span id="zp-status"></span></span></div>
  <div class="zp-mini num" id="zp-mini"></div>
  <div class="zp-actions">
    <span class="zp-timer-pill num" id="zp-tpill"><span id="zp-tleft">00:00</span><button id="zp-tstop" title="Timer stoppen">${ico('x', 13)}</button></span>
    <span class="zp-clock num" id="zp-clock">--:--:--</span>
    <button class="zp-icon" id="zp-timer" title="Pausen-Timer (Alt+P)">${ico('timer', 17)}</button>
    <button class="zp-icon" id="zp-edit" title="Dashboard anpassen (Alt+E)">${ico('pencil', 16)}</button>
    <button class="zp-icon" id="zp-theme" title="Theme wechseln (Alt+T)">${ico('palette', 17)}</button>
    <button class="zp-icon" id="zp-gear" title="Einstellungen (Alt+S)">${ico('sliders', 16)}</button>
    <button class="zp-icon" id="zp-view" title="Kompakt (Alt+M)">${ico('minimize', 16)}</button>
    <button class="zp-icon" id="zp-fold" title="Ein-/Ausklappen (Alt+Z)">${ico('chevron', 17)}</button>
  </div>
</div>
<div class="zp-pop hidden" id="zp-tpop">
  <h4>${ico('timer', 15)} Pausen-Timer</h4>
  <div class="zp-chips" style="margin:0">${[5, 10, 15, 20, 30, 45].map(m => `<button class="zp-chip" data-tm="${m}">${m} min</button>`).join('')}</div>
  <div class="row"><input type="number" min="1" max="180" id="zp-tcustom" placeholder="Minuten" class="num"><button class="zp-btn pri" id="zp-tgo">Start</button></div>
  <div class="zp-sub">Meldet sich mit Ton und Hinweis – läuft auch nach Neuladen weiter.</div>
</div>
<div class="zp-banner hidden" id="zp-edit-banner">${ico('pencil', 16)}<span><b>Anpassen</b> – Karten ziehen zum Sortieren · ${'Breite'} und ${'Sichtbarkeit'} über die Knöpfe oben rechts an jeder Karte</span><span class="sp"></span><button class="zp-btn pri" id="zp-edit-done">${ico('check', 15)} Fertig</button></div>
<div class="zp-banner hidden" id="zp-welcome">${ico('sparkle', 16)}<span><b>Zeit+ ${VERSION}</b> – komplett neuer Look: App-Leiste oben mit Navigation, Monatswahl, „Neu“-Menü, PDF und Fertigmelden. Dazu die Monatsliste unter dem Dashboard (Original-Tabelle per Umschalter). Saison-Theme mit Effekten auf der ganzen Seite, Kompakt-Ansicht (Knopf neben dem Pfeil) und eine neue Tabelle. Weitere Karten wie Mittag, Raucherpausen oder Resturlaub blendest du im Layout ein.</span><span class="sp"></span><button class="zp-btn pri" id="zp-welcome-ok">Alles klar</button></div>
<div class="zp-body">
  <div class="zp-hero" title="Fortschritt zum Tages-Soll">
    <div class="zp-ring"><svg viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="42"/><circle class="fg" id="zp-ring" cx="50" cy="50" r="42" stroke-dasharray="263.9" stroke-dashoffset="263.9"/></svg>
      <div class="zp-ring-t"><b class="num" id="zp-ring-v">0%</b><span>vom Soll</span></div></div>
    <div class="zp-times">
      <div class="zp-time"><div class="zp-lbl">${ico('check', 14)}Soll erfüllt</div><div class="zp-big num" id="zp-soll-t">--:--</div><div class="zp-cd" id="zp-soll-cd"></div></div>
      <div class="zp-sep"></div>
      <div class="zp-time"><div class="zp-lbl">${ico('scale', 14)}Saldo ±0<button type="button" class="zp-kz" id="zp-kz" title="Kernzeit für Saldo ±0 berücksichtigen (aus = zeigt die echte ±0-Zeit, z.B. zum Überstunden abbauen)"></button></div><div class="zp-big num accent" id="zp-sal-t">--:--</div><div class="zp-cd" id="zp-sal-cd"></div></div>
    </div>
    <div class="zp-cstats" id="zp-cstats"></div>
    <div class="zp-foot" id="zp-foot"></div>
  </div>
  <div class="zp-cards" id="zp-cards">
    ${Object.keys(CARD_DEFS).map(id => `<div class="zp-card" data-card="${id}" title="${esc(CARD_DEFS[id].tip)}">
      <div class="zp-tools"><button data-act="wide" title="breit / schmal">${ico('width', 14)}</button><button data-act="hide" title="ein- / ausblenden">${ico('eye', 14)}</button></div>
      <div class="zp-lbl">${ico(CARD_DEFS[id].icon, 15)}${CARD_DEFS[id].name}</div>${CARD_BODY[id]}</div>`).join('')}
  </div>
  <div class="zp-tl" id="zp-tl">
    <div class="zp-track" id="zp-track"></div><div class="zp-ticks num" id="zp-ticks"></div>
    <div class="zp-legend" id="zp-legend"><span><i style="background:var(--zp-accent)"></i>gearbeitet</span><span><i style="background:var(--zp-ok)"></i>läuft</span>
      <span><i style="background:repeating-linear-gradient(45deg,var(--zp-warn) 0 2px,transparent 2px 4px)"></i>Mittag</span><span><i style="border:1px dashed var(--zp-warn)"></i>Mittagsfenster</span>
      <span><i style="background:var(--zp-muted)"></i>Raucherpause</span><span><i style="border:1.5px dashed var(--zp-ok)"></i>bis Feierabend</span></div>
  </div>
  <div class="zp-warnbox" id="zp-warn"></div>
</div>`;
        R.appendChild(dash);
        const lhost = el('div');
        lhost.id = 'zp-list-host';
        content.parentNode.insertBefore(lhost, content);
        buildList(lhost);

        $('zp-theme').addEventListener('click', cycleTheme);
        $('zp-kz').addEventListener('click', e => { e.stopPropagation(); S.kernSaldo = S.kernSaldo === false; saveS(); render(); toast('Saldo ±0', S.kernSaldo ? 'Mit Kernzeit – frühestens ' + (S.kzMoDo || '') + ' (Fr ' + (S.kzFr || '') + ').' : 'Ohne Kernzeit – zeigt, wann dein Saldo wirklich auf 0 ist.', { ms: 3500, icon: 'scale' }); });
        $('zp-fold').addEventListener('click', toggleFold);
        $('zp-view').addEventListener('click', toggleView);
        $('zp-gear').addEventListener('click', () => openModal());
        $('zp-edit').addEventListener('click', () => setEdit(!editing));
        $('zp-edit-done').addEventListener('click', () => setEdit(false));
        $('zp-timer').addEventListener('click', e => { e.stopPropagation(); $('zp-tpop').classList.toggle('hidden'); });
        document.addEventListener('click', e => { const p = $('zp-tpop'); if (p && !inPath(e, p) && !inPath(e, $('zp-timer'))) p.classList.add('hidden'); });
        $('zp-tpop').querySelectorAll('[data-tm]').forEach(b => b.addEventListener('click', () => startTimer(+b.dataset.tm)));
        $('zp-tgo').addEventListener('click', () => { const v = parseInt($('zp-tcustom').value, 10); if (v > 0) startTimer(v); });
        $('zp-tstop').addEventListener('click', e => { e.stopPropagation(); stopTimer(); });
        if (S.seen < 7) {
            $('zp-welcome').classList.remove('hidden');
            $('zp-welcome-ok').addEventListener('click', () => { S.seen = 7; saveS(); $('zp-welcome').classList.add('hidden'); });
        }
        const wi = $('zp-wish-in');
        wi.value = S.wish;
        wi.addEventListener('change', () => { if (wi.value) { S.wish = wi.value; saveS(); render(); } });

        initEditing();
        applyLayout();
        initSticky(host);
        applyTheme();
    }

    function cycleTheme() {
        S.theme = THEME_CYCLE[(THEME_CYCLE.indexOf(S.theme) + 1) % THEME_CYCLE.length];
        saveS(); applyTheme(); render(); if (modalOpen()) buildModal();
        toast(themeLabel(), 'Theme gewechselt', { ms: 1800, icon: 'palette' });
    }
    function toggleView() {
        S.view = S.view === 'compact' ? 'full' : 'compact';
        if (S.collapsed) { S.collapsed = false; const z = $('zp'); if (z) z.classList.remove('collapsed'); }
        saveS(); applyTheme(); render();
    }
    function toggleFold() { S.collapsed = !S.collapsed; saveS(); const z = $('zp'); if (z) z.classList.toggle('collapsed', S.collapsed); }

    /* ───── Layout & Bearbeiten ───── */
    let editing = false, dragEl = null;
    function applyLayout() {
        const box = $('zp-cards');
        if (!box) return;
        S.layout.forEach(x => {
            const c = box.querySelector('[data-card="' + x.id + '"]');
            if (!c) return;
            box.appendChild(c);
            c.classList.toggle('off', !x.on);
            c.classList.toggle('is-wide', !!x.wide);
            c.draggable = editing;
            const tw = c.querySelector('[data-act="wide"]'), th = c.querySelector('[data-act="hide"]');
            if (tw) tw.classList.toggle('on', !!x.wide);
            if (th) th.classList.toggle('on', !x.on);
        });
        const tl = $('zp-tl'); if (tl) tl.classList.toggle('off', !S.tl);
        const lg = $('zp-legend'); if (lg) lg.classList.toggle('off', !S.legend);
        ['zp-host', 'zp-list-host'].forEach(id => { const h = document.getElementById(id); if (h) h.classList.toggle('wide', S.width === 'full'); });
    }
    function setEdit(on) {
        const z = $('zp'); if (!z) return;
        editing = on;
        if (on && S.collapsed) toggleFold();
        z.classList.toggle('editing', on);
        $('zp-edit').classList.toggle('on', on);
        $('zp-edit-banner').classList.toggle('hidden', !on);
        applyLayout();
    }
    function initEditing() {
        const box = $('zp-cards');
        box.addEventListener('click', e => {
            const b = e.target.closest('[data-act]');
            if (!b || !editing) return;
            const id = b.closest('.zp-card').dataset.card, x = S.layout.find(l => l.id === id);
            if (b.dataset.act === 'wide') x.wide = !x.wide;
            if (b.dataset.act === 'hide') x.on = !x.on;
            saveS(); applyLayout(); render();
        });
        box.addEventListener('dragstart', e => {
            if (!editing) return;
            dragEl = e.target.closest('.zp-card');
            if (!dragEl) return;
            dragEl.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            try { e.dataTransfer.setData('text/plain', dragEl.dataset.card); } catch (x) { }
        });
        box.addEventListener('dragover', e => {
            if (!editing || !dragEl) return;
            e.preventDefault();
            const over = e.target.closest('.zp-card');
            if (!over || over === dragEl) return;
            const r = over.getBoundingClientRect();
            const after = (e.clientY - r.top) > r.height * .7 || ((e.clientY - r.top) > r.height * .3 && (e.clientX - r.left) > r.width / 2);
            box.insertBefore(dragEl, after ? over.nextSibling : over);
        });
        box.addEventListener('drop', e => e.preventDefault());
        box.addEventListener('dragend', () => {
            if (!dragEl) return;
            dragEl.classList.remove('dragging');
            dragEl = null;
            const ids = [...box.children].map(c => c.dataset.card);
            S.layout = ids.map(id => S.layout.find(l => l.id === id)).filter(Boolean);
            saveS();
        });
    }

    function initSticky(host) {
        const root = overlay();
        let st = root.getElementById('zp-sticky');
        if (!st) {
            st = el('div', 'zp-font');
            st.id = 'zp-sticky';
            st.title = 'Zum Dashboard';
            st.addEventListener('click', () => host.scrollIntoView({ behavior: 'smooth', block: 'start' }));
            root.appendChild(st);
        }
        if (window.IntersectionObserver) new IntersectionObserver(es => es.forEach(en => {
            const off = !!S.sticky && !en.isIntersecting;
            const zs = $('zs');
            if (zs && S.shell) { zs.classList.toggle('live-on', off); st.classList.remove('show'); }
            else st.classList.toggle('show', off);
        }), { threshold: 0 }).observe(host);
    }

    /* ════════════════════ RENDER ════════════════════ */
    let BASE_TITLE = null, prevDone = null;
    const APP_TITLE = 'LHR Zeit +';
    function cd(f, isOpen, now) {
        if (f.done) return { t: ico('check', 14) + 'erreicht – seit ' + human(now - f.at), ok: true };
        if (f.kzHit && f.need <= 0) return { t: 'Stunden erfüllt · Kernzeit bis ' + clock(f.at) + (isOpen ? ' (in ' + human(f.at - now) + ')' : ''), ok: false };
        if (!isOpen) return { t: 'fehlen noch ' + human(f.need), ok: false };
        return { t: 'in ' + human(f.at - now) + (f.kzHit ? ' · Kernzeit' : ''), ok: false };
    }
    const setText = (id, t) => { const e = $(id); if (e) e.textContent = t; };
    const setHtml = (id, t) => { const e = $(id); if (e) e.innerHTML = t; };
    const valClass = (id, cls) => { const e = $(id); if (e) e.className = 'zp-val num' + (cls ? ' ' + cls : ''); };
    const signCls = v => v > M ? 'ok' : v < -M ? 'bad' : 'warn';
    const durHtml = (ms, signed) => { const s = dur(ms, signed), i = s.lastIndexOf(':'); return s; };

    function renderListOnly() {
        if (!L || $('zp')) return;
        const days = groupDays();
        let sal = null; for (const [, rs] of days) { const v = lastVal(rs, 3); if (v != null) sal = v; }
        const t0 = new Date(); t0.setHours(0, 0, 0, 0);
        let salPast = null; for (const [k, rs] of days) { if (keyDate(k) >= t0) break; const v = lastVal(rs, 3); if (v != null) salPast = v; }
        renderList({ days }, { saldo: salPast != null ? salPast : sal, eff: 0, tg: null, open: false });
    }
    function render() {
        if (!$('zp')) { if (L) safe('Liste', renderListOnly); return; }
        const d = readDay();
        if (!d) return;
        const now = Date.now();
        const c = calc(d, now);
        const has = c.segs.length > 0;
        const dt = new Date();
        const wd = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][dt.getDay()];
        applyLayout();

        safe('Status', () => {
            $('zp-dot').classList.toggle('on', !!c.open);
            const last = has ? c.segs[c.segs.length - 1] : null;
            setText('zp-status', wd + ' ' + pad(dt.getDate()) + '.' + pad(dt.getMonth() + 1) + '. · ' + (c.br ? 'Bereitschaft · ab ' + S.brStart + ' · ohne Pause · ' : c.noPause ? 'Teil-Abwesenheit · ohne Pflichtpause · ' : '') +
                (c.open ? 'eingestempelt seit ' + clock(c.open.s) : last ? 'ausgestempelt um ' + clock(last.e) : (d.info || 'noch nicht eingestempelt')));
        });

        safe('Hero', () => {
            const pct = d.soll ? c.eff / d.soll : (has ? 1 : 0);
            const ring = $('zp-ring');
            ring.setAttribute('stroke-dashoffset', (263.9 * (1 - Math.min(1, pct))).toFixed(1));
            ring.style.stroke = c.eff >= S.maxDay * H - 30 * M ? 'var(--zp-bad)' : pct >= 1 ? 'var(--zp-ok)' : 'var(--zp-accent)';
            setText('zp-ring-v', Math.round(pct * 100) + '%');
            const setHero = (idT, idC, f) => {
                if (!has) { setText(idT, '--:--'); setText(idC, d.info || 'noch keine Buchung'); $(idT).classList.remove('done'); return; }
                setText(idT, clock(f.at));
                $(idT).classList.toggle('done', f.done);
                const x = cd(f, !!c.open, now);
                setHtml(idC, x.t); $(idC).classList.toggle('ok', x.ok);
            };
            setHero('zp-soll-t', 'zp-soll-cd', c.sollF);
            setHero('zp-sal-t', 'zp-sal-cd', c.salF);
            { const kb = $('zp-kz'); if (kb) { const on = S.kernSaldo !== false; kb.classList.toggle('on', on); kb.innerHTML = (on ? ico('check', 11) : '') + 'Kernzeit'; kb.style.display = kernEnd() && !c.br ? '' : 'none'; } }
            const fi = (k, v, w) => `<div class="zp-fi${w ? ' w' : ''}"><span>${k}</span><b class="num">${v}</b></div>`;
            const foot = [];
            if (has) foot.push(c.maxF.done ? fi(S.maxDay + ' h-Grenze', 'überschritten', 1) : fi(S.maxDay + ' h-Grenze', clock(c.maxF.at)));
            const kz = c.br ? null : kernEnd();
            if (kz) foot.push(fi('Kernzeit bis', clock(kz)));
            foot.push(fi('Übertrag', dur(d.carry, true)));
            { const nc = nextCoffee(); if (nc) foot.push(fi((/kaffee|pause/i.test(nc.name) ? '☕ ' : '📅 ') + esc(nc.name), nc.t + ' <small>· in ' + human(at(nc.t) - now) + '</small>')); }
            { const t0 = new Date(); t0.setHours(0, 0, 0, 0); let nb = null; for (const [k, rows] of d.days) { if (keyDate(k) >= t0 && isBR(rows)) { nb = k; break; } }
              if (nb === todayKey() && c.nightMs) foot.push(`<div class="zp-fi br"><span>Nacht-Einsatz</span><b class="num">${dur(c.nightMs)}</b></div>`);
              if (nb) { const nd = keyDate(nb); foot.push(`<div class="zp-fi br"><span>${nb === todayKey() ? 'Heute Bereitschaft' : 'Nächste Bereitschaft'}</span><b class="num">${nb === todayKey() ? (d.soll ? 'Soll ' + dur(d.soll) : 'ganztags') : ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][nd.getDay()] + ' ' + nb.slice(0, 6)}</b></div>`); } }
            { const gs = safe('Gesamt', () => gesamt(d.days, c.saldo)); if (gs) foot.push(`<div class="zp-fi g" title="${esc(gs.tip)}"><span>Gesamt <small>Saldo+FZ+ZA+Üst</small></span><b class="num ${signCls(gs.total)}">${dur(gs.total, true)}</b></div>`); }
            if (has && c.dedShown > 0 && !c.lunchUpcoming) foot.push(fi(c.lunch ? 'Mittag ' + mins(c.lunch.len) + ' min → Abzug' : 'Pausen-Abzug', '−' + mins(c.dedShown) + ' min', 1));
            if (c.broken) foot.push(fi('Offene Buchungen', c.broken, 1));
            setHtml('zp-foot', foot.join(''));
            const cs = (k, v, cls) => `<div class="zp-cs"><span>${k}</span><b class="num ${cls || ''}">${v}</b></div>`;
            const wk = readWeek(d.days, c.eff);
            const gs = safe('Gesamt', () => gesamt(d.days, c.saldo));
            setHtml('zp-cstats', cs('Heute netto', dur(c.eff)) + cs('Saldo', dur(c.saldo, true), signCls(c.saldo)) + cs('Woche', dur(wk.ist) + ' / ' + dur(wk.soll)) +
                (has && c.dedShown > 0 && !c.lunchUpcoming ? cs('Pausen-Abzug', mins(c.dedShown) + ' min', 'warn') : '') + (kz ? cs('Kernzeit bis', clock(kz)) : '') + (gs ? `<div title="${esc(gs.tip)}">${cs('Gesamt', dur(gs.total, true), signCls(gs.total))}</div>` : ''));
        });

        safe('Heute', () => {
            setText('zp-net', dur(c.eff));
            const pct = d.soll ? c.eff / d.soll * 100 : 100;
            const bar = $('zp-bar');
            bar.style.width = Math.min(100, pct) + '%';
            bar.style.background = c.eff >= S.maxDay * H - 30 * M ? 'var(--zp-bad)' : pct >= 100 ? 'var(--zp-ok)' : 'var(--zp-accent)';
            setHtml('zp-net-sub', `Soll ${dur(d.soll)} · ${Math.round(pct)} %` + (c.dedNow ? `<br>brutto ${dur(c.gross)} · <span class="w">−${mins(c.dedNow)} min Abzug</span>` : ''));
        });

        safe('Saldo', () => {
            setText('zp-saldo', dur(c.saldo, true)); valClass('zp-saldo', signCls(c.saldo));
            setHtml('zp-saldo-sub', 'heute ' + dur(c.tg, true) + '<br>Übertrag ' + dur(d.carry, true));
        });

        safe('Woche', () => {
            const w = readWeek(d.days, c.eff);
            setHtml('zp-week', dur(w.ist) + `<small>/ ${dur(w.soll)}</small>`);
            const names = ['Mo', 'Di', 'Mi', 'Do', 'Fr'];
            setHtml('zp-wdays', w.list.map(x => {
                const p = x.soll ? Math.min(1, (x.ist || 0) / x.soll) : 0;
                return `<div class="zp-day${x.isToday ? ' today' : ''}${x.ist != null && x.soll && x.ist >= x.soll ? ' full' : ''}" title="${names[x.i]}: ${x.ist == null ? '–' : dur(x.ist)} / ${dur(x.soll)}"><div class="col"><i style="height:${(p * 100).toFixed(0)}%"></i></div>${names[x.i]}</div>`;
            }).join(''));
            setHtml('zp-week-sub', `bis heute ${dur(w.ist - w.sollToToday, true)} · offen ${dur(Math.max(0, w.soll - w.ist))}` + (w.partial ? '<br><span class="w">Monatswechsel – Vortage fehlen</span>' : ''));
        });

        safe('Mittag', () => {
            const chips = $('zp-chips');
            chips.innerHTML = '';
            if (c.lunch) {
                const L = mins(c.lunch.len), miss = mins(c.dedShown);
                setHtml('zp-pause', L + '<small>min</small>'); valClass('zp-pause', miss > 0 ? 'warn' : 'ok');
                setHtml('zp-pause-sub', `${clock(c.lunch.s)} – ${clock(c.lunch.e)} gestempelt<br>` +
                    (miss > 0 ? `<span class="w">${miss} min Pausenabzug (LHR)</span>` : 'kein Pausenabzug'));
            } else if (c.lunchUpcoming) {
                setHtml('zp-pause', S.planLunch + '<small>min geplant</small>'); valClass('zp-pause', '');
                setHtml('zp-pause-sub', S.lunchFrom + ' – ' + S.lunchTo + ' · geplant, Abzug trägt LHR ein');
                chips.innerHTML = [0, 15, 20, 30, 45, 60].map(m => `<button class="zp-chip${+S.planLunch === m ? ' on' : ''}" data-m="${m}">${m || 'keine'}</button>`).join('');
                chips.querySelectorAll('button').forEach(b => b.addEventListener('click', ev => { ev.stopPropagation(); S.planLunch = +b.dataset.m; saveS(); render(); }));
            } else if (c.sysDed != null) {
                setHtml('zp-pause', mins(c.sysDed) + '<small>min Abzug</small>'); valClass('zp-pause', 'warn');
                setText('zp-pause-sub', 'vom System eingetragen');
            } else {
                setText('zp-pause', has ? 'keine' : '–'); valClass('zp-pause', '');
                setHtml('zp-pause-sub', has ? 'kein Mittag gestempelt · Abzug trägt LHR ein' : '');
            }
        });

        safe('Raucher', () => {
            setHtml('zp-smoke', mins(c.smokeSum) + '<small>min</small>');
            setHtml('zp-smoke-sub', c.smoke.length
                ? `${c.smoke.length}× · Ø ${Math.round(c.smokeSum / c.smoke.length / M)} min<br>${c.smoke.map(g => clock(g.s)).join(' · ')}`
                : 'heute noch keine');
        });

        safe('Wunsch', () => {
            const wt = at(S.wish), wi = $('zp-wish-in');
            if (wi && R.activeElement !== wi && wi.value !== S.wish) wi.value = S.wish;
            if (!has) { setText('zp-wish', '–'); setText('zp-wish-sub', ''); return; }
            if (wt <= now && c.open) { setText('zp-wish', '–'); valClass('zp-wish', ''); setText('zp-wish-sub', 'Uhrzeit liegt schon zurück'); return; }
            const e = c.open ? c.effAt(wt) : c.eff, sal = d.carry + e - d.soll;
            setText('zp-wish', dur(sal, true)); valClass('zp-wish', signCls(sal));
            setText('zp-wish-sub', 'Saldo danach · Tag ' + dur(e) + (e > S.maxDay * H ? ' · über ' + S.maxDay + ' h!' : ''));
        });

        safe('Monat', () => {
            const m = readMonth(d.days, c.eff, c.saldo);
            setText('zp-month', dur(c.saldo, true)); valClass('zp-month', signCls(c.saldo));
            setHtml('zp-month-sub', `Ist ${dur(m.ist)} von ${dur(m.soll)}`);
            renderSpark(m.pts);
        });

        safe('BR-Wochenenden', () => {
            if (!$('zp-brwe')) return;
            const lim = +S.brWeLimit || 10, t0 = new Date(); t0.setHours(0, 0, 0, 0);
            const from = new Date(t0); from.setDate(from.getDate() - 364);          // letzte 365 Tage (KV IT: Durchrechnung 12 Monate)
            const satOf = dt => { const s = new Date(dt); s.setHours(12, 0, 0, 0); s.setDate(s.getDate() - ((s.getDay() + 1) % 7)); return s; };   // Sa der Woche (Mo zählt zum Vor-WE)
            const wes = new Map(), we = weStore(), brs = brStore();
            Object.entries(we).forEach(([k, m]) => {
                const dt = keyDate(k), sat = satOf(dt); if (!(m > 0) || dt < from || dt > new Date(t0.getTime() + 864e5)) return;
                const sk = dayKey(sat), e = wes.get(sk) || { sat, min: 0, days: [], br: false };
                e.min += m; e.days.push(dt); if (brs[k]) e.br = true; wes.set(sk, e);
            });
            const done = [...wes.values()].sort((a, b) => a.sat - b.sat);
            // geplant: kommende Wochenenden mit Bereitschaft (zählen erst, wenn wirklich gearbeitet wird)
            let bp = {}; try { bp = JSON.parse(localStorage.getItem('zplus_brplan') || '{}') || {}; } catch (e) { }
            const plan = new Map();
            [...Object.keys(brs), ...Object.keys(bp)].forEach(k => { const dt = keyDate(k); if (dt < t0 || (dt.getDay() !== 0 && dt.getDay() !== 6)) return; const sk = dayKey(satOf(dt)); if (!wes.has(sk)) plan.set(sk, satOf(dt)); });
            const n = done.length, np = plan.size, left = lim - n;
            setHtml('zp-brwe', `${n}<small> / ${lim}</small>`);
            const v = $('zp-brwe'); if (v) v.style.color = n > lim ? 'var(--zp-bad)' : n >= lim - 1 ? 'var(--zp-warn)' : '';
            const bar = $('zp-brwe-bar');
            if (bar) bar.innerHTML = Array.from({ length: Math.max(lim, n) }, (_, i) => `<i class="${i < n ? 'd' : i < n + np ? 'p' : ''}${i >= lim ? ' x' : ''}"></i>`).join('');
            const f = d => pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + String(d.getFullYear()).slice(2);
            const nextFree = done.length ? new Date(done[0].sat.getTime() + 365 * 864e5) : null;     // ab da fällt das älteste raus
            setHtml('zp-brwe-sub', (left >= 0 ? `noch ${left} frei` : `<b style="color:var(--zp-bad)">${-left} zu viel</b>`) + (np ? ` · ${np} BR geplant` : '') + ' · 365 Tage');
            const card = v && v.closest('.zp-card');
            if (card) card.title = 'Wochenenden mit Dienst in den letzten 365 Tagen (seit ' + f(from) + ', KV IT: max. ' + lim + '):\n' + (done.length ? done.map(e => '✓ Sa ' + f(e.sat) + ' · ' + dur(e.min * 60e3) + ' gearbeitet' + (e.br ? ' (Bereitschaft)' : '')).join('\n') : 'noch keines') +
                (nextFree ? '\n\nDas älteste fällt am ' + f(nextFree) + ' aus dem Zeitraum.' : '') +
                (np ? '\n\nGeplante Bereitschaft (zählt nur bei Einsatz):\n' + [...plan.values()].sort((a, b) => a - b).map(d => '◦ Sa ' + f(d)).join('\n') : '') +
                '\n\nGezählt wird nur gestempelte Arbeit in der Wochenendruhe (ARG § 3): Sa ab 13:00 bis Mo 01:00. Bereitschaft ohne Einsatz zählt nicht.';
            if (!renderBRwe.synced) {
                renderBRwe.synced = true;
                if (localStorage.getItem('zplus_wev') !== '1') { try { localStorage.removeItem('zplus_brm'); localStorage.setItem('zplus_wev', '1'); } catch (e) { } }
                const cy = t0.getFullYear(), fm = from.getMonth(), cb = () => safe('Render', render);
                setTimeout(async () => { try { if (from.getFullYear() < cy) await syncBR(cy - 1, cb, (fm - 12) - t0.getMonth()); await syncBR(cy, cb); } catch (e) { } }, 3000);
            }
        });
        safe('Urlaub', () => {
            if (!$('zp-url')) return;
            const mode = S.urlMode === 'j' ? 'j' : 'm', box = $('zp-url-mode');
            if (box) { box.querySelectorAll('[data-um]').forEach(x => x.classList.toggle('on', x.dataset.um === mode)); if (!box._zp) { box._zp = 1; box.addEventListener('click', e => { const x = e.target.closest('[data-um]'); if (!x) return; e.stopPropagation(); S.urlMode = x.dataset.um; saveS(); safe('Render', render); }); } }
            if (mode === 'j') {           // Resturlaub Jahresende (aus dem Kalender) = was noch nicht eingetragen ist
                let r = null; try { r = JSON.parse(localStorage.getItem('zplus_ruy') || 'null'); } catch (e) { }
                const y = new Date().getFullYear();
                if (!r || r.y !== y || Date.now() - r.ts > 12 * 3600e3) ruYearFetch();
                if (!r || r.y !== y) { setText('zp-url', '…'); setText('zp-url-sub', 'wird aus dem Kalender geholt'); return; }
                setHtml('zp-url', esc(r.val) + `<small>${esc(r.unit || 'Tage')}</small>`);
                setText('zp-url-sub', 'noch offen bis Ende ' + y + (r.plan != null ? ' · ' + r.plan + ' verplant' : '') + (r.pend ? ' · ' + r.pend + ' beantragt' : ''));
                return;
            }
            const t = readUrlaub();
            if (t == null) { setText('zp-url', '–'); setText('zp-url-sub', 'auf dieser Seite nicht verfügbar'); return; }
            if (!t || /ermittelt/i.test(t)) { setText('zp-url', '…'); setText('zp-url-sub', 'wird ermittelt'); return; }
            const m = t.match(/(-?\d+(?:[.,]\d+)?)\s*(Tage?|Std\.?|Stunden|h)\b/i) || t.match(/(-?\d+(?:[.,]\d+)?)/);
            if (m) setHtml('zp-url', m[1] + (m[2] ? `<small>${m[2]}</small>` : '')); else setText('zp-url', t.slice(0, 18));
            setText('zp-url-sub', t.replace(/:\s*[-\d.,]+\s*(Tage?|Std\.?|Stunden|h)?\s*$/i, '').trim() || t);
        });

        safe('Kommen', () => {
            setText('zp-come', has ? clock(d.segs[0].s) : '--:--');
            setHtml('zp-come-sub', has
                ? c.segs.map(x => clock(x.s) + ' – ' + (x.e ? clock(x.e) : '<b>läuft</b>')).join('<br>') + (d.segs[0].s !== c.segs[0].s ? '<br>zählt ab ' + clock(c.segs[0].s) : '')
                : (d.info || 'keine Buchung'));
        });

        safe('Kopf', () => {
            const mini = has ? `Heute <b>${dur(c.eff)}</b>  ·  Soll <b>${clock(c.sollF.at)}${c.sollF.done ? ' ✓' : ''}</b>  ·  ±0 <b>${clock(c.salF.at)}${c.salF.done ? ' ✓' : ''}</b>  ·  Saldo <b>${dur(c.saldo, true)}</b>` : '';
            setHtml('zp-mini', mini);
            const st = $('zp-sticky');
            if (st) st.innerHTML = `<span class="zp-dot${c.open ? ' on' : ''}"></span><span class="num">${mini || 'LHR Zeit +'}</span><span class="m">${ico('arrowUp', 14)}</span>`;
            const zl2 = $('zs-live'); if (zl2) zl2.innerHTML = `<span class="zp-dot${c.open ? ' on' : ''}"></span>${mini}`;
            const wb = $('zp-warn');
            if (d.missingDays.length) {
                wb.style.display = 'flex';
                wb.innerHTML = ico('alert', 16) + '<span>Fehlende Buchungen an: ' + d.missingDays.map(r => `<a data-id="${r.id}">${r.getAttribute('data-periode').slice(0, 6)}</a>`).join(', ') + '</span>';
                wb.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { const r = document.getElementById(a.dataset.id); if (r) r.scrollIntoView({ behavior: 'smooth', block: 'center' }); }));
            } else wb.style.display = 'none';
            if (BASE_TITLE == null) BASE_TITLE = APP_TITLE;
            if (document.title !== BASE_TITLE) document.title = BASE_TITLE;
        });

        if (S.tl) safe('Timeline', () => renderTimeline(c, now, has));
        safe('Liste', () => renderList(d, c));
        safe('Hinweise', () => checkNotify(c, now));
    }

    function renderSpark(pts) {
        const svg = $('zp-spark');
        if (!svg) return;
        const W = 300, Hh = 46, n = pts.length;
        const known = pts.map((p, i) => p.v != null ? { i, v: p.v } : null).filter(Boolean);
        if (!known.length || n < 2) { svg.innerHTML = ''; return; }
        const amp = Math.max(60 * M, ...known.map(k => Math.abs(k.v)));
        const X = i => i / (n - 1) * W, Y = v => Hh / 2 - (v / amp) * (Hh / 2 - 5);
        const xy = known.map(k => [X(k.i).toFixed(1), Y(k.v).toFixed(1)]);
        const last = xy[xy.length - 1];
        const area = `M${xy[0][0]},${Hh / 2} L` + xy.map(p => p.join(',')).join(' L') + ` L${last[0]},${Hh / 2} Z`;
        svg.setAttribute('viewBox', `0 0 ${W} ${Hh}`);
        svg.innerHTML = `<line x1="0" x2="${W}" y1="${Hh / 2}" y2="${Hh / 2}" stroke="var(--zp-line)" stroke-dasharray="3 4" vector-effect="non-scaling-stroke"/>
            <path d="${area}" fill="var(--zp-soft)"/>
            <polyline points="${xy.map(p => p.join(',')).join(' ')}" fill="none" stroke="var(--zp-accent)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
            <circle cx="${last[0]}" cy="${last[1]}" r="3.5" fill="var(--zp-accent)" stroke="var(--zp-surf)" stroke-width="2" vector-effect="non-scaling-stroke"/>`;
    }

    function renderTimeline(c, now, has) {
        const track = $('zp-track'), ticks = $('zp-ticks');
        const pts = [now];
        c.segs.forEach(x => { pts.push(x.s); if (x.e) pts.push(x.e); });
        if (has) pts.push(c.sollF.at, c.salF.at);
        const ra = new Date(Math.min(...pts, at('07:00'))); ra.setMinutes(0, 0, 0);
        const rb = new Date(Math.max(...pts, at('17:00')) + 20 * M);
        if (rb.getMinutes() || rb.getSeconds()) rb.setHours(rb.getHours() + 1);
        rb.setMinutes(0, 0, 0);
        const a = ra.getTime(), b = rb.getTime(), span = b - a;
        const X = t => Math.max(0, Math.min(100, (t - a) / span * 100));
        let html = `<div class="zp-win" style="left:${X(c.wF)}%;width:${X(c.wT) - X(c.wF)}%" title="Mittagsfenster ${S.lunchFrom}–${S.lunchTo}"></div>`;
        c.gaps.forEach(g => {
            html += `<div class="zp-gap ${g.lunch ? 'lunch' : 'smoke'}" style="left:${X(g.s)}%;width:${X(g.e) - X(g.s)}%" title="${g.lunch ? 'Mittag' : 'Raucherpause'} ${clock(g.s)}–${clock(g.e)} (${mins(g.len)} min)"></div>`;
        });
        c.segs.forEach(x => {
            const e = x.e != null ? x.e : (x === c.open ? now : null);
            if (e == null) return;
            html += `<div class="zp-seg${x === c.open ? ' live' : ''}" style="left:${X(x.s)}%;width:${Math.max(0, X(e) - X(x.s))}%" title="${clock(x.s)} – ${x.e != null ? clock(x.e) : 'jetzt'} (${mins(e - x.s)} min)"></div>`;
        });
        if (c.open && (!c.salF.done || !c.sollF.done)) {
            const end = Math.max(c.sollF.done ? now : c.sollF.at, c.salF.done ? now : c.salF.at);
            html += `<div class="zp-proj" style="left:${X(now)}%;width:${X(end) - X(now)}%"></div>`;
        }
        const mark = (t, cls, label, title) => `<div class="zp-mark ${cls}" style="left:${X(t)}%" title="${title}"><span class="num">${label}</span></div>`;
        if (has) {
            const same = Math.abs(c.sollF.at - c.salF.at) < 4 * M;
            html += mark(c.sollF.at, 'soll', (same ? 'Soll / ±0 ' : 'Soll ') + clock(c.sollF.at), 'Soll erfüllt');
            if (!same) html += mark(c.salF.at, 'sal', '±0 ' + clock(c.salF.at), 'Saldo ausgeglichen');
            const wish = S.layout.find(l => l.id === 'wunsch');
            if (wish && wish.on) { const wt = at(S.wish); if (wt > now + 25 * M && wt < b) html += mark(wt, 'wish low', 'Wunsch ' + clock(wt), 'Gehen um …'); }
        }
        html += mark(now, 'now low', 'jetzt ' + clock(now), 'Jetzt');
        track.innerHTML = html;
        const step = span / H > 12 ? 2 : 1;
        let th = '';
        for (let t = a; t <= b; t += step * H) th += `<span style="left:${X(t)}%">${pad(new Date(t).getHours())}:00</span>`;
        ticks.innerHTML = th;
    }

    function updClock() {
        const n = new Date();
        setText('zp-clock', clock(n) + ':' + pad(n.getSeconds()));
        tickTimer();
    }

    /* ════════════════════ EINSTELLUNGEN ════════════════════ */
    let modalTab = 'design';
    const modalOpen = () => { const m = $('zp-modal'); return !!m && !m.classList.contains('hidden'); };
    function openModal(tab) {
        const root = overlay();
        let m = root.getElementById('zp-modal');
        if (!m) {
            m = el('div', 'zp-font hidden'); m.id = 'zp-modal';
            root.appendChild(m);
            m.addEventListener('click', e => { if (e.target === m) m.classList.add('hidden'); });
        }
        if (tab) modalTab = tab;
        buildModal();
        m.classList.remove('hidden');
    }
    const TABS = [['design', 'palette', 'Design'], ['layout', 'layout', 'Layout'], ['calc', 'calc', 'Berechnung'], ['notif', 'bell', 'Hinweise'], ['extra', 'zap', 'Extras']];
    const tgl = k => `<input type="checkbox" class="zp-tg" data-k="${k}">`;
    const ntgl = k => `<input type="checkbox" class="zp-tg" data-n="${k}">`;
    const num = (k, min, max, step) => `<input type="number" class="zp-in num" min="${min}" max="${max}"${step ? ' step="' + step + '"' : ''} data-k="${k}">`;
    const tim = k => `<input type="time" class="zp-in num" data-k="${k}">`;
    const segCtl = (k, opts) => `<div class="zp-segc" data-seg="${k}">${opts.map(([v, l]) => `<button type="button" data-v="${v}">${l}</button>`).join('')}</div>`;
    const row = (label, help, ctl) => `<div class="zp-row"><span>${label}${help ? '<small>' + help + '</small>' : ''}</span>${ctl}</div>`;

    function buildModal() {
        const m = $('zp-modal');
        if (!m) return;
        const sw = (k, name, icon, t) => `<button type="button" class="zp-sw${S.theme === k ? ' on' : ''}" data-theme="${k}" style="--a:${t.accent};--b:${t.bg};--c:${t.surf2}">
            <div class="pv"><div class="l1"><i></i><i></i><i></i></div><div class="l2"><i></i><i></i><i></i></div></div>
            <div class="nm"><span>${icon} ${name}</span>${S.theme === k ? ico('check', 14) : ''}</div></button>`;
        const sT = THEMES[seasonKey()], aT = THEMES[(mq && mq.matches) ? 'dark' : 'light'];
        const pane = {
            design: `
<div class="zp-sec">Theme</div>
<div class="zp-grid">${Object.entries(THEMES).map(([k, t]) => sw(k, t.name, t.icon, t)).join('')}${sw('saison', 'Saison (' + sT.name + ')', '🗓', sT)}${sw('auto', 'Wie Windows', '💻', aT)}</div>
<div class="zp-note"><b>Saison</b> wechselt automatisch: Winter Dez–Feb · Frühling Mär–Mai · Sommer Jun–Aug · Herbst Sep–Nov. Dunkle Themes färben die ganze Seite – Wochenende, Feiertage und Urlaub bleiben farbig.</div>
<div class="zp-sec">Feinschliff</div>
${row('Eigene Akzentfarbe', 'überschreibt die Farbe des Themes', `<span class="zp-btns"><input type="color" class="zp-color" id="zp-accent" value="${S.accent || theme().accent}"><button type="button" class="zp-btn" id="zp-accent-reset">Zurücksetzen</button></span>`)}
${row('Animierte Effekte', 'Schnee, Blätter, Blüten, Funken, Blasen, Sterne – je nach Theme', tgl('fx'))}
${row('Effekte zeigen auf', '', segCtl('fxScope', [['page', 'ganzer Seite'], ['dash', 'nur Dashboard']]))}
${row('Effekt-Menge', '', segCtl('fxAmount', [['low', 'wenig'], ['normal', 'normal'], ['high', 'viel']]))}
${row('Größe', '', segCtl('density', [['compact', 'kompakt'], ['normal', 'normal'], ['large', 'groß']]))}
${row('Ecken', '', segCtl('radius', [['square', 'eckig'], ['soft', 'weich'], ['round', 'rund']]))}
${row('Breite', '', segCtl('width', [['limited', 'begrenzt'], ['full', 'volle Breite']]))}
${row('Feierabend-Block', 'oben quer oder als Spalte links', segCtl('heroPos', [['top', 'oben'], ['left', 'links']]))}
${row('Ansicht', 'Kompakt zeigt nur das Wichtigste in einer Zeile', segCtl('view', [['full', 'alles'], ['compact', 'kompakt']]))}`,
            layout: `
<div class="zp-note">Tipp: Mit dem Stift-Knopf im Dashboard verschiebst du Karten direkt per Drag &amp; Drop.</div>
<div class="zp-sec">Karten</div>
<div class="zp-lay">${S.layout.map((x, i) => `<div class="zp-lay-row${x.on ? '' : ' off'}">
   <span class="ico">${ico(CARD_DEFS[x.id].icon, 15)}</span>
   <span class="n">${CARD_DEFS[x.id].name}<small>${CARD_DEFS[x.id].tip}</small></span>
   <button type="button" class="zp-mb" data-lay="up" data-i="${i}" title="nach vorne"${i === 0 ? ' disabled' : ''}>${ico('up', 14)}</button>
   <button type="button" class="zp-mb" data-lay="down" data-i="${i}" title="nach hinten"${i === S.layout.length - 1 ? ' disabled' : ''}>${ico('down', 14)}</button>
   <button type="button" class="zp-mb${x.wide ? ' on' : ''}" data-lay="wide" data-i="${i}" title="doppelt breit">${ico('width', 14)}</button>
   <input type="checkbox" class="zp-tg" data-lay="on" data-i="${i}"${x.on ? ' checked' : ''}></div>`).join('')}</div>
<div class="zp-sec">Weitere Bereiche</div>
${row('Timeline', 'Tagesverlauf mit Mittag, Raucherpausen und Feierabend-Markern', tgl('tl'))}
${row('Legende unter der Timeline', '', tgl('legend'))}
<div class="zp-btns" style="margin-top:10px"><button type="button" class="zp-btn" id="zp-lay-edit">${ico('pencil', 14)} Im Dashboard anordnen</button><button type="button" class="zp-btn" id="zp-lay-reset">Standard-Layout</button></div>`,
            calc: `
<div class="zp-sec">Bereitschaft</div>
${row('Arbeitsmodell für Bereitschaft', 'Kürzel aus der Spalte ZM, mehrere mit Komma (z.B. EITBR)', '<input type="text" class="zp-in" style="width:160px" data-k="brZM" placeholder="EITBR">')}
${row('Soll an Bereitschaftstagen', 'gilt für jeden Tag mit dem Bereitschafts-Arbeitsmodell', tim('brSoll'))}
${row('Arbeitsbeginn nach Bereitschaft', 'frühestens einstempeln ab – dann das Soll ohne Pflichtpause, ohne Kernzeit', tim('brStart'))}
<div class="zp-sec">Mittagspause</div>
${row('Mittagsfenster von', 'Größte Lücke darin = Mittag', tim('lunchFrom'))}
${row('Mittagsfenster bis', '', tim('lunchTo'))}
${row('Mittag mindestens (min)', 'Kürzere Lücken zählen immer als Raucherpause', num('lunchMinLen', 1, 60))}
${row('Mittag einplanen (min)', 'Solange heute noch kein Mittag gestempelt ist', num('planLunch', 0, 120))}
<div class="zp-sec">Arbeitszeit</div>
${row('Frühester anrechenbarer Beginn', '', tim('earliest'))}
${row('Tageshöchstgrenze (h)', '', num('maxDay', 1, 13, .5))}
${row('Kernzeit beachten', 'Feierabend nie vor Kernzeit-Ende', tgl('kern'))}
${row('Kernzeit-Ende Mo–Do', '', tim('kzMoDo'))}
${row('Kernzeit-Ende Fr', '', tim('kzFr'))}`,
            notif: `
<div class="zp-sec">Erinnerungen</div>
${row('Saldo ±0 erreicht', 'so viele Minuten vorher', `<span class="zp-btns"><input type="number" class="zp-in num" style="width:70px" min="0" max="60" data-n="saldo.lead">${ntgl('saldo.on')}</span>`)}
${row('Soll erfüllt', 'so viele Minuten vorher', `<span class="zp-btns"><input type="number" class="zp-in num" style="width:70px" min="0" max="60" data-n="soll.lead">${ntgl('soll.on')}</span>`)}
${row('Tageshöchstgrenze', 'Vorwarnung, damit du nicht drüber kommst', `<span class="zp-btns"><input type="number" class="zp-in num" style="width:70px" min="0" max="120" data-n="max.lead">${ntgl('max.on')}</span>`)}
${row('Mittag nicht vergessen', 'um diese Uhrzeit, falls noch kein Mittag gestempelt', `<span class="zp-btns"><input type="time" class="zp-in num" data-n="lunch.at">${ntgl('lunch.on')}</span>`)}
<div class="zp-sec">⏰ Tägliche Erinnerungen</div>
${row('Erinnerungen (Mo–Fr)', 'z.B. Kaffeepause, Daily – Hinweis + Windows-Benachrichtigung zur Uhrzeit, auf jeder LHR-Seite', tgl('coffeeOn'))}
<div class="zp-cof">${(S.coffee || []).map((x, i) => `<span class="zp-cofi"><input type="checkbox" class="zp-tg" data-cof-on="${i}"${x.on ? ' checked' : ''}><input type="time" class="zp-in num" data-cof-t="${i}" value="${esc(x.t)}"><input type="text" class="zp-in" style="width:120px" maxlength="30" data-cof-n="${i}" value="${esc(x.name || '')}" placeholder="Name"><button type="button" class="zp-icon sm" data-cof-del="${i}" title="Entfernen">${ico('x', 13)}</button></span>`).join('')}
  ${(S.coffee || []).length < 8 ? `<button type="button" class="zp-btn" id="zp-cof-add">${ico('plus', 14)} Erinnerung</button>` : ''}</div>
<div class="zp-sec">🔊 Ton</div>
${row('Ton abspielen', '', ntgl('sound'))}
${row('Lautsprecher', '<span id="zp-sink-note">z.B. Headset statt Monitor</span>', '<select class="zp-in" id="zp-sink" style="max-width:240px"><option>Wird geladen…</option></select>')}
${row('Lautstärke', '', '<input type="range" min="0" max="100" step="5" id="zp-vol" style="width:160px;accent-color:var(--zp-accent)">')}
<div class="zp-btns"><button type="button" class="zp-btn" data-tune="kaffee">☕ Kaffee</button><button type="button" class="zp-btn" data-tune="feierabend">🏠 Feierabend</button><button type="button" class="zp-btn" data-tune="alarm">⏰ Alarm</button></div>
<div class="zp-btns" style="margin-top:10px"><button type="button" class="zp-btn" id="zp-ntest">${ico('bell', 14)} Testen</button><button type="button" class="zp-btn" id="zp-nperm">Windows-Benachrichtigungen erlauben</button></div>
<div class="zp-sec">Belohnung</div>
${row('Konfetti bei Saldo ±0', 'einmal am Tag, wenn du eingestempelt bist', tgl('confetti'))}
<div class="zp-btns" style="margin-top:6px"><button type="button" class="zp-btn" id="zp-ctest">${ico('sparkle', 14)} Ausprobieren</button></div>`,
            extra: `
<div class="zp-sec">Countdown</div>
${row('Countdown oben anzeigen', 'z.B. „🎄 Weihnachtsfeier · 23 Tage“ – ohne Datum: bis Weihnachten', tgl('cdOn'))}
${row('Name', '', '<input type="text" class="zp-in" style="width:200px" maxlength="40" data-k="cdName" placeholder="Weihnachtsfeier">')}
${row('Datum', (() => { const c = countdown(); return c && c.over ? '<b style="color:var(--zp-warn)">abgelaufen – neues Datum eintragen</b>' : 'leer = 24. Dezember'; })(), '<input type="date" class="zp-in num" data-k="cdDate">')}
<div class="zp-sec">Anzeige</div>
${row('Kontrast', 'Hoch: kräftigere Rahmen und hellere Nebentexte', segCtl('contrast', [['normal', 'Normal'], ['hoch', 'Hoch']]))}
${row('Live-Werte im Browser-Tab', 'z.B. „8:34 · ±0 15:34“', tgl('title'))}
${row('Mitlaufende Leiste beim Scrollen', 'zeigt die wichtigsten Werte oben, wenn das Dashboard aus dem Bild ist', tgl('sticky'))}
${row('Zeit+ App-Leiste', 'ersetzt den LHR-Kopf: Navigation, Monat, Neu, PDF, Fertigmelden, Benutzer', tgl('shell'))}
${row('Navigation „Zeiterfassung / Hauptseite“ oben ausblenden', 'nur relevant ohne App-Leiste', tgl('hideNav'))}
${row('Tagesübersicht', 'Zeit+ Liste (übersichtlich) oder die Original-LHR-Tabelle', segCtl('tableView', [['list', 'Zeit+ Liste'], ['orig', 'Original']]))}
${row('Verlauf in der Liste', 'Automatisch: bei vielen Spalten als schmaler Balken unter den Buchungen', segCtl('tlMode', [['auto', 'Automatisch'], ['column', 'Eigene Spalte'], ['inline', 'Unter Buchungen'], ['off', 'Aus']]))}
${row('Kommende Tage in der Liste', 'Automatisch: eingeblendet, sobald bis Monatsende berechnet wurde', segCtl('futureDays', [['auto', 'Automatisch'], ['show', 'Immer'], ['hide', 'Nie']]))}
${row('Kalender-Ansicht', 'Monatskalender, kompakte Jahresleiste oder die Original-LHR-Tabelle', segCtl('kalView', [['months', 'Monate'], ['strip', 'Leiste'], ['orig', 'Original']]))}
${row('Seite & Tabelle modern gestalten', 'Tagesgruppen, Uhrzeit-Chips, ruhige Linien, schöner Menü-Knopf', tgl('pretty'))}
${row('Kommende Tage abdunkeln', 'Zukunft gedimmt, ohne Warn-Symbole', tgl('dimFuture'))}
${row('Heute in der Tabelle hervorheben', '', tgl('todayHl'))}
${row('Leere Tabellenspalten ausblenden', '', tgl('hideEmpty'))}
<div class="zp-sec">Tastenkürzel</div>
<div class="zp-note"><span class="zp-kbd">Alt</span> + <span class="zp-kbd">M</span> Kompakt · <span class="zp-kbd">Alt</span> + <span class="zp-kbd">Z</span> ein-/ausklappen · <span class="zp-kbd">Alt</span> + <span class="zp-kbd">T</span> Theme · <span class="zp-kbd">Alt</span> + <span class="zp-kbd">E</span> anpassen · <span class="zp-kbd">Alt</span> + <span class="zp-kbd">S</span> Einstellungen · <span class="zp-kbd">Alt</span> + <span class="zp-kbd">P</span> Pausen-Timer · <span class="zp-kbd">Esc</span> schließen</div>
<div class="zp-sec">Sichern</div>
<div class="zp-btns"><button type="button" class="zp-btn" id="zp-exp">Exportieren</button><button type="button" class="zp-btn" id="zp-imp">Importieren</button><button type="button" class="zp-btn" id="zp-reset">Alles zurücksetzen</button></div>
<div class="zp-note">Einstellungen liegen nur lokal in deinem Browser. Mit Export/Import nimmst du sie auf einen anderen PC mit.</div>`
        };
        const cur = TABS.find(t => t[0] === modalTab) || TABS[0];
        const oldScroll = m.querySelector('.zp-scroll');
        const scrollTop = oldScroll ? oldScroll.scrollTop : 0;
        m.innerHTML = `<div class="zp-dlg">
  <div class="zp-side"><div class="ttl">${LOGO}LHR Zeit +</div>${TABS.map(([k, i, n]) => `<button type="button" class="zp-tab${k === modalTab ? ' on' : ''}" data-tab="${k}">${ico(i, 16)}${n}</button>`).join('')}<div class="ver">Version ${VERSION}${lastErr ? '<br>Fehler: ' + esc(lastErr) : ''}</div></div>
  <div class="zp-main"><div class="zp-main-head"><h4>${cur[2]}</h4><button type="button" class="zp-btn pri" id="zp-close">${ico('check', 15)} Fertig</button></div>
  <div class="zp-scroll">${TABS.map(([k]) => `<div class="zp-pane${k === modalTab ? ' on' : ''}" data-pane="${k}">${pane[k]}</div>`).join('')}</div></div></div>`;
        m.querySelector('.zp-scroll').scrollTop = scrollTop;

        const rerender = () => { saveS(); applyTheme(); applyLayout(); render(); };
        m.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => { modalTab = b.dataset.tab; buildModal(); m.querySelector('.zp-scroll').scrollTop = 0; }));
        m.querySelector('#zp-close').addEventListener('click', () => m.classList.add('hidden'));
        m.querySelectorAll('[data-theme]').forEach(b => b.addEventListener('click', () => { S.theme = b.dataset.theme; rerender(); buildModal(); }));
        m.querySelectorAll('input[data-k]').forEach(inp => {
            const k = inp.dataset.k;
            if (inp.type === 'checkbox') inp.checked = !!S[k]; else inp.value = S[k];
            inp.addEventListener('change', () => {
                let v = inp.type === 'checkbox' ? inp.checked : inp.value;
                if (inp.type === 'number') { v = parseFloat(v); if (isNaN(v)) v = DEF[k]; }
                if (inp.type === 'time' && !v) v = DEF[k];
                S[k] = v; rerender();
            });
        });
        m.querySelectorAll('[data-seg]').forEach(g => {
            const k = g.dataset.seg;
            g.querySelectorAll('button').forEach(b => {
                b.classList.toggle('on', S[k] === b.dataset.v);
                b.addEventListener('click', () => { S[k] = b.dataset.v; rerender(); buildModal(); });
            });
        });
        m.querySelectorAll('[data-n]').forEach(inp => {
            const [a, b] = inp.dataset.n.split('.');
            const get = () => b ? S.notif[a][b] : S.notif[a];
            if (inp.type === 'checkbox') inp.checked = !!get(); else inp.value = get();
            inp.addEventListener('change', () => {
                const v = inp.type === 'checkbox' ? inp.checked : inp.type === 'number' ? (parseFloat(inp.value) || 0) : inp.value;
                if (b) S.notif[a][b] = v; else S.notif[a] = v;
                if (inp.type === 'checkbox' && v && a !== 'sound') askPermission();
                saveS();
            });
        });
        const acc = m.querySelector('#zp-accent');
        acc.addEventListener('input', () => { S.accent = acc.value; saveS(); applyTheme(); });
        acc.addEventListener('change', () => render());
        m.querySelector('#zp-accent-reset').addEventListener('click', () => { S.accent = ''; rerender(); buildModal(); });
        m.querySelectorAll('[data-lay]').forEach(b => {
            const i = +b.dataset.i, act = b.dataset.lay;
            b.addEventListener(act === 'on' ? 'change' : 'click', () => {
                const L = S.layout;
                if (act === 'up' && i > 0) [L[i - 1], L[i]] = [L[i], L[i - 1]];
                if (act === 'down' && i < L.length - 1) [L[i + 1], L[i]] = [L[i], L[i + 1]];
                if (act === 'wide') L[i].wide = !L[i].wide;
                if (act === 'on') L[i].on = b.checked;
                rerender(); buildModal();
            });
        });
        const on = (id, fn) => { const x = m.querySelector('#' + id); if (x) x.addEventListener('click', fn); };
        on('zp-lay-edit', () => { m.classList.add('hidden'); setEdit(true); const h = document.getElementById('zp-host'); if (h) h.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
        on('zp-lay-reset', () => { S.layout = DEF_LAYOUT.map(x => Object.assign({}, x)); rerender(); buildModal(); });
        on('zp-ntest', () => fireNotify('Test-Hinweis', 'So sehen deine Zeit+ Hinweise aus.'));
        m.querySelectorAll('[data-tune]').forEach(b => b.addEventListener('click', () => beep(b.dataset.tune, true)));
        m.querySelectorAll('[data-cof-on]').forEach(cb => cb.addEventListener('change', () => { S.coffee[+cb.dataset.cofOn].on = cb.checked; saveS(); rerender(); }));
        m.querySelectorAll('[data-cof-n]').forEach(inp => inp.addEventListener('change', () => { S.coffee[+inp.dataset.cofN].name = inp.value.trim() || 'Erinnerung'; saveS(); rerender(); }));
        m.querySelectorAll('[data-cof-t]').forEach(inp => inp.addEventListener('change', () => { if (inp.value) { S.coffee[+inp.dataset.cofT].t = inp.value; saveS(); rerender(); } }));
        m.querySelectorAll('[data-cof-del]').forEach(b => b.addEventListener('click', () => { S.coffee.splice(+b.dataset.cofDel, 1); saveS(); buildModal(); rerender(); }));
        on('zp-cof-add', () => { S.coffee.push({ t: '12:00', on: true, name: 'Erinnerung' }); saveS(); buildModal(); });
        const sinkSel = m.querySelector('#zp-sink');
        if (sinkSel) { safe('Ton', () => fillSinks(sinkSel, m.querySelector('#zp-sink-note'))); sinkSel.addEventListener('change', () => { S.sink = sinkSel.value; saveS(); beep('kaffee', true); }); }
        const vol = m.querySelector('#zp-vol');
        if (vol) { vol.value = S.vol; vol.addEventListener('change', () => { S.vol = +vol.value; saveS(); beep('kaffee', true); }); }
        on('zp-nperm', () => askPermission(true));
        on('zp-ctest', () => confetti());
        on('zp-exp', async () => {
            const json = JSON.stringify(S);
            try { await navigator.clipboard.writeText(json); toast('Exportiert', 'Einstellungen sind in der Zwischenablage.', { icon: 'check' }); }
            catch (e) { window.prompt('Einstellungen kopieren:', json); }
        });
        on('zp-imp', () => {
            const txt = window.prompt('Exportierte Zeit+ Einstellungen hier einfügen:', '');
            if (!txt) return;
            try { S = normalize(Object.assign({ v: 7 }, JSON.parse(txt))); rerender(); buildModal(); toast('Importiert', 'Einstellungen übernommen.', { icon: 'check' }); }
            catch (e) { toast('Import fehlgeschlagen', 'Das war kein gültiger Export.', { bad: true }); }
        });
        on('zp-reset', () => {
            if (!confirm('Alle Zeit+ Einstellungen auf Standard zurücksetzen?')) return;
            S = normalize({ v: 7, seen: 5 }); rerender(); buildModal();
        });
    }

    /* ════════════════════ HINWEISE / TIMER / KONFETTI ════════════════════ */
    const TUNES = {                // Klänge wie im alten LHR_Simplify
        kaffee: [[520, 0, .15, .3], [660, .18, .2, .35]],
        feierabend: [[440, 0, .15, .3], [550, .18, .15, .3], [660, .36, .3, .4]],
        alarm: [[880, 0, .1, .35], [880, .15, .1, .35], [880, .3, .2, .4]]
    };
    async function beep(kind, force) {
        if (!S.notif.sound && !force) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            if (S.sink && typeof ctx.setSinkId === 'function') { try { await ctx.setSinkId(S.sink); } catch (e) { } }
            const vol = (S.vol == null ? 70 : S.vol) / 70;
            (TUNES[kind] || TUNES.feierabend).forEach(([f, st, du, v]) => {
                const o = ctx.createOscillator(), g = ctx.createGain();
                o.connect(g); g.connect(ctx.destination); o.frequency.value = f; o.type = 'sine';
                g.gain.setValueAtTime(0, ctx.currentTime + st);
                g.gain.linearRampToValueAtTime(Math.min(1, v * vol), ctx.currentTime + st + .01);
                g.gain.linearRampToValueAtTime(0, ctx.currentTime + st + du);
                o.start(ctx.currentTime + st); o.stop(ctx.currentTime + st + du + .05);
            });
            setTimeout(() => { try { ctx.close(); } catch (e) { } }, 1500);
        } catch (e) { }
    }
    async function fillSinks(sel, note) {
        if (!sel) return;
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) { sel.innerHTML = '<option value="">Standard</option>'; sel.disabled = true; if (note) note.textContent = 'Browser unterstützt keine Geräteauswahl'; return; }
        let devs = await navigator.mediaDevices.enumerateDevices().catch(() => []);
        if (devs.filter(d => d.kind === 'audiooutput').every(d => !d.label)) {
            try { const st = await navigator.mediaDevices.getUserMedia({ audio: true }); st.getTracks().forEach(t => t.stop()); devs = await navigator.mediaDevices.enumerateDevices(); } catch (e) { }
        }
        const outs = devs.filter(d => d.kind === 'audiooutput' && d.deviceId !== 'default' && d.deviceId !== 'communications');
        sel.innerHTML = '<option value="">Standard-Lautsprecher</option>' + outs.map(d => `<option value="${esc(d.deviceId)}">${esc(d.label || 'Gerät ' + d.deviceId.slice(0, 6))}</option>`).join('');
        sel.value = S.sink || '';
        let ok = false; try { const c = new (window.AudioContext || window.webkitAudioContext)(); ok = typeof c.setSinkId === 'function'; c.close(); } catch (e) { }
        if (!ok) { sel.disabled = true; if (note) note.textContent = 'Browser unterstützt keine Geräteauswahl – es wird der Standard verwendet'; }
    }
    function askPermission(explicit) {
        if (typeof Notification === 'undefined') { if (explicit) toast('Nicht unterstützt', 'Dein Browser kann keine System-Benachrichtigungen.'); return; }
        if (Notification.permission === 'default') Notification.requestPermission();
        else if (explicit) toast('Benachrichtigungen', Notification.permission === 'granted' ? 'Sind bereits erlaubt.' : 'Sind im Browser blockiert – über das Schloss-Symbol in der Adressleiste erlauben.');
    }
    function fireNotify(title, text, kind, sticky) {
        safe('Ton', () => beep(kind || 'feierabend'));
        toast(title, text, { ms: sticky ? 120000 : 20000, icon: kind === 'alarm' ? 'alert' : kind === 'kaffee' ? 'timer' : 'bell' });
        try { if (typeof Notification !== 'undefined' && Notification.permission === 'granted') { const n = new Notification(title, { body: text, tag: 'zeitplus-' + title, requireInteraction: !!sticky, renotify: true }); n.onclick = () => { try { window.focus(); n.close(); } catch (e) { } }; } } catch (e) { }
    }
    function onceToday(id) {
        const k = 'zplus_fired', today = todayKey();
        let o = {};
        try { o = JSON.parse(localStorage.getItem(k) || '{}') || {}; } catch (e) { }
        if (o.d !== today || !Array.isArray(o.ids)) o = { d: today, ids: [] };
        if (o.ids.includes(id)) return false;
        o.ids.push(id);
        try { localStorage.setItem(k, JSON.stringify(o)); } catch (e) { }
        return true;
    }
    const nextCoffee = () => {
        if (!S.coffeeOn) return null;
        const now = new Date(), nm = now.getHours() * 60 + now.getMinutes();
        if (now.getDay() === 0 || now.getDay() === 6) return null;
        const list = (S.coffee || []).filter(x => x.on).map(x => { const [h, m] = x.t.split(':').map(Number); return { t: pad(h) + ':' + pad(m), m: h * 60 + m, name: x.name || 'Kaffeepause' }; }).sort((a, b) => a.m - b.m);
        return list.find(x => x.m > nm) || null;
    };
    function checkCoffee() {
        if (!S.coffeeOn) return;
        const now = new Date(), nm = now.getHours() * 60 + now.getMinutes();
        if (now.getDay() === 0 || now.getDay() === 6) return;
        (S.coffee || []).forEach(x => {
            if (!x.on) return;
            const [h, m] = x.t.split(':').map(Number), tm = h * 60 + m;
            const nm2 = x.name || 'Kaffeepause', isCof = /kaffee|pause/i.test(nm2);
            if (nm >= tm && nm - tm < 20 && onceToday('rem@' + pad(h) + ':' + pad(m) + '@' + nm2)) {
                const late = nm - tm >= 2 ? ' (vor ' + (nm - tm) + ' min)' : '';
                fireNotify((isCof ? '☕ ' : '📅 ') + nm2, (late ? 'Um ' : 'Es ist ') + pad(h) + ':' + pad(m) + ' Uhr' + late + (isCof ? ' – Zeit für eine kurze Pause.' : ' – ' + nm2 + (late ? ' hat begonnen.' : ' beginnt.')), 'kaffee', true);
            }
        });
    }
    function checkNotify(c, now) {
        if (c.open) {
            [['saldo', c.salF, 'Saldo ausgeglichen', 'Gleich Feierabend'],
             ['soll', c.sollF, 'Soll erfüllt', 'Soll gleich erfüllt'],
             ['max', c.maxF, S.maxDay + '-Stunden-Grenze erreicht', 'Tageshöchstgrenze naht']
            ].forEach(([k, f, what, title]) => {
                const n = S.notif[k];
                if (!n.on || f.done) return;
                const diff = f.at - now;
                if (diff >= 0 && diff <= n.lead * M + 30000 && onceToday(k + '@' + clock(f.at)))
                    fireNotify(title, 'Um ' + clock(f.at) + ' ist dein ' + what + (diff > M ? ' (noch ' + human(diff) + ')' : '') + '.', k === 'max' ? 'alarm' : '');
            });
            if (S.notif.lunch.on && !c.lunch && c.sysDed == null) {
                const t = at(S.notif.lunch.at);
                if (now >= t && now - t < 10 * M && onceToday('lunch')) fireNotify('Mahlzeit!', 'Heute ist noch kein Mittag gestempelt – denk an die ' + S.pflicht + ' min.');
            }
        }
        if (prevDone === false && c.salF.done && c.open && S.confetti && onceToday('confetti')) {
            confetti(); toast('Saldo ausgeglichen!', 'Ab jetzt ist jede Minute Plus.', { icon: 'sparkle' });
        }
        prevDone = c.salF.done;
    }

    const TKEY = 'zplus_timer';
    function startTimer(minutes) {
        try { localStorage.setItem(TKEY, JSON.stringify({ end: Date.now() + minutes * M, min: minutes })); } catch (e) { }
        const p = $('zp-tpop'); if (p) p.classList.add('hidden');
        toast('Timer läuft', minutes + ' min – Ende um ' + clock(Date.now() + minutes * M), { ms: 3000, icon: 'timer' });
        tickTimer();
    }
    function stopTimer() { try { localStorage.removeItem(TKEY); } catch (e) { } tickTimer(); }
    function tickTimer() {
        const pill = $('zp-tpill');
        if (!pill) return;
        let t = null;
        try { t = JSON.parse(localStorage.getItem(TKEY) || 'null'); } catch (e) { }
        if (!t) { pill.classList.remove('on'); return; }
        const left = t.end - Date.now();
        if (left <= 0) {
            try { localStorage.removeItem(TKEY); } catch (e) { }
            pill.classList.remove('on');
            if (left > -10 * M) fireNotify('Pause vorbei!', t.min + ' min sind um – ab an die Arbeit.', 'alarm');
            return;
        }
        pill.classList.add('on');
        pill.classList.toggle('urgent', left < 60000);
        setText('zp-tleft', pad(Math.floor(left / 60000)) + ':' + pad(Math.floor(left / 1000) % 60));
    }

    function confetti() {
        if (reducedMotion()) return;
        const cv = el('canvas'); cv.id = 'zp-confetti';
        overlay().appendChild(cv);
        const ctx = cv.getContext('2d');
        if (!ctx) { cv.remove(); return; }
        cv.width = innerWidth; cv.height = innerHeight;
        const t = theme(), cols = [S.accent || t.accent, t.accent2, t.ok, t.warn, '#ffffff', '#f472b6'];
        const ps = Array.from({ length: 170 }, () => ({
            x: innerWidth / 2 + rnd(-90, 90), y: innerHeight * .35, vx: rnd(-10, 10), vy: rnd(-15, -4),
            r: rnd(5, 9), c: pick(cols), rot: rnd(0, 6.28), vr: rnd(-.3, .3)
        }));
        const t0 = performance.now();
        (function frame(ts) {
            const k = (ts - t0) / 3200;
            ctx.clearRect(0, 0, cv.width, cv.height);
            ps.forEach(p => {
                p.vy += .32; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
                ctx.save(); ctx.globalAlpha = Math.max(0, 1 - k * k); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
                ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore();
            });
            if (k < 1) requestAnimationFrame(frame); else cv.remove();
        })(t0);
    }

    /* ════════════════════ EFFEKTE ════════════════════ */
    let fxRaf = null, fxType = null, fxRO = null;
    function spawn(type, w, h, init) {
        const p = { x: rnd(0, w), y: init ? rnd(0, h) : -12, ph: rnd(0, 6.28), rot: rnd(0, 6.28) };
        if (type === 'snow') Object.assign(p, { r: rnd(1, 2.6), vy: rnd(.25, .75), sw: rnd(.2, .7), c: 'rgba(255,255,255,' + rnd(.45, .9).toFixed(2) + ')' });
        if (type === 'leaves') Object.assign(p, { r: rnd(4, 7), vy: rnd(.35, .85), sw: rnd(.6, 1.4), vr: rnd(-.03, .03), c: pick(['#f08c3a', '#e76f2a', '#e9c46a', '#b45309', '#c2410c']) });
        if (type === 'petals') Object.assign(p, { r: rnd(3, 5.5), vy: rnd(.3, .7), sw: rnd(.5, 1.2), vr: rnd(-.04, .04), c: pick(['#f9a8d4', '#f472b6', '#fbcfe8', '#fda4af', '#ffffff']) });
        if (type === 'sun') Object.assign(p, { y: init ? rnd(0, h) : h + 10, r: rnd(.8, 2.2), vy: -rnd(.15, .4), sw: rnd(.2, .5), c: pick(['#fbbf24', '#f59e0b', '#fde68a']) });
        if (type === 'bubbles') Object.assign(p, { y: init ? rnd(0, h) : h + 10, r: rnd(2, 6), vy: -rnd(.2, .55), sw: rnd(.3, .8), c: 'rgba(153,246,228,.5)' });
        if (type === 'maci') {
            if (Math.random() < .13) Object.assign(p, { kind: pick(['ginger', 'ginger', 'snowman', 'tree']), r: rnd(9, 14), vy: rnd(.22, .45), sw: rnd(.3, .7) });
            else Object.assign(p, { kind: 'snow', r: rnd(1, 2.6), vy: rnd(.25, .75), sw: rnd(.2, .7), c: 'rgba(255,255,255,' + rnd(.45, .9).toFixed(2) + ')' });
        }
        if (type === 'stars') Object.assign(p, { y: rnd(0, h), r: rnd(.5, 1.5), vy: 0, sw: 0, tw: rnd(.01, .04), c: pick(['#ffffff', '#e9d5ff', '#a5f3fc']) });
        return p;
    }
    function drawSprite(c, kind) {          // kleine Vektor-Figuren (Maci-Theme)
        const circ = (x, y, r, f) => { c.fillStyle = f; c.beginPath(); c.arc(x, y, r, 0, 6.283); c.fill(); };
        const ell = (x, y, rx, ry, a, f) => { c.fillStyle = f; c.beginPath(); c.ellipse(x, y, rx, ry, a, 0, 6.283); c.fill(); };
        if (kind === 'ginger') {
            const b = '#c27c3e';
            ell(-5.2, -1, 3.6, 1.9, -.35, b); ell(5.2, -1, 3.6, 1.9, .35, b);           // Arme
            ell(-2.5, 7.2, 1.9, 3.8, .28, b); ell(2.5, 7.2, 1.9, 3.8, -.28, b);          // Beine
            ell(0, 1.8, 4.3, 5.2, 0, b); circ(0, -6.2, 4.1, b);                          // Körper, Kopf
            c.strokeStyle = '#fff'; c.lineWidth = .7; c.lineCap = 'round';
            c.beginPath(); c.arc(0, -5.6, 1.9, .35, 2.8); c.stroke();                    // Lächeln
            [[-7.2, -1.8], [7.2, -1.8]].forEach(([x, y]) => { c.beginPath(); c.moveTo(x - .9, y - .6); c.lineTo(x, y + .5); c.lineTo(x + .9, y - .6); c.stroke(); });
            circ(-1.4, -7, .55, '#3b2414'); circ(1.4, -7, .55, '#3b2414');              // Augen
            circ(0, .2, .75, '#ff6b6b'); circ(0, 2.8, .75, '#7ee2a8'); circ(0, 5.2, .75, '#fff');   // Knöpfe
        } else if (kind === 'snowman') {
            circ(0, 4.5, 5.4, '#f4f8ff'); circ(0, -2.8, 3.9, '#f4f8ff');
            c.fillStyle = '#e04848'; c.fillRect(-3.6, 0, 7.2, 1.5); c.fillRect(1.6, 0, 1.5, 3.6);   // Schal
            c.fillStyle = '#1f2937'; c.fillRect(-3.2, -7.3, 6.4, 1); c.fillRect(-2.2, -11, 4.4, 4);  // Hut
            circ(-1.3, -3.5, .5, '#1f2937'); circ(1.3, -3.5, .5, '#1f2937');
            c.fillStyle = '#f59e0b'; c.beginPath(); c.moveTo(0, -2.6); c.lineTo(3.4, -2.1); c.lineTo(0, -1.7); c.fill();   // Karotte
            circ(0, 3.2, .55, '#1f2937'); circ(0, 5.6, .55, '#1f2937');
        } else if (kind === 'tree') {
            c.fillStyle = '#7a4a24'; c.fillRect(-1.3, 5, 2.6, 3.4);
            const tri = (y0, w, h) => { c.beginPath(); c.moveTo(0, y0); c.lineTo(-w, y0 + h); c.lineTo(w, y0 + h); c.closePath(); c.fill(); };
            c.fillStyle = '#2f9e5b'; tri(-1, 7, 6.5); c.fillStyle = '#38b26a'; tri(-5.5, 5.4, 6); c.fillStyle = '#43c477'; tri(-9.5, 3.8, 5.2);
            circ(-2.6, 3.3, .8, '#ff6b6b'); circ(2.8, 1.6, .8, '#ffc979'); circ(-.6, -1.6, .75, '#7dd3fc'); circ(1.4, -5.2, .7, '#ff6b6b');
            c.fillStyle = '#ffd34d'; c.beginPath();
            for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? .9 : 2.1; c.lineTo(Math.cos(a) * r, -10.4 + Math.sin(a) * r); }
            c.closePath(); c.fill();
        }
    }
    let fxSig = '', fxSprites = null;
    function stopFx() {
        if (fxRaf) cancelAnimationFrame(fxRaf);
        fxRaf = null;
    }
    // Effekte als CSS-Animationen (läuft auf der Grafikkarte, entlastet den Prozessor – gleiche Optik, volle Bildrate)
    function startFx() {
        stopFx();
        if (!document.body) return;
        const local = $('zp-fx');
        let page = O && O.getElementById('zp-fxp');
        fxType = (S.fx && !reducedMotion()) ? theme().fx : null;
        const usePage = S.fxScope === 'page';
        if (local) local.style.display = fxType && !usePage ? 'block' : 'none';
        if (page) page.style.display = fxType && usePage ? 'block' : 'none';
        if (!fxType || (!usePage && !local)) { fxSig = ''; if (local) local.textContent = ''; if (page) page.textContent = ''; return; }
        if (usePage && !page) { page = el('div'); page.id = 'zp-fxp'; overlay().insertBefore(page, overlay().firstChild.nextSibling); }
        const box = usePage ? page : local;
        const other = usePage ? local : page; if (other) other.textContent = '';
        box.style.display = 'block';
        const mul = ({ low: .45, normal: 1, high: 1.9 }[S.fxAmount] || 1) * (usePage ? 1.8 : 1);
        const n = Math.round(({ maci: 75, snow: 70, leaves: 14, petals: 20, sun: 28, bubbles: 22, stars: 80 }[fxType] || 30) * mul);
        const sig = fxType + '|' + n + '|' + usePage;
        if (fxSig === sig && box.childElementCount) return;           // läuft schon so → nichts neu aufbauen
        fxSig = sig;
        const W = Math.max(1, box.clientWidth || innerWidth), H = Math.max(1, box.clientHeight || innerHeight);
        box.style.setProperty('--fh', (H + 28) + 'px');
        if (fxType === 'maci' && !fxSprites) {       // Lebkuchen & Co. einmal als Bild vorzeichnen
            fxSprites = {};
            ['ginger', 'snowman', 'tree'].forEach(k => { try { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); x.translate(32, 32); x.scale(2.6, 2.6); drawSprite(x, k); fxSprites[k] = c.toDataURL(); } catch (e) { } });
        }
        const r2 = v => Math.round(v * 100) / 100;
        let html = '';
        for (let i = 0; i < n; i++) {
            const p = spawn(fxType, W, H, true);
            const left = r2(p.x / W * 100), sway = r2(p.sw * 25), swD = 2.62, swDl = r2(-Math.random() * swD * 2);
            let shape = '', fall = '', extra = '';
            if (fxType === 'stars') {
                const half = r2(Math.PI / (.8 * p.tw * 60));
                { shape = `<u class="st" style="width:${r2(p.r * 2)}px;height:${r2(p.r * 2)}px;background:${p.c};--td:${half}s;--tdl:${r2(-Math.random() * half * 2)}s"></u>`; }
                html += `<i class="p fix" style="left:${left}%;top:${r2(p.y / H * 100)}%">${shape}</i>`; continue;
            }
            const speed = Math.abs(p.vy) * 60, dur = r2((H + 28) / speed), dl = r2(-Math.random() * dur);
            fall = `--d:${dur}s;--dl:${dl}s${p.vy < 0 ? ';animation-direction:reverse' : ''}`;
            if (fxType === 'leaves' || fxType === 'petals') {
                const rd = r2(2 * Math.PI / (Math.max(.004, Math.abs(p.vr)) * 60));
                shape = `<u class="lf" style="width:${r2(p.r * 2)}px;height:${r2(p.r * 2 * (fxType === 'leaves' ? .55 : .7))}px;background:${p.c};--rd:${rd}s;--rdl:${r2(-Math.random() * rd)}s;animation-direction:${p.vr < 0 ? 'reverse' : 'normal'}"></u>`;
            } else if (fxType === 'maci' && p.kind !== 'snow') {
                const s = r2(p.r / 10 * 64 / 2.6);
                shape = `<u class="mc" style="width:${s}px;height:${s}px;background-image:url(${fxSprites && fxSprites[p.kind] || ''});--wd:${r2(Math.PI / (.02 * 1.3 * 60))}s;--wdl:${r2(-Math.random() * 3)}s"></u>`;
            } else if (fxType === 'bubbles') {
                shape = `<u class="bb" style="width:${r2(p.r * 2)}px;height:${r2(p.r * 2)}px;border-color:${p.c}"></u>`;
            } else if (fxType === 'sun') {
                shape = `<u class="sn" style="width:${r2(p.r * 2)}px;height:${r2(p.r * 2)}px;background:${p.c};--pd:1.31s;--pdl:${r2(-Math.random() * 2.6)}s"></u>`;
            } else {
                shape = `<u class="dt" style="width:${r2(p.r * 2)}px;height:${r2(p.r * 2)}px;background:${p.c}"></u>`;
            }
            html += `<i class="p" style="left:${left}%;${fall}"><b style="--a:${sway}px;--sd:${swD}s;--sdl:${swDl}s">${shape}</b>${extra}</i>`;
        }
        if (fxType === 'stars') html += '<i class="shoot"></i>';
        box.innerHTML = html;
        if (!box._fxRO && window.ResizeObserver) { box._fxRO = new ResizeObserver(() => { const h = box.clientHeight; if (h) box.style.setProperty('--fh', (h + 28) + 'px'); }); box._fxRO.observe(box); }
    }

    /* ════════════════════ TABELLE ════════════════════ */
    let cctx = null;
    function hsl(color) {
        cctx = cctx || document.createElement('canvas').getContext('2d');
        if (!cctx) return null;
        cctx.fillStyle = '#000'; cctx.fillStyle = color;
        const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(cctx.fillStyle);
        if (!m) return null;
        const r = parseInt(m[1], 16) / 255, g = parseInt(m[2], 16) / 255, b = parseInt(m[3], 16) / 255;
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
        let h = 0, s = 0;
        if (mx !== mn) {
            const dd = mx - mn;
            s = l > .5 ? dd / (2 - mx - mn) : dd / (mx + mn);
            h = (mx === r ? (g - b) / dd + (g < b ? 6 : 0) : mx === g ? (b - r) / dd + 2 : (r - g) / dd + 4) * 60;
        }
        return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
    }
    function tintRows() {
        if (!document.body || PAGE !== 'zdl') return;
        document.body.querySelectorAll('[style*="background"]').forEach(x => {
            if (/^(IMG|SVG|CANVAS|INPUT|SELECT|TEXTAREA|BUTTON)$/i.test(x.tagName) || x.id === 'zp-host' || x.id === 'zp-list-host' || x.id === 'zp-overlay') return;
            const bg = x.style.backgroundColor;
            if (!bg || bg === 'transparent' || /rgba\(.*,\s*0\)$/.test(bg)) { x.removeAttribute('data-zp-tint'); x.removeAttribute('data-zp-white'); return; }
            if (x.dataset.zpBg === bg) return;
            x.dataset.zpBg = bg;
            const c = hsl(bg);
            if (!c) return;
            const inZdl = !!x.closest('table.tabelle');
            const isWhite = c[1] < 8 && c[2] > 90;
            if (!inZdl && isWhite) { x.setAttribute('data-zp-white', '1'); x.removeAttribute('data-zp-tint'); return; }
            x.removeAttribute('data-zp-white');
            x.setAttribute('data-zp-tint', '1');
            x.style.setProperty('--zp-tint2', `hsl(${c[0]} ${Math.min(c[1], 62)}% ${c[1] < 8 ? Math.max(16, 100 - c[2]) : 31}%)`);
            x.style.setProperty('--zp-tint-txt', c[1] < 8 ? 'var(--zp-text)' : `hsl(${c[0]} 70% 92%)`);
            x.style.setProperty('--zp-tint', `hsl(${c[0]} ${Math.min(c[1], 35)}% 15%)`);
            x.style.setProperty('--zp-edge', `hsl(${c[0]} ${Math.min(c[1], 80)}% 68%)`);
            x.style.setProperty('--zp-tintl', `hsl(${c[0]} ${Math.min(c[1], 70)}% 96%)`);
            x.style.setProperty('--zp-edge-txt', `hsl(${c[0]} ${Math.min(c[1], 60)}% ${theme().dark ? 72 : 42}%)`);
        });
    }
    /* Farbkorrektur für alle Nicht-ZDL-Seiten: liest die ECHTEN Farben (auch aus LHR-Klassen) und
       dunkelt nur helle Flächen ab. Kräftige Farben (Urlaub, Feiertag …) bleiben, bekommen aber lesbare Schrift. */
    const rgbHL = c => { const r = c.r / 255, g = c.g / 255, b = c.b / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let h = 0;
        if (d) h = (mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4) * 60; return [Math.round(h), Math.round((mx + mn) * 50)]; };
    const cfSig = new WeakMap(), cfDirty = new Set(), cfOwn = new WeakMap();
    let cfRuns = 0;
    const CF_SKIP = /^(IMG|SVG|CANVAS|INPUT|SELECT|OPTION|TEXTAREA|SCRIPT|STYLE|LINK|META|BR|HR|PATH|USE|G|IFRAME|VIDEO)$/i;
    function fixColors() {
        if (!document.body) return;
        cfRuns++;
        const dark = !!theme().dark;
        cfDirty.forEach(n => { if (n.getElementsByTagName) { const ds = n.getElementsByTagName('*'); if (ds.length < 3000) for (let j = 0; j < ds.length; j++) cfSig.delete(ds[j]); } });
        cfDirty.clear();
        // Zeitdatenliste: die LHR-Tabelle selbst nie anfassen (pixelgenau), nur Dialoge/Popups daneben (z.B. Mehrfacherfassung)
        let list;
        if (PAGE === 'zdl') {
            list = [];
            [...document.body.children].forEach(c => {
                if (c.id === 'content' || (c.id || '').startsWith('zp-') || /^(SCRIPT|STYLE|HEADER|NAV)$/.test(c.tagName) || c.classList.contains('navmenu')) return;
                if (c.querySelector && c.querySelector('#zdlBody')) return;
                list.push(c); const ds = c.getElementsByTagName('*'); for (let j = 0; j < ds.length; j++) list.push(ds[j]);
            });
        } else list = document.body.getElementsByTagName('*');
        if (list.length > 40000) return;
        for (let i = 0; i < list.length; i++) {
            const x = list[i];
            if (typeof x.className !== 'string' || CF_SKIP.test(x.tagName) || (x.id && x.id.indexOf('zp-') === 0) || x.closest('svg') || (BU && BU.contains(x))) continue;
            const sig = x.className + '|' + (x.getAttribute('style') || '') + '|' + dark;
            if (cfSig.get(x) === sig) continue;
            if (x.hasAttribute('data-zp-cf') || x.hasAttribute('data-zp-ink')) { x.removeAttribute('data-zp-cf'); x.removeAttribute('data-zp-ink'); x.style.removeProperty('--zp-cfh'); }
            if (dark) {
                const cs = getComputedStyle(x);
                const c = rgbOf(cs.backgroundColor), img = /url\(|gradient\(/.test(cs.backgroundImage);
                let mode = null, h = 250;
                if (c && c.a > .12) {
                    const [hh, l] = rgbHL(c);
                    const chroma = Math.max(c.r, c.g, c.b) - Math.min(c.r, c.g, c.b);
                    h = hh;
                    if (img && l > 55) mode = 'h';
                    else if (l >= 78 && chroma < 30) mode = 'w';
                    else if (l >= 72 && chroma < 90) mode = 's';
                    else if (chroma > 40) mode = lumOf(c) > .52 ? 'v' : 'd';
                } else if (img && x.tagName !== 'A' && !x.querySelector('img')) mode = 'h';
                if (mode) {
                    x.setAttribute('data-zp-cf', mode);
                    if (mode === 's' || mode === 'h') x.style.setProperty('--zp-cfh', String(h));
                } else if (!x.closest('[data-zp-cf="v"]')) {
                    const tc = rgbOf(cs.color);
                    if (tc && lumOf(tc) < .38 && [...x.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) x.setAttribute('data-zp-ink', '1');
                }
            }
            cfSig.set(x, x.className + '|' + (x.getAttribute('style') || '') + '|' + dark);
            if (x.hasAttribute('style')) cfOwn.set(x, x.getAttribute('style'));
        }
    }
    let cfTimer = null;


    /* ════════════════════ TEAM: eigene Zeile + Favoriten (Tableau, Planer, Abwesenheiten) ════════════════════ */
    const nameKey = t => String(t || '').toLowerCase().replace(/[★☆]/g, '').replace(/\(\d+\)/g, '').replace(/[^a-zäöüßéèáàčćšžđ\s-]/g, ' ').split(/\s+/).filter(w => w.length > 1).sort().join(' ');
    const favList = () => Array.isArray(S.favs) ? S.favs : [];
    const cellName = td => [...td.childNodes].filter(n => !(n.nodeType === 1 && n.classList.contains('zp-star'))).map(n => n.textContent).join(' ').replace(/\s+/g, ' ').trim();
    let teamSig = '';
    function setCls(elx, cls, on) { if (elx.classList.contains(cls) !== on) elx.classList.toggle(cls, on); }
    function markTeam() {
        if (PAGE !== 'other' || !document.getElementById('content')) return;
        const u = userInfo(), myKey = nameKey(u.name), nr = u.nr;
        const favs = new Set(favList().map(f => f.k));
        // Tableau-Kacheln
        const tcells = [...document.querySelectorAll('#tableautab2 td, #tableautab td')].filter(td => cellName(td).length > 2);
        const nrRe = nr ? new RegExp('(^|[^0-9])' + nr + '([^0-9]|$)') : null;
        const hasNr = td => { if (!nrRe) return false; for (const a of td.attributes) if (nrRe.test(a.value)) return true; return [...td.querySelectorAll('*')].some(x => [...x.attributes].some(a => a.name !== 'style' && nrRe.test(a.value))); };
        const meCells = tcells.filter(td => nameKey(cellName(td)) === myKey), meByNr = meCells.filter(hasNr);
        const meSet = new Set(meByNr.length ? meByNr : meCells);
        tcells.forEach(td => {
            const k = nameKey(cellName(td));
            if (!td.querySelector(':scope > .zp-star')) { const st = document.createElement('span'); st.className = 'zp-star'; st.title = 'Als Favorit anpinnen'; td.appendChild(st); }
            const star = td.querySelector(':scope > .zp-star');
            const isF = favs.has(k);
            if (star.textContent !== (isF ? '★' : '☆')) star.textContent = isF ? '★' : '☆';
            star.title = isF ? 'Favorit entfernen' : 'Als Favorit anpinnen';
            setCls(td, 'zp-fav', isF); setCls(td, 'zp-me', meSet.has(td));
            const full = cellName(td).replace(/(\.\.\.|…)/g, ' ').replace(/\s+/g, ' ').trim();
            if (full.length > 3) td.querySelectorAll('*').forEach(x => { if (!x.children.length && /^(\.\.\.|…)$/.test(x.textContent.trim()) && !x.classList.contains('zp-star')) x.textContent = full; });
            if (!td.title) td.title = full;
        });
        // Tabellen-Zeilen (Planer, Abwesenheiten): DnNr oder Name
        const me = new Set(), fv = new Set();
        document.querySelectorAll('#content tbody > tr').forEach(tr => {
            if (tr.closest('#tableautab2,#tableautab')) return;
            const tds = [...tr.children].slice(0, 4);
            let isMe = false, isF = false;
            tds.forEach(td => { const t = td.textContent.replace(/\s+/g, ' ').trim(); if (!t || t.length > 60) return; if (nr && t === nr) isMe = true; const k = nameKey(t); if (k && k === myKey) isMe = true; if (k && favs.has(k)) isF = true; });
            if (isMe) me.add(tr); else if (isF) fv.add(tr);
        });
        // fixierte Spalten (DataTables-Kopien): gleiche Zeilennummer in Geschwister-Tabellen
        [[me, 'zp-me'], [fv, 'zp-favrow']].forEach(([set]) => {
            [...set].forEach(tr => {
                const tb = tr.parentElement, idx = [...tb.children].indexOf(tr);
                const wrap = tr.closest('.dataTables_wrapper,.DTFC_ScrollWrapper,.dtfc-scroll,.scrolldiv');
                if (!wrap) return;
                wrap.querySelectorAll('tbody').forEach(ob => { if (ob !== tb && ob.children.length === tb.children.length && ob.children[idx]) set.add(ob.children[idx]); });
            });
        });
        document.querySelectorAll('#content tbody > tr').forEach(tr => { setCls(tr, 'zp-me', me.has(tr)); setCls(tr, 'zp-favrow', fv.has(tr)); });
        if (IS_ABW) safe('Team', () => abwFavs(favs, myKey));
        if (IS_ABW) safe('Team', abwToday);
        if (IS_ABW && !window.__zpAlignObs) { const tb = document.getElementById('tabdiv'); if (tb) { window.__zpAlignObs = true; let t = null; new MutationObserver(() => { clearTimeout(t); t = setTimeout(() => safe('Team', () => { dtAlign(tb); abwToday(); }), 300); }).observe(tb, { childList: true, subtree: true }); window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => safe('Team', () => dtAlign(tb)), 300); }); } }
        if (IS_ABW) safe('Team', () => {            // Abwesenheitsübersicht: beim Öffnen immer die eigene Abteilung
            const sel = document.getElementById('abw_dropdown_abt');
            if (!sel || window.__zpAbwAbt || sel.options.length < 2) return;
            window.__zpAbwAbt = true;
            const txt = o => (o.text || '').replace(/\s+/g, ' ').trim().toLowerCase();
            if (!S.myAbtName) { if (sel.value && sel.value !== '0') { S.myAbtName = (sel.options[sel.selectedIndex] || {}).text.replace(/\s+/g, ' ').trim(); saveS(); } return; }
            const t = [...sel.options].find(o => txt(o) === S.myAbtName.toLowerCase());
            if (t && sel.value !== t.value) { sel.value = t.value; try { if (typeof window.changeAbteilung === 'function') window.changeAbteilung(sel); else sel.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) { } }
        });
        if (document.documentElement.classList.contains('zp-planer')) { safe('Planer', planerNav); safe('Planer', planerMarks); }
        if (IS_ABW) safe('Team', () => { if (document.querySelector('#tabdiv tbody td.kalTag, #tabdiv tbody td.kalTag_sa')) { const dt = teamParse(document, window); teamSave(dt); } });
        safe('Team', () => {
            const sel = document.getElementById('tableau_dropdown_abt');
            if (!sel || window.__zpAbtDone || sel.options.length < 2) return;
            window.__zpAbtDone = true;
            const nm = () => ((sel.options[sel.selectedIndex] || {}).text || '').replace(/\s+/g, ' ').trim();
            if (sel.value && sel.value !== '0') { if (S.myAbtTab !== sel.value || !S.myAbtName) { S.myAbtTab = sel.value; S.myAbtName = nm(); saveS(); } }
            else if (S.myAbtTab && [...sel.options].some(o => o.value === S.myAbtTab)) { sel.value = S.myAbtTab; try { if (typeof window.changeAbteilung === 'function') window.changeAbteilung(sel); else sel.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) { } }
            sel.addEventListener('change', () => { if (sel.value && sel.value !== '0') { S.myAbtTab = sel.value; saveS(); } });
            const sSel = document.getElementById('tableau_dropdown_status'), pSel = document.getElementById('per_page_count');
            if (sSel && S.myTabStatus && sSel.value !== S.myTabStatus && [...sSel.options].some(o => o.value === S.myTabStatus)) setTimeout(() => setSel(window, sSel, S.myTabStatus, 'changeStatus'), 600);
            if (pSel && S.myTabPP && pSel.value !== S.myTabPP && [...pSel.options].some(o => o.value === S.myTabPP)) setTimeout(() => setSel(window, pSel, S.myTabPP, 'onChangePerPage'), 1200);
            if (sSel) sSel.addEventListener('change', () => { S.myTabStatus = sSel.value; saveS(); });
            if (pSel) pSel.addEventListener('change', () => { S.myTabPP = pSel.value; saveS(); });
        });
        renderFavBar(tcells);
        { const sp = ['tabl_det_erreichbarkeit_span', 'tabl_det_abwesenheit_span', 'detaildn_name'].map(i => document.getElementById(i)).filter(Boolean);
          if (sp.length) document.documentElement.classList.toggle('zp-tdet', sp.some(x => x.textContent.replace(/\u00a0/g, ' ').trim().length > 0)); }
    }
    /* Abwesenheitsübersicht „Ich + Favoriten“: eigene Übersicht aus den Team-Daten (LHR lädt seitenweise, Filtern geht dort nicht) */
    const ABWP_CSS = `
.ap{font:13px/1.3 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif;color:var(--zp-text);background:var(--zp-surf);border:1px solid var(--zp-line);border-radius:16px;padding:12px 14px;overflow-x:auto}
.ap .hd{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.ap .hd b{font-size:14px;display:inline-flex;align-items:center;gap:6px}.ap .hd span{color:var(--zp-muted);font-size:12px}.ap .hd .sp{flex:1}
.ap .hd button{border:0;background:transparent;color:var(--zp-muted);cursor:pointer;display:grid;place-items:center;padding:4px;border-radius:7px}
.ap .hd button:hover{background:var(--zp-surf2);color:var(--zp-text)}
.ap table{border-collapse:separate;border-spacing:3px;min-width:100%}
.ap th{font-size:11px;font-weight:600;color:var(--zp-muted);text-align:center;padding:2px 0;white-space:nowrap}
.ap th.we{opacity:.55}.ap th.t{color:var(--zp-accent)}
.ap td.n{white-space:nowrap;font-weight:600;padding-right:10px;position:sticky;left:0;background:var(--zp-surf);z-index:1}
.ap td.n small{color:var(--zp-muted);font-weight:500;margin-left:6px}
.ap td.c{width:30px;min-width:30px;height:26px;border-radius:6px;background:var(--zp-surf2);text-align:center;font-size:11px;font-weight:700}
.ap td.c.frei{background:repeating-linear-gradient(135deg,color-mix(in srgb,var(--zp-muted) 18%,transparent) 0 2px,transparent 2px 6px)}
.ap td.c.rem{background:transparent;box-shadow:inset 0 0 0 1.5px var(--zp-rem,#2dd4bf);color:var(--zp-rem,#2dd4bf)}
.ap td.c.abs{color:#111}
.ap td.c.t{outline:1.5px solid var(--zp-accent);outline-offset:1px}
.ap tr.me td.n{color:var(--zp-accent)}
.ap .lg{display:flex;gap:14px;margin-top:8px;font-size:11.5px;color:var(--zp-muted);flex-wrap:wrap}
.ap .lg i{display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:-2px;margin-right:5px}
.ap .none{color:var(--zp-muted);padding:6px 2px}`;
    function renderAbwPanel(show) {
        let host = document.getElementById('zp-abw-fav');
        const tabdiv = document.getElementById('tabdiv'); if (!tabdiv) return;
        if (!show) { if (host) host.style.display = 'none'; return; }
        if (!host) {
            host = el('div'); host.id = 'zp-abw-fav'; tabdiv.parentNode.insertBefore(host, tabdiv);
            const root = mkRoot(host); const st = document.createElement('style'); st.textContent = ABWP_CSS; root.appendChild(st);
            const box = el('div', 'ap zp-font'); box.id = 'ap'; root.appendChild(box);
            box.addEventListener('click', e => { if (e.target.closest('[data-ar]')) { teamRefresh(() => renderAbwPanel(true)); renderAbwPanel(true); } });
        }
        host.style.display = '';
        const box = host.shadowRoot.getElementById('ap'), data = teamStore(), u = userInfo(), me = nameKey(u.name);
        const people = [{ k: me, n: u.name, me: true }].concat(favList().filter(f => f.k !== me));
        const t0 = new Date(); t0.setHours(0, 0, 0, 0);
        const keys = data ? Object.keys(data.days).filter(k => dParse(k) >= t0).sort((a, b) => dParse(a) - dParse(b)).slice(0, 31) : [];
        const head = `<div class="hd"><b>${ico('users', 14)} Ich + Favoriten</b><span>${data ? 'Stand ' + clock(data.ts) : ''}${teamBusy ? ' · wird aktualisiert …' : ''}</span><span class="sp"></span><button type="button" data-ar="1" title="Neu laden (auch andere Abteilungen)">${ico('refresh', 14)}</button></div>`;
        if (!keys.length) { box.innerHTML = head + `<div class="none">${teamBusy ? 'Daten werden geladen …' : 'Noch keine Daten – ↻ klicken.'}</div>`; return; }
        const tk = dayKey(new Date());
        const th = keys.map(k => { const dt = dParse(k), we = dt.getDay() === 0 || dt.getDay() === 6; return `<th class="${we ? 'we' : ''}${k === tk ? ' t' : ''}">${WD_SHORT[dt.getDay()]}<br>${pad(dt.getDate())}.${pad(dt.getMonth() + 1)}.</th>`; }).join('');
        const rows = people.map(p => {
            const has = keys.some(k => data.days[k] && data.days[k][p.k]);
            const cells = keys.map(k => {
                const e = data.days[k] && data.days[k][p.k], t = k === tk ? ' t' : '';
                if (!e) return `<td class="c${t}" title="keine Daten"></td>`;
                if (e.st === 'frei') return `<td class="c frei${t}"></td>`;
                if (e.st === 'rem') return `<td class="c rem${t}" title="Remote / Homeoffice">R</td>`;
                if (e.st === 'abs') return `<td class="c abs${t}" style="background:${esc(e.c || 'var(--zp-bad)')}" title="abwesend${e.l ? ' (' + esc(e.l) + ')' : ''}">${esc(e.l || '')}</td>`;
                return `<td class="c${t}" title="da"></td>`;
            }).join('');
            return `<tr class="${p.me ? 'me' : ''}"><td class="n">${esc((data.names[p.k] || p.n).replace(/\s+/g, ' '))}${has ? '' : '<small>keine Daten</small>'}</td>${cells}</tr>`;
        }).join('');
        box.innerHTML = head + `<table><thead><tr><th></th>${th}</tr></thead><tbody>${rows}</tbody></table>
            <div class="lg"><span><i style="background:var(--zp-surf2)"></i>da</span><span><i style="box-shadow:inset 0 0 0 1.5px var(--zp-rem,#2dd4bf)"></i>Remote</span><span><i style="background:#ff3300"></i>abwesend (Farbe wie in LHR)</span><span><i style="background:repeating-linear-gradient(135deg,#8886 0 2px,transparent 2px 6px)"></i>Wochenende / Feiertag</span></div>`;
    }
    const IS_ABW = /abwesenheitsuebersicht/i.test(location.pathname);
    /* Planer: Zellen lesbar machen, Remote/Bereitschaft erkennen, B1/B2 aus Tooltip übernehmen, Kopf kompakt (Wochentag + KW) */
    /* ───── Planer: eigene Monats-Navigation (‹ Monat ›, Monatsauswahl, Heute) + beim Öffnen immer der aktuelle Monat ───── */
    const MON_L = ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    const MON_S = ['Jän', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
    const PN_KEY = 'zp_pnav';
    const pnSS = { get: () => { try { return JSON.parse(sessionStorage.getItem(PN_KEY) || '{}') || {}; } catch (e) { return {}; } }, set: o => { try { sessionStorage.setItem(PN_KEY, JSON.stringify(Object.assign(pnSS.get(), o))); } catch (e) { } } };
    const pnLabel = () => ((document.getElementById('le_periode_text') || {}).textContent || '').replace(/\s+/g, ' ').trim();
    const pnMode = () => ((document.getElementById('sel_anzeige') || {}).value || (document.getElementById('anzeige') || {}).value || 'M').toUpperCase();
    function pnCur() {           // angezeigter Monat {y, m} (nur Monatsansicht)
        const t = pnLabel(); let m = t.match(/^(\d{1,2})\.(\d{4})$/);
        if (m) return { y: +m[2], m: +m[1] - 1 };
        m = t.toLowerCase().match(/(jän|jan|feb|mär|mar|apr|mai|jun|jul|aug|sep|okt|nov|dez)[a-zä]*\.?\s*(\d{4})/);
        if (m) { const i = m[1] === 'jan' ? 0 : m[1] === 'mar' ? 2 : MON_S.map(x => x.toLowerCase()).indexOf(m[1]); if (i >= 0) return { y: +m[2], m: i }; }
        return null;
    }
    const pnWaitChange = (old, ms) => new Promise(res => { const t0 = Date.now(); const iv = setInterval(() => { if (pnLabel() !== old || Date.now() - t0 > ms) { clearInterval(iv); setTimeout(res, 250); } }, 120); });
    function pnStep(d) {
        pnSS.set({ user: Date.now() });
        const fn = d < 0 ? window.get_previous_time : window.get_next_time;
        if (typeof fn === 'function') { try { fn(); return; } catch (e) { } }
        const b = document.getElementById(d < 0 ? 'periode_a' : 'periode_a2'); if (b) b.click();
    }
    let pnBusy = false;
    async function pnGo(y, m) {
        if (pnBusy) return; pnBusy = true;
        try {
            pnSS.set({ target: { y, m, ts: Date.now() }, user: Date.now() });
            const sel = document.getElementById('sel_anzeige');
            if (sel && sel.value !== 'M' && [...sel.options].some(o => o.value === 'M')) {
                const old = pnLabel(); sel.value = 'M';
                try { if (typeof window.onChangeAnzeige === 'function') window.onChangeAnzeige(sel); else sel.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) { }
                await pnWaitChange(old, 5000);
            }
            // 1. Versuch: LHR-Monatsauswahl (flatpickr) direkt setzen → ein einziger Ladevorgang
            const fp = (document.getElementById('select_datum') || {})._flatpickr;
            let c = pnCur();
            if (fp && c && (c.y !== y || c.m !== m)) {
                const old = pnLabel();
                try { fp.setDate(new Date(y, m, 1, 12), true); } catch (e) { }
                await pnWaitChange(old, 3500);
                c = pnCur();
            }
            // 2. Schrittweise mit den LHR-Pfeilen
            for (let i = 0; i < 36; i++) {
                c = pnCur(); if (!c) break;
                const diff = (y - c.y) * 12 + (m - c.m); if (!diff) break;
                const old = pnLabel(); pnStep(diff); await pnWaitChange(old, 6000);
                if (pnLabel() === old) break;
            }
            c = pnCur(); if (c && c.y === y && c.m === m) pnSS.set({ target: null });
        } finally { pnBusy = false; pnRender(); }
    }
    function pnRender() {
        const nav = document.getElementById('zp-pnav'); if (!nav) return;
        const c = pnCur(), mode = pnMode(), now = new Date();
        const lbl = c ? MON_L[c.m] + ' ' + c.y : (pnLabel() || '…');
        const isNow = c && c.y === now.getFullYear() && c.m === now.getMonth();
        nav.querySelector('.zp-pn-l').innerHTML = `<span>${esc(lbl)}</span>${ico('chevron', 14)}`;
        nav.querySelector('.zp-pn-t').classList.toggle('on', !!isNow);
        nav.classList.toggle('busy', pnBusy);
        nav.dataset.mode = mode;
    }
    function pnPicker(nav) {
        let pop = nav.querySelector('.zp-pn-pop');
        if (pop) { pop.remove(); return; }
        const c = pnCur() || { y: new Date().getFullYear(), m: new Date().getMonth() }, now = new Date();
        let yy = c.y;
        pop = el('div', 'zp-pn-pop');
        const draw = () => {
            pop.innerHTML = `<div class="zp-pn-yh"><button type="button" data-y="-1">${ico('left', 15)}</button><b>${yy}</b><button type="button" data-y="1">${ico('right', 15)}</button></div><div class="zp-pn-grid">` +
                MON_S.map((n, i) => `<button type="button" data-m="${i}" class="${yy === c.y && i === c.m ? 'sel' : ''}${yy === now.getFullYear() && i === now.getMonth() ? ' now' : ''}">${n}</button>`).join('') + '</div>';
        };
        draw();
        pop.addEventListener('click', e => {
            e.stopPropagation();
            const yb = e.target.closest('[data-y]'); if (yb) { yy += +yb.dataset.y; draw(); return; }
            const mb = e.target.closest('[data-m]'); if (mb) { pop.remove(); pnGo(yy, +mb.dataset.m); }
        });
        nav.appendChild(pop);
        setTimeout(() => document.addEventListener('click', function off(e) { if (!nav.contains(e.target)) { pop.remove(); document.removeEventListener('click', off, true); } }, true), 0);
    }
    function planerNav() {
        const lpt = document.getElementById('le_periode_text'); if (!lpt) return;
        let nav = document.getElementById('zp-pnav');
        if (!nav) {
            const host = document.querySelector('#tabdivup .grid-container') || (document.getElementById('general-controls') || lpt).parentNode;
            nav = el('div'); nav.id = 'zp-pnav';
            nav.innerHTML = `<button type="button" class="zp-pn-b" data-d="-1" title="Vorheriger Zeitraum">${ico('left', 17)}</button><button type="button" class="zp-pn-l" title="Monat auswählen"></button><button type="button" class="zp-pn-b" data-d="1" title="Nächster Zeitraum">${ico('right', 17)}</button><button type="button" class="zp-pn-t" title="Zum aktuellen Monat">Heute</button>`;
            const gc = document.getElementById('general-controls');
            if (gc && gc.parentNode === host) host.insertBefore(nav, gc); else host.appendChild(nav);
            nav.addEventListener('click', e => {
                const b = e.target.closest('button'); if (!b || b.closest('.zp-pn-pop')) return;
                if (b.dataset.d) { pnSS.set({ target: null }); pnStep(+b.dataset.d); return; }
                if (b.classList.contains('zp-pn-t')) { const n = new Date(); pnGo(n.getFullYear(), n.getMonth()); return; }
                if (b.classList.contains('zp-pn-l')) pnPicker(nav);
            });
            new MutationObserver(() => pnRender()).observe(lpt, { childList: true, characterData: true, subtree: true });
            document.documentElement.classList.add('zp-pnav');
            { const sa = document.getElementById('sel_anzeige'); if (sa) sa.addEventListener('change', () => { if (!pnBusy) pnSS.set({ user: Date.now(), target: null }); }); }
            // Beim Öffnen: angefangene Auswahl fortsetzen, sonst immer der aktuelle Monat (außer man hat gerade selbst geblättert)
            const start = Date.now();
            const boot = () => {
                const ready = pnCur() || /\d/.test(pnLabel());
                if (!ready) { if (Date.now() - start < 15000) setTimeout(boot, 400); return; }
                const st = pnSS.get(), n = new Date();
                if (st.target && Date.now() - st.target.ts < 60000) { pnGo(st.target.y, st.target.m); return; }
                if (st.user && Date.now() - st.user < 20000) return;
                const c = pnCur();
                if (!c || c.y !== n.getFullYear() || c.m !== n.getMonth()) pnGo(n.getFullYear(), n.getMonth());
            };
            setTimeout(boot, 900);
        }
        pnRender();
    }
    function planerMarks() {
        const tab = document.getElementById('tabdiv'); if (!tab) return;
        tab.querySelectorAll('tbody tr:not(.sum_row) > td:not(.dtfc-fixed-left)').forEach(td => {
            if (td.dataset.zpPm === (td.getAttribute('style') || '') + '|' + td.textContent) return;
            const raw = (td.textContent || '').replace(/\s+/g, ' ').trim();
            let t = raw.toUpperCase();
            // B1/B2 & Co.: steht oft nur im Tooltip → Nummer mit anzeigen
            if (/\bB\b/.test(t) && !/B\d/.test(t)) {
                const tipOf = x => { let v = [...x.attributes].filter(a => /title|tippy|data-|aria-label/.test(a.name)).map(a => a.value).join(' '); try { const tp = x._tippy; if (tp && tp.props) { const c = tp.props.content; v += ' ' + (typeof c === 'string' ? c : c && c.textContent ? c.textContent : ''); } } catch (e) { } return v; };
                const tips = [td, ...td.querySelectorAll('*')].map(tipOf).join(' ');
                const m = tips.replace(/<[^>]*>/g, ' ').match(/\bB\s?([0-9])\b|Bereitschaft\s*([0-9])|BR\s?([0-9])\b/i);
                if (m) { const leaf = [td, ...td.querySelectorAll('*')].reverse().find(x => !x.children.length && /\bB\b/.test(x.textContent)); if (leaf) { leaf.textContent = leaf.textContent.replace(/\bB\b/, 'B' + (m[1] || m[2] || m[3])); t = (td.textContent || '').toUpperCase(); } }
                if (tips.trim()) td.dataset.zpTipTxt = tips.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200);
            }
            const chroma = c => c ? Math.max(c.r, c.g, c.b) - Math.min(c.r, c.g, c.b) : 0;
            // LHR färbt oft ein inneres Element, die Zelle selbst ist grau → die kräftigste Farbe gewinnt
            const cands = [td, ...td.querySelectorAll('[style*="background"]')].map(x => rgbOf(x.style.backgroundColor)).filter(c => c && c.a > .3);
            const bg = cands.sort((a, b) => chroma(b) - chroma(a))[0] || null;
            const pink = bg && bg.r > 230 && bg.g > 90 && bg.g < 170 && bg.b > 150;           // LHR-Remote-Rosa
            const hasB = /B\d*/.test(t.replace(/\s+/g, '')), hasR = /(^|\s)R(\s|$)|^RB/.test(t) || pink;
            const rb = hasR && hasB, r = hasR && !hasB;
            if (td.classList.contains('zp-rem') !== r) td.classList.toggle('zp-rem', r);
            if (td.classList.contains('zp-rb') !== rb) td.classList.toggle('zp-rb', rb);
            const colored = bg && bg.a > .3 && !r && !rb && chroma(bg) >= 45;
            td.classList.toggle('zp-col', !!colored);
            if (colored) { const c = cssRgb(bg); if (td.style.getPropertyValue('--zc') !== c) td.style.setProperty('--zc', c); }
            td.classList.remove('zp-ink');
            if (!/\bB\b/.test((td.textContent || '').toUpperCase()) || /B\d/.test((td.textContent || '').toUpperCase())) td.dataset.zpPm = (td.getAttribute('style') || '') + '|' + td.textContent;
        });
        // Kopf: LHR stapelt pro Spalte Bild / Datum / KW / Arbeitstage → wir zeigen eine Zeile: Wochentag, Datum, KW-Schild (Montag)
        const y = +(((document.getElementById('le_periode_text') || {}).textContent || '').match(/(\d{4})/) || [])[1] || +((document.getElementById('tSpanDate') || document.getElementById('jahr') || {}).value || new Date().getFullYear());
        let lastM = null, yy = y, rewrote = false;
        tab.querySelectorAll('thead th').forEach(th => {
            if (th.dataset.zpWd || th.closest('.dataTables_scrollBody')) return;
            rewrote = true;
            const dtEl = th.querySelector('[data-dt]');
            let dt = null;
            if (dtEl) dt = dParse(dtEl.getAttribute('data-dt'));
            if (!dt) {
                const lab = (th.getAttribute('aria-label') || th.textContent || '').replace(/&nbsp;| /g, ' ').trim();
                const m = lab.match(/^(\d{1,2})\.(\d{1,2})\.?(?:\s|$)/); if (!m) return;
                const mo = +m[2] - 1; if (lastM != null && mo < lastM) yy++;
                dt = new Date(yy, mo, +m[1], 12);
            }
            lastM = dt.getMonth(); yy = dt.getFullYear();
            const wd = dt.getDay();
            const kwT = ((th.querySelector('.kw-zeile') || {}).textContent || '').trim(), atT = ((th.querySelector('.kw-arbeitstage') || {}).textContent || '').trim();
            const kw = kwT && /^\d+$/.test(kwT) ? +kwT : (wd === 1 ? isoWeek(dt) : 0);
            const hol = /feiertag/i.test(th.className);
            th.dataset.zpWd = '1'; th.dataset.zpDate = dayKey(dt);
            th.innerHTML = `<span class="zp-wd">${WD_SHORT[wd]}</span><b>${dt.getDate()}.${dt.getMonth() + 1}.</b>${kw ? `<span class="zp-kw">KW ${kw}</span>` : '<span class="zp-kw0"></span>'}`;
            if (atT) th.title = `KW ${kw} · ${atT} Arbeitstage`;
            th.classList.toggle('zp-we', wd === 0 || wd === 6);
            th.classList.toggle('zp-hol', hol);
            if (dayKey(dt) === todayKey()) th.classList.add('zp-today');
        });
        if (rewrote) { clearTimeout(planerMarks.adj); planerMarks.adj = setTimeout(() => { try { const jq = window.jQuery; if (jq && jq.fn && jq.fn.dataTable) jq('#tabdiv table.dataTable').filter((i, t) => !t.closest('.dataTables_scrollHead')).each((i, t) => { if (jq.fn.dataTable.isDataTable(t)) jq(t).DataTable().columns.adjust(); }); } catch (e) { } }, 120); }
        planerTipInit();
        planerStats(tab);
        planerToday(tab);
    }
    // Abwesenheitsübersicht: heutige Spalte (Kopf „05.11.“) markieren
    function dtAlign(tab) {            // Kopf und Tabelle wieder bündig machen, wenn sie auseinanderlaufen (z.B. nach Abteilungswechsel)
        try {
            const hr = tab.querySelector('.dataTables_scrollHead thead tr:last-child'), br = [...tab.querySelectorAll('.dataTables_scrollBody tbody tr')].find(tr => tr.children.length > 4 && tr.offsetParent !== null);
            if (!hr || !br) return;
            const hs = [...hr.children], bs = [...br.children], n = Math.min(hs.length, bs.length);
            let off = 0; for (let i = 0; i < n; i++) { const a = hs[i].getBoundingClientRect(), b = bs[i].getBoundingClientRect(); off = Math.max(off, Math.abs(a.left - b.left), Math.abs(a.width - b.width)); }
            if (off < 2 || Date.now() - (dtAlign.t || 0) < 1500) return;
            dtAlign.t = Date.now();
            const jq = window.jQuery; if (!jq || !jq.fn || !jq.fn.dataTable) return;
            jq('#tabdiv table.dataTable').each((i, t) => { if (!t.closest('.dataTables_scrollHead') && jq.fn.dataTable.isDataTable(t)) jq(t).DataTable().columns.adjust(); });
        } catch (e) { }
    }
    function abwToday() {
        const tab = document.getElementById('tabdiv'); if (!tab) return;
        dtAlign(tab);
        const hr = tab.querySelector('.dataTables_scrollHead thead tr:last-child') || tab.querySelector('thead tr:last-child'); if (!hr) return;
        const n = new Date(), key = pad(n.getDate()) + '.' + pad(n.getMonth() + 1) + '.';
        const hs = [...hr.children], idx = hs.findIndex(th => { const t = th.textContent.replace(/\s+/g, ''); return t === key || t.endsWith(key) || t === n.getDate() + '.' + (n.getMonth() + 1) + '.'; });
        hs.forEach((th, i) => th.classList.toggle('zp-tcol', i === idx));
        tab.querySelectorAll('tbody td.zp-tcol').forEach(x => { if ([...x.parentElement.children].indexOf(x) !== idx) x.classList.remove('zp-tcol', 'zp-tlast'); });
        if (idx < 0) return;
        const rows = [...tab.querySelectorAll('.dataTables_scrollBody tbody tr, .dataTables_wrapper > table tbody tr, #tabdiv > table tbody tr')].filter(tr => tr.children.length > idx && tr.offsetParent !== null);
        rows.forEach((tr, i) => { const td = tr.children[idx]; if (!td.classList.contains('zp-tcol')) td.classList.add('zp-tcol'); td.classList.toggle('zp-tlast', i === rows.length - 1); });
    }
    // heutige Spalte durchgehend leicht einrahmen
    function planerToday(tab) {
        const hr = tab.querySelector('.dataTables_scrollHead thead tr:last-child') || tab.querySelector('thead tr:last-child'); if (!hr) return;
        const hs = [...hr.children], idx = hs.findIndex(th => th.classList.contains('zp-today'));
        tab.querySelectorAll('.zp-tcol').forEach(x => { if (idx < 0 || [...x.parentElement.children].indexOf(x) !== idx || x.closest('thead')) x.classList.remove('zp-tcol', 'zp-tlast'); });
        if (idx < 0) return;
        const rows = [...tab.querySelectorAll('.dataTables_scrollBody tbody tr, .dataTables_wrapper > table tbody tr')].filter(tr => !tr.classList.contains('dtrg-group') && tr.children.length > idx && !tr.querySelector('[colspan]:not(.gesamt_div_verplant)'));
        const sums = [...tab.querySelectorAll('tbody tr.sum_row')];
        rows.forEach((tr, i) => {
            let td = tr.children[idx];
            if (tr.classList.contains('sum_row')) { let n = 0; td = null; for (const c of tr.children) { if (n === idx) { td = c; break; } n += +(c.getAttribute('colspan') || 1); } }
            if (td && !td.classList.contains('zp-tcol')) td.classList.add('zp-tcol');
            if (td) td.classList.toggle('zp-tlast', i === rows.length - 1);
        });
        sums.forEach(tr => { if (rows.includes(tr)) return; let n = 0; for (const c of tr.children) { if (n === idx) { c.classList.add('zp-tcol', 'zp-tlast'); break; } n += +(c.getAttribute('colspan') || 1); } });
        const th = hs[idx]; th.classList.add('zp-tcol');
    }
    // LHR-Summenzeile („Gesamt verplant – Tage/Köpfe“): eigene, breitere Tabelle → verrutscht und blockiert das seitliche Scrollen. Die Zahlen stehen jetzt oben im Kopf.
    function planerHideSum(tab) {
        const w = document.createTreeWalker(tab, NodeFilter.SHOW_TEXT, { acceptNode: n => /gesamt\s*verplant/i.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP });
        const main = [...tab.querySelectorAll('table')].find(t => t.querySelector('tbody tr.dtrg-group, tbody td.zp-col, tbody td.zp-rem')) || null;
        let n; while ((n = w.nextNode())) {
            const el = n.parentElement; if (!el || el.closest('.zp-hidesum')) continue;
            const t = el.closest('table');
            if (t && main && t !== main) {
                let blk = t; while (blk.parentElement && blk.parentElement !== tab && !blk.parentElement.contains(main)) blk = blk.parentElement;
                blk.classList.add('zp-hidesum');
            } else {
                const tr = el.closest('tr'); if (!tr) continue;
                let r = tr; while (r) { r.classList.add('zp-hidesum'); r = r.nextElementSibling; }
                const sec = tr.parentElement; if (sec && /TFOOT/.test(sec.tagName)) sec.classList.add('zp-hidesum');
            }
        }
    }
    // Planer-Hover: was ist an dem Tag? (LHR zeigt nur bei manchen Zellen einen Tooltip)
    const LEG_KEY = 'zplus_leg';
    const legStore = () => { try { return JSON.parse(localStorage.getItem(LEG_KEY) || 'null'); } catch (e) { return null; } };
    function legSave(legend) { try { const l = legend.filter(x => x.kind === 'abs' && x.name).map(x => ({ n: x.name, l: x.letter || '', c: x.color ? cssRgb(x.color) : '' })); if (l.length) localStorage.setItem(LEG_KEY, JSON.stringify({ ts: Date.now(), l })); } catch (e) { } }
    async function legFetch() {
        if (legFetch.busy) return; const st = legStore(); if (st && Date.now() - st.ts < 7 * 864e5) return; legFetch.busy = true;
        try {
            const a = [...document.querySelectorAll('a[href]')].find(x => /kalender/i.test(x.getAttribute('href')) && !/planer|tableau/i.test(x.getAttribute('href')));
            if (!a) return;
            const r = await fetch(a.getAttribute('href'), { credentials: 'same-origin' }); if (!r.ok) return;
            const doc = new DOMParser().parseFromString(await r.text(), 'text/html'), l = [];
            doc.querySelectorAll('#kalendertab_summe tbody tr').forEach(tr => {
                const nm = tr.querySelector('[id="kal_td_abwesenheit"]'); if (!nm) return;
                const sw = [...tr.children].find(td => /background/i.test(td.getAttribute('style') || '')); const col = sw ? rgbOf((sw.getAttribute('style').match(/background(?:-color)?\s*:\s*([^;]+)/i) || [])[1]) : null;
                if (sw && /kalTag_sa|kalTag_so_fe/.test(sw.className)) return;
                l.push({ n: nm.textContent.replace(/\s+/g, ' ').trim(), l: sw ? sw.textContent.replace(/\s+/g, '').trim() : '', c: col ? cssRgb(col) : '' });
            });
            if (l.length) localStorage.setItem(LEG_KEY, JSON.stringify({ ts: Date.now(), l }));
        } catch (e) { } finally { legFetch.busy = false; }
    }
    // Zelle → was ist an dem Tag? (R, B1/B2, F, Farbe → Abwesenheitsart)
    function planerCellInfo(td) {
        const txt = (td.textContent || '').replace(/\s+/g, ' ').trim().toUpperCase();
        const rem = /(^|\s)R(\s|$)|^R[B ]/.test(txt) || td.classList.contains('zp-rem') || td.classList.contains('zp-rb');
        const bm = txt.match(/B\s?(\d)/), br = !!bm || /(^|\s)B(\s|$)/.test(txt);
        const fei = /(^|\s)F(\s|$)/.test(txt);
        let abs = '', sw = '';
        if (td.classList.contains('zp-col') && !rem && !br && !fei) {          // Farbe zählt nur ohne Kürzel – B/F/R färben die Zelle selbst
            sw = td.style.getPropertyValue('--zc'); const c = rgbOf(sw);
            const leg = (legStore() || {}).l || [];
            let best = null, bd = 1e9; if (c) leg.forEach(x => { const lc = rgbOf(x.c); if (!lc) return; const d = colDist(c, lc); if (d < bd) { bd = d; best = x; } });
            abs = best && bd < 90 && !/feiertag|bereitschaft|remote|home/i.test(best.n) ? best.n : 'Abwesenheit';
        }
        const other = txt.split(/\s+/).filter(t => t && !/^(R|B\d?|F|RB\d?)$/.test(t));
        if (other.length && !abs) abs = 'Abwesenheit (' + other.join(' ') + ')';
        const n = (rem ? 1 : 0) + (br ? 1 : 0) + (fei ? 1 : 0) + (abs ? 1 : 0);
        return { txt, rem, br, bnum: bm ? bm[1] : '', fei, abs, sw, n };
    }
    // LHR-Tooltip (tippy) auslesen und abschalten – wir zeigen den Inhalt in unserem kleinen Kästchen
    function tippyText(x) {
        const tp = x._tippy; if (!tp || !tp.props) return '';
        let c = tp.props.content;
        try { if (typeof c === 'function') c = c(x); } catch (e) { c = ''; }
        let t = '';
        if (c && c.nodeType) t = c.innerText || c.textContent || '';
        else t = String(c || '').replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|tr|li|h\d)>/gi, '\n').replace(/<\/t[dh]>/gi, ' ').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
        try { tp.disable(); } catch (e) { }
        return t;
    }
    function planerTipInit() {
        const tab = document.getElementById('tabdiv'); if (!tab || tab.dataset.zpTip) return; tab.dataset.zpTip = '1';
        legFetch();
        let tip = null, cur = null;
        const hide = () => { cur = null; if (tip) tip.classList.remove('on'); };
        const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
        const clean = t => String(t || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
        const show = (el, html) => {
            if (!tip) { tip = document.createElement('div'); tip.id = 'zp-ptip'; document.body.appendChild(tip); }
            tip.innerHTML = html; tip.classList.add('on'); cur = el;
            const r = el.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
            let x = r.left + r.width / 2 - w / 2, y = r.top - h - 6; if (y < 8) y = r.bottom + 6; x = Math.max(8, Math.min(innerWidth - w - 8, x));
            tip.style.left = Math.round(x) + 'px'; tip.style.top = Math.round(y) + 'px';
        };
        const dateOf = th => th ? (((th.querySelector('.zp-wd') || {}).textContent || '') + ' ' + ((th.querySelector('b') || {}).textContent || clean(th.textContent))).trim() : '';
        const heads = () => { const sh = tab.querySelector('.dataTables_scrollHead thead tr:last-child'); return sh ? [...sh.children] : [...(tab.querySelector('thead tr:last-child') || { children: [] }).children]; };
        tab.addEventListener('mouseover', e => {
            // Kopf: Tagesübersicht
            const th = e.target.closest && e.target.closest('thead th');
            if (th && th.dataset.zpStat) {
                if (th === cur) return;
                const s = JSON.parse(th.dataset.zpStat);
                const row = (lab, v, c) => v ? `<div class="r"><i style="background:${c}"></i>${lab}<b>${v}</b></div>` : '';
                show(th, `<div class="h">${esc(dateOf(th))}</div>` + row('Abwesend', s.a, 'var(--zp-bad,#e5484d)') + row('Remote', s.r, 'var(--zp-rem,#2dd4bf)') + row('Bereitschaft', s.b, '#e6c229') + row('Feiertag', s.f, '#f59e0b') +
                    `<div class="d">${s.k} von ${s.p} Personen verplant · ${s.t} Einträge</div>`);
                return;
            }
            const td = e.target.closest && e.target.closest('tbody td'); if (!td || !tab.contains(td)) { if (!th) hide(); return; }
            if (td === cur) return;
            if (td.closest('tr.sum_row')) {
                const a = td.querySelector('.sum_div'), k = td.querySelector('.sum_div_bt');
                if (!a || !k || !/^\d/.test(a.textContent.trim()) || td.classList.contains('gesamt_div')) { hide(); return; }
                let idx = 0; for (const c of td.parentElement.children) { if (c === td) break; idx += +(c.getAttribute('colspan') || 1); }
                show(td, `<div class="h">${esc(dateOf(heads()[idx]))}</div><div class="r"><i style="background:var(--zp-accent,#4f7cff)"></i>Personen verplant<b>${esc(k.textContent.trim())}</b></div><div class="r"><i style="background:var(--zp-muted,#888)"></i>Einträge gesamt<b>${esc(a.textContent.trim())}</b></div><div class="d">„Köpfe“ = Personen · „Tage“ = Einträge (z.B. Feiertag + Bereitschaft = 2)</div>`);
                return;
            }
            if (td.classList.contains('dtfc-fixed-left') || td.hasAttribute('colspan')) { hide(); return; }
            const lhr = [td, ...td.querySelectorAll('*')].map(tippyText).join(' ') + ' ' + (td.dataset.zpTipTxt || '');
            const inf = planerCellInfo(td);
            if (!inf.n) { hide(); return; }
            if (/^Abwesenheit/.test(inf.abs)) { const leg = ((legStore() || {}).l || []).map(x => x.n).filter(n => n && new RegExp('\\b' + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').test(lhr)); if (leg.length) inf.abs = leg[0]; else { const m = lhr.match(/\b(Urlaub|Krankenstand|Krank|Zeitausgleich|Sonderurlaub|Pflegeurlaub|Dienstreise|Schulung|Seminar|Berufsschule|Arzt)\w*/i); if (m) inf.abs = m[0]; } }
            const tags = [];
            if (inf.abs) tags.push(['', inf.abs, inf.sw || 'var(--zp-bad,#e5484d)']);
            if (inf.br) tags.push(['', 'Bereitschaft' + (inf.bnum ? ' ' + inf.bnum : ''), '#e6c229']);
            if (inf.rem) tags.push(['', 'Remote', 'var(--zp-rem,#2dd4bf)']);
            if (inf.fei) tags.push(['', 'Feiertag', '#f59e0b']);
            const extra = [];
            const tr = td.parentElement, nm = [...tr.children].filter(x => x.classList.contains('dtfc-fixed-left')).map(x => x.textContent.trim()).find(x => /[a-zäöü]{2}/i.test(x)) || '';
            const th2 = heads()[[...tr.children].indexOf(td)];
            show(td, `<div class="t">${tags.map(t => `<span><i style="background:${esc(t[2])}"></i>${esc(t[1])}</span>`).join('') || `<span>${esc(inf.txt)}</span>`}</div>` +
                (extra.length ? `<div class="x">${extra.map(esc).join('<br>')}</div>` : '') +
                `<div class="d">${esc([dateOf(th2), nm].filter(Boolean).join(' · '))}</div>`);
        });
        tab.addEventListener('mouseleave', hide);
        window.addEventListener('scroll', hide, true);
    }
    // Planer-Kopf: pro Tag zählen, wer weg / remote / in Bereitschaft ist (ersetzt die schwer lesbare LHR-Summenzeile)
    function planerStats(tab) {
        const hs = (() => { const sh = tab.querySelector('.dataTables_scrollHead thead tr:last-child'); return sh ? [...sh.children] : [...(tab.querySelector('thead tr:last-child') || { children: [] }).children]; })();
        if (!hs.length) return;
        const rows = [...tab.querySelectorAll('.dataTables_scrollBody tbody tr, :scope > table tbody tr, .dataTables_wrapper > table tbody tr')].filter(tr => !tr.classList.contains('dtrg-group') && !tr.classList.contains('sum_row') && !tr.classList.contains('zp-hidesum') && tr.children.length > 5);
        const st = hs.map(() => ({ a: 0, r: 0, b: 0, f: 0, k: 0, t: 0, p: rows.length }));
        rows.forEach(tr => [...tr.children].forEach((td, i) => {
            if (!st[i] || td.classList.contains('dtfc-fixed-left')) return;
            const inf = planerCellInfo(td); if (!inf.n) return;
            const s = st[i]; s.k++; s.t += inf.n; if (inf.abs) s.a++; if (inf.rem) s.r++; if (inf.br) s.b++; if (inf.fei) s.f++;
        }));
        // eigene geplante Bereitschaften (B1/B2) merken → Kachel „BR-Wochenenden“
        try {
            const me = rows.find(tr => tr.classList.contains('zp-me'));
            if (me) {
                let plan = {}; try { plan = JSON.parse(localStorage.getItem('zplus_brplan') || '{}') || {}; } catch (e) { }
                let ch = false;
                [...me.children].forEach((td, i) => { const k = hs[i] && hs[i].dataset.zpDate; if (!k) return; const b = planerCellInfo(td).br; if (b && !plan[k]) { plan[k] = 1; ch = true; } else if (!b && plan[k]) { delete plan[k]; ch = true; } });
                if (ch) localStorage.setItem('zplus_brplan', JSON.stringify(plan));
            }
        } catch (e) { }
        hs.forEach((th, i) => {
            if (!th.dataset.zpWd || th.classList.contains('dtfc-fixed-left')) return;
            const s = st[i], j = JSON.stringify(s); if (th.dataset.zpStat === j) return;
            th.dataset.zpStat = j;
            let c = th.querySelector('.zp-cnt'); if (!c) { c = document.createElement('span'); c.className = 'zp-cnt'; th.appendChild(c); }
            const lvl = !s.a ? 0 : s.a / Math.max(1, s.p) >= .3 ? 3 : s.a / Math.max(1, s.p) >= .15 ? 2 : 1;
            c.dataset.l = lvl; c.textContent = s.a ? String(s.a) : '·';
        });
    }
    // Abwesenheitsübersicht: Stern am Namen + Filter „Nur Favoriten“
    function abwFavs(favs, myKey) {
        const tabdiv = document.getElementById('tabdiv');
        if (!tabdiv || !tabdiv.querySelector('tbody tr')) return;
        tabdiv.querySelectorAll('tbody > tr').forEach(tr => {
            const td = [...tr.children].slice(0, 3).find(t => /[a-zäöü]{2}/i.test(cellName(t)) && !/^\d+$/.test(cellName(t)));
            if (!td) return;
            let st = td.querySelector(':scope > .zp-star');
            if (!st) { st = document.createElement('span'); st.className = 'zp-star'; td.appendChild(st); }
            const k = nameKey(cellName(td)), isF = favs.has(k), mine = k === myKey;
            if (mine) { st.remove(); return; }
            if (st.textContent !== (isF ? '★' : '☆')) st.textContent = isF ? '★' : '☆';
            st.title = isF ? 'Favorit entfernen' : 'Als Favorit anpinnen';
            setCls(td, 'zp-fav', isF);
        });
        // Farben: LHR färbt mal die Zelle, mal das innere Kästchen → kräftigste Farbe nehmen und selbst setzen
        const chroma = c => c ? Math.max(c.r, c.g, c.b) - Math.min(c.r, c.g, c.b) : 0;
        const sigOf = td => (td.getAttribute('style') || '').replace(/;?\s*--zc:[^;]*/g, '') + '|' + td.className.replace(/\s*zp-(acol|aempty|rem|tcol|tlast)\b/g, '') + '|' + td.innerHTML.length + '|' + td.textContent;
        const todo = [...tabdiv.querySelectorAll('tbody td:not(.dtfc-fixed-left)')].filter(td => td.dataset.zpAm !== sigOf(td));
        if (todo.length) {
            todo.forEach(td => { td.classList.remove('zp-acol', 'zp-aempty', 'zp-rem'); td.style.removeProperty('--zc'); });
            const res = todo.map(td => {                      // erst alles lesen (LHR-Farbe: Inline-Stil ODER Klasse, an der Zelle oder am Kästchen innen) …
                const els = [td, ...td.querySelectorAll('div,span')];
                const cands = els.map(x => rgbOf(x.style.backgroundColor)).concat(els.slice(0, 2).map(x => rgbOf(getComputedStyle(x).backgroundColor))).filter(c => c && c.a > .3);
                return cands.sort((a, b2) => chroma(b2) - chroma(a))[0] || null;
            });
            todo.forEach((td, i) => {                         // … dann schreiben
                const bg = res[i], we = /kalTag_sa|kalTag_so_fe/.test(td.className);
                const pink = bg && bg.r > 230 && bg.g > 90 && bg.g < 170 && bg.b > 150;
                const isR = /^R$/i.test((td.textContent || '').trim());
                const rem = isR && (!bg || pink || chroma(bg) < 45);
                const col = !rem && bg && chroma(bg) >= 45 && !(we && !td.textContent.trim() && chroma(bg) < 120);
                if (rem) td.classList.add('zp-rem');
                else if (col) { td.classList.add('zp-acol'); td.style.setProperty('--zc', cssRgb(bg)); }
                else if (!we) td.classList.add('zp-aempty');
                td.dataset.zpAm = sigOf(td);
            });
        }
        let bar = document.getElementById('zp-abw-bar');
        if (!bar) {
            bar = document.createElement('div'); bar.id = 'zp-abw-bar';
            tabdiv.parentNode.insertBefore(bar, tabdiv);
            bar.addEventListener('click', e => { const b = e.target.closest('[data-af]'); if (!b) return; S.abwFilter = b.dataset.af; saveS(); bar.dataset.sig = ''; safe('Team', markTeam); });
        }
        const mode = S.abwFilter || 'all', nf = favs.size, only = mode === 'fav' && nf > 0;
        const jq = window.jQuery, dtOk = !!(jq && jq.fn && jq.fn.dataTable && jq.fn.dataTable.ext);
        if (dtOk && !window.__zpAbwFilter) {
            window.__zpAbwFilter = true;
            jq.fn.dataTable.ext.search.push((st, data) => {
                if (!window.__zpAbwOnly || !st.nTable || !st.nTable.closest || !st.nTable.closest('#tabdiv')) return true;
                const u = userInfo(), fk = new Set(favList().map(f => f.k)), mk = nameKey(u.name);
                return data.slice(0, 3).some(c => { const t = String(c || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').trim(); if (u.nr && t === u.nr) return true; const k = nameKey(t); return k && (fk.has(k) || k === mk); });
            });
        }
        document.documentElement.classList.toggle('zp-abw-only', only);
        if (only) {
            const td = teamStore(), me = nameKey(userInfo().name);
            const miss = !td || Date.now() - td.ts > 20 * 60e3 || favList().some(f => f.k !== me && !td.names[f.k]);
            if (miss && !teamBusy && !window.__zpAbwTried) { window.__zpAbwTried = true; teamRefresh(() => renderAbwPanel(true)); }
        }
        renderAbwPanel(only);
        if (dtOk) {
            const want = only ? 'fav:' + [...favs].sort().join('|') : 'all';
            if (window.__zpAbwOnlyKey !== want) { window.__zpAbwOnly = only; window.__zpAbwOnlyKey = want; try { jq('#tabdiv table.dataTable').each((i, t) => { if (jq.fn.dataTable.isDataTable(t)) jq(t).DataTable().draw(); }); } catch (e) { } }
        }
        const sig = mode + '|' + nf;
        if (bar.dataset.sig === sig) return; bar.dataset.sig = sig;
        bar.innerHTML = `<span class="t">${ico('users', 14)} Anzeigen</span><button type="button" data-af="all" class="${mode !== 'fav' ? 'on' : ''}">Alle</button><button type="button" data-af="fav" class="${mode === 'fav' ? 'on' : ''}"${nf ? '' : ' disabled title="Erst mit ☆ beim Namen Favoriten markieren"'}>★ Ich + Favoriten${nf ? ' (' + nf + ')' : ''}</button><span class="h">☆ beim Namen anklicken, um jemanden als Favorit zu markieren.</span>`;
    }
    function renderFavBar(tcells) {
        const cont = document.getElementById('tableau_mitarbeiter_container');
        if (!cont) return;
        let host = document.getElementById('zp-fav-host');
        if (!host) {
            host = el('div'); host.id = 'zp-fav-host'; cont.parentNode.insertBefore(host, cont);
            const root = mkRoot(host); const box = el('div', 'zp-font'); box.id = 'zf'; root.appendChild(box);
            host._root = root;
            box.addEventListener('click', e => {
                const x = e.target.closest('[data-unfav]');
                if (x) { e.stopPropagation(); S.favs = favList().filter(f => f.k !== x.dataset.unfav); saveS(); teamSig = ''; markTeam(); return; }
                const c = e.target.closest('[data-fk]');
                if (c) { const td = [...document.querySelectorAll('#tableautab2 td, #tableautab td')].find(t => nameKey(cellName(t)) === c.dataset.fk); if (!td) { const sf = document.getElementById('tableau_suchfeld'), f = favList().find(x => x.k === c.dataset.fk); if (sf && f) { sf.value = f.n.split(/[\s,]+/).sort((x, y) => y.length - x.length)[0]; ['input', 'keyup'].forEach(ev => sf.dispatchEvent(new Event(ev, { bubbles: true }))); return; } } if (td) { td.scrollIntoView({ block: 'center', behavior: 'smooth' }); td.click(); td.classList.add('zp-flash'); setTimeout(() => td.classList.remove('zp-flash'), 1200); } else toast('Nicht in der Liste', 'Diese Person ist mit dem aktuellen Filter/der Seite nicht sichtbar.', { icon: 'users' }); }
            });
        }
        const byKey = new Map(tcells.map(td => [nameKey(cellName(td)), td]));
        const favs = favList();
        let tst = {}; try { tst = JSON.parse(localStorage.getItem(TST_KEY) || '{}') || {}; } catch (e) { }
        const items = favs.map(f => {
            const td = byKey.get(f.k), img = td && td.querySelector('img');
            if (!td && tst[f.k] && Date.now() - tst[f.k].ts < 15 * 60e3) return { f, src: tst[f.k].src, st: tst[f.k].st + ' · andere Abteilung', here: true, other: true };
            const st = img ? (img.getAttribute('title') || img.getAttribute('alt') || '') : '';
            return { f, src: img ? img.src : '', st, here: !!td };
        });
        { const upd = {}; favs.forEach(f => { const td = byKey.get(f.k); if (td) upd[f.k] = tstOf(td); });
          if (Object.keys(upd).length) try { localStorage.setItem(TST_KEY, JSON.stringify(Object.assign(tst, upd))); } catch (e) { } }
        const stale = favs.some(f => !byKey.get(f.k) && !(tst[f.k] && Date.now() - tst[f.k].ts < 3 * 60e3));
        if (stale && tcells.length && !tstBusy) tableauRefresh(() => { teamSig = ''; safe('Team', markTeam); });
        const sig = JSON.stringify(items.map(i => [i.f.k, i.src, i.st, i.here]));
        if (sig === teamSig) return;
        teamSig = sig;
        host._root.getElementById('zf').innerHTML = `<div class="zf-bar"><span class="zf-t">${ico('sparkle', 14)} Favoriten</span>
            ${items.length ? items.map(i => `<button type="button" class="zf-c${i.here ? '' : ' off'}" data-fk="${esc(i.f.k)}" title="${esc(i.f.n + (i.st ? ' · ' + i.st : '') + (i.here ? '' : ' · nicht in der aktuellen Liste'))}">
                ${i.src ? `<img src="${esc(i.src)}" alt="">` : '<i></i>'}<span>${esc(i.f.n)}</span><b data-unfav="${esc(i.f.k)}" title="Entfernen">${ico('x', 12)}</b></button>`).join('')
              : '<span class="zf-h">Stern ☆ bei einem Kollegen anklicken, um ihn hier anzupinnen.</span>'}</div>`;
    }
    function watchTeam() {
        if (PAGE !== 'other') return;
        let t = null;
        new MutationObserver(ms => { if (t || !ms.some(m => [...m.addedNodes].some(n => n.nodeType === 1 && !(n.classList && n.classList.contains('zp-star'))))) return; t = setTimeout(() => { t = null; safe('Team', markTeam); }, 200); })
            .observe(document.body, { childList: true, subtree: true });
        document.addEventListener('click', e => {
            const st = e.target.closest && e.target.closest('.zp-star');
            if (!st) return;
            e.stopImmediatePropagation(); e.preventDefault();
            const td = st.parentElement, n = cellName(td), k = nameKey(n);
            const fl = favList();
            S.favs = fl.some(f => f.k === k) ? fl.filter(f => f.k !== k) : fl.concat([{ k, n }]);
            saveS(); teamSig = ''; markTeam();
        }, true);
        ['mousedown', 'mouseup'].forEach(tp => document.addEventListener(tp, e => { if (e.target.closest && e.target.closest('.zp-star')) e.stopImmediatePropagation(); }, true));
        safe('Team', markTeam);
        setInterval(() => { if (!document.hidden) safe('Team', markTeam); }, 4000);
    }
    /* LHR Spalten-Menü finden (Knopf = Bild „spaltenoption“, Menü = Box mit Checkboxen + „Fixiert“) */
    function markColMenus() {
        safe('Spalten', syncDtPopup);
        document.querySelectorAll('.dt_popup:not(.zp-colmenu)').forEach(m => m.classList.add('zp-colmenu'));
        document.querySelectorAll('img[src*="spaltenoption" i]:not(.zp-colbtn)').forEach(i => i.classList.add('zp-colbtn'));
        const fixTxt = ((document.getElementById('fixiert') || {}).value || 'Fixiert').trim().toLowerCase();
        const cands = new Set();
        const m1 = document.getElementById('colMenue'); if (m1 && m1.querySelector('input[type=checkbox]')) cands.add(m1);
        document.querySelectorAll('input[type=checkbox]').forEach(cb => {
            if (cb.closest('.zp-colmenu') || cb.closest('#zp-host,#zp-list-host,#zp-shell-host,#zp-kal-host,#kalendertab_summe,table.tabelle,#zdlBody')) return;
            let n = cb.parentElement, best = null, cnt = 0;
            for (let k = 0; n && k < 8; k++, n = n.parentElement) {
                if (n === document.body || n.id === 'content' || n.tagName === 'SECTION' || n.tagName === 'FORM') break;
                if (n.querySelector('img[src*="spaltenoption" i]') || n.id === 'colHide') break;   // nie die Box mit dem Knopf erwischen
                const c = n.querySelectorAll('input[type=checkbox]').length;
                if (best && c > cnt) break;                       // nicht in größere Container ausbrechen
                if (c >= 4 && (n.textContent || '').toLowerCase().includes(fixTxt)) { best = n; cnt = c; }
            }
            if (best) cands.add(best);
        });
        document.querySelectorAll('.zp-colmenu').forEach(m => { if (m.querySelector('img[src*="spaltenoption" i]')) { m.classList.remove('zp-colmenu'); m.style.removeProperty('translate'); m.style.removeProperty('max-height'); } });
        cands.forEach(m => {
            if (m.querySelector('img[src*="spaltenoption" i]')) return;
            if (m.classList.contains('zp-colmenu')) return;
            if (m.parentElement && m.parentElement.closest('.zp-colmenu')) return;
            m.querySelectorAll('.zp-colmenu').forEach(o => o.classList.remove('zp-colmenu'));
            m.classList.add('zp-colmenu');
            [...m.querySelectorAll('*')].filter(e => !e.children.length && (e.textContent || '').trim().toLowerCase() === fixTxt).forEach(e => e.classList.add('zp-colhead'));
        });
        fitColMenus();
    }
    function fitColMenus() {
        document.querySelectorAll('.zp-colmenu').forEach(m => {
            m.style.removeProperty('translate');
            const r = m.getBoundingClientRect();
            if (!r.width || !r.height) return;
            let dx = 0;
            if (r.right > innerWidth - 14) dx = innerWidth - 14 - r.right;
            if (r.left + dx < 10) dx = 10 - r.left;
            if (dx) m.style.setProperty('translate', Math.round(dx) + 'px 0', 'important');
            const room = innerHeight - Math.max(r.top, 0) - 14;
            if (room > 160 && r.height > room) m.style.setProperty('max-height', room + 'px', 'important');
        });
    }
    function watchColMenus() {
        let t = null;
        const run = () => { if (t) return; t = setTimeout(() => { t = null; safe('Spalten', markColMenus); }, 40); };
        new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
        document.addEventListener('click', () => { [30, 160, 400].forEach(ms => setTimeout(() => safe('Spalten', markColMenus), ms)); }, true);
        window.addEventListener('resize', () => safe('Spalten', fitColMenus));
        run();
    }
    /* Leere LHR-Reste zwischen App-Leiste und Inhalt einklappen (leere <p>, leere Info-Kästen) */
    function collapseGaps() {
        if (!document.body || !SH) return;
        for (const e of document.body.children) {
            if (e.id === 'content' || (e.id || '').startsWith('zp-') || /^(SCRIPT|STYLE|LINK|INPUT|HEADER|NAV)$/.test(e.tagName)) continue;
            if (e.classList.contains('zp-hide-orig')) continue;
            const had = e.classList.contains('zp-gap');
            if (had) e.classList.remove('zp-gap');
            const txt = (e.innerText || '').replace(/\s+/g, '').length > 0;
            const ctl = [...e.querySelectorAll('input[type=button],input[type=submit],button,img,select,a[href]')].some(x => x.offsetWidth > 0 && x.offsetHeight > 0);
            const empty = !txt && !ctl;
            if (empty) e.classList.add('zp-gap');
        }
    }
    function watchColors() {       // Klassen-/Style-Wechsel (Markieren, Filtern, Nachladen) sofort nachfärben
        if (!document.body) return;
        new MutationObserver(ms => {
            let hit = false;
            ms.forEach(m => {
                if (m.type === 'childList') { if (m.addedNodes.length) hit = true; return; }
                if ((m.target.id || '').startsWith('zp-') || (m.attributeName === 'style' && cfOwn.get(m.target) === m.target.getAttribute('style'))) return;
                if (m.attributeName === 'style') { const strip = v => String(v || '').replace(/(^|;)\s*(left|right|top|transform)\s*:[^;]*/gi, '$1').replace(/[;\s]+/g, ';').replace(/^;|;$/g, ''); if (strip(m.oldValue) === strip(m.target.getAttribute('style'))) return; }      // Planer: LHR verschiebt beim Scrollen nur Positionen → nicht neu färben
                cfDirty.add(m.target); hit = true;
            });
            if (hit) fixColorsSoon();
        })
            .observe(document.body, { childList: true, subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['class', 'style'] });
        setInterval(() => { if (!document.hidden) safe('Farben', fixColors); }, 2500);
    }
    const fixColorsSoon = () => { if (cfTimer) return; cfTimer = setTimeout(() => { cfTimer = null; safe('Farben', fixColors); }, 60); };
    function markToday() {
        const body = tbody();
        if (!body) return;
        document.querySelectorAll('table.tabelle tbody').forEach(tb => { if (tb !== body) markRows(tb); });
        markRows(body);
    }
    function markRows(body) {
        const t0 = new Date(); t0.setHours(0, 0, 0, 0);
        const tk = todayKey();
        const brDays = new Set();
        body.querySelectorAll('tr[data-periode]').forEach(r => { const c = r.querySelector('td.td_zm'); const z = c && c.textContent.trim().toUpperCase(); if (z && brList().includes(z)) brDays.add(r.getAttribute('data-periode')); });
        body.querySelectorAll('tr[data-periode]').forEach(r => {
            const k = r.getAttribute('data-periode');
            r.classList.toggle('zp-br', brDays.has(k));
            if (k === tk) r.classList.add('zp-today');
            else if (/^\d\d\.\d\d\.\d{4}$/.test(k) && keyDate(k) > t0) r.classList.add('zp-future');
        });
        body.querySelectorAll('.td_text2_isDate').forEach(sp => { if (!/\d{1,2}:\d{2}/.test(sp.textContent) && /\?/.test(sp.textContent)) sp.classList.add('zp-open'); });
        body.querySelectorAll('.td_text1_isnotDate_vorUhrzeit').forEach(sp => { if (/^[_\s?]+$/.test(sp.textContent)) sp.classList.add('zp-gap-txt'); });
    }
    function hideEmptyCols() {
        const table = document.querySelector('table.tabelle');
        if (!table) return;
        const ths = [...table.querySelectorAll('thead tr:first-child > th')];
        const rows = [...table.querySelectorAll('tbody > tr')].filter(r => r.children.length === ths.length);
        if (!rows.length) return;
        const hidden = new Set();
        ths.forEach((th, i) => {
            if (i < 3) return;
            if (!rows.every(r => { const c = r.children[i]; return !c.textContent.trim() && !c.querySelector('a,img,input'); })) return;
            hidden.add(th.getAttribute('data-ueberschrift'));
            th.classList.add('zp-colhide');
            rows.forEach(r => r.children[i].classList.add('zp-colhide'));
        });
        document.querySelectorAll('th[data-ueberschrift]').forEach(th => { if (hidden.has(th.getAttribute('data-ueberschrift'))) th.classList.add('zp-colhide'); });
    }

    /* ════════════════════ MEHRFACHERFASSUNG ════════════════════ */
    const CP_V = 1;
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    function mbRows(table) {
        const seen = new Set(), out = [];
        table.querySelectorAll('td.mb_td').forEach(td => { const tr = td.closest('tr'); if (tr && !seen.has(tr)) { seen.add(tr); out.push(tr); } });
        return out;
    }
    const textInputs = r => r.querySelectorAll('input[type="text"], input:not([type])');
    const snap = r => [[...r.querySelectorAll('select')].map(s => s.value), [...textInputs(r)].map(i => i.value), (r.querySelector('input[type="checkbox"]') || {}).checked ? 1 : 0];
    function applySnap(r, s) {
        const [sv, iv, cb] = s;
        r.querySelectorAll('select').forEach((x, i) => { if (sv[i] != null) { x.value = sv[i]; x.dispatchEvent(new Event('change', { bubbles: true })); } });
        textInputs(r).forEach((x, i) => { if (iv[i] != null) { x.value = iv[i]; x.dispatchEvent(new Event('change', { bubbles: true })); } });
        const c = r.querySelector('input[type="checkbox"]'); if (c) c.checked = !!cb;
    }
    async function ensureRows(table, n) {
        for (let guard = 0; mbRows(table).length < n && guard < 60; guard++) {
            const first = mbRows(table)[0];
            const btn = first && first.querySelector('img[title="Neue Zeile"], img[alt="Neue Zeile"]');
            if (!btn) throw new Error('Kein "Neue Zeile"-Button');
            btn.click(); await sleep(60);
        }
        if (mbRows(table).length < n) throw new Error('Zu wenig Zeilen');
    }
    function buildCopyBar() {
        const first = document.querySelector('td.mb_td');
        if (!first) return;
        const table = first.closest('table');
        if (!table || !table.parentElement || table.parentElement.querySelector('#zp-cp')) return;
        const bar = el('div', null, '<b>Buchungen</b><button type="button" data-a="c">Kopieren</button><button type="button" data-a="p">Einfügen</button><span>Bereit</span>');
        bar.id = 'zp-cp';
        const status = bar.querySelector('span');
        bar.querySelector('[data-a="c"]').addEventListener('click', async () => {
            const json = JSON.stringify({ v: CP_V, r: mbRows(table).map(snap) });
            try { await navigator.clipboard.writeText(json); } catch (e) { window.prompt('JSON kopieren:', json); }
            status.textContent = mbRows(table).length + ' Zeilen kopiert';
        });
        bar.querySelector('[data-a="p"]').addEventListener('click', async e => {
            const b = e.currentTarget; b.disabled = true;
            try {
                let txt = '';
                try { txt = await navigator.clipboard.readText(); } catch (er) { }
                if (!txt) txt = window.prompt('JSON einfügen:', '') || '';
                let d = null; try { d = JSON.parse(txt); } catch (er) { }
                if (!d || d.v !== CP_V || !Array.isArray(d.r)) { status.textContent = 'Ungültige Daten'; return; }
                status.textContent = 'Füge ein…';
                await ensureRows(table, d.r.length);
                const rows = mbRows(table);
                d.r.forEach((s, i) => rows[i] && applySnap(rows[i], s));
                status.textContent = d.r.length + ' Zeilen eingefügt';
            } catch (er) { status.textContent = 'Fehler: ' + er.message; }
            finally { b.disabled = false; }
        });
        table.parentElement.insertBefore(bar, table);
    }
    /* ───── Mehrfacherfassung: Vorschau, wie die Tage danach in der Zeitdatenliste aussehen + Fehlbuchungs-Hinweise ───── */
    const MFE_CSS = `
.mp{font:13px/1.4 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif;color:var(--zp-text);background:var(--zp-surf);border:1px solid var(--zp-line);border-radius:14px;padding:14px 16px;margin:16px auto 14px;max-width:880px;text-align:left}
.mp h4{margin:0 0 4px;font-size:15px;display:flex;align-items:center;gap:8px}
.mp .s{color:var(--zp-muted);font-size:12px;margin-bottom:10px}
.mp .sum{display:inline-flex;gap:6px;margin-left:auto;font-size:12px;font-weight:600}
.mp .sum b{padding:2px 9px;border-radius:99px}
.mp .sum .w{background:color-mix(in srgb,var(--zp-warn) 18%,transparent);color:var(--zp-warn)}
.mp .sum .e{background:color-mix(in srgb,var(--zp-bad) 18%,transparent);color:var(--zp-bad)}
.mp .sum .k{background:color-mix(in srgb,var(--zp-ok) 18%,transparent);color:var(--zp-ok)}
.d{display:grid;grid-template-columns:86px 1fr 70px;gap:4px 12px;align-items:center;padding:9px 0;border-top:1px solid var(--zp-line)}
.d .dt{font-weight:700}.d .dt small{display:block;font-weight:500;color:var(--zp-muted);font-size:11px}
.d .tl{position:relative;height:18px;border-radius:6px;background:var(--zp-surf2)}
.d .tl i{position:absolute;top:3px;bottom:3px;border-radius:4px}
.d .tl i.old{background:color-mix(in srgb,var(--zp-muted) 55%,transparent)}
.d .tl i.new{background:var(--zp-accent);top:1px;bottom:1px;box-shadow:0 0 0 1px var(--zp-surf)}
.d .tl i.bad{background:var(--zp-bad)}
.d .tot{text-align:right;font-weight:700;font-variant-numeric:tabular-nums}
.d .ch{grid-column:2/4;display:flex;flex-wrap:wrap;gap:5px}
.c{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:7px;font-size:12px;font-weight:600;background:var(--zp-surf2);color:var(--zp-muted);font-variant-numeric:tabular-nums}
.c.new{background:color-mix(in srgb,var(--zp-accent) 18%,transparent);color:var(--zp-text);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--zp-accent) 45%,transparent)}
.c.abs{background:color-mix(in srgb,var(--zp-accent2) 18%,transparent);color:var(--zp-accent2)}
.c.rem{background:color-mix(in srgb,var(--zp-rem,#2dd4bf) 18%,transparent);color:var(--zp-rem,#2dd4bf)}
.m{grid-column:2/4;font-size:12px;display:flex;gap:6px;align-items:flex-start}
.m.e{color:var(--zp-bad)}.m.w{color:var(--zp-warn)}.m.i{color:var(--zp-muted)}
.ax{display:flex;justify-content:space-between;font-size:10px;color:var(--zp-muted);margin:0 70px 0 98px}
.none{color:var(--zp-muted);font-size:12.5px}`;
    const mmOf = t => { const m = String(t || '').trim().match(/^(\d{1,2}):?(\d{2})$/); if (!m) return null; const h = +m[1], mi = +m[2]; return h < 24 && mi < 60 ? h * 60 + mi : NaN; };
    const mmTxt = v => pad(Math.floor(v / 60)) + ':' + pad(v % 60);
    const dParse = t => { const m = String(t || '').match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/); return m ? new Date(+m[3], +m[2] - 1, +m[1], 12) : null; };
    const mfeMonths = new Map();               // "MM.YYYY" → Map(tag → rows) | 'loading' | null
    function mfeMonthDays(dt, redraw) {
        const per = pad(dt.getMonth() + 1) + '.' + dt.getFullYear();
        const cur = groupDays(); const any = cur.keys().next().value;
        if (any && any.slice(3) === per) return cur;
        if (mfeMonths.has(per)) { const v = mfeMonths.get(per); return v === 'loading' ? 'loading' : v; }
        mfeMonths.set(per, 'loading');
        fetch(monthUrl(per), { credentials: 'same-origin' }).then(r => r.ok ? r.text() : '').then(html => {
            const doc = new DOMParser().parseFromString(html || '', 'text/html'), tb = doc.getElementById('zdlBody'), map = new Map();
            if (tb) tb.querySelectorAll('tr[data-periode]').forEach(r => { const k = r.getAttribute('data-periode'); if (!/^\d\d\.\d\d\.\d{4}$/.test(k)) return; if (!map.has(k)) map.set(k, []); map.get(k).push(r); });
            mfeMonths.set(per, tb ? map : null); redraw();
        }).catch(() => { mfeMonths.set(per, null); redraw(); });
        return 'loading';
    }
    function mfeExisting(rows) {
        const segs = []; let info = '';
        (rows || []).forEach(r => {
            const zd = r.querySelector('td.td_zeitdaten'); if (!zd) return;
            const a = zd.querySelector('.td_text1_isDate'), b = zd.querySelector('.td_text2_isDate');
            if (a) { const s = mmOf((a.textContent.match(/\d{1,2}:\d{2}/) || [])[0]); const e = b ? mmOf((b.textContent.match(/\d{1,2}:\d{2}/) || [])[0]) : null; if (s != null && !isNaN(s)) segs.push({ s, e: e != null && !isNaN(e) ? e : null }); }
            else if (!info) { const t = zd.textContent.replace(/[_?]/g, '').replace(/\s+/g, ' ').trim(); if (t && !/^\d{1,2}:\d{2}$/.test(t) && !/Periodenschluss|Abrechnung|Übertrag|Vortr/.test(t)) info = t.replace(/^\d{1,2}:\d{2}\s*/, ''); }
        });
        return { segs, info };
    }
    function mfeRead(dlg) {
        const bookings = [], absences = [];
        dlg.querySelectorAll('#mbu_tbody > tr').forEach((tr, i) => {
            const art = tr.querySelector('select.buchung_art'), dIn = tr.querySelector('input.datum'), v = tr.querySelector('input.vonzeit'), b = tr.querySelector('input.biszeit');
            const raw = [dIn && dIn.value, v && v.value, b && b.value];
            if (!raw.some(x => x && x.trim())) return;
            bookings.push({ i: i + 1, art: art ? art.options[art.selectedIndex].text.trim() : 'Buchung', normal: !art || art.value === '-1', dt: dParse(raw[0]), dRaw: raw[0], s: mmOf(raw[1]), e: mmOf(raw[2]), sRaw: raw[1], eRaw: raw[2], end: !!(tr.querySelector('input.mb_checkbox:not(.rk_reisestart):not(.rk_reiseende)') || {}).checked });
        });
        const showAbw = dlg.querySelector('#showAbwesenheit');
        if (showAbw && showAbw.checked) dlg.querySelectorAll('#abw_tbody > tr').forEach((tr, i) => {
            const sel = tr.querySelector('select.multi-urlaub-abws'), f = tr.querySelector('input[name="datumvonInput"]'), t = tr.querySelector('input[name="datumbisInput"]');
            const a = dParse(f && f.value), z = dParse(t && t.value) || a;
            if (!a || !sel) return;
            absences.push({ i: i + 1, name: sel.options[sel.selectedIndex].text.trim(), a, z });
        });
        return { bookings, absences };
    }
    function mfePreview(dlg, host) {
        const root = host.shadowRoot, box = root.getElementById('mp');
        const { bookings, absences } = mfeRead(dlg);
        const days = new Map();                // tag → {dt, nb:[], ab:[], msgs:[]}
        const day = dt => { const k = dayKey(dt); if (!days.has(k)) days.set(k, { dt, nb: [], ab: [], msgs: [] }); return days.get(k); };
        const loose = [];
        bookings.forEach(b => {
            if (!b.dt) { loose.push({ t: 'e', x: `Zeile ${b.i}: kein gültiges Datum` + (b.dRaw ? ` („${b.dRaw}“)` : '') }); return; }
            const d = day(b.dt);
            if (b.s == null || isNaN(b.s)) d.msgs.push({ t: 'e', x: `Zeile ${b.i}: „Von“ fehlt oder ist ungültig` + (b.sRaw ? ` („${b.sRaw}“)` : '') });
            if (b.e != null && isNaN(b.e)) d.msgs.push({ t: 'e', x: `Zeile ${b.i}: „Bis“ ist ungültig („${b.eRaw}“)` });
            if (b.e == null && !b.end && b.s != null && !isNaN(b.s)) d.msgs.push({ t: 'w', x: `Zeile ${b.i}: kein „Bis“ – es wird nur eine Kommen-Buchung angelegt` });
            if (b.s != null && b.e != null && !isNaN(b.s) && !isNaN(b.e) && b.e <= b.s) d.msgs.push({ t: 'e', x: `Zeile ${b.i}: Ende ${mmTxt(b.e)} liegt vor Beginn ${mmTxt(b.s)}` });
            d.nb.push(b);
        });
        absences.forEach(a => { for (let t = new Date(a.a); t <= a.z && days.size < 120; t.setDate(t.getDate() + 1)) { const dt = new Date(t); if (dt.getDay() === 0 || dt.getDay() === 6) continue; day(dt).ab.push(a); } });
        const keys = [...days.keys()].sort((x, y) => days.get(x).dt - days.get(y).dt);
        let loading = false, nE = loose.filter(m => m.t === 'e').length, nW = 0;
        const t0 = new Date(); t0.setHours(23, 59, 59);
        const LO = 6 * 60, HI = 20 * 60, X = v => Math.max(0, Math.min(100, (v - LO) / (HI - LO) * 100));
        const rows = keys.map(k => {
            const d = days.get(k), wd = d.dt.getDay();
            const md = mfeMonthDays(d.dt, () => mfePreview(dlg, host));
            let ex = { segs: [], info: '' }, known = false;
            if (md === 'loading') loading = true; else if (md) { known = true; ex = mfeExisting(md.get(k)); }
            const msgs = d.msgs.slice();
            const isRem = t => /remote|home/i.test(t || '');
            if (wd === 0 || wd === 6) msgs.push({ t: 'w', x: (wd === 0 ? 'Sonntag' : 'Samstag') + ' – wirklich an diesem Tag?' });
            if (/feiertag/i.test(ex.info)) msgs.push({ t: 'w', x: 'Feiertag' });
            if (d.nb.length && ex.info && !isRem(ex.info) && !/feiertag/i.test(ex.info) && !/bereitschaft/i.test(ex.info)) msgs.push({ t: 'w', x: `Tag hat schon „${ex.info}“ eingetragen` });
            if (d.ab.length && ex.segs.length) d.ab.filter(a => !isRem(a.name)).forEach(a => msgs.push({ t: 'w', x: `${a.name} an einem Tag mit Buchungen (${ex.segs.map(g => mmTxt(g.s) + '–' + (g.e != null ? mmTxt(g.e) : '?')).join(', ')})` }));
            if (d.ab.length && d.nb.length) d.ab.filter(a => !isRem(a.name)).forEach(a => msgs.push({ t: 'w', x: `${a.name} und neue Buchungen am selben Tag` }));
            if (d.ab.length > 1) msgs.push({ t: 'w', x: 'Mehrere Abwesenheiten am selben Tag' });
            if (ex.info && d.ab.some(a => !isRem(a.name)) && !isRem(ex.info)) msgs.push({ t: 'w', x: `Schon eingetragen: „${ex.info}“` });
            if (d.dt > t0 && d.nb.some(b => b.normal)) msgs.push({ t: 'i', x: 'Datum liegt in der Zukunft' });
            // Überschneidungen (neu ↔ vorhanden, neu ↔ neu)
            const nv = d.nb.filter(b => b.s != null && !isNaN(b.s)).map(b => ({ s: b.s, e: b.e != null && !isNaN(b.e) && b.e > b.s ? b.e : b.s + 1, b }));
            const isT = k === todayKey(), nowM = new Date().getHours() * 60 + new Date().getMinutes();
            const old = ex.segs.map(g => ({ s: g.s, e: g.e != null ? g.e : isT ? Math.max(g.s + 1, nowM) : g.s + 1, open: g.e == null }));
            old.filter(o => o.open).forEach(o => msgs.push(isT ? { t: 'i', x: `Du bist seit ${mmTxt(o.s)} eingestempelt (läuft bis jetzt)` } : { t: 'w', x: `Offene Kommen-Buchung um ${mmTxt(o.s)} ohne Gehen` }));
            const bad = new Set();
            nv.forEach((n, i) => {
                old.forEach(o => { if (n.s < o.e && o.s < n.e) { bad.add(n); msgs.push({ t: 'e', x: `Zeile ${n.b.i}: überschneidet sich mit vorhandener Buchung ${mmTxt(o.s)}–${mmTxt(o.e)}` }); } });
                nv.slice(i + 1).forEach(m => { if (n.s < m.e && m.s < n.e) { bad.add(n); bad.add(m); msgs.push({ t: 'e', x: `Zeile ${n.b.i} und ${m.b.i} überschneiden sich` }); } });
            });
            const total = old.filter(o => o.e > o.s + 1).reduce((a, o) => a + o.e - o.s, 0) + nv.filter(n => n.e > n.s + 1).reduce((a, n) => a + n.e - n.s, 0);
            if (total > 10 * 60) msgs.push({ t: 'w', x: `Zusammen ${mmTxt(total)} h – über der 10-h-Grenze` });
            nE += msgs.filter(m => m.t === 'e').length; nW += msgs.filter(m => m.t === 'w').length;
            const bars = old.map(o => `<i class="old" style="left:${X(o.s)}%;width:${Math.max(.6, X(o.e) - X(o.s))}%" title="vorhanden ${mmTxt(o.s)}–${mmTxt(o.e)}"></i>`).join('') + nv.map(n => `<i class="new${bad.has(n) ? ' bad' : ''}" style="left:${X(n.s)}%;width:${Math.max(.6, X(n.e) - X(n.s))}%" title="neu ${mmTxt(n.s)}–${mmTxt(n.e)}"></i>`).join('');
            const chips = ex.segs.map(g => `<span class="c" title="schon in der Zeitdatenliste">${mmTxt(g.s)}–${g.e != null ? mmTxt(g.e) : '?'}</span>`).join('')
                + (ex.info ? `<span class="c ${isRem(ex.info) ? 'rem' : 'abs'}">${esc(ex.info)}</span>` : '')
                + d.nb.map(b => `<span class="c new" title="neu: ${esc(b.art)}">+ ${b.s != null && !isNaN(b.s) ? mmTxt(b.s) : '?'}–${b.e != null && !isNaN(b.e) ? mmTxt(b.e) : (b.end ? 'Ende' : '…')}${b.normal ? '' : ' · ' + esc(b.art)}</span>`).join('')
                + d.ab.map(a => `<span class="c ${isRem(a.name) ? 'rem' : 'abs'}">+ ${esc(a.name)}</span>`).join('');
            const ic = { e: ico('alert', 13), w: ico('alert', 13), i: ico('help', 13) };
            return `<div class="d"><div class="dt">${WD_SHORT[wd]} ${pad(d.dt.getDate())}.${pad(d.dt.getMonth() + 1)}.<small>${known ? 'aus Zeitdatenliste' : md === 'loading' ? 'wird geladen …' : 'Monat nicht geladen'}</small></div>
                <div class="tl">${bars}</div><div class="tot">${total ? mmTxt(total) : '–'}</div>
                <div class="ch">${chips || '<span class="c">noch nichts</span>'}</div>
                ${msgs.map(m => `<div class="m ${m.t}">${ic[m.t]}<span>${esc(m.x)}</span></div>`).join('')}</div>`;
        }).join('');
        const sum = nE ? `<b class="e">${nE} Fehler</b>` : '' ;
        const sumW = nW ? `<b class="w">${nW} Hinweis${nW > 1 ? 'e' : ''}</b>` : '';
        const ok = !nE && !nW && keys.length ? '<b class="k">sieht gut aus</b>' : '';
        box.innerHTML = `<h4>${ico('eye', 16)} Vorschau: so sieht's danach in der Zeitdatenliste aus<span class="sum">${sum}${sumW}${ok}</span></h4>
            <div class="s">Grau = schon gebucht, blau = neu aus diesem Dialog, rot = Überschneidung. Pausenabzüge rechnet LHR erst nach dem Eintragen.${loading ? ' Lade Monatsdaten …' : ''}</div>
            ${loose.map(m => `<div class="m e">${ico('alert', 13)}<span>${esc(m.x)}</span></div>`).join('')}
            ${keys.length ? `<div class="ax"><span>06</span><span>09</span><span>12</span><span>15</span><span>18</span><span>20</span></div>${rows}` : '<div class="none">Sobald du oben Tag und Uhrzeiten einträgst, erscheint hier die Vorschau.</div>'}`;
        const btn = dlg.querySelector('#mehrfacherfassung_submit');
        if (btn) { btn.title = nE ? nE + ' Fehler in der Vorschau – bitte prüfen' : ''; btn.classList.toggle('zp-mfe-err', nE > 0); }
    }
    function mfeAttach() {
        const dlg = document.getElementById('mehrfacherfassungBody');
        if (!dlg || dlg.querySelector('#zp-mfe-prev')) return;
        const panel = dlg.querySelector('#multi_buttonPanel');
        const host = el('div'); host.id = 'zp-mfe-prev';
        if (panel) panel.parentNode.insertBefore(host, panel); else dlg.appendChild(host);
        const root = mkRoot(host); const st = document.createElement('style'); st.textContent = MFE_CSS; root.appendChild(st);
        const box = el('div', 'mp zp-font'); box.id = 'mp'; root.appendChild(box);
        let t = null; const go = () => { clearTimeout(t); t = setTimeout(() => safe('Mehrfacherfassung', () => mfePreview(dlg, host)), 150); };
        ['input', 'change', 'click', 'keyup'].forEach(ev => dlg.addEventListener(ev, go, true));
        new MutationObserver(go).observe(dlg, { childList: true, subtree: true, attributes: true, attributeFilter: ['value', 'style'] });
        const tick = setInterval(() => { if (!document.body.contains(host)) { clearInterval(tick); return; } go(); }, 1500);   // Datumsauswahl (flatpickr) setzt value ohne Event
        go();
    }
    /* ───── Team: wer ist verfügbar (Büro/Remote) und wer abwesend – Daten aus der Abwesenheitsübersicht ───── */
    const TEAM_KEY = 'zplus_team';
    const teamStore = () => { try { return JSON.parse(localStorage.getItem(TEAM_KEY) || 'null'); } catch (e) { return null; } };
    function teamParse(doc, win, all) {
        const fv = doc.getElementById('datumvon'), start = dParse(fv && fv.value) || new Date();
        const tables = [...doc.querySelectorAll('#tabdiv table')].filter(t => t.querySelector('tbody td.kalTag, tbody td.kalTag_sa, tbody td.kalTag_so_fe'));
        const tbl = tables[0]; if (!tbl) return null;
        const head = [...doc.querySelectorAll('#tabdiv thead tr')].map(tr => [...tr.children]).find(ths => ths.some(th => /^\d{1,2}\.\d{1,2}\.?$/.test(th.textContent.trim()))) || [];
        let y = start.getFullYear(), lastM = start.getMonth();
        const colDate = head.map(th => { const m = th.textContent.trim().match(/^(\d{1,2})\.(\d{1,2})\.?$/); if (!m) return null; const mo = +m[2] - 1; if (mo < lastM - 6) y++; lastM = mo; return dayKey(new Date(y, mo, +m[1], 12)); });
        let rows = [];
        try {
            const jq = win && win.jQuery;
            if (jq && jq.fn && jq.fn.dataTable && jq.fn.dataTable.isDataTable(tbl)) {
                const api = jq(tbl).DataTable();
                if (all && api.rows().nodes().toArray().some(n => !n)) { try { api.page.len(-1).draw(false); } catch (e) { } }      // Hintergrund-Rahmen: alle Zeilen zeichnen, damit LHR jede Zelle einfärbt
                const nodes = api.rows().nodes().toArray(), data = api.rows().data().toArray();
                rows = data.map((r, i) => {
                    if (nodes[i]) return nodes[i];
                    const tr = doc.createElement('tr'); tr.dataset.raw = '1';           // Zeile auf einer anderen Seite (noch nicht gezeichnet): aus den Rohdaten bauen
                    (Array.isArray(r) ? r : Object.values(r)).forEach(c => { const td = doc.createElement('td'); td.innerHTML = String(c == null ? '' : c); const dv = td.firstElementChild; if (dv && dv.className) td.className = dv.className; tr.appendChild(td); });
                    return tr;
                });
            }
        } catch (e) { }
        if (!rows.length) rows = [...tbl.querySelectorAll('tbody > tr')];
        const favs = new Set(favList().map(f => f.k)), myKey = nameKey(userInfo().name);
        const days = {}, names = {};
        rows.forEach(tr => {
            const tds = [...tr.children];
            const nm = tds.slice(0, 3).map(t => cellName(t)).find(t => /[a-zäöü]{2}/i.test(t) && !/^\d+$/.test(t)) || '';
            const k = nameKey(nm); if (!k || (!favs.has(k) && k !== myKey)) return;
            names[k] = nm;
            tds.forEach((td, i) => {
                const dk = colDate[i]; if (!dk) return;
                const cls = td.className || '';
                let st = 'da', l = (td.textContent || '').replace(/\s+/g, '').trim();
                if (/kalTag_sa|kalTag_so_fe/.test(cls) && !l) st = 'frei';
                else {
                    const dv = td.querySelector('div'), b1 = rgbOf(td.style.backgroundColor), b2 = rgbOf(dv && dv.style.backgroundColor), ch = c => c ? Math.max(c.r, c.g, c.b) - Math.min(c.r, c.g, c.b) : 0;
                    let bg = b1 && b1.a > .1 ? b1 : b2 && b2.a > .1 ? b2 : b1 || b2;
                    if (!(bg && bg.a > .1) && !tr.dataset.raw && td.isConnected) { try { const gw = doc.defaultView || window; const c3 = [td, dv].filter(Boolean).map(x => rgbOf(gw.getComputedStyle(x).backgroundColor)).filter(c => c && c.a > .3 && ch(c) >= 45).sort((a, b) => ch(b) - ch(a))[0]; if (c3) bg = c3; } catch (e) { } }      // Farbe über CSS-Klasse
                    const colored = bg && bg.a > .1 && !(bg.r > 245 && bg.g > 245 && bg.b > 245);
                    if (/^R$/i.test(l)) st = 'rem'; else if (colored || l) st = 'abs';
                    if (colored) { (days[dk] = days[dk] || {})[k] = { st, l, c: cssRgb(bg) }; return; }
                }
                if (tr.dataset.raw && st === 'da') return;            // Rohdaten ohne Farbe: nichts behaupten
                (days[dk] = days[dk] || {})[k] = { st, l };
            });
        });
        return { ts: Date.now(), days, names };
    }
    function teamSave(data) {
        if (!data || !Object.keys(data.names).length) return;
        const old = teamStore();
        if (old && old.days && Date.now() - old.ts < 2 * 864e5) {         // zusammenführen: neue Werte gewinnen, andere Personen bleiben
            Object.entries(old.days).forEach(([dk, ppl]) => { const nd = data.days[dk] = data.days[dk] || {}; Object.entries(ppl).forEach(([k, v]) => { if (!(k in data.names) && !(k in nd)) nd[k] = v; }); });
            Object.entries(old.names || {}).forEach(([k, n]) => { if (!data.names[k]) data.names[k] = n; });
        }
        try { localStorage.setItem(TEAM_KEY, JSON.stringify(data)); } catch (e) { }
    }
    let teamBusy = false;
    const zsleep = ms => new Promise(r => setTimeout(r, ms));
    async function zwait(fn, ms, step) { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { const v = fn(); if (v) return v; } catch (e) { } await zsleep(step || 400); } return null; }
    function teamMerge(a, b) {
        if (!a) return b; if (!b) return a;
        const rk = v => v ? ({ abs: 3, rem: 2, frei: 1, da: 0 }[v.st] || 0) + (v.c ? .5 : 0) : -1;
        Object.entries(b.days).forEach(([dk, ppl]) => { const t = a.days[dk] = a.days[dk] || {}; Object.entries(ppl).forEach(([k, v]) => { if (rk(v) >= rk(t[k])) t[k] = v; }); });
        Object.assign(a.names, b.names); a.ts = Math.max(a.ts, b.ts); return a;
    }
    function hiddenFrame(name, src) {
        const fr = document.createElement('iframe'); fr.name = name; fr.setAttribute('aria-hidden', 'true');
        fr.style.cssText = 'position:fixed;left:-9999px;top:0;width:1400px;height:900px;border:0;visibility:hidden';
        fr.src = src; document.body.appendChild(fr); return fr;
    }
    const setSel = (w, x, val, fn) => { if (!x || x.value === val || ![...x.options].some(o => o.value === val)) return false; x.value = val; try { if (typeof w[fn] === 'function') w[fn](x); else x.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) { try { x.dispatchEvent(new Event('change', { bubbles: true })); } catch (e2) { } } return true; };
    async function teamRefresh(done) {
        if (teamBusy) return; teamBusy = true;
        const a = document.getElementById('zm_abw_uebersicht');
        const fr = hiddenFrame('zp-team', a ? a.getAttribute('href') : '/Self/Abwesenheitsuebersicht?modulId=0');
        let ok = false, restore = null;
        try {
            await zwait(() => fr.contentDocument && fr.contentDocument.readyState === 'complete', 25000);
            const d = () => fr.contentDocument, w = () => fr.contentWindow;
            const ready = () => d() && d().querySelector('#tabdiv tbody td.kalTag, #tabdiv tbody td.kalTag_sa, #tabdiv tbody td.kalTag_so_fe');
            if (!await zwait(ready, 25000)) throw 'keine Tabelle';
            await zsleep(500);
            const sig = () => { const x = d(); return ((x.querySelector('#tabdiv .dataTables_info') || {}).textContent || '') + '|' + x.querySelectorAll('#tabdiv tbody tr').length + '|' + ((x.querySelector('#tabdiv tbody tr') || {}).textContent || '').slice(0, 40); };
            const settle = async s0 => { await zwait(() => sig() !== s0 && ready(), 20000); await zsleep(700); };
            const me = nameKey(userInfo().name);
            const missing = acc => favList().filter(f => f.k !== me && !(acc && acc.names[f.k]));
            let acc = teamParse(d(), w(), true);
            const orig = { fa: (d().getElementById('abw_dropdown_fa') || {}).value, abt: (d().getElementById('abw_dropdown_abt') || {}).value };
            restore = async () => {
                try {
                    const A = api(); if (A) A.search('').draw();
                    if (orig.fa && setSel(w(), d().getElementById('abw_dropdown_fa'), orig.fa, 'changeAbt')) await zsleep(2500);
                    if (orig.abt) await zwait(() => [...(d().getElementById('abw_dropdown_abt') || { options: [] }).options].some(o => o.value === orig.abt), 6000);
                    if (orig.abt) setSel(w(), d().getElementById('abw_dropdown_abt'), orig.abt, 'changeAbteilung');
                    await zsleep(2500);
                } catch (e) { }
            };
            const api = () => { const jq = w().jQuery, t = [...d().querySelectorAll('#tabdiv table')].find(x => x.querySelector('tbody td.kalTag, tbody td.kalTag_sa')); return jq && jq.fn && jq.fn.dataTable && t && jq.fn.dataTable.isDataTable(t) ? jq(t).DataTable() : null; };
            const searchMissing = async () => {          // jede fehlende Person gezielt suchen (klappt auch, wenn LHR seitenweise lädt)
                for (const f of missing(acc)) {
                    const term = (f.n || '').split(/[\s,]+/).filter(x => x.length > 1).sort((x, y) => y.length - x.length)[0]; if (!term) continue;
                    const s0 = sig(), A = api();
                    if (A) A.search(term).draw();
                    else { const inp = d().getElementById('csuche'); if (!inp) break; inp.value = term; ['input', 'keyup', 'search'].forEach(ev => inp.dispatchEvent(new Event(ev, { bubbles: true }))); }
                    await settle(s0); acc = teamMerge(acc, teamParse(d(), w(), true));
                }
                const A = api(); if (A) { const s0 = sig(); A.search('').draw(); await settle(s0); }
            };
            if (missing(acc).length) {
                const s0 = sig(); if (setSel(w(), d().getElementById('abw_dropdown_abt'), '0', 'changeAbteilung')) { await settle(s0); acc = teamMerge(acc, teamParse(d(), w(), true)); }
            }
            if (missing(acc).length) await searchMissing();
            if (missing(acc).length) {
                const s0 = sig();
                if (setSel(w(), d().getElementById('abw_dropdown_fa'), '0', 'changeAbt')) {
                    await zsleep(2500); setSel(w(), d().getElementById('abw_dropdown_abt'), '0', 'changeAbteilung');
                    await settle(s0); acc = teamMerge(acc, teamParse(d(), w(), true));
                    if (missing(acc).length) await searchMissing();
                }
            }
            if (acc) { teamSave(acc); ok = true; }
        } catch (e) { }
        if (restore) await restore();
        teamBusy = false; setTimeout(() => fr.remove(), 500); if (done) done(ok);
    }
    /* Tableau: Status von Favoriten aus anderen Abteilungen im Hintergrund holen */
    const TST_KEY = 'zplus_tstat';
    const tstOf = td => {            // Status-Bild der Person (an-/abwesend …), egal welches Bild zuerst kommt
        const imgs = [...td.querySelectorAll('img')], im = imgs.find(i => /wesend|status/i.test((i.getAttribute('title') || '') + ' ' + (i.getAttribute('alt') || '') + ' ' + (i.getAttribute('src') || '') + ' ' + i.className)) || imgs[0];
        const st = im ? (im.getAttribute('title') || im.getAttribute('alt') || '') : '';
        return { src: im ? im.src : '', st: st || (/(ab|an)wesend/i.exec(td.className + ' ' + td.textContent) || [''])[0], ts: Date.now() };
    };
    let tstBusy = false;
    async function tableauRefresh(done) {
        if (tstBusy || Date.now() - (tableauRefresh.last || 0) < 80e3) { if (done) done(); return; } tstBusy = true; tableauRefresh.last = Date.now();
        const a = document.getElementById('zm_tableau');
        const fr = hiddenFrame('zp-tst', a ? a.getAttribute('href') : '/Self/Tableau?modulId=0');
        let restoreT = null;
        try {
            const d = () => fr.contentDocument, w = () => fr.contentWindow;
            const cells = () => [...d().querySelectorAll('#tableautab2 td, #tableautab td')].filter(td => cellName(td).length > 2);
            if (!await zwait(() => d() && cells().length, 25000)) throw 'leer';
            const s0 = cells().length + '|' + cells().map(cellName).join('').length;
            const oAbt = (d().getElementById('tableau_dropdown_abt') || {}).value, oPp = (d().getElementById('per_page_count') || {}).value;
            restoreT = async () => { try { if (oPp) setSel(w(), d().getElementById('per_page_count'), oPp, 'onChangePerPage'); await zsleep(1000); if (oAbt) setSel(w(), d().getElementById('tableau_dropdown_abt'), oAbt, 'changeAbteilung'); await zsleep(2500); } catch (e) { } };
            const sig = () => cells().length + '|' + cells().map(cellName).join('').length;
            // Status-Filter („nur anwesend“) kurz auf „alle“, sonst fehlen die Ausgestempelten
            let restSt = async () => { };
            { const sSel = () => d().getElementById('tableau_dropdown_status'), oSt = (sSel() || {}).value;
              if (oSt && oSt !== 'alle') { const s1 = sig(); setSel(w(), sSel(), 'alle', 'changeStatus'); await zwait(() => sig() !== s1 && cells().length, 8000); await zsleep(800); restSt = async () => { try { setSel(w(), sSel(), oSt, 'changeStatus'); await zsleep(1500); } catch (e) { } }; } }
            { const r0 = restoreT; restoreT = async () => { await r0(); await restSt(); }; }
            const grab = () => { const st = {}, favs = new Set(favList().map(f => f.k)); cells().forEach(td => { const k = nameKey(cellName(td)); if (favs.has(k)) st[k] = tstOf(td); }); return st; };
            { const st0 = grab(), me = nameKey(userInfo().name); if (favList().every(f => f.k === me || st0[f.k])) { let old = {}; try { old = JSON.parse(localStorage.getItem(TST_KEY) || '{}') || {}; } catch (e) { } try { localStorage.setItem(TST_KEY, JSON.stringify(Object.assign(old, st0))); } catch (e) { } restoreT = restSt; throw 'fertig'; } }
            setSel(w(), d().getElementById('per_page_count'), '1000', 'onChangePerPage');
            await zsleep(1200);
            setSel(w(), d().getElementById('tableau_dropdown_abt'), '0', 'changeAbteilung');
            await zwait(() => sig() !== s0 && cells().length, 20000); await zsleep(1500);
            const st = {}; const favs = new Set(favList().map(f => f.k));
            cells().forEach(td => { const k = nameKey(cellName(td)); if (favs.has(k)) st[k] = tstOf(td); });
            let old = {}; try { old = JSON.parse(localStorage.getItem(TST_KEY) || '{}') || {}; } catch (e) { }
            try { localStorage.setItem(TST_KEY, JSON.stringify(Object.assign(old, st))); } catch (e) { }
        } catch (e) { }
        if (restoreT) await restoreT();
        tstBusy = false; setTimeout(() => fr.remove(), 500); if (done) done();
    }
    const TEAM_CSS = `
.tm{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;padding:12px 16px;border-radius:16px;background:var(--zp-surf);border:1px solid var(--zp-line);font:13px/1.3 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif;color:var(--zp-text)}
.tm .t{display:flex;align-items:center;gap:7px;font-weight:700}
.tm .seg{display:inline-flex;border:1px solid var(--zp-line);border-radius:9px;overflow:hidden}
.tm .seg button{border:0;background:transparent;color:var(--zp-muted);font:600 12px/1 inherit;padding:6px 10px;cursor:pointer}
.tm .seg button.on{background:var(--zp-accent);color:var(--zp-onacc,#fff)}
.tm .g{display:flex;flex-wrap:wrap;align-items:center;gap:6px}
.tm .g > small{font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--zp-muted);margin-right:2px}
.tm .c{display:inline-flex;align-items:center;gap:5px;padding:4px 9px;border-radius:99px;font-weight:600;font-size:12.5px;background:color-mix(in srgb,var(--zp-ok) 14%,transparent);color:var(--zp-text);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--zp-ok) 35%,transparent)}
.tm .c em{font-style:normal;font-size:11px;font-weight:700;color:var(--zp-ok)}
.tm .c.rem{background:color-mix(in srgb,var(--zp-rem,#2dd4bf) 14%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--zp-rem,#2dd4bf) 40%,transparent)}
.tm .c.rem em{color:var(--zp-rem,#2dd4bf)}
.tm .c.abs{background:color-mix(in srgb,var(--zp-bad) 12%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--zp-bad) 35%,transparent);color:var(--zp-muted)}
.tm .c.abs em{color:var(--zp-bad)}
.tm .sp{flex:1}
.tm .f{font-size:11.5px;color:var(--zp-muted);display:flex;align-items:center;gap:6px}
.tm .f button{border:0;background:transparent;color:var(--zp-muted);cursor:pointer;padding:3px;display:grid;place-items:center;border-radius:6px}
.tm .f button:hover{color:var(--zp-text);background:var(--zp-surf2)}
.tm .dot{width:7px;height:7px;border-radius:50%;flex:none;margin-right:1px}
.tm .dot.in{background:var(--zp-ok);box-shadow:0 0 0 2px color-mix(in srgb,var(--zp-ok) 25%,transparent)}
.tm .dot.out{background:var(--zp-bad);box-shadow:0 0 0 2px color-mix(in srgb,var(--zp-bad) 22%,transparent)}
.tm .f button.spin svg{animation:tmspin .8s linear infinite;color:var(--zp-accent)}
@keyframes tmspin{to{transform:rotate(360deg)}}
.tm .f b.ld{font-weight:700;color:var(--zp-accent)}
.tm .f b.ok{font-weight:700;color:var(--zp-ok)}
.tm .f i.lv{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--zp-ok);margin-right:5px;vertical-align:1px;animation:tmlv 2s ease-in-out infinite}
@keyframes tmlv{50%{opacity:.35}}
.tm .h{color:var(--zp-muted);font-size:12.5px}`;
    let teamDay = 0;
    function renderTeam(box) {
        const data = teamStore(), favs = favList(), myKey = nameKey(userInfo().name);
        const d0 = new Date(); d0.setHours(12, 0, 0, 0);
        const next = new Date(d0); do next.setDate(next.getDate() + 1); while (next.getDay() === 0 || next.getDay() === 6);
        const dt = teamDay ? next : d0, dk = dayKey(dt);
        const lab = (teamDay ? (next.getDate() - d0.getDate() === 1 ? 'Morgen' : WD_LONG[next.getDay()]) : 'Heute');
        const seg = `<span class="seg"><button type="button" data-td="0" class="${teamDay ? '' : 'on'}">Heute</button><button type="button" data-td="1" class="${teamDay ? 'on' : ''}">${next.getDate() - d0.getDate() === 1 ? 'Morgen' : WD_SHORT[next.getDay()]}</button></span>`;
        const head = `<span class="t">${ico('users', 15)} Team</span>${seg}`;
        if (!favs.length) { box.innerHTML = `<div class="tm">${head}<span class="h">Markiere in der Abwesenheitsübersicht oder im Tableau Kollegen mit ☆ – dann siehst du hier, wer da ist.</span></div>`; return; }
        const age = data ? Date.now() - data.ts : 0;
        let tsx = {}; try { tsx = JSON.parse(localStorage.getItem(TST_KEY) || '{}') || {}; } catch (e) { }
        const tsMax = Math.max(0, ...favs.map(f => (tsx[f.k] || {}).ts || 0));
        const busy = tstBusy || teamBusy || tLiveBusy() || Date.now() - teamFlash < 700;
        const ss = t => { const x = new Date(t); return clock(t) + ':' + pad(x.getSeconds()); };
        const stTxt = busy ? '<b class="ld">Aktualisiere …</b>' : (Date.now() - teamFlash < 4000 ? '<b class="ok">✓ aktuell</b> · ' : '') + (tsMax && Date.now() - tsMax < 60 * 60e3 ? '<i class="lv"></i>Live ' + ss(tsMax) : 'Stempel-Status: noch keiner');
        const foot = `<span class="sp"></span><span class="f">${stTxt} · ${data ? 'Stand ' + clock(data.ts) + (age > 864e5 ? ' (' + pad(new Date(data.ts).getDate()) + '.' + pad(new Date(data.ts).getMonth() + 1) + '.)' : '') : 'noch keine Daten'} · Abwesenheitsübersicht<button type="button" data-tr="1" class="${busy ? 'spin' : ''}" title="Jetzt aktualisieren">${ico('refresh', 13)}</button></span>`;
        const day = data && data.days[dk];
        if (!day) { box.innerHTML = `<div class="tm">${head}<span class="h">${teamBusy ? 'Wird geladen …' : 'Für ' + lab.toLowerCase() + ' noch keine Daten.'}</span>${foot}</div>`; return; }
        const av = [], ab = [];
        let tst = {}; try { tst = JSON.parse(localStorage.getItem(TST_KEY) || '{}') || {}; } catch (e) { }
        const dot = k => {            // grün = eingestempelt, rot = nicht eingestempelt (aus dem Tableau, nur heute)
            if (teamDay) return ''; const t = tst[k]; if (!t || Date.now() - t.ts > 60 * 60e3) return '';
            const x = (t.st + ' ' + t.src).toLowerCase(), p = /nicht\s*anwesend|abwesend|ausgestempelt|gegangen|offline/.test(x) ? 0 : /anwesend|eingestempelt|online/.test(x) ? 1 : 0;
            return `<i class="dot ${p ? 'in' : 'out'}" title="${p ? 'eingestempelt' : 'nicht eingestempelt'} · Stand ${clock(t.ts)}${t.st && !/^(an|ab)wesend$/i.test(t.st) ? ' · ' + esc(t.st) : ''}"></i>`;
        };
        favs.forEach(f => {
            if (f.k === myKey) return;
            const e = day[f.k], n = dot(f.k) + esc((data.names[f.k] || f.n).replace(/\s+/g, ' '));
            if (!e) return;
            if (e.st === 'abs') ab.push(`<span class="c abs" title="abwesend${e.l ? ' (' + esc(e.l) + ')' : ''}">${n}${e.l ? `<em>${esc(e.l)}</em>` : ''}</span>`);
            else if (e.st === 'rem') av.push(`<span class="c rem" title="Remote / Homeoffice">${n}<em>HO</em></span>`);
            else if (e.st === 'da') av.push(`<span class="c" title="kein Eintrag – im Büro">${n}<em>Büro</em></span>`);
        });
        const missing = favs.filter(f => f.k !== myKey && !day[f.k]).length;
        box.innerHTML = `<div class="tm">${head}
            <span class="g"><small>Verfügbar</small>${av.join('') || '<span class="h">niemand</span>'}</span>
            <span class="g"><small>Abwesend</small>${ab.join('') || '<span class="h">niemand</span>'}</span>
            ${missing ? `<span class="h" title="Nicht in der aktuellen Abwesenheitsübersicht (Filter/Firma)">+${missing} ohne Daten</span>` : ''}${foot}</div>`;
    }
    /* Live-Stempelstatus: Tableau bleibt unsichtbar offen und wird alle 20 s von LHR selbst neu geladen (nur Daten, keine ganze Seite) */
    let tLive = null, teamFlash = 0;
    const tLiveBusy = () => !!(tLive && tLive.busy);
    function tableauLive(onUpdate) {
        if (tLive) return tLive;
        const a = document.getElementById('zm_tableau');
        const fr = hiddenFrame('zp-tlive', a ? a.getAttribute('href') : '/Self/Tableau?modulId=0');
        tLive = { fr, busy: true, ready: false, now: null };
        const d = () => fr.contentDocument, w = () => fr.contentWindow;
        const cells = () => { try { return [...d().querySelectorAll('#tableautab2 td, #tableautab td')].filter(td => cellName(td).length > 2); } catch (e) { return []; } };
        const save = () => {
            const st = {}, favs = new Set(favList().map(f => f.k));
            cells().forEach(td => { const k = nameKey(cellName(td)); if (favs.has(k)) st[k] = tstOf(td); });
            if (!Object.keys(st).length) return false;
            let old = {}; try { old = JSON.parse(localStorage.getItem(TST_KEY) || '{}') || {}; } catch (e) { }
            try { localStorage.setItem(TST_KEY, JSON.stringify(Object.assign(old, st))); } catch (e) { }
            return true;
        };
        const sig = () => cells().map(td => cellName(td) + ((td.querySelector('img') || {}).src || '')).join('|');
        const pull = async () => {             // LHR lädt die Liste mit den aktuellen Filtern neu
            if (!tLive || tLive.busy) { if (onUpdate) onUpdate(); return; } tLive.busy = true; if (onUpdate) onUpdate();
            try {
                const s0 = sig(), sel = d().getElementById('tableau_dropdown_status');
                if (typeof w().changeStatus === 'function') w().changeStatus(); else if (sel) sel.dispatchEvent(new Event('change', { bubbles: true }));
                await zwait(() => cells().length && sig() !== s0, 4000); await zwait(() => cells().length, 8000); await zsleep(300);
                save();
            } catch (e) { }
            tLive.busy = false; if (onUpdate) onUpdate();
        };
        tLive.now = pull;
        (async () => {
            try {
                if (!await zwait(() => d() && cells().length, 25000)) throw 'leer';
                const sSel = d().getElementById('tableau_dropdown_status'), pSel = d().getElementById('per_page_count'), aSel = d().getElementById('tableau_dropdown_abt');
                let ch = false;
                if (S.myTabStatus == null && sSel) { S.myTabStatus = sSel.value; ch = true; }
                if (S.myTabPP == null && pSel) { S.myTabPP = pSel.value; ch = true; }
                if (ch) saveS();
                const s1 = sig();
                if (sSel && sSel.value !== 'alle' && setSel(w(), sSel, 'alle', 'changeStatus')) { await zwait(() => sig() !== s1 && cells().length, 8000); await zsleep(600); }
                const me = nameKey(userInfo().name), have = () => { const k = new Set(cells().map(td => nameKey(cellName(td)))); return favList().every(f => f.k === me || k.has(f.k)); };
                if (!have()) {
                    const s2 = sig(); if (pSel) setSel(w(), pSel, '1000', 'onChangePerPage'); await zsleep(1200);
                    if (aSel) setSel(w(), aSel, '0', 'changeAbteilung'); await zwait(() => sig() !== s2 && cells().length, 15000); await zsleep(1000);
                }
                save();
            } catch (e) { }
            tLive.ready = true; tLive.busy = false; if (onUpdate) onUpdate();
            setInterval(() => { if (!document.hidden) pull(); }, 20000);
        })();
        return tLive;
    }
    function buildTeam() {
        const dash = document.getElementById('zp-host'); if (!dash || document.getElementById('zp-team-host')) return;
        const host = el('div'); host.id = 'zp-team-host'; dash.after(host);
        const root = mkRoot(host); const st = document.createElement('style'); st.textContent = TEAM_CSS; root.appendChild(st);
        const box = el('div', 'zp-font'); root.appendChild(box);
        box.addEventListener('click', e => {
            const t = e.target.closest('[data-td]'); if (t) { teamDay = +t.dataset.td; renderTeam(box); return; }
            if (e.target.closest('[data-tr]')) { teamFlash = Date.now(); teamRefresh(() => { teamFlash = Date.now(); renderTeam(box); }); if (tLive && tLive.now) tLive.now(); else tableauLive(() => renderTeam(box)); renderTeam(box); }
        });
        renderTeam(box);
        const data = teamStore();
        if (favList().length && (!data || Date.now() - data.ts > 2 * 3600e3)) setTimeout(() => teamRefresh(() => renderTeam(box)), 5000);
        setInterval(() => { if (!document.hidden) renderTeam(box); }, 5 * 60e3);
        // Ein-/Ausgestempelt-Punkte live (alle 20 s)
        setTimeout(() => { if (favList().length) tableauLive(() => renderTeam(box)); }, 1500);
        setInterval(() => { if (!document.hidden) renderTeam(box); }, 15e3);
    }
    function watchDialog() {
        let pending = false;
        new MutationObserver(() => {
            if (pending || !document.querySelector('td.mb_td')) return;
            if (document.getElementById('zp-cp') && (!document.getElementById('mehrfacherfassungBody') || document.getElementById('zp-mfe-prev'))) return;
            pending = true;
            setTimeout(() => { pending = false; if (!document.getElementById('zp-cp')) safe('Mehrfacherfassung', buildCopyBar); safe('Mehrfacherfassung', mfeAttach); }, 300);
        }).observe(document.body, { childList: true, subtree: true });
    }

    /* ════════════════════ BADGE / SHORTCUTS / START ════════════════════ */
    function buildFab(state) {
        const root = overlay();
        let b = root.getElementById('zp-fab');
        if (!b) {
            b = el('button', 'zp-font', LOGO + '<span>LHR Zeit +</span>');
            b.id = 'zp-fab';
            b.type = 'button';
            b.addEventListener('click', () => {
                if ($('zp')) openModal();
                else if (b.dataset.state === 'month') location.href = location.pathname + '?modulId=0&periode=';
                else cycleTheme();
            });
            root.appendChild(b);
        }
        b.dataset.state = state;
        b.title = {
            dash: 'Zeit+ aktiv – klicken für Einstellungen',
            month: 'Zeit+ aktiv – Live-Werte gibt es nur im aktuellen Monat. Klicken = zum aktuellen Monat',
            other: 'Zeit+ aktiv – klicken wechselt das Theme'
        }[state] || 'LHR Zeit +';
        b.style.display = state === 'dash' ? 'none' : 'flex';
    }

    function shortcuts() {
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') { closePops(); const m = $('zp-modal'); if (m) m.classList.add('hidden'); const p = $('zp-tpop'); if (p) p.classList.add('hidden'); if (editing) setEdit(false); return; }
            if (!e.altKey || e.ctrlKey || e.metaKey) return;
            const tgt = (typeof e.composedPath === 'function' && e.composedPath()[0]) || e.target;
            if (tgt && /INPUT|TEXTAREA|SELECT/.test(tgt.tagName || '')) return;
            const k = (e.key || '').toLowerCase();
            const act = { m: () => $('zp') && toggleView(), z: () => $('zp') && toggleFold(), t: cycleTheme, e: () => $('zp') && setEdit(!editing), s: () => openModal(), p: () => { const p = $('zp-tpop'); if (p) p.classList.toggle('hidden'); } }[k];
            if (act && ($('zp') || k === 't' || k === 's')) { e.preventDefault(); act(); }
        });
    }

    function killOldScript() {
        const r = document.documentElement;
        const had = r.classList.contains('lhr-dark') || document.getElementById('lhr-global-style') || document.getElementById('tool-workblock');
        r.classList.remove('lhr-dark');
        ['lhr-global-style', 'time-tool-style', 'tool-workblock', 'lhr-global-toggle'].forEach(id => { const e = document.getElementById(id); if (e) e.remove(); });
        if (had && !sessionStorage.getItem('zplus_oldwarn')) {
            sessionStorage.setItem('zplus_oldwarn', '1');
            setTimeout(() => toast('Altes Script noch aktiv', 'LHR_Simplify läuft noch parallel – bitte in Tampermonkey deaktivieren, sonst stört es die Darstellung.', { bad: true, ms: 15000 }), 1500);
        }
    }

    function watchTints() {
        let t = null;
        new MutationObserver(ms => {
            if (t) return;
            if (!ms.some(m => m.addedNodes && m.addedNodes.length)) return;
            t = setTimeout(() => { t = null; safe('Farben', () => { tintRows(); if (tbody()) markToday(); fixColors(); if (K) renderKal(); }); }, 350);
        }).observe(document.body, { childList: true, subtree: true });
    }

    /* ───── Buchen-Seite: moderne Karte (Original-Formular bleibt, wird nur umgestellt) ───── */
    let BU = null;
    const BU_CSS = `
html.zp-bu section.bearbeitung{max-width:1080px !important;margin:0 auto !important;padding:0 !important;background:none !important;border:0 !important;box-shadow:none !important;text-align:left !important}
html.zp-bu .zpb-x,html.zp-bu section.bearbeitung > br,html.zp-bu #live_time_clock,html.zp-bu section.stundenuebersicht{display:none !important}
#zp-bu{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:18px;align-items:start;margin:8px 0 28px;font-family:'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif;color:var(--zp-text)}
@media (max-width:880px){#zp-bu{grid-template-columns:1fr}}
#zp-bu .zpb-card{background:var(--zp-surf);border:1px solid var(--zp-line);border-radius:20px;box-shadow:var(--zp-shadow);padding:24px 26px;min-width:0}
#zp-bu .zpb-hero{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;flex-wrap:wrap;padding-bottom:20px;margin-bottom:20px;border-bottom:1px solid var(--zp-line)}
#zp-bu .zpb-time{font:700 56px/1 'Segoe UI Variable Display','Segoe UI',system-ui,sans-serif;font-variant-numeric:tabular-nums;letter-spacing:-.02em;color:var(--zp-text)}
#zp-bu .zpb-time small{font-size:24px;font-weight:600;color:var(--zp-muted);margin-left:2px}
#zp-bu .zpb-date{margin-top:8px;font-size:14px;color:var(--zp-muted)}
#zp-bu .zpb-st{display:inline-flex;align-items:center;gap:8px;padding:7px 13px;border-radius:99px;font-size:13px;font-weight:600;background:var(--zp-surf2);border:1px solid var(--zp-line);color:var(--zp-muted)}
#zp-bu .zpb-st i{width:9px;height:9px;border-radius:50%;background:var(--zp-muted)}
#zp-bu .zpb-st.on{color:var(--zp-ok);border-color:color-mix(in srgb,var(--zp-ok) 40%,transparent);background:color-mix(in srgb,var(--zp-ok) 10%,transparent)}
#zp-bu .zpb-st.on i{background:var(--zp-ok);box-shadow:0 0 0 4px color-mix(in srgb,var(--zp-ok) 22%,transparent)}
#zp-bu .zpb-lbl,#zp-bu label[for=code],#zp-bu label[for=notiz],#zp-bu label[for=RKABR_ZWECK],#zp-bu label[for=RKABR_REISETYP]{display:block !important;font-size:12px !important;font-weight:700 !important;letter-spacing:.06em;text-transform:uppercase;color:var(--zp-muted) !important;margin:0 0 9px !important}
#zp-bu .table_center[style*="none"],#zp-bu [id^=RKABR_][style*="none"]{display:none !important}
#zp-bu .table_center:not([style*="none"]){display:block !important;}
#zp-bu .table_center{text-align:left !important;margin:0 0 18px !important;width:auto !important;max-width:none !important}
#zp-bu .table_center:empty{display:none !important}
#zp-bu .table_center > br,#zp-bu #abwesenheitenContainer > br,#zp-bu #abwesenheitenContainer > label{display:none !important}
#zp-bu .zpb-chips{display:flex;flex-wrap:wrap;gap:8px}
html.zp-bu #zp-bu button.zpb-chip{display:inline-flex !important;align-items:center;gap:8px;margin:0 !important;width:auto !important;min-width:0 !important;height:auto !important;min-height:0 !important;padding:10px 15px !important;border-radius:13px !important;border:1px solid var(--zp-line) !important;background:var(--zp-surf2) !important;background-image:none !important;color:var(--zp-text) !important;font:600 14px/1 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif !important;white-space:nowrap;text-shadow:none !important;box-shadow:none !important;cursor:pointer;transition:background .15s,border-color .15s,transform .1s}
html.zp-bu #zp-bu button.zpb-chip:hover{border-color:var(--zp-accent) !important}
#zp-bu .zpb-chip:active{transform:scale(.97)}
html.zp-bu #zp-bu button.zpb-chip.on{background:var(--zp-accent) !important;border-color:var(--zp-accent) !important;color:var(--zp-onacc,#fff) !important}
html.zp-bu #zp-bu #bb_dropdown_abwesenheiten.zpb-sel{position:absolute !important;width:1px !important;height:1px !important;opacity:0 !important;pointer-events:none !important}
html.zp-bu #zp-bu input[type=text]{width:100% !important;max-width:none !important;min-height:44px !important;border-radius:12px !important;padding:8px 13px !important;font-size:15px !important;box-sizing:border-box}
html.zp-bu #zp-bu input#notiz.hidden,html.zp-bu #zp-bu label.hidden{display:none !important}
#zp-bu .table_around{display:flex;gap:10px;flex-wrap:wrap}
#zp-bu .table_around > .inlineblock{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:13px;background:var(--zp-surf2);border:1px solid var(--zp-line);cursor:pointer}
#zp-bu .table_around > [style*="none"]{display:none !important}
#zp-bu .table_around label{font-weight:600;font-size:14px;color:var(--zp-text) !important;cursor:pointer;margin:0 !important}
#zp-bu .table_around small{display:block;font-size:12px;font-weight:400;color:var(--zp-muted);margin-top:2px}
html.zp-bu #zp-bu input[type=checkbox]{appearance:none;-webkit-appearance:none;flex:none;width:42px;height:24px;margin:0 !important;border-radius:99px;background:var(--zp-line) !important;border:0 !important;position:relative;cursor:pointer;transition:background .18s}
html.zp-bu #zp-bu input[type=checkbox]::before{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.3);transition:transform .18s}
html.zp-bu #zp-bu input[type=checkbox]:checked{background:var(--zp-accent) !important}
html.zp-bu #zp-bu input[type=checkbox]:checked::before{transform:translateX(18px)}
#zp-bu .zpb-code{display:flex;align-items:stretch;gap:12px}
html.zp-bu #zp-bu #b_code,html.zp-bu #zp-bu #b_code.table_center{margin:0 !important;flex:none !important;display:flex !important;align-items:center;justify-content:center;width:auto !important;min-width:130px;padding:6px 14px !important;border-radius:13px;background:#fff !important;border:1px solid var(--zp-line);box-sizing:border-box;overflow:hidden}
html.zp-bu #zp-bu #b_code img{display:block !important;width:auto !important;height:auto !important;max-width:none !important;max-height:50px !important;margin:0 !important;position:static !important}
html.zp-bu #zp-bu input#code{flex:1;min-height:58px !important;font:700 24px/1 ui-monospace,'Cascadia Mono',Consolas,monospace !important;letter-spacing:.32em;text-align:center}
#zp-bu .zpb-hint{font-size:12px;color:var(--zp-muted);margin-top:8px}
#zp-bu .zpb-hint kbd{font:600 11px ui-monospace,Consolas,monospace;padding:1px 6px;border-radius:5px;border:1px solid var(--zp-line);background:var(--zp-surf2)}
html.zp-bu #zp-bu #buttons{display:grid !important;grid-template-columns:minmax(0,1.4fr) minmax(0,1.1fr);gap:10px;margin:4px 0 0 !important;padding:0 !important}
html.zp-bu #zp-bu #buttons button{display:inline-flex !important;align-items:center;justify-content:center;gap:9px;height:56px;margin:0 !important;padding:0 18px !important;border-radius:15px !important;white-space:nowrap;font:650 16px/1 'Segoe UI Variable Text','Segoe UI',system-ui,sans-serif !important;cursor:pointer;background-image:none !important;transition:filter .15s,transform .1s,box-shadow .15s;width:auto !important}
html.zp-bu #zp-bu #bu_submit{background:var(--zp-accent) !important;color:var(--zp-onacc,#fff) !important;border:1px solid var(--zp-accent) !important;box-shadow:0 8px 22px color-mix(in srgb,var(--zp-accent) 35%,transparent)}
html.zp-bu #zp-bu #bu_submit_abmelden{background:var(--zp-surf2) !important;color:var(--zp-text) !important;border:1px solid var(--zp-line) !important}
html.zp-bu #zp-bu #buttons button:hover{filter:brightness(1.08)}
html.zp-bu #zp-bu #buttons button:active{transform:scale(.98)}
@media (max-width:520px){html.zp-bu #zp-bu #buttons{grid-template-columns:1fr}#zp-bu .zpb-code{flex-direction:column}}
#zp-bu .zpb-sh{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:16px}
#zp-bu .zpb-sh h3{margin:0;font-size:17px;font-weight:700;color:var(--zp-text)}
#zp-bu .zpb-sh span{font-size:13px;color:var(--zp-muted)}
#zp-bu .zpb-tiles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
#zp-bu .zpb-t.live{border-color:color-mix(in srgb,var(--zp-accent) 35%,var(--zp-line))}
#zp-bu .zpb-stand{display:inline-flex;align-items:center;gap:6px}
#zp-bu .zpb-stand em{font-style:normal;opacity:.6}
#zp-bu .zpb-ld{width:7px;height:7px;border-radius:50%;background:var(--zp-ok);box-shadow:0 0 0 0 color-mix(in srgb,var(--zp-ok) 60%,transparent);animation:zpbPulse 1.8s infinite}
@keyframes zpbPulse{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--zp-ok) 55%,transparent)}70%{box-shadow:0 0 0 7px transparent}100%{box-shadow:0 0 0 0 transparent}}
#zp-bu .zpb-t{padding:13px 15px;border-radius:14px;background:var(--zp-surf2);border:1px solid var(--zp-line);min-width:0}
#zp-bu .zpb-t span{display:block;font-size:12px;font-weight:600;color:var(--zp-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#zp-bu .zpb-t b{display:block;margin-top:5px;font-size:23px;font-weight:700;font-variant-numeric:tabular-nums;color:var(--zp-text)}
#zp-bu .zpb-t.big{grid-column:1/-1;background:color-mix(in srgb,var(--zp-accent) 11%,var(--zp-surf2));border-color:color-mix(in srgb,var(--zp-accent) 35%,transparent)}
#zp-bu .zpb-t.big b{font-size:30px}
#zp-bu .zpb-t b.pos{color:var(--zp-ok)}
#zp-bu .zpb-t b.neg{color:var(--zp-bad)}
html.zp-bu #zp-bu .zpb-msg{display:flex !important;align-items:center;gap:12px;margin:0 0 18px !important;padding:12px 16px !important;border-radius:14px;background:color-mix(in srgb,var(--zp-ok) 12%,var(--zp-surf2)) !important;border:1px solid color-mix(in srgb,var(--zp-ok) 42%,transparent) !important;color:var(--zp-text) !important;text-align:left !important;width:auto !important}
html.zp-bu #zp-bu .zpb-msg.bad{background:color-mix(in srgb,var(--zp-bad) 12%,var(--zp-surf2)) !important;border-color:color-mix(in srgb,var(--zp-bad) 45%,transparent) !important}
html.zp-bu #zp-bu .zpb-msg > .zpb-mi{flex:none;display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:var(--zp-ok);color:var(--zp-onacc,#fff)}
html.zp-bu #zp-bu .zpb-msg.bad > .zpb-mi{background:var(--zp-bad);color:var(--zp-onbad,#fff)}
html.zp-bu #zp-bu .zpb-msg > .zpb-mt{display:block;flex:1;min-width:0;font-size:13px;color:var(--zp-muted)}
html.zp-bu #zp-bu .zpb-msg > .zpb-mt b{display:block;font-size:15px;color:var(--zp-text);margin-bottom:2px}
html.zp-bu #zp-bu .zpb-msg .zpb-mo,html.zp-bu #zp-bu .zpb-msg .zpb-mo *{display:inline !important;background:none !important;border:0 !important;padding:0 !important;margin:0 !important;box-shadow:none !important;color:inherit !important;font:inherit !important;width:auto !important;height:auto !important}
html.zp-bu #zp-bu .zpb-msg .zpb-mo img{display:none !important}
html.zp-bu #zp-bu .zpb-msg > button{margin-left:auto !important;flex:none;background:none !important;border:0 !important;color:var(--zp-muted) !important;cursor:pointer;padding:4px !important;display:grid;place-items:center}
#zp-bu .zpb-sh.st{margin-top:22px;padding-top:18px;border-top:1px solid var(--zp-line)}
#zp-bu .zpb-bks{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}
#zp-bu .zpb-bk{display:inline-flex;align-items:center;gap:5px;padding:5px 10px;border-radius:9px;background:var(--zp-surf2);border:1px solid var(--zp-line);font:600 13px/1 inherit;font-variant-numeric:tabular-nums}
#zp-bu .zpb-bk em{font-style:normal;color:var(--zp-muted)}
#zp-bu .zpb-bk.live{border-color:color-mix(in srgb,var(--zp-ok) 50%,transparent);background:color-mix(in srgb,var(--zp-ok) 12%,var(--zp-surf2))}
#zp-bu .zpb-bk.live b{color:var(--zp-ok)}
#zp-bu .zpb-next{padding:12px 14px;border-radius:14px;background:color-mix(in srgb,var(--zp-accent) 9%,var(--zp-surf2));border:1px solid color-mix(in srgb,var(--zp-accent) 30%,transparent)}
#zp-bu .zpb-nt{display:flex;align-items:center;gap:7px;font-size:13px;color:var(--zp-muted);margin-bottom:6px}
#zp-bu .zpb-nt b{color:var(--zp-text)}
#zp-bu .zpb-kv{display:flex;justify-content:space-between;gap:10px;padding:4px 0;font-size:14px}
#zp-bu .zpb-kv span{color:var(--zp-muted)}
#zp-bu .zpb-kv b{font-weight:700}
#zp-bu .zpb-kv b.pos{color:var(--zp-ok)}
#zp-bu .zpb-kv b.neg{color:var(--zp-bad)}
#zp-bu .zpb-empty{font-size:13px;color:var(--zp-muted)}
`;
    /* Buchen: heutige Buchungen + was die nächste Buchung bewirkt (Zeitdatenliste im Hintergrund lesen) */
    async function buToday(box) {
        if (!box) return;
        let doc = null;
        try {
            const nav = document.getElementById('zm_zeitdatenliste');
            const r = await fetch(nav ? nav.getAttribute('href') : '/Self/zeiterfassung/zdliste?modulId=0&periode=', { credentials: 'same-origin' });
            if (r.ok) doc = new DOMParser().parseFromString(await r.text(), 'text/html');
        } catch (e) { }
        const tb = doc && doc.getElementById('zdlBody');
        if (!tb) { box.innerHTML = '<div class="zpb-sh"><h3>Heute</h3><span>Zeitdatenliste nicht erreichbar</span></div>'; return; }
        let d = null;
        TB_OVERRIDE = tb; try { d = readDay(); } finally { TB_OVERRIDE = null; }
        if (!d) { box.innerHTML = '<div class="zpb-sh"><h3>Heute</h3><span>kein Arbeitstag</span></div>'; return; }
        const draw = () => {
            let c; TB_OVERRIDE = tb; try { c = calc(d, Date.now()); } finally { TB_OVERRIDE = null; }
            const now = Date.now(), kz = c.br ? null : kernEnd();
            let lv = null; if (BU_LIVE) { try { lv = BU_LIVE(c); } catch (e) { } }
            const chips = c.segs.map((g, i) => `<span class="zpb-bk${g.e == null && i === c.segs.length - 1 && c.open ? ' live' : ''}">${clock(g.s)}<em>–</em>${g.e != null ? clock(g.e) : (c.open && i === c.segs.length - 1 ? '<b>läuft</b>' : '?')}</span>`).join('');
            const sc = v => v > M ? 'pos' : v < -M ? 'neg' : '';
            const row = (k, v, cls) => `<div class="zpb-kv"><span>${k}</span><b class="num ${cls || ''}">${v}</b></div>`;
            let what;
            if (c.open) {
                const kzTxt = !kz ? '' : now >= kz ? '✓ erfüllt' : 'erst ab ' + clock(kz);
                what = `<div class="zpb-next"><div class="zpb-nt">${ico('logout', 14)} Wenn du jetzt <b>gehst</b></div>
                    ${row('Heute netto', dur(c.eff))}${row('Heute +/−', dur(c.tg, true), sc(c.tg))}${row('Saldo danach', dur(c.saldo, true), sc(c.saldo))}${lv && lv.week != null ? row('Wochenstunden', dur(lv.week)) : ''}
                    ${kz ? row('Kernzeit', kzTxt, now >= kz ? 'pos' : 'neg') : ''}
                    ${!c.salF.done ? row('Für ±0 bleiben bis', clock(c.salF.at)) : ''}${!c.sollF.done ? row('Soll erfüllt um', clock(c.sollF.at)) : ''}
                    ${c.maxF.done ? row('10 h-Grenze', 'überschritten', 'neg') : ''}</div>`;
            } else {
                what = `<div class="zpb-next"><div class="zpb-nt">${ico('pointer', 14)} Wenn du jetzt <b>kommst</b></div>
                    ${c.sollF.done ? row('Soll', '✓ schon erfüllt', 'pos') : row('Soll erfüllt um', clock(c.sollF.at))}
                    ${c.salF.done ? row('Saldo', dur(c.saldo, true), sc(c.saldo)) : row('Saldo ±0 um', clock(c.salF.at))}
                    ${row('10 h-Grenze', clock(c.maxF.at))}${c.br ? `<div class="zpb-hint">Bereitschaft: gezählt ab ${esc(S.brStart)}, ohne Pflichtpause.</div>` : ''}</div>`;
            }
            box.innerHTML = `<div class="zpb-sh"><h3>Heute</h3><span>${c.open ? 'eingestempelt seit ' + clock(c.open.s) : c.segs.length ? 'ausgestempelt' : 'noch nicht gestempelt'}</span></div>
                ${chips ? `<div class="zpb-bks">${chips}</div>` : ''}${what}`;
        };
        draw(); setInterval(() => { if (!document.hidden) safe('Buchen', draw); }, 15000);
    }
    // LHR-Meldung nach dem Buchen (z.B. „Buchung wird verzögert verarbeitet“): Text ohne Eingabefelder
    const isBuMsg = k => {
        if (!k || k.nodeType !== 1 || /^(SCRIPT|STYLE|LINK|BR|FORM)$/.test(k.tagName) || k.id === 'uhrzeit' || k.id === 'live_time_clock' || (k.id || '').startsWith('zp-')) return false;
        if (k.classList.contains('hidden') || /display:\s*none/.test(k.getAttribute('style') || '') || k.matches('section.stundenuebersicht') || k.querySelector('.rkc_brd,.table_around,form,table,section')) return false;
        if (k.querySelector('input:not([type=hidden]),select,textarea,button')) return false;
        return (k.textContent || '').replace(/\s+/g, ' ').trim().length > 2;
    };
    function buMsg(k, hero) {
        const txt = (k.textContent || '').replace(/\s+/g, ' ').trim();
        const bad = /fehler|ungültig|ungueltig|falsch|nicht (möglich|erlaubt|korrekt)|abgelehnt|error/i.test(txt + ' ' + k.className + ' ' + (k.innerHTML.match(/class="[^"]*"/g) || []).join(' ')) && !/success/i.test(k.className);
        const late = /verzögert|verzoegert/i.test(txt);
        const title = bad ? 'Buchung nicht durchgeführt' : late ? 'Buchung angenommen' : 'Hinweis';
        const sub = late ? 'LHR verarbeitet sie im Hintergrund, in der Zeitdatenliste taucht sie gleich auf.' : '';
        k.classList.add('zpb-msg'); if (bad) k.classList.add('bad');
        const orig = el('span', 'zpb-mo'); while (k.firstChild) orig.appendChild(k.firstChild);
        k.innerHTML = `<span class="zpb-mi">${ico(bad ? 'alert' : 'check', 18)}</span><span class="zpb-mt"><b>${title}</b></span><button type="button" title="Ausblenden">${ico('x', 16)}</button>`;
        const mt = k.querySelector('.zpb-mt'); mt.appendChild(orig); if (sub) mt.appendChild(document.createTextNode(' · ' + sub));
        k.querySelector('button').onclick = () => k.remove();
        hero.after(k);
    }
    function buildBuchen() {
        const sec = document.querySelector('section.bearbeitung'), form = document.getElementById('buReiseDummyForm') || (document.getElementById('bu_submit') || {}).form;
        if (!sec || !form || document.getElementById('zp-bu')) return false;
        const st = document.createElement('style'); st.id = 'zp-bu-css'; st.textContent = BU_CSS; (document.head || document.documentElement).appendChild(st);
        document.documentElement.classList.add('zp-bu');
        const wrap = el('div'); wrap.id = 'zp-bu'; BU = wrap;
        const main = el('div', 'zpb-card zpb-main'), side = el('aside', 'zpb-card zpb-side');
        wrap.append(main, side);
        // Uhr (Serverzeit aus #uhrzeit, damit sie zur LHR-Zeit passt)
        let off = 0;
        const su = (document.getElementById('uhrzeit') || {}).textContent || '', sm = su.match(/(\d{2})\.(\d{2})\.(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})/);
        if (sm) { const t = new Date(+sm[3], +sm[2] - 1, +sm[1], +sm[4], +sm[5], +sm[6]).getTime(), d = t - Date.now(); if (Math.abs(d) < 12 * 3600e3) off = d; }
        const u = userInfo();
        const hero = el('div', 'zpb-hero', `<div><div class="zpb-time"></div><div class="zpb-date"></div></div><div class="zpb-st ${u.present ? 'on' : ''}" title="${esc(u.status)}"><i></i>${u.present ? 'Anwesend' : 'Abwesend'}</div>`);
        main.appendChild(hero);
        const tick = () => { const n = new Date(Date.now() + off); hero.querySelector('.zpb-time').innerHTML = pad(n.getHours()) + ':' + pad(n.getMinutes()) + '<small>:' + pad(n.getSeconds()) + '</small>'; hero.querySelector('.zpb-date').textContent = n.toLocaleDateString('de-AT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); };
        tick(); setInterval(() => { if (!document.hidden) tick(); }, 1000);
        // Original-Elemente in die Karte holen (Reihenfolge bleibt, Zeitende kommt vor das Formular)
        const kids = [...sec.children];
        sec.insertBefore(wrap, sec.firstChild);
        let around = null; const msgs = [];
        kids.forEach(k => {
            if (k.id === 'uhrzeit' || k.id === 'live_time_clock' || k.tagName === 'BR' || k.matches('section.stundenuebersicht')) return;
            if (k.tagName === 'P' && k.classList.contains('hidden')) return;
            if (k.querySelector && k.querySelector('.table_around')) { around = k; return; }
            if (isBuMsg(k)) { msgs.push(k); return; }
            const has = (k.textContent || '').trim() || k.querySelector('input:not([type=hidden]),select,textarea,img,button,table');
            if (!has && k !== form) { k.classList.add('zpb-x'); return; }
            main.appendChild(k);
        });
        if (around) main.insertBefore(around, form.parentNode === main ? form : null);
        msgs.forEach(m => buMsg(m, hero));
        new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1 && n !== wrap && isBuMsg(n)) buMsg(n, hero); }))).observe(sec, { childList: true });
        // Zeitende: Erklärung sichtbar machen
        main.querySelectorAll('.table_around > .inlineblock').forEach(d => {
            const cb = d.querySelector('input[type=checkbox]'), lb = d.querySelector('label');
            if (!cb || !lb) return;
            if (cb.title && cb.title !== lb.textContent.trim() && !lb.querySelector('small')) lb.insertAdjacentHTML('beforeend', `<small>${esc(cb.title.replace(/^kann gesetzt werden, wenn /i, 'Wenn '))}</small>`);
            d.addEventListener('click', e => { if (e.target === d) cb.click(); });
        });
        // Buchungsart als Chips (setzt das Original-Dropdown + löst LHRs onchange aus)
        const sel = document.getElementById('bb_dropdown_abwesenheiten');
        if (sel && sel.options.length) {
            const box = sel.closest('#abwesenheitenContainer') || sel.parentNode;
            const lbl = el('div', 'zpb-lbl', 'Art der Buchung'), chips = el('div', 'zpb-chips');
            const icn = t => /normal/i.test(t) ? 'clock' : /dienstgang/i.test(t) ? 'door' : /fahrzeit/i.test(t) ? 'send' : /arzt/i.test(t) ? 'plus' : /seminar|kurs/i.test(t) ? 'file' : 'pointer';
            [...sel.options].forEach(o => { const b = el('button', 'zpb-chip', ico(icn(o.text), 15) + esc(o.text.trim())); b.type = 'button'; b.dataset.v = o.value; chips.appendChild(b); });
            const sync = () => chips.querySelectorAll('.zpb-chip').forEach(b => b.classList.toggle('on', b.dataset.v === sel.value));
            chips.addEventListener('click', e => { const b = e.target.closest('.zpb-chip'); if (!b || sel.value === b.dataset.v) return; sel.value = b.dataset.v; sel.dispatchEvent(new Event('change', { bubbles: true })); sync(); });
            sel.addEventListener('change', sync);
            sel.classList.add('zpb-sel'); sel.tabIndex = -1;
            box.insertBefore(chips, box.firstChild); box.insertBefore(lbl, chips); sync();
        }
        // Code-Feld: Bild + Eingabe nebeneinander, Cursor direkt drin
        const code = document.getElementById('code'), cimg = document.getElementById('b_code');
        if (code && cimg) {
            const row = el('div', 'zpb-code'); const cl = form.querySelector('label[for=code]');
            cimg.parentNode.insertBefore(row, cimg); row.append(cimg, code);
            if (cl) row.parentNode.insertBefore(cl, row);
            [...row.parentNode.children].forEach(c => { if (c.tagName === 'BR') c.classList.add('zpb-x'); });
            row.insertAdjacentHTML('afterend', '<div class="zpb-hint"><kbd>Enter</kbd> bucht sofort</div>');
            code.placeholder = 'Code'; code.setAttribute('autocapitalize', 'off'); code.spellcheck = false;
            setTimeout(() => { if (!document.activeElement || document.activeElement === document.body) code.focus({ preventScroll: true }); }, 60);
        }
        form.querySelectorAll(':scope > br').forEach(b => b.classList.add('zpb-x'));
        const b1 = document.getElementById('bu_submit'), b2 = document.getElementById('bu_submit_abmelden');
        if (b1) b1.innerHTML = ico('pointer', 19) + '<span>' + esc(b1.textContent.trim() || 'Buchen') + '</span>';
        if (b2) b2.innerHTML = ico('logout', 17) + '<span>' + esc(b2.textContent.trim().replace(/&amp;/g, '&') || 'Buchen & Abmelden') + '</span>';
        // Stundenübersicht als Kacheln
        const tab = sec.querySelector('section.stundenuebersicht table');
        const rows = tab ? [...tab.querySelectorAll('tr')].map(tr => ({ k: (tr.querySelector('th') || {}).textContent || '', t: (tr.querySelector('th') || { title: '' }).title || '', v: ((tr.querySelector('td') || {}).textContent || '').trim() })) : [];
        const stich = (rows.find(r => /stichtag/i.test(r.k)) || {}).v || '';
        const vals = rows.filter(r => !/stichtag/i.test(r.k) && r.v);
        const g = k => { const r = rows.find(x => x.k.trim() === k); return r ? parseDur(r.v) : null; };
        const parts = [['Saldo', 1], ['FZSA', 1], ['FZSP', 1], ['ZA', 1], ['50%p', 1.5], ['50%f', 1.5], ['100%p', 2], ['100%f', 2]].map(([k, f]) => { const v = g(k); return v == null ? null : v * f; }).filter(v => v != null);
        const sc = (r, v) => /saldo|\+\/-|tg/i.test(r) ? (v > 0 ? 'pos' : v < 0 ? 'neg' : '') : '';
        let tiles = '';
        const kind = r => { const l = (r.t + ' ' + r.k).toLowerCase(); return /tages/.test(l) && /ist/.test(l) && !/soll/.test(l) ? 'day' : /ist.?-?.?soll|\+\/-\s*(tg|ist)/.test(l) ? 'tg' : /saldo/.test(l) && !/gesamt/.test(l) ? 'saldo' : /woche/.test(l) && /ist/.test(l) ? 'week' : /monat/.test(l) && /ist/.test(l) ? 'month' : ''; };
        if (parts.length > 1) { const tot = parts.reduce((a, b) => a + b, 0); tiles += `<div class="zpb-t big" data-live="tot" data-base="${tot}" title="Saldo + Fahrzeit aktiv/passiv + ZA + Üst 50 % ×1,5 + Üst 100 % ×2"><span>Gesamt · Saldo + FZ + ZA + Üst</span><b class="num ${tot > 0 ? 'pos' : tot < 0 ? 'neg' : ''}">${dur(tot, true)}</b></div>`; }
        tiles += vals.map(r => { const v = parseDur(r.v), kd = v != null ? kind(r) : ''; return `<div class="zpb-t" title="${esc(r.t)}"${kd ? ` data-live="${kd}" data-base="${v}"` : ''}><span>${esc(r.t || r.k)}</span><b class="num ${v != null ? sc(r.k, v) : ''}">${esc(r.v.replace(/^-/, '−'))}</b></div>`; }).join('');
        side.innerHTML = `<div id="zpb-today"><div class="zpb-sh"><h3>Heute</h3><span>wird geladen …</span></div></div>` + (tab ? `<div class="zpb-sh st"><h3>Stand</h3>${stich ? `<span>${esc(stich)}</span>` : ''}</div>` + (tiles ? `<div class="zpb-tiles">${tiles}</div>` : '<div class="zpb-empty">Keine Stundenwerte vorhanden.</div>') : '');
        // Live: so stünde es, wenn du JETZT ausstempelst (LHR-Werte gelten nur bis zum Stichtag)
        const sd = dParse(stich), today = new Date(); today.setHours(12, 0, 0, 0);
        const baseSaldo = g('Saldo');
        BU_LIVE = c => {
            if (!c) return;
            const before = !sd || sd < today - 36e5;                       // Stichtag liegt vor heute → heute noch nicht drin
            const sameWeek = sd && isoWeek(sd) === isoWeek(today) && Math.abs(sd - today) < 7 * 864e5, sameMonth = sd && sd.getMonth() === today.getMonth() && sd.getFullYear() === today.getFullYear();
            const base = k => { const t = side.querySelector(`.zpb-t[data-live="${k}"]`); return t ? +t.dataset.base : null; };
            const wB = base('week');
            return { week: wB != null ? (before ? (sameWeek ? wB : 0) + c.eff : wB) : null };
        };
        safe('Buchen', () => buToday(side.querySelector('#zpb-today')));
        return true;
    }

    function init() {
        PAGE = document.getElementById('zdlBody') ? 'zdl' : document.getElementById('kalendertab') ? 'kal' : 'other';
        document.documentElement.classList.toggle('zp-zdl', PAGE === 'zdl');
        document.documentElement.classList.add('zp-p-' + PAGE);
        if (/urlaubsplaner/i.test(location.pathname)) document.documentElement.classList.add('zp-planer');
        if (/urlaubsplaner/i.test(location.pathname)) setTimeout(() => safe('Planer', planerNav), 300);
        { const upd = () => { const h = document.getElementById('zp-shell-host'); document.documentElement.style.setProperty('--zp-sh', (h ? Math.round(h.getBoundingClientRect().height) : 0) + 'px'); }; setTimeout(upd, 500); setInterval(upd, 3000); window.addEventListener('resize', upd); }
        if (IS_ABW) document.documentElement.classList.add('zp-abwp');
        { const lpt = document.getElementById('le_periode_text'); if (lpt) { let t = null; new MutationObserver(() => { clearTimeout(t); t = setTimeout(() => safe('App-Leiste', () => { readShellSource(); renderShell(); }), 250); }).observe(lpt.closest('#tabdivup') || lpt, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class'] }); } }
        try { document.title = APP_TITLE; } catch (e) { }
        killOldScript();
        injectPageCss();
        applyTheme();
        if (mq && mq.addEventListener) mq.addEventListener('change', applyTheme);
        safe('Tabelle', () => { tintRows(); markToday(); hideEmptyCols(); });
        const hasShell = !!safe('App-Leiste', buildShell);
        if (hasShell) { applyTheme(); setInterval(() => { if (!document.hidden) safe('App-Leiste', () => { readShellSource(); if (!$('zs-pop') || !$('zs-pop').innerHTML) renderShell(); }); }, 6000); setTimeout(() => safe('App-Leiste', () => { readShellSource(); renderShell(); }), 1800); }
        if (PAGE === 'kal' && safe('Kalender', buildKal)) applyTheme();
        if (PAGE === 'other' && document.getElementById('bu_submit')) safe('Buchen', buildBuchen);
        const hasTable = !!tbody(), hasToday = hasTable && !!readDay(), content = document.getElementById('content');
        document.documentElement.classList.toggle('zp-zdl', hasTable);
        if (hasToday && content) {
            safe('Dashboard', () => { buildDash(); render(); updClock(); });
            safe('Team', buildTeam);
            setInterval(() => { if (!document.hidden) safe('Uhr', updClock); }, 1000);
            setInterval(() => { if (!document.hidden) safe('Render', render); }, 20000);
            document.addEventListener('visibilitychange', () => {
                const hid = document.hidden;
                [document.getElementById('zp-host'), document.getElementById('zp-list-host'), document.getElementById('zp-overlay')].forEach(h => { if (h) h.classList.toggle('paused', hid); });
                if (hid) stopFx(); else { safe('Render', render); startFx(); }
            });
            shortcuts();
            buildFab($('zp') ? 'dash' : 'other');
        } else if (hasTable && content && tbody().querySelector('tr[data-periode]')) {      // anderer Monat: nur die Zeit+ Liste
            safe('Liste', () => {
                const lhost = el('div'); lhost.id = 'zp-list-host';
                content.parentNode.insertBefore(lhost, content);
                buildList(lhost); applyTheme(); renderListOnly();
            });
            buildFab(hasShell && S.shell ? 'dash' : 'month');
            shortcuts();
            document.addEventListener('visibilitychange', () => {
                const h = document.getElementById('zp-overlay'); if (h) h.classList.toggle('paused', document.hidden);
                if (document.hidden) stopFx(); else startFx();
            });
        } else if (hasShell && S.shell) {
            buildFab('dash');
            shortcuts();
            document.addEventListener('visibilitychange', () => {
                const h = document.getElementById('zp-overlay'); if (h) h.classList.toggle('paused', document.hidden);
                if (document.hidden) stopFx(); else startFx();
            });
        } else {
            buildFab(hasTable ? 'month' : 'other');
            document.addEventListener('visibilitychange', () => {
                const h = document.getElementById('zp-overlay'); if (h) h.classList.toggle('paused', document.hidden);
                if (document.hidden) stopFx(); else startFx();
            });
        }
        safe('Dialog', watchDialog);
        safe('Farben', watchTints);
        safe('Farben', watchColors);
        safe('Abstand', collapseGaps); setTimeout(() => safe('Abstand', collapseGaps), 1500); setInterval(() => { if (!document.hidden) safe('Abstand', collapseGaps); }, 3000);
        safe('Spalten', watchColMenus);
        setTimeout(() => safe('Update', () => checkUpdate(false)), 2500); setInterval(() => { if (!document.hidden) safe('Update', () => checkUpdate(false)); }, 30 * 60e3);
        if (PAGE === 'zdl') { safe('Spalten', watchCols); safe('Spalten', dtPopupGuard); }
        safe('Team', watchTeam);
        setInterval(() => safe('Kaffee', checkCoffee), 15000); setTimeout(() => safe('Kaffee', checkCoffee), 3000);
        document.addEventListener('visibilitychange', () => { if (!document.hidden) safe('Kaffee', checkCoffee); });
        // Hintergrund-Tabs drosselt der Browser stark – ein Worker-Takt hält die Erinnerungen pünktlich
        safe('Kaffee', () => { const w = new Worker(URL.createObjectURL(new Blob(['setInterval(()=>postMessage(0),20000)'], { type: 'text/javascript' }))); w.onmessage = () => safe('Kaffee', checkCoffee); });
        const late = () => safe('Nachladen', () => { killOldScript(); tintRows(); markToday(); fixColors(); if (K) renderKal(); if (SH) renderShell(); startFx(); render(); try { window.dispatchEvent(new Event('resize')); } catch (e) { } });
        if (document.readyState === 'complete') setTimeout(late, 800);
        else window.addEventListener('load', () => setTimeout(late, 800));
        setTimeout(() => safe('Nachladen', () => { tintRows(); render(); }), 2500);
        try {
            window.ZeitPlus = {
                version: VERSION, settings: () => S,
                diag: () => ({ version: VERSION, seite: PAGE, farbLaeufe: cfRuns, kalender: !!$('zk'), tabelle: hasTable, heute: hasToday, content: !!content, dashboard: !!$('zp'), fehler: lastErr, url: location.href, datum: todayKey() })
            };
        } catch (e) { }
    }

    function earlyStart() {
        const r = document.documentElement;
        if (!r) { new MutationObserver((m, o) => { if (document.documentElement) { o.disconnect(); earlyStart(); } }).observe(document, { childList: true }); return; }
        try {
            const t = theme();
            ['page', 'accent', 'text', 'surf', 'line', 'muted'].forEach(k => { if (t[k]) r.style.setProperty('--zp-' + k, t[k]); });
            r.style.setProperty('--zp-page', t.page || t.bg || '#fff');
            if (S.accent) r.style.setProperty('--zp-accent', S.accent);
            r.classList.toggle('zp-dark', !!t.dark);
            r.style.background = t.page || t.bg || '';
            r.classList.add('zp-loading');
            injectPageCss();
        } catch (e) { }
        setTimeout(reveal, 4000);    // Sicherheitsnetz
    }
    function reveal() {
        const r = document.documentElement;
        if (!r || !r.classList.contains('zp-loading')) return;
        r.classList.remove('zp-loading'); r.classList.add('zp-ready');
        r.style.background = '';
    }
    earlyStart();
    const boot = () => { try { init(); } catch (e) { reportError('Start', e); } finally { requestAnimationFrame(() => requestAnimationFrame(reveal)); } };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();
