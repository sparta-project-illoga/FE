import { useState, useEffect } from "react";

const useGeoLocation = (options = {}) => {
  const [location, setLocation] = useState(); // location 정보 저장
  const [error, setError] = useState(""); // 에러메시지 저장

  // getCurrentPosition 메소드에 대한 성공 callback 핸들러
  const handleSuccess = (pos) => {
    const { latitude, longitude } = pos.coords;

    setLocation({
      latitude,
      longitude,
    });
  };
  // getCurrentPosition 메소드에 대한 실패 callback 핸들러
  const handleError = (err) => {
    setError(err.message);
  };

  useEffect(() => {
    const { geolocation } = navigator;
    // 사용된 브라우저에서 지리적 위치(Geolocation)가 정의되지 않은 경우 오류로 처리
    if (!geolocation) {
      setError("지원되지 않는 지역입니다.");
      return;
    }
    const handleSuccess = (pos) => {
      const { latitude, longitude } = pos.coords;
      setLocation({ latitude, longitude });
    };

    const handleError = (err) => {
      if (err.code === 1) {
        setError(
          "사용자가 요청을 거부했습니다. 주소창 왼쪽 버튼을 눌러 허용해주세요."
        );
      } else {
        setError(`Geolocation error (code ${err.code}): ${err.message}`);
      }
    };
    // Geolocation API 호출
    geolocation.getCurrentPosition(handleSuccess, handleError, options);
  }, [options]);

  return { location, error };
};

export default useGeoLocation;
