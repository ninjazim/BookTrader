import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import transition from 'styled-transition-group';
import { TransitionGroup } from 'react-transition-group';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faTimesCircle from '@fortawesome/fontawesome-free-solid/faTimesCircle'
import faCheckCircle from '@fortawesome/fontawesome-free-solid/faCheckCircle'

class RequestList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }

    this.removeRequest = this.removeRequest.bind(this);
    this.denyRequest = this.denyRequest.bind(this);
    this.approveRequest = this.approveRequest.bind(this);
  }

  removeRequest(request) {
    if (request.requester === this.props.user.username) {
      request.status = 'canceled';
      this.props.updateRequest(request);
    }
  }

  approveRequest(request) {
    if (request.owner === this.props.user.username) {
      request.status = 'approved';
      this.props.updateRequest(request);
    }
  }

  denyRequest(request) {
    if (request.owner === this.props.user.username) {
      request.status = 'denied';
      this.props.updateRequest(request);
    }
  }

  render() {
    let { requests } = this.props;
    if (!this.props.requests) {
      return <span>No Requests</span>
    }
    let outgoing = requests.filter(r => {
      return r.requester === this.props.user.username
    });
    let incoming = requests.filter(r => {
      return (
        (r.owner === this.props.user.username) &&
        (r.status !== 'denied')
      );
    });
    return (
      <div>
        <h2>Requests for Me</h2>
        <Container>
          <TransitionGroup component={null}>
          { incoming.map((request) => {
            return (
              <CardWrapper status={request.status} key={request._id}>
                <Card to={`/books/${request.book}`}>
                  <Image src={`http://books.google.com/books/content?id=${request.book}&printsec=frontcover&img=1&zoom=1&source=gbs_api`} />
                  <InnerCard>
                    <Label>Requester</Label>
                    <Item>{request.requester}</Item>
                    <Label>Status</Label>
                    <Item caps>{request.status}</Item>
                  </InnerCard>
                </Card>
                <ApproveButton title="Approve request" onClick={() => this.approveRequest(request)}>
                  <FontAwesomeIcon icon={faCheckCircle} />
                </ApproveButton>
                <DenyButton title="Deny request" onClick={() => this.denyRequest(request)}>
                  <FontAwesomeIcon icon={faTimesCircle} />
                </DenyButton>
              </CardWrapper>
            )
          })}
          </TransitionGroup>
          { incoming.length == 0 &&
            <BlankCard key='in-blank'>
              <Item>No Requests</Item>
            </BlankCard>
          }
        </Container>
        <h2> My Requests </h2>
        <Container>
          <TransitionGroup component={null}>
          { outgoing.map((request) => {
            return (
              <CardWrapper status={request.status} key={request._id}>
                <Card to={`/books/${request.book}`}>
                  <Image src={`http://books.google.com/books/content?id=${request.book}&printsec=frontcover&img=1&zoom=1&source=gbs_api`} />
                  <InnerCard>
                    <Label>Owner</Label>
                    <Item>{request.owner}</Item>
                    <Label>Status</Label>
                    <Item caps>{request.status}</Item>
                  </InnerCard>
                </Card>
                <DeleteButton title="Delete request" onClick={() => this.removeRequest(request)}>
                  ×
                </DeleteButton>
              </CardWrapper>
            )
          })}
          </TransitionGroup>
          { outgoing.length == 0 &&
            <BlankCard key='out-blank'>
              <Item>No Requests</Item>
            </BlankCard>
          }
        </Container>
      </div>
    );
  }
}

export default RequestList;


const Container = styled.div`
  display: flex;
  width: 1225px;
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
    width: 600px;
  }

   @media (max-width: 610px) {
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
  background: ${props =>
    (props.status == 'approved' && 'rgba(60, 179, 113, 0.1)') ||
    (props.status == 'denied' && 'rgba(255, 99, 71, 0.1)') ||
    'white'
  };
  border: ${props =>
    (props.status == 'approved' && '1px solid mediumseagreen') ||
    (props.status == 'denied' && '1px solid tomato') ||
    '1px solid lightgray'
  };
  border-radius: 3px;
  width: 275px;
  min-height: 150px;
  margin: 10px;
  box-sizing: border-box;

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

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const Card = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  box-sizing: border-box;
  text-decoration: none;
  color: #333;
  padding: 20px;
`;

const BlankCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  text-decoration: none;
  color: #333;
  width: 275px;
  height: 150px;
  padding: 20px;
  border: 1px solid lightgray;
  background-color: #e3e3e3;
  color: darkgray;
  margin: 10px;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const InnerCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding-left: 20px;
`;

const Image = styled.img`
  width: 75px;
`;

const Label = styled.p`
  margin: 0;
  padding: 5px 0 0;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: grey;
`;

const Item = styled.p`
  margin: 0;
  padding: 5px 0 10px;
  font-size: 1rem
  color: #333;
  text-transform: ${props =>
    (props.caps && 'capitalize') || 'none'
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

const ApproveButton = styled.button`
  padding: 0;
  font-size: 2.5rem;
  border: none;
  background: white;
  color: gray;
  top: 20px;
  right: 20px;
  opacity: 0;
  transition: 0.3s;
  cursor: pointer;
  line-height: 0;
  box-sizing: border-box;
  position: absolute;
  border-radius: 50px;

  ${CardWrapper}:hover & {
      opacity: 1;
  }

  &:hover {
    color: mediumseagreen;
  }

  &:active, &:focus {
    outline: none;
  }
`;

const DenyButton = ApproveButton.extend`
  top: auto;
  bottom: 20px;

  &:hover {
    color: tomato;
  }
`;
