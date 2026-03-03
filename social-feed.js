// Social Feed Tab - Lazy loaded content
(function() {
  const placeholder = document.getElementById('social-feed-placeholder');
  if (!placeholder) return;
  
  const section = placeholder.parentElement;
  const tabBtn = document.querySelector('[data-tab="social"]');
  if (!tabBtn) return;
  
  let loaded = false;
  
  function loadContent() {
    if (loaded) return;
    loaded = true;
    
    fetch('./social-feed-content.html')
      .then(r => r.text())
      .then(html => {
        section.innerHTML = html;
      })
      .catch(() => {
        placeholder.textContent = 'Failed to load social feed. Please refresh.';
      });
  }
  
  tabBtn.addEventListener('click', loadContent);
  if (section.classList.contains('active')) loadContent();
})();