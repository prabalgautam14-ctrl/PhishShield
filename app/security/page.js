"use client";

import { useEffect, useState } from "react";

export default function SecurityDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/security");

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load security data"
        );
      }

      setData(result);
    } catch (error) {
      console.error("DASHBOARD ERROR:", error);
      setError("Unable to load security dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSecurityData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          🛡️ Loading Security Dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl text-center">
          <h1 className="text-2xl font-bold text-red-600">
            ⚠️ Error
          </h1>

          <p className="mt-3 text-gray-600 dark:text-gray-400">
            {error}
          </p>

          <button
            onClick={loadSecurityData}
            className="mt-5 px-5 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = data.statistics;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">

      {/* Header */}

      <div className="max-w-7xl mx-auto px-6 pt-10">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              🛡️ Security Dashboard
            </h1>

            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Monitor the security status of your shortened URLs.
            </p>
          </div>

          <button
            onClick={loadSecurityData}
            className="px-5 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 active:scale-95 transition-all"
          >
            🔄 Refresh
          </button>

        </div>


        {/* Statistics */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mt-10">

          {/* Total */}

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">

            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Total URLs
            </p>

            <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">
              {stats.total}
            </p>

          </div>


          {/* Low */}

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">

            <p className="text-gray-500 dark:text-gray-400 font-medium">
              🟢 Low Risk
            </p>

            <p className="text-4xl font-bold text-green-600 mt-2">
              {stats.low}
            </p>

          </div>


          {/* Medium */}

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">

            <p className="text-gray-500 dark:text-gray-400 font-medium">
              🟡 Medium Risk
            </p>

            <p className="text-4xl font-bold text-yellow-500 mt-2">
              {stats.medium}
            </p>

          </div>


          {/* High */}

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">

            <p className="text-gray-500 dark:text-gray-400 font-medium">
              🔴 High Risk
            </p>

            <p className="text-4xl font-bold text-red-600 mt-2">
              {stats.high}
            </p>

          </div>


          {/* Unscanned */}

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">

            <p className="text-gray-500 dark:text-gray-400 font-medium">
              ⚪ Unscanned
            </p>

            <p className="text-4xl font-bold text-gray-500 mt-2">
              {stats.unscanned}
            </p>

          </div>

        </div>


        {/* Security Overview */}

        <div className="mt-10 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Security Overview
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Current distribution of URL security analysis.
          </p>


          <div className="mt-6 space-y-5">

            {/* Low */}

            <div>

              <div className="flex justify-between mb-2">

                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  🟢 Low Risk
                </span>

                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {stats.low}
                </span>

              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">

                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{
                    width:
                      stats.total > 0
                        ? `${(stats.low / stats.total) * 100}%`
                        : "0%",
                  }}
                />

              </div>

            </div>


            {/* Medium */}

            <div>

              <div className="flex justify-between mb-2">

                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  🟡 Medium Risk
                </span>

                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {stats.medium}
                </span>

              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">

                <div
                  className="bg-yellow-500 h-3 rounded-full"
                  style={{
                    width:
                      stats.total > 0
                        ? `${(stats.medium / stats.total) * 100}%`
                        : "0%",
                  }}
                />

              </div>

            </div>


            {/* High */}

            <div>

              <div className="flex justify-between mb-2">

                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  🔴 High Risk
                </span>

                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {stats.high}
                </span>

              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">

                <div
                  className="bg-red-500 h-3 rounded-full"
                  style={{
                    width:
                      stats.total > 0
                        ? `${(stats.high / stats.total) * 100}%`
                        : "0%",
                  }}
                />

              </div>

            </div>

          </div>

        </div>


        {/* URL Security Table */}

        <div className="mt-10 mb-16 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">

          <div className="p-6 border-b border-gray-200 dark:border-gray-800">

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🔗 URL Security History
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Security analysis stored in MongoDB.
            </p>

          </div>


          {data.urls.length === 0 ? (

            <div className="p-10 text-center text-gray-500 dark:text-gray-400">
              No URLs found.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-100 dark:bg-gray-800">

                  <tr>

                    <th className="text-left p-4 text-gray-700 dark:text-gray-300">
                      Short URL
                    </th>

                    <th className="text-left p-4 text-gray-700 dark:text-gray-300">
                      Original URL
                    </th>

                    <th className="text-left p-4 text-gray-700 dark:text-gray-300">
                      Risk Score
                    </th>

                    <th className="text-left p-4 text-gray-700 dark:text-gray-300">
                      Risk Level
                    </th>

                    <th className="text-left p-4 text-gray-700 dark:text-gray-300">
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {data.urls.map((item) => {

                    const security = item.security;

                    let riskClass =
                      "text-gray-500";

                    if (security?.riskLevel === "LOW") {
                      riskClass =
                        "text-green-600";
                    }

                    if (security?.riskLevel === "MEDIUM") {
                      riskClass =
                        "text-yellow-600";
                    }

                    if (security?.riskLevel === "HIGH") {
                      riskClass =
                        "text-red-600";
                    }

                    return (

                      <tr
                        key={item._id}
                        className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >

                        <td className="p-4 font-semibold text-purple-600 dark:text-purple-400">
                          /{item.shorturl}
                        </td>


                        <td className="p-4 max-w-md">

                          <div className="truncate text-gray-700 dark:text-gray-300">
                            {item.url}
                          </div>

                        </td>


                        <td className="p-4">

                          {security ? (

                            <span className="font-bold text-gray-900 dark:text-white">
                              {security.riskScore}/100
                            </span>

                          ) : (
                            <span className="text-gray-400">
                              —
                            </span>
                          )}

                        </td>


                        <td className="p-4">

                          {security ? (

                            <span
                              className={`font-bold ${riskClass}`}
                            >
                              {security.riskLevel}
                            </span>

                          ) : (

                            <span className="text-gray-400">
                              UNSCANNED
                            </span>

                          )}

                        </td>


                        <td className="p-4">

                          {security?.isSuspicious ? (

                            <span className="text-red-600 font-semibold">
                              ⚠️ Suspicious
                            </span>

                          ) : security ? (

                            <span className="text-green-600 font-semibold">
                              ✅ Analyzed
                            </span>

                          ) : (

                            <span className="text-gray-400 font-semibold">
                              Not Scanned
                            </span>

                          )}

                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}