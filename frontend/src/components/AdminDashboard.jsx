import { useState, useEffect } from 'react';
import CourseForm from './CourseForm';
import NoticeForm from './NoticeForm';
import CarouselForm from './CarouselForm';
import Navbar from './Navbar';
import { toast } from 'react-toastify';

function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [notices, setNotices] = useState([]);
  const [carousel, setCarousel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseResponse = await fetch('http://localhost:4000/api/courses');
        if (!courseResponse.ok) throw new Error('Failed to fetch courses');
        const courseData = await courseResponse.json();

        const noticeResponse = await fetch('http://localhost:4000/api/notices');
        if (!noticeResponse.ok) throw new Error('Failed to fetch notices');
        const noticeData = await noticeResponse.json();

        const carouselResponse = await fetch(
          'http://localhost:4000/api/carousel'
        );
        if (!carouselResponse.ok) throw new Error('Failed to fetch carousel');
        const carouselData = await carouselResponse.json();

        console.log('Fetched notices:', noticeData);
        console.log('Fetched carousel:', carouselData);
        setCourses(courseData);
        setNotices(noticeData);
        setCarousel(carouselData);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
        toast.error(err.message);
      }
    };

    fetchData();
  }, []);

  const handleCourseAdded = (newCourse) => {
    setCourses([...courses, newCourse]);
    toast.success('Course added successfully!');
  };

  const handleNoticeAdded = (newNotice) => {
    setNotices([newNotice, ...notices]);
  };

  const handleCarouselAdded = (newCarousel) => {
    setCarousel([newCarousel, ...carousel]);
  };

  const handleDeleteNotice = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/notices/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete notice');
      }
      console.log('Notice deleted:', id);
      setNotices(notices.filter((notice) => notice._id !== id));
      toast.success('Notice deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleDeleteCarousel = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/carousel/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete carousel image');
      }
      console.log('Carousel deleted:', id);
      setCarousel(carousel.filter((item) => item._id !== id));
      toast.success('Carousel image deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message);
      toast.error(err.message);
    }
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-6">{error}</div>;

  return (
    <div className="min-h-screen bg-neutral">
      <Navbar />
      <main className="p-6 max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold mb-6 text-primary">
          Manage Content
        </h2>
        <CourseForm onCourseAdded={handleCourseAdded} />
        <NoticeForm onNoticeAdded={handleNoticeAdded} />
        <CarouselForm onCarouselAdded={handleCarouselAdded} />
        <h2 className="text-xl font-semibold mb-6 text-primary">Course List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white p-4 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-primary">
                {course.code}: {course.name}
              </h3>
              <p className="text-secondary">{course.description}</p>
            </div>
          ))}
        </div>
        <h2 className="text-xl font-semibold mb-6 text-primary">
          Carousel Images
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {carousel.map((item) => (
            <div key={item._id} className="bg-white p-4 border border-gray-200">
              <img
                src={item.image.url}
                alt={item.title}
                className="w-full h-32 object-cover mb-2"
              />
              <h3 className="text-lg font-semibold text-primary">
                {item.title}
              </h3>
              <p className="text-secondary">{item.caption || 'No caption'}</p>
              <p className="text-sm text-secondary">
                Added on: {new Date(item.createdAt).toLocaleDateString()}
              </p>
              <div className="mt-4">
                <button
                  onClick={() => handleDeleteCarousel(item._id)}
                  className="btn bg-red-500 text-white btn-sm"
                >
                  Delete Image
                </button>
              </div>
            </div>
          ))}
        </div>
        <h2 className="text-xl font-semibold mb-6 text-primary">
          Notice Board
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {notices.map((notice) => (
            <div
              key={notice._id}
              className="bg-white p-4 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-primary">
                {notice.title}
              </h3>
              <p className="text-secondary">{notice.content}</p>
              <p className="text-sm text-secondary">
                Posted on: {new Date(notice.date).toLocaleDateString()}
              </p>
              {notice.attachments && notice.attachments.length > 0 ? (
                <div className="mt-4">
                  <p className="font-semibold text-primary">Attachments:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {notice.attachments.map((attachment, index) => (
                      <div key={index} className="mt-2">
                        {attachment.type === 'image' ? (
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={attachment.url}
                              alt="Attachment"
                              className="w-16 h-16 object-cover"
                            />
                          </a>
                        ) : (
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline"
                          >
                            View PDF
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-secondary">No attachments</p>
              )}
              <div className="mt-4">
                <button
                  onClick={() => handleDeleteNotice(notice._id)}
                  className="btn bg-red-500 text-white btn-sm"
                >
                  Delete Notice
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
