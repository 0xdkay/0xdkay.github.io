document.addEventListener('DOMContentLoaded', function() {
  var backToTop = document.getElementById('back-to-top');
  if (backToTop && !backToTop.getAttribute('aria-label')) {
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.setAttribute('title', 'Back to top');
  }

  var searchCancel = document.getElementById('search-cancel');
  var searchInput = document.getElementById('search-input');
  if (searchCancel && searchInput) {
    searchCancel.addEventListener('click', function() {
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }
});
