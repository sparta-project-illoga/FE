import React, { useState } from "react";
import { useGeoLocation } from "../hooks/useGeoLocation"; // 가정한 위치

const LocationSender = () => {
  const { location, error } = useGeoLocation();
  const [isSending, setIsSending] = useState(false);

  const sendLocation = async () => {
    if (!location) {
      alert("위치 정보가 없습니다.");
      return;
    }

    setIsSending(true);

    function getJwtTokenFromCookie() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
          const [name, value] = cookie.trim().split('=');
          if (name === 'Authorization') {
            return value;
          }
        }
        return null;
      }

      const jwtToken = getJwtTokenFromCookie();
        if (!jwtToken) {
          alert('JWT 토큰을 찾을 수 없습니다.');
          return;
        }
        console.log(jwtToken)

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}:${process.env.API_PORT}/location`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${jwtToken}`
        },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });

      if (response.ok) {
        alert("위치 정보가 성공적으로 전송되었습니다.");
      } else {
        alert("위치 정보 전송에 실패했습니다.");
      }
    } catch (error) {
      console.error("위치 정보 전송 중 오류 발생:", error);
      alert("위치 정보 전송 중 오류가 발생했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      {error && <p>오류: {error}</p>}
      <button onClick={sendLocation} disabled={isSending}>
        {isSending ? "전송 중..." : "위치 정보 전송"}
      </button>
    </div>
  );
};

export default LocationSender;
