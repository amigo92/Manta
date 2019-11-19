// Libraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Custom Components
import Form from '../../containers/Form1';
import Invoices from '../../containers/Invoices1';
import Contacts from '../../containers/Contacts';
import Settings from '../../containers/Settings';

// Layout
import { AppMainContent } from '../shared/Layout';
import Products from '../../containers/Products';
import List from '../../containers/List.jsx';

class AppMain extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.activeTab !== nextProps.activeTab;
  }

  render() {
    const { activeTab } = this.props;
    return (
      <AppMainContent>
        {activeTab === 'form' && <Form />}
        {activeTab === 'invoices' && <Invoices />}
        {activeTab === 'contacts' && <Contacts />}
        {activeTab === 'products' && <Products />}
        {activeTab === 'list' && <List />}
        {activeTab === 'settings' && <Settings />}
      </AppMainContent>
    );
  }
}

AppMain.propTypes = {
  activeTab: PropTypes.string.isRequired,
};

export default AppMain;
