document.addEventListener('DOMContentLoaded', function() {
  var btn = document.getElementById('lang-toggle');
  if (!btn) return;

  function update(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    localStorage.setItem('site-lang', lang);
    btn.querySelector('span').textContent = lang === 'ko' ? '한국어' : 'English';
  }

  update(localStorage.getItem('site-lang') || 'en');

  btn.addEventListener('click', function() {
    var current = localStorage.getItem('site-lang') || 'en';
    var newLang = current === 'en' ? 'ko' : 'en';
    update(newLang);

    var langData = document.getElementById('post-lang-data');
    if (langData && langData.dataset.current !== newLang) {
      window.location.href = langData.dataset.altUrl;
    }
  });

  document.querySelectorAll('.content a, .post-content a, article a').forEach(function(a) {
    var href = a.getAttribute('href');
    if (!href || !href.startsWith('/posts/')) return;
    var text = a.textContent.trim().toLowerCase();
    if (text === 'korean' || text === '한국어') {
      a.addEventListener('click', function() { localStorage.setItem('site-lang', 'ko'); });
    } else if (text === 'english' || text === '영어') {
      a.addEventListener('click', function() { localStorage.setItem('site-lang', 'en'); });
    }
  });
});
