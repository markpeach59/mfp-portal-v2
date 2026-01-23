import React from "react";

const Offer = props => {
    const { hasDiscount, discountedPrice, discountAmount, discountPercentage } = props;

    // Don't render anything if there's no discount
    if (!hasDiscount || !discountedPrice) {
      return null;
    }

    return (
      <React.Fragment>
        <div>
          {(discountPercentage * 100).toFixed(1)}% Saving : £{discountAmount}<br />
          Offer Price : £{discountedPrice}
        </div>
      </React.Fragment>
    );
};

export default Offer;