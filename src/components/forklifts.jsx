import React, { Component } from "react";
import { Link } from "react-router-dom";
import auth from "../services/authService";
import { getDealerDetail } from "../services/dealerService";
import { getForklifts } from "../services/forkliftsService";
import { getEngTypes } from "../services/fakeEngTypeFilterService";
import { getCapacityFilters } from "../services/fakeCapacityFilterService";

class Forklifts extends Component {
  state = {
    forklifts: [],
    loading: true,
    restricted: false,
    collapsedRanges: {} // Track which ranges are collapsed (all expanded by default)
  };

  async componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });

    let isrestricted = false;
    const test = localStorage.getItem("restricted");
    if (test) isrestricted = true;

    if (user.dealerId) {
      const { data: dealery } = await getDealerDetail(user.dealerId);
      if (dealery.isRestricted) {
        isrestricted = true;
      }
    }

    const eng = getEngTypes(isrestricted);
    const cap = getCapacityFilters();

    let engFilIndex = parseInt(localStorage.getItem("selectedEngineIndex"));
    let capFilIndex = parseInt(localStorage.getItem("selectedCapacityFilterIndex"));

    const { data: forklifts } = await getForklifts();

    if (isrestricted) {
      localStorage.setItem("restricted", "true");
    }

    this.setState({
      forklifts: forklifts,
      engTypesFilter: eng,
      capacityFilter: cap,
      selectedEngine: (!isNaN(engFilIndex)) ? eng[engFilIndex] : undefined,
      selectedCapacityFilter: (!isNaN(capFilIndex)) ? cap[capFilIndex] : undefined,
      loading: false,
      restricted: isrestricted,
    });
  }

  toggleTheme = () => {
    const now = !this.state.restricted;
    
    if (now) {
      localStorage.setItem("restricted", "true");
    } else {
      localStorage.removeItem("restricted");
    }

    this.setState({ restricted: now });
  }

  toggleRange = (index) => {
    this.setState(prevState => ({
      collapsedRanges: {
        ...prevState.collapsedRanges,
        [index]: !prevState.collapsedRanges[index]
      }
    }));
  }

  handleResetFilters = () => {
    localStorage.removeItem("selectedEngineIndex");
    localStorage.removeItem("selectedCapacityFilterIndex");

    this.setState({
      selectedEngine: undefined,
      selectedCapacityFilter: undefined,
    });
  };

  handleCapFilter = (capfilter, index) => {
    localStorage.setItem("selectedCapacityFilterIndex", index);
    this.setState({ selectedCapacityFilter: capfilter });
  };

  handleEngineSel = (engine, index) => {
    localStorage.setItem("selectedEngineIndex", index);
    this.setState({ selectedEngine: engine });
  };

  filterModels(models) {
    const mseng = this.state.selectedEngine
      ? models.filter((m) => m.engType === this.state.selectedEngine.name)
      : models;

    var catchment = 100;
    if (this.state.selectedCapacityFilter)
      if (this.state.selectedCapacityFilter.capFilter > 1500) catchment = 100;

    const mscap = this.state.selectedCapacityFilter
      ? mseng.filter(
          (m) =>
            m.capacity <= this.state.selectedCapacityFilter.capFilter &&
            m.capacity > this.state.selectedCapacityFilter.capFilter - catchment
        )
      : mseng;

    return mscap;
  }

  filterEng(forklifts) {
    var g = [];

    if (!this.state.selectedEngine && !this.state.selectedCapacityFilter) {
      return forklifts;
    }

    Object.entries(forklifts).map(
      ([key, values]) =>
        (g[key] = {
          range: values.range,
          models: this.filterModels(values.models),
        })
    );

    const tt = g.filter((x) => x.models.length > 0);
    return tt;
  }

  getEngTypeColor(engType) {
    const colors = {
      'Electric': 'badge-success',
      'Diesel': 'badge-secondary',
      'LPG': 'badge-warning',
      'Rough Terrain': 'badge-purple',
      'Reach': 'badge-info',
      'Warehouse': 'badge-pink',
    };
    return colors[engType] || 'badge-secondary';
  }

  getRangeEngType(range) {
    return range.models[0]?.engType || 'Unknown';
  }

  render() {
    const filteredRanges = this.filterEng(this.state.forklifts);
    const { length: count } = this.state.forklifts;

    if (this.state.loading === true) return <p>Loading...</p>;
    if (count === 0) return <p>There are no forklifts in the database</p>;

    const isAdmin = this.state.user && (this.state.user.isAdmin || this.state.user.isMaximGB);
    
    // Build engine type options for filter
    const engineOptions = this.state.engTypesFilter || [];
    const capacityOptions = this.state.capacityFilter || [];

    return (
      <div>
        {/* Admin Toggle for Restricted Pricing */}
        {isAdmin && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--color-gray-50)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--color-gray-200)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-gray-700)', margin: '0 0 0.25rem 0' }}>
                  {this.state.restricted ? 'Briggs Personnel Pricing' : 'Normal Pricing'}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', margin: 0 }}>
                  Toggle to switch between pricing modes
                </p>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '3rem', height: '1.75rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={this.state.restricted}
                  onChange={this.toggleTheme}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: this.state.restricted ? 'var(--color-primary)' : 'var(--color-gray-300)',
                  borderRadius: '1.75rem',
                  transition: 'background-color 0.2s'
                }}>
                  <span style={{
                    position: 'absolute',
                    height: '1.25rem',
                    width: '1.25rem',
                    left: this.state.restricted ? '1.5rem' : '0.25rem',
                    bottom: '0.25rem',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    transition: 'left 0.2s'
                  }}></span>
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="mb-lg">
          <h2 className="page-title" style={{ marginBottom: '0.5rem' }}>Select a Forklift</h2>
          <p className="page-subtitle">Choose a model to start building your quote</p>
        </div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
            {/* Engine Type Filter */}
            <div style={{ flex: '1 1 12rem' }}>
              <label className="form-label">Engine Type</label>
              <select
                className="form-input"
                value={this.state.selectedEngine?.name || ''}
                onChange={(e) => {
                  const index = engineOptions.findIndex(eng => eng.name === e.target.value);
                  if (index >= 0) {
                    this.handleEngineSel(engineOptions[index], index);
                  } else {
                    localStorage.removeItem("selectedEngineIndex");
                    this.setState({ selectedEngine: undefined });
                  }
                }}
              >
                <option value="">All Engine Types</option>
                {engineOptions.map((eng, i) => (
                  <option key={i} value={eng.name}>{eng.name}</option>
                ))}
              </select>
            </div>

            {/* Capacity Filter */}
            <div style={{ flex: '1 1 12rem' }}>
              <label className="form-label">Capacity (kg)</label>
              <select
                className="form-input"
                value={this.state.selectedCapacityFilter?.capFilter || ''}
                onChange={(e) => {
                  const capValue = parseInt(e.target.value);
                  const index = capacityOptions.findIndex(cap => cap.capFilter === capValue);
                  if (index >= 0) {
                    this.handleCapFilter(capacityOptions[index], index);
                  } else {
                    localStorage.removeItem("selectedCapacityFilterIndex");
                    this.setState({ selectedCapacityFilter: undefined });
                  }
                }}
              >
                <option value="">All Capacities</option>
                {capacityOptions.map((cap, i) => (
                  <option key={i} value={cap.capFilter}>
                    {cap.capFilter.toLocaleString()} kg
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            {(this.state.selectedEngine || this.state.selectedCapacityFilter) && (
              <button
                className="btn btn-secondary"
                onClick={this.handleResetFilters}
                style={{ alignSelf: 'flex-end' }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: '1rem' }}>
          Showing {filteredRanges.length} range{filteredRanges.length !== 1 ? 's' : ''}
        </p>

        {/* Forklift Ranges - Accordion Style */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredRanges.length > 0 ? (
            Object.entries(filteredRanges).map(([key, range]) => {
              const isCollapsed = this.state.collapsedRanges[key];
              const engType = this.getRangeEngType(range);
              const badgeClass = this.getEngTypeColor(engType);

              return (
                <div key={key} className="accordion">
                  {/* Range Header */}
                  <button
                    className="accordion-header"
                    onClick={() => this.toggleRange(key)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span className={`badge ${badgeClass}`}>
                        {engType}
                      </span>
                      <span className="accordion-title">{range.range}</span>
                      <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>
                        ({range.models.length} model{range.models.length !== 1 ? 's' : ''})
                      </span>
                    </div>
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="var(--color-gray-400)"
                      viewBox="0 0 24 24"
                      style={{
                        transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                        transition: 'transform 0.2s',
                        flexShrink: 0
                      }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Models List */}
                  {!isCollapsed && (
                    <div className="accordion-content">
                      {range.models.map((model, mIndex) => (
                        <div
                          key={model._id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem',
                            borderBottom: mIndex < range.models.length - 1 ? '1px solid var(--color-gray-200)' : 'none'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                              width: '3rem',
                              height: '3rem',
                              borderRadius: 'var(--border-radius-md)',
                              backgroundColor: 'var(--color-gray-100)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <svg width="24" height="24" fill="none" stroke="var(--color-gray-400)" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                              </svg>
                            </div>
                            <div>
                              <p style={{ fontWeight: '500', color: 'var(--color-gray-800)', margin: '0 0 0.25rem 0' }}>
                                {model.model}
                              </p>
                              <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', margin: 0 }}>
                                {model.capacity.toLocaleString()} kg capacity
                              </p>
                            </div>
                          </div>
                          <Link to={`/forkliftdetail/${model.model}`}>
                            <button className="btn btn-primary">
                              Configure
                            </button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <p style={{ fontWeight: '500', color: 'var(--color-gray-800)', marginBottom: '0.5rem' }}>
                No forklifts match your filters
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
                Try adjusting the engine type or capacity
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Forklifts;
