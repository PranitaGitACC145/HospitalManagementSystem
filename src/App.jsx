import { useState, useEffect } from "react";
import "./App.css";
import Patients from "./components/Patients";
import NurseDashboard from "./components/NurseDashboard";
import Login from "./components/Login";

import DoctorDashboard from "./components/DoctorDashboard";

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [loggedInRole, setLoggedInRole] = useState(null);

  /* =========================
     PATIENT DATA
  ========================= */

  const [patients, setPatients] = useState(() => {
    const savedPatients = localStorage.getItem("virusCarePatients");

    if (savedPatients) {
      return JSON.parse(savedPatients);
    }

    return [
      {
        id: "P001",
        name: "Rahul Sharma",
        dob: "1995-05-12",
        gender: "Male",
        room: "101",
        admissionDate: "2026-10-01",
        temperature: "37.2°C",
        temperatureStatus: "Completed",
        doctorVisit: "Completed",
        status: "Active",
         temperatureHistory: [
          {
            date: "2026-10-06",
            temperature: "37.2°C",
            condition: "Stable"
          }]
            },
      {
        id: "P002",
        name: "Priya Patil",
        dob: "1998-08-20",
        gender: "Female",
        room: "102",
        admissionDate: "2026-10-02",
        temperature: "38.4°C",
        temperatureStatus: "Completed",
        doctorVisit: "Pending",
        status: "Fever",
         temperatureHistory: [
          {
             date: "2026-10-05",
              temperature: "36.7°C",
              condition: "Stable"
          }]
      },
      {
        id: "P003",
        name: "Amit Kumar",
        dob: "1990-02-15",
        gender: "Male",
        room: "103",
        admissionDate: "2026-10-03",
        temperature: "Not recorded",
        temperatureStatus: "Pending",
        doctorVisit: "Pending",
        status: "Active",
         temperatureHistory: [
          {
            date: "2026-10-06",
            temperature: "36.6°C",
            condition: "Stable"
          }]
      },
      {
        id: "P004",
        name: "Sneha Rao",
        dob: "1997-11-05",
        gender: "Female",
        room: "104",
        admissionDate: "2026-10-03",
        temperature: "36.7°C",
        temperatureStatus: "Completed",
        doctorVisit: "Completed",
        status: "Active",
         temperatureHistory: [
          {
            date: "2026-10-07",
            temperature: "37.2°C",
            condition: "Stable"
          }]
      }
    ];
  });

  /* =========================
     SAVE PATIENT DATA
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      "virusCarePatients",
      JSON.stringify(patients)
    );
  }, [patients]);

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    setLoggedInRole(null);
    setActivePage("dashboard");
  };

  /* =========================
     LOGIN CHECK
  ========================= */

  if (!loggedInRole) {
    return <Login onLogin={setLoggedInRole} />;
  }

  /* =========================
     MAIN APPLICATION
  ========================= */

  return (
    <div className="app">

      {/* =========================
          HEADER
      ========================= */}

      <header className="header">

        <div>
          <h1>Virus Care Facility</h1>
          <p>Patient Management System</p>
        </div>

        <div className="user">

          <span>👨‍⚕️</span>

          <div>
            <strong>
              {loggedInRole === "admin"
                ? "Admin"
                : loggedInRole}
            </strong>

            <small>
              {loggedInRole === "admin"
                ? "Administrator"
                : loggedInRole === "nurse"
                ? "Nurse"
                : "Doctor"}
            </small>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* =========================
          NAVIGATION
      ========================= */}

      <nav className="navigation">

        <button
          className={
            activePage === "dashboard"
              ? "nav-button active"
              : "nav-button"
          }
          onClick={() => setActivePage("dashboard")}
        >
          📊 Dashboard
        </button>

        <button
          className={
            activePage === "patients"
              ? "nav-button active"
              : "nav-button"
          }
          onClick={() => setActivePage("patients")}
        >
          👥 Patients
        </button>

        <button
          className="nav-button"
          onClick={() =>
            alert("Temperature Tracking coming next!")
          }
        >
          🌡️ Temperatures
        </button>

        <button
          className="nav-button"
          onClick={() =>
            alert("Doctor Visits coming soon!")
          }
        >
          👨‍⚕️ Doctor Visits
        </button>

        <button
          className="nav-button"
          onClick={() =>
            alert("Discharge Management coming soon!")
          }
        >
          📋 Discharge
        </button>

        <button
          className="nav-button"
          onClick={() =>
            alert("Reports coming soon!")
          }
        >
          📈 Reports
        </button>

      </nav>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main>

        {/* ADMIN */}

        {loggedInRole === "admin" && (
          <>
            {activePage === "dashboard" && (
              <Dashboard patients={patients} />
            )}

            {activePage === "patients" && (
              <Patients
                patients={patients}
                setPatients={setPatients}
              />
            )}
          </>
        )}


        {/* NURSE */}

        {loggedInRole === "nurse" && (
          <NurseDashboard
            patients={patients}
            setPatients={setPatients}
          />
        )}


        {/* DOCTOR */}

       {loggedInRole === "doctor" && (
          <DoctorDashboard
            patients={patients}
            setPatients={setPatients}
          />
        )}

      </main>

    </div>
  );
}


/* =========================
   ADMIN DASHBOARD
========================= */

function Dashboard({ patients }) {

  const totalPatients = patients.length;

  const temperaturesPending = patients.filter(
    patient =>
      patient.temperatureStatus === "Pending"
  ).length;

  const doctorVisitsPending = patients.filter(
    patient =>
      patient.doctorVisit === "Pending"
  ).length;

  const activePatients = patients.filter(
    patient =>
      patient.status !== "Discharged" &&
      patient.status !== "Dead"
  ).length;

  return (
    <>

      {/* =========================
          STATISTICS
      ========================= */}

      <section className="stats">

        <div className="stat-card">
          <span>Total Patients</span>
          <strong>{totalPatients}</strong>
        </div>

        <div className="stat-card">
          <span>Temperatures Pending</span>
          <strong>{temperaturesPending}</strong>
        </div>

        <div className="stat-card">
          <span>Doctor Visits Pending</span>
          <strong>{doctorVisitsPending}</strong>
        </div>

        <div className="stat-card">
          <span>Ready for Discharge</span>
          <strong>0</strong>
        </div>

      </section>


      {/* =========================
          PATIENT STATUS
      ========================= */}

      <section className="content">

        <div className="card">

          <div className="card-header">

            <h2>Today's Patient Status</h2>

            <button>
              View All
            </button>

          </div>


          <table>

            <thead>

              <tr>
                <th>Patient</th>
                <th>Room</th>
                <th>Temperature</th>
                <th>Doctor Visit</th>
                <th>Status</th>
              </tr>

            </thead>


            <tbody>

              {patients.map(patient => (

                <tr key={patient.id}>

                  <td>
                    {patient.id}
                  </td>

                  <td>
                    {patient.room}
                  </td>

                  <td>
                    {patient.temperature}
                  </td>

                  <td>
                    {patient.doctorVisit}
                  </td>

                  <td>

                    <span
                      className={
                        patient.status === "Fever"
                          ? "status red"
                          : patient.temperatureStatus === "Pending" ||
                            patient.doctorVisit === "Pending"
                          ? "status yellow"
                          : "status green"
                      }
                    >

                      {patient.status === "Fever"
                        ? "Fever"
                        : patient.temperatureStatus === "Pending" ||
                          patient.doctorVisit === "Pending"
                        ? "Action Required"
                        : "Stable"}

                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        {/* =========================
            FACILITY OCCUPANCY
        ========================= */}

        <div className="card occupancy">

          <h2>Facility Occupancy</h2>

          <div className="occupancy-number">

            <strong>
              {activePatients}
            </strong>

            <span>
              / 74 rooms occupied
            </span>

          </div>


          <div className="progress">

            <div
              className="progress-fill"
              style={{
                width: `${(activePatients / 74) * 100}%`
              }}
            ></div>

          </div>


          <p>

            {activePatients >= 74
              ? "⚠️ Facility is currently at full capacity."
              : `✅ ${74 - activePatients} rooms currently available.`}

          </p>

        </div>

      </section>


      {/* =========================
          CLINICAL PERFORMANCE
      ========================= */}

      <section className="card performance">

        <div className="card-header">

          <h2>Clinical Performance</h2>

        </div>


        <div className="performance-grid">

          <div>
            <span>Success Rate</span>
            <strong>85%</strong>
            <small>Target: 85%</small>
          </div>

          <div>
            <span>Mortality Rate</span>
            <strong>15%</strong>
            <small>
              Expected maximum: 15%
            </small>
          </div>

          <div>
            <span>Discharges</span>
            <strong>62</strong>
            <small>
              Total successfully discharged
            </small>
          </div>

          <div>
            <span>Deaths</span>
            <strong>2</strong>
            <small>
              Total recorded deaths
            </small>
          </div>

        </div>

      </section>

    </>
  );
}


export default App;