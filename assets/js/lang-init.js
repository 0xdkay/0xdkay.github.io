(function() {
  var lang = localStorage.getItem('site-lang') || 'en';
  document.documentElement.setAttribute('data-lang', lang);
})();
