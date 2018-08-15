import React from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import transition from "styled-transition-group";

import BookList from '../components/bookList';
import RequestList from '../components/requestList';
import ProfileForm from '../components/profileForm';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: 'books',
      loading: true,
    }
    this.switchModule = this.switchModule.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0,0);
    this.setState({
      loading: false,
    });
    document.title = `BookTrader - My Profile`;
  }

  switchModule(module) {
    this.setState({
      display: null
    });
    setTimeout(() => {
      this.setState({
        display: module
      });
    }, 500);
  }

  render() {
    let incoming = this.props.requests.filter(r => {
      return r.owner === this.props.user.username
    });

    let activeIncoming = incoming.filter(r => {
      return r.status !== 'denied';
    });

    if (this.props.isLoggedIn == false) {
      return <Redirect to='/books/' />
    }
    return (
      <Container>
        <FadeIn in={!this.state.loading}>
        </FadeIn>
        <FadeRight in={!this.state.loading}>
          <InnerContainer>
            <TitleRow>
              <h1>My Profile</h1>
              <SignOut onClick={() => this.props.signOut()}>
                Sign out
              </SignOut>
            </TitleRow>
            <Row>
              <Card>
                <ProfileImage src={this.props.user.avatarUrl} />
              </Card>
              <ProfileForm pageUser={this.props.user}
                           loggedInUser={this.props.user} />
            </Row>
            <NavItems>
              <Button selected={this.state.display === 'books'}
                      onClick={() => this.switchModule('books')}>
                {`Books (${this.props.user.books.length})`}
              </Button>
              <Button selected={this.state.display === 'requests'}
                      onClick={() => this.switchModule('requests')}>
                {`Requests (${activeIncoming.length})`}
              </Button>
            </NavItems>
            <FadeUp in={this.state.display === 'books'}>
              <h2>My Books</h2>
              <BookList books={this.props.user.books} 
                        removeBook={ this.props.removeBook }
                        showAddBook={ true } 
                        sortBy={'title'} />
            </FadeUp>
            <FadeUp in={this.state.display === 'requests'}>
              <RequestList requests={this.props.requests} {...this.props} />
            </FadeUp>
          </InnerContainer>
        </FadeRight>
      </Container>
    );
  }
}

export default Profile;


const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  height: auto;
  max-width: 100%;
  min-width: 350px;
`;

const InnerContainer = styled.div`
  height: auto;
  max-width: 1225px;
  margin: 40px 20px;
  box-sizing: border-box;

  & h1 {
    padding-left: 10px;
  }
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  flex-wrap: wrap;
  border-bottom: 1px solid lightgray;
  margin-bottom: 20px;
  padding-bottom: 80px;
`;

const NavItems = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: -40px;
  margin-bottom: 60px;
`;

const Button = styled.button`
font-size: 1rem;
color: ${props =>
  (props.selected && '#eee') ||
  '#333'
};
background: ${props =>
  (props.selected && '#333') ||
  '#eee'
};
padding: 10px 20px;
border: 1px solid #333;
transition: 0.2s;
&:hover {
  cursor: pointer;
  background: ${props =>
    (props.selected && '#444') ||
    'lightgray'
  };
}
&:active {
  background: lightgray;
  outline: none;
}
&:focus {
  outline: none;
}

&:first-of-type {
  border-right: 0px;
  border-radius: 5px 0 0 5px;
}
&:last-of-type {
  border-radius: 0px 5px 5px 0;
}
`;

const ProfileImage = styled.div`
  width: 200px;
  height: 200px;
  background: url(${props => props.src && props.src || ''});
  background-position: center;
  background-size: cover;
  margin: 10px;
  border: 1px solid lightgray;
  box-sizing: border-box;
  border-radius: 3px;
`;

const Card = styled.div`
  border: 1px solid lightgray;
  width: auto;
  padding: 5px;
  border-radius: 3px;
  background: white;
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  box-sizing: border-box;
  color: #333;
  transition: 0.3s;

  &:hover {
    box-shadow: 0px 2px 10px rgba(0,0,0,0.1);
  }
`;

const SignOut = styled.button`
  font-size: 0.9rem;
  color: #999;
  background: none;
  margin-left: 20px;
  padding: 7px 14px;
  border-radius: 5px;
  border: 2px solid #999;
  transition: 0.2s;
  &:hover {
    cursor: pointer;
    background: tomato;
    color: white;
    border: 2px solid tomato;
  }
  &:active {
    background: tomato;
    color: white;
    opacity: 0.5;
    outline: none;
  }
  &:focus {
    outline: none;
  }
`;

const FadeIn = transition.div.attrs({
  unmountOnExit: false,
  timeout: 500
})`
  opacity: 1;
  width: 100%;
  transition: opacity 0.3s ease-in 0.2s;

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

const FadeRight = transition.div.attrs({
  unmountOnExit: true,
  timeout: 500
})`
  opacity: 1;
  margin-right: 0;
  transition: opacity 0.5s ease, margin 0.5s ease;

  &:enter {
    opacity: 0;
    margin-right: 100px;
  }
  &:enter-active {
    opacity: 1;
    margin-right: 0px;
  }
  &:exit {
    opacity: 1;
  }
  &:exit-active {
    opacity: 0;
    margin-right: 100px;
  }
`;

const FadeUp = transition.div.attrs({
  unmountOnExit: true,
  timeout: 500
})`
  opacity: 1;
  margin-top: 0px;
  transition: opacity 0.3s ease, margin 0.3s ease;

  &:enter {
    opacity: 0;
    margin-top: 30px;
  }
  &:enter-active {
    opacity: 1;
    margin-top: 0px;
  }
  &:exit {
    opacity: 1;
  }
  &:exit-active {
    opacity: 0;
    margin-top: 30px;
  }
`;
