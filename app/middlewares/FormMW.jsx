// Node Libs
const appConfig = require('electron').remote.require('electron-settings');
import uuidv4 from 'uuid/v4';
import i18n from '../../i18n/i18n';

// Actions Verbs
import * as ACTION_TYPES from '../constants/actions.jsx';

// Actions
import * as FormActions from '../actions/form';
import * as InvoicesActions from '../actions/invoices';
import * as ContactsActions from '../actions/contacts';
import * as SettingsActions from '../actions/settings';
import * as UIActions from '../actions/ui';

// Helper
import { getInvoiceData, validateFormData } from '../helpers/form';

const FormMW = ({ dispatch, getState }) => next => action => {
  switch (action.type) {
    case ACTION_TYPES.FORM_SAVE: {
      const currentFormData = { ...getState().form, rows:getState().form.rows.filter(f => f.description != '') };
      // Validate Form Data
      if (!validateFormData(currentFormData)) return;
      const currentInvoiceData = getInvoiceData(currentFormData);
      // UPDATE DOC
      if (currentFormData.settings.editMode.active) {
        // Update existing invoice
        dispatch(InvoicesActions.updateInvoice(currentInvoiceData));
        // Change Tab to invoices
        dispatch(UIActions.changeActiveTab('invoices'));
      } else {
        // CREATE DOC
        dispatch(InvoicesActions.saveInvoice(currentInvoiceData));
      }
      // Save Contact to DB if it's a new one
      if (currentFormData.recipient.newRecipient) {
        const newContactData = currentInvoiceData.recipient;
        dispatch(ContactsActions.saveContact(newContactData));
      }
      // Clear The Form
      dispatch(FormActions.clearForm(null, true));
      break;
    }

    case ACTION_TYPES.FORM_ITEM_ADD: {
      const form = getState().form
      const rows = form.rows
      form.subtotal = 0
      form.grandTotal = 0
      if (rows.length > 0) {
        for (var i = 0; i < rows.length; i++) { 
          rows[i].subtotal = + rows[i].quantity * rows[i].price;
          form.grandTotal =+ rows[i].quantity*rows[i].price;
          if (rows[i].description === action.payload.description) { 
            const newRow = {...rows[i], quantity: rows[i].quantity + 1}
            dispatch(FormActions.updateItem(newRow));
            return
          }
        }
      }
      return next(
        Object.assign({}, action, {
          payload: { id: action.payload && action.payload._id ?  action.payload._id : uuidv4(), description:action.payload && action.payload.description ?  action.payload.description : "", price:action.payload && action.payload.price ?  action.payload.price : "", quantity: action.payload && action.payload.quantity ?  action.payload.quantity : "" },
        })
      );
    }

    case ACTION_TYPES.FORM_CLEAR: {
      // Close Setting Panel
      dispatch(FormActions.closeFormSettings());
      // Clear The Form
      next(action);
      // Create An item
      dispatch(FormActions.addItem());
      break;
    }

    case ACTION_TYPES.SAVED_FORM_SETTING_UPDATE: {
      // Save setting to DB
      const { setting, data } = action.payload;
      appConfig.set(`invoice.${setting}`, data);
      // Dispatch notification
      dispatch({
        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
        payload: {
          type: 'success',
          message: i18n.t('messages:settings:saved'),
        },
      });
      // Pass new data to action and continue
      next({
        type: ACTION_TYPES.SAVED_FORM_SETTING_UPDATE,
        payload: appConfig.get('invoice'),
      });
      // Reload app settings so that
      // Settings tab will have up-to-date information
      dispatch(SettingsActions.getInitalSettings());
      break;
    }

    default: {
      return next(action);
    }
  }
};

export default FormMW;
