import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import transition from 'styled-transition-group';
import { TransitionGroup } from 'react-transition-group';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus';
import faFilter from '@fortawesome/fontawesome-free-solid/faFilter';
import faSortAlphaDown from '@fortawesome/fontawesome-free-solid/faSortAlphaDown';
import faSortAlphaUp from '@fortawesome/fontawesome-free-solid/faSortAlphaUp';
import faSortNumericDown from '@fortawesome/fontawesome-free-solid/faSortNumericDown';
import faSortNumericUp from '@fortawesome/fontawesome-free-solid/faSortNumericUp';

class BookList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterIsVisible: false,
      filterValue: '',
      sortBy: 'date',
      sortDirection: 'desc'
    }
    this.sortBooks = this.sortBooks.bind(this);
    this.toggleDateSort = this.toggleDateSort.bind(this);
    this.toggleTitleSort = this.toggleTitleSort.bind(this);
  }

  componentDidMount() {
    if (!!this.props.sortBy) {
      this.setState({
        sortBy: this.props.sortBy == 'title' ? 'title' : 'date'
      });
    }
  }

  toggleFilterState() {
    if (this.state.filterIsVisible) {
      this.setState
    }
  }

  toggleDateSort() {
    let newDirection = this.state.sortDirection;
    if (this.state.sortBy == 'date') {
      if (this.state.sortDirection == 'asc') {
        newDirection = 'desc';
      } else {
        newDirection = 'asc'
      }
    }
    this.setState({
      sortBy: 'date',
      sortDirection: newDirection,
    });
  }

  toggleTitleSort() {
    let newDirection = this.state.sortDirection;
    if (this.state.sortBy == 'title') {
      if (this.state.sortDirection == 'asc') {
        newDirection = 'desc';
      } else {
        newDirection = 'asc'
      }
    }
    this.setState({
      sortBy: 'title',
      sortDirection: newDirection,
    });
  }

  sortBooks(a,b) {
    let criteria = this.state.sortBy == 'date' ? 'createdAt' : 'title';
    if (a[criteria] < b[criteria]) {
      return this.state.sortDirection == 'asc' ? 1 : -1
    } else if (a[criteria] > b[criteria]) {
      return this.state.sortDirection == 'asc' ? -1 : 1
    } else {
      return 0
    }
  }

  render() {
    if (!this.props.loading && this.props.books.length == 0) {
      return <BlankCard disabled to={`/books`}>
               <Item>No Books</Item>
             </BlankCard>
    }
    let sortedBooks = this.props.books.sort(this.sortBooks);

    let filteredBooks = sortedBooks.filter((book) => {
      if (this.state.filterIsVisible) {
        return book.title.toLowerCase().includes(this.state.filterValue.toLowerCase()) || 
              book.authors[0].toLowerCase().includes(this.state.filterValue.toLowerCase())
      } else {
        return true
      }
    });
    return (
      <OuterContainer>
        <Container>
          <FilterButton selected={this.state.sortBy == 'date'}
              onClick={()=> { this.toggleDateSort() }}>
            {`Date Added `}
            { this.state.sortDirection == 'desc' &&
              <FontAwesomeIcon icon={faSortNumericDown} /> 
            }
            { this.state.sortDirection == 'asc' &&
              <FontAwesomeIcon icon={faSortNumericUp} /> 
            }
          </FilterButton>
          <FilterButton selected={this.state.sortBy == 'title'}
              onClick={()=> { this.toggleTitleSort() }}>
            {`Title `}
            { this.state.sortDirection == 'desc' &&
              <FontAwesomeIcon icon={faSortAlphaDown} /> 
            }
            { this.state.sortDirection == 'asc' &&
              <FontAwesomeIcon icon={faSortAlphaUp} /> 
            }
          </FilterButton>
          <FilterButton selected={this.state.filterIsVisible}
              onClick={()=> { this.setState({ filterIsVisible: !this.state.filterIsVisible})}}>
            <FontAwesomeIcon icon={faFilter} /> Filter
          </FilterButton>
            {this.state.filterIsVisible &&
              <FilterInput autoFocus 
                          value={this.state.filterValue} 
                          onChange={(e) => this.setState({ filterValue: e.target.value })}
                          type="search" />
            }
        </Container>
        <Container>
          <TransitionGroup component={null}>
            { filteredBooks.map((book) => {
              return (
                <CardWrapper key={book.bookId}>
                  <Card to={`/books/${book.bookId}`}>
                    { book.imageUrl &&
                    <Image src={book.imageUrl} />
                    }
                    <Title>{book.title}</Title>
                    { !book.imageUrl &&
                      <Author>{book.authors[0]}</Author>
                    }
                  </Card>
                  { !!this.props.removeBook &&
                    <DeleteButton onClick={() => this.props.removeBook(book)}>
                      ×
                    </DeleteButton>
                  }
                </CardWrapper>
              )
            })}
          </TransitionGroup>
          { this.props.showAddBook && 
              <BlankCard to={`/search`}>
                <Item large><FontAwesomeIcon icon={faPlus} /></Item>
                <Item>Add a book</Item>
              </BlankCard>
            }
        </Container>
      </OuterContainer>
    );
  }
}

export default BookList;

const OuterContainer = styled.div`
  disply: flex;
  flex-direction: column;
`;


const Container = styled.div`
  display: flex;
  width: 1225px;
  flex: 1 1 1225px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  flex-wrap: wrap;

  @media (max-width: 1250px) {
    width: 980px;
  }

  @media (max-width: 990px) {
    width: 740px;
  }

  @media (max-width: 750px) {
    width: 500px;
  }

   @media (max-width: 500px) {
    width: 100%;
  }
`;

const CardWrapper = transition.div.attrs({
  unmountOnExit: true,
  timeout: 500
})`
  opacity: 1;
  position: relative;
  transition: 0.3s;
  background: white;
  border: 1px solid lightgray;
  border-radius: 3px;
  width: 225px;
  background: white;
  margin: 10px;
  box-sizing: border-box;
  transition: opacity 0.3s ease;

  &:hover {
    box-shadow: 0px 2px 10px rgba(0,0,0,0.1);
  }

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

  @media (max-width: 500px) {
    width: 100%;
  }
`;

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  text-decoration: none;
  color: #333;
  padding: 20px;
`;

const BlankCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  text-decoration: none;
  color: #333;
  width: 225px;
  min-height: 300px;
  padding: 20px;
  border: 1px solid lightgray;
  background-color: #e3e3e3;
  color: darkgray;
  margin: 10px;
  transition: 0.3s;

  &:hover {
    background-color: #fff;
    color: #333;
  }

  @media (max-width: 500px) {
    width: 100%;
  }
`;

const Image = styled.img`
  padding-bottom: 20px;
  @media (max-width: 500px) {
    width: 40vw;
  }
`;

const Title = styled.h2 `
  font-size: 1rem;
  text-align: center;
`;

const Author = styled.p `
  font-size: 1rem;
`;

const Item = styled.p`
  margin: 0;
  padding: 5px 0 10px;
  font-size: ${props => 
   (props.large && '2rem') || '1rem' 
  };
`;

const DeleteButton = styled.button`
  background: gray;
  width: 30px;
  height: 30px;
  border: 1px solid lightgray;
  border-radius: 20px;
  margin: 0;
  padding: 0 0 4px;
  line-height: 0;
  box-sizing: border-box;
  position: absolute;
  color: white;
  top: -10px;
  right: -10px;
  font-size: 1.5rem;
  opacity: 0;
  transition: 0.3s;
  cursor: pointer;

  ${CardWrapper}:hover & {
      opacity: 1;
  }

  &:hover {
    background: tomato;
  }
`;

const FilterButton = styled.button`
  background: ${props =>
    (props.selected && '#333') || '#eee'
  };
  padding: 5px;
  margin: 5px 10px 5px 0;
  cursor: pointer;
  color: ${props =>
    (props.selected && '#eee') || '#333'
  };
  border: 1px solid #333;
  border-radius: 3px;

  &:focus {
    outline: none;
  }

  &:hover {
    cursor: pointer;
    background: ${props =>
      (props.selected && '#444') ||
      'lightgray'
    };
  }

  &:first-of-type {
    margin-left: 10px;
  }

  &:last-of-type {
    margin-right: 0;
  }
`;

const FilterInput = styled.input`
  border: 1px solid lightgray;
  padding: 5px;
  border-radius: 3px;
  margin: 5px 10px;
`;