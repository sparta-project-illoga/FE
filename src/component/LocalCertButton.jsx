import React, { useState } from 'react';
import useCurrentLocation from '../hooks/useCurrentPosition';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Swal from 'sweetalert2';

const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 1000 * 60 * 1, 
  maximumAge: 1000 * 3600 * 24,
};

const LocationAuthModal = () => {
  const [showModal, setShowModal] = useState(false);
  const { location: currentLocation, error: currentError } = useCurrentLocation(geolocationOptions);
  const [cookies] = useCookies(['Authorization']);

  const handleLocationAuth = async () => {
    const locationData = {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
    };
    try {
      const token = cookies.Authorization.replace('Bearer ', ''); 
    await axios.put(`${process.env.REACT_APP_API_URL}/location`, locationData, {
      headers: {
        Authorization: `Bearer ${token}`
        }, withCredentials: true
    })
    console.log('Latitude:', currentLocation.latitude);
    console.log('Longitude:', currentLocation.longitude);
    setShowModal(false);
  } catch (error) {
    console.error('위치 정보 전송 실패', error)
  }
}

const handleOpenModal = () => {
  setShowModal(true);
};

const handleCloseModal = () => {
  setShowModal(false);
};

const handleConfirmLocation = () => {
  if (currentError) {
    Swal.fire({
      title: '위치 정보 공유 거부',
      text: currentError,
      icon: 'error',
      confirmButtonText: '확인',
    });
    handleCloseModal();
    return;
  }
  Swal.fire({
    title: "지역인증 확인",
    html: `사용자의 현재 위치 정보(위도: ${currentLocation.latitude}, 경도: ${currentLocation.longitude})를 서버에 저장하시겠습니까?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "확인",
    cancelButtonText: "취소",
  }).then((result) => {
    if (result.isConfirmed) {
      handleLocationAuth();
    } else {
      handleCloseModal();
    }
  });
};

  return (
    <>
      <button onClick={handleOpenModal}>지역인증</button>

      {showModal && handleConfirmLocation()}
    </>
  );
};

export default LocationAuthModal;
