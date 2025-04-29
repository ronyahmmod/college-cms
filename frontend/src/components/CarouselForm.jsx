import React, { useState } from 'react';
import { toast } from 'react-toastify';

function CarouselForm({ onCarouselAdded }) {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file && file.size > maxSize) {
      setError('Image too large. Maximum size is 5MB.');
      toast.error('Image too large. Maximum size is 5MB.');
      return;
    }
    setImage(file);
    setError(null);
    console.log('Selected image:', file ? file.name : 'No image');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('caption', caption);
    if (image) formData.append('image', image);

    console.log('FormData contents:', {
      title,
      caption,
      image: image ? image.name : 'No image',
    });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/carousel', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add carousel image');
      }
      const newCarousel = await response.json();
      console.log('New carousel:', newCarousel);
      onCarouselAdded(newCarousel);
      setTitle('');
      setCaption('');
      setImage(null);
      setError(null);
      setLoading(false);
      toast.success('Carousel image added successfully!');
    } catch (err) {
      console.error('Error adding carousel:', err);
      setError(err.message);
      setLoading(false);
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-white p-6 mb-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-primary">
        Add New Carousel Image
      </h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-secondary mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-secondary mb-1">
            Caption (Optional)
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-secondary mb-1">Image (Max 5MB)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input file-input-bordered w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="btn bg-primary text-white w-full"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Image'}
        </button>
      </form>
    </div>
  );
}

export default CarouselForm;
