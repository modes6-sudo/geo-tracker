/* app.js — Geopolitical Intelligence Dashboard */

(function() {
  'use strict';

  var CGI_BIN = '__CGI_BIN__';

  // ============================================
  // THEME TOGGLE
  // ============================================
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = 'dark'; // Default dark for intelligence dashboard
  root.setAttribute('data-theme', theme);

  if (toggle) {
    toggle.addEventListener('click', function() {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
      toggle.innerHTML = theme === 'dark'
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    });
  }

  // ============================================
  // TAB NAVIGATION
  // ============================================
  var tabButtons = document.querySelectorAll('.tab-btn');
  var tabPanels = document.querySelectorAll('.tab-panel');

  function switchTab(targetTab) {
    tabButtons.forEach(function(btn) {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    tabPanels.forEach(function(panel) {
      panel.hidden = true;
      panel.classList.remove('active');
    });

    var activeBtn = document.querySelector('[data-tab="' + targetTab + '"]');
    var activePanel = document.getElementById('tab-' + targetTab);

    if (activeBtn && activePanel) {
      activeBtn.classList.add('active');
      activeBtn.setAttribute('aria-selected', 'true');
      activePanel.hidden = false;
      activePanel.classList.add('active');

      var mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.scrollTop = 0;
      }
    }
  }

  tabButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var tab = this.getAttribute('data-tab');
      switchTab(tab);
    });

    btn.addEventListener('keydown', function(e) {
      var tabs = Array.from(tabButtons);
      var index = tabs.indexOf(this);

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        var next = tabs[(index + 1) % tabs.length];
        next.focus();
        next.click();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        var prev = tabs[(index - 1 + tabs.length) % tabs.length];
        prev.focus();
        prev.click();
      } else if (e.key === 'Home') {
        e.preventDefault();
        tabs[0].focus();
        tabs[0].click();
      } else if (e.key === 'End') {
        e.preventDefault();
        tabs[tabs.length - 1].focus();
        tabs[tabs.length - 1].click();
      }
    });
  });

  // ============================================
  // EXPANDABLE SECTIONS
  // ============================================
  var expandTriggers = document.querySelectorAll('.expand-trigger');

  expandTriggers.forEach(function(trigger) {
    trigger.addEventListener('click', function() {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      var content = this.nextElementSibling;

      if (expanded) {
        this.setAttribute('aria-expanded', 'false');
        content.hidden = true;
      } else {
        this.setAttribute('aria-expanded', 'true');
        content.hidden = false;
      }
    });
  });

  expandTriggers.forEach(function(trigger) {
    if (trigger.getAttribute('aria-expanded') === 'true') {
      var content = trigger.nextElementSibling;
      if (content) {
        content.hidden = false;
      }
    }
  });

  // ============================================
  // TOAST NOTIFICATION
  // ============================================
  var toastEl = null;
  var toastTimer = null;

  function createToast() {
    if (toastEl) return;
    toastEl = document.createElement('div');
    toastEl.className = 'refresh-toast';
    toastEl.setAttribute('role', 'status');
    toastEl.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastEl);
  }

  function showToast(message, type) {
    createToast();
    if (toastTimer) clearTimeout(toastTimer);
    toastEl.className = 'refresh-toast';
    var icon = type === 'success' ? '\u2713' : type === 'error' ? '\u2715' : '\u21BB';
    toastEl.innerHTML = '<span class="refresh-toast-icon">' + icon + '</span> ' + message;
    if (type) toastEl.classList.add('toast-' + type);
    void toastEl.offsetWidth;
    toastEl.classList.add('visible');
    toastTimer = setTimeout(function() {
      toastEl.classList.remove('visible');
    }, type === 'error' ? 5000 : 3500);
  }

  // ============================================
  // REFRESH INTEL
  // ============================================
  var refreshBtn = document.getElementById('refresh-btn');
  var isRefreshing = false;

  function checkForUpdates() {
    if (isRefreshing) return;
    isRefreshing = true;

    if (refreshBtn) {
      refreshBtn.classList.add('refreshing');
      refreshBtn.setAttribute('disabled', 'true');
    }
    showToast('Checking for intel updates...', null);

    var apiUrl = CGI_BIN + '/refresh.py/status';

    if (apiUrl.indexOf('__CGI') === 0) {
      showToast('Refreshing page...', null);
      setTimeout(function() {
        location.reload(true);
      }, 800);
      return;
    }

    fetch(apiUrl, { method: 'GET', cache: 'no-store' })
      .then(function(res) {
        if (!res.ok) throw new Error('API error ' + res.status);
        return res.json();
      })
      .then(function(data) {
        if (data.latest_run) {
          var lastUpdate = data.latest_run.timestamp;
          showToast('Latest intel: ' + lastUpdate + ' — Reloading...', 'success');
          setTimeout(function() {
            location.reload(true);
          }, 1500);
        } else {
          showToast('No new intel available. Monitoring runs every 4 hours.', 'error');
          resetRefreshBtn();
        }
      })
      .catch(function() {
        showToast('Refreshing page...', null);
        setTimeout(function() {
          location.reload(true);
        }, 800);
      });
  }

  function resetRefreshBtn() {
    isRefreshing = false;
    if (refreshBtn) {
      refreshBtn.classList.remove('refreshing');
      refreshBtn.removeAttribute('disabled');
    }
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', checkForUpdates);
  }

  // ============================================
  // PULL-TO-REFRESH (mobile)
  // ============================================
  var mainContent = document.querySelector('.main-content');
  var pullStartY = 0;
  var pullDist = 0;
  var isPulling = false;
  var PULL_THRESHOLD = 80;

  if (mainContent && 'ontouchstart' in window) {
    mainContent.addEventListener('touchstart', function(e) {
      if (mainContent.scrollTop <= 0 && !isRefreshing) {
        pullStartY = e.touches[0].clientY;
        isPulling = true;
      }
    }, { passive: true });

    mainContent.addEventListener('touchmove', function(e) {
      if (!isPulling) return;
      pullDist = e.touches[0].clientY - pullStartY;
      if (pullDist > 10 && mainContent.scrollTop <= 0) {
        var progress = Math.min(pullDist / PULL_THRESHOLD, 1);
        if (refreshBtn) {
          refreshBtn.style.transform = 'rotate(' + (progress * 180) + 'deg)';
        }
      }
    }, { passive: true });

    mainContent.addEventListener('touchend', function() {
      if (!isPulling) return;
      isPulling = false;
      if (refreshBtn) {
        refreshBtn.style.transform = '';
      }
      if (pullDist >= PULL_THRESHOLD && mainContent.scrollTop <= 0) {
        checkForUpdates();
      }
      pullDist = 0;
    }, { passive: true });
  }

})();
