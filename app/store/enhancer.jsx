import { getAllDocs } from '../helpers/pouchDB';

// Retrieve Initial state from IndexDB
const getInitialState = () =>
  Promise.all([getAllDocs('contacts'), getAllDocs('invoices'), getAllDocs('products'), getAllDocs('list')])
    .then(values => ({
      contacts: values[0],
      invoices: values[1],
      products: values[2],
      list: values[3]
    }))
    .catch(err => console.log(err));

export { getInitialState };
