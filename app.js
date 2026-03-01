/* app.js — Geopolitical Intelligence Dashboard */

(function() {
  'use strict';

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
    // Deactivate all tabs
    tabButtons.forEach(function(btn) {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    tabPanels.forEach(function(panel) {
      panel.hidden = true;
      panel.classList.remove('active');
    });

    // Activate target
    var activeBtn = document.querySelector('[data-tab="' + targetTab + '"]');
    var activePanel = document.getElementById('tab-' + targetTab);

    if (activeBtn && activePanel) {
      activeBtn.classList.add('active');
      activeBtn.setAttribute('aria-selected', 'true');
      activePanel.hidden = false;
      activePanel.classList.add('active');

      // Scroll main content to top
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

    // Keyboard navigation
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

  // Initialize: show expanded content for items that start expanded
  expandTriggers.forEach(function(trigger) {
    if (trigger.getAttribute('aria-expanded') === 'true') {
      var content = trigger.nextElementSibling;
      if (content) {
        content.hidden = false;
      }
    }
  });

})();
