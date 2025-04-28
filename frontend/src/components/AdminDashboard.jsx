import React, { useState, useEffect } from 'react';
import CourseForm from './CourseForm';
import NoticeForm from './NoticeForm';

function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses
        const courseResponse = await fetch('http://localhost:4000/api/courses');
        if (!courseResponse.ok) {
          throw new Error('Failed to fetch courses');
        }
        const courseData = await courseResponse.json();

        // Fetch notices
        const noticeResponse = await fetch('http://localhost:4000/api/notices');
        if (!noticeResponse.ok) {
          throw new Error('Failed to fetch notices');
        }
        const noticeData = await noticeResponse.json();

        setCourses(courseData);
        setNotices(noticeData);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCourseAdded = (newCourse) => {
    setCourses([...courses, newCourse]);
  };

  const handleNoticeAdded = (newNotice) => {
    setNotices([newNotice, ...notices]);
  };

  const handleDeleteNotice = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/notices/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete notice');
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error)
    return <div className="text-center p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">College CMS Admin Dashboard</h1>
      </header>
      <main className="p-6">
        <h2 className="text-xl font-semibold mb-4">Manage Content</h2>
        <CourseForm onCourseAdded={handleCourseAdded} />
        <NoticeForm onNoticeAdded={handleNoticeAdded} />
        <h2 className="text-xl font-semibold mb-4">Course List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold">
                {course.code}: {course.name}
              </h3>
              <p className="text-gray-600">{course.description}</p>
            </div>
          ))}
        </div>
        <h2 className="text-xl font-semibold mb-4">Notice Board</h2>
        <div className="grid grid-cols-1 gap-4">
          {notices.map((notice) => (
            <div key={notice._id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold">{notice.title}</h3>
              <p className="text-gray-600">{notice.content}</p>
              <p className="text-sm text-gray-500">
                Posted on: {new Date(notice.date).toLocaleDateString()}
              </p>
              {notice.attachments && notice.attachments.length > 0 && (
                <div className="mt-2">
                  <p className="font-semibold">Attachments:</p>
                  {notice.attachments.map((attachment, index) => (
                    <div key={index} className="mt-1">
                      {attachment.type === 'image' ? (
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={attachment.url}
                            alt="Attachment"
                            className="w-32 h-32 object-cover rounded"
                          />
                        </a>
                      ) : (
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View PDF
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => handleDeleteNotice(notice._id)}
                className="mt-2 bg-red-600 text-white p-2 rounded hover:bg-red-700"
              >
                Delete Notice
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
