import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import transition from 'styled-transition-group';
import { TransitionGroup } from 'react-transition-group';

class EmptyBookList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterIsVisible: false,
      filterValue: '',
    }
  }

  render() {
    return (
      <OuterContainer>
        <Container>
          <TransitionGroup component={null}>
            <CardWrapper key="empty-1">
              <Card disabled to="#">
                <Image />
                <Title />
              </Card>
            </CardWrapper>
            <CardWrapper key="empty-2">
              <Card disabled to="#">
                <Image />
                <Title />
              </Card>
            </CardWrapper>
            <CardWrapper key="empty-3">
              <Card disabled to="#">
                <Image />
                <Title />
              </Card>
            </CardWrapper>
          </TransitionGroup>
        </Container>
      </OuterContainer>
    );
  }
}

export default EmptyBookList;

const OuterContainer = styled.div`
  disply: flex;
  flex-direction: column;
`;


const Container = styled.div`
  display: flex;
  margin-top: 20px;
  width: 1225px;
  flex: 1 1 1225px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
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
  border: 1px solid #ddd;
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
    margin: 10px 20px;
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

const Image = styled.div`
  margin-bottom: 20px;
  width: 140px;
  height: 230px;
  background: linear-gradient(90deg, #e7e7e7, #ededed, #e7e7e7);
	background-size: 200% 100%;
  animation: ${ImagePulse} 2s infinite;
`;

const Title = styled.div `
  font-size: 1rem;
  height: 1rem;
  background: #e0e0e0;
  width: 80%;
  margin-bottom: 10px;
  text-align: center;
  animation: ${TextPulse} 2s 1s infinite;
`;