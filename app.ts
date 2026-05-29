/* Interactive systems for Krishnaite Global Academy */
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://xzuharogabpeumqpjoib.supabase.co';
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_DczjutUY01_TpXmXUifVGQ_vby6-SLt';

const supabase = createBrowserClient(supabaseUrl, supabaseKey);


document.addEventListener('DOMContentLoaded', () => {
  initHeroParallax();
  initBackgroundElements();
  initHeaderScroll();
  initTrackPanelTilt();
  initSmoothScroll();
  initModalControls();
  if (window.location.pathname.includes('dashboard.html')) {
    initDashboardController();
  }
});

/**
 * 1. Hero Zone Mouse Parallax
 * Implements anti-gravity weightless card movement.
 * The card shifts relative to the cursor, but its shadow offsets in reverse
 * to maintain a fixed physical coordinate on the screen.
 */
function initHeroParallax() {
  const interactiveZone = document.getElementById('hero-interactive-zone');
  if (!interactiveZone) return;

  const floatCards = interactiveZone.querySelectorAll('.floating-card, .suspended-node, .forge-container');
  
  interactiveZone.addEventListener('mousemove', (e) => {
    const rect = interactiveZone.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Normalize coordinates (-1 to 1)
    const normX = x / (rect.width / 2);
    const normY = y / (rect.height / 2);

    floatCards.forEach(card => {
      const element = card as HTMLElement;
      const speed = parseFloat(element.getAttribute('data-speed') || '1.5') || 1.5;
      
      // Calculate shifts
      const cardShiftX = normX * 15 * speed;
      const cardShiftY = normY * 15 * speed;
      
      // Apply translation
      element.style.transform = `translate(${cardShiftX}px, ${cardShiftY}px)`;
      
      // Adjust shadow offset in reverse to make shadow stay physically fixed
      if (element.classList.contains('floating-card')) {
        const defaultShadowOffset = 12; // 12px default
        const newShadowX = defaultShadowOffset - cardShiftX;
        const newShadowY = defaultShadowOffset - cardShiftY;
        element.style.boxShadow = `${newShadowX}px ${newShadowY}px 0px var(--black-shadow)`;
      }
    });
  });

  // Reset positions smoothly on mouse leave
  interactiveZone.addEventListener('mouseleave', () => {
    floatCards.forEach(card => {
      const element = card as HTMLElement;
      element.style.transform = '';
      if (element.classList.contains('floating-card')) {
        element.style.boxShadow = '12px 12px 0px var(--black-shadow)';
      }
    });
  });
}

/**
 * 2. Background Elements (Spawning floating geometric shapes and particles)
 */
function initBackgroundElements() {
  const canvas = document.querySelector('.canvas-bg');
  if (!canvas) return;

  // Spawning dynamic small particle points
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = `${Math.random() * 6 + 3}px`;
    particle.style.height = particle.style.width;
    particle.style.backgroundColor = Math.random() > 0.5 ? 'var(--gold)' : 'var(--red)';
    particle.style.border = '1px solid var(--black)';
    particle.style.borderRadius = '50%';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.opacity = `${Math.random() * 0.4 + 0.2}`;
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '-2';
    
    // Custom float behavior
    const duration = Math.random() * 20 + 15;
    const delay = Math.random() * -10;
    particle.style.animation = `drift ${duration}s linear infinite ${delay}s alternate`;
    
    // Dynamically inject custom dynamic drift frames
    canvas.appendChild(particle);
  }

  // Perspective Grid Tilting based on mouse moves globally
  document.addEventListener('mousemove', (e) => {
    const grid = document.getElementById('grid') as HTMLElement;
    if (!grid) return;
    
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    const mouseX = (e.clientX - w / 2) / (w / 2);
    const mouseY = (e.clientY - h / 2) / (h / 2);
    
    // Tilt the grid slightly
    grid.style.transform = `perspective(600px) rotateX(${45 + mouseY * 6}deg) rotateY(${mouseX * 4}deg) translateY(${mouseY * 10}px)`;
  });
}

// Drifting animation stylesheet injections (for standard compatibility)
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
@keyframes drift {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    transform: translate(${Math.random() * 80 - 40}px, ${Math.random() * -180 - 50}px) rotate(${Math.random() * 360}deg);
  }
}
`;
document.head.appendChild(styleSheet);

/**
 * 3. Sticky Header Scroll Animations
 */
function initHeaderScroll() {
  const header = document.getElementById('main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.padding = '10px 24px';
      header.style.top = '12px';
      header.style.background = 'var(--white-glass)';
      header.style.boxShadow = '4px 4px 0px var(--black)';
    } else {
      header.style.padding = '16px 32px';
      header.style.top = '24px';
      header.style.background = 'var(--white-glass)';
      header.style.boxShadow = '6px 6px 0px var(--black)';
    }
  });
}

/**
 * 4. Interactive Track Panel tilting and floating highlights
 */
function initTrackPanelTilt() {
  const panels = document.querySelectorAll('.track-panel');
  
  panels.forEach(panel => {
    const element = panel as HTMLElement;
    element.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within element
      const y = e.clientY - rect.top;  // y position within element
      
      const percentX = (x / rect.width - 0.5) * 2; // -1 to 1
      const percentY = (y / rect.height - 0.5) * 2; // -1 to 1
      
      // Tilt the panel slightly toward the cursor
      element.style.transform = `perspective(800px) rotateY(${percentX * 5}deg) rotateX(${-percentY * 5}deg) translateY(-12px) scale(1.01)`;
      
      // Keep shadows in reverse
      const shadowX = 16 - percentX * 8;
      const shadowY = 16 - percentY * 8;
      element.style.boxShadow = `${shadowX}px ${shadowY}px 0px var(--black-shadow)`;
      
      // Glowing highlight spot inside border
      if (element.classList.contains('sovereign-path')) {
        element.style.borderColor = `hsl(47, 75%, ${50 + percentX * 10}%)`;
      } else {
        element.style.borderColor = `hsl(359, 75%, ${52 + percentX * 10}%)`;
      }
    });

    element.addEventListener('mouseleave', () => {
      // Smooth reset
      element.style.transform = '';
      element.style.boxShadow = '16px 16px 0px var(--black-shadow)';
      element.style.borderColor = '';
    });
  });
}

/**
 * 5. Smooth scroll linking for nav anchors
 */
function initSmoothScroll() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach(anchor => {
    const element = anchor as HTMLAnchorElement;
    element.addEventListener('click', function(e) {
      const targetId = element.getAttribute('href');
      if (!targetId || targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * 6. Standalone Detail Page Controls & Entrance CTA
 */
function initModalControls() {
  // Redirect Entrance Exam CTAs straight to the admissions portal
  const examBtn = document.getElementById('initiate-exam-btn');
  if (examBtn) {
    examBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'admissions-portal.html';
    });
  }

  const scarcityBtn = document.getElementById('scarcity-exam-btn');
  if (scarcityBtn) {
    scarcityBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'admissions-portal.html';
    });
  }

  const fellowshipBtn = document.getElementById('fellowship-apply-btn');
  if (fellowshipBtn) {
    fellowshipBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Fellowship Application gateway is opening. Please prepare your verified academic and financial credentials.');
    });
  }

  // Supabase client is initialized globally at the top of the file using @supabase/ssr

  // Handle email verification link logic on load
  const urlParams = new URLSearchParams(window.location.search);
  const rawToken = urlParams.get('token');
  const token = rawToken ? rawToken.replace(/[\s\n\r]/g, '').replace(/%0A/gi, '') : null;
  const manifestForm = document.getElementById('manifest-form');
  const portalConsole = document.querySelector('.portal-console');
  const modalHeader = document.querySelector('.modal-header');

  // Check active Supabase Auth session (triggered after email confirmation redirect or Google OAuth)
  const checkSession = async () => {
    if (!supabase) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user && modalHeader) {
        const user = session.user;
        let verifiedName = user.user_metadata?.full_name || user.user_metadata?.name || "Candidate";
        let verifiedKId = user.user_metadata?.k_id || "";

        // 1. Try to find existing registration in registrations/applicants
        try {
          let foundRecord: any = null;
          let isRegistrations = true;
          
          if (user.email) {
            // Check registrations table first
            const { data: regData, error: regErr } = await supabase.from('registrations').select('*').eq('email', user.email);
            if (!regErr && regData && regData.length > 0) {
              foundRecord = regData[0];
              isRegistrations = true;
            } else {
              // Check applicants table as fallback
              const { data: appData, error: appErr } = await supabase.from('applicants').select('*').eq('email', user.email);
              if (!appErr && appData && appData.length > 0) {
                foundRecord = appData[0];
                isRegistrations = false;
              }
            }
          }

          if (foundRecord) {
            verifiedKId = foundRecord.k_id || verifiedKId;
            verifiedName = foundRecord.name || verifiedName;
            
            // Ensure verified is set to true
            if (!foundRecord.verified && user.email) {
              const table = isRegistrations ? 'registrations' : 'applicants';
              await supabase.from(table).update({ verified: true }).eq('email', user.email);
            }
          } else if (user.email) {
            // No record found: this is a Google OAuth sign-in for the first time!
            // Let's generate a unique Krishnaite ID
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            verifiedKId = `KGA-ID-${randomNum}`;
            
            const record = {
              name: verifiedName,
              email: user.email,
              phone: user.phone || "",
              k_id: verifiedKId,
              verification_token: "",
              verified: true
            };

            // Insert into registrations first, fallback to applicants
            const { error: err1 } = await supabase.from('registrations').insert([record]);
            if (err1) {
              console.warn("registrations insert failed on session check, trying applicants:", err1);
              await supabase.from('applicants').insert([record]);
            }
            
            // Also attempt to update the Supabase Auth user metadata with the generated k_id
            // so that subsequent auth sessions can retrieve it instantly!
            try {
              await supabase.auth.updateUser({
                data: { k_id: verifiedKId }
              });
            } catch (metaErr) {
              console.warn("Could not update auth user metadata:", metaErr);
            }
          }
        } catch (e) {
          console.error("Error syncing Google OAuth session with registrations table:", e);
        }

        if (!verifiedKId) {
          verifiedKId = "KGA-ID-TEMP";
        }

        if (manifestForm) (manifestForm as HTMLElement).style.display = 'none';
        if (portalConsole) (portalConsole as HTMLElement).style.display = 'none';
        const loginForm = document.getElementById('login-form');
        if (loginForm) (loginForm as HTMLElement).style.display = 'none';

        modalHeader.innerHTML = `
          <span class="modal-badge" style="background: var(--black); color: var(--gold); border-color: var(--gold);">Identity Verified</span>
          <h2 style="font-size: 2.2rem; font-family: var(--font-serif); margin-bottom: 24px; color: var(--black);">Verification Successful</h2>
          <p class="modal-intro">
            Welcome to the Academy, <strong>${verifiedName}</strong>. Your permanent active credentials have been verified.<br>
            Your unique Krishnaite ID: <strong style="color: var(--red); font-size: 1.15rem;">${verifiedKId}</strong> is now fully activated.
          </p>
          <p class="modal-intro" style="font-size: 0.85rem; font-style: italic; color: var(--red); margin-top: 20px;">
            Unlocking manifest... Redirecting to your personal KGA Dashboard in 3 seconds.
          </p>
          <div class="modal-cta-box" style="margin-top: 24px; display: flex; justify-content: center;">
            <a href="dashboard.html" class="entrance-exam-btn" style="text-decoration: none; background: var(--red); color: var(--bg-peach); border-color: var(--black);">
              Proceed to Dashboard
            </a>
          </div>
        `;
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 3000);
      }
    } catch (err) {
      console.error("Session verification fetch failed:", err);
    }
  };
  checkSession();

  if (token && modalHeader) {
    if (manifestForm) (manifestForm as HTMLElement).style.display = 'none';
    if (portalConsole) (portalConsole as HTMLElement).style.display = 'none';
    const loginForm = document.getElementById('login-form');
    if (loginForm) (loginForm as HTMLElement).style.display = 'none';
    
    modalHeader.innerHTML = `
      <span class="modal-badge" style="background: var(--black); color: var(--gold); border-color: var(--gold);">Identity Authenticating</span>
      <h2>Verifying your credentials...</h2>
      <p class="modal-intro">Initiating secure gate verification. Please hold.</p>
    `;

    // Perform database lookups
    const handleVerification = async () => {
      let verifiedName = "Candidate";
      let verifiedKId = "KGA-ID-TEMP";
      let success = false;

      // 1. Try local cache match first
      const cachedData = localStorage.getItem('kga_applicants');
      if (cachedData) {
        try {
          const records = JSON.parse(cachedData);
          for (let r of records) {
            const cleanCachedToken = r.verification_token ? r.verification_token.replace(/[\s\n\r]/g, '') : '';
            if (cleanCachedToken === token) {
              r.verified = true;
              verifiedName = r.name;
              verifiedKId = r.k_id;
              success = true;
              localStorage.setItem('kga_applicants', JSON.stringify(records));
              break;
            }
          }
        } catch (e) {
          console.error("Local verify error", e);
        }
      }

      // 2. Try Supabase Sync next
      if (supabase) {
        try {
          // Check registrations table
          const { data: regData } = await supabase.from('registrations').select('*');
          if (regData && regData.length > 0) {
            const matched = regData.find((r: any) => (r.verification_token ? r.verification_token.replace(/[\s\n\r]/g, '') : '') === token);
            if (matched) {
              verifiedName = matched.name;
              verifiedKId = matched.k_id;
              await supabase.from('registrations').update({ verified: true }).eq('id', matched.id);
              success = true;
            }
          }
          
          if (!success) {
            // Check applicants table
            const { data: appData } = await supabase.from('applicants').select('*');
            if (appData && appData.length > 0) {
              const matched = appData.find((r: any) => (r.verification_token ? r.verification_token.replace(/[\s\n\r]/g, '') : '') === token);
              if (matched) {
                verifiedName = matched.name;
                verifiedKId = matched.k_id;
                await supabase.from('applicants').update({ verified: true }).eq('id', matched.id);
                success = true;
              }
            }
          }
        } catch (err) {
          console.error("Supabase verification error", err);
        }
      }

      if (success) {
        modalHeader.innerHTML = `
          <span class="modal-badge" style="background: var(--black); color: var(--gold); border-color: var(--gold);">Identity Verified</span>
          <h2 style="font-size: 2.2rem; font-family: var(--font-serif); margin-bottom: 24px; color: var(--black);">Verification Successful</h2>
          <p class="modal-intro">
            Welcome to the Academy, <strong>${verifiedName}</strong>. Your permanent active credentials have been verified.<br>
            Your unique Krishnaite ID: <strong style="color: var(--red); font-size: 1.15rem;">${verifiedKId}</strong> is now fully activated.
          </p>
          <p class="modal-intro" style="font-size: 0.85rem; font-style: italic; color: var(--red); margin-top: 20px;">
            Unlocking manifest... Redirecting to your personal KGA Dashboard in 3 seconds.
          </p>
          <div class="modal-cta-box" style="margin-top: 24px; display: flex; justify-content: center;">
            <a href="dashboard.html" class="entrance-exam-btn" style="text-decoration: none; background: var(--red); color: var(--bg-peach); border-color: var(--black);">
              Proceed to Dashboard
            </a>
          </div>
        `;
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 3000);
      } else {
        modalHeader.innerHTML = `
          <span class="modal-badge" style="background: var(--black); color: var(--red); border-color: var(--red);">Verification Failed</span>
          <h2>Authentication Failed</h2>
          <p class="modal-intro" style="color: var(--red);">The verification token is invalid or has expired.</p>
          <div class="modal-cta-box" style="margin-top: 24px; display: flex; justify-content: center;">
            <a href="admissions-portal.html" class="entrance-exam-btn" style="text-decoration: none; background: var(--black); color: var(--bg-peach); border-color: var(--black);">
              Back to Portal
            </a>
          </div>
        `;
      }
    };
    handleVerification();
  }

  // Admissions Portal Form Toggles
  const portalLoginBtn = document.getElementById('portal-login-btn');
  const portalCreateBtn = document.getElementById('portal-create-btn');
  const loginForm = document.getElementById('login-form');

  if (manifestForm && loginForm) {
    // Initial State: Create ID Manifest form is active, Login is hidden
    (manifestForm as HTMLElement).style.display = 'block';
    (loginForm as HTMLElement).style.display = 'none';
    if (portalCreateBtn) portalCreateBtn.classList.add('active');
    if (portalLoginBtn) portalLoginBtn.classList.remove('active');
  }

  if (portalLoginBtn && portalCreateBtn && manifestForm && loginForm) {
    portalLoginBtn.addEventListener('click', () => {
      portalLoginBtn.classList.add('active');
      portalCreateBtn.classList.remove('active');
      (loginForm as HTMLElement).style.display = 'block';
      (manifestForm as HTMLElement).style.display = 'none';
    });

    portalCreateBtn.addEventListener('click', () => {
      portalCreateBtn.classList.add('active');
      portalLoginBtn.classList.remove('active');
      (manifestForm as HTMLElement).style.display = 'block';
      (loginForm as HTMLElement).style.display = 'none';
    });

    // 1. Authenticate login manifest
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = (document.getElementById('login-email') as HTMLInputElement).value.trim();
      const k_id = (document.getElementById('login-k-id') as HTMLInputElement).value.trim();
      
      let found = false;
      let name = "Candidate";
      let verified = false;

      // Primary: Authenticate using real Supabase Auth
      if (supabase) {
        try {
          const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
            email: email,
            password: k_id // Since their password is their Krishnaite ID
          });

          if (!authErr && authData.user) {
            found = true;
            name = authData.user.user_metadata?.name || "Candidate";
            verified = authData.user.email_confirmed_at ? true : false;
          }
        } catch (err) {
          console.error("Supabase Auth signin fail:", err);
        }
      }

      // Secondary Fallback: Query registrations custom table directly if auth was bypassed
      if (!found && supabase) {
        try {
          const { data: regData } = await supabase.from('registrations').select('*').eq('email', email);
          if (regData && regData.length > 0) {
            const matched = regData.find((r: any) => (r.k_id ? r.k_id.replace(/[\s]/g, '') : '') === k_id.replace(/[\s]/g, ''));
            if (matched) {
              found = true;
              name = matched.name;
              verified = matched.verified;
            }
          }
        } catch (err) {
          console.error("Supabase table fallback check failed:", err);
        }
      }

      // Tertiary Fallback: Query Local Cache
      if (!found) {
        const cachedData = localStorage.getItem('kga_applicants');
        if (cachedData) {
          try {
            const records = JSON.parse(cachedData);
            for (let r of records) {
              const cleanKId = r.k_id ? r.k_id.replace(/[\s]/g, '') : '';
              if (r.email === email && cleanKId === k_id.replace(/[\s]/g, '')) {
                found = true;
                name = r.name;
                verified = r.verified;
                break;
              }
            }
          } catch (e) {}
        }
      }

      if (found) {
        if (verified) {
          alert(`Welcome back, ${name}.\n\nIdentity authenticated successfully.\nProceeding to your KGA Dashboard...`);
          window.location.href = 'dashboard.html';
        } else {
          alert(`Identity Manifest Found for ${name}.\n\nHowever, email verification is still pending.\nPlease verify your email via the link sent to your inbox.`);
        }
      } else {
        alert("Identity manifest not found.\nPlease register a new Krishnaite ID or check your credentials.");
      }
    });



    // 2. Google OAuth Integration
    const googleBtns = document.querySelectorAll('.google-auth-btn');
    googleBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!supabase) {
          alert("Supabase client is not initialized.");
          return;
        }
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}${window.location.pathname}`
            }
          });
          if (error) {
            console.error("Google Auth failed:", error.message);
            alert("Google Authentication failed. Please try again.");
          }
        } catch (err) {
          console.error("Google Auth error:", err);
        }
      });
    });
  }
}

/**
 * 9. KGA Applicant Dashboard Controller
 * Manages applicant application status, fellowships modal claims, dossiers uploader, 
 * active session synchronization, and dynamically unlocks the entrance exam.
 */
async function initDashboardController() {
  if (!supabase) return;

  // 1. Session Protection Filter
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || !session.user) {
    alert("Unauthorized session. Please authenticate your identity first.");
    window.location.href = "admissions-portal.html";
    return;
  }

  const user = session.user;
  const email = user.email || "";

  // Dynamic DOM Bindings
  const candidateName = document.getElementById('candidate-name');
  const candidateId = document.getElementById('candidate-id');
  const btnLogout = document.getElementById('btn-logout');
  
  // Dashboard Status LEDs
  const statusTrackLed = document.getElementById('status-track-led');
  const statusTrackText = document.getElementById('status-track-text');
  const statusExamLed = document.getElementById('status-exam-led');
  const statusExamText = document.getElementById('status-exam-text');

  // Sidebar Menu Nav Active states
  const draftsCountEl = document.getElementById('drafts-count');
  
  // Quick Actions cards and buttons
  const cardPrograms = document.getElementById('card-programs');
  const btnStartApp = document.getElementById('btn-start-app');
  
  const cardFellowships = document.getElementById('card-fellowships');
  const btnClaimGrant = document.getElementById('btn-claim-grant');
  
  const cardDocuments = document.getElementById('card-documents');
  const btnUploadDocs = document.getElementById('btn-upload-docs');
  
  const cardExam = document.getElementById('card-exam');
  const btnStartExam = document.getElementById('btn-start-exam');
  const examIconSvg = document.getElementById('exam-icon-svg');

  // Notification Bell Controls
  const bellBtn = document.getElementById('bell-btn');
  const bellTray = document.getElementById('bell-tray');
  const bellBadge = document.getElementById('bell-badge');

  // Bottom Application Status Canvas
  const emptyState = document.getElementById('empty-state');
  const draftState = document.getElementById('draft-state');
  const draftTitleText = document.getElementById('draft-title-text');
  const progressBar = document.getElementById('progress-bar');
  const progressPercent = document.getElementById('progress-percent');
  const detailTrackName = document.getElementById('detail-track-name');
  const detailFellowshipStatus = document.getElementById('detail-fellowship-status');
  const detailDocsStatus = document.getElementById('detail-docs-status');
  const btnDiscardDraft = document.getElementById('btn-discard-draft');
  const btnSubmitApplication = document.getElementById('btn-submit-application');

  // Modals Overlay Elements
  const modalPrograms = document.getElementById('modal-programs');
  const closeProgramsModal = document.getElementById('close-programs-modal');
  const btnCancelPrograms = document.getElementById('btn-cancel-programs');
  const selectTrackSovereign = document.getElementById('select-track-sovereign');
  const selectTrackVanguard = document.getElementById('select-track-vanguard');

  const modalFellowships = document.getElementById('modal-fellowships');
  const closeFellowshipsModal = document.getElementById('close-fellowships-modal');
  const btnCancelFellowships = document.getElementById('btn-cancel-fellowships');
  const claimGrantMerit = document.getElementById('claim-grant-merit');
  const claimGrantEquity = document.getElementById('claim-grant-equity');
  const claimGrantNone = document.getElementById('claim-grant-none');

  const modalDocuments = document.getElementById('modal-documents');
  const closeDocumentsModal = document.getElementById('close-documents-modal');
  const btnCloseVaultModal = document.getElementById('btn-close-vault-modal');
  const uploadDropzone = document.getElementById('upload-dropzone');
  const fileUploaderInput = document.getElementById('file-uploader-input') as HTMLInputElement;
  const uploadedDossierList = document.getElementById('uploaded-dossier-list');

  // 4-Year Sovereign Forge Manifest Modal DOM Bindings
  const modalSovereignManifest = document.getElementById('modal-sovereign-manifest');
  const closeManifestModal = document.getElementById('close-manifest-modal');
  const btnCancelManifest = document.getElementById('btn-cancel-manifest');
  const btnSubmitManifest = document.getElementById('btn-submit-manifest');
  const manifestDossierForm = document.getElementById('manifest-dossier-form') as HTMLFormElement;

  // Manifest inputs
  const manifestName = document.getElementById('manifest-name') as HTMLInputElement;
  const manifestEmail = document.getElementById('manifest-email') as HTMLInputElement;
  const manifestPhone = document.getElementById('manifest-phone') as HTMLInputElement;
  const manifestAge = document.getElementById('manifest-age') as HTMLInputElement;
  const manifestGender = document.getElementById('manifest-gender') as HTMLSelectElement;
  const manifestResidence = document.getElementById('manifest-residence') as HTMLInputElement;
  const manifestQualification = document.getElementById('manifest-qualification') as HTMLSelectElement;
  const manifestEnrolled = document.getElementById('manifest-enrolled') as HTMLSelectElement;
  const manifestHasSpecialization = document.getElementById('manifest-has-specialization') as HTMLSelectElement;
  const manifestSpecialization = document.getElementById('manifest-specialization') as HTMLInputElement;
  const manifestDisclosureCheck = document.getElementById('manifest-disclosure-check') as HTMLInputElement;
  
  const manifestFatherName = document.getElementById('manifest-father-name') as HTMLInputElement;
  const manifestMotherName = document.getElementById('manifest-mother-name') as HTMLInputElement;
  const manifestGuardianName = document.getElementById('manifest-guardian-name') as HTMLInputElement;
  const manifestFatherOccup = document.getElementById('manifest-father-occup') as HTMLInputElement;
  const manifestMotherOccup = document.getElementById('manifest-mother-occup') as HTMLInputElement;
  const manifestIncome = document.getElementById('manifest-income') as HTMLSelectElement;

  const groupSpecializationSpec = document.getElementById('group-specialization-spec');
  const groupDisclosureAgree = document.getElementById('group-disclosure-agree');

  // 2. Fetch User Profile credentials
  let applicantName = user.user_metadata?.full_name || user.user_metadata?.name || "Candidate";
  let applicantKId = user.user_metadata?.k_id || "";

  // Attempt database sync for Name and KGA-ID
  try {
    const { data: regData } = await supabase.from('registrations').select('*').eq('email', email);
    if (regData && regData.length > 0) {
      applicantKId = regData[0].k_id || applicantKId;
      applicantName = regData[0].name || applicantName;
    } else {
      const { data: appData } = await supabase.from('applicants').select('*').eq('email', email);
      if (appData && appData.length > 0) {
        applicantKId = appData[0].k_id || applicantKId;
        applicantName = appData[0].name || applicantName;
      }
    }
  } catch (e) {
    console.warn("DB credentials check failed, falling back to local session data:", e);
  }

  if (!applicantKId) {
    applicantKId = "KGA-ID-TEMP";
  }

  // Update DOM headers
  if (candidateName) candidateName.textContent = applicantName;
  if (candidateId) candidateId.textContent = applicantKId;

  // Initialize Global Dashboard state structure
  interface DashboardState {
    selected_track: string | null;
    fellowship_claimed: string | null;
    uploaded_documents: string[];
    submitted: boolean;
    manifest_data?: any;
  }

  let state: DashboardState = {
    selected_track: null,
    fellowship_claimed: null,
    uploaded_documents: [],
    submitted: false
  };

  // 3. Dynamic Local & Database State Synchronization
  const loadDashboardState = async () => {
    // A. Check Supabase Auth user metadata first (contains unified schema state)
    if (user.user_metadata?.kga_dashboard_state) {
      state = { ...state, ...user.user_metadata.kga_dashboard_state };
    }
    
    // B. Check LocalStorage fallback
    const localCached = localStorage.getItem('kga_dashboard_state_' + email);
    if (localCached) {
      try {
        const parsed = JSON.parse(localCached);
        state = { ...state, ...parsed };
      } catch (e) {}
    }

    // C. Check database tables for details
    try {
      const { data: regData } = await supabase.from('registrations').select('*').eq('email', email);
      if (regData && regData.length > 0) {
        const record = regData[0];
        if (record.selected_track) state.selected_track = record.selected_track;
        if (record.fellowship_claimed) state.fellowship_claimed = record.fellowship_claimed;
        if (record.documents_uploaded) {
          try {
            state.uploaded_documents = Array.isArray(record.documents_uploaded) 
              ? record.documents_uploaded 
              : JSON.parse(record.documents_uploaded);
          } catch (e) {
            if (typeof record.documents_uploaded === 'string') {
              state.uploaded_documents = record.documents_uploaded.split(',').filter(Boolean);
            }
          }
        }
        if (record.application_status === 'submitted') state.submitted = true;
        if (record.manifest_data) {
          try {
            state.manifest_data = typeof record.manifest_data === 'string'
              ? JSON.parse(record.manifest_data)
              : record.manifest_data;
          } catch (e) {}
        }
      }
    } catch (e) {
      console.warn("DB state load failed, using local caching metadata:", e);
    }
  };

  const saveDashboardState = async () => {
    // 1. Cache to local storage
    localStorage.setItem('kga_dashboard_state_' + email, JSON.stringify(state));

    // 2. Sync to Supabase Auth User metadata (so it persists across all devices serverless)
    try {
      await supabase.auth.updateUser({
        data: { kga_dashboard_state: state }
      });
    } catch (e) {
      console.warn("Auth user metadata sync failed:", e);
    }

    // 3. Sync to public registrations and applicants tables
    try {
      const dbRecord: any = {
        selected_track: state.selected_track,
        fellowship_claimed: state.fellowship_claimed,
        documents_uploaded: JSON.stringify(state.uploaded_documents),
        application_status: state.submitted ? 'submitted' : 'draft',
        manifest_data: state.manifest_data ? JSON.stringify(state.manifest_data) : null,
        verified: true
      };

      const { error: err1 } = await supabase.from('registrations').update(dbRecord).eq('email', email);
      if (err1) {
        // Retry without manifest_data column in case column doesn't exist in registrations
        delete dbRecord.manifest_data;
        const { error: err2 } = await supabase.from('registrations').update(dbRecord).eq('email', email);
        if (err2) {
          await supabase.from('applicants').update(dbRecord).eq('email', email);
        }
      }
    } catch (e) {
      console.warn("DB tables sync failed:", e);
    }

    // Trigger re-render
    renderDashboard();
  };

  // 4. State Rendering & Status Management
  const renderDashboard = () => {
    const hasTrack = state.selected_track !== null;
    const hasFellowship = state.fellowship_claimed !== null;
    const docsCount = state.uploaded_documents.length;
    const isCompleted = hasTrack && docsCount >= 1;
    const isSubmitted = state.submitted;

    // A. Update Navigation Counters & Status Indicators
    if (draftsCountEl) {
      draftsCountEl.textContent = (hasTrack && !isSubmitted) ? "1" : "0";
    }

    // Sidebar LEDs
    if (statusTrackLed && statusTrackText) {
      if (isSubmitted) {
        statusTrackLed.className = "status-led green";
        statusTrackText.textContent = "Track Enrolled";
      } else if (hasTrack) {
        statusTrackLed.className = "status-led yellow";
        statusTrackText.textContent = "Draft Track Active";
      } else {
        statusTrackLed.className = "status-led white";
        statusTrackText.textContent = "Track Unselected";
      }
    }

    if (statusExamLed && statusExamText) {
      if (isSubmitted) {
        statusExamLed.className = "status-led green";
        statusExamText.textContent = "Exam Unlocked";
      } else {
        statusExamLed.className = "status-led red";
        statusExamText.textContent = "Exam Locked";
      }
    }

    // B. Render Bottom Status Panel
    if (!hasTrack) {
      if (emptyState) emptyState.style.display = 'block';
      if (draftState) draftState.style.display = 'none';
    } else {
      if (emptyState) emptyState.style.display = 'none';
      if (draftState) draftState.style.display = 'block';

      // Update Track and details text
      if (draftTitleText) {
        draftTitleText.textContent = isSubmitted 
          ? `${state.selected_track} Enrolled` 
          : `${state.selected_track} Application Draft`;
      }
      if (detailTrackName) detailTrackName.textContent = state.selected_track;
      
      if (detailFellowshipStatus) {
        detailFellowshipStatus.textContent = state.fellowship_claimed 
          ? `Claimed: ${state.fellowship_claimed}` 
          : "Tuition Fellowship Pending";
      }

      if (detailDocsStatus) {
        detailDocsStatus.textContent = docsCount > 0 
          ? `${docsCount} Document(s) Uploaded Dossier` 
          : "0 Documents Uploaded (Transcripts required)";
      }

      // Calculate progress percentage
      let progress = 40; // Track selection is 40%
      if (hasFellowship) progress += 30; // Fellowship is 30%
      if (docsCount > 0) progress += 30; // Documents uploaded is 30%
      if (isSubmitted) progress = 100;

      if (progressPercent) progressPercent.textContent = `${progress}%`;
      if (progressBar) progressBar.style.width = `${progress}%`;

      // Submission button state
      if (btnSubmitApplication) {
        if (isSubmitted) {
          btnSubmitApplication.textContent = "Application Submitted";
          (btnSubmitApplication as HTMLButtonElement).disabled = true;
          if (btnDiscardDraft) (btnDiscardDraft as HTMLButtonElement).disabled = true;
        } else {
          btnSubmitApplication.textContent = "Submit Completed Application";
          (btnSubmitApplication as HTMLButtonElement).disabled = !isCompleted;
          if (btnDiscardDraft) (btnDiscardDraft as HTMLButtonElement).disabled = false;
        }
      }
    }

    // C. Render Quick Action Cards State
    // Programs card
    if (btnStartApp) {
      if (isSubmitted) {
        btnStartApp.querySelector('span')!.textContent = "Enrolled";
        (btnStartApp as HTMLButtonElement).disabled = true;
      } else if (hasTrack) {
        btnStartApp.querySelector('span')!.textContent = "Change Track";
      } else {
        btnStartApp.querySelector('span')!.textContent = "+ Start App";
      }
    }

    // Fellowship card
    if (btnClaimGrant) {
      if (isSubmitted) {
        btnClaimGrant.querySelector('span')!.textContent = "Fellowship Secured";
        (btnClaimGrant as HTMLButtonElement).disabled = true;
      } else if (hasFellowship) {
        btnClaimGrant.querySelector('span')!.textContent = "Change Claim";
      } else {
        btnClaimGrant.querySelector('span')!.textContent = "+ Claim";
      }
    }

    // Documents card
    if (btnUploadDocs) {
      if (isSubmitted) {
        btnUploadDocs.querySelector('span')!.textContent = "Dossier Closed";
        (btnUploadDocs as HTMLButtonElement).disabled = true;
      } else {
        btnUploadDocs.querySelector('span')!.textContent = docsCount > 0 ? `Upload (${docsCount})` : "Upload";
      }
    }

    // Unstop Exam gate card unlocking mechanism
    if (cardExam && btnStartExam && examIconSvg) {
      if (isSubmitted) {
        // Completely unlock card
        cardExam.classList.remove('disabled');
        (btnStartExam as HTMLButtonElement).disabled = false;
        btnStartExam.querySelector('span')!.textContent = "Initiate Genesis Gate";
        btnStartExam.className = "action-card-btn primary";
        
        // Update SVG icon to unlock state
        examIconSvg.innerHTML = `
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
        `;
      } else {
        // Keep locked
        cardExam.classList.add('disabled');
        (btnStartExam as HTMLButtonElement).disabled = true;
        btnStartExam.querySelector('span')!.textContent = "Locked";
        btnStartExam.className = "action-card-btn secondary";
        examIconSvg.innerHTML = `
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        `;
      }
    }
  };

  // 5. Wire Interactive Events & Modals Controls
  
  // A. Log out button
  if (btnLogout) {
    btnLogout.addEventListener('click', async (e) => {
      e.preventDefault();
      await supabase.auth.signOut();
      alert("Your session has been securely closed. Redirecting to home chamber.");
      window.location.href = "index.html";
    });
  }

  // B. Notification Bell toggle
  if (bellBtn && bellTray) {
    bellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      bellTray.classList.toggle('active');
      if (bellBadge) bellBadge.style.display = 'none'; // Clear notification badge
    });
    
    document.addEventListener('click', () => {
      bellTray.classList.remove('active');
    });
  }

  // C. Modals Opening Click Listeners
  if (btnStartApp && modalPrograms) {
    btnStartApp.addEventListener('click', () => {
      if (state.selected_track && !state.submitted) {
        prefillAndOpenManifest();
      } else {
        modalPrograms.classList.add('active');
      }
    });
  }

  if (btnClaimGrant && modalFellowships) {
    btnClaimGrant.addEventListener('click', () => {
      modalFellowships.classList.add('active');
    });
  }

  if (btnUploadDocs && modalDocuments) {
    btnUploadDocs.addEventListener('click', () => {
      modalDocuments.classList.add('active');
      renderUploadedDossier();
    });
  }

  // D. Modals Closing Click Listeners
  const closeModal = (modal: HTMLElement | null) => {
    if (modal) modal.classList.remove('active');
  };

  if (closeProgramsModal) closeProgramsModal.addEventListener('click', () => closeModal(modalPrograms));
  if (btnCancelPrograms) btnCancelPrograms.addEventListener('click', () => closeModal(modalPrograms));
  
  if (closeFellowshipsModal) closeFellowshipsModal.addEventListener('click', () => closeModal(modalFellowships));
  if (btnCancelFellowships) btnCancelFellowships.addEventListener('click', () => closeModal(modalFellowships));
  
  if (closeDocumentsModal) closeDocumentsModal.addEventListener('click', () => closeModal(modalDocuments));
  if (btnCloseVaultModal) btnCloseVaultModal.addEventListener('click', () => closeModal(modalDocuments));

  // E. Program Track selection handlers
  if (selectTrackSovereign) {
    selectTrackSovereign.addEventListener('click', () => {
      state.selected_track = "Sovereign Path (Systems & Strategy)";
      closeModal(modalPrograms);
      saveDashboardState();
      prefillAndOpenManifest();
    });
  }

  if (selectTrackVanguard) {
    selectTrackVanguard.addEventListener('click', () => {
      state.selected_track = "Vanguard Forge (GPU & Optimization)";
      closeModal(modalPrograms);
      saveDashboardState();
      prefillAndOpenManifest();
    });
  }

  // F. Fellowships grant claim handlers
  if (claimGrantMerit) {
    claimGrantMerit.addEventListener('click', () => {
      state.fellowship_claimed = "Genesis Merit Fellowship (25%)";
      closeModal(modalFellowships);
      saveDashboardState();
    });
  }

  if (claimGrantEquity) {
    claimGrantEquity.addEventListener('click', () => {
      state.fellowship_claimed = "Charter Equity Subsidy (15%)";
      closeModal(modalFellowships);
      saveDashboardState();
    });
  }

  if (claimGrantNone) {
    claimGrantNone.addEventListener('click', () => {
      state.fellowship_claimed = "None (Standard Admission)";
      closeModal(modalFellowships);
      saveDashboardState();
    });
  }

  // G. Document Vault Files Uploader & Dossier Manager
  const renderUploadedDossier = () => {
    if (!uploadedDossierList) return;
    uploadedDossierList.innerHTML = "";
    
    if (state.uploaded_documents.length === 0) {
      uploadedDossierList.innerHTML = `
        <div style="font-size: 0.8rem; color: hsla(0,0%,7%,0.5); text-align: center; padding: 12px; border: 1.5px dashed rgba(17,17,17,0.15); border-radius: 8px;">
          No transcripts uploaded yet. Complete dossiers require transcripts.
        </div>
      `;
      return;
    }

    state.uploaded_documents.forEach((doc, idx) => {
      const item = document.createElement('div');
      item.className = "uploaded-doc-item";
      item.innerHTML = `
        <div class="doc-info">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <span>${doc}</span>
        </div>
        <button class="btn-remove-doc" data-index="${idx}">&times;</button>
      `;
      uploadedDossierList.appendChild(item);
    });

    // Wire delete buttons
    const removeBtns = uploadedDossierList.querySelectorAll('.btn-remove-doc');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt((e.target as HTMLElement).getAttribute('data-index') || "0");
        state.uploaded_documents.splice(idx, 1);
        saveDashboardState();
        renderUploadedDossier();
      });
    });
  };

  if (uploadDropzone && fileUploaderInput) {
    uploadDropzone.addEventListener('click', () => {
      fileUploaderInput.click();
    });

    fileUploaderInput.addEventListener('change', () => {
      if (fileUploaderInput.files && fileUploaderInput.files.length > 0) {
        for (let i = 0; i < fileUploaderInput.files.length; i++) {
          const file = fileUploaderInput.files[i];
          if (state.uploaded_documents.length < 5) {
            state.uploaded_documents.push(file.name);
          }
        }
        saveDashboardState();
        renderUploadedDossier();
      }
    });

    // Drag over effect support
    uploadDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadDropzone.style.borderColor = "var(--gold)";
      uploadDropzone.style.background = "rgba(212, 175, 55, 0.08)";
    });

    uploadDropzone.addEventListener('dragleave', () => {
      uploadDropzone.style.borderColor = "var(--black)";
      uploadDropzone.style.background = "rgba(253, 245, 230, 0.4)";
    });

    uploadDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadDropzone.style.borderColor = "var(--black)";
      uploadDropzone.style.background = "rgba(253, 245, 230, 0.4)";
      
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (state.uploaded_documents.length < 5) {
            state.uploaded_documents.push(file.name);
          }
        }
        saveDashboardState();
        renderUploadedDossier();
      }
    });
  }

  // H. Bottom Panel Discard and Submit Actions
  if (btnDiscardDraft) {
    btnDiscardDraft.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm("Are you absolutely sure you want to discard your program application draft under the Sovereign Charter? This clears your selected track.")) {
        state.selected_track = null;
        state.fellowship_claimed = null;
        state.uploaded_documents = [];
        state.submitted = false;
        saveDashboardState();
      }
    });
  }

  if (btnSubmitApplication) {
    btnSubmitApplication.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm("Confirm submit. This will securely lock your KGA specialisation dossiers and unlock the entrance exam gates.")) {
        state.submitted = true;
        saveDashboardState();
        alert("Genesis Dossier Submitted Successfully!\n\nYour entrance exam gate is now fully active. Initiate 'Unstop Exam' to secure your seat.");
      }
    });
  }

  // I. Exam button click handler
  if (btnStartExam) {
    btnStartExam.addEventListener('click', (e) => {
      e.preventDefault();
      if (state.submitted) {
        alert("Genesis gate unlocked! Redirecting candidate to secure exam portal on Unstop.");
        window.location.href = "https://unstop.com";
      }
    });
  }

  // J. 4-Year Academic Manifest Modal Controllers & Event Handlers
  const triggerSpecializationUI = (val: string) => {
    if (val === "Yes") {
      if (groupSpecializationSpec) groupSpecializationSpec.classList.add('active');
      if (groupDisclosureAgree) groupDisclosureAgree.classList.remove('active');
      if (manifestSpecialization) manifestSpecialization.required = true;
      if (manifestDisclosureCheck) manifestDisclosureCheck.required = false;
    } else if (val === "No") {
      if (groupDisclosureAgree) groupDisclosureAgree.classList.add('active');
      if (groupSpecializationSpec) groupSpecializationSpec.classList.remove('active');
      if (manifestSpecialization) manifestSpecialization.required = false;
      if (manifestDisclosureCheck) manifestDisclosureCheck.required = true;
    } else {
      if (groupSpecializationSpec) groupSpecializationSpec.classList.remove('active');
      if (groupDisclosureAgree) groupDisclosureAgree.classList.remove('active');
    }
  };

  const prefillAndOpenManifest = () => {
    if (manifestName && !manifestName.value) manifestName.value = applicantName;
    if (manifestEmail && !manifestEmail.value) manifestEmail.value = email;
    
    // Load existing draft if saved
    if (state.manifest_data) {
      const d = state.manifest_data;
      if (d.name) manifestName.value = d.name;
      if (d.email) manifestEmail.value = d.email;
      if (d.phone) manifestPhone.value = d.phone;
      if (d.age) manifestAge.value = d.age;
      if (d.gender) manifestGender.value = d.gender;
      if (d.residence) manifestResidence.value = d.residence;
      if (d.qualification) manifestQualification.value = d.qualification;
      if (d.enrolled) manifestEnrolled.value = d.enrolled;
      
      if (d.has_specialization) {
        manifestHasSpecialization.value = d.has_specialization;
        triggerSpecializationUI(d.has_specialization);
      }
      if (d.specialization) manifestSpecialization.value = d.specialization;
      if (d.disclosure !== undefined) manifestDisclosureCheck.checked = d.disclosure;
      
      if (d.father_name) manifestFatherName.value = d.father_name;
      if (d.mother_name) manifestMotherName.value = d.mother_name;
      if (d.guardian_name) manifestGuardianName.value = d.guardian_name;
      if (d.father_occup) manifestFatherOccup.value = d.father_occup;
      if (d.mother_occup) manifestMotherOccup.value = d.mother_occup;
      if (d.income) manifestIncome.value = d.income;
    }
    
    if (modalSovereignManifest) modalSovereignManifest.classList.add('active');
  };

  if (manifestHasSpecialization) {
    manifestHasSpecialization.addEventListener('change', () => {
      triggerSpecializationUI(manifestHasSpecialization.value);
    });
  }

  if (closeManifestModal) closeManifestModal.addEventListener('click', () => closeModal(modalSovereignManifest));
  if (btnCancelManifest) btnCancelManifest.addEventListener('click', () => closeModal(modalSovereignManifest));

  if (btnSubmitManifest && manifestDossierForm) {
    btnSubmitManifest.addEventListener('click', async (e) => {
      e.preventDefault();
      
      // Basic HTML5 validation
      if (!manifestDossierForm.checkValidity()) {
        manifestDossierForm.reportValidity();
        return;
      }

      // Check conditional requirements
      if (manifestHasSpecialization.value === "No" && !manifestDisclosureCheck.checked) {
        alert("You must agree to the Academy's instructional terms and framework to proceed.");
        return;
      }

      // Collect all form values
      const manifestPayload = {
        name: manifestName.value.trim(),
        email: manifestEmail.value.trim(),
        phone: manifestPhone.value.trim(),
        age: manifestAge.value.trim(),
        gender: manifestGender.value,
        residence: manifestResidence.value.trim(),
        qualification: manifestQualification.value,
        enrolled: manifestEnrolled.value,
        has_specialization: manifestHasSpecialization.value,
        specialization: manifestSpecialization.value.trim(),
        disclosure: manifestDisclosureCheck.checked,
        father_name: manifestFatherName.value.trim(),
        mother_name: manifestMotherName.value.trim(),
        guardian_name: manifestGuardianName.value.trim(),
        father_occup: manifestFatherOccup.value.trim(),
        mother_occup: manifestMotherOccup.value.trim(),
        income: manifestIncome.value
      };

      // Set state values
      state.manifest_data = manifestPayload;
      state.submitted = true;
      closeModal(modalSovereignManifest);
      
      // Save state to Supabase & local storage
      await saveDashboardState();

      alert("Genesis Manifest Submitted and Locked Successfully!\n\nSyncing academic dossier and triggering admissions secure email notifications...");

      // Execute Resend API Post call
      try {
        const emailHTML = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #111111; border-radius: 16px; padding: 32px; background-color: #FDF5E6;">
            <h2 style="font-family: Georgia, serif; color: #D9383A; border-bottom: 2px solid #111111; padding-bottom: 12px; margin-top: 0;">KGA Genesis Manifest Record</h2>
            <p style="font-size: 14px; color: #555555; font-style: italic;">A new candidate has submitted their comprehensive 4-Year Academic Manifest for the Genesis Cohort.</p>
            
            <h3 style="font-family: Georgia, serif; color: #111111; border-bottom: 1px solid #111111; padding-bottom: 4px; margin-top: 24px;">1. Primary Identity</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr><td style="padding: 6px 0; font-weight: bold; width: 40%;">Full Legal Name:</td><td style="padding: 6px 0;">${manifestPayload.name}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Email Address:</td><td style="padding: 6px 0;">${manifestPayload.email}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Phone Number:</td><td style="padding: 6px 0;">${manifestPayload.phone}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Age / Gender:</td><td style="padding: 6px 0;">${manifestPayload.age} / ${manifestPayload.gender}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Residence:</td><td style="padding: 6px 0;">${manifestPayload.residence}</td></tr>
            </table>

            <h3 style="font-family: Georgia, serif; color: #111111; border-bottom: 1px solid #111111; padding-bottom: 4px; margin-top: 24px;">2. Academic Status</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr><td style="padding: 6px 0; font-weight: bold; width: 40%;">Qualification:</td><td style="padding: 6px 0;">${manifestPayload.qualification}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Currently Enrolled:</td><td style="padding: 6px 0;">${manifestPayload.enrolled}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Has Specialization:</td><td style="padding: 6px 0;">${manifestPayload.has_specialization}</td></tr>
              \${manifestPayload.has_specialization === 'Yes' ? \`<tr><td style="padding: 6px 0; font-weight: bold; color: #D9383A;">Specialization:</td><td style="padding: 6px 0; font-weight: bold; color: #D9383A;">\${manifestPayload.specialization}</td></tr>\` : ''}
              <tr><td style="padding: 6px 0; font-weight: bold;">KGA Terms Agreed:</td><td style="padding: 6px 0;">\${manifestPayload.disclosure ? 'Yes (Genesis Charter Guidelines)' : 'No'}</td></tr>
            </table>

            <h3 style="font-family: Georgia, serif; color: #111111; border-bottom: 1px solid #111111; padding-bottom: 4px; margin-top: 24px;">3. Family & Financial Profile</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr><td style="padding: 6px 0; font-weight: bold; width: 40%;">Father's Name:</td><td style="padding: 6px 0;">\${manifestPayload.father_name || 'N/A'}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Mother's Name:</td><td style="padding: 6px 0;">\${manifestPayload.mother_name || 'N/A'}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Guardian's Name:</td><td style="padding: 6px 0;">\${manifestPayload.guardian_name || 'N/A'}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Father's Occupation:</td><td style="padding: 6px 0;">\${manifestPayload.father_occup || 'N/A'}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Mother's Occupation:</td><td style="padding: 6px 0;">\${manifestPayload.mother_occup || 'N/A'}</td></tr>
              <tr style="color: #D4AF37; font-weight: bold;"><td style="padding: 6px 0;">Annual Income Bracket:</td><td style="padding: 6px 0;">\${manifestPayload.income}</td></tr>
            </table>
            
            <div style="margin-top: 32px; border-top: 2px dashed #111111; padding-top: 16px; text-align: center; font-size: 12px; color: #777777;">
              &copy; 2026 Krishnaite Global Academy. Under Sovereign Charter. Secure Admission Gateways.
            </div>
          </div>
        `;

        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer re_Rau6jNd3_EQwTXSY9jiegFH5ypqzEwdhu',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'KGA Admissions <onboarding@resend.dev>',
            to: ['honeygpt111@gmail.com'],
            subject: `KGA 4-Year Manifest: \${manifestPayload.name} (\${state.selected_track})`,
            html: emailHTML
          })
        });

        if (resendResponse.ok) {
          console.log("Resend email dispatch successful!");
        } else {
          const errText = await resendResponse.text();
          console.warn("Resend email dispatch rejected by server (CORS / Sandboxed domain):", errText);
        }
      } catch (err) {
        console.warn("Resend email post request bypassed by client CORS restrictions. Application remains safely synced in Supabase:", err);
      }
    });
  }

  // 6. Run Initial load & Render cycle
  await loadDashboardState();
  renderDashboard();
}
