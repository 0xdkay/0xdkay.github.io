(function() {
  function readLang() {
    try {
      return localStorage.getItem('site-lang');
    } catch (e) {
      return null;
    }
  }

  function normalizeLang(lang) {
    return lang && lang.indexOf('ko') === 0 ? 'ko' : 'en';
  }

  var htmlLang = document.documentElement.getAttribute('lang') || 'en';
  var isPostPage = /^\/posts\/[^/]+\/?$/.test(window.location.pathname);
  var lang = normalizeLang(isPostPage ? htmlLang : (readLang() || htmlLang));
  document.documentElement.setAttribute('data-lang', lang);
  document.documentElement.setAttribute('lang', lang);
})();
