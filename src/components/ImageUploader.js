import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState,useEffect } from "react";

const ImageUploader = (props) => {



  const {images,setImages,mainImage,setMainImage,headers,url}=props
  const fileRef = useRef(null);
  useEffect(() => {
    if (images?.length > 0 && !mainImage) {
      setMainImage(images[0]);
    }
  }, [images, mainImage]);
  const handleImageChange = async (e) => {
    const selectedImages = Array.from(e.target.files);
    const imageUrls = selectedImages.map((image) => URL.createObjectURL(image));
  
   
  
    // Create a FormData object to send the selected images to the server
    const formData = new FormData();
    selectedImages.forEach((image, index) => {
      formData.append(`images`, image);
    });
  
    try {
      const response = await fetch(`${url}api/upload-images`, {
        method: 'POST', // Use POST for file uploads
      headers,
      body: formData,
      });
  
      if (response.ok) {
        const responseData = await response.json(); // Parse the JSON response
        const uploadedImageUrls = responseData.imageUrls
        setImages((prevImages) => [...(prevImages || []), ...uploadedImageUrls]);


        console.log(responseData)
        // Handle a successful API response here, if needed
      } else {
        // Handle API errors here, if needed
      }
    } catch (error) {
      // Handle network errors or other exceptions here
      console.error('Error uploading images:', error);
    }
  };
  
  const deleteImage = (image) => {
    setImages(images.filter(i => i !== image));
  }
  const setAsMainImage = (image) => {
    setMainImage(image);
  };

  return (
    <div className="image-uploader">
      <label className="form-label">Upload Images</label>

   

      <div className="upload-container">
        <input
          type="file"
          accept="image/*"
          multiple
          className="file-input"
          ref={fileRef}
          onChange={handleImageChange}
        />

        <div className="upload-text"  onClick={() => fileRef.current.click()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="upload-icon"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clipRule="evenodd"
            />
          </svg>

          <span>Upload Images</span>
        </div>
      </div>

      <div className="selected-images">
      
          {mainImage&&<div  className="image-item">
           
          <img
              src={mainImage}
              alt="Main Image"
           
            />
         
        
        <FontAwesomeIcon 
  icon={faTrash}
  className="delete-icon"
  onClick={() => deleteImage(mainImage)} 
/>
     <div className="thumb-container">
     <div className="upload-container thumb-img">
        <input
          type="file"
          accept="image/*"
          multiple
          className="file-input"
          ref={fileRef}
          onChange={handleImageChange}
        />

        <div className="upload-text upload-thumbnails"  onClick={() => fileRef.current.click()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="upload-icon"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clipRule="evenodd"
            />
          </svg>

          <span>Upload Thumbnails</span>
        </div>
</div>
      <div className="thumb-image-container">
    {console.log(typeof images,"Fffffd")}
      {images && images?.length>0 && images?.map((image, index) => ( <div key={index} className="thumb-images-inner"   onClick={() => setAsMainImage(image)}>
        <img
              src={image}
              alt={`Image ${index + 1}`}
     
            />
       
        <FontAwesomeIcon 
  icon={faTrash}
  className="delete-icon"
  onClick={() => deleteImage(image)} 
/>
      </div> ))}
      </div>
      </div>
          </div>}
     
      </div>
    </div>
  );
};

export default ImageUploader;