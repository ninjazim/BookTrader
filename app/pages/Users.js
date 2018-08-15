import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import transition from 'styled-transition-group'

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      fadeIn: false,
      users: [],
    }
  }

  componentDidMount() {
    window.scrollTo(0,0);
    this.setState({ fadeIn: true });
    document.title = `BookTrader - Users`;
    this.props.getUsers();
  }

  render() {

    let sortedUsers = this.props.users.sort((a,b) => {
      if (a.books.length > b.books.length) {
        return -1
      } else if (a.books.length < b.books.length) {
        return 1
      } else {
        return 0
      }
    })

    return (
      <Container>
        <InnerContainer>
          { this.props.isLoading &&
            <FadeIn in={this.props.isLoading && this.state.fadeIn}>
              <EmptyUserContainer>
                <EmptyCard to="#" disabled>
                  <EmptyImage />
                  <EmptyText bigger />
                  <EmptyText />
                </EmptyCard>
                <EmptyCard to="#" disabled>
                  <EmptyImage />
                  <EmptyText bigger />
                  <EmptyText />
                </EmptyCard>
                <EmptyCard to="#" disabled>
                  <EmptyImage />
                  <EmptyText bigger />
                  <EmptyText />
                </EmptyCard>
              </EmptyUserContainer>
            </FadeIn>
          }
          <FadeLeft in={ !this.props.isLoading && this.state.fadeIn }>
            <h1>Users</h1>
            <UserContainer>
              { sortedUsers.map((user) => {
                return (
                  <Card key={user.username} to={`/users/${user.username}`}>
                    <ProfileImage src={user.avatarUrl} />
                    <Title>{user.username}</Title>
                    <BookCount>{`${user.books.length} books`}</BookCount>
                  </Card>
                )
              })}
            </UserContainer>
          </FadeLeft>
        </InnerContainer>
      </Container>
    );
  }
}

export default Users;

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

const TextPulse = keyframes`
  0%  {
		background: #e0e0e0;
    }
	25% {
		background: #e7e7e7;
    }
	50% {
		background: #e3e3e3;
    }
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 90px);
  max-width: 100%;
  min-width: 350px;
`;

const InnerContainer = styled.div`
  flex: 1;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: stretch;
  height: auto;
  margin: 20px 20px;
  box-sizing: border-box;
  min-height: calc(100vh - 90px);

  width: 1225px;
  flex: 0 1 1225px;

  @media (max-width: 1250px) {
    width: 980px;
  }

  @media (max-width: 990px) {
    width: 740px;
  }

  & h1 {
    padding-left: 10px;
  }

  & > div {
    padding-bottom: 20px;
  }
`;

const UserContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  width: 1225px;
  flex: 1 1 1225px;

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

const EmptyUserContainer = UserContainer.extend`
  margin-top: 80px;
`

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  text-decoration: none;
  color: #333;
  width: 223px;
  padding: 10px;
  background: white;
  margin: 10px;
  border: 1px solid lightgray;

  &:hover {
    box-shadow: 0px 2px 10px rgba(0,0,0,0.1);
  }

  @media (max-width: 500px) {
    width: 100%;
  }
`;

const EmptyCard = Card.extend`
  transition: 0.5s;
`;

const EmptyImage = styled.div`
  width: 200px;
  height: 200px;
  background: linear-gradient(90deg, #e7e7e7, #ededed, #e7e7e7);
	background-size: 200% 100%;
  transition: 0.5s;
  margin-bottom: 15px;
  animation: ${ImagePulse} 2s infinite;

  @media (max-width: 500px) {
    width: 100%;
    height: 75vw;
  }
`

const EmptyText = styled.div`
  width: ${props => 
    (props.bigger && '60%') || '40%'
  };
  height: ${props => 
    (props.bigger && '20px') || '10px'
  };
  background: #e0e0e0;
  transition: 0.5s;
  animation: ${TextPulse} 2s 1s infinite;
  margin-bottom: 10px;
`;

const ProfileImage = styled.div`
  width: 200px;
  height: 200px;
  background: ${props =>
    (props.src && `url(${props.src})`) || 'lightgray'
  };
  background-position: center;
  background-size: cover;
  box-sizing: border-box;
  border-radius: 3px;

  @media (max-width: 500px) {
    width: 100%;
    height: 75vw;
  }
`;

const Title = styled.h2 `
  font-size: 1rem;
  text-align: center;
`;

const BookCount = styled.p`
  font-size: 0.75rem;
  text-align: center;
  font-style: italic;
  margin-top: 0;
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

const FadeLeft = transition.div.attrs({
  unmountOnExit: true,
  timeout: 500
})`
  opacity: 1;
  
  margin-left: 0;
  transition: opacity 0.5s ease, margin 0.5s ease;

  &:enter {
    opacity: 0;
    margin-left: 50px;
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
    margin-left: 50px;
  }
`;