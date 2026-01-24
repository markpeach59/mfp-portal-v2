# React Class to Functional Components Migration Guide

**Project:** Maximal Forklift Portal v2  
**Current State:** Class-based components with Material-UI v4  
**Goal:** Migrate to functional components, then upgrade to MUI v5  
**Strategy:** Two-phase approach for minimal risk  

---

## Table of Contents
1. [Current State Analysis](#current-state-analysis)
2. [Migration Strategy Overview](#migration-strategy-overview)
3. [Phase 1: Class → Functional (Material-UI v4)](#phase-1-class--functional-material-ui-v4)
4. [Phase 2: Upgrade to MUI v5](#phase-2-upgrade-to-mui-v5)
5. [Component Inventory](#component-inventory)
6. [Conversion Patterns](#conversion-patterns)
7. [Testing Checklist](#testing-checklist)
8. [Timeline & Effort Estimates](#timeline--effort-estimates)

---

## Current State Analysis

### Technology Stack
```json
{
  "@material-ui/core": "^4.12.4",  // Legacy, end-of-life
  "react": "^18.2.0",               // Modern React 18
  "react-dom": "^18.2.0"
}
```

### Component Breakdown
- **~60+ components** use Material-UI
- **All components** are class-based
- **forkliftdetail.jsx** is the most complex (~1000 lines)
- **40+ option components** (seats, tyres, battery, etc.)
- **8 dialog components** (markup, generateorder, etc.)
- **12 page components** (dashboard, quotes, orders, etc.)

### Already Functional (No Migration Needed) ✅
- marketing.jsx
- stocklist.jsx
- offers.jsx
- registrationform.jsx
- dealerregistrationform.jsx

---

## Migration Strategy Overview

### Why This Approach?
1. **Material-UI v4 supports BOTH class and functional components**
2. Can migrate incrementally without breaking anything
3. Once all functional, upgrading to MUI v5 is straightforward
4. Minimizes risk by separating concerns

### Two-Phase Approach

```
Phase 1: Class → Functional (Keep MUI v4)
├─ Convert components one-by-one
├─ Test each conversion
├─ No breaking changes to Material-UI
└─ Timeline: ~32 hours (4 weeks part-time)

Phase 2: Upgrade to MUI v5 (After Phase 1)
├─ Use automated codemod tool
├─ Update import paths
├─ Fix manual edge cases
└─ Timeline: ~16 hours (2 weeks part-time)
```

---

## Phase 1: Class → Functional (Material-UI v4)

### Conversion Order (Easiest → Hardest)

#### **Tier 1: Simple Option Components (~40 components)** ⭐ START HERE
**Priority: HIGH | Difficulty: LOW | Time: 10-15 min each**

**Components:**
```
✓ seats.jsx          ✓ tyres.jsx         ✓ forks.jsx
✓ valves.jsx         ✓ battery.jsx       ✓ charger.jsx
✓ aircon.jsx         ✓ heater.jsx        ✓ platform.jsx
✓ armguard.jsx       ✓ precleaner.jsx    ✓ rollers.jsx
✓ sideshifts.jsx     ✓ pincode.jsx       ✓ controller.jsx
✓ stabiliser.jsx     ✓ steering.jsx      ✓ upsweptexhaust.jsx
✓ halolight.jsx      ✓ displaywithcamera.jsx
✓ batterycompartment.jsx  ✓ blinkey.jsx
✓ cabins.jsx         ✓ coldstoreprot.jsx ✓ fork2d.jsx
✓ bfs.jsx            ✓ trolley.jsx       ✓ reargrab.jsx
✓ sideleverhydraulic.jsx  ✓ loadbackrest.jsx
✓ sideextractionbattery.jsx  ✓ heavydutyairfilter.jsx
✓ masts.jsx          ✓ mastsizes.jsx     ✓ liftybutton.jsx
✓ safetybluespot.jsx ✓ tiltfunction.jsx  ✓ voltage.jsx
✓ chassis.jsx        ✓ forkpositioner.jsx ✓ sparebatteries.jsx
... and more
```

**Why Start Here:**
- Simple structure (props in, render out)
- No complex state management
- Just Material-UI form controls
- Quick wins build momentum
- Pattern repeats across all components

**Estimated Time:** ~10 hours total

---

#### **Tier 2: Dialog/Modal Components (8 components)**
**Priority: MEDIUM | Difficulty: MEDIUM | Time: 20-30 min each**

**Components:**
```
✓ markup.jsx
✓ generateorder.jsx
✓ reassignquote.jsx
✓ assigndealer.jsx
✓ viewofferbox.jsx
✓ viewtyres.jsx
✓ viewseats.jsx
✓ confirmorder.jsx
```

**Complexity:**
- Have local state (dialog open/close)
- Form validation
- API calls in some cases
- Need useState + useEffect

**Estimated Time:** ~3 hours total

---

#### **Tier 3: Page Components (7 components)**
**Priority: MEDIUM | Difficulty: MEDIUM-HIGH | Time: 30-60 min each**

**Components to Convert:**
```
✓ dashboard.jsx
✓ forklifts.jsx
✓ quotes.jsx
✓ orders.jsx
✓ allquotes.jsx
✓ allorders.jsx
✓ configuratorlayout.jsx
✓ listallusers.jsx
✓ listalldealers.jsx
✓ quotedetail.jsx
✓ orderdetail.jsx
✓ loginform.jsx
```

**Already Functional (skip):**
- marketing.jsx ✅
- stocklist.jsx ✅
- offers.jsx ✅
- registrationform.jsx ✅
- dealerregistrationform.jsx ✅

**Complexity:**
- Complex state management
- Multiple API calls
- Lifecycle method conversions
- Conditional rendering logic

**Estimated Time:** ~5 hours total

---

#### **Tier 4: forkliftdetail.jsx (THE BIG ONE)** 🎯
**Priority: LOW (Save for last) | Difficulty: HIGH | Time: 4-6 hours**

**Why It's Complex:**
- ~1000 lines of code
- 30+ state properties
- Dozens of handler functions
- Price calculation logic
- Discount calculation logic
- Multiple lifecycle methods
- Integrates with all 40 option components

**Recommended Approach:**
1. Convert to functional first
2. Consider using `useReducer` for complex state
3. Extract helper functions to separate file
4. Break into smaller sub-components if possible
5. Test thoroughly at each step

**Estimated Time:** ~6 hours

---

## Conversion Patterns

### Pattern 1: Simple Prop-Based Component

**BEFORE (Class-based):**
```javascript
import React, { Component } from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

class Seats extends Component {
  render() {
    const { seats, selectedSeat, onSeatSel } = this.props;
    
    if (!seats || seats.length === 0) return null;

    return (
      <div>
        <Divider />
        <FormControl component="fieldset">
          <FormLabel component="legend">Seat Options</FormLabel>
          <RadioGroup value={selectedSeat?.seattype || ''}>
            {seats.map(seat => (
              <FormControlLabel
                key={seat._id}
                value={seat.seattype}
                control={<Radio />}
                label={`${seat.seattype} - £${seat.price}`}
                onChange={() => onSeatSel(seat)}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </div>
    );
  }
}

export default Seats;
```

**AFTER (Functional):**
```javascript
import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

function Seats({ seats, selectedSeat, onSeatSel }) {
  if (!seats || seats.length === 0) return null;

  return (
    <div>
      <Divider />
      <FormControl component="fieldset">
        <FormLabel component="legend">Seat Options</FormLabel>
        <RadioGroup value={selectedSeat?.seattype || ''}>
          {seats.map(seat => (
            <FormControlLabel
              key={seat._id}
              value={seat.seattype}
              control={<Radio />}
              label={`${seat.seattype} - £${seat.price}`}
              onChange={() => onSeatSel(seat)}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  );
}

export default Seats;
```

**Key Changes:**
- Remove `Component` import
- Remove `class` and `extends Component`
- Remove `render()` method
- Destructure props directly in function parameters
- Remove `this.props`

---

### Pattern 2: Component with Local State

**BEFORE (Class-based):**
```javascript
import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { TextField } from "@material-ui/core";

class Markup extends Component {
  state = {
    open: false,
    markup: 0,
    error: null
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, error: null });
  };

  handleChange = (e) => {
    this.setState({ markup: e.target.value });
  };

  handleSubmit = () => {
    if (this.state.markup < 0) {
      this.setState({ error: "Markup cannot be negative" });
      return;
    }
    this.props.onMarkup(this.state.markup);
    this.handleClose();
  };

  render() {
    return (
      <>
        <Button onClick={this.handleOpen}>
          Quote Markup
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle>Set Markup</DialogTitle>
          <DialogContent>
            <TextField
              label="Markup Amount"
              type="number"
              value={this.state.markup}
              onChange={this.handleChange}
              error={!!this.state.error}
              helperText={this.state.error}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose}>Cancel</Button>
            <Button onClick={this.handleSubmit} color="primary">
              Apply
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default Markup;
```

**AFTER (Functional with useState):**
```javascript
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { TextField } from "@material-ui/core";

function Markup({ currentMarkup, onMarkup }) {
  const [open, setOpen] = useState(false);
  const [markup, setMarkup] = useState(0);
  const [error, setError] = useState(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleChange = (e) => {
    setMarkup(e.target.value);
  };

  const handleSubmit = () => {
    if (markup < 0) {
      setError("Markup cannot be negative");
      return;
    }
    onMarkup(markup);
    handleClose();
  };

  return (
    <>
      <Button onClick={handleOpen}>
        Quote Markup
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Set Markup</DialogTitle>
        <DialogContent>
          <TextField
            label="Markup Amount"
            type="number"
            value={markup}
            onChange={handleChange}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Markup;
```

**Key Changes:**
- Import `useState` from React
- Replace `this.state` with multiple `useState` calls
- Replace `this.setState()` with state setters
- Remove `this.` from all references
- Remove `render()` method

---

### Pattern 3: Component with Lifecycle Methods

**BEFORE (Class-based):**
```javascript
import React, { Component } from "react";
import { Link } from "react-router-dom";
import auth from "../services/authService";

class Dashboard extends Component {
  state = {
    user: null,
    loading: true
  };

  async componentDidMount() {
    try {
      const user = auth.getCurrentUser();
      this.setState({ user, loading: false });
    } catch (error) {
      console.error("Failed to load user", error);
      this.setState({ loading: false });
    }
  }

  componentWillUnmount() {
    // Cleanup if needed
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
    const { user, loading } = this.state;
    
    if (loading) return <p>Loading...</p>;
    if (!user) return <p>Not logged in</p>;

    return (
      <div className="page-container">
        <h1>Welcome, {user.fullname}</h1>
        <p>Initials: {this.getUserInitials(user.fullname)}</p>
      </div>
    );
  }
}

export default Dashboard;
```

**AFTER (Functional with useEffect):**
```javascript
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import auth from "../services/authService";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This runs on mount (like componentDidMount)
    const loadUser = async () => {
      try {
        const currentUser = auth.getCurrentUser();
        setUser(currentUser);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load user", error);
        setLoading(false);
      }
    };

    loadUser();

    // Cleanup function (like componentWillUnmount)
    return () => {
      // Cleanup if needed
    };
  }, []); // Empty array = run once on mount

  const getUserInitials = (fullname) => {
    if (!fullname) return "U";
    const names = fullname.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return fullname.substring(0, 2).toUpperCase();
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Not logged in</p>;

  return (
    <div className="page-container">
      <h1>Welcome, {user.fullname}</h1>
      <p>Initials: {getUserInitials(user.fullname)}</p>
    </div>
  );
}

export default Dashboard;
```

**Key Changes:**
- Import `useState` and `useEffect`
- Replace `componentDidMount` with `useEffect(() => {}, [])`
- Replace `componentWillUnmount` with return function in `useEffect`
- Helper methods become regular functions (no `this.`)
- Remove `this.state` and `this.setState()`

---

### Pattern 4: Complex State with useReducer (for forkliftdetail.jsx)

**BEFORE (Class-based - Simplified):**
```javascript
class ForkliftDetail extends Component {
  state = {
    selectedMast: undefined,
    selectedSeat: undefined,
    selectedBattery: undefined,
    selectedCharger: undefined,
    totalprice: 12000,
    hasDiscount: false,
    discountAmount: 0,
    // ... 25+ more properties
  };

  handleSeatSel = (seat) => {
    const oldprice = this.state.selectedSeat ? this.state.selectedSeat.price : 0;
    const newprice = this.state.totalprice + seat.price - oldprice;
    this.setState({ selectedSeat: seat, totalprice: newprice });
  };

  handleBatterySel = (battery) => {
    const oldprice = this.state.selectedBattery ? this.state.selectedBattery.price : 0;
    const newprice = this.state.totalprice + battery.price - oldprice;
    this.setState({ 
      selectedBattery: battery, 
      totalprice: newprice,
      hasDiscount: battery.hasOffer,
      discountAmount: battery.hasOffer ? newprice * 0.1 : 0
    });
  };

  // ... 30+ more handlers
}
```

**AFTER (Functional with useReducer):**
```javascript
// Define action types
const ACTIONS = {
  SELECT_SEAT: 'SELECT_SEAT',
  SELECT_BATTERY: 'SELECT_BATTERY',
  SELECT_MAST: 'SELECT_MAST',
  RESET_OPTIONS: 'RESET_OPTIONS',
  // ... more actions
};

// Reducer function
function configReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SELECT_SEAT: {
      const oldPrice = state.selectedSeat?.price || 0;
      const newPrice = state.totalprice + action.payload.price - oldPrice;
      return {
        ...state,
        selectedSeat: action.payload,
        totalprice: newPrice
      };
    }

    case ACTIONS.SELECT_BATTERY: {
      const oldPrice = state.selectedBattery?.price || 0;
      const newPrice = state.totalprice + action.payload.price - oldPrice;
      const hasDiscount = action.payload.hasOffer;
      return {
        ...state,
        selectedBattery: action.payload,
        totalprice: newPrice,
        hasDiscount,
        discountAmount: hasDiscount ? newPrice * 0.1 : 0
      };
    }

    case ACTIONS.RESET_OPTIONS:
      return action.payload; // Return initial state

    default:
      return state;
  }
}

// Component
function ForkliftDetail() {
  const [state, dispatch] = useReducer(configReducer, {
    selectedMast: undefined,
    selectedSeat: undefined,
    selectedBattery: undefined,
    selectedCharger: undefined,
    totalprice: 12000,
    hasDiscount: false,
    discountAmount: 0,
    // ... more initial state
  });

  const handleSeatSel = (seat) => {
    dispatch({ type: ACTIONS.SELECT_SEAT, payload: seat });
  };

  const handleBatterySel = (battery) => {
    dispatch({ type: ACTIONS.SELECT_BATTERY, payload: battery });
  };

  const handleResetOptions = () => {
    dispatch({ type: ACTIONS.RESET_OPTIONS, payload: initialState });
  };

  // ... rest of component
}
```

**When to use useReducer:**
- Complex state with many interdependent values
- State updates that depend on previous state
- Multiple state updates that should happen together
- Complex business logic (price calculations, discounts)

---

## Testing Checklist

### For Each Converted Component:

#### **Visual Testing:**
- [ ] Component renders correctly
- [ ] All Material-UI controls display properly
- [ ] Radio buttons/checkboxes work
- [ ] Styling matches original

#### **Functional Testing:**
- [ ] Props are received correctly
- [ ] State updates when interacting
- [ ] Callbacks fire when expected
- [ ] Validation rules still work

#### **Integration Testing:**
- [ ] Parent component receives updates
- [ ] Price calculations are correct (for forklift options)
- [ ] No console errors
- [ ] No React warnings

#### **Regression Testing:**
- [ ] Existing features still work
- [ ] Quote saving works
- [ ] Order generation works
- [ ] All API calls succeed

---

## Timeline & Effort Estimates

### Phase 1: Class → Functional (Material-UI v4)

| Tier | Components | Time/Each | Total Time | Cumulative |
|------|------------|-----------|------------|------------|
| 1 | 40 option components | 15 min | 10 hours | 10 hours |
| 2 | 8 dialog components | 25 min | 3 hours | 13 hours |
| 3 | 7 page components | 45 min | 5 hours | 18 hours |
| 4 | forkliftdetail.jsx | - | 6 hours | 24 hours |
| **Testing** | All components | - | 8 hours | **32 hours** |

**Total Phase 1: ~32 hours (4 weeks part-time @ 8 hours/week)**

### Phase 2: Upgrade to MUI v5 (After Phase 1)

| Task | Time |
|------|------|
| Install MUI v5 packages | 30 min |
| Run automated codemod | 1 hour |
| Fix import paths | 2 hours |
| Update theme configuration | 2 hours |
| Fix manual edge cases | 4 hours |
| Testing all components | 6 hours |
| **Total Phase 2** | **~16 hours** |

**Grand Total: ~48 hours (6 weeks part-time)**

---

## Implementation Roadmap

### **Week 1-2: Tier 1 Components**
- Convert all 40 simple option components
- Build momentum with quick wins
- Establish conversion patterns

**Deliverables:**
- ✅ All option components functional
- ✅ Documented patterns
- ✅ Test coverage

### **Week 3: Tier 2 & 3 Components**
- Convert 8 dialog components
- Convert remaining page components
- Apply learned patterns

**Deliverables:**
- ✅ All dialogs functional
- ✅ All pages functional
- ✅ Integration tests passing

### **Week 4: Tier 4 - forkliftdetail.jsx**
- The big conversion
- Consider useReducer approach
- Thorough testing

**Deliverables:**
- ✅ forkliftdetail.jsx functional
- ✅ All price calculations work
- ✅ All options integrate correctly
- ✅ Full regression test

### **Week 5: Phase 1 Wrap-up**
- Final testing
- Bug fixes
- Documentation
- Decision point for Phase 2

**Deliverables:**
- ✅ All components functional
- ✅ Zero regressions
- ✅ Updated documentation
- ✅ Phase 2 planning complete

### **Week 6-7: Phase 2 (Optional)**
- Install MUI v5
- Run codemod tools
- Fix edge cases
- Final testing

**Deliverables:**
- ✅ MUI v5 upgrade complete
- ✅ Smaller bundle size
- ✅ Modern tooling

---

## Quick Reference Commands

### Install Dependencies (if needed)
```bash
# Already installed - no changes needed for Phase 1
npm install

# For Phase 2 (MUI v5 upgrade)
npm install @mui/material @emotion/react @emotion/styled
```

### Run Codemod (Phase 2 only)
```bash
npx @mui/codemod v5.0.0/preset-safe src/
```

### Test Commands
```bash
# Start dev server
npm start

# Run tests
npm test

# Build production
npm run build
```

---

## Notes & Best Practices

### Do's ✅
- ✅ Convert one component at a time
- ✅ Test after each conversion
- ✅ Commit after each successful conversion
- ✅ Keep Material-UI v4 imports unchanged (Phase 1)
- ✅ Use functional patterns (hooks, not class patterns)
- ✅ Extract complex logic to helper functions
- ✅ Document any tricky conversions

### Don'ts ❌
- ❌ Don't convert multiple components at once
- ❌ Don't change Material-UI version in Phase 1
- ❌ Don't skip testing
- ❌ Don't mix class and functional patterns in same file
- ❌ Don't refactor business logic during conversion
- ❌ Don't change component APIs unless necessary

### Common Pitfalls
1. **Forgetting to remove `this.`** - Easy to miss in large components
2. **Incorrect useEffect dependencies** - Leads to infinite loops
3. **State initialization timing** - May need useEffect for async loads
4. **Handler binding** - Not needed in functional (no `this`)
5. **Prop destructuring** - Remember to update everywhere

---

## Support & Resources

### React Hooks Documentation
- [Using the State Hook](https://react.dev/reference/react/useState)
- [Using the Effect Hook](https://react.dev/reference/react/useEffect)
- [useReducer Hook](https://react.dev/reference/react/useReducer)

### Material-UI v4 Documentation
- [Material-UI v4 Docs](https://v4.mui.com/)
- [Migration Guide v4 to v5](https://mui.com/material-ui/migration/migration-v4/)

### Codebase References
- Existing functional components:
  - `marketing.jsx` - Good example
  - `stocklist.jsx` - API calls with useState
  - `registrationform.jsx` - Form handling

---

## Progress Tracking

Copy this checklist and track your progress:

### Phase 1 Progress

**Tier 1: Option Components (40 total)**
- [ ] seats.jsx
- [ ] tyres.jsx
- [ ] forks.jsx
- [ ] valves.jsx
- [ ] battery.jsx
- [ ] charger.jsx
- [ ] aircon.jsx
- [ ] heater.jsx
- [ ] platform.jsx
- [ ] armguard.jsx
- [ ] precleaner.jsx
- [ ] rollers.jsx
- [ ] sideshifts.jsx
- [ ] pincode.jsx
- [ ] controller.jsx
- [ ] stabiliser.jsx
- [ ] steering.jsx
- [ ] upsweptexhaust.jsx
- [ ] halolight.jsx
- [ ] displaywithcamera.jsx
- [ ] batterycompartment.jsx
- [ ] blinkey.jsx
- [ ] cabins.jsx
- [ ] coldstoreprot.jsx
- [ ] fork2d.jsx
- [ ] bfs.jsx
- [ ] trolley.jsx
- [ ] reargrab.jsx
- [ ] sideleverhydraulic.jsx
- [ ] loadbackrest.jsx
- [ ] sideextractionbattery.jsx
- [ ] heavydutyairfilter.jsx
- [ ] masts.jsx
- [ ] mastsizes.jsx
- [ ] liftybutton.jsx
- [ ] safetybluespot.jsx
- [ ] tiltfunction.jsx
- [ ] voltage.jsx
- [ ] chassis.jsx
- [ ] forkpositioner.jsx
- [ ] sparebatteries.jsx

**Tier 2: Dialog Components (8 total)**
- [ ] markup.jsx
- [ ] generateorder.jsx
- [ ] reassignquote.jsx
- [ ] assigndealer.jsx
- [ ] viewofferbox.jsx
- [ ] viewtyres.jsx
- [ ] viewseats.jsx
- [ ] confirmorder.jsx

**Tier 3: Page Components (12 total)**
- [ ] dashboard.jsx
- [ ] forklifts.jsx
- [ ] quotes.jsx
- [ ] orders.jsx
- [ ] allquotes.jsx
- [ ] allorders.jsx
- [ ] configuratorlayout.jsx
- [ ] listallusers.jsx
- [ ] listalldealers.jsx
- [ ] quotedetail.jsx
- [ ] orderdetail.jsx
- [ ] loginform.jsx

**Tier 4: Complex Component**
- [ ] forkliftdetail.jsx (The Big One)

**Testing & Completion**
- [ ] All components converted
- [ ] Full regression test passed
- [ ] No console errors/warnings
- [ ] Ready for Phase 2

### Phase 2 Progress
- [ ] Install MUI v5 packages
- [ ] Run codemod tool
- [ ] Fix import paths
- [ ] Update theme config
- [ ] Fix manual edge cases
- [ ] Full testing
- [ ] Remove @material-ui/core package
- [ ] Production build successful

---

## Contact & Questions

When you're ready to start this migration, reference this document and work through the tiers systematically. Start with Tier 1 components (the easiest 40) to build momentum and establish patterns.

**Good luck with the migration! 🚀**

---

**Document Version:** 1.0  
**Last Updated:** January 23, 2026  
**Status:** Ready for Phase 1 implementation
