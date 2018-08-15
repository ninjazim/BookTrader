import React from 'react';
import styled from 'styled-components';
import transition from 'styled-transition-group'

import BookList from '../components/bookList';
import EmptyBookList from '../components/emptyBookList';

class Books extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeIn: false,
    }
  }

  componentDidMount() {
    window.scrollTo(0,0);
    this.setState({
      fadeIn: true,
    });
    document.title = `BookTrader - All Books`;
  }

  render() {
    return (
      <Container>
        { this.props.isLoading &&
          <FadeIn in={this.props.isLoading && this.state.fadeIn }>
            <EmptyBookList />
          </FadeIn>
        }
        <FadeLeft in={!this.props.isLoading && this.state.fadeIn }>
          <InnerContainer>
            <h1>All Books</h1>
              <BookList books={ this.props.books } 
                        isLoading={ this.props.isLoading }
                        showAddBook={ true } />
          </InnerContainer>
        </FadeLeft>
      </Container>
    );
  }
}

export default Books;


const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  height: auto;
  max-width: 100%;
  min-width: 350px;
  min-height: calc(100vh - 90px);
`;

const InnerContainer = styled.div`
  height: auto;
  flex: 0 1 1225px;
  margin: 40px 20px;
  box-sizing: border-box;

  & h1 {
    padding-left: 10px;
  }

  & > div {
    padding-bottom: 20px;
  }

  @media (max-width: 1225px) {
    flex: 0 1 990px;
  }

  @media (max-width: 990px) {
    flex: 0 1 740px;
  }
`;

const FadeIn = transition.div.attrs({
  unmountOnExit: true,
  timeout: 500
})`
  opacity: 1;
  margin-top: 100px;
  transition: opacity 0.5s 0.5s ease, margin 0.5s ease;

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
  margin-left: 0;
  transition: opacity 0.5s ease, margin 0.5s ease;

  &:enter {
    opacity: 0;
    margin-left: 100px;
    transition: opacity 0.5s ease, margin 0.5s ease;
  }
  &:enter-active {
    opacity: 1;
    margin-left: 0px;
  }
  &:exit {
    opacity: 1;
    transition: opacity 0.5s ease, margin 0.5s ease;
  }
  &:exit-active {
    opacity: 0;
    margin-left: 100px;
  }
`;
