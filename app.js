document.addEventListener('DOMContentLoaded', function () {
  const booksEndpoint = 'https://raw.githubusercontent.com/prof-lucassilva/api-books/main/livros.json';
  const bookList = document.getElementById('book-list');

  if (!bookList) {
    return;
  }

  bookList.innerHTML = '<p class="status">Carregando livros...</p>';

  fetch(booksEndpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then(books => {
      if (!Array.isArray(books) || books.length === 0) {
        bookList.innerHTML = '<p class="status error">Nenhum livro encontrado no momento.</p>';
        return;
      }

      bookList.innerHTML = '';

      books.forEach(book => {
        const bookElement = document.createElement('article');
        bookElement.classList.add('book');

        const imageUrl = book.imagem || './bookshelf.svg';

        bookElement.innerHTML = `
          <h3>${book.titulo || 'Livro sem título'}</h3>
          <img src="${imageUrl}" alt="${book.titulo || 'Capa do livro'}" loading="lazy">
          <p>${book.resumo || 'Resumo indisponível.'}</p>
        `;

        bookList.appendChild(bookElement);
      });
    })
    .catch(error => {
      console.error('Erro ao carregar os livros:', error);
      bookList.innerHTML = '<p class="status error">Não foi possível carregar os livros. Tente novamente mais tarde.</p>';
    });
});