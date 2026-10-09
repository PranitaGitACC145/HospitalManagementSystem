import { useState } from "react";

function Patients({ patients, setPatients }) {

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    room: "",
    admissionDate: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  const handleAddPatient = (e) => {

    e.preventDefault();

    setError("");

    // Check if room is already occupied
    const roomExists = patients.some(
      patient => patient.room === formData.room
    );

    if (roomExists) {
      setError("This room is already occupied.");
      return;
    }

    // Create new patient ID
    const newId = `P${String(patients.length + 1).padStart(3, "0")}`;

    const newPatient = {
      id: newId,
      name: formData.name,
      dob: formData.dob,
      gender: formData.gender,
      room: formData.room,
      admissionDate: formData.admissionDate,
      temperature: "Not recorded",
      temperatureStatus: "Pending",
      doctorVisit: "Pending",
      status: "Active"
    };

    setPatients([...patients, newPatient]);

    // Clear form
    setFormData({
      name: "",
      dob: "",
      gender: "",
      room: "",
      admissionDate: ""
    });

    setShowForm(false);

  };


  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(search.toLowerCase()) ||
    patient.id.toLowerCase().includes(search.toLowerCase()) ||
    patient.room.includes(search)
  );


  return (

    <div className="patients-page">

      {/* Page Header */}
      <div className="page-header">

        <div>
          <h1>Patients</h1>
          <p>Manage patients admitted to the facility</p>
        </div>

        <button
          className="add-button"
          onClick={() => {
            setShowForm(true);
            setError("");
          }}
        >
          + Add Patient
        </button>

      </div>


      {/* Add Patient Form */}
      {showForm && (

        <div className="form-card">

          <div className="form-header">

            <div>
              <h2>Add New Patient</h2>
              <p>Enter the patient's admission details</p>
            </div>

            <button
              className="close-button"
              onClick={() => setShowForm(false)}
            >
              ×
            </button>

          </div>


          <form onSubmit={handleAddPatient}>

            <div className="form-grid">

              <div className="form-group">
                <label>Patient Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>


              <div className="form-group">
                <label>Date of Birth</label>

                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>


              <div className="form-group">
                <label>Gender</label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

              </div>


              <div className="form-group">
                <label>Room Number</label>

                <input
                  type="text"
                  name="room"
                  value={formData.room}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>Admission Date</label>

                <input
                  type="date"
                  name="admissionDate"
                  value={formData.admissionDate}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {error && (
              <div className="form-error">
                {error}
              </div>
            )}


            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-button"
              >
                Add Patient
              </button>

            </div>

          </form>

        </div>

      )}


      {/* Search */}
      <div className="patient-tools">

        <input
          type="text"
          placeholder="Search by name, ID or room..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <span>
          {filteredPatients.length} patients
        </span>

      </div>


      {/* Patient Table */}
      <div className="patient-card">

        <table>

          <thead>

            <tr>
              <th>Patient</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Room</th>
              <th>Admission Date</th>
              <th>Temperature</th>
              <th>Doctor Visit</th>
              <th>Status</th>
            </tr>

          </thead>


          <tbody>

            {filteredPatients.map(patient => (

              <tr key={patient.id}>

                <td className="patient-name">

                  <strong>{patient.name}</strong>

                  <small>{patient.id}</small>

                </td>

                <td>{patient.dob}</td>

                <td>{patient.gender}</td>

                <td>{patient.room}</td>

                <td>{patient.admissionDate}</td>

                <td>{patient.temperature}</td>

                <td>{patient.doctorVisit}</td>

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

    </div>

  );
}

export default Patients;