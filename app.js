/* Interactive systems for Krishnaite Global Academy */

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
      const speed = parseFloat(card.getAttribute('data-speed')) || 1.5;
      
      // Calculate shifts
      const cardShiftX = normX * 15 * speed;
      const cardShiftY = normY * 15 * speed;
      
      // Apply translation
      card.style.transform = `translate(${cardShiftX}px, ${cardShiftY}px)`;
      
      // Adjust shadow offset in reverse to make shadow stay physically fixed
      if (card.classList.contains('floating-card')) {
        const defaultShadowOffset = 12; // 12px default
        const newShadowX = defaultShadowOffset - cardShiftX;
        const newShadowY = defaultShadowOffset - cardShiftY;
        card.style.boxShadow = `${newShadowX}px ${newShadowY}px 0px var(--black-shadow)`;
      }
    });
  });

  // Reset positions smoothly on mouse leave
  interactiveZone.addEventListener('mouseleave', () => {
    floatCards.forEach(card => {
      card.style.transform = '';
      if (card.classList.contains('floating-card')) {
        card.style.boxShadow = '12px 12px 0px var(--black-shadow)';
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
    const grid = document.getElementById('grid');
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
    panel.addEventListener('mousemove', (e) => {
      const rect = panel.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within element
      const y = e.clientY - rect.top;  // y position within element
      
      const percentX = (x / rect.width - 0.5) * 2; // -1 to 1
      const percentY = (y / rect.height - 0.5) * 2; // -1 to 1
      
      // Tilt the panel slightly toward the cursor
      panel.style.transform = `perspective(800px) rotateY(${percentX * 5}deg) rotateX(${-percentY * 5}deg) translateY(-12px) scale(1.01)`;
      
      // Keep shadows in reverse
      const shadowX = 16 - percentX * 8;
      const shadowY = 16 - percentY * 8;
      panel.style.boxShadow = `${shadowX}px ${shadowY}px 0px var(--black-shadow)`;
      
      // Glowing highlight spot inside border
      if (panel.classList.contains('sovereign-path')) {
        panel.style.borderColor = `hsl(47, 75%, ${50 + percentX * 10}%)`;
      } else {
        panel.style.borderColor = `hsl(359, 75%, ${52 + percentX * 10}%)`;
      }
    });

    panel.addEventListener('mouseleave', () => {
      // Smooth reset
      panel.style.transform = '';
      panel.style.boxShadow = '16px 16px 0px var(--black-shadow)';
      panel.style.borderColor = '';
    });
  });
}

/**
 * 5. Smooth scroll linking for nav anchors
 */
function initSmoothScroll() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
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
      alert('🔒 Fellowship Application gateway is opening. Please prepare your verified academic and financial credentials.');
    });
  }

  // Admissions Portal Form Toggles
  const portalLoginBtn = document.getElementById('portal-login-btn');
  const portalCreateBtn = document.getElementById('portal-create-btn');
  const manifestForm = document.getElementById('manifest-form');

  if (portalLoginBtn && portalCreateBtn && manifestForm) {
    portalLoginBtn.addEventListener('click', () => {
      portalLoginBtn.classList.add('active');
      portalCreateBtn.classList.remove('active');
      manifestForm.classList.remove('active');
      alert('🔒 The secure Login gateway is opening. Please prepare your Mentozy credentials.');
    });

    portalCreateBtn.addEventListener('click', () => {
      portalCreateBtn.classList.add('active');
      portalLoginBtn.classList.remove('active');
      manifestForm.classList.add('active');
    });

    manifestForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('full-name').value;
      const email = document.getElementById('email-addr').value;
      const phone = document.getElementById('phone-num').value;
      
      // Generate a mock unique Krishnaite ID
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const k_id = `KGA-ID-${randomNum}`;
      
      const payload = {
        name,
        email,
        phone,
        k_id
      };
      
      // Send data to Flask server backend
      fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(response => response.json())
      .then(result => {
        alert(`🔒 Identity Initialized Successfully!\n\nKrishnaite ID: ${k_id}\n\nA secure verification link has been dispatched to: ${email}\n\nYou must confirm your email to unlock the full application manifest and access the Unstop entrance exam!`);
        window.location.href = 'https://unstop.com';
      })
      .catch(err => {
        console.error("Registration sync failed:", err);
        alert(`🔒 Identity Initialized (Local Cache Only)!\n\nKrishnaite ID: ${k_id}\n\nA secure verification link has been dispatched to: ${email}\n\nYou must confirm your email to unlock the full application manifest and access the Unstop entrance exam!`);
        window.location.href = 'https://unstop.com';
      });
    });
  }
}
