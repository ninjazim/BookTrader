import React from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import transition from "styled-transition-group";

import BookList from '../components/bookList';
import ProfileForm from '../components/profileForm';
import EmptyBookList from '../components/emptyBookList';

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      validUser: false,
      fadeIn: false,
    }
  }

  componentDidMount() {
    window.scrollTo(0,0);
    this.setState({ loading: true });
    axios.get(`/api/users/${this.props.match.params.username}`)
        .then(response => {
          if (response.data != null) {
            this.setState({
              user: response.data,
              loading: false,
              validUser: true,
            });
            document.title = `BookTrader - ${response.data.username}`;
            setTimeout(() => {
              this.setState({
                fadeIn: true,
              });
            }, 300);
          } else {
            this.setState({
              loading: false,
              validUser: false,
            });
          }
        })
        .catch(error => {
          console.log("Profile Error");
          console.log(error);
        });
  }

  render() {
    let username = this.props.match.params.username;
    return (
      <Container>
        { !this.state.fadeIn && 
          <FadeIn in={ this.state.loading }>
            <InnerContainer>
              <EmptyText />
              <Row>
                <Card>
                  <EmptyProfileImage />
                </Card>
                <EmptyProfileForm>
                  <EmptyProfileText small />
                  <EmptyProfileText />
                  <EmptyProfileText small />
                  <EmptyProfileText />
                </EmptyProfileForm>
              </Row>
              <div>
                <EmptyBookList />
              </div>
            </InnerContainer>
          </FadeIn>
        }
        { !this.state.loading && this.state.validUser &&
          <FadeRight in={ !this.state.loading && this.state.fadeIn }>
            <InnerContainer>
              <h1>{username}'s Profile</h1>
              <Row>
                <Card>
                  <ProfileImage src={this.state.user.avatarUrl} />
                </Card>
                <ProfileForm loggedInUser={this.props.loggedInUser}
                            pageUser={this.state.user} />
              </Row>
              <div>
                <BookList books={this.state.user.books}
                          showAddBook={ false } 
                          sortBy={'title'} />
              </div>
            </InnerContainer>
          </FadeRight>
        }
        { !this.state.loading && !this.state.validUser &&
          <InnerContainer>
            <p>Could not find <strong>{this.props.match.params.username}</strong></p>
          </InnerContainer>
        }
      </Container>
    );
  }
}

export default User;


const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 90px);
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
  margin: 40px 20px;
  box-sizing: border-box;

  & h1 {
    padding-left: 10px;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  flex-wrap: wrap;
  margin-bottom: 60px;
`;

const ProfileImage = styled.div`
  width: 200px;
  height: 200px;
  background: url(${props => props.src && props.src || ''});
  background-position: center;
  background-size: cover;
  margin: 10px;
  ${'' /* border: 1px solid lightgray; */}
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

const TextPulseDescription = keyframes`
  0%  {
		background: #e7e7e7;
    }
	25% {
		background: #ededed;
    }
	50% {
		background: #eaeaea;
    }
`;

const EmptyText = styled.div`
  height: 2rem;
  width: 300px;
  margin: 20px 0 20px 10px;
  background: #e0e0e0;
  animation: ${TextPulse} 2s 1s infinite;
`;

const EmptyProfileImage = ProfileImage.extend`
  background: linear-gradient(90deg, #e7e7e7, #ededed, #e7e7e7);
	background-size: 200% 100%;
  animation: ${ImagePulse} 2s infinite;
  border: none;
`;

const EmptyProfileForm = styled.div`
  max-width: 470px;
  min-width: 300px;
  flex: 1;
  border: 1px solid lightgray;
  padding: 20px;
  border-radius: 3px;
  background: white;
  margin: 10px;
  height: 230px;
  box-sizing: border-box;
`;

const EmptyProfileText = styled.div`
  height: ${props => 
    (props.small && '1rem') || '1.5rem'
  };
  width: ${props => 
    (props.small && '75px') || '200px'
  };
  margin: ${props => 
    (props.small && '15px 0 0') || '10px 0 20px'
  };
  background: #e7e7e7;;
  animation: ${TextPulseDescription} 2s 1s infinite;
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
