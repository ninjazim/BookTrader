import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faPencilAlt from '@fortawesome/fontawesome-free-solid/faPencilAlt'
import faSave from '@fortawesome/fontawesome-free-solid/faSave'

class ProfileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.pageUser.name,
      location: props.pageUser.location,
      canEdit: false,
    }
    this.updateUser = this.updateUser.bind(this);
  }

  updateUser() {
    let user = this.props.pageUser;
    if (this.state.canEdit) {
      let updates = {
        name: this.state.name,
        location: this.state.location
      };
      if (updates.name != user.name || updates.location != user.location) {
        axios.post(`/api/users/${user.username}`, updates)
             .then(response => {
               if (response.data) {
                 this.setState({
                   canEdit: !this.state.canEdit
                 });
               }
             })
             .catch(error => {
               console.log(error);
             });
      } else {
        this.setState({
          canEdit: !this.state.canEdit
        });
      }
    } else {
      this.setState({
        canEdit: !this.state.canEdit,
      });
    }
  }

  render() {
    return (
        <Card>
          <Label>Name</Label>
          <TextInput
            disabled={!this.state.canEdit}
            value={this.state.name}
            onChange={(e) => this.setState({ name: e.target.value })}
            placeholder='Bob Loblaw'
          />
          <Label>Location</Label>
          <TextInput
            disabled={!this.state.canEdit}
            value={this.state.location}
            onChange={(e) => this.setState({ location: e.target.value })}
            placeholder='City, State'
          />
          { this.props.loggedInUser._id === this.props.pageUser._id && document.location.pathname === '/profile' &&
            <ButtonContainer>
              <Button green={this.state.canEdit}
                onClick={() => this.updateUser()}
                >
                { !this.state.canEdit &&
                  <FontAwesomeIcon icon={faPencilAlt} />
                }
                { this.state.canEdit &&
                  <FontAwesomeIcon icon={faSave} />
                }
              </Button>
            </ButtonContainer>
          }
        </Card>
    );
  }
}

export default ProfileForm;

const Card = styled.div`
  border: 1px solid lightgray;
  max-width: 470px;
  min-width: 300px;
  flex: 1;
  min-height: 200px;
  padding: 20px;
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

const Label = styled.p`
  margin: 0;
  padding: 5px 0 0;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: grey;

`;

const TextInput = styled.input`
  width: 100%;
  padding: 5px 0;
  margin: 0 0 10px;
  border: 0;
  border-bottom: 1px solid lightgray;
  box-sizing: border-box;
  font-size: 1.2rem;

  &:focus {
    outline: none;
    border-bottom: 1px solid mediumseagreen;
  }

  &:disabled {
    border-bottom: 1px solid transparent;
    color: gray;
  }

  &::placeholder {
    color: lightgray;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center
  justify-content: flex-end;
  padding-top: 20px;

`;

const Button = styled.button`
  height: 35px;
  width: 50px;
  border-radius: 5px;
  background: ${props =>
    (props.green == true && 'mediumseagreen') ||
    (props.red && 'tomato') ||
    'none'
  };
  border: 1px solid ${props =>
    (props.green == true && 'mediumseagreen') || 'darkgray'
  };
  color: ${props =>
    (props.green == true && 'white') || '#777'
  };
  font-size: 0.9rem;
  transition: 0.3s;
  opacity: 0.9;

  &:hover {
    cursor: pointer;
    opacity: 1;
    color: ${props =>
      (props.green == true && 'white') || '#333'
    };
  }

  &:focus {
    outline: none;
  }

  & span {
    padding-right: 5px;
  }
`;
