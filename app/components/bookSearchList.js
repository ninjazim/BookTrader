import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus'
import faCheckCircle from '@fortawesome/fontawesome-free-solid/faCheckCircle'

class bookSearchList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    let { searchResults } = this.props;

    if (searchResults.noResults && searchResults.showResults) {
      return (
        <Container>
          <CardWrapper disabled key='no-results'>
            <Card disabled to='#'>
              <NoResults>
                <p>No Results Found. Try searching for something else.</p>
              </NoResults>
            </Card>
          </CardWrapper>
        </Container>
      )
    }

    return (
      <Container>
        { this.props.books.map((book,i) => {
          return (
            <CardWrapper key={book.id}>
              <Card to={`/books/${book.id}`}>
                <ImageContainer>
                  { book.volumeInfo.imageLinks &&
                  <Image src={`http://books.google.com/books/content?id=${book.id}&printsec=frontcover&img=1&zoom=1&source=gbs_api`} />
                  }
                  { !book.volumeInfo.imageLinks &&
                  <NoImage />
                  }
                </ImageContainer>
                <TextContainer>
                  <Title>{book.volumeInfo.title}</Title>
                  { !!book.volumeInfo.authors &&
                    <Author>{book.volumeInfo.authors[0]}</Author>
                  }
                </TextContainer>
              </Card>
              {/* { this.props.userBooks.filter(b => {
                return
              })} */}
              { !book.userOwns && !!this.props.user.username &&
                <AddButton onClick={(e) => this.props.addBook(book) }>
                  <FontAwesomeIcon icon={faPlus} />
                </AddButton>
              }
              { book.userOwns && !!this.props.user.username &&
                <AddButton disabled>
                  <FontAwesomeIcon icon={faCheckCircle} />
                </AddButton>
              }
            </CardWrapper>
          )
        })}
        {/* {this.props.books.length > 0 &&
          <CardWrapper key='show-more'>
            <Card to={`/search?term=${searchResults.term}`}>
              <NoResults>
                <p>See more results for "{searchResults.previousSearch}"</p>
              </NoResults>
            </Card>
          </CardWrapper>
        } */}
      </Container>
    );
  }
}

export default bookSearchList;


const Container = styled.div`
  display: flex;
  max-width: 1225px;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
  flex-wrap: wrap;
  transition: 0.3s;

  @media (max-width: 1059px) {
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    max-width: 800px;
  }

  @media (max-width: 550px) {
    width: 100%;
  }
`;

const CardWrapper = styled.div`
  position: relative;
  transition: 0.3s;
  border: 1px solid lightgray;
  padding: 10px 20px;
  margin: 5px;
  min-width: 500px;
  width: 100%;
  flex: 1;
  background: ${props =>
    (props.disabled == true && '#ddd') || 'white'
  };
  box-sizing: border-box;

  &:hover {
    cursor: pointer;
    background: #fafafa;
  }

  ${'' /* &:last-of-type {
    background: #ddd;

    &:hover {
      cursor: inherit;
      background: #ddd;
    }
  } */}

  @media (max-width: 1059px) {
    width: 500px;
  }

  @media (max-width: 550px) {
    width: 100%;
    flex: 1;
    min-width: 300px;
  }
`;

const Card = styled(Link)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  transition: 0.2s;
  text-decoration: none;
  color: #333;
`;

const Image = styled.img`
  max-height: 100px;
  max-width: 100px;
`;

const NoImage = styled.div`
  height: 100px;
  width: 76px;
  background-color: lightgray;
`;

const ImageContainer = styled.div`
  width: 110px;
  height: 110px;
  flex: 0 0 110px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const TextContainer = styled.div`
  flex: 1;
  text-align: left;
`;

const NoResults = styled.div`
  flex: 1;
  text-align: center;
`;

const Title = styled.h2 `
  font-size: 1rem;
  margin: 5px 0;
`;
const Author = styled.p `
  font-size: 1rem;
  margin: 5px 0;
`;

const AddButton = styled.button`
  background: mediumseagreen;
  width: 60px;
  height: 100%;
  margin: 0;
  padding: 0 0 4px;
  line-height: 0;
  border: none;
  box-sizing: border-box;
  position: absolute;
  color: white;
  top: 0;
  right: 0;
  font-size: 1.25rem;
  opacity: 0;
  transition: 0.3s;
  cursor: pointer;

  &:disabled {
    background: dodgerblue;
    cursor: default;
  }

  ${CardWrapper}:hover & {
      opacity: 1;
  }
`;
