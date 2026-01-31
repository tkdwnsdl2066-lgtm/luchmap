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

            if (data.length === 0) {
                alert("주변 음식점이 없습니다.");
                return;
            }

            // 리스트 섞기
            const shuffled = data.sort(() => Math.random() - 0.5);

            // 랜덤 추천 하나 선택
            const random = shuffled[Math.floor(Math.random() * shuffled.length)];

            // 추천 음식점은 마지막에 넣기
            const listWithoutRandom = shuffled.filter(p => p.id !== random.id);
            listWithoutRandom.push(random);

            displayPlaceList(listWithoutRandom, random);
        },
        {
            location: location,
            radius: 500, // 500m 반경
            size: 15
        }
    );
}

// 전체 음식점 리스트 표시 + 마지막 카드에 추천
function displayPlaceList(places, randomPlace) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = ""; // 초기화

    places.forEach((place, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.style.cursor = "pointer";

        let categoryText = place.category_name ? `(${place.category_name.split('>')[1].trim()})` : "";

        card.innerHTML = `
            <h2>${place.place_name} ${categoryText}</h2>
            <p>거리: ${place.distance}m</p>
        `;

        // 클릭 시 카카오맵 링크 열기
        card.addEventListener("click", () => {
            window.open(place.place_url, "_blank");
        });

        // 랜덤 추천 음식점이면 하이라이트
        if (place.id === randomPlace.id) {
            card.style.backgroundColor = "#fffae6";
            card.style.border = "2px solid #ffcd00";
        }

        resultDiv.appendChild(card);
    });

    // 상태 텍스트 업데이트
    document.getElementById("status").innerText = "🎯 오늘의 추천 점심!";
    document.getElementById("placeName").innerText = randomPlace.place_name;
    document.getElementById("distance").innerText = `거리: ${randomPlace.distance}m`;

    const linkEl = document.getElementById("mapLink");
    linkEl.href = randomPlace.place_url;
    linkEl.innerText = "카카오맵에서 보기";
}
