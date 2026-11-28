const isKorean = new URLSearchParams(location.search).get('lang') === 'ko';
const languageSwitch = document.querySelector('.language-switch');

function updateLanguageSwitch() {
  const url = new URL(location.href);
  if (isKorean) {
    url.searchParams.delete('lang');
  } else {
    url.searchParams.set('lang', 'ko');
  }
  languageSwitch.href = `${url.pathname}${url.search}${url.hash}`;
}

updateLanguageSwitch();
window.addEventListener('hashchange', updateLanguageSwitch);

if (isKorean) {
  document.documentElement.lang = 'ko';
  document.title = '애틀랜타 코딩 아카데미 | 목적을 담아 만듭니다';
  document.querySelector('meta[name="description"]').content =
    '애틀랜타의 신앙 중심 코딩 교육을 위한 준비 단계의 비전입니다. 수업은 아직 시작되지 않았으며 등록과 장학금 신청도 열리지 않았습니다.';
  languageSwitch.textContent = 'English';
  languageSwitch.lang = 'en';
  languageSwitch.hreflang = 'en';
  languageSwitch.setAttribute('aria-label', 'View in English');
  document.querySelector('.launch-status').setAttribute('aria-label', '아카데미 현재 진행 상황');
  document.querySelector('.brand').setAttribute('aria-label', '애틀랜타 코딩 아카데미 홈');
  document.querySelector('.primary-nav').setAttribute('aria-label', '주 메뉴');
  document.querySelector('.hero-art img').alt = '나무 사이로 보이는 노을 속 애틀랜타 스카이라인과 녹지 산책로를 걷는 사람들.';

  const content = {
    '.skip-link': '본문으로 건너뛰기',
    '.launch-status strong': '개설 준비 단계 / 비전 구상 중',
    '.launch-status-inner > span': '수업은 아직 시작되지 않았으며 등록도 열리지 않았습니다.',
    '.primary-nav a:nth-child(1)': '설립 목적',
    '.primary-nav a:nth-child(2)': '배움',
    '.primary-nav a:nth-child(3)': '애틀랜타',
    '.primary-nav a:nth-child(4)': '설립자',
    '.header-connect': '문의하기',
    '.hero-copy .eyebrow': '<span class="eyebrow-rule"></span> 애틀랜타 / 신앙 / 기술',
    '#hero-title': '목적을 담아 코딩하고,<br><em>선을 위해 만듭니다.</em>',
    '.hero-lede': '우리는 실용적인 기술을 익히고 하나님과 이웃을 섬기는 작업을 할 수 있도록 돕는 애틀랜타의 신앙 중심 코딩 교육을 꿈꿉니다.',
    '.hero-actions .button': '이사야에게 연락하기',
    '.hero-art figcaption': '애틀랜타를 위한 비전, 그 너머까지 이어지는 섬김.',
    '.mission-section .section-label .eyebrow': '01 <span>/</span> 부르심',
    '.mission-section .section-aside': '실용적인 기술. 지속되는 목적.',
    '#mission-title': '기술은 도구입니다.<br><em>섬김이 목적입니다.</em>',
    '.mission-copy .lead': '우리의 비전은 실용적인 기술 교육의 기회를 넓히고, 사람들이 자신의 은사를 사용하여 하나님과 이웃을 섬기도록 돕는 것입니다.',
    '.mission-copy p:nth-child(2)': '수감 생활을 경험한 분들을 포함한 모든 학습자를 존엄하게 맞이하고, 각자의 아이디어를 유익하고 아름다운 작업으로 발전시키도록 돕고자 합니다.',
    '.calling-scripture-label': '은혜 / 회복 / 섬김',
    '.mission-close': '교실을 넘어, 가족들이 뿌리를 내리고 번성할 수 있는 애틀랜타에 기여하기를 바랍니다.',
    '.faith-copy .eyebrow': '말씀 / 성령 / 증언',
    '#faith-title': '말씀을 읽고,<br><em>성령 안에서 행합니다.</em>',
    '.faith-copy p:nth-of-type(2)': '우리는 완전한 킹제임스 성경에 뿌리를 둔 성경 공부를 통해 학습자들이 직접 말씀을 읽을 수 있는 공간을 꿈꿉니다.',
    '.faith-copy p:nth-of-type(3)': '요한복음 15장 26절은 보혜사이신 진리의 성령께서 그리스도를 증언하신다는 것을 일깨워 줍니다.',
    '.scripture-label': '요한복음 15:26 / 킹제임스 성경 (영어)',
    '.learning-section .section-label .eyebrow': '02 <span>/</span> 만들며 배우기',
    '.learning-section .section-aside': '기본기부터. 평생의 성장으로.',
    '#learning-title': '호기심에서<br><em>실력으로.</em>',
    '.learning-heading > p': '우리의 교육 비전은 대면 코딩 교육과 성경 공부, 그리고 학습자들의 관심사와 섬기고자 하는 공동체를 바탕으로 한 창작 프로젝트를 함께 담고 있습니다.',
    '.learning-card:nth-child(1) h3': '정성을 담아 코딩하기',
    '.learning-card:nth-child(1) p': '프로그래밍과 웹의 기초부터 시작해 프런트엔드와 백엔드 개발, 데이터베이스, API, 보안, 테스트, 디버깅, 성능 및 배포를 살펴보고자 합니다.',
    '.learning-card:nth-child(2) h3': '사람들과 함께 일하기',
    '.learning-card:nth-child(2) p': '엔지니어, 디자이너, 제품 관리자 및 동료들과 협력하면서 신중하게 기여하고 독립적으로 일할 수 있는 판단력을 기르고자 합니다.',
    '.learning-card:nth-child(3) h3': '겸손하게 연습하기',
    '.learning-card:nth-child(3) p': '질문과 인내심 있는 멘토링, Git, 코드 리뷰, 신중한 피드백을 통해 배우고자 합니다.',
    '.learning-card:nth-child(4) h3': '도구를 지혜롭게 사용하기',
    '.learning-card:nth-child(4) p': 'AI를 보조 도구로 사용하되 결과를 검증하고 개인정보를 보호하며, 자신이 만드는 것에 책임을 지고자 합니다.',
    '.learning-scripture-label': '말씀 / 기술 / 섬김',
    '.story-callout .eyebrow': '모두를 향한 환영',
    '.story-callout h3': '배우고 소속감을 느낄 수 있는 공간.',
    '.story-callout > p': '우리는 다양한 연령과 언어적 배경을 가진 분들을 환영하고자 합니다. 첫 프로그램의 연령 범위는 아직 정해지지 않았습니다. 장학금은 앞으로의 목표이며 아직 제공되지 않습니다. 학습자들은 자신의 경험을 바탕으로 작업할 수 있으며, 나눌 내용은 스스로 선택할 수 있습니다.',
    '.atlanta-section .section-label .eyebrow': '03 <span>/</span> 애틀랜타를 위한 비전',
    '.atlanta-section .section-aside': '지혜 / 정의 / 절제',
    '#atlanta-title': '깊은 뿌리를 지닌 도시.<br><em>함께 만들어 갈 미래.</em>',
    '.atlanta-grid .lead': '애틀랜타에는 깊은 역사와 대담한 생각, 그리고 누구나 느낄 수 있는 환대의 정신이 어우러져 있습니다.',
    '.atlanta-copy > p:nth-child(1)': '애틀랜타의 풍부한 흑인 역사와 교육의 유산, 기업가 정신은 이 비전에 영감을 줍니다. 이 도시의 패션, 음악, 창작 공동체는 상상력과 표현, 소속감을 위한 자리를 마련합니다.',
    '.atlanta-copy > p:nth-child(2)': '애틀랜타의 표어 <em>Resurgens</em>는 “다시 일어나다”라는 뜻으로, 새로움을 향한 걸음에 어울리는 상징입니다. 우리는 특히 자주 소외되어 온 공동체에서 실용적인 기술을 배울 기회를 넓히고, 겸손과 협력, 모든 사람의 존엄에 대한 존중을 바탕으로 애틀랜타의 이웃들과 함께 일하기를 바랍니다.',
    '.atlanta-scripture-label': '이사야서의 회복 / 킹제임스 성경 (영어)',
    '.founder-copy .eyebrow': '04 <span>/</span> 설립자',
    '#founder-title': '윤이사야',
    '.founder-lede': '이사야는 신앙과 기술, 섬김을 바탕으로 살아가며 일하는 엔지니어이자 창작자, 코치입니다.',
    '.founder-copy p:nth-of-type(3)': '이사야는 의료, 금융 기술, 소비자 소프트웨어 분야에서 일해 온 소프트웨어 엔지니어로, <a href="https://accompanyhealth.com/" target="_blank" rel="noopener noreferrer">Accompany Health</a>, <a href="https://www.microsoft.com/" target="_blank" rel="noopener noreferrer">Microsoft</a>, <a href="https://www.marqeta.com/" target="_blank" rel="noopener noreferrer">Marqeta</a>, <a href="https://www.earnin.com/" target="_blank" rel="noopener noreferrer">EarnIn</a>에서 근무했습니다. UC 버클리를 졸업한 그는 비영리 단체를 위한 도구도 만들었으며 <a href="https://yoonbasketballtraining.com/" target="_blank" rel="noopener noreferrer">Yoon Basketball Training</a>을 설립했습니다.',
    '.founder-copy p:nth-of-type(4)': '그는 <a href="https://theamazingword.org/about" target="_blank" rel="noopener noreferrer">The Amazing Word</a>의 제작자이기도 합니다.',
    '.founder-copy p:nth-of-type(5)': '로스앤젤레스에 뿌리를 둔 이사야는 부모님을 통해 예수 그리스도를 향한 믿음을 길렀습니다. 믿음을 통한 은혜의 구원에 대한 그의 믿음은 하나님과 이웃을 섬기기 위해 기술과 창의력을 사용하고자 하는 소망의 바탕이 됩니다.',
    '.founder-link': '이사야의 개인 웹사이트 방문하기',
    '.contact-content > .eyebrow': '연락하기',
    '#contact-title': '<em>이사야에게</em> 연락하세요.',
    '.contact-content > p:not(.eyebrow):not(.contact-email)': '코딩을 배우거나 멘토링을 제공하거나 아카데미와 협력하기를 바라신다면 이사야에게 연락해 주세요.',
    '.contact-content > .button': '이사야에게 이메일 보내기',
    '.contact-social .eyebrow': '여정을 함께해 주세요',
    '.footer-top': '맨 위로',
    '.footer-bottom span': 'Copyright © 2026 Isaiah Yoon. All rights reserved.'
  };

  for (const [selector, translation] of Object.entries(content)) {
    const element = document.querySelector(selector);
    const icon = element.querySelector(':scope > svg');
    element.innerHTML = translation;
    if (icon) element.append(' ', icon);
  }

  const scriptureLabels = {
    '/kjv/b/2-corinthians/c/5/v/17-18': '고린도후서 5:17–18',
    '/kjv/b/1-peter/c/4/v/10': '베드로전서 4:10',
    '/kjv/b/john/c/15/v/26': '요한복음 15:26',
    '/kjv/b/exodus/c/31/v/3': '출애굽기 31:3',
    '/kjv/b/colossians/c/3/v/23-24': '골로새서 3:23–24',
    '/kjv/b/isaiah/c/1/v/26': '이사야 1:26',
    '/kjv/b/isaiah/c/51/v/3': '이사야 51:3',
    '/kjv/b/isaiah/c/61/v/4': '이사야 61:4',
    '/kjv/b/psalms/c/1/v/3': '시편 1:3'
  };
  document.querySelectorAll('blockquote').forEach(passage => {
    passage.lang = 'en';
  });
  document.querySelectorAll('a[href^="https://theamazingword.org/kjv/"]').forEach(link => {
    const label = scriptureLabels[new URL(link.href).pathname];
    if (!label) {
      console.error(`Missing Korean Scripture label for ${link.href}`);
      return;
    }
    const icon = link.querySelector('svg');
    link.textContent = `The Amazing Word에서 ${label} 읽기 (영어 KJV) `;
    link.append(icon);
  });

  const disclosure = document.createElement('span');
  disclosure.className = 'language-disclosure';
  disclosure.textContent = '이 한국어 웹페이지는 비전 소개용이며, 한국어 수업이나 한국어 지원의 제공을 의미하지 않습니다.';
  document.querySelector('.launch-status-inner').append(disclosure);
}
