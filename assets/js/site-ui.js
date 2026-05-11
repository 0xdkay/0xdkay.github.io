document.addEventListener('DOMContentLoaded', function() {
  var backToTop = document.getElementById('back-to-top');
  if (backToTop && !backToTop.getAttribute('aria-label')) {
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.setAttribute('title', 'Back to top');
  }

  var searchCancel = document.getElementById('search-cancel');
  var searchInput = document.getElementById('search-input');
  var searchTrigger = document.getElementById('search-trigger');
  var sidebarTrigger = document.getElementById('sidebar-trigger');
  var mask = document.getElementById('mask');

  function sidebarExpanded() {
    return document.body.hasAttribute('sidebar-display');
  }

  function syncSidebarExpanded() {
    if (sidebarTrigger) {
      sidebarTrigger.setAttribute('aria-expanded', sidebarExpanded() ? 'true' : 'false');
    }
  }

  function syncSearchExpanded(expanded) {
    if (searchTrigger) {
      searchTrigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }
  }

  if (sidebarTrigger) {
    sidebarTrigger.addEventListener('click', function() {
      window.setTimeout(syncSidebarExpanded, 0);
    });
  }

  if (mask) {
    mask.addEventListener('click', function() {
      window.setTimeout(syncSidebarExpanded, 0);
    });
  }

  if (searchTrigger) {
    searchTrigger.addEventListener('click', function() {
      syncSearchExpanded(true);
    });
  }

  if (searchCancel && searchInput) {
    searchCancel.addEventListener('click', function() {
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      syncSearchExpanded(false);
    });
  }

  document.addEventListener('keydown', function(event) {
    if (event.key !== 'Escape') {
      return;
    }

    if (searchCancel && searchTrigger && searchTrigger.getAttribute('aria-expanded') === 'true') {
      searchCancel.click();
      searchTrigger.focus();
      return;
    }

    if (sidebarTrigger && sidebarExpanded()) {
      sidebarTrigger.click();
      sidebarTrigger.focus();
    }
  });
});
