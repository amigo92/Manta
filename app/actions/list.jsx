import * as ACTION_TYPES from '../constants/actions.jsx';
import { createAction } from 'redux-actions';

// Get All Contacts
export const getAllList = createAction(ACTION_TYPES.LIST_GET_ALL);
export const getAllListCreator = createAction(ACTION_TYPES.CREATOR_LIST_GET_ALL);

// Save A Contact
export const saveList = createAction(
  ACTION_TYPES.LIST_SAVE,
  productData => productData
);

// Delete A Contact
export const deleteList = createAction(
  ACTION_TYPES.LIST_DELETE,
  productID => productID
);