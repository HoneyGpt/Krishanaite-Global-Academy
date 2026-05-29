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

  if (token && modalHeader) {
    if (manifestForm) (manifestForm as HTMLElement).style.display = 'none';
    if (portalConsole) (portalConsole as HTMLElement).style.display = 'none';
    
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

  if (portalLoginBtn && portalCreateBtn && manifestForm) {
    portalLoginBtn.addEventListener('click', async () => {
      portalLoginBtn.classList.add('active');
      portalCreateBtn.classList.remove('active');
      manifestForm.classList.remove('active');
      
      const email = prompt("Enter your registered Primary Email address:");
      if (!email) return;
      const k_id = prompt("Enter your secure Krishnaite ID (e.g. KGA-ID-XXXX):");
      if (!k_id) return;

      let found = false;
      let name = "Candidate";
      let verified = false;

      // 1. Query Supabase
      if (supabase) {
        try {
          const { data: regData } = await supabase.from('registrations').select('*').eq('email', email).eq('k_id', k_id);
          if (regData && regData.length > 0) {
            found = true;
            name = regData[0].name;
            verified = regData[0].verified;
          } else {
            const { data: appData } = await supabase.from('applicants').select('*').eq('email', email).eq('k_id', k_id);
            if (appData && appData.length > 0) {
              found = true;
              name = appData[0].name;
              verified = appData[0].verified;
            }
          }
        } catch (err) {
          console.error("Supabase login check failed:", err);
        }
      }

      // 2. Query Local Cache Fallback
      if (!found) {
        const cachedData = localStorage.getItem('kga_applicants');
        if (cachedData) {
          try {
            const records = JSON.parse(cachedData);
            for (let r of records) {
              if (r.email === email && r.k_id === k_id) {
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
          alert(`Identity Manifest Found for ${name}.\n\nHowever, email verification is still pending.\nPlease verify your email via the outbox link to unlock the entrance exam.`);
        }
      } else {
        alert("Identity manifest not found.\nPlease register a new Krishnaite ID or check your credentials.");
      }
    });

    portalCreateBtn.addEventListener('click', () => {
      portalCreateBtn.classList.add('active');
      portalLoginBtn.classList.remove('active');
      manifestForm.classList.add('active');
    });

    manifestForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = (document.getElementById('full-name') as HTMLInputElement).value;
      const email = (document.getElementById('email-addr') as HTMLInputElement).value;
      const phone = (document.getElementById('phone-num') as HTMLInputElement).value;
      
      // Generate a mock unique Krishnaite ID
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const k_id = `KGA-ID-${randomNum}`;
      const token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
      
      const record = {
        name,
        email,
        phone,
        k_id,
        verification_token: token,
        verified: false
      };

      // 1. Cache locally to localStorage
      let cachedRecords = [];
      const cached = localStorage.getItem('kga_applicants');
      if (cached) {
        try { cachedRecords = JSON.parse(cached); } catch (e) {}
      }
      cachedRecords.push(record);
      localStorage.setItem('kga_applicants', JSON.stringify(cachedRecords));

      // 2. Submit to Supabase directly
      let supabaseSuccess = false;
      if (supabase) {
        try {
          const { error: err1 } = await supabase.from('registrations').insert([record]);
          if (!err1) {
            supabaseSuccess = true;
          } else {
            console.warn("registrations table fail, trying applicants table...", err1);
            const { error: err2 } = await supabase.from('applicants').insert([record]);
            if (!err2) supabaseSuccess = true;
          }
        } catch (err) {
          console.error("Supabase direct insert fail", err);
        }
      }

      // 3. Fallback Post to local Flask server if running locally
      if (!supabaseSuccess) {
        try {
          await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, k_id, verification_token: token })
          });
        } catch (e) {
          console.log("Flask server register offline");
        }
      }

      const successPortal = document.getElementById('success-portal-container');
      const displayKId = document.getElementById('display-k-id');
      const displayEmail = document.getElementById('display-email');
      const successVerifyUrl = document.getElementById('success-verify-url');
      const btnCopyUrl = document.getElementById('btn-copy-url');
      const btnVerifyTest = document.getElementById('btn-verify-test');

      const verification_url = `${window.location.origin}${window.location.pathname}?token=${token}`;

      if (successPortal && displayKId && displayEmail && successVerifyUrl) {
        // Hide form
        (manifestForm as HTMLElement).style.display = 'none';
        
        // Update header block
        const modalHeader = document.querySelector('.modal-header');
        if (modalHeader) {
          modalHeader.innerHTML = `
            <span class="modal-badge" style="background: var(--black); color: var(--gold); border-color: var(--gold);">Identity Manifest Initialized</span>
            <h2>Identity Manifest Created Successfully</h2>
            <p class="modal-intro">Follow the instructions below to verify your credentials and unlock the Genesis Cohort entrance exam gate.</p>
          `;
        }

        // Hide portal console buttons
        if (portalConsole) {
          (portalConsole as HTMLElement).style.display = 'none';
        }

        // Populate elements
        displayKId.textContent = k_id;
        displayEmail.textContent = email;
        (successVerifyUrl as HTMLInputElement).value = verification_url;
        successPortal.style.display = 'block';

        // Bind Copy URL logic
        if (btnCopyUrl) {
          btnCopyUrl.onclick = (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(verification_url).then(() => {
              btnCopyUrl.textContent = "Copied";
              btnCopyUrl.style.background = "var(--gold)";
              btnCopyUrl.style.color = "var(--black)";
              setTimeout(() => {
                btnCopyUrl.textContent = "Copy";
                btnCopyUrl.style.background = "var(--black)";
                btnCopyUrl.style.color = "var(--bg-peach)";
              }, 2000);
            }).catch(err => {
              console.error("Clipboard copy failed: ", err);
            });
          };
        }

        // Bind Verify Now test logic
        if (btnVerifyTest) {
          btnVerifyTest.onclick = (e) => {
            e.preventDefault();
            window.location.href = verification_url;
          };
        }
      }
    });
  }
}
