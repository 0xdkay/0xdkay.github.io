document.addEventListener('DOMContentLoaded', function() {
  var backToTop = document.getElementById('back-to-top');
  if (backToTop && !backToTop.getAttribute('aria-label')) {
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.setAttribute('title', 'Back to top');
  }

  document.querySelectorAll('h2 .anchor, h3 .anchor, h4 .anchor, h5 .anchor, h6 .anchor').forEach(function(anchor) {
    if (anchor.getAttribute('aria-label')) {
      return;
    }

    var heading = anchor.closest('h2, h3, h4, h5, h6');
    if (!heading) {
      return;
    }

    var clone = heading.cloneNode(true);
    clone.querySelectorAll('.anchor').forEach(function(item) {
      item.remove();
    });

    var text = clone.textContent.trim();
    if (!text) {
      return;
    }

    anchor.setAttribute('aria-label', 'Permalink to ' + text);
    anchor.setAttribute('title', 'Permalink to ' + text);
    var icon = anchor.querySelector('i');
    if (icon) {
      icon.setAttribute('aria-hidden', 'true');
    }
  });

  var searchCancel = document.getElementById('search-cancel');
  var searchInput = document.getElementById('search-input');
  var searchWrapper = document.getElementById('search-result-wrapper');
  var searchTrigger = document.getElementById('search-trigger');
  var modeToggle = document.getElementById('mode-toggle');
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

  function currentModeIsDark() {
    var explicitMode = document.documentElement.getAttribute('data-mode');
    if (explicitMode) {
      return explicitMode === 'dark';
    }

    return Boolean(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  function syncModeToggle() {
    if (!modeToggle) {
      return;
    }

    var isDark = currentModeIsDark();
    modeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    modeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    modeToggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  if (modeToggle) {
    modeToggle.addEventListener('click', function() {
      window.setTimeout(syncModeToggle, 0);
    });
  }
  syncModeToggle();

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
        syncSearchExpanded();
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
      window.setTimeout(function() {
        sidebarTrigger.focus();
      }, 0);
    }
  });

  function syncTocExpanded(expanded) {
    document.querySelectorAll('.toc-trigger[aria-controls="toc-popup"]').forEach(function(trigger) {
      trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  }

  var tocPopup = document.getElementById('toc-popup');
  if (tocPopup) {
    document.querySelectorAll('.toc-trigger[aria-controls="toc-popup"]').forEach(function(trigger) {
      trigger.addEventListener('click', function() {
        window.setTimeout(function() {
          syncTocExpanded(tocPopup.open);
        }, 0);
      });
    });

    tocPopup.addEventListener('close', function() {
      syncTocExpanded(false);
    });

    var tocClose = document.getElementById('toc-popup-close');
    if (tocClose) {
      tocClose.addEventListener('click', function() {
        window.setTimeout(function() {
          syncTocExpanded(tocPopup.open);
        }, 0);
      });
    }
  }

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
