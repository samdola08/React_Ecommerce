import React from "react";
import "./ImageUploadCard.css";

const ImageUploadCard = ({ images, onChange, onRemove, onPublish }) => {
  return (
    <div className="imagesUploadSec">
      <h5 className="mb-4">Media And Published</h5>

      <div className="imgUploadBox d-flex align-items-center gap-3 flex-wrap">
        {images.map((img, index) => (
          <div className="uploadBox position-relative" key={index}>
            <span className="remove" onClick={() => onRemove(index)}>
              &times;
            </span>
            <div className="box">
              <img className="w-100" src={img} alt={`img-${index}`} />
            </div>
          </div>
        ))}

        <div className="uploadBox">
          <input
            type="file"
            multiple
            name="images"
            accept="image/*"
            onChange={onChange}
          />
          <div className="info">
            <h5>Upload Image</h5>
          </div>
        </div>
      </div>

   
    </div>
  );
};

export default ImageUploadCard;
