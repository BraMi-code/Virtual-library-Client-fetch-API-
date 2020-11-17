var book = {
    containerId: 'book',
    apiServer: API_URL,
    libraryTemplate: `
        <div id="book" class="bookAuth center">
            <div class="bookForm" id="bookP">
                <div class="spinner" id="spinner"></div>
                <div>
                    <button class="button" id="createBook">Add Book</button>
                </div>
                <div>
                    <button id="getBooks" class="button">Get Books</button>
                </div>
                <div class="getBook">
                    <button id="getBook" class="button">Find A Book</button>
                    <div id="findByIsbn" class="inputFind">
                        <input placeholder="ISBN" name="isbn-get">
                    </div>
                </div>
            </div>
        </div>
    `.trim(),
    showBookPage: function() {
        document.getElementById('testProtectedButton').style.display  = "none";
        document.getElementById(this.containerId).innerHTML = this.libraryTemplate;
        document.getElementById('createBook').onclick = this.showAddBook.bind(this);
        document.getElementById('getBooks').onclick = this.showAllBooksTemplate.bind(this);
        document.getElementById('getBook').onclick = this.showInput.bind(this);
    },
    showInput: function() {
        document.getElementById('findByIsbn').style.display = "block";
        document.getElementById('getBook').onclick = this.findBook.bind(this);
   },
    addBookTemplate: `
    <div id="book" class="bookAuth">
        <div class="bookForm">
            <button id="backBtn">BACK</button>
            <div class="spinner" id="spinner"></div>
            <h3>Create New Book</h3>
            <div>
                <label for="isbn">ISBN</label>
                <input type="text" placeholder="isbn No." id="isbnField" name="isbn">
            </div>
            <div>
                <label for="title">Title</label>
                <input placeholder="Book title" name="title">
            </div>
            <div>
                <label for="author">Author</label>
                <input placeholder="Book author" name="author">
            </div>
            <div>
                <label for="publish_date">Published Date</label>
                <input type="date" name="publish_date">
            </div>
            <div>
                <label for="publisher">Publisher</label>
                <input placeholder="Book publisher" name="publisher">
            </div>
            <div>
                <label for="numOfPages">Number Of Pages</label>
                <input type="number"  id="numOfPages" placeholder="Number of pages" name="numOfPages">
                <button class="button" id="createBook">Create Book</button>
            </div>
        </div>
    </div>
    `.trim(),
    showAddBook: function () {
        document.getElementById(this.containerId).innerHTML = this.addBookTemplate;
        document.getElementById('createBook').onclick = this.createBook.bind(this);
        document.getElementById('backBtn').onclick = this.showBookPage.bind(this);
    },
    createBook: function() {
        console.log("Here goes code for saving book");
        var book = {
            "isbn": document.querySelector('[name="isbn"]').value,
            "title": document.querySelector('[name="title"]').value,
            "author": document.querySelector('[name="author"]').value,
            "publish_date": document.querySelector('[name="publish_date"]').value,
            "publisher": document.querySelector('[name="publisher"]').value,
            "numOfPages": document.querySelector('[name="numOfPages"]').value
        };
        user.showSpinner();
        console.log(book);
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState==4 && this.status==200) {
                console.log(xhttp.responseText);
                user.hideSpinner();
                user.exitAuthAndMsg("Book created!");
                /* book.showBookPage; Ovdje bih ubacila i bind,
                 ali ne kontam kakvu ulogu ima.
                 Htjela bih da me vrati na pocetnu kada se knjiga sacuva u bazi */
            }
        };
        xhttp.open("POST", API_URL + "/book", true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify(book));
    },
    allBooksTemplate: `
    <div id="book" class="bookAuth">
        <div class="bookForm" id="bookP">
            <button id="backBtn">BACK</button>
            <!--- Book List Goes Here -->
            <table>
                <thead>
                    <tr>
                        <th>ISBN</th>
                        <th>Title</th>
                        <th>Author</th>
                    </tr>
                </thead>
                <tbody  id="bookList">
                    <tr>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `.trim(),
    showAllBooksTemplate: function() {
        document.getElementById(this.containerId).innerHTML = this.allBooksTemplate;
        document.getElementById('backBtn').onclick = this.showBookPage.bind(this);
        this.getBooks();
    },
    getBooks: function() {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState==4 && this.status==200) {
                console.log(xhttp.responseText);
                var res = JSON.parse(xhttp.responseText);
                var bookList = res.length;
                for (i=0; i<=bookList; i++) {
                    document.getElementById('bookList').innerHTML += "<td>" + res[i].isbn + "</td>" + "<td>" + res[i].title + "</td>" + "<td>" + res[i].author + "</td>";
                }
            }
        };
        xhttp.open("GET", API_URL + "/books", true);
        xhttp.send();
    },
    bookFoundTemplate: `
    <div id="book" class="bookAuth">
        <div class="bookForm" id="bookFound">
            <div class="spinner" id="spinner"></div>
                <button id="backBtn">BACK</button>
                <h3>Book found!</h3>
            <div id="book-info">
                ISBN: <p id="isbn" name="isbn" class="book-info"></p>
                TITLE: <p id="title" class="book-info"></p>
                AUTHOR: <p id="author" class="book-info"></p>
                PUBLISH DATE: <p id="publish_date" class="book-info"></p>
                PUBLISHER: <p id="publisher" class="book-info"></p>
                NUMBER OF PAGES: <p id="numOfPages" class="book-info"></p>
            </div>
            <div class="deleteBook">
                <button id="deleteBook" class="button">Delete Book</button>
            </div>
            <div class="editBook">
                <button id="editBook" class="button">Edit Book</button>
            </div>
        </div>
    </div>
    `.trim(),
    showBookFound: function() {
       // document.getElementById('findByIsbn').style.display = "none";
        document.getElementById(this.containerId).innerHTML = this.bookFoundTemplate;
        user.exitAuthAndMsg("Book found!");
        document.getElementById('backBtn').onclick = this.showBookPage.bind(this);
        document.getElementById('deleteBook').onclick = this.deletePrompt.bind(this);
        document.getElementById('editBook').onclick = this.showEditBook.bind(this);
    },
    findBook: function() {
        user.showSpinner();
        var isbn = document.querySelector('[name="isbn-get"]').value;
        console.log(isbn);
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState==4 && this.status==200) {
                var res = JSON.parse(xhttp.responseText);
                console.log(xhttp.response);
                book.showBookFound();
                user.hideSpinner();
                document.getElementById('isbn').innerHTML = res.isbn;
                document.getElementById('title').innerHTML = res.title;
                document.getElementById('author').innerHTML = res.author;
                document.getElementById('publish_date').innerHTML = res.publish_date.substring(0,10);
                document.getElementById('publisher').innerHTML = res.publisher;
                document.getElementById('numOfPages').innerHTML = res.numOfPages;
            }
        }
        xhttp.open("GET", API_URL + "/book/" + document.querySelector('[name="isbn-get"]').value, true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send();
    },
    deletePrompt: function() {
        var isbn = document.getElementById('isbn').innerHTML;
        console.log(isbn);
        result = confirm("Are you sure you want to delete the book with isbn: " + isbn + "?");
        if (result) {
            user.showSpinner();
            this.deleteBook();
        }
    },
    deleteBook: function() {
        var isbn = document.getElementById('isbn').innerHTML;
        console.log(isbn);

        var book =  {
            'isbn': isbn
        }
        console.log(JSON.stringify(book));

        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState==4 && this.status==200) {
                console.log(xhttp.responseText);
                user.hideSpinner();
                user.exitAuthAndMsg('Book deleted');
               // var info = document.querySelectorAll('.book-info');
               // info.innerHTML = "";
                /*      
                Ovdje bih dodala kod da vrati na pocetnu stranu 
                nakon uspjesne delete sesije 
                ili da 
                    isprazni polja 
                */
            }
        }
        xhttp.open("DELETE", API_URL + "/book/" + isbn, true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send();
    },
    getBook: function() {
        user.showSpinner();
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState==4 && this.status==200) {
                var res = JSON.parse(xhttp.responseText);
                document.querySelector('[name="isbn"]').value = res.isbn;
                document.querySelector('[name="title"]').value = res.title;
                document.querySelector('[name="author"]').value = res.author;
                console.log(res.publish_date.substring(0,10));
                document.querySelector('[name="publish_date"]').value = res.publish_date.substring(0,10);
                document.querySelector('[name="publisher"]').value = res.publisher;
                document.querySelector('[name="numOfPages"]').value = res.numOfPages;  
                user.hideSpinner();
                user.exitAuthAndMsg('Book found!');
            }
        }
        xhttp.open("GET", API_URL + "/book/" + document.querySelector('[name="isbn-get"]').value, true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send();
    },
    editBookTemplate: `
    <div id="book" class="bookAuth">
        <div class="bookForm" id="bookP">
            <button id="backBtn">BACK</button>
            <div class="spinner" id="spinner"></div>
            <div>
                <label for="isbn">ISBN</label>
                <input type="text" placeholder="isbn No." id="isbnField" name="isbn">
            </div>
            <div>
                <label for="title">Title</label>
                <input placeholder="Book title" name="title">
            </div>
            <div>
                <label for="author">Author</label>
                <input placeholder="Book author" name="author">
            </div>
            <div>
                <label for="publish_date">Published Date</label>
                <input type="date" name="publish_date">
            </div>
            <div>
                <label for="publisher">Publisher</label>
                <input placeholder="Book publisher" name="publisher">
            </div>
            <div>
                <label for="numOfPages">Number Of Pages</label>
                <input type="number"  id="numOfPages" placeholder="Number of pages" name="numOfPages">
                <button class="button" id="saveEdit">Save Edit</button>
            </div>
        </div>
    </div>
    `.trim(),
    showEditBook: function() {
        document.getElementById(this.containerId).innerHTML = this.editBookTemplate;
        /* Dodati kod za edit izabrane knjige */
        document.getElementById('backBtn').onclick = this.showBookFound.bind(this);
    },
    saveEditBook: function() {
        user.showSpinner();
        var book = {
            "isbn": document.querySelector('[name="isbn"]').value,
            "title": document.querySelector('[name="title"]').value,
            "author": document.querySelector('[name="author"]').value,
            "publish_date": document.querySelector('[name="publish_date"]').value,
            "publisher": document.querySelector('[name="publisher"]').value,
            "numOfPages": document.querySelector('[name="numOfPages"]').value
        };
        console.log(book);
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState==4 && this.status==200) {
                console.log(xhttp.responseText);
                user.hideSpinner();
                user.exitAuthAndMsg('Book edited successfully!');
            }
        };
        xhttp.open("PUT", API_URL + "/book/" + document.querySelector('[name="isbn-get"]').value, true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify(book));
    }
};