# TroubleShooting

[1. Postcss 적용](#1-postcss-적용)

## 1. PostCSS 적용

다양한 브라우저의 호환성을 위해 **PostCSS**를 사용하기로 했다.  
**PostCSS**는 CSS **후처리기(Post-Processor)**로, 이미 완성된 CSS 코드를 추가적으로 변환한다.  
즉, **벤더 프리픽스를 일일이 추가할 필요 없이 자동으로 변환해 주는 장점**이 있다.

---

위 명령어를 실행하여 PostCSS와 관련 플러그인을 설치한 후,
postcss.config.js 파일을 생성하고 다음과 같이 설정했다.

```
import autoprefixer from 'autoprefixer';
import postcssPresetEnv from 'postcss-preset-env';

export default {
  plugins: [autoprefixer(), postcssPresetEnv({ stage: 1 })],
};
```

그리고 vite.config.ts 파일에서 PostCSS 설정을 추가했다.

```
export default defineConfig({
  ...
  css: {
    postcss: './postcss.config.js',
  },
  ...
});
```

📌 하지만 npm run build를 실행한 후 번들링된 CSS 파일을 확인했을 때, -webkit- 같은 프리픽스가 적용되지 않았다.
이 때문에 PostCSS가 정상적으로 동작하지 않는다고 생각했다.

---

🟢 해결 방법

문제의 원인은 PostCSS가 적용되지 않은 것이 아니라, 최신 브라우저가 프리픽스를 필요로 하지 않았기 때문이었다.

    최신 브라우저는 이미 많은 CSS 속성을 기본 지원하기 때문에, PostCSS가 프리픽스를 자동으로 추가하지 않음.

📌 따라서, package.json의 browserslist 설정을 추가하여 지원할 브라우저 범위를 명확하게 지정했다.

```
"browserslist": [
  "> 0.2%",         // 전 세계 점유율 0.2% 이상인 브라우저 지원
  "last 5 versions", // 각 브라우저의 최근 5개 버전 지원
  "Firefox ESR",    // Firefox의 장기 지원 버전(ESR) 지원
  "not dead",       // 더 이상 업데이트되지 않는 브라우저 제외
  "ie >= 10",       // Internet Explorer 10 이상 지원
  "Chrome >= 30",   // Chrome 30 이상 지원
  "Safari >= 7"     // Safari 7 이상 지원
]
```

📌 이 설정을 추가한 후 다시 npm run build를 실행하자, 벤더 프리픽스가 정상적으로 추가되었다.

---

💡 트러블슈팅 정리

최신 브라우저의 성능이 많이 향상되었기 때문에,
사용자의 연령대, 지역, 기기 환경 등을 고려하여 적절한 browserslist 설정을 적용하는 것이 중요하다.

✅ 앞으로 브라우저 지원 범위를 설정할 때, 프로젝트에 맞게 최적화된 설정을 고민해보자! 🚀🔥
