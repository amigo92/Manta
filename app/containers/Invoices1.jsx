// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
const openDialog = require('../renderers/dialog.js');
const ipc = require('electron').ipcRenderer;
import { translate } from 'react-i18next';
import Pagination from 'react-js-pagination';
import SearchField from "react-search-field";
// Actions
import * as Actions from '../actions/invoices';

// Selectors
import { getInvoices } from '../reducers/InvoicesReducer';
import { getDateFormat } from '../reducers/SettingsReducer';

// Components
import Invoice from '../components/invoices/Invoice';
import Message from '../components/shared/Message';
import Button, { ButtonsGroup } from '../components/shared/Button';
import _withFadeInAnimation from '../components/shared/hoc/_withFadeInAnimation';
import {
  PageWrapper,
  PageHeader,
  PageHeaderTitle,
  PageHeaderActions,
  PageContent,
} from '../components/shared/Layout';
export class Invoices extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filter: null,
      activePage: 1,
      searchText: '',
    };
    this.editInvoice = this.editInvoice.bind(this);
    this.deleteInvoice = this.deleteInvoice.bind(this);
    this.duplicateInvoice = this.duplicateInvoice.bind(this);
    this.setInvoiceStatus = this.setInvoiceStatus.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.paginate = this.paginate.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }
  handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    this.setState({ activePage: pageNumber });
  }
  // Load Invoices & add event listeners
  componentDidMount() {
    // Add Event Listener
    ipc.on('confirmed-delete-invoice', (event, index, invoiceId) => {
      if (index === 0) {
        this.confirmedDeleteInvoice(invoiceId);
      }
    });
  }

  // Remove all IPC listeners when unmounted
  componentWillUnmount() {
    ipc.removeAllListeners('confirmed-delete-invoice');
  }

  // Open Confirm Dialog
  deleteInvoice(invoiceId) {
    const { t } = this.props;
    openDialog(
      {
        type: 'warning',
        title: t('dialog:deleteInvoice:title'),
        message: t('dialog:deleteInvoice:message'),
        buttons: [t('common:yes'), t('common:noThanks')],
      },
      'confirmed-delete-invoice',
      invoiceId
    );
  }

  // Confirm Delete an invoice
  confirmedDeleteInvoice(invoiceId) {
    const { dispatch } = this.props;
    dispatch(Actions.deleteInvoice(invoiceId));
  }

  // set the invoice status
  setInvoiceStatus(invoiceId, status) {
    const { dispatch } = this.props;
    dispatch(Actions.setInvoiceStatus(invoiceId, status));
  }

  editInvoice(invoice) {
    const { dispatch } = this.props;
    dispatch(Actions.editInvoice(invoice));
  }

  duplicateInvoice(invoice) {
    const { dispatch } = this.props;
    dispatch(Actions.duplicateInvoice(invoice));
  }

  setFilter(event) {
    const currentFilter = this.state.filter;
    const newFilter = event.target.dataset.filter;
    this.setState({ filter: currentFilter === newFilter ? null : newFilter });
  }
  paginate(array, page_size, page_number) {
    const page = page_number - 1; // because pages logically start with 1, but technically with 0
    return array.slice(page * page_size, (page + 1) * page_size);
  }
  onChange(value, event) { 
    console.log('onchange')
    console.log(value)
    console.log(event)
    if (value == '') {
      this.setState({searchText: ''})
    }
  }
  onSearchSubmit(value) { 
    console.log('search submit')
    console.log(value)
    this.setState({searchText: value})
  }
  // Render
  render() {
    const { dateFormat, invoices, t } = this.props;
    const { filter, searchText } = this.state;
    const filteredInvoices = filter
      ? invoices.filter(invoice => {
        const isFilterTrue = invoice.status === filter
        const includesSearchText = JSON.stringify(invoice).includes(searchText)
        return isFilterTrue && includesSearchText
      })
      : invoices.filter(invoice => {
        const includesSearchText = JSON.stringify(invoice).includes(searchText)
        return includesSearchText
      });
    const paginatedInvoices = this.paginate(
      filteredInvoices,
      4,
      this.state.activePage
    );
    const invoicesComponent = paginatedInvoices.map((invoice, index) => (
      <Invoice
        key={invoice._id}
        dateFormat={dateFormat}
        deleteInvoice={this.deleteInvoice}
        duplicateInvoice={this.duplicateInvoice}
        editInvoice={this.editInvoice}
        setInvoiceStatus={this.setInvoiceStatus}
        index={index}
        invoice={invoice}
        t={t}
      />
    ));
    // Filter Buttons
    const statuses = ['paid', 'pending', 'refunded', 'cancelled'];
    const filterButtons = statuses.map(status => (
      <Button
        key={`${status}-button`}
        active={filter === status}
        data-filter={status}
        onClick={this.setFilter}
      >
        {t(`invoices:status:${status}`)}
      </Button>
    ));
    
    return (
      <PageWrapper>
        <PageHeader>
          <PageHeaderTitle>{t('invoices:header:name')}</PageHeaderTitle>
          <PageHeaderActions>
            <div
              style={{ alignSelf: 'center', marginRight: 20 }}
            >
              <SearchField
                placeholder="Search..."
                onChange={this.onChange}
                classNames="test-class"
                onSearchClick={this.onSearchSubmit}
              />
            </div>
            <div
              style={{ alignSelf: 'center', marginTop: 15, marginRight: 20 }}
            >
              <Pagination
                activePage={this.state.activePage}
                itemsCountPerPage={4}
                totalItemsCount={filteredInvoices.length}
                innerClass='pagination'
                itemClass='itemClass'
                activeLinkClass='activeItemClass'
                pageRangeDisplayed={5}
                // eslint-disable-next-line react/jsx-no-bind
                onChange={this.handlePageChange.bind(this)}
              />
            </div>
            <i className="ion-funnel" />
            <ButtonsGroup>{filterButtons}</ButtonsGroup>
          </PageHeaderActions>
        </PageHeader>
        <PageContent bare>
          {invoices.length === 0 ? (
            <Message info text={t('messages:noInvoice')} />
          ) : (
            <div className="row">{invoicesComponent}</div>
          )}
        </PageContent>
      </PageWrapper>
    );
  }
}

// PropTypes Validation
Invoices.propTypes = {
  dispatch: PropTypes.func.isRequired,
  invoices: PropTypes.arrayOf(PropTypes.object).isRequired,
  t: PropTypes.func.isRequired,
};

// Map state to props & Export
const mapStateToProps = state => ({
  invoices: getInvoices(state),
  dateFormat: getDateFormat(state),
});

export default compose(
  connect(mapStateToProps),
  translate(),
  _withFadeInAnimation
)(Invoices);
