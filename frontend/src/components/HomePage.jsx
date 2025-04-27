import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/notices');
        if (!response.ok) {
          throw new Error('Failed to fetch notices');
        }
        const data = await response.json();
        setNotices(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  if (loading) return <div className="text-center p-6">Loading</div>;
  if (error)
    return <div className="text-center p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-3xl font-bold">Welcome to Our College</h1>
        <p className="mt-2">Your gateway to knowledge and excellence</p>
      </header>
      <main className="p-6">
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">About Us</h2>
          <p className="text-gray-700">
            Our college is dedicated to providing quality education and
            fostering innovation. Join us to explore a world of opportunaties.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Notice Board</h2>
          <div className="grid grid-cols-1 gap-4">
            {notices.map((notice) => (
              <div key={notice._id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-bold">{notice.title}</h3>
                <p className="text-gray-600">{notice.content}</p>
                <p className="text-sm text-gray-500">
                  Posted on: {new Date(notice.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
export default HomePage;
