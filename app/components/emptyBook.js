import React from 'react';
import styled, { keyframes } from 'styled-components';
import transition from "styled-transition-group";

class EmptyBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageLoaded: false,
      bookOwner: '',
      loaded: false,
    }
  }

  render() {

    return (
      <Container in={ !this.state.loading }>
        <BookCover>
          <Image loading={ !this.state.imageLoaded } />
        </BookCover>
        <BookDetails>
          <Title>
          </Title>
          <Authors>
          </Authors>
          <Year>
          </Year>
          <Additional>
            <Description width="95" />
            <Description width="85" />
            <Description width="90" />
            <Description width="45" />
          </Additional>
        </BookDetails>
      </Container>
    );
  }
}

export default EmptyBook;

const Container = transition.div.attrs({
  unmountOnExit: true,
  timeout: 500
})`
  width: 1200px;
  padding: 20px;
  display: flex;
  flex-direction: row;
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

const TextPulseAdditional = keyframes`
  0%  {
		background: #f9f9f9;
    }
	25% {
		background: #fafafa;
    }
	50% {
		background: #fff;
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

const BookCover = styled.div`
  flex: 0;
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;


const BookDetails = styled.div`
  flex: 1 1 500px;
  padding: 20px;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  ${'' /* background: white; */}
`

const Additional = styled.div`
  padding: 20px;
  margin: 20px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  background: #fff;
  width: 100%;
  height: 338px;
  animation: ${TextPulseAdditional} 2s 1.1s infinite;
  
`

const Image = styled.img`
  width: 350px;
  min-height: ${props =>
    (props.loading == true && '500px') || '0'
  };
  transition: 0.5s;
  background: linear-gradient(90deg, #e7e7e7, #ededed, #e7e7e7);
	background-size: 200% 100%;
	animation: ${props =>
    (props.loading == true && `${ImagePulse} 2s infinite`) || 'none'
  };

`;

const Title = styled.div`
  margin: 0 0 10px;
  width: 75%;
  height: 2rem;
  background: #e0e0e0;
  animation: ${TextPulse} 2s 1s infinite;
`;

const Authors = styled.div`
  margin: 5px 0 15px;
  height: 1.25rem;
  width: 200px;
  background: #e0e0e0;
  animation: ${TextPulse} 2s 1s infinite;
`;

const Year = styled.div`
  margin: 0 0 5px;
  height: 1rem;
  width: 75px;
  background: #e0e0e0;
  animation: ${TextPulse} 2s 1s infinite;
`

const Description = styled.div`
  margin: 5px 0;
  height: 1.2rem;
  width: ${props =>
    (props.width && `${props.width}%`) || '90%'
  };
  background: #e7e7e7;
  animation: ${TextPulseDescription} 2s 1s infinite;
`;
