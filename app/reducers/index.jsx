import { combineReducers } from 'redux';
import UIReducer from './UIReducer';
import FormReducer from './FormReducer';
import InvoicesReducer from './InvoicesReducer';
import ContactsReducer from './ContactsReducer';
import ProductsReducer from './ProductsReducer';
import SettingsReducer from './SettingsReducer';
import ListReducer from './ListReducer';

export default combineReducers({
  ui: UIReducer,
  form: FormReducer,
  invoices: InvoicesReducer,
  contacts: ContactsReducer,
  products: ProductsReducer,
  list: ListReducer,
  settings: SettingsReducer,
});
