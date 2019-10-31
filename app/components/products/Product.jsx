// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Custom Components
import { TR, TD } from '../shared/Table';
import Button from '../shared/Button';

// Component
class Product extends PureComponent {
  constructor(props) {
    super(props);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  deleteProduct() {
    const { product, deleteProduct } = this.props;
    deleteProduct(product._id);
  }

  render() {
    const { product } = this.props;
    return (
      <TR>
        <TD bold>{product.description}</TD>
        <TD>{product.isReel}</TD>
        <TD>{product.price}</TD>
        <TD>{product.distance}</TD>
        <TD actions>
          <Button link danger onClick={this.deleteProduct}>
            <i className="ion-close-circled" />
          </Button>
        </TD>
      </TR>
    );
  }
}

Product.propTypes = {
};

export default Product;
