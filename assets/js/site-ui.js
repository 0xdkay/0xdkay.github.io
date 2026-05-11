document.addEventListener('DOMContentLoaded', function() {
  var backToTop = document.getElementById('back-to-top');
  if (backToTop && !backToTop.getAttribute('aria-label')) {
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.setAttribute('title', 'Back to top');
  }

  var searchCancel = document.getElementById('search-cancel');
  var searchInput = document.getElementById('search-input');
  var searchWrapper = document.getElementById('search-result-wrapper');
  var searchTrigger = document.getElementById('search-trigger');
  var sidebarTrigger = document.getElementById('sidebar-trigger');
  var sidebar = document.getElementById('sidebar');
  var mainWrapper = document.getElementById('main-wrapper');
  var mask = document.getElementById('mask');
  var mobileSidebarQuery = window.matchMedia('(max-width: 1199.98px)');

  function sidebarExpanded() {
    return document.body.hasAttribute('sidebar-display');
  }

  function sidebarFocusables() {
    if (!sidebar) {
      return [];
    }

    return Array.prototype.slice.call(
      sidebar.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    );
  }

  function syncSidebarExpanded() {
    if (sidebarTrigger) {
      sidebarTrigger.setAttribute('aria-expanded', sidebarExpanded() ? 'true' : 'false');
    }

    if (!sidebar) {
      return;
    }

    if (mobileSidebarQuery.matches && !sidebarExpanded()) {
      sidebar.setAttribute('aria-hidden', 'true');
      sidebar.inert = true;
      if (mainWrapper) {
        mainWrapper.inert = false;
      }
      return;
    }

    sidebar.removeAttribute('aria-hidden');
    sidebar.inert = false;

    if (mobileSidebarQuery.matches && sidebarExpanded()) {
      if (mainWrapper) {
        mainWrapper.inert = true;
      }

      var focusables = sidebarFocusables();
      if (focusables.length && !sidebar.contains(document.activeElement)) {
        focusables[0].focus();
      }
    } else if (mainWrapper) {
      mainWrapper.inert = false;
    }
  }

  function syncSearchExpanded(expanded) {
    if (typeof expanded === 'undefined') {
      expanded = Boolean(searchWrapper && !searchWrapper.classList.contains('d-none'));
    }

    if (searchTrigger) {
      searchTrigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }

    if (searchWrapper) {
      searchWrapper.setAttribute('aria-hidden', expanded ? 'false' : 'true');
    }
  }

  function searchExpanded() {
    return Boolean(
      searchWrapper && !searchWrapper.classList.contains('d-none') ||
      searchInput && searchInput.value ||
      searchTrigger && searchTrigger.getAttribute('aria-expanded') === 'true'
    );
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

  if (typeof mobileSidebarQuery.addEventListener === 'function') {
    mobileSidebarQuery.addEventListener('change', syncSidebarExpanded);
  } else if (typeof mobileSidebarQuery.addListener === 'function') {
    mobileSidebarQuery.addListener(syncSidebarExpanded);
  }
  syncSidebarExpanded();

  if (searchTrigger) {
    searchTrigger.addEventListener('click', function() {
      window.setTimeout(function() {
        syncSearchExpanded(true);
      }, 0);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('focus', function() {
      window.setTimeout(function() {
        syncSearchExpanded(true);
      }, 0);
    });

    searchInput.addEventListener('input', function() {
      window.setTimeout(function() {
        syncSearchExpanded();
      }, 0);
    });
  }

  if (searchCancel && searchInput) {
    searchCancel.addEventListener('click', function() {
      var shouldRestoreFocus = document.activeElement === searchInput || document.activeElement === searchCancel ||
        Boolean(searchWrapper && searchWrapper.contains(document.activeElement));
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      window.setTimeout(function() {
        syncSearchExpanded(false);
        if (shouldRestoreFocus && searchTrigger) {
          searchTrigger.focus();
        }
      }, 0);
    });
  }

  document.addEventListener('keydown', function(event) {
    if (event.key !== 'Escape') {
      return;
    }

    if (searchCancel && searchExpanded()) {
      searchCancel.click();
      if (searchTrigger) {
        searchTrigger.focus();
      }
      return;
    }

    if (sidebarTrigger && sidebarExpanded()) {
      sidebarTrigger.click();
      sidebarTrigger.focus();
    }
  });

  document.addEventListener('keydown', function(event) {
    if (event.key !== 'Tab' || !mobileSidebarQuery.matches || !sidebarExpanded() || !sidebar) {
      return;
    }

    var focusables = sidebarFocusables();
    if (!focusables.length) {
      return;
    }

    var first = focusables[0];
    var last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
});
