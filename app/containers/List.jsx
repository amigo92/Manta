// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
const openDialog = require('../renderers/dialog.js');
const ipc = require('electron').ipcRenderer;
import { translate } from 'react-i18next';

// Actions
import * as ProductsActions from '../actions/products';
// Components
import List from '../components/list/List.jsx';
import NewProduct from '../components/form/NewProduct';
import Message from '../components/shared/Message';
import { Table, THead, TBody, TH, TR } from '../components/shared/Table';
import _withFadeInAnimation from '../components/shared/hoc/_withFadeInAnimation';
import {
  PageWrapper,
  PageHeader,
  PageHeaderTitle,
  PageContent,
} from '../components/shared/Layout';

// Selectors
import { getProducts } from '../reducers/ProductsReducer';
import { getList, getListCreator } from '../reducers/ListReducer';

// Component
class Products extends PureComponent {

  componentDidMount() {
    ipc.on('confirmed-delete-product', (event, index, productId) => {
      if (index === 0) {
        this.confirmedDeleteProduct(productId);
      }
    });
  }

  componentWillUnmount() {
    ipc.removeAllListeners('confirmed-delete-product');
  }


  confirmedDeleteProduct(productId) {
    const { dispatch } = this.props;
    dispatch(ProductsActions.deleteProduct(productId));
  }

  render() {
    const { t, products, list } = this.props;
    const listComponent = list.map((list, index) => (
      <List
        key={list._id}
        list={list}
        index={index}
      />
    ));
    return (
      <PageWrapper>
        <PageHeader>
          <PageHeaderTitle>All Lists</PageHeaderTitle>
          <h3>{this.props.listCreator && this.props.listCreator.length}</h3>
        </PageHeader>
        <PageContent>
          {list.length === 0 ? (
            <Message info text='No List to show, Please add some.' />
          ) : (
            <Table hasBorders bg>
              <THead>
                <TR>
                  <TH>Firki No</TH>
                  <TH>Bill No</TH>
                  <TH>Total Distance</TH>
                </TR>
              </THead>
              <TBody>{listComponent}</TBody>
            </Table>
          )}
        </PageContent>
      </PageWrapper>
    );
  }
}

// PropTypes
Products.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  dispatch: PropTypes.func.isRequired,
};

// Map state to props & Export
const mapStateToProps = state => ({
  products: getProducts(state),
  list: getList(state),
  listCreator: getListCreator(state),
});

export default compose(
  connect(mapStateToProps),
  translate(),
  _withFadeInAnimation
)(Products);
