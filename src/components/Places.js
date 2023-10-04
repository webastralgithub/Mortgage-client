import React, { useState, useRef } from 'react';
import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api";

const Places = ({ value, onChange }) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(value);
  const [useGoogleAddress, setUseGoogleAddress] = useState(true); // Added state for Google address
  const inputRef = useRef();

  const handlePlaceChanged = () => { 
    console.log("sdddddddd");
    const [place] = inputRef.current.getPlaces();
    if (place) {
      const object = {};
      object['address'] = place.formatted_address;
      onChange(place.formatted_address);
      console.log(place);
      console.log(place.formatted_address);
    } 
  }

  const handleManualAddressChange = (event) => {
    const newValue = event.target.value;
    setSelectedAddress(newValue);
    onChange(newValue);
  }

  return (
    <div className="form-user-add-inner-wrap">
      <label>Address</label>
      <div className='address-toggle'>
  
      
          <input
            type="radio"
            name="addressType"
            value="google"
            checked={useGoogleAddress}
            onChange={() => {
           
              setUseGoogleAddress(true)
            }}
          />
            <label>
          Google
        </label>
        
      
          <input
            type="radio"
            name="addressType"
            value="manual"
            checked={!useGoogleAddress}
            onChange={() =>
              {

                setUseGoogleAddress(false)
              }
            }
          />
            <label>
          Manual
        </label>
   
      </div>
      {useGoogleAddress ? (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_SECRET_API_KEY}  libraries={["places"]}>
          <StandaloneSearchBox
      
            onLoad={(ref) => (inputRef.current = ref)}
            onPlacesChanged={handlePlaceChanged}

          >
              <div             style={{marginTop:"-9px"}} className="edit-new-input">
            <input
              defaultValue={value}
              type="text"
              placeholder="Enter Google Address"
              disabled={!useGoogleAddress}
            />
            </div>
          </StandaloneSearchBox>
        </LoadScript>
      ) : (
        <div  className="edit-new-input">
        <input
          type="text"
          value={value}
          onChange={handleManualAddressChange}
          placeholder="Enter Manual Address"
        />
        </div>
      )}
    </div>
  );
};

export default Places;
