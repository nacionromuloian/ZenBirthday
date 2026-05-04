function createSparkle(x, y, isTrace = false) {
    const container = document.getElementById('sparkles-container');
    if (!container) return;
    
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    
    if (isTrace) {
        sparkle.classList.add('trace-sparkle');
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        const size = Math.random() * 6 + 2;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        
        // Random slight drift for trace
        const driftX = (Math.random() - 0.5) * 40;
        const driftY = (Math.random() - 0.5) * 40;
        sparkle.style.setProperty('--drift-x', `${driftX}px`);
        sparkle.style.setProperty('--drift-y', `${driftY}px`);
        
        setTimeout(() => sparkle.remove(), 1000);
    } else {
        sparkle.classList.add('ambient-sparkle');
        const startX = Math.random() * window.innerWidth;
        const size = Math.random() * 5 + 2;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 5;

        sparkle.style.left = `${startX}px`;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.animationDuration = `${duration}s`;
        sparkle.style.animationDelay = `${delay}s`;

        setTimeout(() => sparkle.remove(), (duration + delay) * 1000);
    }

    container.appendChild(sparkle);
}

// Cursor Trace Listener
let lastMove = 0;
window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastMove > 30) { // Throttling for performance
        createSparkle(e.clientX, e.clientY, true);
        lastMove = now;
    }
});

// Countdown Timer Logic
const targetDate = new Date('May 23, 2026 10:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const d = document.getElementById('days');
    const h = document.getElementById('hours');
    const m = document.getElementById('minutes');
    const s = document.getElementById('seconds');

    if (d) d.innerText = days < 10 ? '0' + days : days;
    if (h) h.innerText = hours < 10 ? '0' + hours : hours;
    if (m) m.innerText = minutes < 10 ? '0' + minutes : minutes;
    if (s) s.innerText = seconds < 10 ? '0' + seconds : seconds;

    if (distance < 0) {
        clearInterval(countdownInterval);
        const cd = document.getElementById('countdown');
        if (cd) cd.innerHTML = "<h3>The Celebration has Begun!</h3>";
    }
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

// Slideshow Logic
const sections = document.querySelectorAll('section');
let currentSlide = 0;

function showSlide(index) {
    if (sections.length === 0) return;
    
    sections.forEach((section, i) => {
        section.classList.toggle('active', i === index);
        if (i === index) section.scrollTop = 0;
    });
    
    const nextBtn = document.getElementById('next-slide');
    if (nextBtn) {
        if (index === sections.length - 1) {
            nextBtn.querySelector('span').innerText = 'Back to Top';
            nextBtn.querySelector('.arrow').style.transform = 'rotate(-135deg)';
        } else {
            nextBtn.querySelector('span').innerText = 'Next';
            nextBtn.querySelector('.arrow').style.transform = 'rotate(45deg)';
        }
    }
}

// Global Bouncing Bears Logic
let bears = [];

function initGlobalBears() {
    const container = document.getElementById('bouncing-bears-container');
    if (!container) return;

    for (let i = 0; i < 15; i++) { // Increased to 15 bears
        const bear = document.createElement('div');
        bear.className = 'bouncing-bear teddy-bear-illust';
        bear.style.transform = `scale(${Math.random() * 0.2 + 0.2})`; // Varying sizes
        bear.innerHTML = `
            <div class="bear-head"><div class="ear left"></div><div class="ear right"></div><div class="eye left"></div><div class="eye right"></div><div class="nose"></div></div>
            <div class="bear-body"></div>
        `;
        
        const bearObj = {
            el: bear,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            dx: (Math.random() - 0.5) * 3, // Slightly slower for less distraction
            dy: (Math.random() - 0.5) * 3
        };
        
        container.appendChild(bear);
        bears.push(bearObj);
    }

    animateBears();
}

function animateBears() {
    bears.forEach(b => {
        b.x += b.dx;
        b.y += b.dy;

        // Bounce off screen boundaries
        if (b.x <= -20 || b.x >= window.innerWidth - 80) b.dx *= -1;
        if (b.y <= -20 || b.y >= window.innerHeight - 80) b.dy *= -1;

        b.el.style.left = b.x + 'px';
        b.el.style.top = b.y + 'px';
    });
    requestAnimationFrame(animateBears); // Use smooth raf instead of setInterval
}

// Initialize on page load
initGlobalBears();

if (sections.length > 0) {
    document.getElementById('next-slide').addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % sections.length;
        showSlide(currentSlide);
    });

    // Initial show
    showSlide(0);
}

// Guest Verification Logic
const GUEST_DATABASE = {
    // Lola
    "Gilda Mendoza": { surname: "Mendoza", category: "Lola" },
    "Noemi Nacion": { surname: "Nacion", category: "Lola" },
    "Ana Lisa Dimingo": { surname: "Dimingo", category: "Lola" },
    "Noeda Cañon": { surname: "Cañon", category: "Lola" },
    "Nerry Bernardo": { surname: "Bernardo", category: "Lola" },
    "Agnes Nacion": { surname: "Nacion", category: "Lola" },
    // Lolo
    "Jose Mendoza": { surname: "Mendoza", category: "Lolo" },
    "Noriel Bernardo": { surname: "Bernardo", category: "Lolo" },
    "Zaldy Cañon": { surname: "Cañon", category: "Lolo" },
    "Jaffy Jurado": { surname: "Jurado", category: "Lolo" },
    // Tita
    "Melissa Mendoza": { surname: "Mendoza", category: "Tita" },
    "Jovilyn Martirez": { surname: "Martirez", category: "Tita" },
    "Henny Tagle": { surname: "Tagle", category: "Tita" },
    "Jona Beltran": { surname: "Beltran", category: "Tita" },
    "Rochel Bautista": { surname: "Bautista", category: "Tita" },
    "Janine Farmis": { surname: "Farmis", category: "Tita" },
    "Lisa Nacion": { surname: "Nacion", category: "Tita" },
    "Shai Rocero": { surname: "Rocero", category: "Tita" },
    "Mary Grace Mendoza": { surname: "Mendoza", category: "Tita" },
    "Joyce Ortega": { surname: "Ortega", category: "Tita" },
    "Aerylle Diez": { surname: "Diez", category: "Tita" },
    // Tito
    "Mark Garais": { surname: "Garais", category: "Tito" },
    "Jake Cañon": { surname: "Cañon", category: "Tito" },
    "Ariel Acosta": { surname: "Acosta", category: "Tito" },
    "Rhad Oliveros": { surname: "Oliveros", category: "Tito" },
    "Kingbezar ezar": { surname: "ezar", category: "Tito" },
    // Ate
    "Shane Tagle": { surname: "Tagle", category: "Ate" },
    "Justine Eliza Nacion": { surname: "Nacion", category: "Ate" },
    // Kuya
    "Teo Tagle": { surname: "Tagle", category: "Kuya" },
    // Ninang
    "Gypsy Kaye Pineda": { surname: "Pineda", category: "Ninang" },
    "April Nacion": { surname: "Nacion", category: "Ninang" },
    "Jonalyn Nacion": { surname: "Nacion", category: "Ninang" },
    "Mary Jane Nacion": { surname: "Nacion", category: "Ninang" },
    "Joice Nacion": { surname: "Nacion", category: "Ninang" },
    "Rialyn Baarde": { surname: "Baarde", category: "Ninang" },
    "Jezel Lopez Bertanico": { surname: "Bertanico", category: "Ninang" },
    "Nicole Canon": { surname: "Canon", category: "Ninang" },
    "Maureen Bernardo": { surname: "Bernardo", category: "Ninang" },
    "Shiela Tagle": { surname: "Tagle", category: "Ninang" },
    "Camille Leodones": { surname: "Leodones", category: "Ninang" },
    "Louise Mae Tolentino": { surname: "Tolentino", category: "Ninang" },
    "Laudette Alvarez": { surname: "Alvarez", category: "Ninang" },
    "Maricris Gelsano": { surname: "Gelsano", category: "Ninang" },
    "Marimar Quiazon": { surname: "Quiazon", category: "Ninang" },
    "Rho-Ann Paloma": { surname: "Paloma", category: "Ninang" },
    "Romina Medel": { surname: "Medel", category: "Ninang" },
    "Charise Payawal": { surname: "Payawal", category: "Ninang" },
    "Josephine Mendoza": { surname: "Mendoza", category: "Ninang" },
    "Nikki Raynera": { surname: "Raynera", category: "Ninang" },
    "Camilla Berbano": { surname: "Berbano", category: "Ninang" },
    "Mike Blacer": { surname: "Blacer", category: "Ninang" },
    "Iralyn Mendones": { surname: "Mendones", category: "Ninang" },
    "Krisha Banez": { surname: "Banez", category: "Ninang" },
    "Nelsi Asperas": { surname: "Asperas", category: "Ninang" },
    // Ninong
    "Jerie Nacion": { surname: "Nacion", category: "Ninong" },
    "Joseph Mendoza": { surname: "Mendoza", category: "Ninong" },
    "Kurt Nacion": { surname: "Nacion", category: "Ninong" },
    "Jc Canon": { surname: "Canon", category: "Ninong" },
    "Nathaniel Bernardo": { surname: "Bernardo", category: "Ninong" },
    "Ryan Francis Nacion": { surname: "Nacion", category: "Ninong" },
    "Romulo Ian Nacion": { surname: "Nacion", category: "Ninong" },
    "James Tagle": { surname: "Tagle", category: "Ninong" },
    "Karlo Quesada": { surname: "Quesada", category: "Ninong" },
    "Cedric Nacion": { surname: "Nacion", category: "Ninong" },
    "Sammy Buendia": { surname: "Buendia", category: "Ninong" },
    "John Christoffer Tolentino": { surname: "Tolentino", category: "Ninong" },
    "Eleazar Ang": { surname: "Ang", category: "Ninong" },
    "Arnold Denosta": { surname: "Denosta", category: "Ninong" },
    "Boss bam": { surname: "bam", category: "Ninong" },
    "Prince babar": { surname: "babar", category: "Ninong" },
    "Pj ezar": { surname: "ezar", category: "Ninong" },
    "Jec mendoza": { surname: "mendoza", category: "Ninong" },
    "Toby yañga": { surname: "yañga", category: "Ninong" },
    "Mark Benedict Cruz": { surname: "Cruz", category: "Ninong" },
    "JR Habitan": { surname: "Habitan", category: "Ninong" },
    "Tevince Cludel": { surname: "Cludel", category: "Ninong" }
};

const verificationForm = document.getElementById('verification-form');
if (verificationForm) {
    verificationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredFirstname = document.getElementById('firstname-input').value.trim().toLowerCase();
        const enteredSurname = document.getElementById('surname-input').value.trim().toLowerCase();
        const errorMsg = document.getElementById('verification-error');

        // Secret Admin Login
        if (enteredFirstname === 'joms' && enteredSurname === 'smoj') {
            window.location.href = 'admin.html';
            return;
        }

        let verifiedGuest = null;
        let guestCategory = "";
        let prefixGuest = null;
        let prefixGuestCategory = "";

        for (const [fullName, data] of Object.entries(GUEST_DATABASE)) {
            if (data.surname.toLowerCase() !== enteredSurname) continue;

            const givenName = fullName
                .slice(0, fullName.length - data.surname.length)
                .trim()
                .toLowerCase();

            // Prefer exact given-name matches before falling back to prefix matches.
            if (givenName === enteredFirstname) {
                verifiedGuest = fullName;
                guestCategory = data.category;
                break;
            }

            if (!prefixGuest && givenName.startsWith(enteredFirstname)) {
                prefixGuest = fullName;
                prefixGuestCategory = data.category;
            }
        }

        if (!verifiedGuest && prefixGuest) {
            verifiedGuest = prefixGuest;
            guestCategory = prefixGuestCategory;
        }

        if (verifiedGuest) {
            window.location.href = `invitation.html?name=${encodeURIComponent(verifiedGuest)}&category=${encodeURIComponent(guestCategory)}`;
        } else {
            errorMsg.innerText = "Guest not found or surname incorrect. Please try again.";
            errorMsg.style.display = 'block';
            setTimeout(() => {
                errorMsg.style.display = 'none';
            }, 3000);
        }
    });
}

// Create sparkles periodically
setInterval(createSparkle, 300);
