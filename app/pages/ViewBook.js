import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import transition from 'styled-transition-group'

import Book from '../components/book';
import EmptyBook from '../components/emptyBook';

class ViewBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeIn: false,
      loading: true,
      book: {},
    }
  }

  getBookfromGoogle() {
    let id = this.props.match.params.id;
    axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`)
      .then(response => {
        this.setState({
          book: response.data,
          loading: false,
          fadeIn: false,
        });
        document.title = `BookTrader - ${response.data.volumeInfo.title}`;
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount() {
    window.scrollTo(0,0);
    this.setState({ fadeIn: true });
    setTimeout(() => {
      this.getBookfromGoogle();
    }, 0);
    
  }

  render() {
    return (
      <Container>
        <FadeIn in={this.state.fadeIn}>
          <EmptyBook />
        </FadeIn>
        <FadeIn in={!this.state.loading}>
          <Book book={ this.state.book } {...this.props} />
        </FadeIn>
      </Container>
    );
  }
}

export default ViewBook;


const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 90px);
  margin: 20px auto;
  width: 100%;
`;

const FadeIn = transition.div.attrs({
  unmountOnExit: true,
  timeout: 500
})`
  opacity: 1;
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
