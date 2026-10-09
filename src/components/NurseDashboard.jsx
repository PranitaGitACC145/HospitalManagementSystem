import { useState } from "react";

function NurseDashboard({ patients, setPatients }) {

  const [selectedPatient, setSelectedPatient] = useState(null);

  const [temperature, setTemperature] = useState("");

  const [condition, setCondition] = useState("Stable");

  const [error, setError] = useState("");

  const [historyPatient, setHistoryPatient] = useState(null);

  const [historyFrom, setHistoryFrom] = useState("");

  const [historyTo, setHistoryTo] = useState("");

  const today = new Date().toISOString().split("T")[0];


  // ================================
  // RECORD TEMPERATURE
  // ================================

  const handleRecordTemperature = () => {

    if (!temperature) {
      setError("Please enter the patient's temperature.");
      return;
    }

    const tempValue = parseFloat(temperature);

    if (tempValue < 30 || tempValue > 45) {
      setError("Please enter a valid temperature.");
      return;
    }


    // Prevent duplicate temperature on the same day

    const alreadyRecordedToday = (
      selectedPatient.temperatureHistory || []
    ).some(record => record.date === today);


    if (alreadyRecordedToday) {
      setError("Today's temperature has already been recorded.");
      return;
    }


    const todayRecord = {
      date: today,
      temperature: `${tempValue.toFixed(1)}°C`,
      condition: condition
    };


    const updatedPatients = patients.map(patient => {

      if (patient.id === selectedPatient.id) {

        return {
          ...patient,

          temperature: `${tempValue.toFixed(1)}°C`,

          temperatureStatus: "Completed",

          status: condition,

          temperatureHistory: [
            ...(patient.temperatureHistory || []),
            todayRecord
          ]
        };

      }

      return patient;

    });


    setPatients(updatedPatients);

    setSelectedPatient(null);

    setTemperature("");

    setCondition("Stable");

    setError("");

  };


  // ================================
  // REPORT DEATH
  // ================================

  const handleDeath = () => {

    if (!selectedPatient) return;


    const updatedPatients = patients.map(patient => {

      if (patient.id === selectedPatient.id) {

        return {
          ...patient,

          status: "Deceased",

          deathDate: today,

          temperatureStatus: "Completed",

          doctorVisit: "Completed",

          roomStatus: "Pending Release"
        };

      }

      return patient;

    });


    setPatients(updatedPatients);

    setSelectedPatient(null);

    setTemperature("");

    setCondition("Stable");

    setError("");

  };


  // ================================
  // OPEN TEMPERATURE MODAL
  // ================================

  const openTemperatureModal = (patient) => {

    setSelectedPatient(patient);

    setTemperature("");

    setCondition(
      patient.status === "Fever"
        ? "Fever"
        : "Stable"
    );

    setError("");

  };


  // ================================
  // OPEN HISTORY
  // ================================

  const openHistory = (patient) => {

    setHistoryPatient(patient);

    setHistoryFrom(patient.admissionDate);

    setHistoryTo(today);

  };


  // ================================
  // CLOSE HISTORY
  // ================================

  const closeHistory = () => {

    setHistoryPatient(null);

    setHistoryFrom("");

    setHistoryTo("");

  };


  // ================================
  // PATIENT STATISTICS
  // ================================

  const pendingPatients = patients.filter(
    patient =>
      patient.temperatureStatus === "Pending" &&
      patient.status !== "Deceased"
  );


  const completedPatients = patients.filter(
    patient =>
      patient.temperatureStatus === "Completed" &&
      patient.status !== "Deceased"
  );


  const feverPatients = patients.filter(
    patient =>
      patient.status === "Fever"
  );


  // ================================
  // FILTER HISTORY
  // ================================

  const filteredHistory = historyPatient
    ? (historyPatient.temperatureHistory || [])
        .filter(record =>
          record.date >= historyFrom &&
          record.date <= historyTo
        )
        .sort((a, b) =>
          b.date.localeCompare(a.date)
        )
    : [];


  return (

    <div className="nurse-page">


      {/* ==================================
          HEADER
      ================================== */}

      <div className="page-header">

        <div>

          <h1>
            Nurse Dashboard
          </h1>

          <p>
            Daily patient monitoring and temperature tracking
          </p>

        </div>

        <div className="nurse-date">
          {today}
        </div>

      </div>


      {/* ==================================
          STATISTICS
      ================================== */}

      <section className="stats">


        <div className="stat-card">

          <span>
            Total Patients
          </span>

          <strong>
            {patients.length}
          </strong>

        </div>


        <div className="stat-card">

          <span>
            Temperature Pending
          </span>

          <strong>
            {pendingPatients.length}
          </strong>

        </div>


        <div className="stat-card">

          <span>
            Recorded Today
          </span>

          <strong>
            {completedPatients.length}
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


      {/* ==================================
          PATIENT TABLE
      ================================== */}

      <div className="card">


        <div className="card-header">

          <div>

            <h2>
              Today's Temperature Monitoring
            </h2>

            <p>
              Record one temperature per patient per day
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
                Status
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {patients.map(patient => (

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


                {/* STATUS */}

                <td>

                  <span
                    className={
                      patient.status === "Fever"
                        ? "status red"
                        : patient.status === "Deceased"
                        ? "status red"
                        : patient.status === "Recovering"
                        ? "status blue"
                        : patient.temperatureStatus === "Pending"
                        ? "status yellow"
                        : "status green"
                    }
                  >

                    {patient.status}

                  </span>

                </td>


                {/* ACTIONS */}

                <td>


                  {patient.status !== "Deceased" && (

                    <>

                      {/* RECORD / UPDATE BUTTON */}

                      <button
                        onClick={() =>
                          openTemperatureModal(patient)
                        }
                      >

                        {patient.temperatureStatus === "Pending"
                          ? "Record Temperature"
                          : "Update"}

                      </button>


                      {/* VIEW HISTORY BUTTON */}

                      <button
                        className="history-button"
                        onClick={() =>
                          openHistory(patient)
                        }
                      >

                        View History

                      </button>

                    </>

                  )}


                  {patient.status === "Deceased" && (

                    <span className="status red">
                      Deceased
                    </span>

                  )}

                </td>


              </tr>

            ))}

          </tbody>

        </table>


      </div>


      {/* ==================================
          TEMPERATURE MODAL
      ================================== */}

      {selectedPatient && (

        <div className="temperature-modal">


          <div className="temperature-card">


            <h2>
              Record Patient Temperature
            </h2>


            <p>
              {selectedPatient.name}
              {" "}— Room {selectedPatient.room}
            </p>


            <label>
              Temperature (°C)
            </label>


            <input
              type="number"
              step="0.1"
              value={temperature}
              onChange={(e) =>
                setTemperature(e.target.value)
              }
              placeholder="e.g. 37.2"
            />


            <label>
              Patient Condition
            </label>


            <select
              value={condition}
              onChange={(e) =>
                setCondition(e.target.value)
              }
            >

              <option value="Stable">
                Stable
              </option>

              <option value="Fever">
                Fever
              </option>

              <option value="Recovering">
                Recovering
              </option>

            </select>


            {error && (

              <div className="form-error">
                {error}
              </div>

            )}


            <div className="form-actions">


              <button
                className="cancel-button"
                onClick={() => {
                  setSelectedPatient(null);
                  setError("");
                }}
              >
                Cancel
              </button>


              <button
                className="save-button"
                onClick={handleRecordTemperature}
              >
                Save Temperature
              </button>


            </div>


            {/* REPORT DEATH */}

            <button
              className="death-button"
              onClick={handleDeath}
            >
              ⚠️ Report Patient Death
            </button>


          </div>

        </div>

      )}


      {/* ==================================
          TEMPERATURE HISTORY MODAL
      ================================== */}

      {historyPatient && (

        <div className="temperature-modal">


          <div className="temperature-card">


            <h2>
              Temperature History
            </h2>


            <p>

              <strong>
                {historyPatient.name}
              </strong>

              {" "}— Room {historyPatient.room}

            </p>


            {/* DATE FILTERS */}

            <div className="history-filters">


              <div>

                <label>
                  From Date
                </label>

                <input
                  type="date"
                  value={historyFrom}
                  onChange={(e) =>
                    setHistoryFrom(e.target.value)
                  }
                />

              </div>


              <div>

                <label>
                  To Date
                </label>

                <input
                  type="date"
                  value={historyTo}
                  onChange={(e) =>
                    setHistoryTo(e.target.value)
                  }
                />

              </div>


            </div>


            {/* HISTORY TABLE */}

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


                  {filteredHistory.map(
                    (record, index) => (

                      <tr key={index}>


                        <td>
                          {record.date}
                        </td>


                        <td>
                          {record.temperature}
                        </td>


                        <td>

                          <span
                            className={
                              record.condition === "Fever"
                                ? "status red"
                                : record.condition === "Recovering"
                                ? "status yellow"
                                : "status green"
                            }
                          >

                            {record.condition}

                          </span>

                        </td>


                      </tr>

                    )
                  )}


                  {filteredHistory.length === 0 && (

                    <tr>

                      <td colSpan="3">

                        No temperature records found
                        for this date range.

                      </td>

                    </tr>

                  )}


                </tbody>

              </table>


            </div>


            {/* CLOSE BUTTON */}

            <div className="form-actions">

              <button
                className="cancel-button"
                onClick={closeHistory}
              >
                Close
              </button>

            </div>


          </div>

        </div>

      )}


    </div>

  );

}

export default NurseDashboard;