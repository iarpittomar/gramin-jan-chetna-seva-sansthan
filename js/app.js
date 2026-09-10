/**
 * Gramin Jan Chetna Seva Sansthan
 * Application Logic, Dynamic Payment Management, Gallery Photos/Videos, and Admin System
 */

// Default Empty News Seed (All Real User/Admin Data Driven)
const seedUpdates = [];

// Default Seed Photos & Videos
const seedPhotos = [];
const seedVideos = [];

// Default NGO Payment Details
const defaultPaymentInfo = {
  bankName: "State Bank of India (SBI)",
  accHolder: "Gramin Jan Chetna Seva Sansthan",
  accNumber: "398200100XXXX",
  ifscCode: "SBIN0000034",
  branch: "Basti Main Branch (उत्तर प्रदेश)",
  upiId: "7376487596@upi",
  qrImage: "",
  razorpayKey: "rzp_test_TaQRcpc965gt4n"
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Language Initialization
  setLanguage('hi');

  // 2. Admin Authentication State Check
  let isAdmin = sessionStorage.getItem('gjc_admin') === 'true';

  function updateAdminUI() {
    const adminBar = document.getElementById('adminBar');
    if (isAdmin) {
      document.body.classList.add('admin-mode');
      if (adminBar) adminBar.classList.add('active');
    } else {
      document.body.classList.remove('admin-mode');
      if (adminBar) adminBar.classList.remove('active');
    }
  }

  updateAdminUI();

  // Admin Login Logic (ID: adminlogin | Password: arti@123)
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminLoginModal = document.getElementById('adminLoginModal');
  const btnFooterAdmin = document.getElementById('btnFooterAdmin');
  const btnCloseAdminLogin = document.getElementById('btnCloseAdminLogin');
  const btnAdminLogout = document.getElementById('btnAdminLogout');

  if (btnFooterAdmin) {
    btnFooterAdmin.addEventListener('click', () => adminLoginModal.classList.add('active'));
  }
  if (btnCloseAdminLogin) {
    btnCloseAdminLogin.addEventListener('click', () => adminLoginModal.classList.remove('active'));
  }
  if (btnAdminLogout) {
    btnAdminLogout.addEventListener('click', () => {
      isAdmin = false;
      sessionStorage.removeItem('gjc_admin');
      updateAdminUI();
      renderUpdates();
      renderGallery();
      alert(currentLang === 'hi' ? '🔒 आप एडमिन मोड से लॉगआउट हो चुके हैं।' : '🔒 Logged out of Admin mode.');
    });
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('adminUser').value.trim();
      const pass = document.getElementById('adminPass').value.trim();

      // Credential Check: User ID: adminlogin | Password: arti@123
      if ((user === 'adminlogin' || user === 'admin') && pass === 'arti@123') {
        isAdmin = true;
        sessionStorage.setItem('gjc_admin', 'true');
        updateAdminUI();
        adminLoginModal.classList.remove('active');
        adminLoginForm.reset();
        renderUpdates();
        renderGallery();
        alert(currentLang === 'hi' ? '✅ स्वागत है! आप एडमिन (अध्यक्ष/प्रबंधक) रूप में लॉगिन हो गए हैं।' : '✅ Welcome! Successfully logged in as Admin.');
      } else {
        alert(currentLang === 'hi' ? '❌ गलत यूजर आईडी या पासवर्ड! (आईडी: adminlogin | पासवर्ड: arti@123)' : '❌ Invalid Admin ID or Password!');
      }
    });
  }

  // Admin Panel Modal Handler
  const adminPanelModal = document.getElementById('adminPanelModal');
  const btnOpenAdminPanel = document.getElementById('btnOpenAdminPanel');
  const btnCloseAdminPanel = document.getElementById('btnCloseAdminPanel');

  if (btnOpenAdminPanel) {
    btnOpenAdminPanel.addEventListener('click', () => {
      populatePaymentForm();
      adminPanelModal.classList.add('active');
    });
  }
  if (btnCloseAdminPanel) {
    btnCloseAdminPanel.addEventListener('click', () => adminPanelModal.classList.remove('active'));
  }

  // Admin Panel Sub-tabs (News / Photos / Videos / Payment)
  const adminPanelBtns = document.querySelectorAll('.admin-panel-btn');
  const adminFormPanes = document.querySelectorAll('.admin-form-pane');

  adminPanelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      adminPanelBtns.forEach(b => b.classList.remove('active'));
      adminFormPanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const targetPane = document.getElementById(btn.getAttribute('data-pane'));
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // 3. Navigation Tab Switcher
  const navLinks = document.querySelectorAll('.nav-link, .js-nav-trigger');
  const pageTabs = document.querySelectorAll('.page-tab');
  const mainNav = document.getElementById('mainNav');

  function switchTab(targetId) {
    pageTabs.forEach(tab => {
      tab.classList.toggle('active', tab.id === targetId);
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-tab') === targetId);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (mainNav && mainNav.classList.contains('active')) {
      mainNav.classList.remove('active');
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = link.getAttribute('data-tab');
      if (targetTab) {
        switchTab(targetTab);
      }
    });
  });

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mainNav.classList.toggle('active');
    });
  }

  // 4. Language Switcher Buttons
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      setLanguage(lang);
      renderUpdates();
      renderGallery();
      renderPaymentInfo();
    });
  });

  // 5. Dynamic Payment & Bank Details Storage
  let localPayment = JSON.parse(localStorage.getItem('gjc_payment_info')) || defaultPaymentInfo;

  function renderPaymentInfo() {
    const bankNameVal = document.getElementById('bankNameVal');
    const accHolderVal = document.getElementById('accHolderVal');
    const accNumVal = document.getElementById('accNumVal');
    const ifscVal = document.getElementById('ifscVal');
    const branchVal = document.getElementById('branchVal');
    const upiIdVal = document.getElementById('upiIdVal');
    const qrContainer = document.getElementById('qrContainer');
    const rzpNotice = document.getElementById('razorpaySetupNotice');

    if (bankNameVal) bankNameVal.textContent = localPayment.bankName;
    if (accHolderVal) accHolderVal.textContent = localPayment.accHolder;
    if (accNumVal) accNumVal.textContent = localPayment.accNumber;
    if (ifscVal) ifscVal.textContent = localPayment.ifscCode;
    if (branchVal) branchVal.textContent = localPayment.branch;
    if (upiIdVal) upiIdVal.textContent = `UPI ID: ${localPayment.upiId}`;

    if (rzpNotice) {
      if (localPayment.razorpayKey && localPayment.razorpayKey.trim() !== '') {
        rzpNotice.style.display = 'none';
      } else {
        rzpNotice.style.display = 'block';
      }
    }

    if (qrContainer) {
      if (localPayment.qrImage) {
        qrContainer.innerHTML = `<img src="${localPayment.qrImage}" alt="UPI QR Code" style="max-width: 180px; max-height: 180px; border-radius: 8px; border: 2px solid var(--primary-saffron); margin: 10px auto;">`;
      } else {
        qrContainer.innerHTML = `
          <div class="qr-placeholder-graphic">
            <span style="font-size: 2.2rem;">📱</span>
            <span>UPI QR CODE</span>
          </div>
        `;
      }
    }
  }

  function populatePaymentForm() {
    const editBankName = document.getElementById('editBankName');
    const editAccHolder = document.getElementById('editAccHolder');
    const editAccNum = document.getElementById('editAccNum');
    const editIfsc = document.getElementById('editIfsc');
    const editBranch = document.getElementById('editBranch');
    const editUpiId = document.getElementById('editUpiId');
    const editQrImg = document.getElementById('editQrImg');
    const editRazorpayKey = document.getElementById('editRazorpayKey');

    if (editBankName) editBankName.value = localPayment.bankName;
    if (editAccHolder) editAccHolder.value = localPayment.accHolder;
    if (editAccNum) editAccNum.value = localPayment.accNumber;
    if (editIfsc) editIfsc.value = localPayment.ifscCode;
    if (editBranch) editBranch.value = localPayment.branch;
    if (editUpiId) editUpiId.value = localPayment.upiId;
    if (editQrImg) editQrImg.value = localPayment.qrImage || '';
    if (editRazorpayKey) editRazorpayKey.value = localPayment.razorpayKey || '';
  }

  // Admin Save Payment Info Submit
  const editPaymentForm = document.getElementById('editPaymentForm');
  if (editPaymentForm) {
    editPaymentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      localPayment = {
        bankName: document.getElementById('editBankName').value,
        accHolder: document.getElementById('editAccHolder').value,
        accNumber: document.getElementById('editAccNum').value,
        ifscCode: document.getElementById('editIfsc').value,
        branch: document.getElementById('editBranch').value,
        upiId: document.getElementById('editUpiId').value,
        qrImage: document.getElementById('editQrImg').value,
        razorpayKey: document.getElementById('editRazorpayKey') ? document.getElementById('editRazorpayKey').value.trim() : ''
      };

      localStorage.setItem('gjc_payment_info', JSON.stringify(localPayment));
      renderPaymentInfo();
      if (adminPanelModal) adminPanelModal.classList.remove('active');
      alert(currentLang === 'hi' ? '✅ बैंक एवं पेमेंट (Razorpay Key) विवरण सफलतापूर्वक अपडेट हो गया!' : '✅ Bank & Payment (Razorpay Key) details updated successfully!');
    });
  }

  renderPaymentInfo();

  // 6. Daily Updates Feed & LocalStorage
  let localUpdates = JSON.parse(localStorage.getItem('gjc_updates')) || seedUpdates;

  function renderUpdates(filter = 'all') {
    const feedContainer = document.getElementById('updatesFeed');
    if (!feedContainer) return;

    feedContainer.innerHTML = '';
    const filtered = filter === 'all' ? localUpdates : localUpdates.filter(item => item.category === filter);

    if (filtered.length === 0) {
      const emptyTextHi = "अभी तक कोई गतिविधि पोस्ट नहीं की गई है। नई गतिविधि जोड़ने के लिए एडमिन पैनल का उपयोग करें।";
      const emptyTextEn = "No daily updates posted yet. Use the admin panel to post activities.";
      
      feedContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px 20px; background: white; border-radius: 12px; border: 2px dashed #CBD5E1;">
          <div style="font-size: 3rem; margin-bottom: 10px;">📢</div>
          <h3 style="color: var(--primary-saffron); font-size: 1.3rem; margin-bottom: 8px;">${currentLang === 'hi' ? 'दैनिक गतिविधियाँ उपलब्ध नहीं हैं' : 'No Daily Updates Found'}</h3>
          <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 16px auto;">${currentLang === 'hi' ? emptyTextHi : emptyTextEn}</p>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'update-card';
      card.innerHTML = `
        ${isAdmin ? `<button class="btn-delete-item" data-id="${item.id}" data-type="update" title="Delete Post">✕</button>` : ''}
        <img src="${item.image || 'assets/images/official_ngo_logo.jpg'}" alt="${item.title}" class="update-img">
        <div class="update-body">
          <div class="update-meta">
            <span class="update-tag">${getCategoryName(item.category)}</span>
            <span>📅 ${item.date}</span>
          </div>
          <h3 class="update-title">${item.title}</h3>
          <p class="update-desc">${item.desc}</p>
          <div class="update-location">📍 ${item.location}</div>
        </div>
      `;
      feedContainer.appendChild(card);
    });

    // Attach Delete Event Listeners
    if (isAdmin) {
      feedContainer.querySelectorAll('.btn-delete-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = parseInt(e.target.getAttribute('data-id'), 10);
          if (confirm(currentLang === 'hi' ? 'क्या आप इस पोस्ट को हटाना चाहते हैं?' : 'Are you sure you want to delete this post?')) {
            localUpdates = localUpdates.filter(u => u.id !== id);
            localStorage.setItem('gjc_updates', JSON.stringify(localUpdates));
            renderUpdates(filter);
          }
        });
      });
    }
  }

  function getCategoryName(cat) {
    if (cat === 'kits') return currentLang === 'hi' ? 'किट वितरण' : 'Kit Distribution';
    if (cat === 'classes') return currentLang === 'hi' ? 'निःशुल्क कक्षाएं' : 'Free Classes';
    if (cat === 'events') return currentLang === 'hi' ? 'विशेष कार्यक्रम' : 'Special Event';
    return currentLang === 'hi' ? 'गतिविधि' : 'Activity';
  }

  // Filter Buttons
  const filterBtns = document.querySelectorAll('.pill-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderUpdates(filter);
    });
  });

  renderUpdates();

  // Add Update Form Submit
  const addUpdateForm = document.getElementById('addUpdateForm');
  if (addUpdateForm) {
    addUpdateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newTitle = document.getElementById('upTitle').value;
      const newCategory = document.getElementById('upCategory').value;
      const newLocation = document.getElementById('upLocation').value;
      const newDesc = document.getElementById('upDesc').value;
      const newImg = document.getElementById('upImg').value || 'assets/images/official_ngo_logo.jpg';

      const newPost = {
        id: Date.now(),
        title: newTitle,
        category: newCategory,
        date: new Date().toLocaleDateString(currentLang === 'hi' ? 'hi-IN' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
        location: newLocation || 'बस्ती (उ.प्र.)',
        image: newImg,
        desc: newDesc
      };

      localUpdates.unshift(newPost);
      localStorage.setItem('gjc_updates', JSON.stringify(localUpdates));
      renderUpdates();
      addUpdateForm.reset();
      if (adminPanelModal) adminPanelModal.classList.remove('active');
      alert(currentLang === 'hi' ? '✅ नई गतिविधि सफलतापूर्वक पोस्ट की गई!' : '✅ Activity published successfully!');
    });
  }

  // 7. GALLERY SYSTEM (Photos & Videos Storage)
  let localPhotos = JSON.parse(localStorage.getItem('gjc_photos')) || seedPhotos;
  let localVideos = JSON.parse(localStorage.getItem('gjc_videos')) || seedVideos;

  // Gallery Subtabs Toggle (Photos vs Videos)
  let currentGalleryTab = 'photos';
  const subtabBtns = document.querySelectorAll('.subtab-btn');
  subtabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      subtabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentGalleryTab = btn.getAttribute('data-subtab');
      renderGallery();
    });
  });

  function renderGallery() {
    const photoGrid = document.getElementById('photoGrid');
    const videoGrid = document.getElementById('videoGrid');
    if (!photoGrid || !videoGrid) return;

    if (currentGalleryTab === 'photos') {
      photoGrid.style.display = 'grid';
      videoGrid.style.display = 'none';

      photoGrid.innerHTML = '';
      
      // Always show official logo card first
      const logoCard = document.createElement('div');
      logoCard.className = 'gallery-item';
      logoCard.innerHTML = `
        <img src="assets/images/official_ngo_logo.jpg" alt="Gramin Jan Chetna Seva Sansthan Official Logo">
        <div class="gallery-overlay">${currentLang === 'hi' ? 'संस्थान का अधिकृत लोगो एवं पंजीकरण बैनर' : 'Official NGO Registration Banner'}</div>
      `;
      photoGrid.appendChild(logoCard);

      localPhotos.forEach(p => {
        const card = document.createElement('div');
        card.className = 'gallery-item';
        card.innerHTML = `
          ${isAdmin ? `<button class="btn-delete-item" data-id="${p.id}" data-type="photo" title="Delete Photo">✕</button>` : ''}
          <img src="${p.url}" alt="${p.caption}">
          <div class="gallery-overlay">${p.caption}</div>
        `;
        photoGrid.appendChild(card);
      });

      // Photo Delete Listener
      if (isAdmin) {
        photoGrid.querySelectorAll('.btn-delete-item').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'), 10);
            if (confirm(currentLang === 'hi' ? 'क्या आप इस फोटो को हटाना चाहते हैं?' : 'Delete this photo?')) {
              localPhotos = localPhotos.filter(item => item.id !== id);
              localStorage.setItem('gjc_photos', JSON.stringify(localPhotos));
              renderGallery();
            }
          });
        });
      }

    } else {
      photoGrid.style.display = 'none';
      videoGrid.style.display = 'grid';

      videoGrid.innerHTML = '';

      if (localVideos.length === 0) {
        videoGrid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 40px; background: white; border-radius: 12px; border: 2px dashed #CBD5E1;">
            <div style="font-size: 3rem; margin-bottom: 10px;">🎥</div>
            <h3 style="color: var(--primary-saffron); font-size: 1.3rem;">${currentLang === 'hi' ? 'कोई वीडियो उपलब्ध नहीं है' : 'No Videos Added Yet'}</h3>
            <p style="color: var(--text-muted);">${currentLang === 'hi' ? 'प्रबंधक द्वारा जोड़े जाने वाले वीडियो यहाँ दिखाए जाएंगे।' : 'Videos added by Admin will be displayed here.'}</p>
          </div>
        `;
        return;
      }

      localVideos.forEach(v => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
          ${isAdmin ? `<button class="btn-delete-item" data-id="${v.id}" data-type="video" title="Delete Video">✕</button>` : ''}
          <div class="video-wrapper">
            ${getEmbedHtml(v.url)}
          </div>
          <div class="video-caption">${v.caption}</div>
        `;
        videoGrid.appendChild(card);
      });

      // Video Delete Listener
      if (isAdmin) {
        videoGrid.querySelectorAll('.btn-delete-item').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'), 10);
            if (confirm(currentLang === 'hi' ? 'क्या आप इस वीडियो को हटाना चाहते हैं?' : 'Delete this video?')) {
              localVideos = localVideos.filter(item => item.id !== id);
              localStorage.setItem('gjc_videos', JSON.stringify(localVideos));
              renderGallery();
            }
          });
        });
      }
    }
  }

  function getEmbedHtml(url) {
    if (!url) return '';
    // YouTube / YouTube Shorts convert
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('shorts/')) {
        videoId = url.split('shorts/')[1]?.split('?')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      } else if (url.includes('v=')) {
        videoId = new URLSearchParams(new URL(url).search).get('v');
      }
      if (videoId) {
        return `<iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>`;
      }
    }
    // Direct MP4 or iframe
    return `<video src="${url}" controls style="width:100%; height:100%; object-fit: cover;"></video>`;
  }

  renderGallery();

  // Admin Add Photo Form Submit
  const addPhotoForm = document.getElementById('addPhotoForm');
  if (addPhotoForm) {
    addPhotoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pUrl = document.getElementById('photoUrl').value;
      const pCap = document.getElementById('photoCaption').value;

      const newPhoto = {
        id: Date.now(),
        url: pUrl,
        caption: pCap || (currentLang === 'hi' ? 'संस्थान गतिविधि फोटो' : 'NGO Activity Photo')
      };

      localPhotos.unshift(newPhoto);
      localStorage.setItem('gjc_photos', JSON.stringify(localPhotos));
      renderGallery();
      addPhotoForm.reset();
      if (adminPanelModal) adminPanelModal.classList.remove('active');
      alert(currentLang === 'hi' ? '✅ फोटो गैलरी में सफलतापूर्वक जोड़ी गई!' : '✅ Photo added to gallery!');
    });
  }

  // Admin Add Video Form Submit
  const addVideoForm = document.getElementById('addVideoForm');
  if (addVideoForm) {
    addVideoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const vUrl = document.getElementById('videoUrl').value;
      const vCap = document.getElementById('videoCaption').value;

      const newVideo = {
        id: Date.now(),
        url: vUrl,
        caption: vCap || (currentLang === 'hi' ? 'संस्थान गतिविधि वीडियो' : 'NGO Activity Video')
      };

      localVideos.unshift(newVideo);
      localStorage.setItem('gjc_videos', JSON.stringify(localVideos));
      currentGalleryTab = 'videos';
      document.querySelectorAll('.subtab-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-subtab') === 'videos');
      });
      renderGallery();
      addVideoForm.reset();
      if (adminPanelModal) adminPanelModal.classList.remove('active');
      alert(currentLang === 'hi' ? '✅ वीडियो गैलरी में सफलतापूर्वक जोड़ा गया!' : '✅ Video added to gallery!');
    });
  }

  // 8. Custom Donation Amount Handler (₹1 to ₹1,00,000+)
  const donationInput = document.getElementById('customDonationInput');
  const impactText = document.getElementById('impactPreviewText');

  function updateImpactMessage(val) {
    if (!impactText) return;
    const amount = parseInt(val, 10);
    if (!amount || amount < 1) {
      impactText.textContent = currentLang === 'hi' ? 
        '💡 कृपया अपनी दान राशि दर्ज करें (₹1 या अधिक)' : 
        '💡 Please enter a valid donation amount (₹1 or more)';
      return;
    }

    if (currentLang === 'hi') {
      impactText.textContent = `✨ ₹${amount.toLocaleString('hi-IN')} का सहयोग: यह संपूर्ण राशि सीधे बस्ती के जरूरतमंद बच्चों की निःशुल्क प्राथमिक शिक्षा, कॉपी और किताबों के लिए प्रयोग में लाई जाएगी।`;
    } else {
      impactText.textContent = `✨ ₹${amount.toLocaleString('en-IN')} donation: 100% of your contribution will directly fund free basic education, books, and stationery kits for underprivileged children in Basti.`;
    }
  }

  if (donationInput) {
    donationInput.addEventListener('input', (e) => updateImpactMessage(e.target.value));
    updateImpactMessage(donationInput.value);
  }

  // 9. Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert(currentLang === 'hi' ?
        '✅ धन्यवाद! आपका संदेश सफलतापूर्वक प्राप्त हो गया है। आरती जायसवाल एवं संस्थान टीम जल्द आपसे संपर्क करेगी।' :
        '✅ Thank you! Your message has been received successfully. Our team will contact you shortly.');
      contactForm.reset();
    });
  }

  // Razorpay Pay Now Button Handler
  const btnRazorpayPay = document.getElementById('btnRazorpayPay');
  if (btnRazorpayPay) {
    btnRazorpayPay.addEventListener('click', () => {
      const amount = parseInt(donInputEl ? donInputEl.value : 100) || 100;
      if (amount < 1) {
        alert(currentLang === 'hi' ? 'कृपया ₹1 या अधिक दान राशि दर्ज करें।' : 'Please enter a valid donation amount.');
        return;
      }
      
      const rzpKey = localPayment.razorpayKey ? localPayment.razorpayKey.trim() : '';
      if (!rzpKey) {
        alert(currentLang === 'hi' ? 
          '⚠️ Razorpay Key अभी सेट नहीं है!\n\n1. Admin Panel में जाएं (आईडी: adminlogin | पासवर्ड: arti@123)\n2. Edit Payment ➔ अपनी Razorpay Key (rzp_live_xxx) दर्ज करके Save करें।\n\nतब तक आप नीचे "UPI QR से स्कैन करके पेमेंट करें" बटन का प्रयोग कर सकते हैं।' : 
          '⚠️ Razorpay Key is not configured yet!\n\nPlease add your Razorpay Key ID in Admin Panel ➔ Edit Payment, or use UPI QR Code below.');
        return;
      }

      const donorName = document.getElementById('donorNameInput') ? document.getElementById('donorNameInput').value.trim() : '';
      const donorPhone = document.getElementById('donorPhoneInput') ? document.getElementById('donorPhoneInput').value.trim() : '';

      const options = {
        key: rzpKey,
        amount: amount * 100, // amount in paise
        currency: "INR",
        name: "Gramin Jan Chetna Seva Sansthan",
        description: currentLang === 'hi' ? "निःशुल्क शिक्षा एवं किट वितरण हेतु दान" : "Donation for Free Education & Kit Distribution",
        image: "assets/images/official_ngo_logo.jpg",
        handler: function (response) {
          alert((currentLang === 'hi' ? '🎉 धन्यवाद! आपका दान सफलतापूर्वक प्राप्त हुआ। Payment ID: ' : '🎉 Thank you! Your donation was successful. Payment ID: ') + response.razorpay_payment_id);
          var whatsappURL = 'https://wa.me/917376487596?text=' + encodeURIComponent('🎉 *दान प्राप्त हुआ (Razorpay)*\n\n' +
            '👤 *दाता का नाम:* ' + (donorName || 'गुप्त दानदाता') + '\n' +
            '💰 *राशि:* ₹' + amount + '\n' +
            '🔑 *Payment ID:* ' + response.razorpay_payment_id + '\n' +
            '📱 *मोबाइल:* ' + (donorPhone || 'नहीं दिया'));
          window.open(whatsappURL, '_blank');
        },
        prefill: {
          name: donorName,
          contact: donorPhone
        },
        theme: {
          color: "#2E7D32"
        }
      };

      if (typeof Razorpay !== 'undefined') {
        const rzp1 = new Razorpay(options);
        rzp1.open();
      } else {
        alert('Razorpay Checkout SDK is loading, please try again in a few seconds.');
      }
    });
  }

  // 10. Dynamic UPI QR Code Generation & Payment Confirmation Flow
  let currentQRInstance = null;
  let currentDonationAmount = 100;

  const btnGenerateQR   = document.getElementById('btnGenerateQR');
  const btnRegenerateQR = document.getElementById('btnRegenerateQR');
  const btnIPaid        = document.getElementById('btnIPaid');
  const btnConfirmPay   = document.getElementById('btnConfirmPayment');
  const btnBackToQR     = document.getElementById('btnBackToQR');

  const statePrompt     = document.getElementById('qrPromptState');
  const stateGenerated  = document.getElementById('qrGeneratedState');
  const stateConfirm    = document.getElementById('qrConfirmState');
  const stateSuccess    = document.getElementById('qrSuccessState');
  const qrAmountLabel   = document.getElementById('qrAmountLabel');
  const upiQrCode       = document.getElementById('upiQrCode');
  const donInputEl      = document.getElementById('customDonationInput');

  function showQRState(which) {
    [statePrompt, stateGenerated, stateConfirm, stateSuccess].forEach(function(el) {
      if (el) el.style.display = 'none';
    });
    if (which) which.style.display = 'block';
  }

  function generateUPIQR() {
    const amount = parseInt(donInputEl ? donInputEl.value : 100) || 100;
    if (amount < 1) { alert('कृपया ₹1 या अधिक राशि दर्ज करें।'); return; }
    currentDonationAmount = amount;

    // Get current UPI ID from localStorage or default
    const payInfo = JSON.parse(localStorage.getItem('gjc_payment_info') || '{}');
    const upiId = payInfo.upiId || '7376487596@upi';
    const payeeName = encodeURIComponent('Gramin Jan Chetna Seva Sansthan');
    const note = encodeURIComponent('Donation - Gramin Jan Chetna Seva Sansthan');

    // UPI deep link - when scanned, opens UPI app with exact amount pre-filled
    const upiLink = 'upi://pay?pa=' + upiId + '&pn=' + payeeName + '&am=' + amount + '&cu=INR&tn=' + note;

    // Clear old QR
    if (upiQrCode) upiQrCode.innerHTML = '';
    currentQRInstance = null;

    // Generate new QR using QRCode.js
    if (typeof QRCode !== 'undefined' && upiQrCode) {
      currentQRInstance = new QRCode(upiQrCode, {
        text: upiLink,
        width: 200,
        height: 200,
        colorDark: '#1a1a1a',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    } else {
      // Fallback: show QR via Google Charts API
      if (upiQrCode) {
        const img = document.createElement('img');
        img.src = 'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=' + encodeURIComponent(upiLink) + '&choe=UTF-8';
        img.alt = 'UPI QR Code';
        img.style.width = '200px';
        img.style.height = '200px';
        upiQrCode.appendChild(img);
      }
    }

    if (qrAmountLabel) {
      qrAmountLabel.textContent = '\u20b9' + amount.toLocaleString('en-IN') + ' \u0915\u093e UPI QR';
    }

    showQRState(stateGenerated);
  }

  if (btnGenerateQR) {
    btnGenerateQR.addEventListener('click', generateUPIQR);
  }

  if (btnRegenerateQR) {
    btnRegenerateQR.addEventListener('click', function() {
      showQRState(statePrompt);
    });
  }

  if (btnIPaid) {
    btnIPaid.addEventListener('click', function() {
      var nameEl  = document.getElementById('payerName');
      var utrEl   = document.getElementById('payerUTR');
      var phoneEl = document.getElementById('payerPhone');
      if (nameEl)  nameEl.value  = '';
      if (utrEl)   utrEl.value   = '';
      if (phoneEl) phoneEl.value = '';
      showQRState(stateConfirm);
    });
  }

  if (btnBackToQR) {
    btnBackToQR.addEventListener('click', function() {
      showQRState(stateGenerated);
    });
  }

  if (btnConfirmPay) {
    btnConfirmPay.addEventListener('click', function() {
      var nameEl  = document.getElementById('payerName');
      var utrEl   = document.getElementById('payerUTR');
      var phoneEl = document.getElementById('payerPhone');

      var name  = nameEl  ? nameEl.value.trim()  : '';
      var utr   = utrEl   ? utrEl.value.trim()   : '';
      var phone = phoneEl ? phoneEl.value.trim()  : '';

      if (!name) { alert('\u0915\u0943\u092a\u092f\u093e \u0905\u092a\u0928\u093e \u0928\u093e\u092e \u0926\u0930\u094d\u091c \u0915\u0930\u0947\u0902\u0964'); return; }
      if (!utr)  { alert('\u0915\u0943\u092a\u092f\u093e UTR / Transaction ID \u0926\u0930\u094d\u091c \u0915\u0930\u0947\u0902\u0964'); return; }

      // Build WhatsApp message to NGO
      var msg =
        '\ud83c\udf89 *\u0926\u093e\u0928 \u092a\u094d\u0930\u093e\u092a\u094d\u0924\u093f \u0938\u0942\u091a\u0928\u093e - Gramin Jan Chetna Seva Sansthan*\n\n' +
        '\ud83d\udc64 *\u0926\u093e\u0924\u093e \u0915\u093e \u0928\u093e\u092e:* ' + name + '\n' +
        '\ud83d\udcb0 *\u0926\u093e\u0928 \u0930\u093e\u0936\u093f:* \u20b9' + currentDonationAmount.toLocaleString('en-IN') + '\n' +
        '\ud83d\udd11 *UTR / Transaction ID:* ' + utr + '\n' +
        '\ud83d\udcf1 *\u092e\u094b\u092c\u093e\u0907\u0932:* ' + (phone || '\u0928\u0939\u0940\u0902 \u0926\u093f\u092f\u093e') + '\n\n' +
        '\u0915\u0943\u092a\u092f\u093e \u0907\u0938 \u092d\u0941\u0917\u0924\u093e\u0928 \u0915\u0940 \u092a\u0941\u0937\u094d\u091f\u093f \u0915\u0930\u0947\u0902\u0964 \u0927\u0928\u094d\u092f\u0935\u093e\u0926! \ud83d\ude4f';

      var whatsappURL = 'https://wa.me/917376487596?text=' + encodeURIComponent(msg);

      // Update success screen
      var successMsg = document.getElementById('successMsg');
      if (successMsg) {
        successMsg.textContent = name + ' \u091c\u0940, \u20b9' + currentDonationAmount.toLocaleString('en-IN') + ' \u0915\u093e \u0926\u093e\u0928 \u0926\u0930\u094d\u091c \u0915\u093f\u092f\u093e \u0917\u092f\u093e\u0964 UTR: ' + utr;
      }
      var waLink = document.getElementById('whatsappConfirmLink');
      if (waLink) waLink.href = whatsappURL;

      showQRState(stateSuccess);

      // Auto-open WhatsApp
      window.open(whatsappURL, '_blank');
    });
  }

  // Press Enter on donation input to generate QR
  if (donInputEl) {
    donInputEl.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') { e.preventDefault(); generateUPIQR(); }
    });
  }

});
