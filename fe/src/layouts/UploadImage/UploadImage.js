import { useRef, useState } from "react";
import "./UploadImage.scss";
import axios from "axios";
import { getCookie } from "../../helpers/cookie";

function UploadImage() {
  const token = getCookie("token");
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const image = e.target.files[0];
    if (!image) return;
    setSelectedFile(image);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select an image");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a title for the image");
      return;
    }

    const formData = new FormData();
    formData.append("file_name", selectedFile);
    formData.append("title", title);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/photos/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(response.data.message, response.data.result);
        setTitle("");
        setSelectedFile(null);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error in file upload:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <div className="form-group">
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter image title"
        />
      </div>

      <div className="form-group">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <button
          type="button"
          className="choose-image-btn"
          onClick={() => fileInputRef.current.click()}
        >
          Choose image
        </button>
        {selectedFile && (
          <div className="selected-file">
            Selected file: {selectedFile.name}
            <button
              type="button"
              className="remove-btn"
              onClick={() => setSelectedFile(null)}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" className="submit-btn">
        Upload
      </button>
    </form>
  );
}

export default UploadImage;
