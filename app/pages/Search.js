import React from 'react';
import styled from 'styled-components';
import transition from 'styled-transition-group'

import BookSearchList from '../components/bookSearchList';
import AddBook from '../components/addBook';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    }
  }

  componentDidMount() {
    window.scrollTo(0,0);
    this.setState({
      loading: false,
    });
    document.title = `BookTrader - Search`;
  }

  render() {
    let { searchResults, user } = this.props;

    let processedResults = searchResults.books.map(book => {
      let found = false;
      if (!!user.books) {
        found = user.books.some(b => {
          return book.id == b.bookId;
        });
      }
      book.userOwns = found;
      return book
    });

    return (
      <Container>
        <FadeIn in={!this.state.loading} showResults={searchResults.showResults}>
          <AddBook {...this.props} />
        </FadeIn>
        <FadeLeft in={this.props.searchResults.showResults} showResults={searchResults.showResults}>
          <InnerContainer>
              <BookSearchList books={ processedResults }
                              addBook={this.props.addBook} 
                              loading={ this.state.loading }
                              searchResults={ searchResults }
                              user={ this.props.user } />
          </InnerContainer>
        </FadeLeft>
      </Container>
    );
  }
}

export default Search;


const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  max-width: 100%;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: stretch;
  height: auto;
  max-width: 1225px;
  flex: 1;
  margin: 40px 20px;
  box-sizing: border-box;

  & h1 {
    padding-left: 10px;
  }

  & > div {
    padding-bottom: 20px;
  }
`;

const FadeIn = transition.div.attrs({
  unmountOnExit: false,
  timeout: 500
})`
  opacity: 1;
  width: 100%;
  transition: opacity 0.3s ease-in 0.2s, min-height 1s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient( 150deg, rgba(60, 179, 113, 0.5), rgba(60, 179, 113, 0.7)) center center / cover no-repeat, 
    url("https://www.toptal.com/designers/subtlepatterns/patterns/congruent_pentagon.png");
  min-height: ${props =>
    (props.showResults == false && 'calc(100vh - 90px)') || '200px'
  };

  &:enter {
    opacity: 0;
  }
  &:enter-active {
    opacity: 1;
  }
  &:exit {
    opacity: 1;
  }
  &:exit-active {
    opacity: 0;
  }
`;

const FadeLeft = transition.div.attrs({
  unmountOnExit: true,
  timeout: 500
})`
  opacity: 1;
  margin-top: 0;
  transition: opacity 0.5s ease, margin 0.5s ease, height 1s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: ${props =>
    (props.showResults == true && 'calc(100vh - 90px)') || '0'
  };

  &:enter {
    opacity: 0;
    margin-top: 100px;
    transition: opacity 0.5s ease, margin 0.5s ease;
  }
  &:enter-active {
    opacity: 1;
    margin-top: 0px;
  }
  &:exit {
    opacity: 1;
    transition: opacity 0.5s ease, margin 0.5s ease;
  }
  &:exit-active {
    opacity: 0;
    margin-top: 100px;
  }
`;
