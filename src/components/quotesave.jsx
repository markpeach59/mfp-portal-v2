import React, { useState } from "react";
import Button from "@material-ui/core/Button";

const QuoteSave = ({ onQuoteSave, forklift }) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  let disabled = false;

  if (!forklift.selectedSeat && forklift.seatrequired) { disabled = true; }
  if (!forklift.powertrain && forklift.chassisrequired) { disabled = true; }
  if (forklift.voltagerequired && !forklift.selectedVoltage) { disabled = true; }

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
        {/* Using MUI Button so disabled styling (grey) works exactly as before */}
        <Button onClick={handleOpen} disabled={disabled}>
          Save Quote
        </Button>
      </div>

      {showModal && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.45)",
              zIndex: 1000,
            }}
            onClick={handleCancel}
          />

          {/* Modal */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1001,
              backgroundColor: "#fff",
              borderRadius: "var(--border-radius-lg, 0.75rem)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              padding: "2rem",
              width: "100%",
              maxWidth: "480px",
            }}
          >
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "var(--color-gray-800)", marginBottom: "0.25rem" }}>
                Save Quote
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--color-gray-500)", margin: 0 }}>
                Optionally add a title and notes to help identify this quote later.
              </p>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label
                htmlFor="quote-title"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "var(--color-gray-700)",
                  marginBottom: "0.375rem",
                }}
              >
                Title <span style={{ color: "var(--color-gray-400)", fontWeight: "400" }}>(optional)</span>
              </label>
              <input
                id="quote-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. ABC Ltd – 3 tonne diesel"
                maxLength={100}
                style={{
                  width: "100%",
                  padding: "0.625rem 0.75rem",
                  border: "1px solid var(--color-gray-300, #d1d5db)",
                  borderRadius: "var(--border-radius, 0.375rem)",
                  fontSize: "0.9375rem",
                  color: "var(--color-gray-800)",
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
              <label
                htmlFor="quote-notes"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "var(--color-gray-700)",
                  marginBottom: "0.375rem",
                }}
              >
                Notes <span style={{ color: "var(--color-gray-400)", fontWeight: "400" }}>(optional)</span>
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
                  border: "1px solid var(--color-gray-300, #d1d5db)",
                  borderRadius: "var(--border-radius, 0.375rem)",
                  fontSize: "0.9375rem",
                  color: "var(--color-gray-800)",
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
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
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
