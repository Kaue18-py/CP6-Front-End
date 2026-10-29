document.addEventListener('DOMContentLoaded', function () {
    const booksEndpoint = 'https://raw.githubusercontent.com/prof-lucassilva/api-books/main/livros.json';
    const bookList = document.getElementById('book-list');
    const bookCount = document.getElementById('book-count');

    // ---------- Menu mobile ----------
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');
    const setMenu = (open) => {
        menu.classList.toggle('hidden', !open);
        menu.classList.toggle('flex', open);
        toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 767px)').matches) setMenu(false);
    }));

    // ---------- Animação de entrada ao rolar ----------
    const observer = 'IntersectionObserver' in window
        ? new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 })
        : null;
    const reveal = (el) => (observer ? observer.observe(el) : el.classList.add('is-visible'));
    document.querySelectorAll('.reveal').forEach(reveal);

    // ---------- Helpers ----------
    const escapeHTML = (str) => String(str).replace(/[&<>"']/g, (c) => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));

    // Skeleton de carregamento
    bookList.innerHTML = Array.from({ length: 8 }, () => `
    <div class="relative h-96 overflow-hidden rounded-2xl bg-ink-800">
      <div class="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
    </div>`).join('');

    fetch(booksEndpoint)
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then((books) => {
            bookList.innerHTML = '';
            bookCount.textContent = `${books.length} livros selecionados`;

            books.forEach((book, i) => {
                const bookElement = document.createElement('article');
                bookElement.classList.add('book', `book-${book.id}`, 'book-card', 'group', 'reveal');
                bookElement.style.animationDelay = `${(i % 4) * 90}ms`;
                bookElement.innerHTML = `
          <div class="relative flex items-center justify-center bg-gradient-to-b from-ink-700 to-ink-800 p-6">
            <span class="absolute left-3 top-3 rounded-full bg-accent-500 px-2.5 py-0.5 text-xs font-bold text-ink-900">#${escapeHTML(book.id)}</span>
            <img src="${escapeHTML(book.imagem)}" alt="Capa do livro ${escapeHTML(book.titulo)}" loading="lazy"
                 class="h-56 w-auto max-w-full rounded-md object-contain shadow-xl shadow-black/50 transition duration-500 ease-out group-hover:-rotate-3 group-hover:scale-110">
          </div>
          <div class="flex flex-1 flex-col gap-2 p-5">
            <h3 class="font-display text-lg font-bold leading-snug text-white transition-colors group-hover:text-brand-400">${escapeHTML(book.titulo)}</h3>
            <p class="text-sm leading-relaxed text-slate-400">${escapeHTML(book.resumo)}</p>
          </div>
        `;
                bookList.appendChild(bookElement);
                reveal(bookElement);
            });
        })
        .catch((error) => {
            console.error('Erro ao carregar os livros:', error);
            bookList.innerHTML = `
        <p class="col-span-full rounded-2xl border border-red-400/30 bg-red-500/10 p-6 text-center text-red-200">
          Não foi possível carregar os livros agora. Tente novamente mais tarde.
        </p>`;
        });
});
