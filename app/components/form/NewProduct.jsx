// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

// Redux
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions/products.jsx';
import { getRows } from '../../reducers/FormReducer';
import uuidv4 from 'uuid/v4';

// DragNDrop
import TransitionList from '../../components/shared/TransitionList';
import _withDragNDrop from './hoc/_withDragNDrop';

// Custom Component
import Button from '../shared/Button.jsx';
import { Section } from '../shared/Section';
import NewProductRow from './NewProductRow.jsx';

// Styled Components
import styled from 'styled-components';

const ItemsListWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  -webkit-app-region: no-drag;
`;

const ItemsListHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  & > div {
    display: flex;
    flex-direction: column;
    margin-right: 20px;
  }
`;

const ItemsListActionsBtn = styled(Button)`
  &:focus {
    outline: none !important;
    box-shadow: none !important;
    color: white;
  }
  &:active {
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
  }
`;

const ItemsListDiv = styled.div`
  position: relative;
  margin-bottom: 10px;
`;

// Component
export class ItemsList extends PureComponent {
    constructor() { 
        super();
        this.state = {
            item: {_id:uuidv4()}
        }
        this.updateItem = this.updateItem.bind(this)
        this.addItem = this.addItem.bind(this)
    }
  componentDidMount() {
    const { rows, boundActionCreators } = this.props;
    if (!rows.length) {
      boundActionCreators.addItem();
    }
  }
    updateItem(item) { 
        this.setState({item})
    }
    addItem() { 
        const { saveProduct } = this.props.boundActionCreators;
        saveProduct(this.state.item);
        this.setState({            item: {_id:uuidv4()}    })
    }

  render() {
    // Bound Actions
    const { addItem, removeItem, updateItem } = this.props.boundActionCreators;
    // Item Rows
      const { t } = this.props;
    const rows = [ this.state.item ]
    const rowsComponent = rows.map((item, index) => (
      <NewProductRow
        key={item._id}
        item={item}
        t={t}
        hasHandler={rows.length > 1}
        actions={index !== 0}
        updateRow={this.updateItem}
        addItem={this.addItem}
      />
    ));

    // Render
    return (
      <Section>
        <ItemsListWrapper>
          <ItemsListHeader>
            <label className="itemLabel">Add Product</label>
          </ItemsListHeader>
          <ItemsListDiv>
            <TransitionList componentHeight={50}>
              {rowsComponent}
            </TransitionList>
          </ItemsListDiv>
          <div className="itemsListActions">
            <ItemsListActionsBtn primary onClick={this.addItem}>
              Add Product to Database
            </ItemsListActionsBtn>
          </div>
        </ItemsListWrapper>
      </Section>
    );
  }
}

ItemsList.propTypes = {
  boundActionCreators: PropTypes.object.isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = state => ({
  formState: state.form, // Make drag & drop works
  rows: getRows(state),
});

const mapDispatchToProps = dispatch => ({
  boundActionCreators: bindActionCreators(Actions, dispatch),
});

// Export
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  translate(),
  _withDragNDrop
)(ItemsList);
