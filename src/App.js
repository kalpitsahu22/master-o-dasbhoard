import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Download, Mail, Eye } from "lucide-react";

const metrics = [
  { id: "masterOId", label: "Master-O ID", type: "id" },
  { id: "contentLaunchDate", label: "Content Launch Date", type: "date" },
  { id: "challenges", label: "Challenges", type: "text" },
  { id: "completionStatus", label: "Completion Status", type: "status" },
  { id: "completionDate", label: "Completion Date", type: "date" },
  { id: "completedInDays", label: "Completed In Days", type: "number" },
  { id: "attempts", label: "Attempts", type: "number" },
  { id: "score", label: "Score", type: "number" },
  { id: "maxScore", label: "Max Score", type: "number" },
  { id: "timeSpent", label: "Time Spent", type: "duration" },
  { id: "microskillName", label: "Microskill Name", type: "text" },
  { id: "loginStatus", label: "Login Status", type: "status" },
  { id: "lastLoginDate", label: "Last Login Date", type: "date" },
];

const App = () => {
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [sampleData, setSampleData] = useState([]);

  const generateSampleData = () => {
    const data = [];
    for (let i = 0; i < 5; i++) {
      const row = { date: `2025-0${i + 1}-01` };
      selectedMetrics.forEach((metric) => {
        const metricType = metrics.find((m) => m.id === metric)?.type;
        if (metricType === "number") {
          row[metric] = Math.floor(Math.random() * 100);
        } else if (metricType === "status") {
          row[metric] = ["Complete", "In Progress", "Not Started"][
            Math.floor(Math.random() * 3)
          ];
        } else if (metricType === "duration") {
          row[metric] = `${Math.floor(Math.random() * 120)} mins`;
        } else {
          row[metric] = `Sample ${metric} ${i + 1}`;
        }
      });
      data.push(row);
    }
    setSampleData(data);
  };

  const generateCSV = () => {
    if (sampleData.length === 0) return;

    const headers = ["date", ...selectedMetrics];
    const csvContent = [
      headers.join(","),
      ...sampleData.map((row) =>
        headers.map((header) => row[header] || "").join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "custom-report.csv";
    a.click();
  };

  const toggleMetric = (id) => {
    setSelectedMetrics((prev) =>
      prev.includes(id) ? prev.filter((metric) => metric !== id) : [...prev, id]
    );
  };

  return (
    <>
      <div className="instruction">
        <p className="disclaimer">
          Select the metrics and then click on the{" "}
          <strong>Preview Report</strong> button to view the report.
        </p>
      </div>
      <div className="dashboard">
        <div className="header">
          <h1>Custom Report Builder</h1>
          <p>Build your custom reports by selecting metrics and actions.</p>
        </div>

        <div className="content">
          <div className="sidebar">
            <h2>Metrics</h2>
            <div className="metrics-list">
              {metrics.map((metric) => (
                <div key={metric.id} className="metric-item">
                  <input
                    type="checkbox"
                    id={metric.id}
                    onChange={() => toggleMetric(metric.id)}
                  />
                  <label htmlFor={metric.id}>{metric.label}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="main">
            <div className="actions">
              <button
                onClick={generateSampleData}
                disabled={!selectedMetrics.length}
                className="btn primary"
              >
                <Eye /> Preview Report
              </button>
              <button
                onClick={generateCSV}
                disabled={!sampleData.length}
                className="btn"
              >
                <Download /> Download CSV
              </button>
              <button disabled={!sampleData.length} className="btn">
                <Mail /> Email Report
              </button>
            </div>

            {sampleData.length > 0 && (
              <div className="chart-container">
                <LineChart
                  width={700}
                  height={400}
                  data={sampleData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {selectedMetrics.map(
                    (metric, index) =>
                      metrics.find((m) => m.id === metric)?.type ===
                        "number" && (
                        <Line
                          key={metric}
                          type="monotone"
                          dataKey={metric}
                          stroke={`hsl(${index * 30}, 70%, 50%)`}
                        />
                      )
                  )}
                </LineChart>
              </div>
            )}

            <div className="table-container">
              <h2 className="report">Report Preview</h2>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    {selectedMetrics.map((metric) => (
                      <th key={metric}>
                        {metrics.find((m) => m.id === metric)?.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sampleData.map((row, i) => (
                    <tr key={i}>
                      <td>{row.date}</td>
                      {selectedMetrics.map((metric) => (
                        <td key={metric}>{row[metric]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <style jsx>{`
          .dashboard {
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 1200px;
            margin: auto;
            background-color: #42c4ff29;
            /* border: 1px solid black; */
            border-radius: 16px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          }
          body {
            margin: 16px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            margin: 0;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            padding: 8px;
          }
          .header h1 {
            font-size: 24px;
            margin: 0;
            color: #005da6;
          }
          .header p {
            color: #005da6;
            margin: 8px;
          }
          .content {
            display: flex;
          }
          .sidebar {
            flex: 1;
            margin-right: 20px;
          }
          .sidebar h2 {
            font-size: 20px;
            margin-bottom: 10px;
          }
          .report {
            margin: 0;
            padding: 16px 8px;
          }
          .metrics-list {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          }
          .metric-item {
            margin-bottom: 8px;
          }
          .main {
            flex: 3;
          }
          .actions {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
          }
          .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
          .btn.primary {
            background: #0066b7;
            color: white;
          }
          .btn:disabled {
            background: #ccc;
            cursor: not-allowed;
          }
          .chart-container {
            margin-bottom: 20px;
          }
          .table-container {
            border-radius: 8px;
            border: 1px solid #005da6;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          }
          table {
            width: 100%;
            border-collapse: collapse;
            border-radius: 8px;
          }
          th,
          td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background: #f4f4f4;
          }
          .instruction {
            font-family: Arial, sans-serif;
            font-size: 18px;
            margin-top: 20px;
            text-align: center;
            color: #333;
          }
          .disclaimer {
            font-size: 14px;
            margin-top: 10px;
            color: #555;
            background-color: #fffece;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }
        `}</style>
      </div>
    </>
  );
};

export default App;
