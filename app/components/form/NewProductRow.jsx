// Libs
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import Switch from '../shared/Switch';

// HOCs
import _withDraggable from './hoc/_withDraggable';

// Styles
import styled from 'styled-components';

const ItemDiv = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex: 1;

  & > div {
    display: flex;
    flex-direction: row;
    margin-right: 10px;
    &:last-child {
      margin-right: 0px;
    }
  }
`;

const ItemDivInput = styled.input`
  min-height: 36px;
  border-radius: 4px;
  padding: 0 10px;
  font-size: 16px;
  display: block;
  width: 100%;
  border: 1px solid #f2f3f4;
  color: #3a3e42;
  font-size: 14px;
`;

const ItemActions = styled.div`
  display: flex !important;
  align-items: center;
  justify-content: center;
  width: 40px;
  margin: 0 !important;
  margin-left: 10px;
`;

const ItemRemoveBtn = styled.a`
  > i {
    color: #ec476e;
  }
`;

// Component
export class NewProductRow extends Component {
  constructor(props) {
    super(props);
    this.handleTextInputChange = this.handleTextInputChange.bind(this);
    this.handleDistanceInputChange = this.handleDistanceInputChange.bind(this);
    this.handlePriceInputChange = this.handlePriceInputChange.bind(this);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.uploadRowState = this.uploadRowState.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  // Update local state
  handleInputChange(event) {
    this.setState({
     isReel: 'yes'
    });
  }

  componentWillMount() {
    const { _id, description, isReel, price, distance } = this.props.item;
    this.setState({
      _id,
      description: description || '',
      isReel: isReel || '',
      price: price || '',
      distance: distance || ''
    });
  }

  handleKeyDown(e) {
    if (e.which === 13) {
      this.props.addItem();
    }
  }

  handleTextInputChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value }, () => {
      this.uploadRowState();
    });
  }

  handlePriceInputChange(event) {
    const name = event.target.name;
    const eValue = event.target.value;
    const value = eValue === '' ? '' : parseFloat(eValue);
    this.setState({ price:value }, () => {
      this.uploadRowState();
    });
    // this.setState({ [name]: value }, () => {
    //   this.updateSubtotal();
    // });
  }
  handleDistanceInputChange(event) {
    const name = event.target.name;
    const eValue = event.target.value;
    const value = eValue === '' ? '' : parseFloat(eValue);
    this.setState({ distance:value }, () => {
      this.uploadRowState();
    });
    // this.setState({ [name]: value }, () => {
    //   this.updateSubtotal();
    // });
  }
  uploadRowState() {
    const { updateRow } = this.props;
    updateRow(this.state);
  }

  render() {
    const { t, actions, hasHandler } = this.props;
    return (
      <ItemDiv>
        {hasHandler && (
          <div className="dragHandler">
            <i className="ion-grid" />
          </div>
        )}
        <div className="flex3">
          <ItemDivInput
            name="description"
            type="text"
            value={this.state.description}
            onChange={this.handleTextInputChange}
            onKeyDown={this.handleKeyDown}
            placeholder={t('form:fields:items:description')}
          />
        </div>
        <div className="flex3">
        <ItemDivInput
        name="reel"
        type="text"
        value={this.state.isReel}
        onChange={this.handleInputChange}
        onKeyDown={this.handleKeyDown}
        placeholder='is it a Reel type? (yes/no)'
      />
        </div>
        <div className="flex1">
          <ItemDivInput
            name="price"
            type="number"
            step="0.01"
            value={this.state.price}
            onChange={this.handlePriceInputChange}
            onKeyDown={this.handleKeyDown}
            placeholder={t('form:fields:items:price')}
          />
        </div>
        <div className="flex1">
          <ItemDivInput
            name="distance"
            type="number"
            step="0.01"
            value={this.state.distance}
            onChange={this.handleDistanceInputChange}
            onKeyDown={this.handleKeyDown}
            placeholder='Distance'
          />
        </div>
      </ItemDiv>
    );
  }
}

NewProductRow.propTypes = {
  actions: PropTypes.bool.isRequired,
  addItem: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  hasHandler: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  updateRow: PropTypes.func.isRequired,
};

export default compose(_withDraggable)(NewProductRow);
