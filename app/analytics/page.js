"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AnalyticsPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics");

      const data = await response.json();

      if (data.success) {
        setLinks(data.links);
      }
    } catch (error) {
      console.error("ANALYTICS LOAD ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const totalLinks = links.length;

  const totalClicks = links.reduce(
    (total, link) => total + (link.clicks || 0),
    0
  );

  const legitimateLinks = links.filter(
    (link) =>
      link.security &&
      link.security.result === "legitimate"
  ).length;

  const phishingLinks = links.filter(
    (link) =>
      link.security &&
      link.security.result === "phishing"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              BitLinks Analytics
            </h1>

            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Monitor your shortened links and security status.
            </p>
          </div>

          <Link
            href="/shorten"
            className="bg-purple-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Create Short URL
          </Link>

        </div>

        {/* Statistics */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow">
            <p className="text-gray-500 dark:text-gray-400">
              Total Links
            </p>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {totalLinks}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow">
            <p className="text-gray-500 dark:text-gray-400">
              Total Clicks
            </p>

            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {totalClicks}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow">
            <p className="text-gray-500 dark:text-gray-400">
              Legitimate Links
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {legitimateLinks}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow">
            <p className="text-gray-500 dark:text-gray-400">
              Phishing Blocked
            </p>

            <h2 className="text-3xl font-bold text-red-600 mt-2">
              {phishingLinks}
            </h2>
          </div>

        </div>

        {/* Links Table */}

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">

          <div className="p-6 border-b border-gray-200 dark:border-gray-700">

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Links
            </h2>

          </div>

          {loading ? (

            <div className="p-8 text-center text-gray-500">
              Loading analytics...
            </div>

          ) : links.length === 0 ? (

            <div className="p-8 text-center">

              <p className="text-gray-500 dark:text-gray-400">
                No shortened links found.
              </p>

              <Link
                href="/shorten"
                className="inline-block mt-4 bg-purple-600 text-white px-5 py-3 rounded-lg"
              >
                Create your first link
              </Link>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50 dark:bg-gray-800">

                  <tr>

                    <th className="text-left p-4 text-gray-700 dark:text-gray-300">
                      Short Link
                    </th>

                    <th className="text-left p-4 text-gray-700 dark:text-gray-300">
                      Destination
                    </th>

                    <th className="text-left p-4 text-gray-700 dark:text-gray-300">
                      Clicks
                    </th>

                    <th className="text-left p-4 text-gray-700 dark:text-gray-300">
                      Security
                    </th>

                    <th className="text-left p-4 text-gray-700 dark:text-gray-300">
                      Expiration
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {links.map((link, index) => {

                    const expired =
                      link.expiresAt &&
                      new Date(link.expiresAt) <= new Date();

                    return (

                      <tr
                        key={index}
                        className="border-t border-gray-200 dark:border-gray-700"
                      >

                        <td className="p-4">

                          <a
                            href={"/" + link.shorturl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
                          >
                            /{link.shorturl}
                          </a>

                        </td>

                        <td className="p-4 max-w-xs">

                          <p className="truncate text-gray-700 dark:text-gray-300">
                            {link.url}
                          </p>

                        </td>

                        <td className="p-4">

                          <span className="font-bold text-gray-900 dark:text-white">
                            {link.clicks || 0}
                          </span>

                        </td>

                        <td className="p-4">

                          {link.security?.result === "legitimate" ? (

                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 text-sm font-semibold">
                              🟢 Legitimate
                            </span>

                          ) : link.security?.result === "phishing" ? (

                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-sm font-semibold">
                              🔴 Phishing
                            </span>

                          ) : (

                            <span className="text-gray-500">
                              Not scanned
                            </span>

                          )}

                        </td>

                        <td className="p-4">

                          {!link.expiresAt ? (

                            <span className="text-gray-600 dark:text-gray-400">
                              Never
                            </span>

                          ) : expired ? (

                            <span className="text-red-600 font-semibold">
                              Expired
                            </span>

                          ) : (

                            <span className="text-green-600">
                              {new Date(
                                link.expiresAt
                              ).toLocaleDateString()}
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