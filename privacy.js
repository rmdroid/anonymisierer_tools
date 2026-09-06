'use strict';
(() => {
  const key = 'anonymisierer-tools-privacy-v1';
  const notice = document.querySelector('#privacy-notice');
  const settings = document.querySelector('[data-privacy-settings]');
  if (!notice || !settings) return;
  function readChoice() {
    try {
      const value = localStorage.getItem(key);
      return value === 'analytics' || value === 'necessary' ? value : null;
    } catch { return null; }
  }
  let choice = readChoice();
  let started = false;
  window.privacyCanTrack = () => choice === 'analytics' && /^https?:$/.test(location.protocol);
  function startAnalytics() {
    if (!window.privacyCanTrack() || started) return;
    started = true;
    const umami = document.createElement('script');
    umami.defer = true;
    umami.src = 'https://cv.rm-on.de/script.js';
    umami.dataset.websiteId = 'e43f01c8-6df2-4fc7-837a-ad0cf4dca91d';
    const rybbit = document.createElement('script');
    rybbit.defer = true;
    rybbit.src = 'https://analyse.ki-notch.de/api/script.js';
    rybbit.dataset.siteId = 'e5e1a20f8b9a';
    document.head.append(umami, rybbit);
  }
  function closeNotice() {
    const hadFocus = notice.contains(document.activeElement);
    notice.hidden = true;
    if (hadFocus) settings.focus({ preventScroll: true });
  }
  notice.hidden = choice !== null;
  notice.querySelectorAll('[data-consent]').forEach(button => {
    button.addEventListener('click', () => {
      choice = button.dataset.consent;
      try { localStorage.setItem(key, choice); } catch { /* This page still honors the choice. */ }
      closeNotice();
      if (choice === 'analytics') startAnalytics();
      else if (started) location.reload();
    });
  });
  settings.addEventListener('click', () => {
    notice.hidden = false;
    notice.querySelector('[data-consent]').focus({ preventScroll: true });
  });
  window.addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    choice = readChoice();
    notice.hidden = choice !== null;
    if (choice !== 'analytics' && started) location.reload();
    else startAnalytics();
  });
  startAnalytics();
})();
