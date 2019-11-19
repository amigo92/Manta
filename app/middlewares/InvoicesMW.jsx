// Node Libs
import uuidv4 from 'uuid/v4';
import currencies from '../../libs/currencies.json';
const appConfig = require('electron').remote.require('electron-settings');
const ipc = require('electron').ipcRenderer;
import i18n from '../../i18n/i18n';

// Actions & Verbs
import * as ACTION_TYPES from '../constants/actions.jsx';
import * as UIActions from '../actions/ui';
import * as FormActions from '../actions/form';

// Helpers
import { getInvoiceValue } from '../helpers/invoice';
import { getAllDocs, getSingleDoc, saveDoc, deleteDoc, updateDoc, updateDocById, deleteDocById } from '../helpers/pouchDB';


const InvoicesMW = ({ dispatch, getState }) => next => action => {
  switch (action.type) {
    case ACTION_TYPES.INVOICE_NEW_FROM_CONTACT: {
      // Change Tab to Form
      next(UIActions.changeActiveTab('form'));
      // Update Recipient Data
      dispatch(
        FormActions.updateRecipient({
          new: {},
          select: action.payload,
          newRecipient: false,
        })
      );
      break;
    }

    case ACTION_TYPES.INVOICE_GET_ALL: {
      return getAllDocs('invoices')
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

    case ACTION_TYPES.INVOICE_SAVE: {
      // Save doc to db
      return saveDoc('invoices', action.payload)
        .then(newDocs => {
          next({
            type: ACTION_TYPES.INVOICE_SAVE,
            payload: newDocs,
          });
          const { invoices } = getState()
          for (let i = invoices.length - 1; i >= 0; i--) { 
            console.log(invoices[i])
          }
          // getAllDocs('listCreator')
          //   .then(allDocs => {

              
              // if (allDocs.length) {
                saveDoc('listCreator', action.payload).then(presentLists => {
                  let listRowsArray = []
                  let valuer = 0
                  let docs = [...presentLists]
                  let breaker = false
                  for (var i = 0; i < docs.length; i++) {
                    const doc = docs[i]
                    for (var j = 0; j < doc.rows.length; j++) {
                      const row = doc.rows[j]
                      if (row.firkino != undefined && row.firkino != '') {
                        row.distance = getState().products.filter(p =>  row.description == p.description)[0].distance
                        listRowsArray.push({ id: row.id, firkino: row.firkino, distance: row.distance, invoiceID: Number(doc.invoiceID) })
                        doc.rows.splice(j, 1)
                        j -= 1
                        valuer += row.distance
                        if (valuer >= 5000 && valuer <= 5500) {
                          breaker = true
                        }
                        if (breaker) {
                          break
                        }
                      }
                      console.log(doc)
                    }
                    if (!doc.rows.filter(r => typeof r.firkino == 'number' ).length) {
                      docs.splice(i, 1)
                      i -= 1
                    }
                    if (valuer >= 5000 && valuer <= 5500) {
                      breaker = true
                    }
                    console.log(listRowsArray)
                    if (breaker) {
                      break
                    }
                  }
                  if (breaker) {
                    saveDoc('list', { list: listRowsArray,         
                      created_at: Date.now(),
                      _id: uuidv4(),
                      _rev: null,
                    })
                    let deletedDocs = presentLists.filter(pL => { 
                      return !docs.some(d => d._id == pL._id)
                    })
                    console.log(deletedDocs)
                    const deleteDocsFromDb = async (docs) => {
                      for (var i = 0; i < docs.length; i++) {
                        const doc = docs[i]
                        try {
                          await deleteDocById('listCreator', doc._id)
                        }
                        catch (e) { 
                          console.log(e)
                        }
                      }
                    }
                    const updateDocsFromDb = async (docs) => {
                      for (var i = 0; i < docs.length; i++) {
                        const doc = docs[i]
                        try {
                          await updateDocById('listCreator', doc._id,doc)
                        }
                        catch (e) { 
                          console.log(e)
                        }
                      }
                    }
                    deleteDocsFromDb(deletedDocs)
                    updateDocsFromDb(docs)
                    // deletedDocs.map(pL => deleteDoc('listCreator', pL))
                    // docs.map(d => updateDoc('listCreator',d))
                  }
                })
              // }
              // else { 
              //   saveDoc('listCreator', action.payload).then(presentLists => {
              //     console.log(presentLists)
              //   })
              // }
              
        // })
          dispatch({
            type: ACTION_TYPES.UI_NOTIFICATION_NEW,
            payload: {
              type: 'success',
              message: i18n.t('messages:invoice:saved'),
            },
          });
          // Preview Window
          ipc.send('preview-invoice', action.payload);
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

    case ACTION_TYPES.INVOICE_EDIT: {
      // Continue
      return getAllDocs('contacts')
        .then(allDocs => {
          next(
            Object.assign({}, action, {
              payload: Object.assign({}, action.payload, {
                contacts: allDocs
              })
            })
          );
          // Change Tab to Form
          dispatch(UIActions.changeActiveTab('form'));
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

    case ACTION_TYPES.INVOICE_DELETE: {
      return deleteDoc('invoices', action.payload)
        .then(remainingDocs => {
          next({
            type: ACTION_TYPES.INVOICE_DELETE,
            payload: remainingDocs,
          });
          // Send Notification
          dispatch({
            type: ACTION_TYPES.UI_NOTIFICATION_NEW,
            payload: {
              type: 'success',
              message: i18n.t('messages:invoice:deleted'),
            },
          });
          // Clear form if this invoice is being editted
          const { editMode } = getState().form.settings;
          if (editMode.active) {
            if (editMode.data._id === action.payload) {
              dispatch({ type: ACTION_TYPES.FORM_CLEAR });
            }
          }
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

    case ACTION_TYPES.INVOICE_DUPLICATE: {
      const duplicateInvoice = Object.assign({}, action.payload, {
        created_at: Date.now(),
        _id: uuidv4(),
        _rev: null,
      })
      return dispatch({
        type: ACTION_TYPES.INVOICE_SAVE,
        payload: duplicateInvoice,
      });
    }

    case ACTION_TYPES.INVOICE_UPDATE: {
      return updateDoc('invoices', action.payload)
        .then(docs => {
          next({
            type: ACTION_TYPES.INVOICE_UPDATE,
            payload: docs,
          });
          dispatch({
            type: ACTION_TYPES.UI_NOTIFICATION_NEW,
            payload: {
              type: 'success',
              message: i18n.t('messages:invoice:updated'),
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

    case ACTION_TYPES.INVOICE_CONFIGS_SAVE: {
      const { invoiceID, configs } = action.payload;
      return getSingleDoc('invoices', invoiceID)
        .then(doc => {
          dispatch({
            type: ACTION_TYPES.INVOICE_UPDATE,
            payload: Object.assign({}, doc, {configs})
          })
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

    case ACTION_TYPES.INVOICE_SET_STATUS: {
      const { invoiceID, status } = action.payload;
      return getSingleDoc('invoices', invoiceID)
        .then(doc => {
          dispatch({
            type: ACTION_TYPES.INVOICE_UPDATE,
            payload: Object.assign({}, doc, { status })
          })
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

export default InvoicesMW;
