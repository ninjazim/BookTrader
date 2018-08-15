import React from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import transition from "styled-transition-group";
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'

import BookSearchList from './bookSearchList';

class Book extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.searchForTitles = this.searchForTitles.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(e) {
    e.preventDefault();
    this.props.bookSearch();
  }

  searchForTitles() {
    this.setState({
      isSearching: true,
      showResults: false,
    });
    if (this.state.term.length > 0) {
      if (this.state.term == this.state.previousSearch) {
        setTimeout(() => {
          this.setState({
            showResults: true,
            isSearching: false,
          });
        }, 500);
      } else {
        console.log("searching...");
        axios.get(`https://www.googleapis.com/books/v1/volumes?q=${this.state.term}&projection=lite`)
             .then(response => {
               console.log('items found:', response.data.totalItems);
               if (response.data.totalItems > 0) {
                 this.setState({
                    books: response.data.items,
                    showResults: true,
                    previousSearch: this.state.term,
                    isSearching: false,
                    noResults: false,
                 });
               } else {
                this.setState({
                   books: [],
                   showResults: true,
                   previousSearch: this.state.term,
                   isSearching: false,
                   noResults: true,
                });
              }
               
             })
             .catch(error => {
               console.log(error);
             });
       }
    }
  }

  render() {
    let { searchResults, updateSearchTerm } = this.props;

    return (
      <Container >
        <SearchForm onSubmit={(e) => this.handleSearch(e) } 
                    showResults={ searchResults.showResults } > 
          <SearchContainer>
            <SearchBox autoFocus
                       value={ searchResults.term }
                       placeholder={`Search Google Books`}
                       onChange={ e => updateSearchTerm(e.target.value) }>
            </SearchBox>
            { !searchResults.isSearching &&
              <SearchButton type="submit" >
                <FontAwesomeIcon icon={faSearch} />
              </SearchButton>
            }
            { searchResults.isSearching &&
              <Spinner>
                <FontAwesomeIcon icon={faSpinner} />
              </Spinner>
            }

          </SearchContainer>
        </SearchForm>
      </Container>
    );
  }
}

export default Book;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  align-items: center;

`;

const SearchForm = styled.form`
  box-sizing: border-box;
  text-align: center;
  font-size: 0.8rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
`;

const SearchContainer = styled.div`
  position: relative;
  z-index: 20;

  @media (max-width: 550px) {
    width: 100%;
  }
`

const SearchBox = styled.input.attrs({
  type: 'search',
})`
  width: 500px;
  height: 50px;
  border: 0;
  background: white;
  text-align: center;
  font-size: 1.5rem;
  padding: 5px 15px 5px 50px;
  border-radius: 5px;
  opacity: 0.9;
  transition: 0.3s;

  &:focus {
    opacity: 1;
    outline: none;
    &::placeholder {
      opacity: 0.3;
    }
  }

  &:hover {
    opacity: 1;
  }

  &::placeholder {
    opacity: 0.4;
  }

  @media (max-width: 550px) {
    width: 100%;
  }
`;

const SearchButton = styled.button`
  height: 40px;
  width: 40px;
  font-size: 1.25rem;
  border: 0;
  border-radius: 5px 0 0 5px;
  opacity: 0.7;
  transition: 0.3s;
  position: absolute;
  left: 5px;
  top: 5px;
  z-index: 5;
  border-radius: 50px;
  background: none;

  &:focus {
    outline: none;
    opacity: 1;
  }

  &:hover {
    cursor: pointer;
    background: white;
  }

  ${SearchBox}:hover & {
    opacity: 1;
  }
`;

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = SearchButton.extend`
  animation: ${rotate360} 1s linear infinite;
`;
