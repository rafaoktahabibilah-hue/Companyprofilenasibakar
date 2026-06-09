import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-client.js';

if (typeof pdfjsLib !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

document.addEventListener('DOMContentLoaded', () => {
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
  const btnGoogleSignin = document.getElementById('btn-google-signin');
  const btnDiscordSignin = document.getElementById('btn-discord-signin');
  const btnTogglePassword = document.getElementById('btn-toggle-password');
  const btnForgotPassword = document.getElementById('btn-forgot-password');

  const userMenu = document.getElementById('user-menu');
  const btnUser = document.getElementById('btn-user');
  const dropdownMenu = document.getElementById('dropdown-menu');
  const btnDarkMode = document.getElementById('btn-darkmode');
  const btnDashboardToggle = document.getElementById('btn-dashboard-toggle');
  const dashboardDropdown = document.getElementById('dashboard-dropdown');
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
  const displayName = document.getElementById('display-name').value;
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

  const genreSection = document.getElementById('genre');
  const genreChips = document.getElementById('genre-chips');
  const genreGrid = document.getElementById('genre-grid');
  const genrePrompt = document.getElementById('genre-prompt');
  const genreEmpty = document.getElementById('genre-empty');
  const genreActiveBadge = document.getElementById('genre-active-badge');
  const genreActiveTag = document.getElementById('genre-active-tag');
  const genreActiveClear = document.getElementById('genre-active-clear');
  const btnBackFromGenre = document.getElementById('btn-back-from-genre');
  let activeGenre = null;

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
  let likesData = [];
  let userUnsub = null;
  let currentDetailId = null;
  let currentDetailType = null;
  let commentPage = 0;

  const mangaDetailData = {
    'girls-und-panzer': {
      synopsis: 'Manga ini mengisahkan tentang Miho Nishizumi, seorang siswi yang berasal dari keluarga terkenal dalam dunia Sensha-do (seni bela diri menggunakan tank). Miho memutuskan untuk bergabung dengan Akademi Oarai yang tidak memiliki program Sensha-do, namun ternyata sekolahnya baru saja menghidupkan kembali klub tersebut. Bersama teman-temannya, Miho harus berjuang dalam turnamen Sensha-do sambil mengatasi trauma masa lalunya.',
      chapters: Array.from({length: 45}, (_, i) => ({num: i + 1, title: `Chapter ${i + 1}`, pages: 20 + (i % 3) * 5})),
    },
    'alya-russian': {
      synopsis: 'Mengisahkan tentang Alya, seorang gadis cantik keturunan Rusia yang sering melontarkan kata-kata manis dalam bahasa Rusia kepada teman sekelasnya, Masachika. Namun, Masachika diam-diam bisa memahami bahasa Rusia. Sebuah komedi romantis yang manis dan kocak.',
      chapters: Array.from({length: 62}, (_, i) => ({num: i + 1, title: `Chapter ${i + 1}`, pages: 22 + (i % 3) * 4})),
    },
    'azur-lane-vol2': {
      synopsis: 'Azur Lane: Queen Orders Volume 2 melanjutkan petualangan para ship girl dalam keseharian mereka di pangkalan angkatan laut. Berfokus pada Ratu Elizabeth dan teman-temannya dalam berbagai misi kocak dan seru.',
      chapters: Array.from({length: 38}, (_, i) => ({num: i + 1, title: `Chapter ${i + 1}`, pages: 18 + (i % 3) * 6})),
    },
    'bocchi-the-rock-vol1': {
      synopsis: 'Hitori "Bocchi" Gotoh adalah seorang gadis yang sangat pemalu namun bercita-cita menjadi musisi rock terkenal. Setelah bergabung dengan band Kessoku Band, ia harus mengatasi rasa canggungnya dan belajar bermain musik bersama teman-teman barunya.',
      chapters: Array.from({length: 42}, (_, i) => ({num: i + 1, title: `Chapter ${i + 1}`, pages: 20 + (i % 4) * 5})),
    },
    'bocchi-the-rock-vol5': {
      synopsis: 'Volume kelima dari kisah Bocchi the Rock! Petualangan Kessoku Band berlanjut dengan tantangan baru, konser baru, dan hubungan yang semakin akrab antar anggota band.',
      chapters: Array.from({length: 55}, (_, i) => ({num: i + 1, title: `Chapter ${i + 1}`, pages: 20 + (i % 3) * 6})),
    },
    'koisuru-otome': {
      synopsis: 'Kisah cinta seorang gadis yang berusaha mendapatkan perhatian pujaan hatinya dengan cara yang unik dan lucu. Komedi romantis yang menghangatkan hati.',
      chapters: Array.from({length: 24}, (_, i) => ({num: i + 1, title: `Chapter ${i + 1}`, pages: 25 + (i % 3) * 5})),
    },
    'ruri-dragon': {
      synopsis: 'Ruri adalah seorang gadis biasa yang tiba-tiba menyadari bahwa ia bisa berubah menjadi naga! Cerita slice of life yang unik tentang seorang gadis naga yang mencoba menjalani kehidupan sekolah normal.',
      chapters: Array.from({length: 20}, (_, i) => ({num: i + 1, title: `Chapter ${i + 1}`, pages: 22 + (i % 4) * 4})),
    },
    'ruri-dragon-vol2': {
      synopsis: 'Volume kedua dari petualangan Ruri si gadis naga. Kehidupannya semakin rumit ketika teman-temannya mulai mengetahui rahasianya.',
      chapters: Array.from({length: 40}, (_, i) => ({num: i + 1, title: `Chapter ${i + 1}`, pages: 20 + (i % 3) * 5})),
    },
    'dungeon-meshi': {
      synopsis: 'Cerita tentang Laios dan teman-temannya yang menjelajahi dungeon sambil memasak monster. Fantasy cooking adventure yang unik!',
      chapters: Array.from({length: 97}, (_, i) => ({num: i + 1, title: `Chapter ${i + 1}`, pages: 24 + (i % 5) * 4})),
    },
    'azur-lane-vol1': {
      synopsis: 'Volume pertama Azur Lane: Queen Orders. Perkenalan dengan para ship girl dan kehidupan mereka di pangkalan angkatan laut.',
      chapters: Array.from({length: 18}, (_, i) => ({num: i + 1, title: `Chapter ${i + 1}`, pages: 20 + (i % 3) * 5})),
    },
    're-zero': {
      synopsis: 'Subaru Natsuki dipanggil ke dunia lain dan mendapatkan kemampuan "Return by Death". Truth of Zero mengungkap misteri di balik dunia tersebut.',
      chapters: [
        {num: 1, title: 'Chapter 1', pages: 34, pdfStart: 1},
        {num: 2, title: 'Chapter 2', pages: 34, pdfStart: 35},
        {num: 3, title: 'Chapter 3', pages: 34, pdfStart: 69},
        {num: 4, title: 'Chapter 4', pages: 34, pdfStart: 103},
        {num: 5, title: 'Chapter 5', pages: 33, pdfStart: 137},
      ],
      pdf: 'https://nhubpjovnpwadaxxsqyt.supabase.co/storage/v1/object/public/files/re-zero.pdf',
    },
    'cote-vol1': {
      synopsis: 'Sekolah Menengah Atas Kodo Ikusei, sekolah prestisius dengan sistem kelas kejam. Kiyotaka Ayanokoji mulai menunjukkan kemampuan sejatinya.',
      chapters: [
        {num: 1, title: 'Volume 3', pages: 240},
      ],
      pdf: 'https://nhubpjovnpwadaxxsqyt.supabase.co/storage/v1/object/public/files/novel3.pdf',
    },
    'berserk': {
      synopsis: 'Guts, pendekar bayaran dengan pedang besar, memburu makhluk kegelapan di dunia abad pertengahan yang penuh kekerasan dan pengkhianatan.',
      chapters: [{num: 1, title: 'Volume 6', pages: 225}],
      pdf: 'https://nhubpjovnpwadaxxsqyt.supabase.co/storage/v1/object/public/files/berserk.pdf',
    }
  };

  document.addEventListener('error', function(e) {
    const target = e.target;
    if (target.tagName === 'IMG' && !target.closest('.reader-section')) {
      target.style.display = 'none';
      const parent = target.parentElement;
      if (parent && !parent.querySelector('.img-fallback')) {
        const fallback = document.createElement('div');
        fallback.className = 'img-fallback';
        fallback.innerHTML = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity:0.4"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
        parent.style.position = 'relative';
        parent.style.background = 'var(--bg-light)';
        parent.style.display = 'flex';
        parent.style.alignItems = 'center';
        parent.style.justifyContent = 'center';
        parent.appendChild(fallback);
      }
    }
  }, true);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
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
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        if (targetId === 'genre') {
          openGenrePage();
          return;
        }
        if (['home', 'manga', 'novel', 'features'].includes(targetId)) {
          document.querySelectorAll('section[id]').forEach(s => {
            if (s.id === 'manga-detail' || s.id === 'dashboard' || s.id === 'reader-page' || s.id === 'favorites' || s.id === 'history' || s.id === 'search-results' || s.id === 'polling' || s.id === 'genre') {
              s.style.display = 'none';
            } else {
              s.style.display = '';
            }
          });
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
      userMenu.style.display = 'block';
      dropdownFavorites.style.display = 'flex';
      document.getElementById('dropdown-history').style.display = 'flex';
      navFavorites.style.display = 'inline-block';
      navHistory.style.display = 'inline-block';
      loadUserData(user);
      loadFavorites(user.id);
      loadHistory(user.id);
      updateDropdownUI();
    } else {
      btnLogin.style.display = 'block';
      userMenu.style.display = 'none';
      dropdownMenu.classList.remove('active');
      dropdownFavorites.style.display = 'none';
      document.getElementById('dropdown-history').style.display = 'none';
      navFavorites.style.display = 'none';
      navHistory.style.display = 'none';
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
      updateProfileUI(data);
    } else {
      const fallback = {
        displayName: user.user_metadata?.displayName || user.email?.split('@')[0]
      };
      updateProfileUI(fallback);
    }
  }

  function updateProfileUI(data) {
    const displayName = data.display_name || currentUser.email?.split('@')[0] || 'User';
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

    const isFav = favoritesData.some(f => f.mangaId === itemId);

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
      await loadFavorites(currentUser.id);
      renderMangaCards();
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

    let lastChapter = '';
    const chapterEl = card.querySelector('.card-chapter, .novel-chapter');
    if (chapterEl) lastChapter = chapterEl.textContent;

    try {
      await supabase.from('History').upsert({
        userId: currentUser.id,
        mangaId: itemId,
        title, cover, genre, type, lastChapter: lastChapter
      }, { onConflict: 'userId,mangaId' });
      loadHistory(currentUser.id);
    } catch (error) {
      console.error('Error saving history:', error);
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

  function collectAllGenres() {
    const genreSet = new Set();
    document.querySelectorAll('.card-manga, .card-novel').forEach(card => {
      const genres = (card.dataset.genre || '').split(',').map(g => g.trim());
      genres.forEach(g => { if (g) genreSet.add(g); });
    });
    return [...genreSet].sort();
  }

  function renderGenreTags() {
    const allGenres = collectAllGenres();
    genreChips.innerHTML = allGenres.map(g => `
      <button class="genre-chip${activeGenre === g ? ' active' : ''}" data-genre="${g}">${g}</button>
    `).join('');
  }

  function filterByGenre(genre) {
    activeGenre = genre;
    const allCards = document.querySelectorAll('#manga .card-manga, #novel .card-novel');
    genreGrid.innerHTML = '';
    let foundCount = 0;

    if (genre) {
      genreActiveBadge.style.display = 'flex';
      genreActiveTag.textContent = genre;
      allCards.forEach(card => {
        const cardGenre = (card.dataset.genre || '').split(',').map(g => g.trim());
        if (cardGenre.includes(genre)) {
          const clone = card.cloneNode(true);
          clone.style.opacity = '1';
          clone.style.transform = 'translateY(0)';
          clone.style.animation = 'none';
          if (card.classList.contains('card-novel')) {
            clone.style.gridColumn = '1 / -1';
          }
          genreGrid.appendChild(clone);
          foundCount++;
        }
      });
    }

    genrePrompt.style.display = genre ? 'none' : 'flex';
    genreGrid.style.display = genre ? 'grid' : 'none';
    genreEmpty.style.display = (genre && foundCount === 0) ? 'flex' : 'none';
    renderGenreTags();
  }

  function openGenrePage(genre) {
    activeGenre = genre || null;
    renderGenreTags();
    filterByGenre(genre);
    hideAllSections();
    genreSection.style.display = 'block';
    navLinks.forEach(l => l.classList.remove('active'));
    document.querySelector('.nav-link[href="#genre"]')?.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function injectLikeButtons() {
    document.querySelectorAll('.card-manga, .card-novel').forEach(card => {
      if (card.querySelector('.btn-like')) return;
      const overlay = card.querySelector('.card-overlay');
      if (overlay) {
        const btn = document.createElement('button');
        btn.className = 'btn-like';
        btn.setAttribute('aria-label', 'Like');
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
        <span class="like-count">0</span>`;
        overlay.insertBefore(btn, overlay.firstChild);
      }
    });
  }

  async function loadLikes() {
    const { data } = await supabase.from('Like').select('*');
    if (data) likesData = data;
    updateLikeUI();
  }

  function updateLikeUI() {
    document.querySelectorAll('.card-manga, .card-novel').forEach(card => {
      const id = card.dataset.id;
      const type = card.dataset.type;
      const count = likesData.filter(l => l.mangaId === id && l.type === type).length;
      const countEl = card.querySelector('.like-count');
      if (countEl) countEl.textContent = count;
      const btn = card.querySelector('.btn-like');
      if (btn) {
        const isLiked = currentUser && likesData.some(l => l.mangaId === id && l.userId === currentUser.id && l.type === type);
        btn.classList.toggle('liked', isLiked);
      }
    });
  }

  async function toggleLike(card) {
    if (!currentUser) {
      openModal('login');
      return;
    }
    const itemId = card.dataset.id;
    const type = card.dataset.type;
    const existing = likesData.find(l => l.mangaId === itemId && l.userId === currentUser.id && l.type === type);
    try {
      if (existing) {
        await supabase.from('Like').delete().eq('id', existing.id);
      } else {
        await supabase.from('Like').insert({
          userId: currentUser.id,
          mangaId: itemId,
          type: type
        });
      }
      loadLikes();
    } catch (error) {
      console.error('Error toggling like:', error);
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
    btnDiscordSignin.disabled = true;
    btnDiscordSignin.textContent = 'Loading...';
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
      btnDiscordSignin.disabled = false;
      btnDiscordSignin.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1 1.873.892.077.077 0 0 1-.041.107 11.633 11.633 0 0 1-1.226 1.994.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
        Continue with Discord
      `;
    }
  }

  async function handleGoogleSignIn() {
    btnGoogleSignin.disabled = true;
    btnGoogleSignin.textContent = 'Loading...';
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      const msg = error.message || error.msg || error.description || '';
      if (msg.includes('provider is not enabled')) {
        showError('Login Google belum diaktifkan di Supabase.');
      } else if (msg.includes('popup')) {
        showError('Popup login ditutup. Coba lagi.');
      } else {
        showError(msg || 'Gagal login dengan Google. Coba lagi.');
      }
    } finally {
      btnGoogleSignin.disabled = false;
      btnGoogleSignin.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        Continue with Google
      `;
    }
  }

  async function handleForgotPassword() {
    const email = authEmail.value.trim();
    if (!email) {
      showError('Masukkan email kamu dulu.');
      return;
    }
    btnForgotPassword.textContent = 'Mengirim...';
    btnForgotPassword.style.pointerEvents = 'none';
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password'
      });
      if (error) throw error;
      showError('Cek email kamu untuk link reset password!');
    } catch (error) {
      const msg = error.message || '';
      if (msg.includes('rate_limit') || msg.includes('too many requests')) {
        showError('Terlalu banyak permintaan. Coba lagi nanti.');
      } else if (msg.includes('Email not found')) {
        showError('Email tidak terdaftar.');
      } else {
        showError(msg || 'Gagal mengirim email reset.');
      }
    } finally {
      btnForgotPassword.textContent = 'Lupa password?';
      btnForgotPassword.style.pointerEvents = '';
    }
  }

  function openDetailPage(id, type) {
    const data = mangaDetailData[id];
    if (!data) return;
    const card = document.querySelector(`.card-manga[data-id="${id}"], .card-novel[data-id="${id}"]`);
    if (!card) return;
    const title = card.dataset.title;
    const cover = card.dataset.cover;
    const genre = card.dataset.genre;
    currentDetailId = id;
    currentDetailType = type;

    hideAllSections();
    document.getElementById('manga-detail').style.display = 'block';

    document.getElementById('detail-cover').src = cover;
    document.getElementById('detail-cover').alt = title;
    document.getElementById('detail-title').textContent = title;
    document.getElementById('detail-synopsis').textContent = data.synopsis;
    document.getElementById('detail-type').textContent = type === 'manga' ? '📖 Manga' : '📕 Novel';
    document.getElementById('detail-chapter-count').textContent = `${data.chapters.length} Chapter`;

    const genresEl = document.getElementById('detail-genres');
    genresEl.innerHTML = genre.split(',').map(g => `<a href="#genre" class="detail-genre-tag" data-genre-link="${g.trim()}">${g.trim()}</a>`).join('');

    const chapterList = document.getElementById('chapter-list');
    chapterList.innerHTML = data.chapters.map(ch => `
      <a href="#" class="chapter-item" data-chapter="${ch.num}">
        <span class="chapter-item-title">${ch.title}</span>
        <span class="chapter-item-date">${ch.pages} halaman</span>
      </a>
    `).join('');

    chapterList.querySelectorAll('.chapter-item').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentUser) {
          const chapterEl = card.querySelector('.card-chapter');
          if (chapterEl) chapterEl.textContent = `Ch. ${el.dataset.chapter}`;
          saveToHistory(card);
        }
        const ch = parseInt(el.dataset.chapter);
        openMangaReader(title, cover, `Ch. ${ch}`, ch);
      });
    });

    const isFav = currentUser && favoritesData.some(f => f.mangaId === id);
    const favBtn = document.getElementById('btn-detail-fav');
    favBtn.innerHTML = isFav ? '❤️ Di Favorit' : '♡ Tambah ke Favorit';

    const isLiked = currentUser && likesData.some(l => l.mangaId === id && l.userId === currentUser.id && l.type === type);
    const likeBtn = document.getElementById('btn-detail-like');
    likeBtn.classList.toggle('liked', isLiked);

    commentPage = 0;
    loadDetailComments(id, type);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function loadDetailComments(mangaId, type) {
    const { data: comments } = await supabase
      .from('Comment')
      .select('*, user:User(displayName, photoURL, selectedAvatar)')
      .eq('mangaId', mangaId)
      .eq('type', type)
      .order('createdAt', { ascending: false })
      .range(0, commentPage * 5 + 4);

    const list = document.getElementById('comments-list');
    const moreBtn = document.getElementById('btn-comments-more');

    if (!comments || comments.length === 0) {
      list.innerHTML = '<p style="color:var(--text-light);text-align:center;padding:40px 0;">Belum ada komentar. Jadilah yang pertama!</p>';
      moreBtn.style.display = 'none';
      return;
    }

    list.innerHTML = comments.map(c => {
      const name = c.user?.displayName || c.userName || 'User';
      const avatar = c.user?.selectedAvatar || c.user?.photoURL;
      const avatarHTML = avatar
        ? `<img src="${avatar}" onerror="this.style.display='none';this.parentElement.textContent='${name[0].toUpperCase()}'" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`
        : name[0].toUpperCase();
      const time = timeAgo2(c.createdAt);
      return `
        <div class="comment-item">
          <div class="comment-avatar">${avatarHTML}</div>
          <div class="comment-body">
            <div class="comment-author">${name}</div>
            <div class="comment-text">${c.text}</div>
            <div class="comment-time">${time}</div>
          </div>
        </div>
      `;
    }).join('');

    moreBtn.style.display = comments.length > (commentPage + 1) * 5 ? 'block' : 'none';
  }

  async function submitComment() {
    if (!currentUser) { openModal('login'); return; }
    const input = document.getElementById('comment-input');
    const text = input.value.trim();
    if (!text) return;
    try {
      await supabase.from('Comment').insert({
        userId: currentUser.id,
        userName: currentUser.user_metadata?.displayName || currentUser.email?.split('@')[0] || 'Anon',
        mangaId: currentDetailId,
        type: currentDetailType,
        text: text
      });
      input.value = '';
      commentPage = 0;
      loadDetailComments(currentDetailId, currentDetailType);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  }

  function showDashboardTab(tab) {
    document.querySelectorAll('.dashboard-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.dashboard-pane').forEach(p => p.classList.remove('active'));
    document.querySelector(`.dashboard-tab[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(`dash-${tab}`).classList.add('active');

    if (tab === 'history') renderDashHistory();
    else if (tab === 'settings') renderDashSettings();
  }

  function renderDashHistory() {
    const list = document.getElementById('dash-history-list');
    const empty = document.getElementById('dash-history-empty');
    if (!currentUser || historyData.length === 0) {
      list.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';
    list.innerHTML = historyData.map(h => `
      <div class="dash-history-item" data-id="${h.mangaId}" data-type="${h.type}">
        <img src="${h.cover}" alt="${h.title}">
        <div class="dash-history-info">
          <h4>${h.title}</h4>
          <p>${h.lastChapter || ''} • ${new Date(h.lastReadAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
      </div>
    `).join('');
    list.querySelectorAll('.dash-history-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.dataset.id;
        const type = el.dataset.type;
        openDetailPage(id, type);
      });
    });
  }

  function renderDashSettings() {
    if (!currentUser) return;
    const avatar = document.getElementById('settings-avatar');
    const name = document.getElementById('settings-name');
    const email = document.getElementById('settings-email');
    const initial = (currentUser.user_metadata?.displayName || currentUser.email?.split('@')[0] || 'U')[0].toUpperCase();
    avatar.textContent = initial;
    avatar.style.background = document.querySelector('#user-avatar')?.style.background || 'linear-gradient(135deg, var(--primary), var(--accent-blue))';
    name.textContent = currentUser.user_metadata?.displayName || currentUser.email?.split('@')[0] || 'User';
    email.textContent = currentUser.email;
  }

  function performAdvancedSearch() {
    const selectedGenres = [...document.querySelectorAll('#adv-search-tags input:checked')].map(i => i.value);
    const popularity = document.getElementById('adv-search-popularity').value;
    const type = document.getElementById('adv-search-type').value;
    const resultsEl = document.getElementById('adv-search-results');

    const allCards = [...document.querySelectorAll('#manga .card-manga, #novel .card-novel')];
    const filtered = allCards.filter(card => {
      const cardGenre = (card.dataset.genre || '').split(',').map(g => g.trim());
      const cardType = card.dataset.type;
      if (type && cardType !== type) return false;
      if (selectedGenres.length > 0 && !selectedGenres.some(g => cardGenre.includes(g))) return false;
      return true;
    });

    if (filtered.length === 0) {
      resultsEl.innerHTML = '<p style="color:var(--text-light);text-align:center;padding:40px 0;">Tidak ada hasil ditemukan</p>';
      return;
    }
    resultsEl.innerHTML = '';
    filtered.forEach(card => {
      const clone = card.cloneNode(true);
      resultsEl.appendChild(clone);
      clone.querySelector('.btn-read')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = clone.dataset.id;
        const type = clone.dataset.type;
        openDetailPage(id, type);
      });
    });
  }

  async function handleDeleteAccount() {
    if (!currentUser) return;
    if (!confirm('Apakah kamu yakin ingin menghapus akun ini? Tindakan ini tidak bisa dibatalkan!')) return;
    const pw = prompt('Masukkan password untuk konfirmasi:');
    if (!pw) return;
    try {
      const { error } = await supabase.rpc('delete_user_account');
      if (error) {
        showError('Gagal menghapus akun. Coba lagi.');
        return;
      }
      await supabase.auth.signOut();
    } catch {
      showError('Fitur delete account perlu diatur di Supabase. Hubungi admin.');
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
      const displayName = document.getElementById('display-name').value.substring(0, 30);
      const bio = profileBio.value.substring(0, 150);
      const updates = { 
       bio, 
       display_name: displayName,
       selectedAvatar: selectedAvatarPath || null 
      };
      const { error } = await supabase
        .from('User')
        .update(updates)
        .eq('id', currentUser.id);
      if (error) throw error;

      await loadUserData(currentUser);
      closeEditProfileModal();
    } catch (error) {
      editProfileError.textContent = 'Gagal menyimpan profil.';
      editProfileError.style.display = 'block';
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
        if (uploadError.message?.includes('bucket') || uploadError.message?.includes('not found')) {
          throw new Error('Storage bucket "avatars" belum dibuat. Buat bucket di Supabase Dashboard > Storage.');
        }
        throw uploadError;
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

  function toggleDarkMode() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  }

  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  injectLikeButtons();
  loadLikes();

  btnDarkMode.addEventListener('click', toggleDarkMode);

  btnLogin.addEventListener('click', () => openModal('login'));
  modalClose.addEventListener('click', closeModal);
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) closeModal();
  });
  authForm.addEventListener('submit', handleEmailAuth);
  btnGoogleSignin.style.display = 'flex';
  btnDiscordSignin.style.display = 'flex';
  btnGoogleSignin.addEventListener('click', handleGoogleSignIn);
  btnDiscordSignin.addEventListener('click', handleDiscordSignIn);
  btnForgotPassword.addEventListener('click', (e) => {
    e.preventDefault();
    handleForgotPassword();
  });
  btnLogout.addEventListener('click', handleLogout);

  document.getElementById('btn-back-detail').addEventListener('click', () => {
    hideAllSections();
    document.querySelector('#manga')?.style.setProperty('display', 'block');
    document.querySelector('#novel')?.style.setProperty('display', 'block');
    document.querySelector('#home')?.style.setProperty('display', 'block');
    document.querySelector('#features')?.style.setProperty('display', 'block');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.getElementById('btn-detail-fav').addEventListener('click', () => {
    const card = document.querySelector(`.card-manga[data-id="${currentDetailId}"], .card-novel[data-id="${currentDetailId}"]`);
    if (card) toggleFavorite(card);
    setTimeout(() => {
      const isFav = currentUser && favoritesData.some(f => f.id === currentDetailId);
      document.getElementById('btn-detail-fav').innerHTML = isFav ? '❤️ Di Favorit' : '♡ Tambah ke Favorit';
    }, 300);
  });

  document.getElementById('btn-detail-like').addEventListener('click', () => {
    const card = document.querySelector(`.card-manga[data-id="${currentDetailId}"], .card-novel[data-id="${currentDetailId}"]`);
    if (card) toggleLike(card);
  });

  document.getElementById('btn-comment-submit').addEventListener('click', submitComment);

  document.getElementById('btn-comments-more').addEventListener('click', () => {
    commentPage++;
    loadDetailComments(currentDetailId, currentDetailType);
  });

  document.querySelectorAll('.dashboard-tab').forEach(tab => {
    tab.addEventListener('click', () => showDashboardTab(tab.dataset.tab));
  });

  document.getElementById('btn-adv-search').addEventListener('click', performAdvancedSearch);

  document.getElementById('btn-settings-edit').addEventListener('click', () => {
    openEditProfileModal();
  });

  document.getElementById('btn-settings-change-pw').addEventListener('click', () => {
    const email = currentUser?.email;
    if (!email) return;
    supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/reset-password' });
    alert('Cek email kamu untuk link ubah password!');
  });

  document.getElementById('btn-settings-logout').addEventListener('click', handleLogout);

  document.getElementById('btn-settings-delete').addEventListener('click', handleDeleteAccount);

  btnDashboardToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    dashboardDropdown.classList.toggle('active');
    dropdownMenu.classList.remove('active');
  });

  document.querySelectorAll('.dashboard-dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      dashboardDropdown.classList.remove('active');
      const tab = item.dataset.dashTab;
      hideAllSections();
      document.getElementById('dashboard').style.display = 'block';
      navLinks.forEach(l => l.classList.remove('active'));
      showDashboardTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-left') && !e.target.closest('#dashboard-dropdown')) {
      dashboardDropdown.classList.remove('active');
    }
  });

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

  document.addEventListener('click', (e) => {
    const likeBtn = e.target.closest('.btn-like');
    if (likeBtn) {
      e.stopPropagation();
      const card = likeBtn.closest('.card-manga, .card-novel');
      if (card) toggleLike(card);
    }
  });

  document.addEventListener('click', (e) => {
    const readBtn = e.target.closest('.btn-read');
    if (readBtn) {
      e.stopPropagation();
      const card = readBtn.closest('.card-manga');
      if (card) {
        if (currentUser) saveToHistory(card);
        const id = card.dataset.id;
        const type = card.dataset.type;
        const data = mangaDetailData[id];
        if (data && data.pdf && typeof data.pdf === 'string') {
          window.open(data.pdf, '_blank');
        } else if (data && Array.isArray(data.pdf) && data.pdf[0]) {
          window.open(data.pdf[0], '_blank');
        } else {
          openDetailPage(id, type);
        }
      }
    }
  });

  document.addEventListener('click', (e) => {
    const novelCard = e.target.closest('.card-novel');
    if (novelCard && !e.target.closest('.btn-favorite-novel') && !e.target.closest('.btn-like')) {
      const volumeBtn = e.target.closest('.volume-btn');
      if (currentUser) saveToHistory(novelCard);
      const id = novelCard.dataset.id;
      const type = novelCard.dataset.type;
      if (volumeBtn) {
        const chNum = parseInt(volumeBtn.dataset.chapter) || 1;
        const data = mangaDetailData[id];
        if (data && Array.isArray(data.pdf) && data.pdf[chNum - 1]) {
          window.open(data.pdf[chNum - 1], '_blank');
        } else if (data && typeof data.pdf === 'string') {
          window.open(data.pdf, '_blank');
        } else {
          const cover = novelCard.dataset.cover;
          const title = novelCard.dataset.title;
          currentDetailId = id;
          currentDetailType = type;
          openMangaReader(title, cover, 'Volume ' + chNum, chNum);
        }
      } else {
        openDetailPage(id, type);
      }
    }
  });

  let readerMode = 'ltr';
  let readerDark = false;
  let readerAnim = true;
  let readerZoom = 'fit';
  let readerRes = 720;

  function openMangaReader(title, cover, chapterStr, startChapterNum) {
    const data = mangaDetailData[currentDetailId];
    if (!data) return;
    let chNum = startChapterNum || parseInt(chapterStr?.replace(/\D/g, '')) || 1;
    const startIdx = data.chapters.findIndex(c => c.num === chNum);
    if (startIdx === -1) return;
    let curChIdx = startIdx;
    let curCh = data.chapters[curChIdx];
    let curPage = 1;
    let lastDir = 'next';

    const readerSection = document.getElementById('reader-page');
    const wrap = document.getElementById('reader-page-wrap');
    const canvas = document.getElementById('reader-page-canvas');
    const fallback = document.querySelector('.reader-page-fallback');
    const rpfNum = document.getElementById('rpf-num');
    const rpfLabel = document.getElementById('rpf-label');
    const pageInput = document.getElementById('reader-page-input');
    const pageTotal = document.getElementById('reader-page-total');
    const chapterList = document.getElementById('reader-chapter-list');

    let pdfDoc = null;
    let pdfLoadAttempted = false;

    function getPdfPath(chIdx) {
      const p = data.pdf;
      if (!p) return null;
      if (typeof p === 'string') return p;
      if (Array.isArray(p)) return p[chIdx] || null;
      return null;
    }

    function loadPDF(chIdx, cb) {
      const pdfPath = getPdfPath(chIdx);
      if (!pdfPath) { pdfDoc = null; pdfLoadAttempted = true; if (cb) cb(); return; }
      pdfLoadAttempted = true;
      if (typeof pdfjsLib === 'undefined' || typeof pdfjsLib.getDocument !== 'function') {
        console.error('pdf.js library tidak tersedia');
        pdfDoc = null;
        if (cb) cb();
        return;
      }
      try {
        pdfjsLib.getDocument(pdfPath).promise.then(doc => {
          pdfDoc = doc;
          if (cb) cb();
        }).catch(e => {
          console.error('PDF load error:', e);
          pdfDoc = null;
          if (cb) cb();
        });
      } catch (e) {
        console.error('PDF load exception:', e);
        pdfDoc = null;
        if (cb) cb();
      }
    }

    function getPdfPageNum(pageNum) {
      return (curCh.pdfStart || 1) + pageNum - 1;
    }

    function getResScale() {
      if (readerRes <= 400) return 1.2;
      if (readerRes <= 720) return 2.0;
      return 3.5;
    }

    function renderPDFPage(pageNum) {
      if (!pdfDoc) { canvas.style.display = 'none'; fallback.style.display = 'flex'; rpfNum.textContent = pageNum; rpfLabel.textContent = 'Memuat...'; return; }
      pdfDoc.getPage(getPdfPageNum(pageNum)).then(page => {
        const viewport = page.getViewport({ scale: getResScale() });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.cssText = `max-width:100%;width:${viewport.width}px;height:auto;`;
        page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise.then(() => {
          canvas.style.display = '';
          fallback.style.display = 'none';
        }).catch(() => {
          canvas.style.display = 'none';
          fallback.style.display = 'flex';
          rpfNum.textContent = pageNum;
          rpfLabel.textContent = `Halaman ${pageNum} dari ${curCh.pages}`;
        });
      }).catch(() => {
        canvas.style.display = 'none';
        fallback.style.display = 'flex';
        rpfNum.textContent = pageNum;
        rpfLabel.textContent = `Halaman ${pageNum} dari ${curCh.pages}`;
      });
    }

    function showReader() {
      hideAllSections();
      readerSection.style.display = 'flex';
      document.getElementById('reader-topbar-title').textContent = title;
      canvas.style.display = 'none';
      fallback.style.display = 'flex';
      rpfLabel.textContent = 'Memuat...';
      pdfLoadAttempted = false;
      updateReaderUI();
    }

    function updateReaderUI() {
      document.getElementById('reader-topbar-chapter').textContent = curCh.title;
      pageTotal.textContent = curCh.pages;
      pageInput.value = curPage;
      pageInput.max = curCh.pages;

      if (readerMode === 'scroll') {
        readerSection.classList.add('reader-scroll-mode');
        renderScrollMode();
      } else {
        readerSection.classList.remove('reader-scroll-mode');
        renderSinglePage();
      }

      if (readerDark) readerSection.classList.add('reader-dark');
      else readerSection.classList.remove('reader-dark');

      renderChapterList();
    }

    function loadPageImage(pageNum) {
      canvas.style.display = 'none';
      fallback.style.display = 'none';
      const pagePath = `Pages/${currentDetailId}/ch${curCh.num}/page${pageNum}.jpg`;
      const img = document.createElement('img');
      img.className = 'reader-page-img reader-page-img-temp';
      img.loading = 'eager';
      img.onload = function() { this.style.display = ''; };
      img.onerror = function() {
        this.style.display = 'none';
        fallback.style.display = 'flex';
        rpfNum.textContent = pageNum;
        rpfLabel.textContent = `Halaman ${pageNum} dari ${curCh.pages}`;
      };
      img.src = pagePath;
      wrap.insertBefore(img, canvas.nextSibling || fallback);
    }

    function renderSinglePage() {
      wrap.style.flexDirection = 'row';
      wrap.querySelectorAll('.reader-page-img-temp').forEach(el => el.remove());
      readerSection.classList.remove('zoom-fit', 'zoom-width', 'zoom-height', 'zoom-original');
      readerSection.classList.add('zoom-' + readerZoom);

      if (pdfDoc) {
        canvas.style.display = '';
        renderPDFPage(curPage);
      } else if (data.pdf && !pdfLoadAttempted) {
        canvas.style.display = 'none';
        fallback.style.display = 'flex';
        rpfNum.textContent = curPage;
        rpfLabel.textContent = 'Memuat...';
        loadPDF(curChIdx, function() {
          if (pdfDoc) {
            canvas.style.display = '';
            renderPDFPage(curPage);
          } else {
            loadPageImage(curPage);
          }
        });
      } else if (data.pdf && pdfLoadAttempted) {
        loadPageImage(curPage);
      } else {
        loadPageImage(curPage);
      }

      wrap.classList.remove('reader-page-flip', 'reader-page-flip-back');
      if (readerMode !== 'scroll' && readerAnim) {
        void wrap.offsetWidth;
        if (lastDir === 'next') wrap.classList.add('reader-page-flip');
        else wrap.classList.add('reader-page-flip-back');
      }

      const rtl = readerMode === 'rtl';
      wrap.onclick = (e) => {
        const rect = wrap.getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (rtl) {
          if (x < rect.width / 3) nextPage();
          else if (x > (rect.width / 3) * 2) prevPage();
        } else {
          if (x > (rect.width / 3) * 2) nextPage();
          else if (x < rect.width / 3) prevPage();
        }
      };
    }

    function renderScrollMode() {
      wrap.style.flexDirection = 'column';
      wrap.innerHTML = '';
      wrap.onclick = null;

      if (pdfDoc) {
        canvas.style.display = 'none';
        fallback.style.display = 'none';
        for (let i = 1; i <= curCh.pages; i++) {
          const div = document.createElement('div');
          div.style.cssText = 'width:100%;margin-bottom:8px;text-align:center;';
          const c = document.createElement('canvas');
          c.style.cssText = 'max-width:100%;height:auto;';
          div.appendChild(c);
          wrap.appendChild(div);
          const pdfI = getPdfPageNum(i);
          pdfDoc.getPage(pdfI).then(page => {
            const vp = page.getViewport({ scale: getResScale() });
            c.width = vp.width;
            c.height = vp.height;
            page.render({ canvasContext: c.getContext('2d'), viewport: vp }).catch(() => {});
          });
        }
      } else if (data.pdf && !pdfLoadAttempted) {
        wrap.innerHTML = '<div style="text-align:center;padding:2rem;color:#999;">Memuat...</div>';
        loadPDF(curChIdx, function() {
          if (pdfDoc) {
            renderScrollMode();
          } else {
            wrap.innerHTML = '';
            for (let i = 1; i <= curCh.pages; i++) {
              const p = `Pages/${currentDetailId}/ch${curCh.num}/page${i}.jpg`;
              const el = document.createElement('img');
              el.className = 'reader-page-img';
              el.src = p;
              el.style.cssText = 'max-width:100%;margin-bottom:8px;';
              el.onerror = function() {
                this.onerror = null;
                this.outerHTML = `<div class="reader-page-fallback" style="display:flex;margin-bottom:8px;"><div style="font-size:2rem;font-weight:800;color:#aaa;font-family:var(--font-heading);">${i}</div><div style="font-size:0.9rem;color:#999;">Halaman ${i}</div></div>`;
              };
              wrap.appendChild(el);
            }
          }
        });
      } else if (data.pdf && pdfLoadAttempted) {
        wrap.innerHTML = '';
        for (let i = 1; i <= curCh.pages; i++) {
          const p = `Pages/${currentDetailId}/ch${curCh.num}/page${i}.jpg`;
          const el = document.createElement('img');
          el.className = 'reader-page-img';
          el.src = p;
          el.style.cssText = 'max-width:100%;margin-bottom:8px;';
          el.onerror = function() {
            this.onerror = null;
            this.outerHTML = `<div class="reader-page-fallback" style="display:flex;margin-bottom:8px;"><div style="font-size:2rem;font-weight:800;color:#aaa;font-family:var(--font-heading);">${i}</div><div style="font-size:0.9rem;color:#999;">Halaman ${i}</div></div>`;
          };
          wrap.appendChild(el);
        }
      } else {
        for (let i = 1; i <= curCh.pages; i++) {
          const p = `Pages/${currentDetailId}/ch${curCh.num}/page${i}.jpg`;
          const el = document.createElement('img');
          el.className = 'reader-page-img';
          el.src = p;
          el.style.cssText = 'max-width:100%;margin-bottom:8px;';
          el.onerror = function() {
            this.onerror = null;
            this.outerHTML = `<div class="reader-page-fallback" style="display:flex;margin-bottom:8px;"><div style="font-size:2rem;font-weight:800;color:#aaa;font-family:var(--font-heading);">${i}</div><div style="font-size:0.9rem;color:#999;">Halaman ${i}</div></div>`;
          };
          wrap.appendChild(el);
        }
      }
    }

    function nextPage() {
      lastDir = 'next';
      if (curPage < curCh.pages) { curPage++; updateReaderUI(); }
      else { nextChapter(); }
    }

    function prevPage() {
      lastDir = 'prev';
      if (curPage > 1) { curPage--; updateReaderUI(); }
      else { prevChapter(); }
    }

    function jumpToPage(page) {
      const p = parseInt(page);
      if (p >= 1 && p <= curCh.pages) { curPage = p; updateReaderUI(); }
    }

    function nextChapter() {
      if (curChIdx < data.chapters.length - 1) {
        lastDir = 'next';
        curChIdx++;
        curCh = data.chapters[curChIdx];
        curPage = 1;
        pdfDoc = null;
        pdfLoadAttempted = false;
        fallback.style.display = 'flex';
        rpfLabel.textContent = 'Memuat...';
        updateReaderUI();
      }
    }

    function prevChapter() {
      if (curChIdx > 0) {
        lastDir = 'prev';
        curChIdx--;
        curCh = data.chapters[curChIdx];
        curPage = 1;
        pdfDoc = null;
        pdfLoadAttempted = false;
        fallback.style.display = 'flex';
        rpfLabel.textContent = 'Memuat...';
        updateReaderUI();
      }
    }

    function goToChapter(idx) {
      if (idx >= 0 && idx < data.chapters.length) {
        lastDir = idx > curChIdx ? 'next' : 'prev';
        curChIdx = idx;
        curCh = data.chapters[curChIdx];
        curPage = 1;
        pdfDoc = null;
        pdfLoadAttempted = false;
        fallback.style.display = 'flex';
        rpfLabel.textContent = 'Memuat...';
        updateReaderUI();
        document.getElementById('reader-chapter-modal').classList.remove('active');
      }
    }

    function renderChapterList() {
      chapterList.innerHTML = data.chapters.map((ch, i) => `
        <button class="reader-chapter-item${i === curChIdx ? ' active-ch' : ''}" data-idx="${i}">${ch.title} (${ch.pages} hal)</button>
      `).join('');
      chapterList.querySelectorAll('.reader-chapter-item').forEach(el => {
        el.addEventListener('click', () => goToChapter(parseInt(el.dataset.idx)));
      });
    }

    function handleKey(e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); if (readerMode === 'rtl') prevPage(); else nextPage(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); if (readerMode === 'rtl') nextPage(); else prevPage(); }
      else if (e.key === 'Escape') closeReader();
    }

    function closeReader() {
      readerSection.style.display = 'none';
      document.querySelectorAll('section[id]').forEach(s => {
        if (s.id !== 'reader-page') s.style.display = '';
      });
      document.getElementById('manga-detail').style.display = 'none';
      document.getElementById('dashboard').style.display = 'none';
      document.getElementById('search-results').style.display = 'none';
      document.getElementById('polling').style.display = 'none';
      document.getElementById('reader-menu-dropdown').classList.remove('active');
      document.getElementById('reader-chapter-modal').classList.remove('active');
      document.removeEventListener('keydown', handleKey);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    document.getElementById('reader-back').onclick = closeReader;
    document.getElementById('reader-prev').onclick = prevPage;
    document.getElementById('reader-next').onclick = nextPage;
    document.getElementById('reader-page-input').onchange = function() { jumpToPage(this.value); };
    document.getElementById('reader-page-input').onkeydown = function(e) { if (e.key === 'Enter') jumpToPage(this.value); };

    document.getElementById('reader-menu-btn').onclick = function(e) {
      e.stopPropagation();
      document.getElementById('reader-menu-dropdown').classList.toggle('active');
      document.getElementById('reader-chapter-modal').classList.remove('active');
    };

    document.querySelectorAll('.reader-menu-opt[data-mode]').forEach(opt => {
      opt.onclick = function() {
        document.querySelectorAll('.reader-menu-opt[data-mode]').forEach(o => o.classList.remove('active'));
        this.classList.add('active');
        readerMode = this.dataset.mode;
        updateReaderUI();
      };
    });

    document.getElementById('reader-dark-toggle').onclick = function() {
      readerDark = !readerDark;
      this.textContent = readerDark ? 'Mode Terang' : 'Mode Gelap';
      updateReaderUI();
    };

    document.getElementById('reader-anim-toggle').onclick = function() {
      readerAnim = !readerAnim;
      this.classList.toggle('active');
      updateReaderUI();
    };

    document.querySelectorAll('.reader-menu-opt[data-zoom]').forEach(opt => {
      opt.onclick = function() {
        document.querySelectorAll('.reader-menu-opt[data-zoom]').forEach(o => o.classList.remove('active'));
        this.classList.add('active');
        readerZoom = this.dataset.zoom;
        updateReaderUI();
      };
    });

    document.querySelectorAll('.reader-menu-opt[data-res]').forEach(opt => {
      opt.onclick = function() {
        document.querySelectorAll('.reader-menu-opt[data-res]').forEach(o => o.classList.remove('active'));
        this.classList.add('active');
        readerRes = parseInt(this.dataset.res);
        if (readerMode === 'scroll') renderScrollMode();
        else renderSinglePage();
      };
    });

    document.getElementById('reader-chapter-btn').onclick = function(e) {
      e.stopPropagation();
      document.getElementById('reader-chapter-modal').classList.toggle('active');
      document.getElementById('reader-menu-dropdown').classList.remove('active');
    };

    document.addEventListener('click', function closeMenus(e) {
      if (!e.target.closest('.reader-menu-dropdown') && !e.target.closest('#reader-menu-btn')) {
        document.getElementById('reader-menu-dropdown').classList.remove('active');
      }
      if (!e.target.closest('.reader-chapter-modal') && !e.target.closest('#reader-chapter-btn')) {
        document.getElementById('reader-chapter-modal').classList.remove('active');
      }
    });

    document.addEventListener('keydown', handleKey);

    showReader();
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
    window.scrollTo({ top: historySection.offsetTop - 80, behavior: 'smooth' });
  }

  function showPollingPage() {
    hideAllSections();
    pollingSection.style.display = 'block';
    navLinks.forEach(l => l.classList.remove('active'));
    navPolling.classList.add('active');
    loadPollResults();
    window.scrollTo({ top: pollingSection.offsetTop - 80, behavior: 'smooth' });
  }

  async function loadPollResults() {
    const { data: votes } = await supabase
      .from('PollVote')
      .select('characterId, userId');

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

  function hideAllSections() {
    document.querySelectorAll('section[id]').forEach(s => {
      s.style.display = 'none';
    });
    favoritesSection.style.display = 'none';
    historySection.style.display = 'none';
    searchResultsSection.style.display = 'none';
    pollingSection.style.display = 'none';
    genreSection.style.display = 'none';
    document.getElementById('manga-detail').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
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

  genreChips.addEventListener('click', (e) => {
    const chip = e.target.closest('.genre-chip');
    if (!chip) return;
    e.preventDefault();
    const genre = chip.dataset.genre;
    if (activeGenre === genre) {
      filterByGenre(null);
    } else {
      filterByGenre(genre);
    }
  });

  genreActiveClear.addEventListener('click', () => {
    filterByGenre(null);
  });

  btnBackFromGenre.addEventListener('click', (e) => {
    e.preventDefault();
    genreSection.style.display = 'none';
    document.querySelectorAll('section[id]').forEach(s => s.style.display = '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-genre-link]');
    if (link) {
      e.preventDefault();
      const genre = link.dataset.genreLink;
      openGenrePage(genre);
    }
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (['#home', '#manga', '#novel', '#features', '#search', '#polling', '#genre'].includes(hash)) {
      document.querySelectorAll('section[id]').forEach(s => {
        s.style.display = '';
      });
    }
    if (hash === '#genre') {
      openGenrePage();
    }
  });

  currentUser = null;
  btnLogin.style.display = 'block';
  userMenu.style.display = 'none';
  dropdownFavorites.style.display = 'none';
  document.getElementById('dropdown-history').style.display = 'none';
  navFavorites.style.display = 'none';
  navHistory.style.display = 'none';
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

  if (window.location.hash === '#genre') {
    openGenrePage();
  }


  // ─── RATING SYSTEM ───
  let ratingsCache = {};
  async function loadAllRatings() {
    const { data } = await supabase.from('Rating').select('*');
    ratingsCache = {};
    if (data) data.forEach(r => {
      const k = r.mangaId;
      if (!ratingsCache[k]) ratingsCache[k] = { total: 0, count: 0, userRating: 0 };
      ratingsCache[k].total += r.rating;
      ratingsCache[k].count++;
      if (currentUser && r.userId === currentUser.id) ratingsCache[k].userRating = r.rating;
    });
    renderAllRatings();
  }
  function renderAllRatings() { document.querySelectorAll('.card-manga, .card-novel').forEach(c => renderRatingCard(c)); }
  function renderRatingCard(card) {const itemId=card.dataset.id;if(!itemId)return;const info=ratingsCache[itemId]||{total:0,count:0,userRating:0};const avg=info.count>0?Math.round(info.total/info.count):0;const starStr=[1,2,3,4,5].map(i=>'<span class="star '+(i<=(info.userRating||avg)?'filled':'')+'" data-value="'+i+'">★</span>').join('');const existing=card.querySelector('.rating-row');if(existing)existing.remove();const row=document.createElement('div');row.className='rating-row';row.innerHTML='<span class="stars '+(currentUser?'interactive':'')+'">'+starStr+'</span>'+(avg>0?'<span class="rating-avg">'+(info.total/info.count).toFixed(1)+'</span><span class="rating-count">('+info.count+')</span>':'<span class="rating-count">no ratings</span>');card.querySelector('.card-info')?.appendChild(row);}
  document.addEventListener('click', async (e) => {if(!currentUser)return;const starEl=e.target.closest('.star');if(!starEl||!starEl.parentElement?.classList.contains('interactive'))return;const card=starEl.closest('.card-manga, .card-novel');if(!card)return;const itemId=card.dataset.id,rating=parseInt(starEl.dataset.value);if(!itemId||!rating)return;try{await supabase.from('Rating').upsert({userId:currentUser.id,mangaId:itemId,rating},{onConflict:'userId,mangaId'});await loadAllRatings();}catch(err){console.error('Rating error:',err);}});

  // ─── EXCLUSIVE MANGA ───
  const navExclusive = document.getElementById('nav-exclusive');
  const exclusiveSectionEl = document.getElementById('exclusive');
  const exclusiveGridEl = document.getElementById('exclusive-grid');
  let hasExclusiveAccess = false;
  const exclusiveMangas = [{id:'haraguro-sister',title:'Haraguro Sister x Kusogaki',cover:'Cover/cover3.jpeg',genre:'Mature, Romance',chapter:'Full',pdf:'https://nhubpjovnpwadaxxsqyt.supabase.co/storage/v1/object/public/files/haraguro-sister.pdf'}];
  async function loadExclusiveAccess(){if(!currentUser){hasExclusiveAccess=false;renderExclusiveUI();return;}const{data}=await supabase.from('ExclusiveAccess').select('mangaId').eq('userId',currentUser.id);hasExclusiveAccess=data&&data.length>0;renderExclusiveUI();}
  function renderExclusiveUI(){if(hasExclusiveAccess){navExclusive.style.display='inline-block';exclusiveSectionEl.style.display='block';exclusiveGridEl.innerHTML=exclusiveMangas.map(m=>'<div class="card-manga" data-id="'+m.id+'" data-title="'+m.title+'" data-cover="'+m.cover+'" data-genre="'+m.genre+'" data-type="manga"><div class="card-cover"><img loading="lazy" decoding="async" src="'+m.cover+'" alt="'+m.title+'"><span class="card-badge badge-new">EXCLUSIVE</span><div class="card-overlay"><button class="btn-favorite"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></button><a href="'+m.pdf+'" target="_blank" class="btn-read">Baca</a></div></div><div class="card-info"><span class="card-genre">'+m.genre+'</span><h3 class="card-title">'+m.title+'</h3><span class="card-chapter">'+m.chapter+'</span></div></div>').join('');loadAllRatings();}else{navExclusive.style.display='none';exclusiveSectionEl.style.display='none';exclusiveGridEl.innerHTML='';}}
  navExclusive.addEventListener('click',(e)=>{e.preventDefault();hideAllSections();exclusiveSectionEl.style.display='block';document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));navExclusive.classList.add('active');window.scrollTo({top:exclusiveSectionEl.offsetTop-80,behavior:'smooth'});});

  // ─── BROADCAST ───
  const btnBell=document.getElementById('btn-bell');
  const bellBadgeEl=document.getElementById('bell-badge');
  const broadcastModal=document.getElementById('broadcast-modal');
  const broadcastClose=document.getElementById('broadcast-close');
  const broadcastList=document.getElementById('broadcast-list');
  const broadcastEmpty=document.getElementById('broadcast-empty');
  const broadcastForm=document.getElementById('broadcast-form');
  const broadcastTitle=document.getElementById('broadcast-title');
  const broadcastMessage=document.getElementById('broadcast-message');
  const broadcastSend=document.getElementById('broadcast-send');
  const broadcastError=document.getElementById('broadcast-error');
  let broadcastsData=[];let readIds=JSON.parse(localStorage.getItem('broadcast_read')||'[]');
  async function loadBroadcasts(){const{data}=await supabase.from('Broadcast').select('*').order('createdAt',{ascending:false}).limit(20);broadcastsData=data||[];const unread=broadcastsData.filter(b=>!readIds.includes(b.id)).length;bellBadgeEl.textContent=unread;bellBadgeEl.style.display=unread>0?'flex':'none';}
  function markAllRead(){broadcastsData.forEach(b=>{if(!readIds.includes(b.id))readIds.push(b.id);});localStorage.setItem('broadcast_read',JSON.stringify(readIds));bellBadgeEl.style.display='none';renderBroadcastList();}
  function renderBroadcastList(){if(broadcastsData.length===0){broadcastList.innerHTML='';broadcastEmpty.style.display='block';}else{broadcastEmpty.style.display='none';broadcastList.innerHTML=broadcastsData.map(b=>'<div class="broadcast-item '+(readIds.includes(b.id)?'':'unread')+'"><div class="broadcast-title">'+escapeHTML2(b.title)+'</div><div class="broadcast-message">'+escapeHTML2(b.message)+'</div><div class="broadcast-time">'+timeAgo2(b.createdAt)+'</div></div>').join('');}}
  function openBroadcastModalFn(){renderBroadcastList();broadcastForm.style.display=(currentUserProfile&&currentUserProfile.isAdmin)?'block':'none';broadcastModal.classList.add('active');markAllRead();}
  broadcastClose.addEventListener('click',()=>broadcastModal.classList.remove('active'));
  broadcastModal.addEventListener('click',(e)=>{if(e.target===broadcastModal)broadcastModal.classList.remove('active');});
  btnBell.addEventListener('click',()=>{if(!currentUser){openModal('login');return;}openBroadcastModalFn();});
  broadcastSend.addEventListener('click',async()=>{const title=broadcastTitle.value.trim(),message=broadcastMessage.value.trim();if(!title||!message){broadcastError.textContent='Judul dan pesan harus diisi.';broadcastError.style.display='block';return;}broadcastSend.disabled=true;broadcastSend.textContent='Mengirim...';broadcastError.style.display='none';try{await supabase.from('Broadcast').insert({adminId:currentUser.id,title,message});broadcastTitle.value='';broadcastMessage.value='';await loadBroadcasts();renderBroadcastList();showToast('Broadcast terkirim!');}catch(err){broadcastError.textContent='Gagal mengirim broadcast.';broadcastError.style.display='block';}finally{broadcastSend.disabled=false;broadcastSend.textContent='Kirim Broadcast';}});
  loadBroadcasts();setInterval(loadBroadcasts,60000);

  // ─── ADMIN PANEL ───
  const btnAdminPanelEl=document.getElementById('btn-admin-panel');
  const adminModalEl=document.getElementById('admin-modal');
  const adminCloseEl=document.getElementById('admin-modal-close');
  const adminUserEmailEl=document.getElementById('admin-user-email');
  const adminAccessListEl=document.getElementById('admin-access-list');
  const adminAccessEmptyEl=document.getElementById('admin-access-empty');
  const adminErrorEl=document.getElementById('admin-error');
  const adminGrantBtnEl=document.getElementById('admin-grant-btn');
  async function loadAdminAccess(){const{data}=await supabase.from('ExclusiveAccess').select('*, User:userId(email)').order('grantedAt',{ascending:false});if(data&&data.length>0){adminAccessEmptyEl.style.display='none';adminAccessListEl.style.display='flex';adminAccessListEl.innerHTML=data.map(a=>'<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:var(--bg-light);border-radius:8px;"><span style="font-size:0.85rem;font-weight:600;">'+(a.User?.email||a.userId)+'</span><button class="btn-revoke" data-id="'+a.id+'" style="padding:4px 12px;border-radius:20px;background:rgba(220,38,38,0.1);color:#dc2626;font-size:0.75rem;font-weight:700;cursor:pointer;">Hapus</button></div>').join('');}else{adminAccessEmptyEl.style.display='block';adminAccessListEl.style.display='none';}}
  btnAdminPanelEl.addEventListener('click',async()=>{if(!currentUserProfile||!currentUserProfile.isAdmin)return;adminModalEl.classList.add('active');adminUserEmailEl.value='';adminErrorEl.style.display='none';await loadAdminAccess();});
  adminCloseEl.addEventListener('click',()=>adminModalEl.classList.remove('active'));
  adminModalEl.addEventListener('click',(e)=>{if(e.target===adminModalEl)adminModalEl.classList.remove('active');});
  adminGrantBtnEl.addEventListener('click',async()=>{const email=adminUserEmailEl.value.trim();if(!email){adminErrorEl.textContent='Masukkan email user.';adminErrorEl.style.display='block';return;}adminGrantBtnEl.disabled=true;adminGrantBtnEl.textContent='Memproses...';adminErrorEl.style.display='none';try{const{data:user}=await supabase.from('User').select('id').eq('email',email).single();if(!user){adminErrorEl.textContent='User tidak ditemukan.';adminErrorEl.style.display='block';return;}for(const m of exclusiveMangas)await supabase.from('ExclusiveAccess').upsert({userId:user.id,mangaId:m.id,mangaTitle:m.title,grantedBy:currentUser.id},{onConflict:'userId,mangaId'});adminUserEmailEl.value='';await loadAdminAccess();showToast('Akses exclusive diberikan!');}catch(err){adminErrorEl.textContent='Gagal memberikan akses.';adminErrorEl.style.display='block';}finally{adminGrantBtnEl.disabled=false;adminGrantBtnEl.textContent='Grant Exclusive Access';}});
  document.addEventListener('click',async(e)=>{const revokeBtn=e.target.closest('.btn-revoke');if(revokeBtn){await supabase.from('ExclusiveAccess').delete().eq('id',revokeBtn.dataset.id);await loadAdminAccess();showToast('Akses dihapus!');}});

  function escapeHTML2(str){const div=document.createElement('div');div.textContent=str;return div.innerHTML;}
  function timeAgo2(dateStr){const now=new Date(),then=new Date(dateStr),sec=Math.floor((now-then)/1000);if(sec<60)return'baru saja';if(sec<3600)return Math.floor(sec/60)+'m lalu';if(sec<86400)return Math.floor(sec/3600)+'j lalu';return Math.floor(sec/86400)+'h lalu';}

  // ─── INFO PAGES ───
  const infoModal = document.getElementById('info-modal');
  const infoClose = document.getElementById('info-modal-close');
  const infoTitle = document.getElementById('info-title');
  const infoContent = document.getElementById('info-content');

  const pages = {
    about: {
      title: 'Tentang Kami',
      body: `<p><strong>Mangacans</strong> adalah platform baca manga & novel online gratis. Kami hadir buat para wibu & pecinta cerita Jepang yang pengen baca tanpa ribet, tanpa bayar, dan selalu update.</p>
      <h3>Misi Kami</h3>
      <p>Menyediakan akses bacaan manga & novel gratis untuk semua orang, mendukung para kreator dengan mempromosikan karya mereka, dan membangun komunitas pembaca yang solid.</p>
      <h3>Kenapa Mangacans?</h3>
      <p>• <strong>Gratis 100%</strong> — gak ada biaya langganan<br>
      • <strong>Update rutin</strong> — chapter baru tiap minggu<br>
      • <strong>Baca online</strong> — langsung di browser, gak perlu download app<br>
      • <strong>Genre lengkap</strong> — action, romance, comedy, horror, fantasy, & banyak lagi!</p>`
    },
    contact: {
      title: 'Kontak',
      body: `<p>Ada pertanyaan, saran, atau mau ngelaporin bug? Hubungi kami di:</p>
      <p>📧 <strong>Email:</strong> <a href="mailto:admin@mangacans.com">admin@mangacans.com</a></p>
      <p>💬 <strong>Discord:</strong> Join server Discord kami buat diskusi & request manga!</p>
      <p>🐦 <strong>Twitter/X:</strong> @mangacans_id</p>
      <h3>Jam Operasional</h3>
      <p>Senin - Jumat: 09:00 - 18:00 WIB<br>Sabtu: 10:00 - 15:00 WIB<br>Minggu: Libur</p>`
    },
    faq: {
      title: 'FAQ',
      body: `<h3>Apa itu Mangacans?</h3><p>Platform baca manga & novel online gratis berbasis web.</p>
      <h3>Apakah benar-benar gratis?</h3><p>Iya! Semua konten di Mangacans bisa diakses gratis tanpa batasan.</p>
      <h3>Bagaimana cara baca manga?</h3><p>Tinggal klik card manga yang lo suka, terus pilih chapter yang pengen dibaca.</p>
      <h3>Apakah perlu daftar akun?</h3><p>Untuk baca sih gak wajib. Tapi kalo mau simpen favorite, history, & kasih rating — daftar dulu ya!</p>
      <h3>Bisa request manga/novel?</h3><p>Bisa banget! DM kami di Discord atau kirim email ke admin@mangacans.com.</p>
      <h3>Konten di Mangacans legal?</h3><p>Mangacans hanya menyediakan konten yang sudah tersedia secara publik. Kami tidak memonetisasi konten apapun.</p>`
    },
    privacy: {
      title: 'Privacy Policy',
      body: `<p><strong>Terakhir diperbarui: 8 Juni 2026</strong></p>
      <p>Mangacans menghargai privasi kamu. Halaman ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi kamu.</p>
      <h3>Data yang Kami Kumpulkan</h3>
      <p>• Email (saat mendaftar akun)<br>• Nama profil / display name<br>• Riwayat bacaan (history)<br>• Daftar favorit<br>• Rating & komentar yang kamu berikan</p>
      <h3>Bagaimana Kami Menggunakannya</h3>
      <p>• Untuk mempersonalisasi pengalaman baca kamu<br>• Untuk menyimpan progres bacaan<br>• Untuk fitur komunitas (rating & komentar)<br>• Kami <strong>TIDAK</strong> membagikan data kamu ke pihak ketiga</p>
      <h3>Keamanan</h3>
      <p>Kami menggunakan Supabase untuk autentikasi dan penyimpanan data. Semua koneksi dienkripsi dengan HTTPS.</p>
      <h3>Hak Kamu</h3>
      <p>Kamu bisa menghapus akun kapan saja dengan menghubungi admin@mangacans.com. Semua data kamu akan dihapus permanen.</p>`
    },
    terms: {
      title: 'Terms of Service',
      body: `<p><strong>Terakhir diperbarui: 8 Juni 2026</strong></p>
      <p>Dengan menggunakan Mangacans, kamu setuju dengan ketentuan berikut:</p>
      <h3>Layanan</h3>
      <p>• Mangacans menyediakan akses bacaan manga & novel secara gratis<br>• Layanan dapat berubah sewaktu-waktu tanpa pemberitahuan<br>• Akses ke beberapa fitur mungkin memerlukan pendaftaran akun</p>
      <h3>Perilaku Pengguna</h3>
      <p>• Dilarang mengunggah konten ilegal, spam, atau SARA<br>• Dilarang mencoba meretas atau merusak sistem kami<br>• Hormati sesama pengguna dalam komentar & diskusi</p>
      <h3>Hak Cipta</h3>
      <p>• Semua manga, novel, dan konten adalah milik penulis & penerbit asli<br>• Mangacans tidak mengklaim kepemilikan apapun<br>• Jika kamu pemegang hak cipta dan keberatan, hubungi kami di admin@mangacans.com</p>
      <h3>Batasan Tanggung Jawab</h3>
      <p>Mangacans tidak bertanggung jawab atas kerusakan atau kerugian yang timbul dari penggunaan layanan ini.</p>`
    }
  };

  document.querySelectorAll('.info-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      if (pages[page]) {
        infoTitle.textContent = pages[page].title;
        infoContent.innerHTML = pages[page].body;
        infoModal.classList.add('active');
      }
    });
  });

  infoClose.addEventListener('click', () => infoModal.classList.remove('active'));
  infoModal.addEventListener('click', (e) => { if (e.target === infoModal) infoModal.classList.remove('active'); });

  loadAllRatings();
});
