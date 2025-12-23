/* =========================================
   PRELOADER & INIT LOGIC (CRASH-PROOF)
   ========================================= */
function removePreloader() {
  try {
    // 1. Handle Custom Preloader (Black text animation)
    const customPreloader = document.getElementById("custom-preloader");
    if (customPreloader) {
      customPreloader.style.transition = "opacity 0.5s ease";
      customPreloader.style.opacity = "0";
      setTimeout(() => {
        customPreloader.style.display = "none";
      }, 500);
    }

    // 2. Handle SVG Preloader (if exists)
    const svgPreloader = document.getElementById("preloader");
    if (svgPreloader) {
      svgPreloader.style.display = "none";
    }

    // 3. Show Resume Button (Safely)
    const resumeBtn = document.getElementById("resumeBtn");
    if (resumeBtn) {
      resumeBtn.classList.remove("hide-during-preload");
      resumeBtn.style.visibility = "visible";
      resumeBtn.style.opacity = "1";
    }

    // 4. Show any other hidden elements
    document.querySelectorAll('.hide-during-preload').forEach(el => {
      el.classList.add('visible');
      el.style.visibility = 'visible';
      el.style.opacity = '1';
    });

  } catch (error) {
    console.error("Preloader error:", error);
    // Emergency hide if error occurs
    document.getElementById("custom-preloader").style.display = "none";
  }
}

window.addEventListener("load", () => {
  // Wait 2.5 seconds for animation to play, then remove
  setTimeout(removePreloader, 1000);
});

// SAFETY FALLBACK: Force remove preloader after 6 seconds if window load hangs
setTimeout(() => {
  const cp = document.getElementById("custom-preloader");
  if (cp && cp.style.display !== "none") {
    console.warn("Forcing preloader removal via fallback");
    removePreloader();
  }
}, 6000);


/* =========================================
   MATRIX BACKGROUND (MOBILE OPTIMIZED)
   ========================================= */
const canvas = document.getElementById("matrixCanvas");
// Ensure canvas exists before context
if (canvas) {
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  // Initial Resize
  resizeCanvas();

  const letters = "アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  // Responsive font size: smaller on mobile
  let fontSize = window.innerWidth < 768 ? 10 : 14;
  let columns = canvas.width / fontSize;
  let drops = [];

  function initDrops() {
    columns = canvas.width / fontSize;
    drops = Array.from({ length: Math.ceil(columns) }).fill(1);
  }
  initDrops();

  function drawMatrix() {
    // Trail effect
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#5c0404"; // Matrix Red Color
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
      const text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  // Run animation
  setInterval(drawMatrix, 33);

  // Handle Resize
  window.addEventListener("resize", () => {
    resizeCanvas();
    fontSize = window.innerWidth < 768 ? 10 : 14;
    initDrops();
  });
}


/* =========================================
   SETTINGS & UTILITIES
   ========================================= */

function settingtoggle() {
  const container = document.getElementById("setting-container");
  if(container) container.classList.toggle('settingactivate');
  
  const visualBtn = document.getElementById("visualmodetogglebuttoncontainer");
  if(visualBtn) visualBtn.classList.toggle('visualmodeshow');
  
  const soundBtn = document.getElementById("soundtogglebuttoncontainer");
  if(soundBtn) soundBtn.classList.toggle('soundmodeshow');
}

function playpause() {
  // Check if 'audio' is defined globally. If not, ignore to prevent crash.
  if (typeof audio !== 'undefined') {
    const soundSwitch = document.getElementById('switchforsound');
    if (soundSwitch && !soundSwitch.checked) {
      audio.pause();
    } else {
      audio.play();
    }
  }
}

function visualmode() {
  document.body.classList.toggle('light-mode');
  
  const soundLabel = document.getElementById('labelforsound');
  if(soundLabel) soundLabel.classList.toggle('invertsoundlabel');

  // Toggle classes safely
  const headings = [
    '.about-heading-article', '.aboutHeadingP',
    '.skills-heading-article', '.skillsHeadingP',
    '.projects-heading-article', '.projectsHeadingP',
    '.frontend-dev-heading', '.designing-heading', '.languages-heading'
  ];

  headings.forEach(cls => {
    const el = document.querySelector(cls);
    if (el) el.classList.toggle('heading-article-light');
  });

  const languages = ['html', 'css', 'bootstrap', 'react', 'js', 'ap', 'canva', 'ai', 'c', 'cpp'];
  languages.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('language-gradient-class');
  });

  document.querySelectorAll('.project-box').forEach(Box => {
    Box.classList.toggle('language-gradient-class');
  });
}


/* =========================================
   MOBILE MENU & NAVIGATION
   ========================================= */

function hamburgerMenu() {
  document.body.classList.toggle("stopscrolling");
  const menu = document.getElementById("mobiletogglemenu");
  if(menu) menu.classList.toggle("show-toggle-menu");
  
  const b1 = document.getElementById("burger-bar1");
  const b2 = document.getElementById("burger-bar2");
  const b3 = document.getElementById("burger-bar3");
  
  if(b1) b1.classList.toggle("hamburger-animation1");
  if(b2) b2.classList.toggle("hamburger-animation2");
  if(b3) b3.classList.toggle("hamburger-animation3");
}

function hidemenubyli() {
  document.body.classList.remove("stopscrolling");
  const menu = document.getElementById("mobiletogglemenu");
  if(menu) menu.classList.remove("show-toggle-menu");

  const b1 = document.getElementById("burger-bar1");
  const b2 = document.getElementById("burger-bar2");
  const b3 = document.getElementById("burger-bar3");
  
  if(b1) b1.classList.remove("hamburger-animation1");
  if(b2) b2.classList.remove("hamburger-animation2");
  if(b3) b3.classList.remove("hamburger-animation3");
}

// Active Link Logic
const sections = document.querySelectorAll('section');
const navLi = document.querySelectorAll('.navbar .navbar-tabs .navbar-tabs-ul a li');
const mobilenavLi = document.querySelectorAll('.mobiletogglemenu .mobile-navbar-tabs-ul a li');

window.addEventListener('scroll', () => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (pageYOffset >= (sectionTop - 500)) {
      current = section.getAttribute('id');
    }
  });

  mobilenavLi.forEach(li => {
    li.classList.remove('activeThismobiletab');
    if (li.classList.contains(current)) {
      li.classList.add('activeThismobiletab');
    }
  });
  
  navLi.forEach(li => {
    li.classList.remove('activeThistab');
    if (li.classList.contains(current)) {
      li.classList.add('activeThistab');
    }
  });
});

console.log('%c Designed and Developed by Apurva Mukherjee ', 'background-image: linear-gradient(90deg,#8000ff,#6bc5f8); color: white;font-weight:900;font-size:1rem; padding:20px;');


/* =========================================
   SCROLL TO TOP & INTERACTIONS
   ========================================= */

let mybutton = document.getElementById("backtotopbutton");

window.onscroll = function() {
  scrollFunction();
};

function scrollFunction() {
  if (mybutton) {
    if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
      mybutton.style.display = "flex"; // Changed from block to flex to keep alignment
    } else {
      mybutton.style.display = "none";
    }
  }
}

function scrolltoTopfunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// Prevent context menu on images
document.addEventListener("contextmenu", function(e) {
  if (e.target.nodeName === "IMG") {
    e.preventDefault();
  }
}, false);

// Pupil Tracking Logic
let pupils = document.getElementsByClassName('pupil');
let pupilsArr = Array.from(pupils);

if (pupilsArr.length > 0) {
  let pupilStartPoint = -1;
  let pupilRange = 3;
  let mouseXStartPoint = 0;
  let mouseXEndPoint = window.innerWidth;
  let currentXPosition = 0;
  let fracXValue = 0;
  let mouseYEndPoint = window.innerHeight;
  let currentYPosition = 0;
  let fracYValue = 0;
  let mouseXRange = mouseXEndPoint - mouseXStartPoint;

  const mouseMove = (event) => {
    currentXPosition = event.clientX - mouseXStartPoint;
    fracXValue = currentXPosition / mouseXRange;

    currentYPosition = event.clientY;
    fracYValue = currentYPosition / mouseYEndPoint;

    let pupilXCurrrentPosition = pupilStartPoint + (fracXValue * pupilRange);
    let pupilYCurrrentPosition = pupilStartPoint + (fracYValue * pupilRange);

    pupilsArr.forEach((curPupil) => {
      curPupil.style.transform = `translate(${pupilXCurrrentPosition}px, ${pupilYCurrrentPosition}px)`;
    });
  }

  const windowResize = (event) => {
    mouseXEndPoint = window.innerWidth;
    mouseYEndPoint = window.innerHeight;
    mouseXRange = mouseXEndPoint - mouseXStartPoint;
  }

  window.addEventListener('mousemove', mouseMove);
  window.addEventListener('resize', windowResize);
}