// Node Libs
import uuidv4 from 'uuid/v4';

// Actions Verbs
import * as ACTION_TYPES from '../constants/actions.jsx';

// Helpers
import { getAllDocs, saveDoc, deleteDoc } from '../helpers/pouchDB';
import i18n from '../../i18n/i18n';

const ListMW = ({ dispatch }) => next => action => {
  switch (action.type) {
    case ACTION_TYPES.LIST_GET_ALL: {
      return getAllDocs('list')
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
    case ACTION_TYPES.CREATOR_LIST_GET_ALL: {
      return getAllDocs('listCreator')
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
    
    case ACTION_TYPES.LIST_SAVE: {
      return saveDoc('list', action.payload)
        .then(newDocs => {
          next({
            type: ACTION_TYPES.LIST_SAVE,
            payload: newDocs,
          });
          dispatch({
            type: ACTION_TYPES.CREATOR_LIST_GET_ALL
          })
          dispatch({
            type: ACTION_TYPES.UI_NOTIFICATION_NEW,
            payload: {
              type: 'success',
              message: 'List Saved',
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

    case ACTION_TYPES.LIST_DELETE: {
      return deleteDoc('list', action.payload)
        .then(remainingDocs => {
          next({
            type: ACTION_TYPES.LIST_DELETE,
            payload: remainingDocs,
          });
          dispatch({
            type: ACTION_TYPES.UI_NOTIFICATION_NEW,
            payload: {
              type: 'success',
              message: 'List Deleted',
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

export default ListMW;
