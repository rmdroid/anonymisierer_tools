'use strict';
(() => {
  const english = document.documentElement.lang === 'en';
  const product = document.body.dataset.product || 'mac';
  const t = (de, en) => english ? en : de;
  const endpoint = 'https://n8n.top-beraternetzwerk.de/webhook/termine';
  const legalDialog = document.querySelector('#legal-dialog');
  const legalFrame = document.querySelector('#legal-frame');
  let legalOpener;
  const legalTitles = { impressum: t('Impressum', 'Legal notice'), datenschutz: t('Datenschutz', 'Privacy'), eula: 'EULA' };
  document.querySelectorAll('[data-legal]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      legalOpener = link;
      const title = legalTitles[link.dataset.legal];
      document.querySelector('#legal-title').textContent = title;
      legalFrame.title = title;
      legalFrame.src = link.href;
      legalDialog.showModal();
    });
  });
  document.querySelector('#close-legal').addEventListener('click', () => legalDialog.close());
  legalDialog.addEventListener('close', () => {
    legalFrame.src = 'about:blank';
    legalOpener?.focus({ preventScroll: true });
  });
  legalDialog.addEventListener('click', event => {
    if (event.target !== legalDialog) return;
    const box = legalDialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) legalDialog.close();
  });
  window.addEventListener('message', event => {
    if (event.source === legalFrame.contentWindow && event.data?.type === 'anonymisierer-close-legal' && legalDialog.open) legalDialog.close();
  });
  function track(name) {
    if (!window.privacyCanTrack?.()) return;
    try { window.umami?.track(name); } catch { /* Measurement must not interrupt the page. */ }
  }

  // The same initialization as the original site: lemon.js binds these links on window.load.
  document.querySelectorAll('.lemonsqueezy-button').forEach(link => {
    link.addEventListener('click', () => track(link.dataset.checkout === 'team' ? 'mac_team_checkout_click' : 'mac_single_checkout_click'));
  });

  const menu = document.querySelector('.menu'), navigation = document.querySelector('#navigation');
  function closeMenu() {
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', t('Menü öffnen', 'Open menu'));
    navigation.classList.remove('open');
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? t('Menü schließen', 'Close menu') : t('Menü öffnen', 'Open menu'));
    navigation.classList.toggle('open', open);
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      closeMenu(); menu.focus({ preventScroll: true });
    }
  });
  const gallery = document.querySelectorAll('[data-gallery]');
  if (gallery.length) {
    const dialog = document.querySelector('#shot-dialog');
    gallery.forEach(button => button.addEventListener('click', () => {
      const title = button.dataset.caption || button.querySelector('img').alt;
      document.querySelector('#shot-title').textContent = title;
      const image = document.querySelector('#dialog-image');
      image.src = button.dataset.gallery;
      image.alt = title;
      dialog.showModal();
    }));
    document.querySelector('#close-shot').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
  }

  document.querySelectorAll('[data-request]').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelector('#anfrage').open = true;
      document.querySelector('#request-platform').value = link.dataset.request;
      track('request_open');
    });
  });
  document.querySelectorAll('[data-open-updates]').forEach(link => {
    link.addEventListener('click', () => { document.querySelector('#updates').open = true; });
  });
  function revealAnchor() {
    if (location.hash === '#updates' || location.hash === '#anfrage') {
      document.querySelector(location.hash).open = true;
    }
  }
  revealAnchor();
  window.addEventListener('hashchange', revealAnchor);

  document.querySelectorAll('[data-contact]').forEach(form => {
    const submit = form.querySelector('button[type="submit"]');
    const status = form.querySelector('.form-status');
    submit.disabled = false;
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (submit.disabled) return;
      status.textContent = '';
      status.className = 'form-status';
      if (!form.reportValidity()) return;
      if (form.elements.website.value) return;
      const email = form.elements.email.value.trim();
      const name = form.elements.name.value.trim() || email;
      const updates = form.dataset.contact === 'updates';
      const target = updates ? '' : form.elements.platform.value.trim();
      // Keep the established webhook fields and routing keys; never send a local file path.
      const page = /^https?:$/.test(location.protocol) ? location.origin + location.pathname : 'https://anonymisierer-tools.de/' + (product === 'mac' ? '' : product + '/') + (english ? 'index_eng.html' : '');
      let interest = updates ? t('KI-Anonymisierer Updates / Newsletter', 'KI-Anonymisierer updates / newsletter') : t('Anfrage KI-Anonymisierer', 'KI-Anonymisierer request');
      let source = updates ? 'ki-anonymisierer-landingpage-updates' : 'ki-anonymisierer-landingpage-request';
      if (product === 'ios' && updates) {
        source = 'anonymisierer-ios-landingpage-updates';
        interest = t('Anonymisierer iOS Updates / Newsletter', 'Anonymisierer iOS Product updates');
      }
      if (product === 'chrome' && !updates) {
        source = 'ki-anonymisierer-landingpage-platform-request';
        interest = t('Anfrage weitere Plattformen KI-Anonymisierer', 'KI-Anonymisierer platform request');
      }
      const payload = {
        name, email,
        message: interest + '\nName: ' + name + '\nE-Mail: ' + email + (updates ? '' : '\nWunsch/Bedarf: ' + (target || 'Nicht angegeben')) + '\nQuelle: KI-Anonymisierer Landingpage\nSeite: ' + page,
        source,
        page, interest
      };
      if (!updates) payload.platform = target;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      submit.disabled = true;
      form.setAttribute('aria-busy', 'true');
      status.textContent = t('Wird übermittelt …', 'Sending …');
      try {
        const response = await fetch(endpoint, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload), signal: controller.signal
        });
        if (!response.ok) throw new Error('request_failed');
        form.reset();
        status.textContent = updates ? t('Vielen Dank. Ihre Angaben wurden übermittelt.', 'Thank you. Your details have been submitted.') : t('Vielen Dank. Ihre Anfrage wurde übermittelt.', 'Thank you. Your inquiry has been submitted.');
        status.className = 'form-status is-success';
        track(updates ? 'updates_request_sent' : 'team_or_platform_request_sent');
      } catch {
        status.textContent = t('Wir haben keine Versandbestätigung erhalten. Ihre Eingaben bleiben erhalten. Bitte versuchen Sie es später erneut oder schreiben Sie an rm@kostenmanager.net.', 'We have not received confirmation. Your entries have been kept. Please try again later or email rm@kostenmanager.net.');
        status.className = 'form-status is-error';
      } finally {
        clearTimeout(timeout);
        submit.disabled = false;
        form.removeAttribute('aria-busy');
      }
    });
  });
  document.querySelectorAll('a[href*="apps.apple.com"]').forEach(link => link.addEventListener('click', () => track(product === 'ios' ? 'ios_app_store_click' : 'mac_app_store_click')));
  document.querySelectorAll('a[href*="chromewebstore.google.com"]').forEach(link => link.addEventListener('click', () => track('chrome_install_click')));
  document.querySelector('#next-step')?.addEventListener('click', () => track('demo_step_next'));
})();
