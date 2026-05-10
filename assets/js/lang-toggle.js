document.addEventListener('DOMContentLoaded', function() {
  var btn = document.getElementById('lang-toggle');
  if (!btn) return;

  function normalizeLang(lang) {
    return lang && lang.indexOf('ko') === 0 ? 'ko' : 'en';
  }

  function readLang() {
    try {
      return localStorage.getItem('site-lang');
    } catch (e) {
      return null;
    }
  }

  function writeLang(lang) {
    try {
      localStorage.setItem('site-lang', lang);
    } catch (e) {
      // Storage can be blocked in private/sandboxed contexts.
    }
  }

  function update(lang) {
    lang = normalizeLang(lang);
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang);
    writeLang(lang);
    btn.querySelector('span').textContent = lang === 'ko' ? '한국어' : 'English';
    var target = lang === 'ko' ? 'English' : 'Korean';
    btn.setAttribute('aria-label', 'Switch to ' + target);
    btn.setAttribute('title', 'Switch to ' + target);
    document.dispatchEvent(new CustomEvent('site-lang-change', { detail: { lang: lang } }));
  }

  var langData = document.getElementById('post-lang-data');
  var initialLang = langData && langData.dataset.current
    ? normalizeLang(langData.dataset.current)
    : (readLang() || document.documentElement.getAttribute('lang') || 'en');

  update(initialLang);

  btn.addEventListener('click', function() {
    var current = normalizeLang(readLang() || document.documentElement.getAttribute('data-lang') || 'en');
    var newLang = current === 'en' ? 'ko' : 'en';
    update(newLang);

    if (langData && normalizeLang(langData.dataset.current) !== newLang) {
      window.location.href = langData.dataset.altUrl;
    }
  });

  document.querySelectorAll('.content a, .post-content a, article a').forEach(function(a) {
    var href = a.getAttribute('href');
    if (!href || href.indexOf('/posts/') === -1) return;
    var text = a.textContent.trim().toLowerCase();
    if (text === 'korean' || text === '한국어') {
      a.addEventListener('click', function() { writeLang('ko'); });
    } else if (text === 'english' || text === '영어') {
      a.addEventListener('click', function() { writeLang('en'); });
    }
  });
});
