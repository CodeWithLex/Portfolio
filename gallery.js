/**
 * ==========================================================================
 * GALLERY & SHOOT INSPECTOR CONTROLLER
 * Lex Matondo · Leavian Visuals Archive
 * ==========================================================================
 */

(function () {
  'use strict';

  // State
  let currentCategory = 'all';
  let activeShoot = null;
  let activePhotoIndex = 0;
  let isSwitchingPhoto = false;

  // DOM Elements
  const foldersGrid = document.getElementById('folders-grid');
  const filterButtons = document.querySelectorAll('.gal-filter-btn');
  const statusLabel = document.getElementById('gallery-status-label');

  // Inspector Elements
  const inspector = document.getElementById('shoot-inspector');
  const inspectorCloseBtn = document.getElementById('inspector-close-btn');
  const inspectorDismissBtn = document.getElementById('inspector-dismiss-btn');
  const inspectorShareBtn = document.getElementById('inspector-share-btn');
  const inspectorTitle = document.getElementById('inspector-shoot-title');
  const inspectorCategory = document.getElementById('inspector-shoot-category');
  const inspectorCounter = document.getElementById('inspector-photo-counter');

  // Photo Stage Elements
  const activePhotoImg = document.getElementById('active-photo-img');
  const stagePrevBtn = document.getElementById('stage-prev-btn');
  const stageNextBtn = document.getElementById('stage-next-btn');
  const filmstripContainer = document.getElementById('filmstrip-container');
  const mobileDetailsToggle = document.getElementById('mobile-details-toggle');
  const inspectorDetailsCol = document.getElementById('inspector-details-col');

  // Details Panel Elements
  const detailPhotoIndex = document.getElementById('detail-photo-index');
  const detailPhotoTitle = document.getElementById('detail-photo-title');
  const detailPhotoCaption = document.getElementById('detail-photo-caption');
  const detailCamera = document.getElementById('detail-camera');
  const detailLens = document.getElementById('detail-lens');
  const detailExposure = document.getElementById('detail-exposure');
  const detailLighting = document.getElementById('detail-lighting');
  const detailColor = document.getElementById('detail-color');
  const detailPostScience = document.getElementById('detail-post-science');
  const detailClient = document.getElementById('detail-client');
  const detailLocation = document.getElementById('detail-location');
  const detailDate = document.getElementById('detail-date');
  const detailCount = document.getElementById('detail-count');
  const detailInquireLink = document.getElementById('detail-inquire-link');

  const galleryData = window.GALLERY_DATA || [];

  /* ---------------------------------------------------------------------------
     INITIALIZATION & RENDERING
     --------------------------------------------------------------------------- */
  function initGallery() {
    renderFolders();
    setupFilters();
    setupInspectorListeners();
    setupKeyboardNavigation();
    setupTouchGestures();
    handleInitialUrl();
  }

  function renderFolders() {
    if (!foldersGrid) return;
    foldersGrid.innerHTML = '';

    const filtered = currentCategory === 'all'
      ? galleryData
      : galleryData.filter(s => s.category === currentCategory);

    filtered.forEach((shoot, idx) => {
      const card = document.createElement('article');
      card.className = 'folder-card';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Open ${shoot.title} collection`);
      card.dataset.slug = shoot.slug;

      card.innerHTML = `
        <div class="folder-cover-wrap">
          <img class="folder-cover-img" src="${shoot.coverThumb || shoot.cover}" alt="${shoot.title} Cover Preview" loading="lazy" decoding="async">
          <span class="folder-cat-badge">${shoot.categoryLabel}</span>
          <span class="folder-count-badge">${shoot.photos.length} PHOTOS</span>
        </div>
        <div class="folder-info">
          <div class="folder-meta-top">
            <span>${shoot.location}</span>
            <span>${shoot.date}</span>
          </div>
          <h2 class="folder-title">${shoot.title}</h2>
          <p class="folder-tagline">${shoot.tagline}</p>
          <div class="folder-specs-row">
            <span class="folder-lens">${shoot.primaryLens}</span>
            <span class="folder-action">OPEN COLLECTION →</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => openShoot(shoot.slug, 0));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openShoot(shoot.slug, 0);
        }
      });

      foldersGrid.appendChild(card);
    });

    // Update Status Count
    if (statusLabel) {
      const totalPhotos = filtered.reduce((sum, s) => sum + s.photos.length, 0);
      statusLabel.textContent = `SHOWING ${filtered.length} COLLECTION${filtered.length === 1 ? '' : 'S'} · ${totalPhotos} PHOTOGRAPHS`;
    }
  }

  function setupFilters() {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        currentCategory = btn.dataset.category || 'all';
        renderFolders();
      });
    });
  }

  /* ---------------------------------------------------------------------------
     INSPECTOR MODAL & STAGE CONTROLLER
     --------------------------------------------------------------------------- */
  function openShoot(slug, initialPhotoIndex = 0) {
    const shoot = galleryData.find(s => s.slug === slug);
    if (!shoot) return;

    activeShoot = shoot;
    activePhotoIndex = Math.max(0, Math.min(initialPhotoIndex, shoot.photos.length - 1));

    // Update Header
    if (inspectorTitle) inspectorTitle.textContent = shoot.title;
    if (inspectorCategory) inspectorCategory.textContent = shoot.categoryLabel;

    // Render Filmstrip
    renderFilmstrip();

    // Show Inspector
    if (inspector) {
      inspector.classList.add('is-open');
      inspector.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    // Load Initial Photo & Metadata
    loadPhoto(activePhotoIndex, false);

    // Sync URL Deep Link
    updateUrl(shoot.slug, activePhotoIndex);
  }

  function closeShoot() {
    if (!inspector) return;
    inspector.classList.remove('is-open');
    inspector.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    activeShoot = null;

    if (inspectorDetailsCol) {
      inspectorDetailsCol.classList.remove('is-drawer-open');
    }
    if (mobileDetailsToggle) {
      mobileDetailsToggle.setAttribute('aria-expanded', 'false');
    }

    // Reset URL without reload
    const url = new URL(window.location.href);
    url.searchParams.delete('shoot');
    url.searchParams.delete('photo');
    window.history.pushState({}, '', url.toString());
  }

  function renderFilmstrip() {
    if (!filmstripContainer || !activeShoot) return;
    filmstripContainer.innerHTML = '';

    activeShoot.photos.forEach((photo, idx) => {
      const thumbBtn = document.createElement('button');
      thumbBtn.type = 'button';
      thumbBtn.className = `filmstrip-thumb ${idx === activePhotoIndex ? 'is-active' : ''}`;
      thumbBtn.setAttribute('role', 'tab');
      thumbBtn.setAttribute('aria-label', `Frame ${idx + 1}: ${photo.title}`);
      thumbBtn.setAttribute('aria-selected', idx === activePhotoIndex ? 'true' : 'false');

      thumbBtn.innerHTML = `<img src="${photo.thumb || photo.full}" alt="Thumbnail ${idx + 1}" loading="lazy">`;

      thumbBtn.addEventListener('click', () => {
        if (idx !== activePhotoIndex) {
          loadPhoto(idx, true);
        }
      });

      filmstripContainer.appendChild(thumbBtn);
    });
  }

  function loadPhoto(index, animate = true) {
    if (!activeShoot || !activeShoot.photos[index]) return;
    if (isSwitchingPhoto && animate) return;

    activePhotoIndex = index;
    const photo = activeShoot.photos[index];
    const total = activeShoot.photos.length;

    // Counter
    if (inspectorCounter) {
      const cur = String(index + 1).padStart(2, '0');
      const tot = String(total).padStart(2, '0');
      inspectorCounter.textContent = `${cur} / ${tot}`;
    }

    // Update Photo Image with smooth transition
    if (activePhotoImg) {
      if (animate) {
        isSwitchingPhoto = true;
        activePhotoImg.classList.add('is-switching');
        setTimeout(() => {
          activePhotoImg.src = photo.full;
          activePhotoImg.alt = `${photo.title} — ${activeShoot.title}`;
          activePhotoImg.onload = () => {
            activePhotoImg.classList.remove('is-switching');
            isSwitchingPhoto = false;
          };
          // Fallback if cached
          setTimeout(() => {
            activePhotoImg.classList.remove('is-switching');
            isSwitchingPhoto = false;
          }, 200);
        }, 120);
      } else {
        activePhotoImg.src = photo.full;
        activePhotoImg.alt = `${photo.title} — ${activeShoot.title}`;
      }
    }

    // Update Filmstrip selection
    if (filmstripContainer) {
      const thumbs = filmstripContainer.querySelectorAll('.filmstrip-thumb');
      thumbs.forEach((th, i) => {
        th.classList.toggle('is-active', i === index);
        th.setAttribute('aria-selected', i === index ? 'true' : 'false');
        if (i === index) {
          th.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
    }

    // Update Details Panel
    if (detailPhotoIndex) detailPhotoIndex.textContent = `FRAME ${String(index + 1).padStart(2, '0')}`;
    if (detailPhotoTitle) detailPhotoTitle.textContent = photo.title;
    if (detailPhotoCaption) detailPhotoCaption.textContent = photo.caption;
    if (detailCamera) detailCamera.textContent = photo.camera || activeShoot.primaryCamera;
    if (detailLens) detailLens.textContent = photo.lens || activeShoot.primaryLens;
    if (detailExposure) detailExposure.textContent = photo.exposure;
    if (detailLighting) detailLighting.textContent = photo.lighting;
    if (detailColor) detailColor.textContent = photo.colorProfile;
    if (detailPostScience) detailPostScience.textContent = activeShoot.colorScience;

    if (detailClient) detailClient.textContent = activeShoot.client;
    if (detailLocation) detailLocation.textContent = activeShoot.location;
    if (detailDate) detailDate.textContent = activeShoot.date;
    if (detailCount) detailCount.textContent = `${total} Photographs`;

    if (detailInquireLink) {
      detailInquireLink.href = `mailto:lexmatondo@g.cjc.edu.ph?subject=${encodeURIComponent('Inquiry: ' + activeShoot.title)}&body=${encodeURIComponent('Hi Lex,\n\nI was browsing your visual archive and would love to inquire about booking a session similar to ' + activeShoot.title + '.\n\nThank you!')}`;
    }

    updateUrl(activeShoot.slug, index);
  }

  function nextPhoto() {
    if (!activeShoot) return;
    const nextIdx = (activePhotoIndex + 1) % activeShoot.photos.length;
    loadPhoto(nextIdx, true);
  }

  function prevPhoto() {
    if (!activeShoot) return;
    const prevIdx = (activePhotoIndex - 1 + activeShoot.photos.length) % activeShoot.photos.length;
    loadPhoto(prevIdx, true);
  }

  /* ---------------------------------------------------------------------------
     EVENT LISTENERS & ACCESSIBILITY
     --------------------------------------------------------------------------- */
  function setupInspectorListeners() {
    if (inspectorCloseBtn) inspectorCloseBtn.addEventListener('click', closeShoot);
    if (inspectorDismissBtn) inspectorDismissBtn.addEventListener('click', closeShoot);
    if (stagePrevBtn) stagePrevBtn.addEventListener('click', prevPhoto);
    if (stageNextBtn) stageNextBtn.addEventListener('click', nextPhoto);

    // Share Button
    if (inspectorShareBtn) {
      inspectorShareBtn.addEventListener('click', () => {
        const url = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(() => {
            const originalText = inspectorShareBtn.innerHTML;
            inspectorShareBtn.innerHTML = '<span>COPIED</span>';
            setTimeout(() => {
              inspectorShareBtn.innerHTML = originalText;
            }, 2000);
          });
        }
      });
    }

    // Mobile Details Drawer Toggle & Close Button
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    if (drawerCloseBtn && inspectorDetailsCol) {
      drawerCloseBtn.addEventListener('click', () => {
        inspectorDetailsCol.classList.remove('is-drawer-open');
        if (mobileDetailsToggle) {
          mobileDetailsToggle.setAttribute('aria-expanded', 'false');
          mobileDetailsToggle.querySelector('.toggle-text').textContent = 'SHOW SPECS & DETAILS';
        }
      });
    }

    if (mobileDetailsToggle && inspectorDetailsCol) {
      mobileDetailsToggle.addEventListener('click', () => {
        const isOpen = inspectorDetailsCol.classList.toggle('is-drawer-open');
        mobileDetailsToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        mobileDetailsToggle.querySelector('.toggle-text').textContent = isOpen
          ? 'HIDE SPECS & DETAILS'
          : 'SHOW SPECS & DETAILS';
      });
    }
  }

  function setupKeyboardNavigation() {
    window.addEventListener('keydown', (e) => {
      if (!inspector || !inspector.classList.contains('is-open')) return;

      if (e.key === 'Escape') {
        closeShoot();
      } else if (e.key === 'ArrowRight' || e.key === 'j') {
        nextPhoto();
      } else if (e.key === 'ArrowLeft' || e.key === 'k') {
        prevPhoto();
      }
    });
  }

  function setupTouchGestures() {
    const stage = document.getElementById('photo-display-stage');
    if (!stage) return;

    let touchStartX = 0;
    let touchEndX = 0;

    stage.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    stage.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const threshold = 45;
      if (touchEndX < touchStartX - threshold) {
        nextPhoto();
      } else if (touchEndX > touchStartX + threshold) {
        prevPhoto();
      }
    }
  }

  function updateUrl(slug, photoIndex) {
    const url = new URL(window.location.href);
    url.searchParams.set('shoot', slug);
    url.searchParams.set('photo', String(photoIndex + 1));
    window.history.replaceState({ shoot: slug, photo: photoIndex }, '', url.toString());
  }

  function handleInitialUrl() {
    const params = new URLSearchParams(window.location.search);
    const shootSlug = params.get('shoot');
    const photoNum = parseInt(params.get('photo'), 10);
    const photoIndex = !isNaN(photoNum) && photoNum > 0 ? photoNum - 1 : 0;

    if (shootSlug) {
      openShoot(shootSlug, photoIndex);
    }
  }

  // Handle browser back/forward history navigation
  window.addEventListener('popstate', (e) => {
    const params = new URLSearchParams(window.location.search);
    const shootSlug = params.get('shoot');
    if (shootSlug) {
      const photoNum = parseInt(params.get('photo'), 10);
      const photoIndex = !isNaN(photoNum) && photoNum > 0 ? photoNum - 1 : 0;
      openShoot(shootSlug, photoIndex);
    } else {
      if (inspector && inspector.classList.contains('is-open')) {
        closeShoot();
      }
    }
  });

  // DOM Content Loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
  } else {
    initGallery();
  }

})();
