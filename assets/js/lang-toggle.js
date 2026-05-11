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

  var langData = document.getElementById('post-lang-data');

  function pageContentLang() {
    return langData && langData.dataset.current
      ? normalizeLang(langData.dataset.current)
      : normalizeLang(document.documentElement.getAttribute('lang') || 'en');
  }

  function update(lang, options) {
    options = options || {};
    lang = normalizeLang(lang);
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', pageContentLang());
    if (options.persist !== false) {
      writeLang(lang);
    }
    var current = lang === 'ko' ? '한국어' : 'English';
    var target = lang === 'ko' ? 'English' : 'Korean';
    btn.querySelector('span').textContent = current;
    btn.setAttribute('aria-label', 'Content language: ' + current + '. Switch to ' + target);
    btn.setAttribute('title', 'Content language: ' + current + '. Switch to ' + target);

    var searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.setAttribute('placeholder', lang === 'ko' ? '검색...' : 'Search...');
      searchInput.setAttribute('aria-label', lang === 'ko' ? '검색' : 'Search');
    }

    document.querySelectorAll('.lang-en, .lang-en-block').forEach(function(element) {
      element.setAttribute('lang', 'en');
    });
    document.querySelectorAll('.lang-ko, .lang-ko-block').forEach(function(element) {
      element.setAttribute('lang', 'ko');
    });

    var searchCancel = document.getElementById('search-cancel');
    if (searchCancel) {
      searchCancel.textContent = lang === 'ko' ? '취소' : 'Cancel';
    }

    document.dispatchEvent(new CustomEvent('site-lang-change', { detail: { lang: lang } }));
  }

  function postHasAlternate() {
    return langData && langData.dataset.hasAlt === 'true' && Boolean(langData.dataset.altUrl);
  }

  function documentLang() {
    return langData && langData.dataset.current
      ? normalizeLang(langData.dataset.current)
      : normalizeLang(readLang() || document.documentElement.getAttribute('lang') || 'en');
  }

  var initialLang = documentLang();

  update(initialLang, { persist: !langData });

  if (langData && !postHasAlternate()) {
    btn.hidden = true;
    btn.disabled = true;
    return;
  }

  btn.addEventListener('click', function() {
    var current = postHasAlternate()
      ? normalizeLang(langData.dataset.current)
      : normalizeLang(document.documentElement.getAttribute('data-lang') || readLang() || 'en');
    var newLang = current === 'en' ? 'ko' : 'en';

    if (postHasAlternate() && normalizeLang(langData.dataset.current) !== newLang) {
      writeLang(newLang);
      window.location.href = langData.dataset.altUrl;
      return;
    }

    update(newLang);
  });

  window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
      update(documentLang(), { persist: !langData });
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
