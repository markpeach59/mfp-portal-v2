import React, { useState } from "react";
import Button from "@material-ui/core/Button";

const QuoteSave = ({ onQuoteSave, forklift }) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  // Determine what (if anything) is blocking the save.
  // Only block when the forklift is explicitly flagged as requiring that selection.
  let blockingReason = null;
  if (!forklift.selectedSeat && forklift.seatrequired) {
    blockingReason = "Please select a seat option before saving.";
  } else if (!forklift.powertrain && forklift.chassisrequired) {
    blockingReason = "Please select a chassis option (Lead or Lithium) before saving.";
  } else if (forklift.voltagerequired && !forklift.selectedVoltage) {
    blockingReason = "Please select a battery model (Entry Level, Standard or Heavy Duty) before saving.";
  }

  const disabled = !!blockingReason;

  const handleOpen = () => {
    if (!disabled) {
      setTitle("");
      setNotes("");
      setShowModal(true);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleConfirm = () => {
    setShowModal(false);
    onQuoteSave(title.trim(), notes.trim());
  };

  return (
    <>
      <div>
        <Button onClick={handleOpen} disabled={disabled}>
          Save Quote
        </Button>

        {blockingReason && (
          <p style={{
            marginTop: "0.375rem",
            fontSize: "0.8125rem",
            color: "#c0392b",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.375rem",
            lineHeight: "1.4",
          }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: "0.125rem" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            {blockingReason}
          </p>
        )}
      </div>

      {showModal && (
        <>
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.45)",
              zIndex: 1000,
            }}
            onClick={handleCancel}
          />

          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1001,
              backgroundColor: "#fff",
              borderRadius: "0.75rem",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              padding: "2rem",
              width: "100%",
              maxWidth: "480px",
            }}
          >
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.25rem" }}>
                Save Quote
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>
                Optionally add a title and notes to help identify this quote later.
              </p>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label htmlFor="quote-title" style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.375rem" }}>
                Title <span style={{ color: "#9ca3af", fontWeight: "400" }}>(optional)</span>
              </label>
              <input
                id="quote-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. ABC Ltd - 3 tonne diesel"
                maxLength={100}
                style={{
                  width: "100%",
                  padding: "0.625rem 0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  fontSize: "0.9375rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleConfirm();
                  if (e.key === "Escape") handleCancel();
                }}
              />
            </div>

            <div style={{ marginBottom: "1.75rem" }}>
              <label htmlFor="quote-notes" style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.375rem" }}>
                Notes <span style={{ color: "#9ca3af", fontWeight: "400" }}>(optional)</span>
              </label>
              <textarea
                id="quote-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes about this quote..."
                maxLength={1000}
                rows={4}
                style={{
                  width: "100%",
                  padding: "0.625rem 0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  fontSize: "0.9375rem",
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") handleCancel();
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button
                className="btn btn-secondary"
                onClick={handleCancel}
                style={{ minWidth: "5rem" }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleConfirm}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: "7rem" }}
              >
                Save Quote
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default QuoteSave;
