window.addEventListener("load", () => {
  const preloader = document.getElementById("custom-preloader");

  // Wait 3 seconds before starting fade out
  setTimeout(() => {
    preloader.style.transition = "opacity 0.5s ease";
    preloader.style.opacity = "0";

    // Wait for fade to finish (0.5s), then hide completely
    setTimeout(() => {
      preloader.style.display = "none";
      document.getElementById("resumeBtn").classList.remove("hide-during-preload");
      // Fallback preloader removal
      const p2 = document.getElementById("preloader");
      if(p2) p2.style.display = "none";
      
      document.querySelectorAll('.hide-during-preload').forEach(el => {
        el.classList.add('visible');
        el.style.visibility = 'visible';
      });
    }, 500); 
  }, 2700); 
});

// Matrix Effect Logic
const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();

const letters = "アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// Adjust font size for mobile
let fontSize = window.innerWidth < 768 ? 10 : 14;
let columns = canvas.width / fontSize;
let drops = [];

function initDrops() {
  columns = canvas.width / fontSize;
  drops = Array.from({ length: Math.ceil(columns) }).fill(1);
}
initDrops();

function drawMatrix() {
  // Use a slight opacity to create the trail effect
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#5c0404"; // red color
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = letters[Math.floor(Math.random() * letters.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    // Randomize reset to create rain effect
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

// Run matrix animation
setInterval(drawMatrix, 33);

// Handle window resize
window.addEventListener("resize", () => {
  resizeCanvas();
  // Recalculate columns on resize
  fontSize = window.innerWidth < 768 ? 10 : 14;
  initDrops();
});

// Settings & Visual Mode
function settingtoggle(){
  document.getElementById("setting-container").classList.toggle('settingactivate');
  document.getElementById("visualmodetogglebuttoncontainer").classList.toggle('visualmodeshow');
  document.getElementById("soundtogglebuttoncontainer").classList.toggle('soundmodeshow');
}

// Sound Toggle (assuming 'audio' variable exists globally or is meant to be defined)
// If audio is not defined in this file, ensure it exists in your HTML or add: const audio = new Audio('path/to/sound.mp3');
function playpause() {
  if (typeof audio !== 'undefined') {
      if (document.getElementById('switchforsound').checked == false) {
        audio.pause();
      } else{
        audio.play();
      }
  }
}

function visualmode(){
    document.body.classList.toggle('light-mode');
    document.getElementById('labelforsound').classList.toggle('invertsoundlabel');
    
    // Toggle light mode classes for headings and borders
    const headings = [
        '.about-heading-article', '.aboutHeadingP', 
        '.skills-heading-article', '.skillsHeadingP',
        '.projects-heading-article', '.projectsHeadingP',
        '.frontend-dev-heading', '.designing-heading', '.languages-heading'
    ];
    
    headings.forEach(cls => {
        const el = document.querySelector(cls);
        if(el) el.classList.toggle('heading-article-light');
    });

    const languages = ['html', 'css', 'bootstrap', 'react', 'js', 'ap', 'canva', 'ai', 'c', 'cpp'];
    languages.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.toggle('language-gradient-class');
    });

    let projectBox = document.querySelectorAll('.project-box');
    projectBox.forEach(Box => {
        Box.classList.toggle('language-gradient-class');
    });
}

// Mobile Menu Logic
function hamburgerMenu() {
    document.body.classList.toggle("stopscrolling");
    document.getElementById("mobiletogglemenu").classList.toggle("show-toggle-menu");
    document.getElementById("burger-bar1").classList.toggle("hamburger-animation1");
    document.getElementById("burger-bar2").classList.toggle("hamburger-animation2");
    document.getElementById("burger-bar3").classList.toggle("hamburger-animation3");
}

function hidemenubyli(){
    document.body.classList.remove("stopscrolling");
    document.getElementById("mobiletogglemenu").classList.remove("show-toggle-menu");
    document.getElementById("burger-bar1").classList.remove("hamburger-animation1");
    document.getElementById("burger-bar2").classList.remove("hamburger-animation2");
    document.getElementById("burger-bar3").classList.remove("hamburger-animation3");
}

// Active Tab on Scroll
const sections = document.querySelectorAll('section');
const navLi = document.querySelectorAll('.navbar .navbar-tabs .navbar-tabs-ul a li');
const mobilenavLi = document.querySelectorAll('.mobiletogglemenu .mobile-navbar-tabs-ul a li');

window.addEventListener('scroll', ()=>{
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    // const sectionHeight = section.clientHeight;
    if(pageYOffset >= (sectionTop - 500)){
      current = section.getAttribute('id');
    }
  })

  mobilenavLi.forEach( li => {
    li.classList.remove('activeThismobiletab');
    if(li.classList.contains(current)){
      li.classList.add('activeThismobiletab')
    }
  })
  navLi.forEach( li => {
    li.classList.remove('activeThistab');
    if(li.classList.contains(current)){
      li.classList.add('activeThistab')
    }
  })
});

// Console Signature
console.log('%c Designed and Developed by Apurva Mukherjee ', 'background-image: linear-gradient(90deg,#8000ff,#6bc5f8); color: white;font-weight:900;font-size:1rem; padding:20px;');

// Back to Top Button
let mybutton = document.getElementById("backtotopbutton");
window.onscroll = function(){
  scrollFunction()
};

function scrollFunction(){
  if(document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
    mybutton.style.display = "flex";
  } else{
    mybutton.style.display = "none";
  }
}

function scrolltoTopfunction(){
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// Prevent Context Menu on Images
document.addEventListener("contextmenu", function(e){
  if (e.target.nodeName === "IMG") {
      e.preventDefault();
  }
}, false);

// Pupil Animation
let pupils = document.getElementsByClassName('pupil');
let pupilsArr = Array.from(pupils);
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
        curPupil.style.transform= `translate(${pupilXCurrrentPosition}px, ${pupilYCurrrentPosition}px)`;
    })
}

const windowResize = (event) => {
    mouseXEndPoint = window.innerWidth;
    mouseYEndPoint = window.innerHeight;
    mouseXRange = mouseXEndPoint - mouseXStartPoint;
}

window.addEventListener('mousemove', mouseMove);
window.addEventListener('resize', windowResize);