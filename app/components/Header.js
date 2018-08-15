import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  handleAuth() {
    this.props.storeSessionState();
  }

  render() {
    const user = this.props.user;
    return (
      <HeaderContainer>
        <InnerContainer>
          <Title to='/'>
            <Logo />
            BookTrader
          </Title>
          <MenuItems>
            <NavItem blue='true' to='/books' >
              Books
            </NavItem>
            <NavItem purple='true' to='/users' >
              Users
            </NavItem>
            { !this.props.isLoggedIn &&
              <SignInButton
                href={`/auth/github`}
                onClick={this.getUser}>
                  Sign in with Github
              </SignInButton>
            }
            { this.props.isLoggedIn &&
              <NavItem green='true' to='/profile' >
                My Profile
              </NavItem>
            }
          </MenuItems>
        </InnerContainer>
      </HeaderContainer>
    );
  }
}

export default Header;

const HeaderContainer = styled.div`
  width: 100%;
  height: 90px;
  min-width: 350px;
  background: #333;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 10px;
  box-sizing: border-box;

  @media (max-width: 650px) {
    min-height: 90px;
    height: auto;
    padding: 20px 10px; 
  }
`;

const InnerContainer = styled.div`
  width: 100%;
  min-width: 350px;
  max-width: 1225px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 10px;

  @media (max-width: 650px) {
    flex-direction: column;
  }
`;

const Title = styled(Link)`
  color: white;
  font-weight: 400;
  font-size: 2.25rem;
  margin: 0;
  line-height: 2.5rem;
  text-decoration: none;
  font-family: 'Roboto Slab', 'Roboto', sans-serif;

  & img {
    padding-right: 5px;
    margin-bottom: -5px;
    width: 40px;
  }

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  @media (max-width: 650px) {
    margin-bottom: 10px;
  }
`;

const UserName = styled.p`
  padding: 10px 20px;
  border-radius: 5px;
  background: none;
  color: white;
  margin: 0 0 0 10px;
  border: 2px solid white;
  font-size: 0.9rem;
  text-decoration: none;
  position: relative;
  z-index: 100;
`;

const MenuItems = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  @media (max-width: 650px) {
    justify-content: center;
  }
`;

const NavItem = styled(Link)`
  padding: 10px 20px;
  border-radius: 5px;
  background: none;
  color: white;
  margin: 0 10px 0 0;
  border: 2px solid white;
  font-size: 0.9rem;
  text-decoration: none;
  box-sizing: border-box;
  transition: 0.2s;

  &:hover {
    cursor: pointer;
    background: ${props =>
      (props.blue == 'true' && 'steelblue') ||
      (props.green == 'true' && 'mediumseagreen') ||
      (props.purple == 'true' && 'mediumpurple') ||
      'gray'
    };
    color: white;
    border: ${props =>
      (props.blue == 'true' && '2px solid steelblue') ||
      (props.green == 'true' && '2px solid mediumseagreen') ||
      (props.purple == 'true' && '2px solid mediumpurple') ||
      '2px solid gray'
    };
  }

  &:last-of-type {
    margin-right: 0;
  }

  @media (max-width: 650px) {
    font-size: 0.8rem;
    padding: 5px 10px;
  }
`;

const Logo = styled.div`
  width: 35px;
  height: 35px;
  background: url('/public/img/yellow-book-256.png') no-repeat center;
  background-size: cover;
  margin: 0 10px 1px 0px;
`;

const SignInButton = styled.a`
  padding: 10px 20px;
  border-radius: 5px;
  background: ${props =>
    (props.red && 'tomato')
    || (props.green && 'MEDIUMSEAGREEN')
    || 'none'
  };
  color: white;
  border: 2px solid white;
  font-size: 0.9rem;
  text-decoration: none;
  margin: 0;
  transition: 0.2s;

  @media (max-width: 650px) {
    font-size: 0.8rem;
    padding: 5px 10px;
  }

  &:hover {
    cursor: pointer;
    background: white;
    color: #333;
  }

`;
