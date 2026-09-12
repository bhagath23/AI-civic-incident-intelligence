import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";


// ============================================================
// CATEGORY DEFINITIONS
// ============================================================

const categories = [
  {
    key: "all",
    label: "All",
  },
  {
    key: "caution_advice",
    label: "Caution & Advice",
  },
  {
    key: "displaced",
    label: "Displaced People & Evacuations",
  },
  {
    key: "infrastructure",
    label: "Infrastructure & Utility Damage",
  },
  {
    key: "injured_dead",
    label: "Injured or Dead People",
  },
  {
    key: "missing_found",
    label: "Missing or Found People",
  },
  {
    key: "not_humanitarian",
    label: "Not Humanitarian",
  },
  {
    key: "other",
    label: "Other Relevant Information",
  },
  {
    key: "urgent",
    label: "Requests or Urgent Needs",
  },
  {
    key: "rescue",
    label: "Rescue / Volunteering / Donation Effort",
  },
  {
    key: "sympathy",
    label: "Sympathy & Support",
  },
];


// ============================================================
// NORMALIZE AI LABEL
// ============================================================

function normalizeLabel(label) {
  if (!label) return "";

  return label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[\/_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}


// ============================================================
// CHECK CATEGORY
// ============================================================

function matchesCategory(incident, selectedCategory) {

  if (selectedCategory === "all") {
    return true;
  }

  const rawLabel =
    incident.prediction ||
    incident.label ||
    incident.category ||
    incident.classification ||
    "";

  const label = normalizeLabel(rawLabel);


  // ----------------------------------------------------------
  // CAUTION & ADVICE
  // ----------------------------------------------------------

  if (selectedCategory === "caution_advice") {
    return (
      label.includes("caution") ||
      label.includes("advice")
    );
  }


  // ----------------------------------------------------------
  // DISPLACED PEOPLE
  // ----------------------------------------------------------

  if (selectedCategory === "displaced") {
    return (
      label.includes("displaced") ||
      label.includes("evacuation")
    );
  }


  // ----------------------------------------------------------
  // INFRASTRUCTURE
  // ----------------------------------------------------------

  if (selectedCategory === "infrastructure") {
    return (
      label.includes("infrastructure") ||
      label.includes("utility") ||
      label.includes("damage")
    );
  }


  // ----------------------------------------------------------
  // INJURED / DEAD
  // ----------------------------------------------------------

  if (selectedCategory === "injured_dead") {
    return (
      label.includes("injured") ||
      label.includes("dead") ||
      label.includes("death")
    );
  }


  // ----------------------------------------------------------
  // MISSING / FOUND
  // ----------------------------------------------------------

  if (selectedCategory === "missing_found") {
    return (
      label.includes("missing") ||
      label.includes("found")
    );
  }


  // ----------------------------------------------------------
  // NOT HUMANITARIAN
  // ----------------------------------------------------------

  if (selectedCategory === "not_humanitarian") {
    return label.includes("not humanitarian");
  }


  // ----------------------------------------------------------
  // OTHER
  // ----------------------------------------------------------

  if (selectedCategory === "other") {
    return (
      label.includes("other") ||
      label.includes("relevant information")
    );
  }


  // ----------------------------------------------------------
  // URGENT NEEDS
  // ----------------------------------------------------------

  if (selectedCategory === "urgent") {
    return (
      label.includes("request") ||
      label.includes("urgent") ||
      label.includes("need")
    );
  }


  // ----------------------------------------------------------
  // RESCUE
  // ----------------------------------------------------------

  if (selectedCategory === "rescue") {
    return (
      label.includes("rescue") ||
      label.includes("volunteering") ||
      label.includes("donation")
    );
  }


  // ----------------------------------------------------------
  // SYMPATHY
  // ----------------------------------------------------------

  if (selectedCategory === "sympathy") {
    return (
      label.includes("sympathy") ||
      label.includes("support")
    );
  }


  return false;
}


// ============================================================
// APP
// ============================================================

function App() {

  const [incidents, setIncidents] = useState([]);

  const [selectedCategory, setSelectedCategory] =
    useState("all");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ==========================================================
  // FETCH INCIDENTS
  // ==========================================================

  const fetchIncidents = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/incidents`
      );

      if (!response.ok) {
        throw new Error(
          `API returned ${response.status}`
        );
      }

      const data = await response.json();

      console.log("API RESPONSE:", data);


      // ------------------------------------------------------
      // SUPPORT DIFFERENT API RESPONSE FORMATS
      // ------------------------------------------------------

      let incidentList = [];

      if (Array.isArray(data)) {

        incidentList = data;

      } else if (Array.isArray(data.incidents)) {

        incidentList = data.incidents;

      } else if (Array.isArray(data.results)) {

        incidentList = data.results;
      }


      setIncidents(incidentList);

    } catch (err) {

      console.error("Failed to fetch incidents:", err);

      setError(
        "Unable to fetch incidents. Make sure the FastAPI backend is running."
      );

    } finally {

      setLoading(false);
    }
  };


  // ==========================================================
  // LOAD ON START
  // ==========================================================

  useEffect(() => {

    fetchIncidents();

  }, []);


  // ==========================================================
  // FILTER INCIDENTS
  // ==========================================================

  const filteredIncidents = incidents.filter(
    (incident) =>
      matchesCategory(
        incident,
        selectedCategory
      )
  );


  // ==========================================================
  // STATISTICS
  // ==========================================================

  const evacuationCount =
    incidents.filter((incident) =>
      matchesCategory(
        incident,
        "displaced"
      )
    ).length;


  const injuredCount =
    incidents.filter((incident) =>
      matchesCategory(
        incident,
        "injured_dead"
      )
    ).length;


  const urgentCount =
    incidents.filter((incident) =>
      matchesCategory(
        incident,
        "urgent"
      )
    ).length;


  // ==========================================================
  // INCIDENT TITLE
  // ==========================================================

  const getTitle = (incident) => {

    return (
      incident.title ||
      incident.description ||
      incident.text ||
      incident.event ||
      "Civic incident"
    );
  };


  // ==========================================================
  // INCIDENT DESCRIPTION
  // ==========================================================

  const getDescription = (incident) => {

    return (
      incident.description ||
      incident.summary ||
      incident.text ||
      "No description available."
    );
  };


  // ==========================================================
  // INCIDENT CATEGORY
  // ==========================================================

  const getCategory = (incident) => {

    return (
      incident.prediction ||
      incident.label ||
      incident.category ||
      incident.classification ||
      "Unclassified"
    );
  };


  // ==========================================================
  // INCIDENT URL
  // ==========================================================

  const getUrl = (incident) => {

    return (
      incident.url ||
      incident.link ||
      incident.source_url ||
      null
    );
  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="app">


      {/* ====================================================
          HEADER
      ==================================================== */}

      <header className="header">

        <div className="header-left">

          <div className="logo">
            🌍
          </div>

          <div>

            <h1>
              Civic Incident Intelligence
            </h1>

            <p>
              AI-powered real-time disaster & humanitarian monitoring
            </p>

          </div>

        </div>


        <button
          className="refresh-button"
          onClick={fetchIncidents}
        >
          ↻ &nbsp; Refresh
        </button>

      </header>


      {/* ====================================================
          MAIN
      ==================================================== */}

      <main className="main">


        {/* ==================================================
            LIVE MONITORING
        ================================================== */}

        <div className="monitoring-header">

          <div className="live">

            <span className="live-dot"></span>

            LIVE MONITORING

          </div>

          <div className="ai-text">

            AI classification powered by DistilBERT

          </div>

        </div>


        {/* ==================================================
            STATISTICS
        ================================================== */}

        <section className="stats">


          <div className="stat-card">

            <div className="stat-icon blue">
              ◎
            </div>

            <div>

              <strong>
                {incidents.length}
              </strong>

              <span>
                Total Incidents
              </span>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon orange">
              ⇄
            </div>

            <div>

              <strong>
                {evacuationCount}
              </strong>

              <span>
                Evacuations
              </span>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon red">
              !
            </div>

            <div>

              <strong>
                {injuredCount}
              </strong>

              <span>
                Injuries / Deaths
              </span>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon purple">
              ⚠
            </div>

            <div>

              <strong>
                {urgentCount}
              </strong>

              <span>
                Urgent Needs
              </span>

            </div>

          </div>


        </section>


        {/* ==================================================
            CATEGORY SECTION
        ================================================== */}

        <section className="categories-section">

          <div className="section-heading">

            <div>

              <h2>
                Incident Categories
              </h2>

              <p>
                Filter incidents by AI classification
              </p>

            </div>

            <span className="incident-count">
              {filteredIncidents.length} incidents
            </span>

          </div>


          {/* =================================================
              CATEGORY BUTTONS
          ================================================= */}

          <div className="category-buttons">

            {categories.map((category) => (

              <button
                key={category.key}
                className={
                  selectedCategory === category.key
                    ? "category-button active"
                    : "category-button"
                }
                onClick={() =>
                  setSelectedCategory(category.key)
                }
              >
                {category.label}
              </button>

            ))}

          </div>

        </section>


        {/* ==================================================
            LATEST INCIDENTS
        ================================================== */}

        <section className="latest-section">

          <div className="latest-heading">

            <div>

              <h2>
                Latest Incidents
              </h2>

              <p>
                Automatically classified by AI
              </p>

            </div>

            <span className="classified">
              ✦ AI CLASSIFIED
            </span>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="error-box">

              <h3>
                ⚠ Connection Error
              </h3>

              <p>
                {error}
              </p>

              <button
                onClick={fetchIncidents}
              >
                Try Again
              </button>

            </div>

          )}


          {/* =================================================
              LOADING
          ================================================= */}

          {loading && !error && (

            <div className="empty-box">

              <div className="spinner"></div>

              <h3>
                Loading incidents...
              </h3>

              <p>
                Fetching the latest civic incidents.
              </p>

            </div>

          )}


          {/* =================================================
              NO INCIDENTS
          ================================================= */}

          {!loading &&
            !error &&
            filteredIncidents.length === 0 && (

              <div className="empty-box">

                <div className="empty-icon">
                  ◌
                </div>

                <h3>
                  No incidents found
                </h3>

                <p>
                  There are currently no incidents
                  in this category.
                </p>

              </div>

            )}


          {/* =================================================
              INCIDENT CARDS
          ================================================= */}

          {!loading &&
            !error &&
            filteredIncidents.length > 0 && (

              <div className="incident-grid">

                {filteredIncidents.map(
                  (incident, index) => {

                    const url =
                      getUrl(incident);

                    return (

                      <article
                        className="incident-card"
                        key={
                          incident.id ||
                          incident.eventid ||
                          index
                        }
                      >

                        <div className="incident-number">

                          INCIDENT #{index + 1}

                        </div>


                        <h3>
                          {getTitle(incident)}
                        </h3>


                        <p className="description">

                          {getDescription(incident)}

                        </p>


                        <div className="incident-footer">

                          <span className="category-tag">

                            {getCategory(incident)}

                          </span>


                          {url && (

                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="view-link"
                            >
                              View Source →
                            </a>

                          )}

                        </div>

                      </article>

                    );

                  }
                )}

              </div>

            )}

        </section>


      </main>

    </div>
  );
}

export default App;