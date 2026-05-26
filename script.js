import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-client.js';

document.addEventListener('DOMContentLoaded', () => {
  // Dark mode toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      document.documentElement.setAttribute('data-theme', isDark ? '' : 'dark');
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });
  }

  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const btnLogin = document.getElementById('btn-login');

  const authModal = document.getElementById('auth-modal');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const authForm = document.getElementById('auth-form');
  const authEmail = document.getElementById('auth-email');
  const authPassword = document.getElementById('auth-password');
  const authName = document.getElementById('auth-name');
  const nameGroup = document.getElementById('name-group');
  const btnSubmit = document.getElementById('btn-submit');
  const formError = document.getElementById('form-error');
  const switchToRegister = document.getElementById('switch-to-register');
  const btnGoogleSignin = document.getElementById('btn-discord-signin');
  const btnTogglePassword = document.getElementById('btn-toggle-password');

  const userMenu = document.getElementById('user-menu');
  const btnUser = document.getElementById('btn-user');
  const dropdownMenu = document.getElementById('dropdown-menu');
  const btnLogout = document.getElementById('btn-logout');
  const userAvatar = document.getElementById('user-avatar');
  const userName = document.getElementById('user-name');
  const dropdownFavorites = document.getElementById('dropdown-favorites');
  const dropdownHistory = document.getElementById('dropdown-history');
  const navFavorites = document.getElementById('nav-favorites');
  const navHistory = document.getElementById('nav-history');

  const editProfileModal = document.getElementById('edit-profile-modal');
  const editProfileClose = document.getElementById('edit-profile-close');
  const profileBio = document.getElementById('profile-bio');
  const bioCharCount = document.getElementById('bio-char-count');
  const saveProfileBtn = document.getElementById('save-profile-btn');
  const cancelProfileBtn = document.getElementById('cancel-profile-btn');
  const editProfileError = document.getElementById('edit-profile-error');
  const dropdownBio = document.getElementById('dropdown-bio');
  const dropdownFavPreview = document.getElementById('dropdown-fav-preview');
  const btnEditProfile = document.getElementById('btn-edit-profile');
  const avatarGrid = document.getElementById('avatar-grid');
  const btnUploadPhoto = document.getElementById('btn-upload-photo');
  const btnRemovePhoto = document.getElementById('btn-remove-photo');
  const avatarUploadInput = document.getElementById('avatar-upload-input');
  const profilePhotoImg = document.getElementById('profile-photo-img');
  const profilePhotoPlaceholder = document.getElementById('profile-photo-placeholder');
  let selectedAvatarPath = null;
  let isUploadingPhoto = false;

  const favoritesGrid = document.getElementById('favorites-grid');
  const favoritesEmpty = document.getElementById('favorites-empty');
  const favoritesSection = document.getElementById('favorites');
  const historyList = document.getElementById('history-list');
  const historyEmpty = document.getElementById('history-empty');
  const historySection = document.getElementById('history');
  const btnClearHistory = document.getElementById('btn-clear-history');
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const searchResultsSection = document.getElementById('search-results');
  const searchResultsGrid = document.getElementById('search-results-grid');
  const searchEmpty = document.getElementById('search-empty');
  const searchQueryTitle = document.getElementById('search-query-title');
  const btnBackHome = document.getElementById('btn-back-home');

  const pollingSection = document.getElementById('polling');
  const pollingGrid = document.getElementById('polling-grid');
  const pollingResults = document.getElementById('polling-results');
  const pollingResultsList = document.getElementById('polling-results-list');
  const pollingTotalVotes = document.getElementById('polling-total-votes');
  const pollingEmpty = document.getElementById('polling-empty');
  const navPolling = document.querySelector('.nav-link[href="#polling"]');

  const characters = [
    { id: 'char1', name: 'Rem', image: 'Polling_karakter/Rem.jpeg' },
    { id: 'char2', name: 'Sakayanagi Arisu', image: 'Polling_karakter/Sakayanagi Arisu.jpeg' },
    { id: 'char3', name: 'Maho Nishizumi', image: 'Polling_karakter/Maho Nishizumi.jpeg' },
    { id: 'char4', name: 'Kaoruko Waguri', image: 'Polling_karakter/Kaoruko Waguri.jpeg' },
    { id: 'char5', name: 'Queen Elizabeth', image: 'Polling_karakter/Queen Elizabeth.jpeg' },
    { id: 'char6', name: 'Hiura', image: 'Polling_karakter/Hiura.jpeg' },
  ];

  let isRegisterMode = false;
  let currentUser = null;
  let favoritesData = [];
  let historyData = [];
  let userUnsub = null;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');

    const spans = hamburger.querySelectorAll('span');
    if (hamburger.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      navMenu.classList.remove('active');

      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);
      if (['favorites', 'history'].includes(targetId) && !currentUser) {
        e.preventDefault();
        openModal('login');
        return;
      }
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        if (['home', 'manga', 'novel', 'features'].includes(targetId)) {
          document.querySelectorAll('section[id]').forEach(s => {
            s.style.display = '';
          });
          favoritesSection.style.display = 'none';
          historySection.style.display = 'none';
          searchResultsSection.style.display = 'none';
          pollingSection.style.display = 'none';
        }
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  document.querySelectorAll('.card-manga, .card-novel, .feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
  });

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  function observeCards() {
    document.querySelectorAll('.card-manga, .card-novel, .feature-card').forEach((card, index) => {
      if (card.style.opacity === '0') {
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
      }
    });
  }
  observeCards();

  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => {
    if (section.offsetParent !== null) {
      sectionObserver.observe(section);
    }
  });

  function openModal(mode = 'login') {
    isRegisterMode = mode === 'register';
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateModalUI();
  }

  function closeModal() {
    authModal.classList.remove('active');
    document.body.style.overflow = '';
    authForm.reset();
    hideError();
  }

  function updateModalUI() {
    if (isRegisterMode) {
      modalTitle.textContent = 'Daftar Akun';
      modalSubtitle.textContent = 'Buat akun Mangacans baru';
      btnSubmit.textContent = 'Daftar';
      nameGroup.style.display = 'flex';
      document.getElementById('modal-switch').innerHTML = 'Sudah punya akun? <a href="#" id="switch-to-login">Login sekarang</a>';
      document.getElementById('switch-to-login').addEventListener('click', (e) => {
        e.preventDefault();
        openModal('login');
      });
    } else {
      modalTitle.textContent = 'Login';
      modalSubtitle.textContent = 'Masuk ke akun Mangacans kamu';
      btnSubmit.textContent = 'Login';
      nameGroup.style.display = 'none';
      document.getElementById('modal-switch').innerHTML = 'Belum punya akun? <a href="#" id="switch-to-register">Daftar sekarang</a>';
      document.getElementById('switch-to-register').addEventListener('click', (e) => {
        e.preventDefault();
        openModal('register');
      });
    }
  }

  function showError(message) {
    formError.textContent = message;
    formError.style.display = 'block';
  }

  function hideError() {
    formError.style.display = 'none';
    formError.textContent = '';
  }

  function updateUserUI(user) {
    currentUser = user;
    if (user) {
      btnLogin.style.display = 'none';
      btnBell.style.display = 'flex';
      userMenu.style.display = 'block';
      dropdownFavorites.style.display = 'flex';
      document.getElementById('dropdown-history').style.display = 'flex';
      navFavorites.style.display = 'inline-block';
      navHistory.style.display = 'inline-block';
      loadUserData(user);
      loadFavorites(user.id);
      loadHistory(user.id);
      loadExclusiveAccess();
      updateDropdownUI();
    } else {
      btnLogin.style.display = 'block';
      btnBell.style.display = 'none';
      userMenu.style.display = 'none';
      dropdownMenu.classList.remove('active');
      dropdownFavorites.style.display = 'none';
      document.getElementById('dropdown-history').style.display = 'none';
      navFavorites.style.display = 'none';
      navHistory.style.display = 'none';
      navExclusive.style.display = 'none';
      btnAdminPanel.style.display = 'none';
      favoritesSection.style.display = 'none';
      historySection.style.display = 'none';
      favoritesData = [];
      historyData = [];
    }
  }

  async function loadUserData(user) {
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      currentUserProfile = data;
      btnAdminPanel.style.display = (data.isAdmin) ? 'flex' : 'none';
      updateProfileUI(data);
    } else {
      const fallback = {
        displayName: user.user_metadata?.displayName || user.email?.split('@')[0]
      };
      updateProfileUI(fallback);
    }
  }

  function updateProfileUI(data) {
    const displayName = data.displayName || currentUser.email?.split('@')[0] || 'User';
    userName.textContent = displayName;
    if (data.bio) {
      dropdownBio.textContent = data.bio.length > 50 ? data.bio.substring(0, 50) + '...' : data.bio;
      dropdownBio.style.display = 'block';
    } else {
      dropdownBio.style.display = 'none';
    }
    if (data.selectedAvatar) {
      userAvatar.innerHTML = `<img src="${data.selectedAvatar}" alt="avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    } else if (data.photoURL) {
      userAvatar.innerHTML = `<img src="${data.photoURL}" alt="avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    } else {
      userAvatar.textContent = (displayName[0] || 'U').toUpperCase();
    }
  }

  async function loadFavorites(userId) {
    const { data, error } = await supabase
      .from('Favorite')
      .select('*')
      .eq('userId', userId)
      .order('addedAt', { ascending: false });

    if (data) {
      favoritesData = data.map(f => ({
        id: f.mangaId,
        title: f.title,
        cover: f.cover,
        genre: f.genre,
        type: f.type,
        addedAt: f.addedAt
      }));
      renderFavorites();
      updateFavoritesPreview();
    }
  }

  async function loadHistory(userId) {
    const { data, error } = await supabase
      .from('History')
      .select('*')
      .eq('userId', userId)
      .order('lastReadAt', { ascending: false });

    if (data) {
      historyData = data.map(h => ({
        id: h.mangaId,
        title: h.title,
        cover: h.cover,
        genre: h.genre,
        type: h.type,
        lastChapter: h.lastChapter,
        lastReadAt: h.lastReadAt
      }));
      renderHistory();
    }
  }

  async function toggleFavorite(card) {
    if (!currentUser) {
      openModal('login');
      return;
    }

    const itemId = card.dataset.id;
    const title = card.dataset.title;
    const cover = card.dataset.cover;
    const genre = card.dataset.genre;
    const type = card.dataset.type;

    const isFav = favoritesData.some(f => f.id === itemId);

    try {
      if (isFav) {
        await supabase.from('Favorite').delete().eq('userId', currentUser.id).eq('mangaId', itemId);
      } else {
        await supabase.from('Favorite').insert({
          userId: currentUser.id,
          mangaId: itemId,
          title, cover, genre, type
        });
      }
      loadFavorites(currentUser.id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }

  async function saveToHistory(card) {
    if (!currentUser) {
      openModal('login');
      return;
    }

    const itemId = card.dataset.id;
    const title = card.dataset.title;
    const cover = card.dataset.cover;
    const genre = card.dataset.genre;
    const type = card.dataset.type;

    if (!itemId || !title) {
      console.warn('saveToHistory: missing card data', { itemId, title, cover, genre, type });
      return;
    }

    let lastChapter = '';
    const chapterEl = card.querySelector('.card-chapter, .novel-chapter');
    if (chapterEl) lastChapter = chapterEl.textContent;

    try {
      const { error } = await supabase.from('History').upsert({
        userId: currentUser.id,
        mangaId: itemId,
        title, cover, genre, type, lastChapter: lastChapter,
        lastReadAt: new Date().toISOString()
      }, { onConflict: 'userId,mangaId' });

      if (error) {
        console.error('History upsert error:', JSON.stringify(error));
        showToast('Gagal simpan history: ' + (error.message || error.details || error.code));
        return;
      }

      loadHistory(currentUser.id);
    } catch (err) {
      console.error('Error saving history:', err);
      showToast('Gagal simpan history: ' + (err.message || 'unknown'));
    }
  }

  async function clearAllHistory() {
    if (!currentUser || historyData.length === 0) return;

    try {
      await supabase.from('History').delete().eq('userId', currentUser.id);
      loadHistory(currentUser.id);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }

  function renderFavorites() {
    if (!favoritesData.length) {
      favoritesGrid.innerHTML = '';
      favoritesGrid.style.display = 'none';
      favoritesEmpty.style.display = 'flex';
      return;
    }

    favoritesGrid.style.display = 'grid';
    favoritesEmpty.style.display = 'none';

    favoritesGrid.innerHTML = favoritesData.map(item => `
      <div class="fav-card" data-id="${item.id}">
        <div class="fav-cover">
          <img src="${item.cover}" alt="${item.title}">
          <span class="fav-type-badge">${item.type === 'manga' ? 'Manga' : 'Novel'}</span>
          <button class="btn-remove-fav" data-id="${item.id}" aria-label="Remove from favorites">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
        </div>
        <div class="fav-info">
          <h3 class="fav-title">${item.title}</h3>
          <span class="fav-genre">${item.genre}</span>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.btn-remove-fav').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        try {
          await supabase.from('Favorite').delete().eq('userId', currentUser.id).eq('mangaId', id);
          loadFavorites(currentUser.id);
        } catch (error) {
          console.error('Error removing favorite:', error);
        }
      });
    });
  }

  function renderHistory() {
    if (!historyData.length) {
      historyList.innerHTML = '';
      historyList.style.display = 'none';
      historyEmpty.style.display = 'flex';
      return;
    }

    historyList.style.display = 'flex';
    historyEmpty.style.display = 'none';

    historyList.innerHTML = historyData.map(item => `
      <div class="card-history" data-id="${item.id}">
        <div class="history-cover">
          <img src="${item.cover}" alt="${item.title}">
          <span class="history-type-badge">${item.type === 'manga' ? 'Manga' : 'Novel'}</span>
        </div>
        <div class="history-info">
          <h3 class="history-title">${item.title}</h3>
          <span class="history-genre">${item.genre}</span>
          <div class="history-meta">
            ${item.lastChapter ? `<span class="history-chapter">Terakhir: ${item.lastChapter}</span>` : ''}
            <span class="history-time">${timeAgo(item.lastReadAt)}</span>
          </div>
          <button class="btn-continue-read" data-title="${item.title}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Lanjut Baca
          </button>
        </div>
        <button class="btn-remove-history" data-id="${item.id}" aria-label="Remove from history">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>
    `).join('');

    document.querySelectorAll('.btn-remove-history').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        try {
          await supabase.from('History').delete().eq('userId', currentUser.id).eq('mangaId', id);
          loadHistory(currentUser.id);
        } catch (error) {
          console.error('Error removing history:', error);
        }
      });
    });
  }

  function timeAgo(isoString) {
    const now = new Date();
    const past = new Date(isoString);
    const seconds = Math.floor((now - past) / 1000);

    if (seconds < 60) return 'Baru saja';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} hari lalu`;
    return past.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
      }
    }, 3000);
  }

  async function handleEmailAuth(e) {
    e.preventDefault();
    hideError();
    btnSubmit.disabled = true;
    btnSubmit.textContent = isRegisterMode ? 'Mendaftar...' : 'Logging in...';

    try {
      if (isRegisterMode) {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail.value,
          password: authPassword.value,
          options: {
            data: {
              displayName: authName.value || authEmail.value.split('@')[0]
            }
          }
        });
        if (error) throw error;

        if (data.user) {
          if (data.user.identities && data.user.identities.length === 0) {
            showError('Email sudah terdaftar. Silakan login.');
          } else if (!data.session) {
            showError('Cek email kamu untuk verifikasi akun dulu ya!');
          } else {
            closeModal();
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail.value,
          password: authPassword.value
        });
        if (error) throw error;
        closeModal();
      }
    } catch (error) {
      const msg = error.message || '';
      if (msg.includes('Invalid login credentials')) {
        showError('Email atau password salah.');
      } else if (msg.includes('Email not confirmed')) {
        showError('Email belum diverifikasi. Cek inbox kamu ya!');
      } else if (msg.includes('Password should be at least 6 characters')) {
        showError('Password minimal 6 karakter.');
      } else if (msg.includes('already registered') || msg.includes('already exists')) {
        showError('Email sudah terdaftar. Silakan login.');
      } else if (msg.includes('rate_limit') || msg.includes('too many requests')) {
        showError('Terlalu banyak percobaan. Coba lagi nanti.');
      } else {
        showError(msg || 'Terjadi kesalahan. Coba lagi.');
      }
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.textContent = isRegisterMode ? 'Daftar' : 'Login';
    }
  }

  async function handleDiscordSignIn() {
    btnGoogleSignin.disabled = true;
    btnGoogleSignin.textContent = 'Loading...';
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      const msg = error.message || error.msg || error.description || '';
      if (msg.includes('provider is not enabled')) {
        showError('Login Discord belum diaktifkan di Supabase.');
      } else if (msg.includes('popup')) {
        showError('Popup login ditutup. Coba lagi.');
      } else {
        showError(msg || 'Gagal login dengan Discord. Coba lagi.');
      }
    } finally {
      btnGoogleSignin.disabled = false;
      btnGoogleSignin.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1 1.873.892.077.077 0 0 1-.041.107 11.633 11.633 0 0 1-1.226 1.994.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
        Continue with Discord
      `;
    }
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      dropdownMenu.classList.remove('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      showError('Gagal logout.');
    }
  }

  function openEditProfileModal() {
    editProfileModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    editProfileError.style.display = 'none';
    avatarUploadInput.value = '';
    loadProfileData();
  }

  function closeEditProfileModal() {
    editProfileModal.classList.remove('active');
    document.body.style.overflow = '';
    editProfileError.style.display = 'none';
  }

  async function loadProfileData() {
    if (!currentUser) return;
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .eq('id', currentUser.id)
      .single();

    if (data) {
      profileBio.value = data.bio || '';
      bioCharCount.textContent = (data.bio || '').length;
      selectedAvatarPath = data.selectedAvatar || null;
      document.querySelectorAll('.avatar-option').forEach(img => {
        img.classList.remove('avatar-selected');
        if (img.dataset.avatar === selectedAvatarPath) {
          img.classList.add('avatar-selected');
        }
      });
      updateProfilePhotoPreview(selectedAvatarPath);
    }
  }

  function updateProfilePhotoPreview(path) {
    if (path) {
      profilePhotoImg.src = path;
      profilePhotoImg.style.display = 'block';
      profilePhotoPlaceholder.style.display = 'none';
      btnRemovePhoto.style.display = 'inline-flex';
    } else {
      profilePhotoImg.style.display = 'none';
      profilePhotoPlaceholder.style.display = 'flex';
      btnRemovePhoto.style.display = 'none';
    }
  }

  profileBio.addEventListener('input', () => {
    bioCharCount.textContent = profileBio.value.length;
    if (profileBio.value.length > 150) {
      profileBio.value = profileBio.value.substring(0, 150);
    }
  });

  async function saveProfile() {
    if (!currentUser) return;
    saveProfileBtn.disabled = true;
    saveProfileBtn.textContent = 'Menyimpan...';
    try {
      const bio = profileBio.value.substring(0, 150);
      const updates = { bio, selectedAvatar: selectedAvatarPath || null };
      const { error } = await supabase
        .from('User')
        .update(updates)
        .eq('id', currentUser.id);
      if (error) throw error;

      await loadUserData(currentUser);
      closeEditProfileModal();
    } catch (error) {
      const msg = error.message || error.error || '';
      if (msg.includes('policy') || msg.includes('permission') || msg.includes('row-level')) {
        editProfileError.textContent = 'RLS Policy di tabel User belum disetup. Jalankan setup-rls.sql di Supabase SQL Editor.';
      } else {
        editProfileError.textContent = msg || 'Gagal menyimpan profil.';
      }
      editProfileError.style.display = 'block';
      editProfileError.style.color = '#dc2626';
    } finally {
      saveProfileBtn.disabled = false;
      saveProfileBtn.textContent = 'Simpan';
    }
  }

  async function uploadAvatar(file) {
    if (!currentUser || isUploadingPhoto) return;
    isUploadingPhoto = true;
    const originalContent = btnUploadPhoto.innerHTML;
    btnUploadPhoto.innerHTML = '<span class="spinner"></span> Uploading...';
    btnUploadPhoto.className = 'upload-loading';
    btnUploadPhoto.disabled = true;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser.id}-${Date.now()}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('Avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        const msg = uploadError.message || uploadError.error || '';
        if (msg.includes('bucket') || msg.includes('not found')) {
          throw new Error('Storage bucket "Avatars" belum dibuat. Buat di Supabase Dashboard > Storage > New bucket.');
        }
        if (msg.includes('policy') || msg.includes('permission') || msg.includes('not authorized') || msg.includes('violates row-level') || msg.includes('row-level security') || (uploadError.statusCode && uploadError.statusCode >= 400)) {
          throw new Error('Storage RLS Policy belum disetup. Jalankan setup-storage.sql di Supabase SQL Editor, lalu set bucket "Avatars" jadi public di Dashboard.');
        }
        throw new Error(msg || 'Gagal upload foto ke storage.');
      }

      const { data: urlData } = supabase.storage
        .from('Avatars')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      selectedAvatarPath = publicUrl;
      document.querySelectorAll('.avatar-option').forEach(a => a.classList.remove('avatar-selected'));
      updateProfilePhotoPreview(publicUrl);
    } catch (error) {
      editProfileError.textContent = error.message || 'Gagal upload foto.';
      editProfileError.style.display = 'block';
      editProfileError.style.color = '#dc2626';
    } finally {
      isUploadingPhoto = false;
      btnUploadPhoto.innerHTML = originalContent;
      btnUploadPhoto.className = 'btn-upload-photo';
      btnUploadPhoto.disabled = false;
      avatarUploadInput.value = '';
    }
  }

  function updateDropdownUI() {
    updateFavoritesPreview();
  }

  function updateFavoritesPreview() {
    if (!favoritesData || favoritesData.length === 0) {
      dropdownFavPreview.innerHTML = '<p style="font-size:12px;color:#666;text-align:center;">Belum ada favorit</p>';
      return;
    }
    const top3 = favoritesData.slice(0, 3);
    dropdownFavPreview.innerHTML = top3.map(fav => `
      <div class="fav-preview-item" style="display:flex;align-items:center;gap:8px;margin:8px 0;cursor:pointer;" data-id="${fav.id}">
        <img src="${fav.cover}" alt="${fav.title}" style="width:40px;height:40px;object-fit:cover;border-radius:4px;">
        <span style="font-size:12px;color:#333;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${fav.title}</span>
      </div>
    `).join('');
    dropdownFavPreview.querySelectorAll('.fav-preview-item').forEach(item => {
      item.addEventListener('click', () => {
        document.getElementById('favorites').scrollIntoView({ behavior: 'smooth' });
        dropdownMenu.classList.remove('active');
      });
    });
  }

  btnLogin.addEventListener('click', () => openModal('login'));
  modalClose.addEventListener('click', closeModal);
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) closeModal();
  });
  authForm.addEventListener('submit', handleEmailAuth);
  btnGoogleSignin.style.display = 'flex';
  btnGoogleSignin.addEventListener('click', handleDiscordSignIn);
  btnLogout.addEventListener('click', handleLogout);

  if (btnEditProfile) {
    btnEditProfile.addEventListener('click', () => {
      openEditProfileModal();
      dropdownMenu.classList.remove('active');
    });
  }
  editProfileClose.addEventListener('click', closeEditProfileModal);
  editProfileModal.addEventListener('click', (e) => {
    if (e.target === editProfileModal) closeEditProfileModal();
  });
  saveProfileBtn.addEventListener('click', saveProfile);
  cancelProfileBtn.addEventListener('click', closeEditProfileModal);

  document.querySelectorAll('.avatar-option').forEach(avatar => {
    avatar.addEventListener('click', () => {
      document.querySelectorAll('.avatar-option').forEach(a => a.classList.remove('avatar-selected'));
      avatar.classList.add('avatar-selected');
      selectedAvatarPath = avatar.dataset.avatar;
      updateProfilePhotoPreview(selectedAvatarPath);
    });
  });

  btnUploadPhoto.addEventListener('click', () => {
    avatarUploadInput.click();
  });

  avatarUploadInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      editProfileError.textContent = 'Ukuran foto maksimal 2MB.';
      editProfileError.style.display = 'block';
      avatarUploadInput.value = '';
      return;
    }
    editProfileError.style.display = 'none';
    await uploadAvatar(file);
  });

  btnRemovePhoto.addEventListener('click', () => {
    selectedAvatarPath = null;
    document.querySelectorAll('.avatar-option').forEach(a => a.classList.remove('avatar-selected'));
    updateProfilePhotoPreview(null);
  });

  btnUser.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!userMenu.contains(e.target)) {
      dropdownMenu.classList.remove('active');
    }
  });

  btnTogglePassword.addEventListener('click', () => {
    const type = authPassword.type === 'password' ? 'text' : 'password';
    authPassword.type = type;
    btnTogglePassword.querySelector('.eye-open').style.display = type === 'password' ? 'block' : 'none';
    btnTogglePassword.querySelector('.eye-closed').style.display = type === 'password' ? 'none' : 'block';
  });

  document.addEventListener('click', (e) => {
    const favBtn = e.target.closest('.btn-favorite, .btn-favorite-novel');
    if (favBtn) {
      e.stopPropagation();
      const card = favBtn.closest('.card-manga, .card-novel');
      if (card) toggleFavorite(card);
    }
  });

  document.addEventListener('click', async (e) => {
    const readBtn = e.target.closest('.btn-read');
    if (readBtn) {
      e.stopPropagation();
      const card = readBtn.closest('.card-manga');
      if (card) {
        if (!currentUser) {
          openModal('login');
          return;
        }
        await saveToHistory(card);
        const title = card.dataset.title;
        const cover = card.dataset.cover;
        const chapter = card.querySelector('.card-chapter')?.textContent || '';
        openMangaReader(title, cover, chapter);
      }
    }
  });

  document.addEventListener('click', async (e) => {
    const novelReadBtn = e.target.closest('.volume-btn');
    if (novelReadBtn) {
      const card = novelReadBtn.closest('.card-novel');
      if (!currentUser) {
        e.preventDefault();
        openModal('login');
        return;
      }
      await saveToHistory(card);
    }
  });

  function openMangaReader(title, cover, chapter) {
    const readerOverlay = document.createElement('div');
    readerOverlay.className = 'reader-overlay';
    readerOverlay.innerHTML = `
      <div class="reader-container">
        <div class="reader-header">
          <div class="reader-title">
            <img src="${cover}" alt="${title}" class="reader-thumb">
            <div>
              <h3>${title}</h3>
              <span>${chapter}</span>
            </div>
          </div>
          <button class="reader-close" aria-label="Close reader">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="reader-body">
          <div class="reader-placeholder">
            <div class="reader-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <h2>${title}</h2>
            <p>Reader manga sedang dalam pengembangan. Stay tuned!</p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(readerOverlay);
    document.body.style.overflow = 'hidden';

    const closeBtn = readerOverlay.querySelector('.reader-close');
    const closeReader = () => {
      readerOverlay.remove();
      document.body.style.overflow = '';
    };
    closeBtn.addEventListener('click', closeReader);
    readerOverlay.addEventListener('click', (e) => {
      if (e.target === readerOverlay) closeReader();
    });
  }

  btnClearHistory.addEventListener('click', clearAllHistory);

  dropdownFavorites.addEventListener('click', (e) => {
    e.preventDefault();
    dropdownMenu.classList.remove('active');
    showFavoritesPage();
  });

  document.getElementById('dropdown-history').addEventListener('click', (e) => {
    e.preventDefault();
    dropdownMenu.classList.remove('active');
    showHistoryPage();
  });

  navFavorites.addEventListener('click', (e) => {
    e.preventDefault();
    showFavoritesPage();
  });

  navHistory.addEventListener('click', (e) => {
    e.preventDefault();
    showHistoryPage();
  });

  navPolling.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    showPollingPage();
  });

  function showFavoritesPage() {
    if (!currentUser) {
      openModal('login');
      return;
    }
    hideAllSections();
    favoritesSection.style.display = 'block';
    navLinks.forEach(l => l.classList.remove('active'));
    navFavorites.classList.add('active');
    loadFavorites(currentUser.id);
    window.scrollTo({ top: favoritesSection.offsetTop - 80, behavior: 'smooth' });
  }

  function showHistoryPage() {
    if (!currentUser) {
      openModal('login');
      return;
    }
    hideAllSections();
    historySection.style.display = 'block';
    navLinks.forEach(l => l.classList.remove('active'));
    navHistory.classList.add('active');
    loadHistory(currentUser.id);
    window.scrollTo({ top: historySection.offsetTop - 80, behavior: 'smooth' });
  }

  function showPollingPage() {
    hideAllSections();
    pollingSection.style.display = 'block';
    navLinks.forEach(l => l.classList.remove('active'));
    navPolling.classList.add('active');
    pollingGrid.innerHTML = '';
    pollingEmpty.style.display = 'none';
    pollingResults.style.display = 'none';
    loadPollResults();
    window.scrollTo({ top: pollingSection.offsetTop - 80, behavior: 'smooth' });
  }

  async function loadPollResults() {
    pollingEmpty.style.display = 'none';
    pollingResults.style.display = 'none';

    let votes = null;
    try {
      const result = await supabase
        .from('PollVote')
        .select('characterId, userId');
      votes = result.data;
      if (result.error) {
        console.error('PollVote select error:', result.error);
        pollingEmpty.style.display = 'block';
        return;
      }
    } catch (err) {
      console.error('PollVote fetch failed:', err);
      pollingEmpty.style.display = 'block';
      return;
    }

    const voteCount = {};
    let userVote = null;
    let totalVotes = 0;

    if (votes) {
      votes.forEach(v => {
        voteCount[v.characterId] = (voteCount[v.characterId] || 0) + 1;
        totalVotes++;
        if (currentUser && v.userId === currentUser.id) {
          userVote = v.characterId;
        }
      });
    }

    const sorted = [...characters].sort((a, b) => (voteCount[b.id] || 0) - (voteCount[a.id] || 0));
    const maxVotes = Math.max(...Object.values(voteCount), 1);

    pollingGrid.innerHTML = characters.map(char => {
      const count = voteCount[char.id] || 0;
      const isVoted = userVote === char.id;
      return `
        <div class="polling-card ${isVoted ? 'polling-card-voted' : ''}">
          <div class="polling-card-cover">
            <img src="${char.image}" alt="${char.name}" loading="lazy">
            ${isVoted ? '<span class="polling-badge-voted">Dipilih</span>' : ''}
          </div>
          <div class="polling-card-info">
            <h3 class="polling-card-name">${char.name}</h3>
            <span class="polling-card-votes">${count} suara</span>
            <button class="polling-vote-btn ${isVoted ? 'polling-voted' : ''}"
              data-char-id="${char.id}"
              ${isVoted || userVote ? 'disabled' : ''}>
              ${isVoted ? 'Sudah Dipilih' : userVote ? 'Vote' : 'Vote'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    document.querySelectorAll('.polling-vote-btn:not(:disabled)').forEach(btn => {
      btn.addEventListener('click', () => voteCharacter(btn.dataset.charId));
    });

    if (totalVotes > 0) {
      pollingResults.style.display = 'block';
      pollingTotalVotes.textContent = `${totalVotes} suara`;
      pollingResultsList.innerHTML = sorted.map((char, index) => {
        const count = voteCount[char.id] || 0;
        const pct = Math.round((count / maxVotes) * 100);
        const medals = ['🥇', '🥈', '🥉'];
        const rank = index < 3 ? medals[index] : `#${index + 1}`;
        return `
          <div class="polling-result-item">
            <div class="polling-result-rank">${rank}</div>
            <div class="polling-result-info">
              <span class="polling-result-name">${char.name}</span>
              <span class="polling-result-count">${count} suara</span>
            </div>
            <div class="polling-result-bar-track">
              <div class="polling-result-bar" style="width: ${pct}%"></div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      pollingResults.style.display = 'none';
    }
  }

  async function voteCharacter(charId) {
    if (!currentUser) {
      openModal('login');
      return;
    }

    const char = characters.find(c => c.id === charId);
    if (!char) return;

    try {
      const { error } = await supabase.from('PollVote').insert({
        userId: currentUser.id,
        characterId: charId
      });

      if (error) {
        if (error.code === '23505') {
          showToast('Kamu sudah memilih!');
        } else {
          showToast('Gagal vote, coba lagi.');
        }
        return;
      }

      showToast(`Kamu berhasil memilih ${char.name}!`);
      loadPollResults();
    } catch (err) {
      showToast('Terjadi kesalahan, coba lagi.');
    }
  }

  // ─── RATING SYSTEM ───
  let ratingsCache = {};

  async function loadAllRatings() {
    const { data } = await supabase.from('Rating').select('*');
    ratingsCache = {};
    if (data) {
      data.forEach(r => {
        const key = r.mangaId;
        if (!ratingsCache[key]) ratingsCache[key] = { total: 0, count: 0, userRating: 0 };
        ratingsCache[key].total += r.rating;
        ratingsCache[key].count++;
        if (currentUser && r.userId === currentUser.id) ratingsCache[key].userRating = r.rating;
      });
    }
    renderAllRatings();
  }

  function renderAllRatings() {
    document.querySelectorAll('.card-manga, .card-novel').forEach(card => renderRatingCard(card));
  }

  function renderRatingCard(card) {
    const itemId = card.dataset.id;
    if (!itemId) return;
    const info = ratingsCache[itemId] || { total: 0, count: 0, userRating: 0 };
    const avg = info.count > 0 ? Math.round(info.total / info.count) : 0;
    const starStr = [1,2,3,4,5].map(i =>
      `<span class="star ${i <= (info.userRating || avg) ? 'filled' : ''}" data-value="${i}">★</span>`
    ).join('');
    const existing = card.querySelector('.rating-row');
    if (existing) existing.remove();
    const row = document.createElement('div');
    row.className = 'rating-row';
    row.innerHTML = `<span class="stars ${currentUser ? 'interactive' : ''}">${starStr}</span>${avg > 0 ? '<span class="rating-avg">' + (info.total/info.count).toFixed(1) + '</span><span class="rating-count">(' + info.count + ')</span>' : '<span class="rating-count">no ratings</span>'}`;
    card.querySelector('.card-info')?.appendChild(row);
  }

  document.addEventListener('click', async (e) => {
    if (!currentUser) return;
    const starEl = e.target.closest('.star');
    if (!starEl || !starEl.parentElement?.classList.contains('interactive')) return;
    const card = starEl.closest('.card-manga, .card-novel');
    if (!card) return;
    const itemId = card.dataset.id;
    const rating = parseInt(starEl.dataset.value);
    if (!itemId || !rating) return;
    try {
      await supabase.from('Rating').upsert({ userId: currentUser.id, mangaId: itemId, rating }, { onConflict: 'userId,mangaId' });
      await loadAllRatings();
    } catch (err) { console.error('Rating error:', err); }
  });

  // ─── REVIEW SYSTEM ───
  let currentReviewMangaId = '';
  let currentReviewMangaTitle = '';
  const reviewModal = document.getElementById('review-modal');
  const reviewClose = document.getElementById('review-close');
  const reviewList = document.getElementById('review-list');
  const reviewInput = document.getElementById('review-input');
  const reviewSubmit = document.getElementById('review-submit');
  const reviewEmpty = document.getElementById('review-empty');
  const reviewMangaTitle = document.getElementById('review-manga-title');

  async function loadReviews(mangaId) {
    const { data } = await supabase.from('Review').select('*').eq('mangaId', mangaId).order('createdAt', { ascending: false });
    if (data && data.length > 0) {
      reviewEmpty.style.display = 'none';
      reviewList.style.display = 'flex';
      reviewList.innerHTML = data.map(r => `<div class="review-item"><div class="review-header"><span class="review-user">${escapeHTML(r.userName)}</span><span class="review-time">${timeAgo(r.createdAt)}</span></div><p class="review-text">${escapeHTML(r.text)}</p></div>`).join('');
    } else { reviewEmpty.style.display = 'block'; reviewList.style.display = 'none'; }
  }

  function openReviewModal(mangaId, mangaTitle) {
    if (!currentUser) { openModal('login'); return; }
    currentReviewMangaId = mangaId;
    currentReviewMangaTitle = mangaTitle || 'Unknown';
    reviewMangaTitle.textContent = currentReviewMangaTitle;
    reviewInput.value = '';
    loadReviews(mangaId);
    reviewModal.classList.add('active');
  }

  reviewClose.addEventListener('click', () => reviewModal.classList.remove('active'));
  reviewModal.addEventListener('click', (e) => { if (e.target === reviewModal) reviewModal.classList.remove('active'); });

  reviewSubmit.addEventListener('click', async () => {
    const text = reviewInput.value.trim();
    if (!text || text.length < 3) { showToast('Komentar minimal 3 karakter.'); return; }
    if (text.length > 300) { showToast('Maksimal 300 karakter.'); return; }
    reviewSubmit.disabled = true;
    reviewSubmit.textContent = '...';
    try {
      const { error } = await supabase.from('Review').insert({ userId: currentUser.id, userName: currentUser.user_metadata?.displayName || currentUser.email?.split('@')[0] || 'Anon', mangaId: currentReviewMangaId, mangaTitle: currentReviewMangaTitle, text });
      if (error) throw error;
      reviewInput.value = '';
      await loadReviews(currentReviewMangaId);
      showToast('Komentar terkirim!');
    } catch (err) { showToast('Gagal kirim komentar.'); }
    finally { reviewSubmit.disabled = false; reviewSubmit.textContent = 'Kirim'; }
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-review');
    if (btn) { const card = btn.closest('.card-manga, .card-novel'); if (card) openReviewModal(card.dataset.id, card.dataset.title); }
  });

  loadAllRatings();

  // ─── EXCLUSIVE MANGA SYSTEM ───
  const navExclusive = document.getElementById('nav-exclusive');
  const exclusiveSection = document.getElementById('exclusive');
  const exclusiveGrid = document.getElementById('exclusive-grid');
  const btnAdminPanel = document.getElementById('btn-admin-panel');
  const adminModal = document.getElementById('admin-modal');
  const adminModalClose = document.getElementById('admin-modal-close');
  const adminUserEmail = document.getElementById('admin-user-email');
  const adminAccessList = document.getElementById('admin-access-list');
  const adminAccessEmpty = document.getElementById('admin-access-empty');
  const adminError = document.getElementById('admin-error');
  const adminGrantBtn = document.getElementById('admin-grant-btn');

  let hasExclusiveAccess = false;
  const exclusiveMangas = [
    { id: 'haraguro-sister', title: 'Haraguro Sister x Kusogaki', cover: 'Cover/cover3.jpeg', genre: 'Mature, Romance', chapter: 'Full', pdf: 'https://nhubpjovnpwadaxxsqyt.supabase.co/storage/v1/object/public/files/haraguro-sister.pdf' }
  ];

  async function loadExclusiveAccess() {
    if (!currentUser) { hasExclusiveAccess = false; renderExclusiveUI(); return; }
    const { data } = await supabase.from('ExclusiveAccess').select('mangaId').eq('userId', currentUser.id);
    hasExclusiveAccess = data && data.length > 0;
    renderExclusiveUI();
  }

  function renderExclusiveUI() {
    if (hasExclusiveAccess) {
      navExclusive.style.display = 'inline-block';
      exclusiveSection.style.display = 'block';
      exclusiveGrid.innerHTML = exclusiveMangas.map(m => `
        <div class="card-manga" data-id="${m.id}" data-title="${m.title}" data-cover="${m.cover}" data-genre="${m.genre}" data-type="manga">
          <div class="card-cover">
            <img loading="lazy" decoding="async" src="${m.cover}" alt="${m.title}">
            <span class="card-badge badge-new">EXCLUSIVE</span>
            <div class="card-overlay">
              <button class="btn-favorite" aria-label="Add to favorites"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></button>
              <button class="btn-review"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></button>
              <a href="${m.pdf}" target="_blank" class="btn-read">Baca</a>
            </div>
          </div>
          <div class="card-info">
            <span class="card-genre">${m.genre}</span>
            <h3 class="card-title">${m.title}</h3>
            <span class="card-chapter">${m.chapter}</span>
          </div>
        </div>
      `).join('');
      loadAllRatings();
    } else {
      navExclusive.style.display = 'none';
      exclusiveSection.style.display = 'none';
      exclusiveGrid.innerHTML = '';
    }
  }

  navExclusive.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllSections();
    exclusiveSection.style.display = 'block';
    navLinks.forEach(l => l.classList.remove('active'));
    navExclusive.classList.add('active');
    window.scrollTo({ top: exclusiveSection.offsetTop - 80, behavior: 'smooth' });
  });

  // ─── ADMIN PANEL ───
  async function loadAdminAccess() {
    const { data } = await supabase.from('ExclusiveAccess').select('*, User:userId(email)').order('grantedAt', { ascending: false });
    if (data && data.length > 0) {
      adminAccessEmpty.style.display = 'none';
      adminAccessList.style.display = 'flex';
      adminAccessList.innerHTML = data.map(a => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--bg-light); border-radius: 8px;">
          <span style="font-size: 0.85rem; font-weight: 600;">${a.User?.email || a.userId}</span>
          <button class="btn-revoke" data-id="${a.id}" style="padding: 4px 12px; border-radius: 20px; background: rgba(220,38,38,0.1); color: #dc2626; font-size: 0.75rem; font-weight: 700; cursor: pointer;">Hapus</button>
        </div>
      `).join('');
    } else {
      adminAccessEmpty.style.display = 'block';
      adminAccessList.style.display = 'none';
    }
  }

  btnAdminPanel.addEventListener('click', async () => {
    if (!currentUserProfile || !currentUserProfile.isAdmin) return;
    adminModal.classList.add('active');
    adminUserEmail.value = '';
    adminError.style.display = 'none';
    await loadAdminAccess();
  });

  adminModalClose.addEventListener('click', () => adminModal.classList.remove('active'));
  adminModal.addEventListener('click', (e) => { if (e.target === adminModal) adminModal.classList.remove('active'); });

  adminGrantBtn.addEventListener('click', async () => {
    const email = adminUserEmail.value.trim();
    if (!email) { adminError.textContent = 'Masukkan email user.'; adminError.style.display = 'block'; return; }
    adminGrantBtn.disabled = true;
    adminGrantBtn.textContent = 'Memproses...';
    adminError.style.display = 'none';
    try {
      const { data: user, error: uErr } = await supabase.from('User').select('id').eq('email', email).single();
      if (uErr || !user) { adminError.textContent = 'User tidak ditemukan.'; adminError.style.display = 'block'; return; }
      for (const m of exclusiveMangas) {
        await supabase.from('ExclusiveAccess').upsert({
          userId: user.id, mangaId: m.id, mangaTitle: m.title,
          grantedBy: currentUser.id
        }, { onConflict: 'userId,mangaId' });
      }
      adminUserEmail.value = '';
      await loadAdminAccess();
      showToast('Akses exclusive diberikan!');
    } catch (err) {
      adminError.textContent = 'Gagal memberikan akses.';
      adminError.style.display = 'block';
    } finally {
      adminGrantBtn.disabled = false;
      adminGrantBtn.textContent = 'Grant Exclusive Access';
    }
  });

  document.addEventListener('click', async (e) => {
    const revokeBtn = e.target.closest('.btn-revoke');
    if (revokeBtn) {
      const id = revokeBtn.dataset.id;
      await supabase.from('ExclusiveAccess').delete().eq('id', id);
      await loadAdminAccess();
      showToast('Akses dihapus!');
    }
  });

  // ─── BROADCAST / NOTIFICATION SYSTEM ───
  const btnBell = document.getElementById('btn-bell');
  const bellBadge = document.getElementById('bell-badge');
  const broadcastModalEl = document.getElementById('broadcast-modal');
  const broadcastCloseEl = document.getElementById('broadcast-close');
  const broadcastListEl = document.getElementById('broadcast-list');
  const broadcastEmptyEl = document.getElementById('broadcast-empty');
  const broadcastFormEl = document.getElementById('broadcast-form');
  const broadcastTitleEl = document.getElementById('broadcast-title');
  const broadcastMessageEl = document.getElementById('broadcast-message');
  const broadcastSendEl = document.getElementById('broadcast-send');
  const broadcastErrorEl = document.getElementById('broadcast-error');

  let broadcastsData = [];
  let readIds = JSON.parse(localStorage.getItem('broadcast_read') || '[]');

  async function loadBroadcasts() {
    const { data } = await supabase.from('Broadcast').select('*').order('createdAt', { ascending: false }).limit(20);
    broadcastsData = data || [];
    const unread = broadcastsData.filter(b => !readIds.includes(b.id)).length;
    bellBadge.textContent = unread;
    bellBadge.dataset.count = unread;
    bellBadge.style.display = unread > 0 ? 'flex' : 'none';
  }

  function markAllRead() {
    broadcastsData.forEach(b => { if (!readIds.includes(b.id)) readIds.push(b.id); });
    localStorage.setItem('broadcast_read', JSON.stringify(readIds));
    bellBadge.textContent = '0';
    bellBadge.dataset.count = '0';
    bellBadge.style.display = 'none';
    renderBroadcastList();
  }

  function renderBroadcastList() {
    if (broadcastsData.length === 0) {
      broadcastListEl.innerHTML = '';
      broadcastEmptyEl.style.display = 'block';
    } else {
      broadcastEmptyEl.style.display = 'none';
      broadcastListEl.innerHTML = broadcastsData.map(b => {
        const isUnread = !readIds.includes(b.id);
        return `<div class="broadcast-item ${isUnread ? 'unread' : ''}">
          <div class="broadcast-title">${escapeHTML(b.title)}</div>
          <div class="broadcast-message">${escapeHTML(b.message)}</div>
          <div class="broadcast-time">${timeAgo(b.createdAt)}</div>
        </div>`;
      }).join('');
    }
  }

  function openBroadcastModal() {
    renderBroadcastList();
    broadcastFormEl.style.display = (currentUserProfile && currentUserProfile.isAdmin) ? 'block' : 'none';
    broadcastModalEl.classList.add('active');
    markAllRead();
  }

  broadcastCloseEl.addEventListener('click', () => broadcastModalEl.classList.remove('active'));
  broadcastModalEl.addEventListener('click', (e) => { if (e.target === broadcastModalEl) broadcastModalEl.classList.remove('active'); });

  btnBell.addEventListener('click', () => {
    if (!currentUser) { openModal('login'); return; }
    openBroadcastModal();
  });

  broadcastSendEl.addEventListener('click', async () => {
    const title = broadcastTitleEl.value.trim();
    const message = broadcastMessageEl.value.trim();
    if (!title || !message) {
      broadcastErrorEl.textContent = 'Judul dan pesan harus diisi.';
      broadcastErrorEl.style.display = 'block';
      return;
    }
    broadcastSendEl.disabled = true;
    broadcastSendEl.textContent = 'Mengirim...';
    broadcastErrorEl.style.display = 'none';
    try {
      const { error } = await supabase.from('Broadcast').insert({
        adminId: currentUser.id,
        title: title,
        message: message
      });
      if (error) throw error;
      broadcastTitleEl.value = '';
      broadcastMessageEl.value = '';
      await loadBroadcasts();
      renderBroadcastList();
      showToast('Broadcast terkirim ke semua user!');
    } catch (err) {
      broadcastErrorEl.textContent = 'Gagal mengirim broadcast.';
      broadcastErrorEl.style.display = 'block';
    } finally {
      broadcastSendEl.disabled = false;
      broadcastSendEl.textContent = 'Kirim Broadcast';
    }
  });

  loadBroadcasts();
  setInterval(loadBroadcasts, 60000);

  function hideAllSections() {
    document.querySelectorAll('section[id]').forEach(s => {
      s.style.display = 'none';
    });
    favoritesSection.style.display = 'none';
    historySection.style.display = 'none';
    searchResultsSection.style.display = 'none';
    pollingSection.style.display = 'none';
    exclusiveSection.style.display = 'none';
  }

  function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;

    const allCards = document.querySelectorAll('#manga .card-manga, #novel .card-novel');
    searchResultsGrid.innerHTML = '';
    let foundCount = 0;

    const queryWords = query.split(/\s+/).filter(w => w.length > 0);

    allCards.forEach(card => {
      const title = (card.dataset.title || '').toLowerCase();
      const genre = (card.dataset.genre || '').toLowerCase();
      const searchText = title + ' ' + genre;

      const matches = queryWords.every(word => searchText.includes(word));

      if (matches) {
        const clone = card.cloneNode(true);
        clone.style.opacity = '1';
        clone.style.transform = 'translateY(0)';
        clone.style.animation = 'none';
        if (card.classList.contains('card-novel')) {
          clone.style.gridColumn = '1 / -1';
        }
        searchResultsGrid.appendChild(clone);
        foundCount++;
      }
    });

    hideAllSections();
    searchResultsSection.style.display = 'block';
    navLinks.forEach(l => l.classList.remove('active'));
    window.scrollTo({ top: searchResultsSection.offsetTop - 80, behavior: 'smooth' });
    searchQueryTitle.textContent = `Hasil untuk "${searchInput.value}"`;

    if (foundCount > 0) {
      searchResultsGrid.style.display = 'grid';
      searchEmpty.style.display = 'none';
    } else {
      searchResultsGrid.style.display = 'none';
      searchEmpty.style.display = 'flex';
    }
  }

  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });
  btnBackHome.addEventListener('click', (e) => {
    e.preventDefault();
    searchResultsSection.style.display = 'none';
    document.querySelectorAll('section[id]').forEach(s => s.style.display = '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (['#home', '#manga', '#novel', '#features', '#search', '#polling'].includes(hash)) {
      document.querySelectorAll('section[id]').forEach(s => {
        s.style.display = '';
      });
    }
  });

  currentUser = null;
  btnLogin.style.display = 'block';
  btnBell.style.display = 'none';
  userMenu.style.display = 'none';
  dropdownFavorites.style.display = 'none';
  document.getElementById('dropdown-history').style.display = 'none';
  navFavorites.style.display = 'none';
  navHistory.style.display = 'none';
  navExclusive.style.display = 'none';
  btnAdminPanel.style.display = 'none';
  favoritesSection.style.display = 'none';
  historySection.style.display = 'none';
  pollingSection.style.display = 'none';

  supabase.auth.getSession().then(({ data: { session } }) => {
    updateUserUI(session?.user || null);
  });

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_OUT') {
      updateUserUI(null);
    } else if (event === 'SIGNED_IN') {
      const user = session?.user;
      if (user) {
        try {
          const { data } = await supabase.from('User').select('id').eq('id', user.id).single();
          if (!data) {
            await supabase.from('User').insert({
              id: user.id,
              email: user.email,
              displayName: user.user_metadata?.displayName || user.email?.split('@')[0]
            });
          }
        } catch (err) {
          console.error('Error creating user profile:', err);
        }
      }
      updateUserUI(user || null);
    } else if (event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
      updateUserUI(session?.user || null);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && authModal.classList.contains('active')) {
      closeModal();
    }
  });
});
