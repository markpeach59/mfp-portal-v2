# Quote Session Tracking — Implementation Plan

## The Problem

Currently only users who click **Save Quote** are recorded in the database. Users who open
the configurator, price up a forklift and then close the browser — without saving — are
completely invisible. The suspicion is that a significant number of users are doing exactly
this, so the true usage of the portal is being under-counted.

## The Solution

Fire a single lightweight API call **when the configurator page loads** (`componentDidMount`
in `forkliftdetail.jsx`). This creates a `QuoteSession` document in MongoDB recording who
opened the configurator, which model, and when — regardless of whether they ever save.

No changes are needed to the existing quotes flow. This is purely additive.

---

## Files to Create / Edit

| # | Action | File |
|---|--------|------|
| 1 | **Create** | `mfnode/models/quotesession.js` |
| 2 | **Create** | `mfnode/routes/quotesessions.js` |
| 3 | **Edit**   | `mfnode/startup/routes.js` |
| 4 | **Create** | `mfp-portal-v2/src/services/quoteSessionService.js` |
| 5 | **Edit**   | `mfp-portal-v2/src/components/forkliftdetail.jsx` |

Total changes: **3 new files, 2 small edits**.

---

## Step 1 — Backend Model

**File:** `mfnode/models/quotesession.js` ← CREATE

```js
const mongoose = require("mongoose");

const QuoteSession = mongoose.model(
  "QuoteSession",
  new mongoose.Schema(
    {
      userid:   mongoose.Schema.Types.ObjectId,
      model:    String,
      dealerId: mongoose.Schema.Types.ObjectId,
    },
    { timestamps: true }  // adds createdAt + updatedAt automatically
  )
);

module.exports = { QuoteSession };
```

---

## Step 2 — Backend Route

**File:** `mfnode/routes/quotesessions.js` ← CREATE

```js
const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/auth");
const { QuoteSession } = require("../models/quotesession");

// POST /api/quotesessions
// Called by the frontend when a user opens the configurator.
router.post("/", auth, async (req, res) => {
  const session = new QuoteSession({
    userid:   req.user._id,
    model:    req.body.model,
    dealerId: req.body.dealerId || null,
  });
  await session.save();
  res.status(201).send({ ok: true });
});

// GET /api/quotesessions  — admin use, returns all sessions
router.get("/", async (req, res) => {
  const sessions = await QuoteSession.find()
    .sort("-createdAt")
    .select("-__v");
  res.send(sessions);
});

module.exports = router;
```

---

## Step 3 — Register the Route

**File:** `mfnode/startup/routes.js` ← EDIT (add the two lines marked ADD)

```js
const express         = require("express");
const forklifts       = require("../routes/forklifts");
const forkliftdetails = require("../routes/forkliftdetails");
const users           = require("../routes/users");
const quotes          = require("../routes/quotes");
const orders          = require("../routes/orders");
const dealers         = require("../routes/dealers");
const auth            = require("../routes/auth");
const files           = require("../routes/files");
const quotesessions   = require("../routes/quotesessions");  // ADD

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/forklifts",       forklifts);
  app.use("/api/forkliftdetails", forkliftdetails);
  app.use("/api/users",           users);
  app.use("/api/quotes",          quotes);
  app.use("/api/orders",          orders);
  app.use("/api/dealers",         dealers);
  app.use("/api/auth",            auth);
  app.use("/api/files",           files);
  app.use("/api/quotesessions",   quotesessions);  // ADD
};
```

---

## Step 4 — Frontend Service

**File:** `mfp-portal-v2/src/services/quoteSessionService.js` ← CREATE

```js
import http   from "./httpService";
import config from "../config.json";

const apiEndPoint = config.apiURL + "/quotesessions";

export function logQuoteSession(model, dealerId) {
  return http.post(apiEndPoint, { model, dealerId: dealerId || null });
}
```

---

## Step 5 — Call it from the Configurator

**File:** `mfp-portal-v2/src/components/forkliftdetail.jsx` ← EDIT

### 5a — Add the import (~line 76, next to the other service imports)

```js
import { logQuoteSession } from "../services/quoteSessionService";
```

### 5b — Call it in `componentDidMount` (~line 126, right after `getForkliftDetail`)

```js
// EXISTING
const { data: forky } = await getForkliftDetail(handle);

// ADD — fire-and-forget, failure must not break the page
logQuoteSession(handle, user.dealerId || null).catch(() => {});
```

---

## What Gets Recorded

Each `QuoteSession` document in MongoDB contains:

| Field | Example |
|-------|---------|
| `userid` | ObjectId of the logged-in user |
| `model` | `"MX25"` (the forklift model handle) |
| `dealerId` | ObjectId of their dealer, or `null` |
| `createdAt` | Timestamp of when they opened the configurator |

---

## Useful MongoDB Queries (Atlas / Compass)

```js
// Total configurator opens ever
db.quotesessions.countDocuments()

// Sessions per model — most popular models
db.quotesessions.aggregate([
  { $group: { _id: "$model", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])

// Sessions per user — heaviest users
db.quotesessions.aggregate([
  { $group: { _id: "$userid", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])

// Compare opens vs saves for a specific user (run both, compare)
db.quotesessions.countDocuments({ userid: ObjectId("PASTE_USER_ID") })
db.quotes.countDocuments({ userid: ObjectId("PASTE_USER_ID") })
```

---

## Optional Future Enhancements

- **Admin dashboard widget** — add a "Configurator Sessions" count card to `dashboard.jsx`
  alongside the existing Quotes / Orders counts, fetching from `GET /api/quotesessions`.
- **Drop-off rate** — divide saved quotes by sessions to get a per-model save rate.
- **De-duplicate by day** — if you only want one session per user per model per day, filter
  in your queries using a date range on `createdAt`.
