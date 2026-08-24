document.addEventListener('DOMContentLoaded', function () {
    const judulNovel = infoNovel.judul;
    const subtitleNovel = infoNovel.subtitle;
    const penulisNovel = infoNovel.penulis;
    const chapters = daftarChapter;
    document.getElementById('judul-novel').textContent = judulNovel;
    document.getElementById('subtitle-novel').textContent = subtitleNovel;
    document.getElementById('penulis-novel').textContent = penulisNovel;

  if (infoNovel.linkWattpad) {
        document.getElementById('link-wattpad').href = infoNovel.linkWattpad;
    }
    if (infoNovel.linkSaweria) {
        document.getElementById('link-saweria').href = infoNovel.linkSaweria;
    }
    const chapterListEl = document.getElementById('chapter-list');
    
    chapters.forEach((chapter, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="#" class="chapter-link" data-target="chapter-${index}">
                <span class="chapter-number">${chapter.bab}</span>
                <span class="chapter-name">${chapter.judul}</span>
                <span class="chapter-arrow">→</span>
            </a>
        `;
        chapterListEl.appendChild(li);
    });
    const chapterPagesEl = document.getElementById('chapter-pages');
    
    chapters.forEach((chapter, index) => {
        const paragrafArray = chapter.naskah.split('\n\n');
        const paragrafHTML = paragrafArray.map(p => `<p>${p.trim()}</p>`).join('');
        
        const section = document.createElement('section');
        section.id = `chapter-${index}`;
        section.className = 'chapter-page page';
        section.innerHTML = `
            <div class="container chapter-container">
                <button class="btn-kembali" data-target="halaman-daftar-isi">← Kembali ke Daftar Isi</button>
                <article class="chapter-content">
                    <header class="chapter-header">
                        <p class="chapter-label">${chapter.bab}</p>
                        <h1 class="chapter-title">${chapter.judul}</h1>
                        <div class="chapter-divider"></div>
                    </header>
                    <div class="chapter-text">
                        ${paragrafHTML}
                    </div>
                </article>
            </div>
        `;
        chapterPagesEl.appendChild(section);
    });
    const semuaHalaman = document.querySelectorAll('.page');
    
    function tampilkanHalaman(idHalaman) {
        semuaHalaman.forEach(halaman => {
            halaman.classList.remove('active');
        });
        
        const halamanTarget = document.getElementById(idHalaman);
        if (halamanTarget) {
            halamanTarget.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    document.querySelectorAll('.chapter-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            tampilkanHalaman(targetId);
        });
    });
    document.querySelectorAll('.btn-kembali').forEach(btn => {
        btn.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            tampilkanHalaman(targetId);
        });
    });
    document.getElementById('logo-link').addEventListener('click', function (e) {
        e.preventDefault();
        tampilkanHalaman('halaman-daftar-isi');
    });
    const btnKecil = document.getElementById('btn-kecil');
    const btnNormal = document.getElementById('btn-normal');
    const btnBesar = document.getElementById('btn-besar');
    const bodyElement = document.body;

    function setTombolAktif(ukuran) {
        [btnKecil, btnNormal, btnBesar].forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (ukuran === '16px') btnKecil.classList.add('active');
        else if (ukuran === '18px') btnNormal.classList.add('active');
        else if (ukuran === '21px') btnBesar.classList.add('active');
    }

    function ubahUkuranFont(ukuran) {
        bodyElement.style.fontSize = ukuran;
        localStorage.setItem('ukuranFont', ukuran);
        setTombolAktif(ukuran);
    }

    const ukuranTersimpan = localStorage.getItem('ukuranFont');
    if (ukuranTersimpan) {
        bodyElement.style.fontSize = ukuranTersimpan;
        setTombolAktif(ukuranTersimpan);
    }

    btnKecil.addEventListener('click', () => ubahUkuranFont('16px'));
    btnNormal.addEventListener('click', () => ubahUkuranFont('18px'));
    btnBesar.addEventListener('click', () => ubahUkuranFont('21px'));
    const toast = document.getElementById('toast');
    let toastTimeout;

    function showToast() {
        toast.classList.add('show');
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    async function copyLinkWebsite() {
        const currentUrl = window.location.href;
        try {
            await navigator.clipboard.writeText(currentUrl);
            showToast();
        } catch (err) {
            try {
                const textarea = document.createElement('textarea');
                textarea.value = currentUrl;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                showToast();
            } catch (fallbackErr) {
                alert('Gagal menyalin otomatis. Silakan salin manual: ' + currentUrl);
            }
        }
    }

    document.getElementById('btn-copy-link').addEventListener('click', copyLinkWebsite);
    document.getElementById('btn-copy-link-footer').addEventListener('click', copyLinkWebsite);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const chapterAktif = document.querySelector('.chapter-page.active');
            if (chapterAktif) {
                tampilkanHalaman('halaman-daftar-isi');
            }
        }
    });

    console.log('📖 Website novel siap!');
    console.log('✏️ Edit file data.js untuk mengubah naskah');
});
