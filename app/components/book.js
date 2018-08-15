import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import sanitizeHtml from 'sanitize-html';
import transition from "styled-transition-group";

class Book extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageLoaded: false,
      bookOwner: '',
      loaded: false,
    }
  }

  componentDidMount() {
    this.setState({
      loaded: true,
    });
  }

  handleBookRequest() {
    if (this.state.bookOwner !== '') {
      let data = {
        book: this.props.book.id,
        owner: this.state.bookOwner
      }
      console.log(`requesting ${data.book} from ${data.owner}`);
      this.props.requestBook(data);
    }
  }

  render() {
    let { book, books, isLoggedIn, user, requests } = this.props;
    let userIsOwner = false;
    let owners = [];
    let request = null;
    let filteredBook = books.filter(b => {
      return b.bookId == this.props.match.params.id;
    });
    if (filteredBook.length > 0) {
      owners = filteredBook[0].owners;
    }
    if (isLoggedIn && owners && owners.length > 0) {
      let filteredOwners = owners.filter(owner => {
        return owner.username == user.username;
      });
      if (filteredOwners.length > 0) {
        userIsOwner = true;
      }
    }
    let requested = requests.filter(r => {
      return (r.book === book.id)
    });
    if (requested.length > 0) {
      request = requested[0];
    }

    return (
      <Container in={ !this.state.loading }>
        <BookCover>
          <Image 
                 src={`http://books.google.com/books/content?id=${book.id}&printsec=frontcover&img=1&source=gbs_api&zoom=3`}
                 onLoad={() => this.setState({ imageLoaded: true })}
                 loading={ !this.state.imageLoaded } />
          <Details>
            <Title>
              {book.volumeInfo.title || 'Untitled'}
            </Title>
            <Authors>
              {book.volumeInfo.authors.map((author, i) => {
                return <span key={i}>{author}</span>
              })}
            </Authors>
            <Year>
              <em>{book.volumeInfo.publishedDate && book.volumeInfo.publishedDate.split('-')[0]}</em>
            </Year>
          </Details>
          <BookActions>
            { !!owners && owners.length > 0 &&
              <Collection>
                <p>Owned by:</p>
                <OwnerWrapper>
                  { owners.map((owner) => {
                    if (owner.username == user.username) {
                      return <OwnerLink to={`/profile`} key={owner.username}>You</OwnerLink>
                    } else {
                      return <OwnerLink to={`/users/${owner.username}`} key={owner.username}>{owner.username}</OwnerLink>
                    }
                  })}
                </OwnerWrapper>
              </Collection>
            }
            { isLoggedIn && !userIsOwner &&
              <Collection>
                <p>Do you own this book?</p>
                <Button green onClick={() => this.props.addBook(book)}>
                  Add to your Library
                </Button>
                { !!owners && owners.length > 0 && !!request &&
                  <InnerContainer>
                      <Line />
                        <p>Request status:</p>
                        <OwnerLink to={`/profile`} caps='true' >
                          {request.status}
                        </OwnerLink>
                  </InnerContainer>
                }
                { !!owners && owners.length > 0 && !request &&
                    <InnerContainer>
                      <Line />
                      <p>Want to borrow this book?</p>
                      <SelectInput defaultValue='' onChange={e => this.setState({ bookOwner: e.target.value })} >>
                        <option key='default' value='' disabled>Choose a User</option>
                        { owners.map(owner => {
                          return <option key={owner.username} value={owner.username}>{owner.username}</option>
                        })}
                      </SelectInput>
                      <Button blue
                              disabled={this.state.bookOwner === ''}
                              onClick={ () => this.handleBookRequest() }>
                              Request book
                      </Button>
                    </InnerContainer>
                }
              </Collection>
            }
            { !isLoggedIn && !!owners && owners.length == 0 &&
              <Collection>
                  <p>Own this book?</p>
                  <ButtonLink href={`/auth/github`}>Sign In with GitHub</ButtonLink>
              </Collection>
            }
            { !isLoggedIn && !!owners && owners.length > 0 &&
              <Collection>
                  <p>Want to borrow this book?</p>
                  <ButtonLink href={`/auth/github`}>Sign In with GitHub</ButtonLink>
              </Collection>
            }
          </BookActions>
        </BookCover>
        
        <BookDetails>
          <Details>
            <Title>
              {book.volumeInfo.title || 'Untitled'}
            </Title>
            <Authors>
              {book.volumeInfo.authors.map((author, i) => {
                return <span key={i}>{author}</span>
              })}
            </Authors>
            <Year>
              <em>{book.volumeInfo.publishedDate && book.volumeInfo.publishedDate.split('-')[0]}</em>
            </Year>
          </Details>
          <Additional>
            <Description>
              <b>From the Publisher:</b>
            </Description>
            <Description dangerouslySetInnerHTML={{ __html: sanitizeHtml(book.volumeInfo.description) }} >
            </Description>
          </Additional>
          
        </BookDetails>
      </Container>
    );
  }
}

export default Book;

const Container = transition.div.attrs({
  unmountOnExit: true,
  timeout: 500
})`
  max-width: 1200px;
  padding: 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  box-sizing: border-box;
  opacity: 1;
  margin-left: 0px;
  transition: opacity 0.5s ease, margin 0.5s ease;

  &:enter {
    opacity: 0;
    margin-left: 100px;
  }
  &:enter-active {
    opacity: 1;
    margin-left: 0px;
  }
  &:exit {
    opacity: 1;
    margin-left: 100px;
  }
  &:exit-active {
    opacity: 0;
    margin-left: 100px;
  }

  @media (max-width: 1225px) {
    max-width: 990px;
  }

  @media (max-width: 990px) {
    max-width: 850px;
    flex-direction: row;
  }

  @media (max-width: 849px) {
    flex-direction: column;
    max-width: 700px;
  }
`;

const ImagePulse = keyframes`
  0%  {
		background-position: 200% 100%;
    }
	25% {
		background-position: 200% 100%;
    }
	50% {
		background-position: 200% 100%;
    }
	75% {
		background-position: 0% 100%;
    }
	100% {
		background-position: 0% 100%;
    }
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
`

const BookCover = styled.div`
  max-width: 350px;
  flex: 1;
  margin: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  @media (max-width: 990px){
    max-width: 300px;
  }

  @media (max-width: 849px) {
    max-width: 100%;
  }
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  ${BookCover} & {
    display: none;
  }

  @media (max-width: 850px) {

    ${BookCover} & {
      display: flex;
      margin: 30px 0 10px;
      align-items: center;
    }

    ${BookDetails} & {
      display: none;
    }
  }
`;

const BookActions = styled.div`
  min-width: 300px;
  width: 100%;
  margin: 20px 0 0 0;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: flex-start;
  background: #e0e0e0;
  border: 1px solid #c0c0c0;

  @media (max-width: 850px) {
    flex: 1;
    flex-direction: row;
  }
`;


const Collection = styled.div`
  width: 100%;
  max-height: 300px;
  padding: 20px;
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  border-bottom: 1px solid #c0c0c0;

  & p {
    margin: 0;
    padding-bottom: 10px;
  }

  &:last-of-type {
    border-bottom: 0;
  }

  @media (min-width: 640px) and (max-width: 850px) {
    border-bottom: 0;
    border-right: 1px solid #c0c0c0;

    &:last-of-type {
      border-right: 0;
    }
  }
`;

const OwnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
  box-sizing: border-box;
  align-items: center;
  justify-content: flex-start;
`

const OwnerLink = styled(Link)`
  min-width: 250px;
  max-width: 100%;
  padding: 10px 0;
  margin: 0px 5px 5px;
  color: #333;
  text-decoration: none;
  border-radius: 5px;
  transition: 0.3s;
  text-align: center;
  text-transform: ${props =>
    (props.caps && 'capitalize') || 'none'
  };

  &:hover {
    background-color: lightgray;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background: ${props =>
    (props.green && 'mediumseagreen') ||
    (props.blue && 'steelblue') ||
    'none'
  };
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  transition: 0.2s;
  min-width: 250px;
  max-width: 100%;
  margin: 10px 0;

  &:hover {
    cursor: pointer;
  }

  &:disabled {
    background: gray;
    cursor: auto;
  }
`;

const ButtonLink = styled.a`
  text-decoration: none;
  padding: 10px 20px;
  background: ${props =>
    (props.green && 'mediumseagreen') ||
    'none'
  };
  color: #333;
  border: 2px solid #333;
  border-radius: 5px;
  font-size: 1rem;
  transition: 0.2s;
  margin: 10px 0;

  &:hover {
    cursor: pointer;
    background: #333;
    color: white;
  }
`;

const Line = styled.hr`
  margin: 20px 0;
  border-width: 1px;
  opacity: 0.5;
  min-width: 250px;
  max-width: 100%;
`;

const BookDetails = styled.div`
  flex: 1;
  padding: 0 0 0 40px;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  @media (max-width: 990px) {
    padding: 0 0 0 20px;
  }

  @media (max-width: 849px) {
    padding: 20px 0 0 0;
    align-items: center;
  }
`

const Additional = styled.div`
  padding: 20px;
  margin: 20px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  background: white;
`

const Image = styled.img`
  width: 100%;
  min-height: ${props =>
    (props.loading == true && '500px') || '0'
  };
  transition: 0.5s;
  background: linear-gradient(90deg, #ddd, #d7d7d7, #ddd);
	background-size: 200% 100%;
	animation: ${props =>
    (props.loading == true && `${ImagePulse} 1.5s infinite`) || 'none'
  };

  @media (max-width: 849px) {
    max-width: 400px;
  }

`;

const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  color: #333;
  line-height: 2.5rem;

  @media (max-width: 850px) {
    text-align: center;
  }
`;

const Authors = styled.p`
  margin: 5px 0;
  font-size: 1.25rem;
  color: #333;
  line-height: 1.75rem;

  & span {
    &::after {
    content: ',';
    }
    &::before {
      content: ' ';
    }
    &:last-of-type {
      &::after {
        content: '';
      }
    }
  }
`;

const Year = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.5rem;
`

const Description = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.5rem;
  overflow: scroll;
`;

const SelectInput = styled.select`
  height: 40px;
  min-width: 250px;
  max-width: 100%;
  box-sizing: border-box;
  font-size: 1.1rem;
  border: 0;
  margin: 5px 0 10px;
  background: white;
  opacity: 0.9;

  &:focus, &:hover {
    opacity: 1;
    outline: none;
  }
`;
