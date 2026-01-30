import React, { Component } from "react";
import { Link } from "react-router-dom";
import ForkliftImg from "./forkliftimg";
import { getOrderDetail } from "../services/ordersService";
import auth from "../services/authService";

class OrderDetail extends Component {
  state = {
    user: null
  };

  async componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });

    const handle = this.props.match.params._id;
    const { data: forky } = await getOrderDetail(handle);

    this.setState({
      model: forky.model,
      price: forky.price,
      markup: forky.markup,
      saving: forky.saving,
      offerprice: forky.offerprice,
      hasDiscount: forky.hasDiscount,
      discountPercentage: forky.discountPercentage,
      discountAmount: forky.discountAmount,
      discountedPrice: forky.discountedPrice,
      ponumber: forky.ponumber,
      capacity: forky.capacity,
      engtype: forky.engtype,
      powertrain: forky.powertrain,
      imgName: forky.imgname,
      masttype: forky.masttype,
      mastsize: forky.mastsize,
      closedheight: forky.closedheight,
      freeliftheight: forky.freeliftheight,
      forks: forky.forks,
      valve: forky.valve,
      sideshift: forky.sideshift,
      forkpositioner: forky.forkpositioner,
      pincode: forky.pincode,
      displaywithcamera: forky.displaywithcamera,
      liftybutton: forky.liftybutton,
      roller: forky.roller,
      controller: forky.controller,
      safetybluespot: forky.safetybluespot,
      tyre: forky.tyre,
      coldstoreprot: forky.coldstoreprot,
      seat: forky.seat,
      cabin: forky.cabin,
      aircon: forky.aircon,
      heater: forky.heater,
      reargrab: forky.reargrab,
      sideleverhydraulic: forky.sideleverhydraulic,
      battery: forky.battery,
      charger: forky.charger,
      spare: forky.spare,
      armguard: forky.armguard,
      platform: forky.platform,
      loadbackrest: forky.loadbackrest,
      steering: forky.steering,
      fork2d: forky.fork2d,
      bfs: forky.bfs,
      trolley: forky.manualtrolley,
      blinkey: forky.blinkey,
      sideextractionbattery: forky.sideextractionbattery,
    });
  }

  getUserInitials(fullname) {
    if (!fullname) return "U";
    const names = fullname.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return fullname.substring(0, 2).toUpperCase();
  }

  render() {
    const { user } = this.state;
    if (!user) return <p>Loading...</p>;

    const isAdmin = user.isAdmin;
    const ConditionalWrapper = ({ condition, wrapper, children }) =>
      condition ? wrapper(children) : null;

    return (
      <div className="page-container">
        {/* Header */}
        <header className="header">
          <div className="header-logo">
            <img src="/img/logo-black.png" alt="Maximal Forklifts UK" style={{ height: '40px' }} />
          </div>
          <nav className="header-nav">
            <a href="https://maximalforklift.co.uk" className="header-link" target="_blank" rel="noopener noreferrer">
              Main Site
            </a>
            <div className="header-user">
              <div className="header-user-info">
                <p className="header-user-name">{user.fullname || user.email}</p>
                <p className={`header-user-role ${isAdmin ? 'admin' : ''}`}>
                  {isAdmin ? 'Administrator' : user.isMaximGB ? 'Maximal GB' : 'Dealer'}
                </p>
              </div>
              <div className="header-avatar">
                {this.getUserInitials(user.fullname || user.email)}
              </div>
              <Link to="/logout" className="btn-icon btn-ghost" title="Sign out">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </Link>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <Link to="/configurator/orders" className="back-link">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </Link>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 className="page-title" style={{ margin: 0 }}>{this.state.model}</h2>
              {this.state.ponumber && (
                <span className="badge badge-success" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                  PO: {this.state.ponumber}
                </span>
              )}
            </div>
            
            {this.state.imgName && this.state.imgName.length > 0 ? (
              <div style={{ marginBottom: '1.5rem' }}>
                <ForkliftImg imgName={this.state.imgName} />
              </div>
            ) : null}

            <div style={{ fontSize: '0.9375rem', lineHeight: '1.75', color: 'var(--color-gray-700)' }}>
              {this.state.engtype ? (this.state.engtype + " ") : null}
              
              <ConditionalWrapper condition={this.state.powertrain} wrapper={(children) => <>{children}</>}>
                {this.state.powertrain}<br />
              </ConditionalWrapper>

              Capacity : {this.state.capacity}Kg 
              <ConditionalWrapper condition={this.state.loadcenter} wrapper={(children) => <>{children}</>}>
                {this.state.loadcenter ? " @" + this.state.loadcenter + "mm LC" : null}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.masttype} wrapper={(children) => <><br />{children}</>}>
                {this.state.masttype}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.mastsize} wrapper={(children) => <>{children}</>}>
                {" " + this.state.mastsize + "mm"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.closedheight} wrapper={(children) => <>{children}</>}>
                {"," + this.state.closedheight + "mm Closed"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.freeliftheight} wrapper={(children) => <>{children}</>}>
                {"," + this.state.freeliftheight + "mm Free Lift"}
              </ConditionalWrapper>

              <br />

              <ConditionalWrapper condition={this.state.forks} wrapper={(children) => <>{children}</>}>
                {this.state.forks + "mm Forks, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.fork2d} wrapper={(children) => <><br />{children}</>}>
                {this.state.fork2d + "mm Forks"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.valve} wrapper={(children) => <><br />{children}</>}>
                {this.state.valve + " Valve"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.sideshift} wrapper={(children) => <><br />{children}</>}>
                {this.state.sideshift + " Side Shift"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.forkpositioner} wrapper={(children) => <><br />{children}</>}>
                {"Sideshifting Fork Positioner"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.sideleverhydraulic} wrapper={(children) => <><br />{children}</>}>
                {"Side Lever Hydraulic"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.controller} wrapper={(children) => <><br />{children}</>}>
                {this.state.controller + " Controller"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.pincode} wrapper={(children) => <><br />{children}</>}>
                {"Pincode"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.displaywithcamera} wrapper={(children) => <><br />{children}</>}>
                {"Display with Camera"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.liftybutton} wrapper={(children) => <><br />{children}</>}>
                {"2 Sided Lifty Button"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.roller} wrapper={(children) => <><br />{children}</>}>
                {this.state.roller + " Roller"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.coldstoreprot} wrapper={(children) => <><br />{children}</>}>
                {"Cold Store Protection"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.tyre} wrapper={(children) => <><br />{children}</>}>
                {this.state.tyre + " Tyres"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.aircon} wrapper={(children) => <><br />{children}</>}>
                {"Air Con"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.heater} wrapper={(children) => <><br />{children}</>}>
                {"Heater"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.reargrab} wrapper={(children) => <><br />{children}</>}>
                {"Rear Grab Handle"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.safetybluespot} wrapper={(children) => <><br />{children}</>}>
                {"Safety Blue Spot"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.battery} wrapper={(children) => <><br />{children}</>}>
                {this.state.battery + " Battery"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.charger} wrapper={(children) => <><br />{children}</>}>
                {this.state.charger + " Charger"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.spare} wrapper={(children) => <><br />{children}</>}>
                {this.state.spare + " Spare Battery"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.bfs} wrapper={(children) => <><br />{children}</>}>
                {"BFS"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.trolley} wrapper={(children) => <><br />{children}</>}>
                {"Trolley"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.blinkey} wrapper={(children) => <><br />{children}</>}>
                {"Blinkey"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.sideextractionbattery} wrapper={(children) => <><br />{children}</>}>
                {"Side Extraction Battery"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.armguard} wrapper={(children) => <><br />{children}</>}>
                {"Arm Guard"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.platform} wrapper={(children) => <><br />{children}</>}>
                {"Platform"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.loadbackrest} wrapper={(children) => <><br />{children}</>}>
                {"Load Back Rest"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.steering} wrapper={(children) => <><br />{children}</>}>
                {"Electric Steering"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.seat} wrapper={(children) => <><br />{children}</>}>
                {this.state.seat + " Seat"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.cabin} wrapper={(children) => <><br />{children}</>}>
                {this.state.cabin + " Cabin"}
              </ConditionalWrapper>

              <br />

              {this.state.engtype !== "Warehouse" ? (
                <>OPS Safety System, Amber Beacon, Reverse Alarm<br /></>
              ) : null}

              {this.state.engtype === "Electric" ? (
                <>Rear Grab Handle with Horn<br /></>
              ) : null}

              {(this.state.engtype === "Diesel" && this.state.capacity < 6000) ? (
                <>Rear Grab Handle with Horn<br /></>
              ) : null}

              {(this.state.engtype === "Diesel") ? (
                <>Upswept Exhaust<br /></>
              ) : null}

              {this.state.engtype === "LPG" ? (
                <>Rear Grab Handle with Horn<br /></>
              ) : null}

              {this.state.engtype === "LPG" ? (
                <>Upswept Exhaust<br /></>
              ) : null}

              {this.state.engtype !== "Warehouse" ? (
                <>Full LED Lighting<br /></>
              ) : null}
            </div>

            <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--color-gray-50)', borderRadius: 'var(--border-radius-lg)' }}>
              <p style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--color-gray-800)', marginBottom: '1rem' }}>
                Order Price: £{(this.state.price + parseInt(this.state.markup)).toLocaleString()}
              </p>

              {this.state.hasDiscount ? (
                <div style={{ marginTop: '0.75rem' }}>
                  <p style={{ color: 'var(--color-success)', marginBottom: '0.5rem' }}>
                    Discount {(this.state.discountPercentage * 100) % 1 === 0 
                      ? (this.state.discountPercentage * 100).toFixed(0) 
                      : (this.state.discountPercentage * 100).toFixed(1)}%: £{this.state.discountAmount.toLocaleString()}
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                    Order Discounted Price: £{(this.state.discountedPrice + parseInt(this.state.markup)).toLocaleString()}
                  </p>
                </div>
              ) : null}

              {!this.state.hasDiscount && this.state.saving ? (
                <div style={{ marginTop: '0.75rem' }}>
                  <p style={{ color: 'var(--color-success)', marginBottom: '0.5rem' }}>
                    Saving: £{this.state.saving.toLocaleString()}
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                    Order Offer Price: £{(this.state.offerprice + parseInt(this.state.markup)).toLocaleString()}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <p className="footer-text">© 2026 Maximal UK - Dealer Portal</p>
            <a href="https://maximalforklift.co.uk" className="footer-link" target="_blank" rel="noopener noreferrer">
              maximalforklift.co.uk
            </a>
          </div>
        </footer>
      </div>
    );
  }
}

export default OrderDetail;
