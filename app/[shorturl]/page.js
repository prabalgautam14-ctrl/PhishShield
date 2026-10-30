"use client";

import { useEffect, useState } from "react";

export default function RedirectPage({ params }) {
  const [status, setStatus] = useState("Checking link...");
  const [error, setError] = useState(false);

  useEffect(() => {
    const redirect = async () => {
      try {
        const { shorturl } = await params;

        // Find the short URL
        const response = await fetch(
          "/api/lookup?shorturl=" + encodeURIComponent(shorturl)
        );

        const data = await response.json();

        // Short URL doesn't exist
        if (!response.ok || !data.url) {
          setStatus("Short URL not found");
          setError(true);
          return;
        }

        // Check expiration
        if (data.expiresAt) {
          const expiryDate = new Date(data.expiresAt);
          const currentDate = new Date();

          if (currentDate >= expiryDate) {
            setStatus("This short link has expired");
            setError(true);
            return;
          }
        }

        // Record the click
        try {
          await fetch("/api/click", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              shorturl: shorturl,
            }),
          });
        } catch (clickError) {
          // Don't stop the redirect if click tracking fails
          console.error("CLICK TRACKING ERROR:", clickError);
        }

        // Redirect to original URL
        window.location.href = data.url;
      } catch (error) {
        console.error("REDIRECT ERROR:", error);

        setStatus("Something went wrong");
        setError(true);
      }
    };

    redirect();
  }, [params]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl text-center max-w-md w-full mx-4">
        {error ? (
          <>
            <div className="text-5xl mb-4">⚠️</div>

            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
              Link Unavailable
            </h1>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              {status}
            </p>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">🔗</div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {status}
            </h1>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Please wait while we redirect you...
            </p>
          </>
        )}
      </div>
    </div>
  );
}