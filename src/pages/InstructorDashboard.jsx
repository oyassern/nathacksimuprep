"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";

function InstructorDashboard({ onHome }) {
  const [results, setResults] = useState([]);
  const [sortBy, setSortBy] = useState(null);

  // ✅ 1. Test connection on page load
  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase.from("results").select("*").limit(1);
      if (error) {
        console.error("❌ Supabase connection failed:", error);
      } else {
        console.log("✅ Supabase connected successfully! Sample data:", data);
      }
    }
    testConnection();
  }, []);

  // ✅ 2. Fetch all results
  async function fetchResults() {
    const { data, error } = await supabase
      .from("results")
      .select("*")
      .order("inserted_at", { ascending: false });

    if (error) {
      console.error("❌ Error fetching results:", error);
    } else {
      setResults(data);
      console.log("📊 Results fetched:", data);
    }
  }

  // ✅ 3. Real-time updates when new data is inserted/updated
  useEffect(() => {
    fetchResults();

    const channel = supabase
      .channel("realtime-results")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "results" },
        (payload) => {
          console.log("🔄 Realtime update detected:", payload);
          fetchResults();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ✅ 4. Sorting logic (same as your old code)
  const sorted = [...results].sort((a, b) =>
    sortBy ? b[sortBy] - a[sortBy] : 0
  );

  // ✅ 5. Render dashboard
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAFBFC",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#002D72",
          color: "#FFF",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <h1>SIMU PREP Instructor Dashboard</h1>
        <button
          style={{
            backgroundColor: "#4EA5D9",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "10px",
            padding: "10px 20px",
            cursor: "pointer",
            fontWeight: "600",
          }}
          onClick={onHome}
        >
          ⬅ Return to Home Page
        </button>
      </div>

      {results.length === 0 ? (
        <p style={{ textAlign: "center", color: "#002D72" }}>
          No student data yet.
        </p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#4EA5D9", color: "#FFF" }}>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Program</th>
              <th>Simulation</th>
              <th onClick={() => setSortBy("confidence")}>Confidence</th>
              <th onClick={() => setSortBy("preparedness")}>Preparedness</th>
              <th>Anxiety</th>
              <th>Stress</th>
              <th onClick={() => setSortBy("score")}>Score</th>
              <th>Inserted At</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => (
              <tr
                key={i}
                style={{
                  backgroundColor: i % 2 ? "#F8F8F8" : "#FFF",
                  textAlign: "center",
                }}
              >
                <td>{s.name}</td>
                <td>{s.id}</td>
                <td>{s.program}</td>
                <td>{s.simulation}</td>
                <td>{s.confidence}</td>
                <td>{s.preparedness}</td>
                <td>{s.anxiety}</td>
                <td>{s.stress}</td>
                <td>{s.score}/5</td>
                <td>
                  {s.inserted_at
                    ? new Date(s.inserted_at).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default InstructorDashboard;

