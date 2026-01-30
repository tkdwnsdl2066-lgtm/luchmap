console.log('kakao services:', kakao.maps.services);
function getMyLocation() {
    console.log("버튼 클릭됨");

    if (!navigator.geolocation) {
        alert("위치 정보를 지원하지 않는 브라우저입니다.");
        return;
    }

    document.getElementById("status").innerText = "📡 위치 가져오는 중...";

    navigator.geolocation.getCurrentPosition(
        (position) => {
            console.log("위치 성공", position.coords);

            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            kakao.maps.load(() => {
                if (!kakao.maps.services) {
                    alert("카카오 장소 서비스가 로드되지 않았습니다.");
                    return;
                }
                searchRestaurants(lat, lng);
            });
        },
        (error) => {
            console.log("위치 실패", error);
            alert("위치 권한을 허용해주세요.");
        }
    );
}

function searchRestaurants(lat, lng) {
  if (!kakao.maps.services) {
    alert('카카오 services 로드 안됨');
    return;
  }

  const ps = new kakao.maps.services.Places();

  const location = new kakao.maps.LatLng(lat, lng);

  ps.categorySearch(
    'FD6', // 음식점
    function (data, status) {
      if (status !== kakao.maps.services.Status.OK) {
        alert('검색 실패');
        return;
      }

      const random = data[Math.floor(Math.random() * data.length)];
      alert(`오늘의 점심: ${random.place_name}`);
    },
    {
      location: location,
      radius: 500,
    }
  );
}

function pickRandomPlace(places) {
    const place = places[Math.floor(Math.random() * places.length)];

    document.getElementById("status").innerText = "🎯 오늘의 추천 점심!";
    document.getElementById("placeName").innerText = place.place_name;
    document.getElementById("distance").innerText = `거리: ${place.distance}m`;

    const link = document.getElementById("mapLink");
    link.href = place.place_url;
    link.innerText = "카카오맵에서 보기";
}
