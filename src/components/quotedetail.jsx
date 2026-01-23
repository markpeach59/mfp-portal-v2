import React, { Component } from "react";
import { Link } from "react-router-dom";
import ForkliftImg from "./forkliftimg";
import {
  getQuoteDetail,
  createOrderFromQuote,
  saveMarkup
} from "../services/quotesService";
import Markup from "./markup";
import Generateorder from "./generateorder";
import auth from "../services/authService";

class QuoteDetail extends Component {
  state = {
    user: null
  };

  async componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });

    const handle = this.props.match.params._id;
    const { data: forky } = await getQuoteDetail(handle);

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
      capacity: forky.capacity,
      engtype: forky.engtype,
      powertrain: forky.powertrain,
      modelseries: forky.modelseries,
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
      precleaner: forky.precleaner,
      heavydutyairfilter: forky.heavydutyairfilter,
      halolight: forky.halolight,
      upsweptexhaust: forky.upsweptexhaust,
      tiltfunction: forky.tiltfunction,
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
      stabiliser: forky.stabiliser,
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

  handleMarkup = async (markup) => {
    this.setState({ markup });
    const handle = this.props.match.params._id;
    try {
      await saveMarkup(handle, markup);
    } catch(error) {
      // Error handling
    }
  };

  handleCreateOrder = async (ponumber) => {
    const handle = this.props.match.params._id;
    
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    try {
      await createOrderFromQuote(handle, ponumber);
      await delay(2000);
      window.location = "/orderdetail/" + handle;
    } catch (error) {
      console.log("did not create order", handle);
    }
  };

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
            <a href="https://maximal.tlhdev.co.uk" className="header-link" target="_blank" rel="noopener noreferrer">
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
          <Link to="/configurator/quotes" className="back-link">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Quotes
          </Link>

          <div className="card">
            <h2 className="page-title">{this.state.model}</h2>
            
            {this.state.imgName && this.state.imgName.length > 0 ? (
              <div style={{ marginBottom: '1.5rem' }}>
                <ForkliftImg imgName={this.state.imgName} />
              </div>
            ) : null}

            <div style={{ fontSize: '0.9375rem', lineHeight: '1.75', color: 'var(--color-gray-700)' }}>
              {this.state.engtype ? (this.state.engtype + " ") : null} 
              
              <ConditionalWrapper
                condition={this.state.powertrain}
                wrapper={(children) => <>{children}</>}
              >
                {this.state.powertrain}
                {this.state.modelseries && this.state.powertrain ? " - " + this.state.modelseries : ""}
                {" "}
              </ConditionalWrapper>

              Capacity : {this.state.capacity}Kg 
              <ConditionalWrapper
                condition={this.state.loadcenter}
                wrapper={(children) => <>{children}</>}
              >
                {this.state.loadcenter ? " @" + this.state.loadcenter + "mm LC" : null}
              </ConditionalWrapper>

              <br />

              <ConditionalWrapper condition={this.state.masttype} wrapper={(children) => <>{children}</>}>
                {this.state.masttype + " "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.mastsize} wrapper={(children) => <>{children}</>}>
                {this.state.mastsize + "mm"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.closedheight} wrapper={(children) => <>{children}</>}>
                {"," + this.state.closedheight + "mm Closed"}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.freeliftheight} wrapper={(children) => <>{children}</>}>
                {"," + this.state.freeliftheight + "mm Free Lift"}
              </ConditionalWrapper>

              <ConditionalWrapper
                condition={this.state.valve || this.state.forks || this.state.fork2d || this.state.sideshift || this.state.forkpositioner}
                wrapper={(children) => <><br /></>}
              >
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.valve} wrapper={(children) => <>{children}</>}>
                {this.state.valve + " Valve, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.forks} wrapper={(children) => <>{children}</>}>
                {this.state.forks + "mm Forks, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.fork2d} wrapper={(children) => <>{children}</>}>
                {this.state.fork2d + "mm Forks, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.sideshift} wrapper={(children) => <>{children}</>}>
                {this.state.sideshift + " Side Shift, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.sideshift === ""} wrapper={(children) => <>{children}</>}>
                {"Side Shift, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.forkpositioner} wrapper={(children) => <>{children}</>}>
                {"Sideshifting Fork Positioner, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.sideleverhydraulic} wrapper={(children) => <>{children}</>}>
                {"Side Lever Hydraulic, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.controller} wrapper={(children) => <>{children}</>}>
                {this.state.controller + " Controller, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.pincode} wrapper={(children) => <>{children}</>}>
                {"Pincode, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.displaywithcamera} wrapper={(children) => <>{children}</>}>
                {"Display with Camera, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.liftybutton} wrapper={(children) => <>{children}</>}>
                {"2 Sided Lifty Button, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.roller} wrapper={(children) => <>{children}</>}>
                {this.state.roller + " Roller, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.stabiliser} wrapper={(children) => <>{children}</>}>
                {"Stabiliser Caster Wheel, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.coldstoreprot} wrapper={(children) => <>{children}</>}>
                {"Cold Store Protection, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.tyre} wrapper={(children) => <>{children}</>}>
                {this.state.tyre + " Tyres"}
              </ConditionalWrapper>

              <br />

              <ConditionalWrapper condition={this.state.battery} wrapper={(children) => <>{children}</>}>
                {this.state.battery + " Battery, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.charger} wrapper={(children) => <>{children}</>}>
                {this.state.charger + " Charger, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.spare} wrapper={(children) => <>{children}</>}>
                {this.state.spare + " Spare Battery, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.bfs} wrapper={(children) => <>{children}</>}>
                {"BFS, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.trolley} wrapper={(children) => <>{children}</>}>
                {"Trolley, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.blinkey} wrapper={(children) => <>{children}</>}>
                {"Blinkey, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.sideextractionbattery} wrapper={(children) => <>{children}</>}>
                {"Side Extraction Battery, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.armguard} wrapper={(children) => <>{children}</>}>
                {"Arm Guard, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.platform} wrapper={(children) => <>{children}</>}>
                {"Platform, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.loadbackrest} wrapper={(children) => <>{children}</>}>
                {"Load Backrest, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.steering} wrapper={(children) => <>{children}</>}>
                {"Electric Steering, "}
              </ConditionalWrapper>

              <ConditionalWrapper
                condition={this.state.safetybluespot || this.state.seat || this.state.cabin || this.state.aircon || this.state.heater}
                wrapper={(children) => <><br /></>}
              >
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.halolight} wrapper={(children) => <>{children}</>}>
                {"Halo Light, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.safetybluespot} wrapper={(children) => <>{children}</>}>
                {"Safety Blue Spot, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.tiltfunction} wrapper={(children) => <>{children}</>}>
                {"Tilt Function, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.seat} wrapper={(children) => <>{children}</>}>
                {this.state.seat + " Seat, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.cabin} wrapper={(children) => <>{children}</>}>
                {this.state.cabin + ", "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.aircon} wrapper={(children) => <>{children}</>}>
                {"Air Con, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.heater} wrapper={(children) => <>{children}</>}>
                {"Heater, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.upsweptexhaust} wrapper={(children) => <>{children}</>}>
                {"Upswept Exhaust, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.precleaner} wrapper={(children) => <>{children}</>}>
                {"Pre Cleaner, "}
              </ConditionalWrapper>

              <ConditionalWrapper condition={this.state.heavydutyairfilter} wrapper={(children) => <>{children}</>}>
                {"Heavy Duty Air Filter, "}
              </ConditionalWrapper>

              <br />

              {this.state.engtype !== "Warehouse" ? (
                <>OPS Safety System, Amber Beacon, Reverse Alarm</>
              ) : null}

              {this.state.engtype === "Electric" ? (
                <>, Rear Grab Handle with Horn</>
              ) : null}

              {(this.state.engtype === "Diesel" && this.state.capacity < 6000) ? (
                <>, Rear Grab Handle with Horn</>
              ) : null}

              {(this.state.engtype === "Diesel") ? (
                <>, Upswept Exhaust</>
              ) : null}

              {this.state.engtype === "LPG" ? (
                <>, Rear Grab Handle with Horn</>
              ) : null}

              {this.state.engtype === "LPG" ? (
                <>, Upswept Exhaust</>
              ) : null}

              {this.state.engtype !== "Warehouse" ? (
                <>, Full LED Lighting</>
              ) : null}
            </div>

            <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--color-gray-50)', borderRadius: 'var(--border-radius-lg)' }}>
              <p style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--color-gray-800)', marginBottom: '1rem' }}>
                Quote Full Price: £{(this.state.price + parseInt(this.state.markup)).toLocaleString()}
              </p>

              {this.state.hasDiscount ? (
                <div style={{ marginTop: '0.75rem' }}>
                  <p style={{ color: 'var(--color-success)', marginBottom: '0.5rem' }}>
                    Discount {(this.state.discountPercentage * 100) % 1 === 0 
                      ? (this.state.discountPercentage * 100).toFixed(0) 
                      : (this.state.discountPercentage * 100).toFixed(1)}%: £{this.state.discountAmount.toLocaleString()}
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                    Quote Discounted Price: £{(this.state.discountedPrice + parseInt(this.state.markup)).toLocaleString()}
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

              <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginTop: '1rem' }}>
                <strong>Or on a 5 year contract Hire at £ per week<br />
                3 year lease purchase at £ per week</strong>
              </p>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Generateorder onOrderCreate={this.handleCreateOrder} />
              <Markup currentMarkup={this.state.markup} onMarkup={this.handleMarkup} />
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

export default QuoteDetail;
