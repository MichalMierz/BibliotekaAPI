const API_BASE = 'http://localhost:5000/api';

function showMessage(elementId, message, isError = false) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = isError ? 'error' : 'success';
    setTimeout(() => {
        element.textContent = '';
        element.className = '';
    }, 3000);
}

function clearForm(formIds) {
    formIds.forEach(id => {
        document.getElementById(id).value = '';
    });
}

// AUTHORS
async function loadAuthors() {
    try {
        const response = await fetch(`${API_BASE}/authors`);
        const authors = await response.json();
        
        const authorsList = document.getElementById('authorsList');
        const authorSelect = document.getElementById('bookAuthor');
        
        authorsList.innerHTML = '';
        authorSelect.innerHTML = '<option value="">Wybierz autora...</option>';
        
        authors.forEach(author => {
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `
                <strong>${author.firstName} ${author.lastName}</strong> (ID: ${author.id})
                <button class="btn-danger" onclick="deleteAuthor(${author.id})" style="float: right; margin-left: 10px;">Usuń</button>
            `;
            authorsList.appendChild(div);
            
            const option = document.createElement('option');
            option.value = author.id;
            option.textContent = `${author.firstName} ${author.lastName}`;
            authorSelect.appendChild(option);
        });
        
        showMessage('authorMessage', `Załadowano ${authors.length} autorów`);
    } catch (error) {
        showMessage('authorMessage', 'Błąd podczas ładowania autorów: ' + error.message, true);
    }
}

async function addAuthor() {
    const firstName = document.getElementById('authorFirstName').value;
    const lastName = document.getElementById('authorLastName').value;
    
    if (!firstName || !lastName) {
        showMessage('authorMessage', 'Proszę wypełnić wszystkie pola', true);
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/authors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName
            })
        });
        
        if (response.ok) {
            showMessage('authorMessage', 'Autor został dodany pomyślnie!');
            clearForm(['authorFirstName', 'authorLastName']);
            loadAuthors();
        } else {
            showMessage('authorMessage', 'Błąd podczas dodawania autora', true);
        }
    } catch (error) {
        showMessage('authorMessage', 'Błąd: ' + error.message, true);
    }
}

async function deleteAuthor(id) {
    if (!confirm('Czy na pewno chcesz usunąć tego autora?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/authors/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showMessage('authorMessage', 'Autor został usunięty');
            loadAuthors();
        } else {
            showMessage('authorMessage', 'Błąd podczas usuwania autora', true);
        }
    } catch (error) {
        showMessage('authorMessage', 'Błąd: ' + error.message, true);
    }
}

// BOOKS
async function loadBooks() {
    try {
        const response = await fetch(`${API_BASE}/books`);
        const books = await response.json();
        
        const booksList = document.getElementById('booksList');
        const copySelect = document.getElementById('copyBook');
        
        booksList.innerHTML = '';
        copySelect.innerHTML = '<option value="">Wybierz książkę...</option>';
        
        books.forEach(book => {
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `
                <strong>${book.title}</strong> (${book.year})<br>
                <small>Autor: ${book.authorName}</small>
                <button class="btn-danger" onclick="deleteBook(${book.id})" style="float: right; margin-left: 10px;">Usuń</button>
            `;
            booksList.appendChild(div);
            
            const option = document.createElement('option');
            option.value = book.id;
            option.textContent = `${book.title} (${book.authorName})`;
            copySelect.appendChild(option);
        });
        
        showMessage('bookMessage', `Załadowano ${books.length} książek`);
    } catch (error) {
        showMessage('bookMessage', 'Błąd podczas ładowania książek: ' + error.message, true);
    }
}

async function addBook() {
    const title = document.getElementById('bookTitle').value;
    const year = document.getElementById('bookYear').value;
    const authorId = document.getElementById('bookAuthor').value;
    
    if (!title || !year || !authorId) {
        showMessage('bookMessage', 'Proszę wypełnić wszystkie pola', true);
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                year: parseInt(year),
                authorId: parseInt(authorId)
            })
        });
        
        if (response.ok) {
            showMessage('bookMessage', 'Książka została dodana pomyślnie!');
            clearForm(['bookTitle', 'bookYear']);
            document.getElementById('bookAuthor').value = '';
            loadBooks();
        } else {
            showMessage('bookMessage', 'Błąd podczas dodawania książki', true);
        }
    } catch (error) {
        showMessage('bookMessage', 'Błąd: ' + error.message, true);
    }
}

async function deleteBook(id) {
    if (!confirm('Czy na pewno chcesz usunąć tę książkę?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/books/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showMessage('bookMessage', 'Książka została usunięta');
            loadBooks();
            loadCopies();
        } else {
            showMessage('bookMessage', 'Błąd podczas usuwania książki', true);
        }
    } catch (error) {
        showMessage('bookMessage', 'Błąd: ' + error.message, true);
    }
}

// COPIES
async function loadCopies() {
    try {
        const response = await fetch(`${API_BASE}/copies`);
        const copies = await response.json();
        
        const copiesList = document.getElementById('copiesList');
        copiesList.innerHTML = '';
        
        copies.forEach(copy => {
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `
                <strong>Egzemplarz #${copy.id}</strong><br>
                <small>Książka: ${copy.bookTitle}</small>
                <button class="btn-danger" onclick="deleteCopy(${copy.id})" style="float: right; margin-left: 10px;">Usuń</button>
            `;
            copiesList.appendChild(div);
        });
        
        showMessage('copyMessage', `Załadowano ${copies.length} egzemplarzy`);
    } catch (error) {
        showMessage('copyMessage', 'Błąd podczas ładowania egzemplarzy: ' + error.message, true);
    }
}

async function addCopy() {
    const bookId = document.getElementById('copyBook').value;
    
    if (!bookId) {
        showMessage('copyMessage', 'Proszę wybrać książkę', true);
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/copies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bookId: parseInt(bookId)
            })
        });
        
        if (response.ok) {
            showMessage('copyMessage', 'Egzemplarz został dodany pomyślnie!');
            document.getElementById('copyBook').value = '';
            loadCopies();
        } else {
            showMessage('copyMessage', 'Błąd podczas dodawania egzemplarza', true);
        }
    } catch (error) {
        showMessage('copyMessage', 'Błąd: ' + error.message, true);
    }
}

async function deleteCopy(id) {
    if (!confirm('Czy na pewno chcesz usunąć ten egzemplarz?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/copies/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showMessage('copyMessage', 'Egzemplarz został usunięty');
            loadCopies();
        } else {
            showMessage('copyMessage', 'Błąd podczas usuwania egzemplarza', true);
        }
    } catch (error) {
        showMessage('copyMessage', 'Błąd: ' + error.message, true);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadAuthors();
    loadBooks();
    loadCopies();
}); 