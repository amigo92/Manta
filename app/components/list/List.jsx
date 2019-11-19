// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Custom Components
import { TR, TD } from '../shared/Table';
import Button from '../shared/Button';

// Component
class List extends PureComponent {

  render() {
    const { list } = this.props;
    const firkino = list.list.reduce((a, b) => { 
      return String(a) + (a == '' ? '' : ',' )+ String(b.firkino)
    }, '')
    const billno = list.list.reduce((a, b) => { 
      return String(a) + (a == '' ? '' : ',' )+ String(b.invoiceID)
    }, '')
    const distance = list.list.reduce((a, b) => { 
      return Number(a) + Number(b.distance)
    },0)
    return (
      <TR>
        <TD bold>{firkino}</TD>
        <TD bold>{billno}</TD>
        <TD bold>{distance}</TD>

      </TR>
    );
  }
}

List.propTypes = {
};

export default List;
