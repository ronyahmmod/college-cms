import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/courses'); // NOT http://localhost:5000/api/courses
        if (!response.ok) {
          throw new Error(
            `HTTP error! Status: ${response.status}, Message: ${response.statusText}`
          );
        }
        const data = await response.json();
        setCourses(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error)
    return <div className="text-center p-6 text-red-500">Error: {error}</div>;
  return (
    <div className="main-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">College CMS Dashboard</h1>
      </header>
      <main className="p-6">
        <h2 className="text-xl font-semibold mb-4">Course List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div key={course._id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold">
                {course.code}: {course.name}
              </h3>
              <p className="text-gray-600">{course.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
