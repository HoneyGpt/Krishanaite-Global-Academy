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
            Unlocking manifest... Redirecting to secure Unstop entrance exam in 5 seconds.
          </p>
          <div class="modal-cta-box" style="margin-top: 24px; display: flex; justify-content: center;">
            <a href="https://unstop.com" class="entrance-exam-btn" style="text-decoration: none; background: var(--red); color: var(--bg-peach); border-color: var(--black);">
              Proceed to Exam
            </a>
          </div>
        `;
        setTimeout(() => {
          window.location.href = "https://unstop.com";
        }, 5000);
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
            Unlocking manifest... Redirecting to secure Unstop entrance exam in 5 seconds.
          </p>
          <div class="modal-cta-box" style="margin-top: 24px; display: flex; justify-content: center;">
            <a href="https://unstop.com" class="entrance-exam-btn" style="text-decoration: none; background: var(--red); color: var(--bg-peach); border-color: var(--black);">
              Proceed to Exam
            </a>
          </div>
        `;
        setTimeout(() => {
          window.location.href = "https://unstop.com";
        }, 5000);
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
          alert(`Welcome back, ${name}.\n\nIdentity authenticated successfully.\nProceeding to secure Unstop entrance exam...`);
          window.location.href = 'https://unstop.com';
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
