// Node Libs
import uuidv4 from 'uuid/v4';

// Actions Verbs
import * as ACTION_TYPES from '../constants/actions.jsx';

// Helpers
import { getAllDocs, saveDoc, deleteDoc } from '../helpers/pouchDB';
import i18n from '../../i18n/i18n';

const ProductsMW = ({ dispatch }) => next => action => {
  switch (action.type) {
    case ACTION_TYPES.PRODUCT_GET_ALL: {
      return getAllDocs('products')
        .then(allDocs => {
          next(
            Object.assign({}, action, {
              payload: allDocs,
            })
          );
        })
        .catch(err => {
          next({
            type: ACTION_TYPES.UI_NOTIFICATION_NEW,
            payload: {
              type: 'warning',
              message: err.message,
            },
          });
        });
    }

    case ACTION_TYPES.PRODUCT_SAVE: {
      return saveDoc('products', action.payload)
        .then(newDocs => {
          next({
            type: ACTION_TYPES.PRODUCT_SAVE,
            payload: newDocs,
          });
          dispatch({
            type: ACTION_TYPES.UI_NOTIFICATION_NEW,
            payload: {
              type: 'success',
              message: 'Product Saved',
            },
          });
        })
        .catch(err => {
          next({
            type: ACTION_TYPES.UI_NOTIFICATION_NEW,
            payload: {
              type: 'warning',
              message: err.message,
            },
          });
        });
    }

    case ACTION_TYPES.PRODUCT_DELETE: {
      return deleteDoc('products', action.payload)
        .then(remainingDocs => {
          next({
            type: ACTION_TYPES.PRODUCT_DELETE,
            payload: remainingDocs,
          });
          dispatch({
            type: ACTION_TYPES.UI_NOTIFICATION_NEW,
            payload: {
              type: 'success',
              message: 'Product Deleted',
            },
          });
        })
        .catch(err => {
          next({
            type: ACTION_TYPES.UI_NOTIFICATION_NEW,
            payload: {
              type: 'warning',
              message: err.message,
            },
          });
        });
    }

    default: {
      return next(action);
    }
  }
};

export default ProductsMW;
