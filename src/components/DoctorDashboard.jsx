import { useState } from "react";

function DoctorDashboard({ patients, setPatients }) {

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // Prototype business rule:
  // Temperature below 38.0°C is considered fever-free.
  const FEVER_THRESHOLD = 38.0;


  // ==========================================
  // ACTIVE PATIENTS
  // ==========================================

  const activePatients = patients.filter(
    patient =>
      patient.status !== "Discharged" &&
      patient.status !== "Deceased"
  );


  const pendingVisits = activePatients.filter(
    patient => patient.doctorVisit === "Pending"
  );


  const completedVisits = activePatients.filter(
    patient => patient.doctorVisit === "Completed"
  );


  const feverPatients = activePatients.filter(
    patient => patient.status === "Fever"
  );


  // ==========================================
  // CHECK 3 CONSECUTIVE FEVER-FREE DAYS
  // ==========================================

  const getFeverFreeStatus = (patient) => {

    const history = patient.temperatureHistory || [];

    if (history.length < 3) {
      return {
        eligible: false,
        records: []
      };
    }


    // Sort history from oldest to newest

    const sortedHistory = [...history].sort(
      (a, b) => a.date.localeCompare(b.date)
    );


    // Find the most recent 3 records

    const lastThree = sortedHistory.slice(-3);


    // Check whether the dates are consecutive

    for (let i = 1; i < lastThree.length; i++) {

      const previousDate = new Date(
        `${lastThree[i - 1].date}T00:00:00`
      );

      const currentDate = new Date(
        `${lastThree[i].date}T00:00:00`
      );

      const difference =
        (currentDate - previousDate) /
        (1000 * 60 * 60 * 24);

      if (difference !== 1) {
        return {
          eligible: false,
          records: lastThree
        };
      }
    }


    // Check all three temperatures

    const allFeverFree = lastThree.every(record => {

      const temp = parseFloat(record.temperature);

      return temp < FEVER_THRESHOLD;

    });


    return {
      eligible: allFeverFree,
      records: lastThree
    };

  };


  // ==========================================
  // OPEN PATIENT REVIEW
  // ==========================================

  const handleOpenPatient = (patient) => {

    setSelectedPatient(patient);

    setNotes(patient.doctorNotes || "");

    setError("");

  };


  // ==========================================
  // COMPLETE DOCTOR VISIT
  // ==========================================

  const handleCompleteVisit = () => {

    if (!selectedPatient) {
      return;
    }


    const updatedPatients = patients.map(patient => {

      if (patient.id === selectedPatient.id) {

        return {
          ...patient,

          doctorVisit: "Completed",

          doctorVisitDate: today,

          doctorNotes: notes

        };

      }

      return patient;

    });


    setPatients(updatedPatients);

    setSelectedPatient(null);

    setNotes("");

    setError("");

  };


  // ==========================================
  // RECOMMEND DISCHARGE
  // ==========================================

  const handleRecommendDischarge = () => {

    if (!selectedPatient) {
      return;
    }


    const feverFreeStatus =
      getFeverFreeStatus(selectedPatient);


    if (!feverFreeStatus.eligible) {

      setError(
        "Patient has not completed 3 consecutive fever-free days."
      );

      return;

    }


    const updatedPatients = patients.map(patient => {

      if (patient.id === selectedPatient.id) {

        return {
          ...patient,

          dischargeRecommended: true,

          dischargeRecommendedDate: today,

          dischargeRecommendedBy: "Doctor"

        };

      }

      return patient;

    });


    setPatients(updatedPatients);

    setSelectedPatient({
      ...selectedPatient,

      dischargeRecommended: true,

      dischargeRecommendedDate: today,

      dischargeRecommendedBy: "Doctor"

    });

    setError("");

  };


  return (

    <div className="doctor-page">


      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="page-header">

        <div>

          <h1>
            Doctor Dashboard
          </h1>

          <p>
            Patient assessment and daily doctor visit management
          </p>

        </div>

        <div className="nurse-date">
          {today}
        </div>

      </div>


      {/* ==========================================
          STATISTICS
      ========================================== */}

      <section className="stats">


        <div className="stat-card">

          <span>
            Active Patients
          </span>

          <strong>
            {activePatients.length}
          </strong>

        </div>


        <div className="stat-card">

          <span>
            Visits Pending
          </span>

          <strong>
            {pendingVisits.length}
          </strong>

        </div>


        <div className="stat-card">

          <span>
            Visits Completed
          </span>

          <strong>
            {completedVisits.length}
          </strong>

        </div>


        <div className="stat-card">

          <span>
            Patients with Fever
          </span>

          <strong>
            {feverPatients.length}
          </strong>

        </div>


      </section>


      {/* ==========================================
          PATIENT TABLE
      ========================================== */}

      <div className="card">


        <div className="card-header">

          <div>

            <h2>
              Today's Patient Visits
            </h2>

            <p>
              Review temperature and complete the daily doctor visit.
            </p>

          </div>

        </div>


        <table>

          <thead>

            <tr>

              <th>
                Patient
              </th>

              <th>
                Room
              </th>

              <th>
                Temperature
              </th>

              <th>
                Temperature Status
              </th>

              <th>
                Visit
              </th>

              <th>
                Condition
              </th>

              <th>
                Discharge Eligibility
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {activePatients.map(patient => {

              const feverFreeStatus =
                getFeverFreeStatus(patient);


              return (

                <tr key={patient.id}>


                  {/* PATIENT */}

                  <td>

                    <strong>
                      {patient.name}
                    </strong>

                    <small>
                      {patient.id}
                    </small>

                  </td>


                  {/* ROOM */}

                  <td>
                    {patient.room}
                  </td>


                  {/* TEMPERATURE */}

                  <td>
                    {patient.temperature}
                  </td>


                  {/* TEMPERATURE STATUS */}

                  <td>

                    <span
                      className={
                        patient.temperatureStatus === "Pending"
                          ? "status yellow"
                          : "status green"
                      }
                    >
                      {patient.temperatureStatus}
                    </span>

                  </td>


                  {/* DOCTOR VISIT */}

                  <td>

                    <span
                      className={
                        patient.doctorVisit === "Pending"
                          ? "status yellow"
                          : "status green"
                      }
                    >
                      {patient.doctorVisit}
                    </span>

                  </td>


                  {/* CONDITION */}

                  <td>

                    <span
                      className={
                        patient.status === "Fever"
                          ? "status red"
                          : patient.status === "Recovering"
                          ? "status yellow"
                          : "status green"
                      }
                    >
                      {patient.status}
                    </span>

                  </td>


                  {/* DISCHARGE ELIGIBILITY */}

                  <td>

                    {patient.dischargeRecommended ? (

                      <span className="status green">
                        Recommended
                      </span>

                    ) : feverFreeStatus.eligible ? (

                      <span className="status green">
                        Eligible
                      </span>

                    ) : (

                      <span className="status yellow">
                        Not Eligible
                      </span>

                    )}

                  </td>


                  {/* ACTION */}

                  <td>

                    <button
                      onClick={() =>
                        handleOpenPatient(patient)
                      }
                    >
                      Review Patient
                    </button>

                  </td>


                </tr>

              );

            })}

          </tbody>

        </table>


      </div>


      {/* ==========================================
          PATIENT REVIEW MODAL
      ========================================== */}

      {selectedPatient && (

        <div className="temperature-modal">


          <div className="temperature-card">


            <h2>
              Patient Review
            </h2>


            <p>

              <strong>
                {selectedPatient.name}
              </strong>

              {" "}— Room {selectedPatient.room}

            </p>


            {/* CURRENT INFORMATION */}

            <div className="doctor-patient-info">


              <div>

                <span>
                  Patient ID
                </span>

                <strong>
                  {selectedPatient.id}
                </strong>

              </div>


              <div>

                <span>
                  Current Temperature
                </span>

                <strong>
                  {selectedPatient.temperature}
                </strong>

              </div>


              <div>

                <span>
                  Condition
                </span>

                <strong>
                  {selectedPatient.status}
                </strong>

              </div>


              <div>

                <span>
                  Today's Temperature
                </span>

                <strong>
                  {selectedPatient.temperatureStatus}
                </strong>

              </div>


            </div>


            {/* ==================================
                3 DAY FEVER-FREE STATUS
            ================================== */}

            {(() => {

              const feverFreeStatus =
                getFeverFreeStatus(selectedPatient);


              return (

                <div className="discharge-check">


                  <h3>
                    3-Day Fever-Free Check
                  </h3>


                  <p>
                    Fever threshold: {FEVER_THRESHOLD.toFixed(1)}°C
                  </p>


                  {feverFreeStatus.records.length > 0 ? (

                    <div className="history-table">

                      <table>

                        <thead>

                          <tr>

                            <th>
                              Date
                            </th>

                            <th>
                              Temperature
                            </th>

                            <th>
                              Result
                            </th>

                          </tr>

                        </thead>


                        <tbody>

                          {feverFreeStatus.records.map(
                            (record, index) => {

                              const temp =
                                parseFloat(record.temperature);

                              const feverFree =
                                temp < FEVER_THRESHOLD;


                              return (

                                <tr key={index}>

                                  <td>
                                    {record.date}
                                  </td>

                                  <td>
                                    {record.temperature}
                                  </td>

                                  <td>

                                    {feverFree ? (

                                      <span className="status green">
                                        Fever-Free ✓
                                      </span>

                                    ) : (

                                      <span className="status red">
                                        Fever ✕
                                      </span>

                                    )}

                                  </td>

                                </tr>

                              );

                            }
                          )}

                        </tbody>

                      </table>

                    </div>

                  ) : (

                    <p className="no-history">
                      Not enough temperature history
                      to determine 3-day eligibility.
                    </p>

                  )}


                  {selectedPatient.dischargeRecommended ? (

                    <div className="status green">
                      ✓ Discharge already recommended
                    </div>

                  ) : feverFreeStatus.eligible ? (

                    <div className="discharge-eligible">

                      <strong>
                        🟢 Patient is eligible for discharge
                      </strong>

                      <p>
                        Three consecutive fever-free days
                        have been completed.
                      </p>

                    </div>

                  ) : (

                    <div className="discharge-not-eligible">

                      <strong>
                        Discharge criteria not met
                      </strong>

                      <p>
                        Patient must complete 3 consecutive
                        fever-free days.
                      </p>

                    </div>

                  )}

                </div>

              );

            })()}


            {/* ==================================
                TEMPERATURE HISTORY
            ================================== */}

            <h3>
              Temperature History
            </h3>


            {selectedPatient.temperatureHistory &&
            selectedPatient.temperatureHistory.length > 0 ? (

              <div className="history-table">

                <table>

                  <thead>

                    <tr>

                      <th>
                        Date
                      </th>

                      <th>
                        Temperature
                      </th>

                      <th>
                        Condition
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {selectedPatient.temperatureHistory
                      .slice()
                      .sort((a, b) =>
                        b.date.localeCompare(a.date)
                      )
                      .map((record, index) => (

                        <tr key={index}>

                          <td>
                            {record.date}
                          </td>

                          <td>
                            {record.temperature}
                          </td>

                          <td>
                            {record.condition}
                          </td>

                        </tr>

                      ))}

                  </tbody>

                </table>

              </div>

            ) : (

              <p className="no-history">
                No temperature history recorded yet.
              </p>

            )}


            {/* ==================================
                DOCTOR NOTES
            ================================== */}

            <label>
              Doctor Assessment / Notes
            </label>


            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              placeholder="Enter patient assessment, treatment notes or observations..."
              rows="4"
            />


            {error && (

              <div className="form-error">
                {error}
              </div>

            )}


            {/* ==================================
                ACTIONS
            ================================== */}

            <div className="form-actions">


              <button
                className="cancel-button"
                onClick={() => {

                  setSelectedPatient(null);

                  setNotes("");

                  setError("");

                }}
              >
                Close
              </button>


              <button
                className="save-button"
                onClick={handleCompleteVisit}
              >
                ✓ Complete Doctor Visit
              </button>


              {getFeverFreeStatus(selectedPatient).eligible &&
              !selectedPatient.dischargeRecommended && (

                <button
                  className="save-button"
                  onClick={handleRecommendDischarge}
                >
                  ✓ Recommend Discharge
                </button>

              )}


            </div>


          </div>

        </div>

      )}


    </div>

  );

}

export default DoctorDashboard;