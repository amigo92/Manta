// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

// Redux
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions/form.jsx';
import { getRows } from '../../reducers/FormReducer';

// DragNDrop
import TransitionList from '../../components/shared/TransitionList';
import _withDragNDrop from './hoc/_withDragNDrop';

// Custom Component
import Button from '../shared/Button.jsx';
import { Section } from '../shared/Section';
import ItemRow from './ItemRow.jsx';

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
  constructor(props) {
    super(props);
    this.adder = this.adder.bind(this)
  }
  adder() { 
    const { addItem } = this.props.boundActionCreators;
    addItem()
    this.itemRow && this.itemRow.focusFirstField()
  }
  componentDidMount() {
    // const { rows, boundActionCreators } = this.props;
    // if (!rows.length) {
      // boundActionCreators.addItem();
    // }
    // this.props.onRef(this.props.boundActionCreators.addItem);
    this.props.rows.length || this.adder()
  }

  render() {
    // Bound Actions
    const { addItem, removeItem, updateItem } = this.props.boundActionCreators;
    // Item Rows
    const { t, rows } = this.props;
    const rowsComponent = rows.map((item, index) => (
      <ItemRow
        key={item.id}
        item={item}
        t={t}
        products={this.props.products}
        invoices={this.props.invoices}
        hasHandler={rows.length > 1}
        onRef={(input) => { this.itemRow = input; }} 
        actions={index !== 0}
        rows={this.props.rows}
        updateRow={updateItem}
        removeRow={removeItem}
        addItem={this.adder}
      />
    ));

    // Render
    return (
      <Section>
        <ItemsListWrapper>
          <ItemsListHeader>
            <label className="itemLabel">{t('form:fields:items:name')} *</label>
          </ItemsListHeader>
          <ItemsListDiv>
            <TransitionList componentHeight={50}>
              {rowsComponent}
            </TransitionList>
          </ItemsListDiv>
          <div className="itemsListActions">
            <ItemsListActionsBtn primary onClick={this.adder}>
              {t('form:fields:items:add')}
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
  onRef: PropTypes.func
};

const mapStateToProps = state => ({
  formState: state.form, // Make drag & drop works
  rows: getRows(state),
  products: state.products,
  invoices: state.invoices
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
