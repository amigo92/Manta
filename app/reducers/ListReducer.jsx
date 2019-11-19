import { handleActions, combineActions } from 'redux-actions';
import { createSelector } from 'reselect';
import * as Actions from '../actions/list';

const ListReducer = handleActions(
  {
    [combineActions(
      Actions.getAllList,
      Actions.saveList,
      Actions.deleteList
    )]: (state, action) => action.payload ? action.payload : [],
  },
  []
);

export default ListReducer;

// Selector
const getListState = state => state.list;
export const getList = createSelector(
  getListState,
  list => list
);
