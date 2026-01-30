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

            // ✅ 카카오 SDK 완전히 로드된 후 실행
            kakao.maps.load(() => {
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
    const ps = new kakao.maps.services.Places();

    ps.categorySearch(
        "FD6",
        (data, status) => {
            if (status !== kakao.maps.services.Status.OK || data.length === 0) {
                document.getElementById("status").innerText =
                    "❌ 음식점을 찾을 수 없습니다.";
                return;
            }

            pickRandomPlace(data);
        },
        {
            location: new kakao.maps.LatLng(lat, lng),
            radius: 1000,
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
