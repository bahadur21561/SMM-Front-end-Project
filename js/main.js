document.addEventListener('DOMContentLoaded', () => {
    
    // 1. القائمة المنسدلة (الجديد)
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // منع إغلاق القائمة فوراً عند الضغط
        mobileMenu.classList.toggle('active');
    });

    // إغلاق القائمة عند الضغط في أي مكان خارجها
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    });


    // 2. زر قبل وبعد (النتائج)
    const btnAfter = document.getElementById('btn-after');
    const btnBefore = document.getElementById('btn-before');
    const followers = document.getElementById('followers-count');
    const posts = document.getElementById('posts-count');

    if(btnAfter && btnBefore) {
        btnAfter.addEventListener('click', () => {
            btnAfter.classList.add('active');
            btnBefore.classList.remove('active');
            updateStats("5,659,00", "565");
        });

        btnBefore.addEventListener('click', () => {
            btnBefore.classList.add('active');
            btnAfter.classList.remove('active');
            updateStats("1,200", "120");
        });
    }

    function updateStats(fCount, pCount) {
        followers.style.opacity = 0;
        posts.style.opacity = 0;
        setTimeout(() => {
            followers.innerText = fCount;
            posts.innerText = pCount;
            followers.style.opacity = 1;
            posts.style.opacity = 1;
        }, 200);
    }


    // 3. أنيميشن الظهور عند السكرول
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
});