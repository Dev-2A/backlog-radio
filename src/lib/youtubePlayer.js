/**
 * YouTube IFrame API 스크립트를 한 번만 로드한다.
 * 여러 컴포넌트에서 동시에 호출해도 하나의 Promise를 공유.
 */

let apiPromise = null;

export function loadYouTubeIframeApi() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("서버에서는 로드할 수 없습니다."));
  }

  // 이미 로드됐으면 즉시 resolve
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }

  // 이미 로딩 중이면 같은 Promise 재사용
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve, reject) => {
    // 기존 스크립트 태그가 있는지 확인 (dev 모드 HMR 대응)
    const existing = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );

    // YT API가 이미 스크립트를 로드했지만 콜백을 놓친 경우
    const checkInterval = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(checkInterval);
        resolve(window.YT);
      }
    }, 100);

    // 타임아웃 (10초)
    setTimeout(() => {
      clearInterval(checkInterval);
      if (!window.YT || !window.YT.Player) {
        reject(new Error("YouTube IFrame API 로드 타임아웃"));
      }
    }, 10000);

    // 공식 콜백도 등록
    const prevCallback = window.onYoutubeIframeAPIReady;
    window.onYoutubeIframeAPIReady = () => {
      if (prevCallback) prevCallback();
      clearInterval(checkInterval);
      resolve(window.YT);
    };

    // 스크립트 태그가 아직 없으면 삽입
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = () => {
        clearInterval(checkInterval);
        reject(new Error("YouTube IFrame API 스크립트 로드 실패"));
      };
      document.head.appendChild(script);
    }
  });

  return apiPromise;
}

/**
 * YouTube Player State 상수
 * (API가 로드되기 전에도 쓸 수 있도록 직접 정의)
 */
export const YT_STATE = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
};
