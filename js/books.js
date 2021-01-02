var book = {
    containerId: 'book',
    apiServer: API_URL + ':' + API_PORT,
    libraryTemplate: `
         <div class="bookForm">
            <div class="spinner" id="spinner"></div>
            <div class="error" id="error"></div>
            <div>
                <button class="button" id="createBook">Add Book</button>
            </div>
            <div>
                <button id="getBooks" class="button">Get Books</button>
            </div>
            <div class="getBook">
                <div id="findByIsbn" class="inputFind">
                    <input placeholder="ISBN" name="isbn-get">
                </div>
                <button id="getBook" class="button">Find A Book</button>
              
            </div>
            <div>
                <button id="logoutBtn"><img src="./img/logout.png" alt="logout" class="logoutIcon"></button>
            </div>
        </div>`.trim(),
    showBookPage: function() {
        document.getElementById(this.containerId).innerHTML = this.libraryTemplate;
        document.getElementById('createBook').onclick = this.showAddBook.bind(this);
        document.getElementById('getBooks').onclick = this.showAllBooksTemplate.bind(this);
        document.getElementById('getBook').onclick = this.showInput.bind(this);
        document.getElementById('logoutBtn').onclick = user.logout.bind(this);
    },
    showInput: function() {
        document.getElementById('findByIsbn').style.display = "block";
        document.getElementById('getBook').onclick = this.findBook.bind(this);
   },
    addBookTemplate: `
        <div class="bookForm">
            <button id="backBtn" class="button">BACK</button>
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
                <input type="number"  id="pgsField" placeholder="Number of pages" name="numOfPages">
            </div>
            <div>
                <input type='file' name="book_img">
            </div>
            <div>
                <button id="createBook">Create Book</button>
            </div>
        </div>`.trim(),
    showAddBook: function () {
        document.getElementById(this.containerId).innerHTML = this.addBookTemplate;
        document.getElementById('createBook').onclick = this.createBook.bind(this);
        document.getElementById('backBtn').onclick = this.showBookPage.bind(this);
    },
    createBook: function() {
        if (!user.isLoggedIn()) {
            user.showLogin();
            user.showError('You must be logged in');
            return;
        }
        user.showSpinner();

        var form = new FormData();
        var img =
        document.querySelector('[name="book_img"]').files[0];
        console.log(img.name, img.size, img.type);
        form.append('book_img', img);
        form.append('isbn', document.querySelector('[name="isbn"]').value);
        form.append('title', document.querySelector('[name="title"]').value);
        form.append('author', document.querySelector('[name="author"]').value);
        form.append('publish_date', document.querySelector('[name="publish_date"]').value);
        form.append('publisher', document.querySelector('[name="publisher"]').value);
        form.append('numOfPages', document.querySelector('[name="numOfPages"]').value);

        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState==4 && this.status==200) {
                console.log(xhttp.responseText);
                var res = xhttp.response;
                user.exitAuthAndMsg("Book created!");
                user.hideSpinner();
            }
        };
        xhttp.open("POST", this.apiServer + "/book", true);
        xhttp.setRequestHeader("Authorization", "Bearer: " + user.getToken());
       // xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
       // xhttp.send(JSON.stringify(book));
       xhttp.send(form);
    },
    allBooksTemplate: `
        <div class="bookForm">
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
        </div>`.trim(),
    showAllBooksTemplate: function() {
        document.getElementById(this.containerId).innerHTML = this.allBooksTemplate;
        document.getElementById('backBtn').onclick = this.showBookPage.bind(this);
        this.getBooks();
    },
    getBooks: function() {
        var url = this.apiServer + "/books";
        console.log(url);
        fetch(url, {
            method: 'GET'
        })
        .then(function(response) {
              if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status);
                return;
              }
            // Examine the text in the response
            response.json().then(function(data) {
            console.log(data);
            var bookList = data.length;
                for (i=0; i < bookList; i++) {
                    document.getElementById('bookList').innerHTML += "<td>" + data[i].isbn + "</td>" + "<td>" + data[i].title + "</td>" + "<td>" + data[i].author + "</td>";
                }
            });
        })
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
    },
    bookFoundTemplate: `
        <div class="bookForm" id="bookFound">
            <div class="error" id="error"></div>
            <div class="spinner" id="spinner"></div>
            <div id="bookFoundPg" class="findBookPage">
                <button id="backBtn">BACK</button><br>
                <h3>Book found!</h3>
                <div id="isbn-field">
                    ISBN: <p id="isbn"></p>
                </div>
                <div id="book-info">
                    TITLE: <p id="title" class="book-info"></p>
                    AUTHOR: <p id="author" class="book-info"></p>
                    PUBLISH DATE: <p id="publish_date" class="book-info"></p>
                    PUBLISHER: <p id="publisher" class="book-info"></p>
                    NUMBER OF PAGES: <p id="numOfPages" class="book-info"></p>
                    <img id="bookImg" class="book-info">
                </div>
                <div class="deleteBook">
                    <button id="deleteBook" class="button">Delete Book</button>
                </div>
                <div class="editBookBtn">
                    <button id="editBookBtn" class="button">Edit Book</button>
                </div>
            </div>

            <div id="editBookPg" class="editBookPage bookForm">
                <div>
                    <label for="isbn">ISBN</label>
                    <input type="text" id="isbn" name="isbn">
                </div>
                <div>
                    <label for="title">Title</label>
                    <input placeholder="Book title" name="title" id="titleField">
                </div>
                <div>
                    <label for="author">Author</label>
                    <input placeholder="Book author" name="author" id="authorField">
                </div>
                <div>
                    <label for="publish_date">Published Date</label>
                    <input type="date" name="publish_date" id="dateField">
                </div>
                <div>
                    <label for="publisher">Publisher</label>
                    <input placeholder="Book publisher" name="publisher" id="publisherField">
                </div>
                <div>
                    <label for="numOfPages">Number Of Pages</label>
                    <input type="number" placeholder="Number of pages" name="numOfPages"  id="pgsField">
                </div>
                <div>
                    <input type='file' name="book_img" id="imgInput">
                    <img id="bookImg" class="book-info" name="img">
                </div>
                <button class="button" id="saveEdit">Save Edit</button>
                <button class="cancelEdit" id="cancelEdit">Cancel</button>
            </div>
        </div>`.trim(),
    showBookFound: function() {
        user.hideError();
        document.getElementById(this.containerId).innerHTML = this.bookFoundTemplate;
        document.getElementById('backBtn').onclick = this.showBookPage.bind(this);
        document.getElementById('deleteBook').onclick = this.deletePrompt.bind(this);
        document.getElementById('editBookBtn').onclick = this.showEditBook.bind(this);
    },
    findBook: function() {
        user.showSpinner();
        var isbn = document.querySelector('[name="isbn-get"]').value;
        if (isbn.length < 1) {
            user.hideSpinner();
            user.showError("ISBN field can't be empty!");
            return;
        }
        console.log(isbn);
        var url = this.apiServer + "/book/" + isbn;

        fetch(url, {
            method: 'GET', 
            headers: new Headers({ 
                "Content-Type": "application/json;charset=UTF-8" 
            })
        }).then(function(response) {
            if (response.status !== 200) {
                switch(response.status) {
                    case 403:
                        user.showError("Book not found");
                        console.log("Book not found!");
                        user.hideSpinner();
                        break;
                    default: 
                    console.log('unknown error');
                        user.showError("Unknown Error Occured. Server response not received. Try again later.");
                }
                return;
            }
            response.json().then(function (data) {
                console.log(data); 
                var imgPath = book.apiServer + "/";
                user.hideSpinner();
                book.showBookFound();
                console.log(data.book_img);
                console.log(imgPath + data.book_img);
                var src = imgPath + data.book_img;
                document.getElementById('bookImg').src = src;
                document.getElementById('isbn').innerHTML = data.isbn;
                document.getElementById('title').innerHTML = data.title;
                document.getElementById('author').innerHTML = data.author;
                document.getElementById('publish_date').innerHTML = data.publish_date.substring(0,10);
                document.getElementById('publisher').innerHTML = data.publisher;
                document.getElementById('numOfPages').innerHTML = data.numOfPages;
            })
        }).catch(function(err) {
                console.log('Fetch Error :-S', err);
            });
    },
    deletePrompt: function() {
        var isbn = document.getElementById('isbn').innerHTML;
        console.log(isbn);
        var result = confirm("Are you sure you want to delete the book with isbn: " + isbn + "?");
        if (result) {
            user.showSpinner();
            this.deleteBook();
        }
    },
    deleteBook: function() {
        console.log(user.isLoggedIn());

        if (!user.isLoggedIn()) {
            document.getElementById('bookFoundPg').style.display = "none";
            user.hideSpinner();
            user.showLogin();
            user.showError('You must be logged in');
            return;
        }

        user.showSpinner();
        var isbn = document.getElementById('isbn').innerHTML;
        console.log(isbn);
        var url = this.apiServer + "/book/" + isbn;

        fetch(url, {
            method: 'DELETE', 
            headers: new Headers({ 
            'Content-Type': 'application/json',
            "Authorization": "Bearer: " + user.getToken() })
        }).then(function(response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status);
                return;
            }
            response.json().then(function (data) {
                console.log(data); 
                user.hideSpinner();
                user.exitAuthAndMsg("Book deleted");
            })
        })
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
    },
    showEditBook: function() {
        document.getElementById('bookFoundPg').style.display = "none";
        document.getElementById('editBookPg').style.display = "block";
        document.getElementById('cancelEdit').onclick = this.backToFound.bind(this);
        document.getElementById('saveEdit').onclick = this.saveEditBook.bind(this);

        var isbnGet = document.getElementById("isbn");
        console.log(isbnGet.innerText);

        var url = this.apiServer + "/book/" + isbnGet.innerText;

        fetch(url, {
            method: 'GET', 
            headers: new Headers({
                "Content-Type": "application/json;charset=UTF-8"
            })
         }).then(function(response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status);
                return;
            }
            response.json().then(function (data) {
                console.log(data);
                var imgPath = book.apiServer + "/";

                var img = document.querySelector('[name="book_img"]');
                var src = imgPath + data.book_img;
                console.log(src);
                img.src = src;
                img.name = data.book_img;
                console.log(img.name, img.size, img.type);
               
                document.querySelector('[name="isbn"]').value = data.isbn;
                document.querySelector('[name="title"]').value = data.title;
                document.querySelector('[name="author"]').value = data.author;
                console.log(data.publish_date.substring(0,10));
                document.querySelector('[name="publish_date"]').value = data.publish_date.substring(0,10);
                document.querySelector('[name="publisher"]').value = data.publisher;
                document.querySelector('[name="numOfPages"]').value = data.numOfPages;
            }) .catch(function(err) {
                console.log('Fetch Error :-S', err);
            });
        })     
    },
    backToFound: function() {
        document.getElementById('editBookPg').style.display = "none";
        document.getElementById('bookFoundPg').style.display = "block";
    },
    saveEditBook: function() {
        if (!user.isLoggedIn()) {
           // document.getElementById('editBookPg').style.display = "none";
           // document.getElementById('isbn-field').style.display = "none";
            user.showLogin();
            user.showError('You must be logged in');
            return;
        }
        user.showSpinner();

        var imgPath = book.apiServer + "/";
        var form = new FormData();
        var img = document.querySelector('[name="book_img"]');
        console.log(img);
        console.log(img.src);
        console.log(img.files);

        form.append('book_img', img);

        if (img.files.length > 0 ) {
            // add img to FormData
            console.log("adding image");
            form.append('book_img', img.files[0]);
        }
        console.log(img.files[0].name, img.files[0].size, img.files[0].type);
        console.log(imgPath + img.files[0].name);
        form.append('isbn', document.querySelector('[name="isbn"]').value);
        form.append('title', document.querySelector('[name="title"]').value);
        form.append('author', document.querySelector('[name="author"]').value);
        form.append('publish_date', document.querySelector('[name="publish_date"]').value);
        form.append('publisher', document.querySelector('[name="publisher"]').value);
        form.append('numOfPages', document.querySelector('[name="numOfPages"]').value);

        const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4) {
                    switch (xhttp.status) {
                        case 200:
                            console.log(xhttp.response);
                            user.hideSpinner();
                            user.exitAuthAndMsg('Book edited');
                            break;
                        case 403:
                            console.log("please login to continue");
                            book.backToFound();
                            user.showLogin();
                            user.hideSpinner();
                            break;
                        default:
                        console.log('unknown error');
                        user.showError("Unknown Error Occured. Server response not received. Try again later.");
                        }
                    }
            };
            xhttp.open("PUT", this.apiServer + "/book/" + document.getElementById('isbn').innerText, true);
            xhttp.setRequestHeader("Authorization", "Bearer: " + user.getToken());
            //xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
           // xhttp.send(JSON.stringify(book));
           xhttp.send(form);
        }
    };