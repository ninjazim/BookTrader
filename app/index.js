import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';

import axios from 'axios';

import Header from './components/Header';
import Footer from './components/Footer';
import Books from './pages/Books';
import Search from './pages/Search';
import ViewBook from './pages/ViewBook';
import Profile from './pages/Profile';
import User from './pages/User';
import Users from './pages/Users';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      user: {},
      users: [],
      isLoadingUsers: true,
      isLoadingBooks: true,
      isLoggedIn: false,
      isLoading: true,
      books: [],
      requests: [],
      searchResults: {
        term: '',
        previousSearch: '',
        previousBooks: [],
        books: [],
        showResults: false,
        isSearching: false,
        noResults: false,
      }
    }

    this.signOut = this.signOut.bind(this);
    this.addBook = this.addBook.bind(this);
    this.removeBook = this.removeBook.bind(this);
    this.requestBook = this.requestBook.bind(this);
    this.updateRequest = this.updateRequest.bind(this);
    this.bookSearch = this.bookSearch.bind(this);
    this.updateSearchTerm = this.updateSearchTerm.bind(this);
    this.toggleSearchResults = this.toggleSearchResults.bind(this);
    this.getUsers = this.getUsers.bind(this);

  }

  componentDidMount() {
    axios.get(`/api/user`)
      .then(response => {
        let user = response.data;
        let isLoggedIn = Object.keys(user).length > 0 ? true : false;
        this.setState({
          user,
          isLoggedIn,
          isLoading: false,
        });
        this.getAllBooks();
        this.getUsers();
        this.getRequests();
      });
  }

  signOut() {
    axios.get(`/logout`)
      .then(response => {
        let user = response.data;
        this.setState({
          isLoggedIn: false,
          user,
          requests: [],
        });
      });
  }

  getAllBooks() {
    axios.get(`/api/books`)
         .then(response => {
           let books = response.data;
           this.setState({
             books,
             isLoadingBooks: false,
           });
         })
         .catch(error => {
           console.log(error);
         });
  }

  getRequests() {
    axios.get(`/api/requests`)
         .then(response => {
           if (Array.isArray(response.data)) {
             this.setState({
               requests: response.data,
             });
           }
         }).catch(error => {
           console.log(error);
         });
  }

  getUsers() {
    axios.get(`/api/users`)
        .then(response => {
        this.setState({
          users: response.data,
          isLoadingUsers: false,
        });
      }).catch(error => {
        console.log(error);
      });
  }

  addBook(book) {
    let ISBN = { short: null, long: null };
    if (!!book.volumeInfo.industryIdentifiers) {
      book.volumeInfo.industryIdentifiers.forEach((item) => {
        if (item.type == "ISBN_13") {
          ISBN.long = item.identifier;
        } else if (item.type == "ISBN_10") {
          ISBN.short = item.identifier;
        }
      });
    }
    let imageUrl = book.volumeInfo.imageLinks ? `http://books.google.com/books/content?id=${book.id}&printsec=frontcover&img=1&source=gbs_api&zoom=1` : null;
    let bookData = {
      bookId: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors,
      imageUrl,
      ISBN: {
        short: ISBN.short,
        long: ISBN.long
      },
    };
    axios.post('/api/books', bookData)
         .then(response => {
           if (response.data.existing) {
             console.log("You've already added that one.");
           } else {
             let newBook = response.data;
             let user = this.state.user;
             let books = this.state.books;
             if (newBook.owners.length === 1) {
               books.push(newBook);
             } else {
               books = this.state.books.map(b => {
                 if (b.bookId === newBook.bookId) {
                   return newBook
                 } else {
                   return b
                 }
               });
             }
             user.books.push(newBook);
             this.setState({
               user,
               books,
             });
           }
         })
         .catch(err => {
           console.log(err);
         });
  }

  removeBook(book) {
    let body = {
      removeUser: {
        id: this.state.user._id
      }
    }
    axios.post(`/api/books/${book.bookId}`, body)
         .then(response => {
           let filteredBooks;
           if (response.data.deleted) {
             filteredBooks = this.state.books.filter(b => {
               return (b.bookId != book.bookId);
             });
           } else {
             filteredBooks = this.state.books.map(b => {
               if (b.bookId === book.bookId) {
                 let owners = b.owners.filter(o => {
                   return o._id !== body.removeUser.id
                 });
                 b.owners = owners;
                 return b
               } else {
                 return b
               }
             });
           }
           let updatedUser = Object.assign({}, this.state.user);
           updatedUser.books = this.state.user.books.filter(b => {
             return b.bookId != book.bookId;
           });
           this.setState({
             books: filteredBooks,
             user: updatedUser,
           });
         })
         .catch(err => {
           console.log(err);
         })
  }

  requestBook(req) {
    if (!!req.owner && !!req.book) {
      axios.post(`/api/requests`, req)
           .then(response => {
             if (response.data.existing) {
               console.log("you've already made this request");
             } else {
               let requests = this.state.requests.slice();
               requests.push(response.data);
               this.setState({
                 requests
               });
             }
           }).catch(err => {
             console.log(err);
           });
      }
    }

  updateRequest(req) {
    if (!!req.owner && !!req.book) {
      axios.post(`/api/requests/${req._id}`, req)
           .then(response => {
             if (response.data.existing === false) {
               console.log("couldn't locate the request");
             } else if (response.data.canceled === true) {
               let updatedRequests = this.state.requests.filter(r => {
                  return r._id !== req._id
               });
               this.setState({
                 requests: updatedRequests
               });
             } else {
               let updatedRequests = this.state.requests.map(r => {
                 if (r._id === req.id) {
                   return response.data.request
                 } else {
                   return r
                 }
               });
               this.setState({
                 requests: updatedRequests
               });
             }
           }).catch(err => {
             console.log(err);
           });
    }
  }

  updateSearchTerm(value) {
    let showResults = (this.state.searchResults.showResults && value !== '');
    this.setState({
      searchResults: {
        ...this.state.searchResults,
        term: value,
        showResults: showResults,
      }
    })
  }

  toggleSearchResults(toggle) {
    setTimeout(() => {
      this.setState({
        searchResults: {
          ...this.state.searchResults,
          showResults: toggle
        }
      })
    }, 100);
  }

  bookSearch() {
    let searchResults = this.state.searchResults;
    this.setState({
      searchResults: {
        ...searchResults,
        isSearching: true,
      }
    });
    if (searchResults.term.length > 0) {
      if (searchResults.term == searchResults.previousSearch) {
        setTimeout(() => {
          this.setState({
            searchResults: {
              ...searchResults,
              isSearching: false,
              showResults: true,
            }
          });
        }, 500);
      } else {
        axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchResults.term}&projection=lite`)
                .then(response => {
                  console.log(`${response.data.totalItems} results found for ${searchResults.term}`);
                  if (response.data.totalItems > 0) {
                    this.setState({
                      searchResults: {
                        ...searchResults,
                        books: response.data.items,
                        previousSearch: searchResults.term,
                        showResults: true,
                        isSearching: false,
                        noResults: false,
                      }
                    });
                  } else {
                    this.setState({
                      searchResults: {
                        ...searchResults,
                        books: [],
                        showResults: true,
                        previousSearch: searchResults.term,
                        isSearching: false,
                        noResults: true,
                      }
                    });
                  }
                })
                .catch(error => {
                  console.log(error);
                });
      }
    }
  }

  render () {
    if (this.state.isLoading) {
      return <div></div>
    }
    let { user, isLoggedIn, isLoading, books, requests, searchResults, users, isLoadingUsers, isLoadingBooks } = this.state;
    return (
      <BrowserRouter onUpdate={() => window.scrollTo(0, 0)}>
        <div>
          <Header user={user}
                  isLoggedIn={isLoggedIn}
                  isLoading={isLoading}
                  signOut={this.signOut}
                  />
          <Route exact path="/" render={() => (
            <Redirect to='/books/' />
          )} />
          <Switch>
            <Route path='/users/:username' render={(props) => <User loggedInUser={ user } {...props} /> } />
            <Route path='/users'
                    render={() =>
                      <Users users={ users }
                             isLoading={ isLoadingUsers }
                             getUsers={ this.getUsers } />
                    } />
          </Switch>
          <Route path='/profile'
                 render={() =>
                    <Profile user={ user }
                             requests={ requests }
                             isLoggedIn={ isLoggedIn }
                             addBook={ this.addBook }
                             removeBook={ this.removeBook }
                             updateRequest={ this.updateRequest }
                             bookSearch={ this.bookSearch }
                             searchResults={ searchResults } 
                             signOut={this.signOut} />
                 } />
          <Switch>
            <Route path='/books/:id'
                   render={(props) =>
                     <ViewBook user={ user }
                               addBook={ this.addBook }
                               requestBook={ this.requestBook }
                               isLoggedIn={ isLoggedIn}
                               books={ books }
                               requests={ requests }
                               {...props} />
                   } />
            <Route path='/books'
                   render={() =>
                     <Books user={ user }
                            books={ books }
                            isLoading={ isLoadingBooks }
                            addBook={ this.addBook }
                            bookSearch={ this.bookSearch }
                            updateSearchTerm={ this.updateSearchTerm }
                            toggleSearchResults={ this.toggleSearchResults }
                            searchResults={ searchResults } />
                   } />
          </Switch>
          <Route path='/search'
                   render={() =>
                     <Search user={ user }
                             bookSearch={ this.bookSearch }
                             addBook={ this.addBook }
                             updateSearchTerm={ this.updateSearchTerm }
                             toggleSearchResults={ this.toggleSearchResults }
                             searchResults={ searchResults } />
                   } />
          <Footer isLoading={isLoading} />
        </div>
      </BrowserRouter>
    );
  }
}

render(<App/>, document.getElementById('app'));
