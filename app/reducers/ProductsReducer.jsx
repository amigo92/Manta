import { handleActions, combineActions } from 'redux-actions';
import { createSelector } from 'reselect';
import * as Actions from '../actions/products';

const ProductsReducer = handleActions(
  {
    [combineActions(
      Actions.getAllProducts,
      Actions.saveProduct,
      Actions.deleteProduct
    )]: (state, action) => action.payload,
  },
  []
);

export default ProductsReducer;

// Selector
const getProductsState = state => state.products;
export const getProducts = createSelector(
  getProductsState,
  products => products
);
