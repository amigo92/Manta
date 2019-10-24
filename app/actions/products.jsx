import * as ACTION_TYPES from '../constants/actions.jsx';
import { createAction } from 'redux-actions';

// Get All Contacts
export const getAllProducts = createAction(ACTION_TYPES.PRODUCT_GET_ALL);

// Save A Contact
export const saveProduct = createAction(
  ACTION_TYPES.PRODUCT_SAVE,
  productData => productData
);

// Delete A Contact
export const deleteProduct = createAction(
  ACTION_TYPES.PRODUCT_DELETE,
  productID => productID
);

export const addItem = createAction(ACTION_TYPES.FORM_ITEM_ADD);

export const removeItem = createAction(
  ACTION_TYPES.FORM_ITEM_REMOVE,
  itemID => itemID
);
