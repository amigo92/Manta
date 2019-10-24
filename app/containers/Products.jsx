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
import Product from '../components/products/Product';
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

// Component
class Products extends PureComponent {
  constructor(props) {
    super(props);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

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

  deleteProduct(productId) {
    const { t } = this.props;
    openDialog(
      {
        type: 'warning',
        title: 'Delete Product',
        message: 'Would you like to delete the product?',
        buttons: [
          t('common:yes'),
          t('common:noThanks')
        ],
      },
      'confirmed-delete-product',
      productId
    );
  }

  confirmedDeleteProduct(productId) {
    const { dispatch } = this.props;
    dispatch(ProductsActions.deleteProduct(productId));
  }

  render() {
    const { t, products } = this.props;
    const productsComponent = products.map((products, index) => (
      <Product
        key={products._id}
        product={products}
        index={index}
        deleteProduct={this.deleteProduct}
      />
    ));
    return (
      <PageWrapper>
        <PageHeader>
          <PageHeaderTitle>All Products</PageHeaderTitle>
        </PageHeader>
        <PageContent>
          <div style={{paddingBottom:'30px'}}>
            <NewProduct />
          </div>
          {products.length === 0 ? (
            <Message info text='No Products to show, Please add some.' />
          ) : (
            <Table hasBorders bg>
              <THead>
                <TR>
                  <TH>Description</TH>
                  <TH>Price</TH>
                  <TH>Distance</TH>
                  <TH actions>{t('contacts:fields:actions')}</TH>
                </TR>
              </THead>
              <TBody>{productsComponent}</TBody>
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
  dispatch: PropTypes.func.isRequired,
};

// Map state to props & Export
const mapStateToProps = state => ({
  products: getProducts(state),
});

export default compose(
  connect(mapStateToProps),
  translate(),
  _withFadeInAnimation
)(Products);
