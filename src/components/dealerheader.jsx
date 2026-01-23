import React, { Component } from "react";
import auth from "../services/authService";
import { getDealerDetail } from "../services/dealerService";
import "typeface-roboto";

class DealerHeader extends Component {
  constructor(props) {
    super(props);
    this.state = { headerlogo: "/img/Maximal-Logo.png" };
  }

  async componentDidMount() {
    const user = auth.getCurrentUser();

    if (user && user.dealerId) {
      const { data: dealery } = await getDealerDetail(user.dealerId);

      //console.log("Dealer ", dealery);
      if (dealery.dealerlogo) {
        console.log ("got logo")
        const newlogo = dealery.dealerlogo;
        this.setState({ headerlogo: newlogo });
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <React.Fragment>
          <img
            src={this.state.headerlogo}
            alt=""
            style={{ width: 300, paddingTop: 90, paddingBottom: 40 }}
          />
        </React.Fragment>
      </React.Fragment>
    );
  }
}

export default DealerHeader;
