console.log('kakao services:', kakao.maps.services);

function getMyLocation() {
    console.log("버튼 클릭됨");

    if (!navigator.geolocation) {
        alert("위치 정보를 지원하지 않는 브라우저입니다.");
        return;
    }

    const statusEl = document.getElementById("status");
    statusEl.innerText = "📡 위치 가져오는 중...";

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
    const ps = new kakao.maps.services.Places();
    const location = new kakao.maps.LatLng(lat, lng);

    ps.categorySearch(
        'FD6', // 음식점
        function (data, status) {
            if (status !== kakao.maps.services.Status.OK) {
                alert('검색 실패');
                return;
            }

            // 전체 리스트 표시
            displayPlaceList(data);

            // 랜덤 추천
            const random = data[Math.floor(Math.random() * data.length)];
            pickRandomPlace(random);
        },
        {
            location: location,
            radius: 500, // 500m 반경
            size: 15   // 한 번에 가져올 최대 개수 (기본 15)
        }
    );
}

// 전체 음식점 리스트 표시
function displayPlaceList(places) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = ""; // 기존 내용 제거

    places.forEach(place => {
        const card = document.createElement("div");
        card.className = "card";
        card.style.cursor = "pointer";

        card.innerHTML = `
            <h2>${place.place_name}</h2>
            <p>거리: ${place.distance}m</p>
        `;

        // 클릭 시 카카오맵 링크 열기
        card.addEventListener("click", () => {
            window.open(place.place_url, "_blank");
        });

        resultDiv.appendChild(card);
    });
}

// 랜덤 추천
function pickRandomPlace(place) {
    const statusEl = document.getElementById("status");
    const placeNameEl = document.getElementById("placeName");
    const distanceEl = document.getElementById("distance");
    const linkEl = document.getElementById("mapLink");

    statusEl.innerText = "🎯 오늘의 추천 점심!";
    placeNameEl.innerText = place.place_name;
    distanceEl.innerText = `거리: ${place.distance}m`;
    linkEl.href = place.place_url;
    linkEl.innerText = "카카오맵에서 보기";
}
