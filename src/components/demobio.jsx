import { useState } from "react";

import API from "./api";
import "./bio.css"
function BiometricSimulator() {
  const [employeeId, setEmployeeId] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);

  const handleFingerprintScan = async () => {
  if (!employeeId.trim()) {
    alert("Please enter Member ID");
    return;
  }

  setIsScanning(true);
  setResult(null);

  setTimeout(async () => {
    try {
      const response = await API.post(
        "/attendance/biometric-scan/",
        {
          device_id: "DEMO-BIO-001",
          employee_id: employeeId.trim(),
          verification_type: "Fingerprint",
          scan_time: new Date().toISOString(),
          status: "verified",
        }
      );

      console.log("Biometric response:", response.data);

      setResult({
        success: true,
        ...response.data,
      });
    } catch (error) {
      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);
      console.log("Requested URL:", error.config?.baseURL);
      console.log("Endpoint:", error.config?.url);
      console.log("Method:", error.config?.method);

      setResult({
        success: false,
        message:
          error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Unable to connect to biometric server.",
      });
    } finally {
      setIsScanning(false);
    }
  }, 2000);
};

  return (
    <div className="biometric-page">
      <div className="biometric-terminal">
        <div className="terminal-header">
          <span className="online-dot"></span>
          <span>INFINITY BIOMETRIC TERMINAL</span>
        </div>

        <div className="device-info">
          Device ID: DEMO-BIO-001
        </div>

        <label>Member ID</label>

        <input
          type="text"
          value={employeeId}
          placeholder="Enter Member ID"
          onChange={(event) =>
            setEmployeeId(event.target.value)
          }
        />

        <button
          onClick={handleFingerprintScan}
          disabled={isScanning}
        >
          {isScanning
            ? "Scanning Fingerprint..."
            : "Scan Fingerprint"}
        </button>

        <div
          className={`fingerprint ${
            isScanning ? "scanning" : ""
          }`}
        >
          ☝️
        </div>

        {result && (
          <div
            className={
              result.success
                ? "result success"
                : "result error"
            }
          >
            <h3>
              {result.success
                ? "Fingerprint Verified"
                : "Verification Failed"}
            </h3>

            <p>{result.message}</p>

            {result.success && (
              <>
                <p>
                  <strong>Member:</strong>{" "}
                  {result.member.name}
                </p>

                <p>
                  <strong>Member ID:</strong>{" "}
                  {result.member.user_id}
                </p>

                <p>
                  <strong>Action:</strong>{" "}
                  {result.action === "check_in"
                    ? "Check In"
                    : "Check Out"}
                </p>

                <p>
                  <strong>Check In:</strong>{" "}
                  {result.attendance.check_in || "-"}
                </p>

                <p>
                  <strong>Check Out:</strong>{" "}
                  {result.attendance.check_out || "-"}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BiometricSimulator;