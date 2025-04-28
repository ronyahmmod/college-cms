import { useState } from 'react';
import { toast } from 'react-toastify';

function NoticeForm({ onNoticeAdded }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    const maxSize = 10 * 1024 * 1024; // 10MB
    for (let i = 0; i < selectedFiles.length; i++) {
      if (selectedFiles[i].size > maxSize) {
        setError('File too large. Maximum size is 10MB.');
        toast.error('File too large. Maximum size is 10MB.');
        return;
      }
    }
    setFiles(selectedFiles);
    setError(null);
    console.log(
      'Selected files:',
      Array.from(selectedFiles).map((f) => f.name)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    for (let i = 0; i < files.length; i++) {
      formData.append('attachments', files[i]);
    }

    console.log('FormData contents:', {
      title,
      content,
      attachments: Array.from(files).map((f) => f.name),
    });

    try {
      const response = await fetch('http://localhost:4000/api/notices', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add notice');
      }
      const newNotice = await response.json();
      console.log('New notice:', newNotice);
      onNoticeAdded(newNotice);
      setTitle('');
      setContent('');
      setFiles([]);
      setError(null);
      setLoading(false);
      toast.success('Notice added successfully!');
    } catch (err) {
      console.error('Error adding notice:', err);
      setError(err.message);
      setLoading(false);
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-white p-6 mb-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-primary">
        Add New Notice
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
          <label className="block text-secondary mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="textarea textarea-bordered w-full"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-secondary mb-1">
            Attachments (Images or PDFs, max 10MB)
          </label>
          <input
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
          />
        </div>
        <button
          type="submit"
          className="btn bg-primary text-white w-full"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Notice'}
        </button>
      </form>
    </div>
  );
}

export default NoticeForm;
