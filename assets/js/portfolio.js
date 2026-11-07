/**
 * PAVANA V — DEVELOPER PORTFOLIO CONTROLLER
 * Premium Interactions: Custom Cursor, Magnetic Buttons, Sliding Nav Indicator,
 * Scroll Reveal, Interactive Skills, Animated Journey, 3D Tilt & Parallax.
 */

document.addEventListener('DOMContentLoaded', () => {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  // ==========================================================================
  // 0. Theme Switcher Controller (Light Purplish vs "Lil Dark" Purple)
  // ==========================================================================
  const themeToggleBtns = document.querySelectorAll('#theme-toggle-btn, #mobile-theme-toggle-btn');
  const getInitialTheme = () => {
    try {
      const saved = localStorage.getItem('portfolio-theme');
      if (saved) return saved;
      return 'light'; // Default to light purplish
    } catch(e) {
      return 'light';
    }
  };

  const applyThemeMode = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch(e) {}

    // Update meta theme-color for mobile header bars
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#140A26' : '#EBE0F7');
    }

    themeToggleBtns.forEach((btn) => {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light purplish mode' : 'Switch to lil dark mode');
      btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Purplish Mode' : 'Switch to Lil Dark Mode');
    });
  };

  // Initialize active theme
  const initialTheme = getInitialTheme();
  applyThemeMode(initialTheme);

  themeToggleBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyThemeMode(next);
    });
  });

  // ==========================================================================
  // 1. Dynamic Footer Year
  // ==========================================================================
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ==========================================================================
  // 2. Scroll Progress Bar
  // ==========================================================================
  const progressBar = document.getElementById('scroll-progress');
  const updateScrollProgress = () => {
    if (!progressBar) return;
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    progressBar.style.width = `${scrolled}%`;
  };
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // ==========================================================================
  // 3. Sticky Navbar Shrink on Scroll
  // ==========================================================================
  const navHeader = document.querySelector('.sticky-nav-header');
  const handleNavScroll = () => {
    if (!navHeader) return;
    if (window.scrollY > 30) {
      navHeader.classList.add('is-scrolled');
    } else {
      navHeader.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ==========================================================================
  // 4. Programming-Themed Futuristic Digital Bug Cursor
  // ==========================================================================
  const bugCursor = document.getElementById('bug-cursor');
  const bugInner = bugCursor ? bugCursor.querySelector('.bug-cursor-inner') : null;
  const bugStatusTag = document.getElementById('bug-status-tag');
  const trailCanvas = document.getElementById('bug-trail-canvas');

  const isMobileDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia('(hover: none), (pointer: coarse)').matches || (window.innerWidth <= 900);

  // Strictly disable bug cursor on mobile devices
  if (bugCursor && isMobileDevice) {
    bugCursor.style.display = 'none';
    if (trailCanvas) trailCanvas.style.display = 'none';
    document.documentElement.classList.remove('has-custom-cursor');
  }

  // Cyber Spider Cursor: Desktop / Laptop ONLY with precision pointer
  if (bugCursor && !isReducedMotion && !isMobileDevice) {
    let targetX = -100, targetY = -100;
    let bugX = -100, bugY = -100;
    let prevBugX = -100, prevBugY = -100;
    let currentAngle = -0.44; // -25deg: natural sleek pointer angle
    let targetAngle = -0.44;
    let isVisible = false;
    let wasCaptured = false;
    let webAlpha = 0;
    let idleTimer = null;
    const connectBtn = document.getElementById('living-connect-btn');

    let ctx = null, footprints = [], sparkParticles = [];
    const MAX_FOOTPRINTS = 8, MAX_SPARKS = 12;

    if (trailCanvas) {
      ctx = trailCanvas.getContext('2d');
      const resizeCanvas = () => {
        trailCanvas.width = window.innerWidth;
        trailCanvas.height = window.innerHeight;
      };
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas, { passive: true });
    }

    function spawnSparks(x, y, count = 3) {
      const cuteColors = ['124, 58, 237', '168, 85, 247', '192, 132, 252', '233, 213, 255'];
      for (let i = 0; i < count; i++) {
        if (sparkParticles.length >= MAX_SPARKS) break;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.8 + 0.8;
        const color = cuteColors[Math.floor(Math.random() * cuteColors.length)];
        sparkParticles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 1.6 + 1.0,
          life: 1.0,
          decay: 0.045 + Math.random() * 0.035,
          color
        });
      }
    }
    window.__spawnBugSparks = spawnSparks;

    // Desktop mouse movement: Acts 1:1 like a normal cursor
    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      window.__portfolioCursorPos = { x: targetX, y: targetY };

      if (!isVisible) {
        isVisible = true;
        bugX = targetX;
        bugY = targetY;
        prevBugX = targetX;
        prevBugY = targetY;
        bugCursor.style.opacity = '1';
        document.documentElement.classList.add('has-custom-cursor');
      }

      // Leg scuttling cadence during cursor movement
      bugCursor.classList.add('bug-walking');
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        bugCursor.classList.remove('bug-walking');
      }, 90);
    }, { passive: true });

    // Normal cursor physics loop (1:1 Immediate Tracking on Mouse + Spider Web)
    const renderBugScene = () => {
      if (!isVisible) {
        requestAnimationFrame(renderBugScene);
        return;
      }

      const now = Date.now();
      const t = now * 0.0018;

      let isCaptured = false;
      let captureFactor = 0;
      let desiredX = targetX;
      let desiredY = targetY;

      // Detect proximity to "let's collaborate" button and apply magnetic spider web pull
      if (connectBtn && targetX > 0 && targetY > 0) {
        const btnRect = connectBtn.getBoundingClientRect();
        const inViewport = (btnRect.bottom > -100 && btnRect.top < window.innerHeight + 100 &&
                            btnRect.right > -100 && btnRect.left < window.innerWidth + 100);

        if (inViewport) {
          const btnCenterX = btnRect.left + btnRect.width / 2;
          const btnCenterY = btnRect.top + btnRect.height / 2;
          const dx = targetX - btnCenterX;
          const dy = targetY - btnCenterY;
          const dist = Math.hypot(dx, dy);
          const WEB_CAPTURE_RADIUS = 320;

          if (dist < WEB_CAPTURE_RADIUS) {
            isCaptured = true;
            captureFactor = Math.max(0, 1 - dist / WEB_CAPTURE_RADIUS);

            // Tactile elastic magnetic pull towards the button
            const pullStrength = Math.pow(captureFactor, 1.3) * 20;
            const pullX = (btnCenterX - targetX) / (dist || 1) * pullStrength;
            const pullY = (btnCenterY - targetY) / (dist || 1) * pullStrength;

            // Silky micro-flutter vibration under web tension
            const vibX = captureFactor > 0.15 ? Math.sin(t * 18) * (captureFactor * 1.5) : 0;
            const vibY = captureFactor > 0.15 ? Math.cos(t * 16) * (captureFactor * 1.2) : 0;

            desiredX = targetX + pullX + vibX;
            desiredY = targetY + pullY + vibY;

            // Turn towards the button while under web tension
            targetAngle = Math.atan2(btnCenterY - bugY, btnCenterX - bugX) + Math.PI / 2;
          }
        }
      }

      // Cursor physics: 1:1 instant precision on mouse, elastic pull when captured
      if (isCaptured) {
        bugX += (desiredX - bugX) * 0.52;
        bugY += (desiredY - bugY) * 0.52;
        targetWebAlpha = Math.min(1, captureFactor * 1.45);
        document.body.classList.add('bug-in-web');
      } else {
        targetWebAlpha = 0;
        document.body.classList.remove('bug-in-web');
        bugX = desiredX;
        bugY = desiredY;

        // Spark discharge on breaking free from web
        if (wasCaptured && webAlpha > 0.22 && typeof spawnSparks === 'function') {
          spawnSparks(bugX, bugY, 8);
        }
      }

      wasCaptured = isCaptured;
      webAlpha += (targetWebAlpha - webAlpha) * 0.22;
      if (webAlpha < 0.005) webAlpha = 0;

      // Publish position for button 3D tilt tracking
      window.__portfolioBugPos = { x: bugX, y: bugY };

      const vx = bugX - prevBugX;
      const vy = bugY - prevBugY;
      const speed = Math.hypot(vx, vy);

      // Orientation & rotation:
      if (isCaptured) {
        let diff = targetAngle - currentAngle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        currentAngle += diff * 0.25;
      } else if (speed > 0.4) {
        // Turning along cursor movement vector
        targetAngle = Math.atan2(vy, vx) + Math.PI / 2;
        let diff = targetAngle - currentAngle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        currentAngle += diff * 0.35;
      } else {
        // Idle cursor: smoothly rests at sleek cursor slant (-25deg)
        targetAngle = -0.44;
        let diff = targetAngle - currentAngle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        currentAngle += diff * 0.12;
      }

      // Footprints when moving as cursor
      if (speed > 1.2 && Math.random() < 0.35 && footprints.length < MAX_FOOTPRINTS) {
        const rearX = bugX - Math.sin(currentAngle) * 7.2;
        const rearY = bugY + Math.cos(currentAngle) * 7.2;
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const fpColor = isCaptured ? '244, 63, 94' : (isDark ? '216, 180, 254' : '124, 58, 237');
        footprints.push({ x: rearX, y: rearY, alpha: isDark ? 0.65 : 0.45, size: Math.random() * 0.9 + 0.5, color: fpColor });
      }

      prevBugX = bugX;
      prevBugY = bugY;

      // Update spider cursor position: front head/fangs aligned precisely with cursor hotspot (bugX, bugY)
      bugCursor.style.transform = `translate3d(${(bugX - 4.8).toFixed(1)}px, ${(bugY - 4.0).toFixed(1)}px, 0)`;
      if (bugInner) {
        const angleDeg = (currentAngle * 180 / Math.PI).toFixed(1);
        bugInner.style.transform = `rotate(${angleDeg}deg)`;
        bugInner.style.setProperty('--bug-angle', `${angleDeg}deg`);
      }

      // Render Canvas (Best Animated Spider Web & Silk Particles)
      if (ctx) {
        ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

        if (webAlpha > 0.005 && connectBtn) {
          const btnRect = connectBtn.getBoundingClientRect();
          const btnCenterX = btnRect.left + btnRect.width / 2;
          const btnCenterY = btnRect.top + btnRect.height / 2;
          const halfW = btnRect.width * 0.5;
          const halfH = btnRect.height * 0.5;
          const nPill = 3.6;

          const mouthDist = 8.5;
          const mouthX = bugX + Math.sin(currentAngle) * mouthDist;
          const mouthY = bugY - Math.cos(currentAngle) * mouthDist;

          // Helper: Superellipse button boundary anchor finder
          const getPillAnchor = (angle) => {
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);
            return {
              x: btnCenterX + (halfW - 3) * Math.sign(cosA) * Math.pow(Math.abs(cosA), 2 / nPill),
              y: btnCenterY + (halfH - 3) * Math.sign(sinA) * Math.pow(Math.abs(sinA), 2 / nPill)
            };
          };

          const angleToBug = Math.atan2(bugY - btnCenterY, bugX - btnCenterX);
          const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

          // Color palette: Ethereal luminescent lavender silk in dark mode; deep rich black spider silk in light mode
          const primarySilkColor = isDark
            ? `rgba(216, 180, 254, ${(0.82 * webAlpha).toFixed(2)})`
            : `rgba(12, 12, 16, ${(0.95 * webAlpha).toFixed(2)})`;
          const crossSilkColor = isDark
            ? `rgba(192, 132, 252, ${(0.62 * webAlpha).toFixed(2)})`
            : `rgba(22, 22, 28, ${(0.65 * webAlpha).toFixed(2)})`;
          const nodeColor = isDark ? '#FFFFFF' : '#0F172A';

          if (isDark) {
            ctx.shadowColor = `rgba(168, 85, 247, ${(0.75 * webAlpha).toFixed(2)})`;
            ctx.shadowBlur = 3.5;
          } else {
            ctx.shadowColor = `rgba(0, 0, 0, ${(0.20 * webAlpha).toFixed(2)})`;
            ctx.shadowBlur = 1.0;
          }

          // 4 Dynamic Radial Silk Strands spanning across the button perimeter facing the bug
          const strandOffsets = [-0.54, -0.18, 0.18, 0.54];
          const strandPoints = [];

          for (let i = 0; i < strandOffsets.length; i++) {
            const anchorAngle = angleToBug + strandOffsets[i];
            const anchor = getPillAnchor(anchorAngle);

            const sDx = mouthX - anchor.x;
            const sDy = mouthY - anchor.y;
            const sLen = Math.hypot(sDx, sDy);

            const nx = sLen > 0 ? -sDy / sLen : 0;
            const ny = sLen > 0 ? sDx / sLen : 1;

            // Tension dynamics: taut micro-flutter + catenary natural sag
            const tension = Math.min(1.6, Math.max(0.4, sLen / 150));
            const flutter = (1.2 / tension) * Math.sin(t * 18 + i * 2.1);
            const sag = Math.max(0, 1 - sLen / 240) * 10 * ((i % 2 === 0) ? 1 : -1);

            const midX = (anchor.x + mouthX) * 0.5 + nx * (flutter + sag);
            const midY = (anchor.y + mouthY) * 0.5 + ny * (flutter + sag);

            strandPoints.push({ anchor, mid: { x: midX, y: midY }, mouth: { x: mouthX, y: mouthY }, len: sLen });

            // A. Draw Radial Silk Strand
            ctx.beginPath();
            ctx.moveTo(anchor.x, anchor.y);
            ctx.quadraticCurveTo(midX, midY, mouthX, mouthY);
            ctx.strokeStyle = primarySilkColor;
            ctx.lineWidth = (i === 1 || i === 2) ? 1.4 : 1.15;
            ctx.lineCap = 'round';
            ctx.stroke();

            // B. Adhesive Silk Anchor Pad on the button perimeter
            ctx.beginPath();
            ctx.arc(anchor.x, anchor.y, 2.0, 0, Math.PI * 2);
            ctx.fillStyle = isDark ? '#C084FC' : '#060608';
            ctx.fill();
            ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.70)';
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // C. Animated Silk Pulling Pulse (Moving energy node along each strand)
            const pulseT = (t * 1.25 + i * 0.27) % 1.0;
            const omt = 1 - pulseT;
            const px = omt * omt * anchor.x + 2 * omt * pulseT * midX + pulseT * pulseT * mouthX;
            const py = omt * omt * anchor.y + 2 * omt * pulseT * midY + pulseT * pulseT * mouthY;

            ctx.beginPath();
            ctx.arc(px, py, 1.35, 0, Math.PI * 2);
            ctx.fillStyle = nodeColor;
            ctx.shadowColor = isDark ? '#C084FC' : 'rgba(0, 0, 0, 0.35)';
            ctx.shadowBlur = isDark ? 4 : 1;
            ctx.fill();
            if (isDark) ctx.shadowColor = 'rgba(168, 85, 247, 0.75)';
          }

          // D. Cross-Web / Orb Web Spiral Strands connecting adjacent radial lines
          const uSteps = [0.34, 0.60, 0.82];
          for (let i = 0; i < strandPoints.length - 1; i++) {
            const sA = strandPoints[i];
            const sB = strandPoints[i + 1];

            for (let j = 0; j < uSteps.length; j++) {
              const u = uSteps[j];
              const omt = 1 - u;

              const pAx = omt * omt * sA.anchor.x + 2 * omt * u * sA.mid.x + u * u * sA.mouth.x;
              const pAy = omt * omt * sA.anchor.y + 2 * omt * u * sA.mid.y + u * u * sA.mouth.y;

              const pBx = omt * omt * sB.anchor.x + 2 * omt * u * sB.mid.x + u * u * sB.mouth.x;
              const pBy = omt * omt * sB.anchor.y + 2 * omt * u * sB.mid.y + u * u * sB.mouth.y;

              // Inward catenary sag towards center of button
              const crossMidX = (pAx + pBx) * 0.5 - (mouthX - btnCenterX) * 0.05;
              const crossMidY = (pAy + pBy) * 0.5 - (mouthY - btnCenterY) * 0.05;

              ctx.beginPath();
              ctx.moveTo(pAx, pAy);
              ctx.quadraticCurveTo(crossMidX, crossMidY, pBx, pBy);
              ctx.strokeStyle = crossSilkColor;
              ctx.lineWidth = 0.85;
              ctx.stroke();

              // Micro-droplet junction beads
              ctx.beginPath();
              ctx.arc(pAx, pAy, 0.95, 0, Math.PI * 2);
              ctx.arc(pBx, pBy, 0.95, 0, Math.PI * 2);
              ctx.fillStyle = primarySilkColor;
              ctx.fill();
            }
          }

          // E. Bug Spinneret silk extrusion node
          ctx.beginPath();
          ctx.arc(mouthX, mouthY, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? '#C084FC' : '#060608';
          ctx.fill();

          ctx.shadowBlur = 0;
        }

        // Render footprints
        for (let i = footprints.length - 1; i >= 0; i--) {
          const fp = footprints[i];
          ctx.beginPath();
          ctx.arc(fp.x, fp.y, fp.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${fp.color || '124, 58, 237'}, ${fp.alpha * 0.45})`;
          ctx.fill();
          fp.alpha *= 0.88;
          if (fp.alpha <= 0.04) footprints.splice(i, 1);
        }

        // Render spark particles
        for (let i = sparkParticles.length - 1; i >= 0; i--) {
          const sp = sparkParticles[i];
          sp.x += sp.vx; sp.y += sp.vy;
          sp.life -= sp.decay;
          if (sp.life <= 0) { sparkParticles.splice(i, 1); continue; }
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size * sp.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${sp.color}, ${sp.life * 0.9})`;
          ctx.shadowColor = `rgb(${sp.color})`;
          ctx.shadowBlur = 5;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      requestAnimationFrame(renderBugScene);
    };

    requestAnimationFrame(renderBugScene);

    // Tactile Click Feedback: Spark discharge & Chassis pulse
    window.addEventListener('mousedown', () => {
      if (!isTouchActive) {
        document.body.classList.add('bug-active');
        spawnSparks(targetX, targetY, 4);
      }
    });
    window.addEventListener('mouseup', () => {
      setTimeout(() => { document.body.classList.remove('bug-active'); }, 140);
    });

    // Viewport edge transitions (Desktop)
    document.addEventListener('mouseleave', () => {
      isVisible = false;
      bugCursor.style.opacity = '0';
      if (ctx) ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
      footprints = []; sparkParticles = [];
    });
    document.addEventListener('mouseenter', () => {
      bugCursor.style.opacity = '1';
      isVisible = true;
    });

    // Interactive Hover States across Multi-Color Sections
    const isButton = el => el && el.closest && el.closest('button, .btn, .btn-primary, .btn-secondary, .btn-ghost, .btn-nav-resume, .copy-btn-action, .modal-close-btn, .mobile-toggle-btn, .living-connect-pill');
    const isLink = el => el && el.closest && el.closest('a, .nav-link, .footer-link, .channel-link-flex, .skill-tab-btn');
    const isCreature = el => el && el.closest && el.closest('#living-connect-btn, .living-connect-stage');
    const isParticipation = el => el && el.closest && el.closest('#participation, .participation-card, .participation-grid, [href="#participation"]');
    const isCert = el => el && el.closest && el.closest('#certifications, [data-modal-open*="ibm"], [data-modal-open*="aws"], [data-modal-open*="ccna"], [data-modal-open*="udemy"], [data-modal-open="modal-os"], [href="#certifications"]');
    const isAbout = el => el && el.closest && el.closest('#about, .about-narrative-card, .identity-profile-card, [href="#about"]');
    const isProject = el => el && el.closest && el.closest('#projects, .traffiq-featured-card, .project-card, .radar-card, .case-study-hero, .cs-feat-card, [href="#projects"]');
    const isSkill = el => el && el.closest && el.closest('#skills, .skills-clean-grid, .skill-clean-card, .clean-chip, [href="#skills"]');
    const isEdu = el => el && el.closest && el.closest('#education, .edu-timeline-card-content, .edu-timeline-item, [href="#education"]');
    const isHack = el => el && el.closest && el.closest('#hackathons, .hackathon-card, .hack-flow-step, [href="#hackathons"]');
    const isContact = el => el && el.closest && el.closest('#contact, .contact-channel-row, .contact-card-box, [href="#contact"]');
    const is3D = el => el && el.closest && el.closest('#ambient-canvas, .terminal-window-card, .case-study-diagram-box, .hero-photo-showcase');

    const removeTagClasses = () => {
      document.body.classList.remove('bug-tag-about', 'bug-tag-tech', 'bug-tag-project', 'bug-tag-academic', 'bug-tag-hack', 'bug-tag-cert', 'bug-tag-contact', 'bug-tag-dev');
    };

    document.addEventListener('mouseover', (e) => {
      if (isTouchActive) return;
      if (document.body.classList.contains('modal-open') || (e.target && e.target.closest && e.target.closest('.cert-modal, [role="dialog"], .cert-modal-box, .project-modal-box, .resume-modal-box'))) {
        removeTagClasses();
        if (bugStatusTag) {
          bugStatusTag.textContent = '';
          bugStatusTag.style.opacity = '0';
        }
        document.body.classList.remove('bug-hover-project', 'bug-hover-3d');
        if (isButton(e.target)) {
          document.body.classList.add('bug-hover-btn');
        } else {
          document.body.classList.remove('bug-hover-btn');
        }
        return;
      }

      // Do not display section status tags on the bug cursor (clean, minimal cursor)
      if (bugStatusTag) {
        bugStatusTag.textContent = '';
        bugStatusTag.style.opacity = '0';
      }
      removeTagClasses();
      document.body.classList.remove('bug-hover-project', 'bug-hover-3d');

      if (isButton(e.target)) {
        document.body.classList.add('bug-hover-btn');
      } else {
        document.body.classList.remove('bug-hover-btn');
      }

      if (isLink(e.target)) {
        document.body.classList.add('bug-hover-link');
      } else {
        document.body.classList.remove('bug-hover-link');
      }
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
      if (isTouchActive) return;
      const target = e.relatedTarget;
      if (!target || !isButton(target)) document.body.classList.remove('bug-hover-btn');
      if (!target || !isLink(target)) document.body.classList.remove('bug-hover-link');
      document.body.classList.remove('bug-hover-project', 'bug-hover-3d');
      removeTagClasses();
    }, { passive: true });
  }

  // ==========================================================================
  // 5. Magnetic CTA Buttons (Stationary & Stable)
  // ==========================================================================
  // Kept static to prevent layout shifting and button motion

  // ==========================================================================
  // 6. Sliding Navbar Active-Section Indicator & Scrollspy
  // ==========================================================================
  const navDesktopMenu = document.querySelector('.nav-desktop-menu');
  const navIndicator = document.querySelector('.nav-active-indicator');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  function moveNavIndicator(targetLink) {
    if (!navIndicator || !navDesktopMenu || !targetLink) return;
    const menuRect = navDesktopMenu.getBoundingClientRect();
    const linkRect = targetLink.getBoundingClientRect();
    const offsetLeft = linkRect.left - menuRect.left;
    navIndicator.style.opacity = '1';
    navIndicator.style.transform = `translateX(${offsetLeft}px)`;
    navIndicator.style.width = `${linkRect.width}px`;
  }

  // Position indicator initially on active link
  const currentActiveLink = document.querySelector('.nav-link.is-active') || navLinks[0];
  if (currentActiveLink) {
    setTimeout(() => moveNavIndicator(currentActiveLink), 150);
  }

  // Scrollspy via IntersectionObserver
  if ('IntersectionObserver' in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${id}`) {
              navLinks.forEach(l => l.classList.remove('is-active'));
              link.classList.add('is-active');
              moveNavIndicator(link);
            }
          });

          // Mobile Quick Pills Scrollspy Synchronization
          const quickPills = document.querySelectorAll('.quick-pill');
          if (quickPills.length > 0) {
            quickPills.forEach((pill) => {
              if (pill.getAttribute('href') === `#${id}`) {
                quickPills.forEach(p => p.classList.remove('is-active'));
                pill.classList.add('is-active');
              }
            });
          }
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px' });

    sections.forEach((sec) => sectionObserver.observe(sec));
  }

  window.addEventListener('resize', () => {
    const active = document.querySelector('.nav-link.is-active');
    if (active) moveNavIndicator(active);
  });

  // ==========================================================================
  // 7. Interactive Background: Particles & Mouse Parallax
  // ==========================================================================
  (function initAmbientBackground() {
    const canvas = document.getElementById('ambient-canvas');
    const gridOverlay = document.querySelector('.tech-grid-overlay');
    const spotlight = document.getElementById('mouse-spotlight');

    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createNodes();
    });

    let nodes = [];
    const count = Math.min(Math.floor((width * height) / (isTouchDevice ? 45000 : 32000)), isTouchDevice ? 20 : 38);

    class Node {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.8;
        this.vx = (Math.random() - 0.5) * 0.22;
        this.vy = (Math.random() - 0.5) * 0.22;
        this.alpha = Math.random() * 0.32 + 0.12;
        const palette = ['192, 132, 252', '168, 85, 247', '216, 180, 254', '233, 213, 255'];
        this.color = palette[Math.floor(Math.random() * palette.length)];
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.fill();
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }
    }

    function createNodes() {
      nodes = [];
      for (let i = 0; i < count; i++) {
        nodes.push(new Node());
      }
    }

    function connectNodes() {
      const maxDist = 110;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.11;
            ctx.strokeStyle = `rgba(192, 132, 252, ${alpha})`;
            ctx.lineWidth = 0.55;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].draw();
        if (!isReducedMotion) nodes[i].update();
      }
      connectNodes();
      if (!isReducedMotion) requestAnimationFrame(animate);
    }

    createNodes();
    animate();

    // Background spotlight follows cursor gently without shifting canvas/grid layout
    if (!isTouchDevice && !isReducedMotion) {
      window.addEventListener('mousemove', (e) => {
        if (spotlight) {
          spotlight.style.transform = `translate(${e.clientX - 260}px, ${e.clientY - 260}px)`;
        }
      }, { passive: true });
    }
  })();

  // ==========================================================================
  // 8. Reusable Scroll Reveal System (Instant Static Display - No Shift)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal-init');
  revealElements.forEach((el) => el.classList.add('is-revealed'));

  // ==========================================================================
  // 9. Card Stability (Zero Tilt / Zero Displacement)
  // ==========================================================================
  // Parallax and 3D tilting disabled to maintain 100% stable, fixed layouts

  // ==========================================================================
  // 10. Clean & Simple Skills Section Controller
  // ==========================================================================
  (function initCleanSkills() {
    // Elegant, lightweight skills architecture with zero runtime overhead
    const cleanChips = document.querySelectorAll('.clean-chip');
    if (cleanChips.length > 0) {
      cleanChips.forEach(chip => {
        chip.setAttribute('tabindex', '0');
      });
    }
  })();

  // ==========================================================================
  // 12. Mobile Navigation Drawer Controller
  // ==========================================================================
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileBackdrop = document.getElementById('mobile-drawer-backdrop');
  const mobileCloseBtn = document.querySelector('.mobile-drawer-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('is-open');
    mobileDrawer.setAttribute('aria-modal', 'true');
    if (mobileNavToggle) {
      mobileNavToggle.setAttribute('aria-expanded', 'true');
      mobileNavToggle.setAttribute('aria-label', 'Close Mobile Menu');
    }
    if (mobileBackdrop) mobileBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('is-open');
    if (mobileNavToggle) {
      mobileNavToggle.setAttribute('aria-expanded', 'false');
      mobileNavToggle.setAttribute('aria-label', 'Open Mobile Menu');
    }
    if (mobileBackdrop) mobileBackdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function toggleMobileMenu() {
    if (mobileDrawer && mobileDrawer.classList.contains('is-open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileMenu();
    });
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileMenu);
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // ==========================================================================
  // 13. Smooth In-Page Anchor Routing (with Header Offset)
  // ==========================================================================
  const inPageAnchors = document.querySelectorAll('a[href^="#"]');
  inPageAnchors.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetHref = this.getAttribute('href');
      if (targetHref && targetHref !== '#' && targetHref.startsWith('#')) {
        const targetEl = document.querySelector(targetHref);
        if (targetEl) {
          e.preventDefault();
          const navOffset = 64;
          const elementPos = targetEl.getBoundingClientRect().top;
          const offsetPos = elementPos + window.pageYOffset - navOffset;
          window.scrollTo({
            top: offsetPos,
            behavior: isReducedMotion ? 'auto' : 'smooth'
          });
          closeMobileMenu();
        }
      }
    });
  });

  // ==========================================================================
  // 14. Floating Back-to-Top Controller
  // ==========================================================================
  const backToTopBtn = document.getElementById('back-to-top-btn');
  const handleBackToTopVisibility = () => {
    if (!backToTopBtn) return;
    if (window.scrollY > 320) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
  };
  window.addEventListener('scroll', handleBackToTopVisibility, { passive: true });
  handleBackToTopVisibility();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: isReducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  // ==========================================================================
  // 15. Modals (Resume & Certifications)
  // ==========================================================================
  const modalTriggers = document.querySelectorAll('[data-modal-open]');
  const modalCloseBtns = document.querySelectorAll('[data-modal-close]');
  const allModals = document.querySelectorAll('.cert-modal');

  function openModal(id) {
    const targetModal = document.getElementById(id);
    if (targetModal) {
      targetModal.classList.add('is-active');
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
      const bugTag = document.getElementById('bug-status-tag');
      if (bugTag) {
        bugTag.textContent = '';
        bugTag.style.opacity = '0';
      }
      document.body.classList.remove('bug-hover-project', 'bug-hover-3d', 'bug-tag-about', 'bug-tag-tech', 'bug-tag-project', 'bug-tag-academic', 'bug-tag-hack', 'bug-tag-cert', 'bug-tag-contact', 'bug-tag-dev');
      const closeBtn = targetModal.querySelector('.modal-close-btn');
      if (closeBtn) closeBtn.focus();
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('is-active');
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      const bugTag = document.getElementById('bug-status-tag');
      if (bugTag) {
        bugTag.textContent = '';
        bugTag.style.opacity = '0';
      }
    }
  }

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-open');
      if (targetId) openModal(targetId);
    });
  });

  modalCloseBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.cert-modal');
      if (modal) closeModal(modal);
    });
  });

  allModals.forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      allModals.forEach((modal) => {
        if (modal.classList.contains('is-active')) closeModal(modal);
      });
      closeMobileMenu();
    }
  });

  // ==========================================================================
  // Resume Modal Tab Switcher (PDF Document vs Structured Web Resume)
  // ==========================================================================
  const resumeTabBtns = document.querySelectorAll('.resume-tab-btn');
  const resumeTabPanels = document.querySelectorAll('.resume-tab-panel');

  resumeTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-resume-tab');
      resumeTabBtns.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      resumeTabPanels.forEach((p) => {
        p.classList.remove('is-active');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      const targetPanel = document.getElementById(`resume-tab-${target}-panel`);
      if (targetPanel) {
        targetPanel.classList.add('is-active');
      }
    });
  });


  // ==========================================================================
  // 15. Copy Email Action
  // ==========================================================================
  const copyBtn = document.getElementById('copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.getAttribute('data-email') || 'pavanav.tech@gmail.com';
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          const temp = document.createElement('textarea');
          temp.value = email;
          temp.style.position = 'fixed';
          temp.style.opacity = '0';
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          document.body.removeChild(temp);
        }

        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('is-copied');

        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.classList.remove('is-copied');
        }, 2200);
      } catch (err) {
        console.warn('Copy failed:', err);
      }
    });
  }

  // ==========================================================================
  // 16. Contact Form Validation & Submission States (4 States)
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm && formFeedback) {
    const nameInput = contactForm.querySelector('#contact-name');
    const emailInput = contactForm.querySelector('#contact-email');
    const messageInput = contactForm.querySelector('#contact-message');
    const submitBtn = contactForm.querySelector('#contact-submit-btn') || contactForm.querySelector('button[type="submit"]');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isSubmitting = false;

    // Default State: Send button is enabled only when required fields are valid
    function validateForm() {
      if (isSubmitting) return false;
      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      const isNameValid = nameVal.length > 0;
      const isEmailValid = emailRegex.test(emailVal);
      const isMessageValid = messageVal.length > 0;

      const isValid = isNameValid && isEmailValid && isMessageValid;

      if (submitBtn) {
        if (isValid) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute('aria-disabled');
        } else {
          submitBtn.disabled = true;
          submitBtn.setAttribute('aria-disabled', 'true');
        }
      }
      return isValid;
    }

    // Real-time input listeners
    [nameInput, emailInput, messageInput].forEach((input) => {
      if (!input) return;
      input.addEventListener('input', validateForm);
      input.addEventListener('blur', validateForm);
      input.addEventListener('change', validateForm);
    });

    // Check validity initially on page load
    validateForm();

    // Renders feedback banner smoothly
    function showFeedback(type, title, messageHtml) {
      formFeedback.className = 'form-feedback-banner is-visible ' + type;
      formFeedback.setAttribute('aria-live', 'polite');
      formFeedback.setAttribute('role', type === 'error' ? 'alert' : 'status');

      const iconSvg = type === 'success'
        ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
        : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

      formFeedback.innerHTML = `
        <div class="feedback-icon-box" aria-hidden="true">${iconSvg}</div>
        <div class="feedback-text-content">
          <strong class="feedback-title">${title}</strong>
          <div class="feedback-desc">${messageHtml}</div>
        </div>
      `;

      // Setup dynamic copy draft button if present
      const copyDraftBtn = formFeedback.querySelector('#copy-draft-btn');
      if (copyDraftBtn) {
        copyDraftBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          const draft = messageInput ? messageInput.value : '';
          if (draft) {
            try {
              if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(draft);
              } else {
                const ta = document.createElement('textarea');
                ta.value = draft;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
              }
              copyDraftBtn.textContent = 'Draft copied!';
              setTimeout(() => {
                copyDraftBtn.textContent = 'Copy draft';
              }, 2500);
            } catch (err) {
              console.warn('Draft copy failed:', err);
            }
          }
        });
      }

      const rect = formFeedback.getBoundingClientRect();
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    // Form submit handler
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Prevent duplicate submissions
      if (isSubmitting) return;

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      // Validate required inputs
      if (!nameVal || !emailVal || !messageVal) {
        showFeedback(
          'error',
          'Please complete all fields.',
          '<p>Please enter your Name, Email, and Message before sending.</p>'
        );
        if (!nameVal && nameInput) nameInput.focus();
        else if (!emailVal && emailInput) emailInput.focus();
        else if (!messageVal && messageInput) messageInput.focus();
        return;
      }

      if (!emailRegex.test(emailVal)) {
        showFeedback(
          'error',
          'Invalid Email Address',
          '<p>Please enter a valid email address so I can reply to you.</p>'
        );
        if (emailInput) emailInput.focus();
        return;
      }

      // Helper function to escape HTML
      function escapeHtml(str) {
        return (str || '').replace(/[&<>"']/g, function(m) {
          return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
        });
      }

      // STATE: SENDING
      isSubmitting = true;
      if (nameInput) nameInput.disabled = true;
      if (emailInput) emailInput.disabled = true;
      if (messageInput) messageInput.disabled = true;
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-disabled', 'true');

      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <span class="btn-spinner" aria-hidden="true"></span>
        <span>Sending Message...</span>
      `;

      const payload = {
        name: nameVal,
        email: emailVal,
        message: messageVal,
        _subject: 'Portfolio Inquiry from ' + nameVal
      };

      // Real Submission Chain:
      // Step 1: Try local server endpoint '/api/contact'
      // Step 2: If /api/contact is unavailable (e.g. static hosting), submit to FormSubmit AJAX
      async function sendContactMessage() {
        let sent = false;

        // Attempt 1: Internal API endpoint
        try {
          const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            const data = await res.json().catch(() => ({}));
            if (data.success !== false) {
              sent = true;
            }
          }
        } catch (err) {
          // Internal endpoint failed/not present, proceed to public email gateway
        }

        // Attempt 2: If not sent via /api/contact, try FormSubmit
        if (!sent) {
          try {
            const formRes = await fetch('https://formsubmit.co/ajax/pavanav.tech@gmail.com', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(payload)
            });
            if (formRes.ok) {
              const formData = await formRes.json().catch(() => ({}));
              if (formData.success === 'true' || formData.success === true) {
                sent = true;
              }
            }
          } catch (err) {
            console.warn('FormSubmit gateway error:', err);
          }
        }

        if (sent) {
          showFeedback(
            'success',
            'Message Delivered Successfully!',
            `<p>Thank you, <strong>${escapeHtml(nameVal)}</strong>! Your message has been sent to Pavana. I will review it and reply to <strong>${escapeHtml(emailVal)}</strong> shortly.</p>`
          );
          contactForm.reset();
        } else {
          // Fallback if network blocked
          const mailtoFallback = `mailto:pavanav.tech@gmail.com?subject=${encodeURIComponent('Portfolio Inquiry from ' + nameVal)}&body=${encodeURIComponent('Hello Pavana,\n\n' + messageVal + '\n\n---\nFrom: ' + nameVal + ' (' + emailVal + ')')}`;
          showFeedback(
            'error',
            'Unable to Send Message',
            `<p>Could not deliver through the automated gateway right now. You can email directly to <strong>pavanav.tech@gmail.com</strong>:</p>
             <div style="margin-top: 0.65rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
               <a href="${mailtoFallback}" target="_blank" class="btn-primary" style="font-size: 0.78rem; padding: 0.35rem 0.8rem; text-decoration: none;">Send via Email App</a>
               <button type="button" id="copy-draft-btn" class="btn-secondary" style="font-size: 0.78rem; padding: 0.35rem 0.8rem;">Copy message draft</button>
             </div>`
          );
        }

        isSubmitting = false;
        if (nameInput) nameInput.disabled = false;
        if (emailInput) emailInput.disabled = false;
        if (messageInput) messageInput.disabled = false;
        submitBtn.disabled = false;
        submitBtn.removeAttribute('aria-disabled');
        submitBtn.innerHTML = originalBtnHTML;
      }

      sendContactMessage();
    });
  }

  // ==========================================================================
  // 17. Vertical Education Timeline Scroll Animation
  // ==========================================================================
  (function initEducationTimeline() {
    const eduSection = document.getElementById('education');
    const progressBar = document.getElementById('edu-timeline-progress');
    const eduItems = document.querySelectorAll('.edu-timeline-item');

    if (!eduSection || !progressBar || eduItems.length === 0) return;

    function updateEduTimeline() {
      const rect = eduSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const totalDist = rect.height;
      const currentDist = windowHeight * 0.7 - rect.top;
      let ratio = currentDist / totalDist;
      ratio = Math.max(0, Math.min(1, ratio));

      progressBar.style.height = (ratio * 100) + '%';

      eduItems.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        if (itemRect.top < windowHeight * 0.75) {
          item.classList.add('is-active');
        } else {
          item.classList.remove('is-active');
        }
      });
    }

    window.addEventListener('scroll', updateEduTimeline, { passive: true });
    updateEduTimeline();
  })();

  // ==========================================================================
  // 18. Hackathon 6-Stage Sprint Flow Controller
  // ==========================================================================
  (function initHackathonFlow() {
    const stageButtons = document.querySelectorAll('.hack-flow-step');
    const badgeEl = document.getElementById('hack-detail-badge');
    const titleEl = document.getElementById('hack-detail-title');
    const descEl = document.getElementById('hack-detail-desc');

    if (stageButtons.length === 0 || !badgeEl || !titleEl || !descEl) return;

    const stagesData = {
      '1': {
        badge: 'STAGE 01 // BRAINSTORMING & DISCOVERY',
        title: 'Idea — Pinpointing Practical Problems',
        desc: 'Rapid exploration of real-world bottlenecks and urban friction points. Identifying where dynamic algorithmic allocation and intelligent signal scheduling can solve real commuter delays.'
      },
      '2': {
        badge: 'STAGE 02 // PROBLEM SCOPING',
        title: 'Problem — Defining Core Inefficiencies',
        desc: 'Dissecting how rigid, fixed-timer traffic cycles fail during asymmetrical congestion waves. Formulating the exact constraint equations and queue latency metrics.'
      },
      '3': {
        badge: 'STAGE 03 // TECHNICAL FEASIBILITY',
        title: 'Research — Algorithmic & Feasibility Analysis',
        desc: 'Evaluating queue theory, computer vision density paradigms, and edge compute limits. Designing an adaptive green-light duration heuristic with strict safety bounds.'
      },
      '4': {
        badge: 'STAGE 04 // SIMULATION & WIREFRAMING',
        title: 'Prototype — Interactive Logic & Simulation',
        desc: 'Iterating on rapid interface sketches and building an intersection simulator to test dynamic vehicle throughput and wait-time reductions in real time.'
      },
      '5': {
        badge: 'STAGE 05 // SYSTEM INTEGRATION',
        title: 'Build — High-Velocity Coding & Integration',
        desc: 'Working in tight agile sprints under time pressure to assemble the prototype, implement state machine transitions, and eliminate runtime bugs.'
      },
      '6': {
        badge: 'STAGE 06 // JUDGES PRESENTATION',
        title: 'Pitch — Articulating Value & Roadmaps',
        desc: 'Distilling intricate engineering architecture into a crisp, high-impact demonstration for hackathon judges, highlighting real-world urban applicability.'
      }
    };

    stageButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const stageNum = btn.getAttribute('data-stage');
        const data = stagesData[stageNum];
        if (!data) return;

        stageButtons.forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });

        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        const panel = document.getElementById('hack-stage-detail');
        if (panel) {
          panel.style.opacity = '0.4';
          setTimeout(() => {
            badgeEl.textContent = data.badge;
            titleEl.textContent = data.title;
            descEl.textContent = data.desc;
            panel.style.opacity = '1';
          }, 100);
        } else {
          badgeEl.textContent = data.badge;
          titleEl.textContent = data.title;
          descEl.textContent = data.desc;
        }
      });
    });
  })();

  // ==========================================================================
  // INTERACTIVE "LET'S CONNECT" PILL BUTTON WITH SPIDER WEB CAPTURE
  // ==========================================================================
  const initLivingConnectCreature = () => {
    const stage = document.getElementById('living-connect-container');
    const wrapper = document.getElementById('living-creature-wrapper');
    const btn = document.getElementById('living-connect-btn');

    if (!stage || !btn || !wrapper) return;

    let currentTiltX = 0, currentTiltY = 0;
    let currentPullX = 0, currentPullY = 0;
    let targetTiltX = 0, targetTiltY = 0;
    let targetPullX = 0, targetPullY = 0;
    let isHovered = false;
    let isSparksDischargedOnHover = false;
    // Interactive tether reach radius (matches wide dynamic sweep)
    const PROXIMITY_RADIUS = 380;

    // Track mouse coordinates globally for this creature
    let mouseX = -9999, mouseY = -9999;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    // Click handler: Squash feedback, tactile spark burst, and instant LinkedIn profile launch
    btn.addEventListener('click', (e) => {
      btn.classList.add('is-pressed');
      setTimeout(() => btn.classList.remove('is-pressed'), 220);

      // Trigger spark burst from existing custom cursor engine
      if (typeof window.__spawnBugSparks === 'function') {
        window.__spawnBugSparks(e.clientX || (window.innerWidth / 2), e.clientY || (window.innerHeight / 2), 8);
      }

      // Native <a> tag navigation with target="_blank" opens https://www.linkedin.com/in/pavanav in a new tab smoothly.
      const targetUrl = btn.getAttribute('href') || 'https://www.linkedin.com/in/pavanav';
      if (!e.isTrusted) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
    });

    btn.addEventListener('mouseenter', (e) => {
      isHovered = true;
      wrapper.classList.add('is-bug-hovered');

      if (!isSparksDischargedOnHover && typeof window.__spawnBugSparks === 'function') {
        window.__spawnBugSparks(e.clientX, e.clientY, 3);
        isSparksDischargedOnHover = true;
        setTimeout(() => { isSparksDischargedOnHover = false; }, 1200);
      }
    });

    btn.addEventListener('mouseleave', () => {
      isHovered = false;
      wrapper.classList.remove('is-bug-hovered');
    });

    // Touch device support for direct tap
    btn.addEventListener('touchstart', () => {
      btn.classList.add('is-pressed');
    }, { passive: true });

    btn.addEventListener('touchend', () => {
      btn.classList.remove('is-pressed');
    }, { passive: true });

    // Physics Animation Loop: Spring tilt, wobbling stretch & organic wire kinematics
    if (!isReducedMotion) {
      const updateCreaturePhysics = () => {
        // Find center of button in viewport
        const rect = btn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        // Use live bug position (works continuously on mobile and desktop) or cursor fallback
        const curX = window.__portfolioBugPos
          ? window.__portfolioBugPos.x
          : ((window.__portfolioCursorPos && window.__portfolioCursorPos.x !== -100) ? window.__portfolioCursorPos.x : mouseX);
        const curY = window.__portfolioBugPos
          ? window.__portfolioBugPos.y
          : ((window.__portfolioCursorPos && window.__portfolioCursorPos.y !== -100) ? window.__portfolioCursorPos.y : mouseY);

        const dx = curX - btnCenterX;
        const dy = curY - btnCenterY;
        const dist = Math.hypot(dx, dy);

        if (dist < PROXIMITY_RADIUS && curX > 0 && curY > 0) {
          const factor = 1 - (dist / PROXIMITY_RADIUS);
          const easedFactor = Math.pow(factor, 1.15);

          // Calculate interactive tilt & magnetic stretch towards bug as it reels
          targetTiltX = Math.max(-12, Math.min(12, -dy * 0.06 * easedFactor));
          targetTiltY = Math.max(-14, Math.min(14, dx * 0.06 * easedFactor));
          targetPullX = Math.max(-12, Math.min(12, dx * 0.05 * easedFactor));
          targetPullY = Math.max(-9, Math.min(9, dy * 0.04 * easedFactor));
        } else {
          // Relax back to natural floating state
          targetTiltX = 0;
          targetTiltY = 0;
          targetPullX = 0;
          targetPullY = 0;
        }

        // Spring ease towards targets
        const springSpeed = isHovered ? 0.16 : 0.10;
        currentTiltX += (targetTiltX - currentTiltX) * springSpeed;
        currentTiltY += (targetTiltY - currentTiltY) * springSpeed;
        currentPullX += (targetPullX - currentPullX) * springSpeed;
        currentPullY += (targetPullY - currentPullY) * springSpeed;

        // Apply 3D perspective transform to pill button
        const scaleVal = isHovered ? 1.04 : 1.0;
        btn.style.transform = `perspective(600px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg) translate3d(${currentPullX.toFixed(2)}px, ${currentPullY.toFixed(2)}px, 0) scale(${scaleVal})`;

        requestAnimationFrame(updateCreaturePhysics);
      };

      requestAnimationFrame(updateCreaturePhysics);
    }
  };

  initLivingConnectCreature();

  console.log(
    '%c [PAVANA V] %c Refined Developer Portfolio Active • Interactive, High-Performance & Accessible. %c',
    'background: #06080E; color: #3B82F6; font-weight: bold; padding: 4px 8px; border: 1px solid #3B82F6; border-radius: 4px;',
    'background: #3B82F6; color: #FFFFFF; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    'background: transparent;'
  );
});
