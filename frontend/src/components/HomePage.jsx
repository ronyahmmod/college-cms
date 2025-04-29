import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

function HomePage() {
  const [notices, setNotices] = useState([]);
  const [carousel, setCarousel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const noticeResponse = await fetch('http://localhost:4000/api/notices');
        if (!noticeResponse.ok) {
          throw new Error('Failed to fetch notices');
        }
        const noticeData = await noticeResponse.json();
        console.log('Fetched notices:', noticeData);

        const carouselResponse = await fetch(
          'http://localhost:4000/api/carousel'
        );
        if (!carouselResponse.ok) {
          throw new Error('Failed to fetch carousel');
        }
        const carouselData = await carouselResponse.json();
        console.log('Fetched carousel:', carouselData);

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

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-6">{error}</div>;

  return (
    <div className="min-h-screen bg-neutral">
      <Navbar />
      <header className="bg-primary text-white p-6 text-center">
        <h1 className="text-2xl font-semibold">Welcome to Our College</h1>
        <p className="mt-2">Your gateway to knowledge and excellence</p>
      </header>
      {carousel.length > 0 && (
        <section className="mb-6">
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation
            autoplay={{ delay: 5000 }}
            loop={true}
            className="w-full h-64"
          >
            {carousel.map((item) => (
              <SwiperSlide key={item._id}>
                <div className="relative w-full h-64">
                  <img
                    src={item.image.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-4 w-full">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    {item.caption && <p className="text-sm">{item.caption}</p>}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}
      <main className="p-6 max-w-7xl mx-auto">
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-primary">About Us</h2>
          <p className="text-secondary">
            Our college is dedicated to providing quality education and
            fostering innovation. Join us to explore a world of opportunities.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-4 text-primary">
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
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
