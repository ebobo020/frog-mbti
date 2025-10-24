// src/App.jsx
import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toPng } from "html-to-image";

/* ===================== 질문 ===================== */
const QUESTIONS = [
  { id: 1, text: "처음 간 연못에서 낯선 개구리들이 개굴개굴 웃고 있다. 당신은?", a: "“안녕! 나도 개굴이야!” 바로 합류한다", b: "조용히 수초 뒤에 숨어 분위기를 살핀다", map: { A: "E", B: "I" } },
  { id: 2, text: "친구 개구리가 벌레 사냥을 제안했다. 당신은?", a: "망설임 없이 뛰쳐나간다", b: "하늘 한번 보고, 비 오면 나가자고 한다", map: { A: "P", B: "J" } },
  { id: 3, text: "연못 회의 중 한 개구리가 연잎 보고서를 엎질렀다!", a: "원인을 분석하며 해결책부터 찾는다", b: "“괜찮아~” 하며 물방울 닦아준다", map: { A: "T", B: "F" } },
  { id: 4, text: "비 오는 날, 연못가에 앉아 있다. 넌 어떤 개구리?", a: "물결에 내 마음을 띄워보내는 감성 개굴", b: "빗소리에서 리듬 패턴을 찾는 분석 개굴", map: { A: "F", B: "T" } },
  { id: 5, text: "새로운 연잎 위로 건너야 한다!", a: "일단 뛰어본다. 실패도 경험이지!", b: "먼저 밟아본 개구리의 발자국을 살핀다", map: { A: "N", B: "S" } },
  { id: 6, text: "한 개구리가 회의 시간에 갑자기 연못에 풍덩 뛰어들었다!", a: "규칙이 중요하다고 말한다", b: "‘그래, 살다 보면 그럴 수도 있지...’", map: { A: "J", B: "P" } },
  { id: 7, text: "친구 개구리가 울적해한다.", a: "“무슨 일 있어?” 이유를 물어본다", b: "같이 연못에 가서 울적송을 부른다", map: { A: "T", B: "F" } },
  { id: 8, text: "다음 점프 목표를 정할 때, 넌 어떤 타입?", a: "그날 기분에 따라 뛴다", b: "점프 거리부터 재본다", map: { A: "P", B: "J" } },
  { id: 9, text: "연못 파티에서 처음 보는 개구리를 만났다!", a: "“넌 어디서 개굴해?” 먼저 말을 건다", b: "상대가 다가오길 기다린다", map: { A: "E", B: "I" } },
  { id: 10, text: "점프 연습 중 물에 빠졌다!", a: "이유를 기록하고 점프 각도를 수정한다", b: "‘뭐 어때~ 원래 개구리는 물에 살아ㅋ’ 하고 웃는다", map: { A: "J", B: "P" } },
  { id: 11, text: "다른 개구리가 새로운 아이디어를 냈다!", a: "“이걸 더 개굴스럽게 해보면 어때?” 하고 발전시킨다", b: "“와 개굴~ 천재 개구리잖아?” 박수친다", map: { A: "N", B: "F" } },
  { id: 12, text: "오늘의 연못 생활이 끝났다. 마지막으로 넌?", a: "내일의 점프 계획을 세운다", b: "달빛 아래서 하품하며 잠든다", map: { A: "J", B: "P" } },
];

/* ===================== 결과(16형) ===================== */
const RESULTS = {
  ENTJ: { name: "🔥리더 개구리", desc: "연못개발청 청장님. 회의 중독자", image: "/frogs/ENTJ.png", traits: ["아침 6시 회의 소집, 안 오면 ‘의지 부족’이라 판단","점프하기 전에 리허설 세 번 함","다른 개구리 역할표 만들다가 종종 자기 이름 깜빡함","물길 방향까지 정비하려 함 (자연을 통제하려는 개구리)","가끔 밤에 자기 계획서 보며 감동함","가끔 자기 이름 검색해서 평판 확인함","목표 없는 날엔 불안해서 연못을 한 바퀴 뛴다","비 올 조짐만 보여도 대책 회의 소집함"] },
  ENTP: { name: "💡발명 개구리", desc: "연못의 혼돈 제조기", image: "/frogs/ENTP.png", traits: ["“이건 실패가 아니야, 예상치 못한 발견이지.”","아이디어 노트 100권, 완성된 건 0개","하루 세 번 ‘천재’라는 단어를 사용함 (대부분 자칭)","개구리 세계 최초의 ‘물총 발사기’를 만들었지만 폭발함","한 문장에 “근데” 세 번 넣음","모든 대화가 토론으로 끝남","가끔 자기 농담에 개굴개굴 웃다가 미끄러짐"] },
  ENFJ: { name: "🌹코디 개구리", desc: "모든 개구리를 행복하게 만드는 게 사명", image: "/frogs/ENFJ.png", traits: ["“너 슬퍼 보이네, 혹시 어제 꿈에 비 왔어?”","연못 파티 총무 맡음","감정 스케줄러 앱 만드는 중","말 끝에 느낌표 세 개씩 안붙이면 말 못함","하루에 세 번 이상 감동함","모든 싸움을 중재하려다 자기가 피로 누적","근데 또 다음 날 똑같이 중재함","연못 단톡방 분위기 메이커","누가 단톡방 나가면 새 톡방 만듦"] },
  ENFP: { name: "🌈파티 개구리", desc: "비 오는 날에 축제 여는 유일한 존재", image: "/frogs/ENFP.png", traits: ["벌레보다 비트에 반응","연잎 위 DJ","모든 게 운명이라 믿음","계획은 3분, 실행은 즉시, 후회는 10초","10개 프로젝트 동시에 시작함","댄스 원정감","새 친구에게 이름 묻기도 전에 별명 붙임","전국 연못 투어 계획 중","감정변화 그래프 T-express","감정 기복이 1호선 지연만큼 잦음","SNS에 자기 연못 셀카 159장 있음","‘이건 운명이야’라고 하루 3회 이상 말함"] },
  ESTJ: { name: "🪖감독 개구리", desc: "대한개구리연못회 회장 연임 중. 연못 치안·질서 담당", image: "/frogs/ESTJ.png", traits: ["‘개구리는 규칙이 생명이다’ 신조 복창하라고 함","“질서 없는 연못은 늪이다.” 외치고 다님","하루 일과를 분 단위로 나눔","일정이 밀리면 ‘연못 비상사태’ 선언","물길도 직선으로 정리함","규칙표를 연잎에 새겨두고 아침마다 점검 (백업 연잎 3장 보유 중)","파티 개구리를 ‘재앙의 씨앗’이라 부름","고약한 개구리를 보면 심장이 쿵쾅거림 (negative)"] },
  ESTP: { name: "⚡모험 개구리", desc: "연못 밖 탐험 중. 생존 확률 63%", image: "/frogs/ESTP.png", traits: ["“내 인생에 안전벨트는 없어.”","첫인사는 늘 “이거 해볼래?”","물길 따라 흘러갔다가 돌아오지 않는 날도 있음","모든 경고문을 ‘도전장’으로 읽음","연잎에서 미끄러져도 웃고 까먹음","다른 개구리에게 “너무 재밌는 실수였다”라 함","개구리 중 유일하게 흉터 자랑함","다른 개구리 놀래키는게 삶의 낙"] },
  ESFJ: { name: "☀️도토리빵집 개구리", desc: "연못 제일의 빵 굽는 개구리", image: "/frogs/ESFJ.png", traits: ["모든 개구리 생일 외움","모든 개구리 알레르기 정보 숙지","‘도토리빵 1+1 이벤트’로 연못 평화 유지","빵 반죽에 다른 개구리 이름 새김 (깜짝 이벤트)","고민상담 하다 반죽 태움","입버릇 = “그건 네 잘못이 아니야”","벌레 반 갈라서 나눠줌","연못 전역에 쿠키 냄새 퍼뜨려 주민 행복수치 상승","자기빵 먹을 시간은 없음 (항상 바쁨)","연못 월드 분위기 메이커 2위"] },
  ESFP: { name: "🎉아이돌 개구리", desc: "팬클럽 5개. “개구리도 빛날 수 있어!”", image: "/frogs/ESFP.png", traits: ["연못이 무대고 개구리는 주인공","팬클럽 다섯 개 운영 중 (본인 팬클럽)","셀카 100장 찍는데 맘에 드는거 없음","연못 가장자리에서 즉흥 공연함","공연 중 앵콜 부르다 울음","좌우명 무조건 카르페디엠","나중에 본인 이름으로 향수 만들 예정","무대 아래에서는 의외로 수줍음 많음"] },
  INTJ: { name: "🧩전략 개구리", desc: "연못 도시계획 설계자", image: "/frogs/INTJ.png", traits: ["“모든 물길엔 패턴이 있다. 개구리들이 무시할 뿐.”","연못 도시계획 시뮬레이션 돌리며 행복 느낌","연못 구조와 표면장력을 연구함","대화 중 논리 안 맞으면 자동으로 눈 감음","“감정이란 변수는 통제 불가”라고 진심으로 생각함","입버릇 = “논리적으로~”","실수하면 혼자 SWOT 분석함","하루 목표량 달성 못 하면 자책일기 씀","비효율 혐오함","누가 칭찬하면 은근히 행복해함"] },
  INTP: { name: "🔍연구 개구리", desc: "논리와 이론으로 세상을 보는 철두철미 개굴", image: "/frogs/INTP.png", traits: ["“이론상 불가능한 건 없지, 다만 귀찮을 뿐.”","실험 시작보다 제목 정하는 데 1시간","결론 내리면 또 의심함","‘왜?’를 세 번 이상 반복해야 대화 종료","‘논리적으로~’ 말하고 나서 자기 논리 헷갈림","현실 감각 실종"] },
  INFJ: { name: "🌙철학 개구리", desc: "연못 존재의 이유를 탐구하는 사색가", image: "/frogs/INFJ.png", traits: ["연못 월드의 소크라테스","개구리 세계의 ‘메르시’","“이 물결이 스스로 흐르는 걸까, 아니면 우리가 움직이는 걸까.”","시인 개구리와 자주 심리 토크함","새벽마다 조용히 연못 거닐며 사색","다른 개구리 고민 듣고 자기가 앓아누움","혼자 있는 걸 좋아하지만 혼자가 아니길 바람","비 오는 날엔 조용히 기도하듯 개굴함"] },
  INFP: { name: "🍃시인 개구리", desc: "감정으로 사는 연못의 낭만가", image: "/frogs/INFP.png", traits: ["“오늘의 물결은 슬퍼서 예뻐”, 감정이 북받침","달 보면 괜히 슬픔","본인 시에 스스로 감동받음","현실 문제보다 상상 속 이야기 걱정함","노래·그림·시 다 잘하지만 꾸준함은 떨어지는 편","감정선 폭주하면 글씨체도 달라짐","한글과 컴퓨터 글씨체로 ‘시인 개구리체’ 36개 보유 중","비 오는 날엔 시집 들고 산책함"] },
  ISTJ: { name: "📘회계 개구리", desc: "연못 예산 담당, 규칙과 서류의 정령", image: "/frogs/ISTJ.png", traits: ["“삐빅. 규칙 위반. 규칙은 개굴의 등뼈다.”","연못 통계 노트 있음 (“아이돌 개구리 금일 점프 7322회”)","비 와도 정해진 루틴 지켜야돼서 울면서 세차함","낯선 개구리가 인사 안 하면 3일 내내 신경씀","연잎 차곡차곡 정리하다 하루 다 감","할 일 다 하면 스스로에게 칭찬 스탬프 찍음","연못에 ‘올해의 개구리상’ 후보로 세 번 오름 (당선x)"] },
  ISTP: { name: "🧱공돌이 개구리", desc: "연못 기술직 1호. 조용한 괴짜 개굴", image: "/frogs/ISTP.png", traits: ["“이게 왜 안 돼? ...아 됐다 ㅎ (펑)”","낡은 통나무 밑 실험실 거주","침묵 90%, 폭발 10%","연못에서 가장 많이 ‘뚝딱’ 소리 남","불편하면 직접 고쳐버림","연못 전기 시스템 만든 주인공","누가 부르면 지금 바쁘다고 함","본인도 왜 바쁜지는 모름","성공해도 티 안 냄, 대신 입꼬리 살짝 올라감","흥미가 빨리 식음"] },
  ISFJ: { name: "🌾간호 개구리", desc: "연못 병동에도 아침이 와요^^, 착한 개굴 그 자체", image: "/frogs/ISFJ.png", traits: ["“괜찮아요, 조금만 쉬면 다시 개굴개굴 할 수 있어요 ㅎㅎ”","모든 개구리에게 존댓말함","다친 개구리에게 연잎 밴드 직접 제작","부탁 거절 못 함 (그래서 늘 피곤함)","‘고맙다’ 소리에 울컥함","자기 걱정하면 “전 괜찮아요!”라고 말함 (안괜찮음)","화내는 법 몰라서 검색함","조용하지만 연못이 힘들 땐 맨 먼저 움직임","사람 좋은 웃음(개구리 좋은 웃음)"] },
  ISFP: { name: "🌸감성 개구리", desc: "조약돌 화가, 감정선의 미학", image: "/frogs/ISFP.png", traits: ["새벽에 일어나 색깔 맞춰 돌 정리함","갤러리에 윤슬 사진만 200장","연못에서 가장 사진 잘 찍는 개구리","조약돌 위에 하루 감정 기록","조용히 그림 그림","주변 소음에 예민하지만 싫지는 않음","기복 있지만 해치지 않음","누가 그림 칭찬하면 부끄러워서 물 속으로 잠수함","예술 설명 요청받으면 3초 침묵 후 “그냥 좋아서요.”","조용하지만 연못의 분위기를 결정하는 존재"] },
};

/* ===================== 타입 계산 ===================== */
function toType(answers) {
  const t = { E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 };
  QUESTIONS.forEach((q) => {
    const pick = answers[q.id];
    if (pick) t[q.map[pick]]++;
  });
  return (
    (t.E >= t.I ? "E" : "I") +
    (t.N >= t.S ? "N" : "S") +
    (t.T >= t.F ? "T" : "F") +
    (t.J >= t.P ? "J" : "P")
  );
}

/* ===================== 메인 ===================== */
export default function App() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const resultType = useMemo(() => toType(answers), [answers]);
  const result = RESULTS[resultType] || RESULTS.ENFP;
  const cardRef = useRef(null);

  const handlePick = (c) => {
    const q = QUESTIONS[step - 1];
    setAnswers((p) => ({ ...p, [q.id]: c }));
    setTimeout(() => setStep(step + 1), 300);
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers({});
  };

  const saveImage = async () => {
    if (!cardRef.current) return;
    const dataUrl = await toPng(cardRef.current, { pixelRatio: 3 });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${result.name}.png`;
    a.click();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-mint-100 to-white font-[Pretendard] text-gray-800">
      <AnimatePresence mode="wait">
        {/* ====== Intro ====== */}
        {step === 0 && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center space-y-8"
          >
            <div className="text-8xl">🐸</div>
            <h1 className="text-5xl font-extrabold text-emerald-800">나는 어떤 개구리일까?</h1>
            <p className="text-xl text-gray-500">연못 속 나의 성격을 알아보자</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(1)}
              className="bg-emerald-500 text-white px-10 py-5 rounded-2xl shadow-md hover:bg-emerald-600 text-2xl"
            >
              테스트 시작하기
            </motion.button>
          </motion.div>
        )}

        {/* ====== Quiz ====== */}
        {step > 0 && step <= QUESTIONS.length && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl bg-white/80 p-10 rounded-3xl shadow-xl text-center"
          >
            <h2 className="text-3xl font-bold mb-10 text-emerald-800">{QUESTIONS[step - 1].text}</h2>
            <div className="flex flex-col gap-6">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} onClick={() => handlePick("A")} className="w-full bg-emerald-100 hover:bg-emerald-200 py-6 rounded-2xl text-2xl text-gray-800">
                {QUESTIONS[step - 1].a}
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} onClick={() => handlePick("B")} className="w-full bg-emerald-100 hover:bg-emerald-200 py-6 rounded-2xl text-2xl text-gray-800">
                {QUESTIONS[step - 1].b}
              </motion.button>
            </div>
            <p className="text-gray-500 mt-10 text-lg">{step}/{QUESTIONS.length}</p>
          </motion.div>
        )}

        {/* ====== Result ====== */}
        {step > QUESTIONS.length && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 py-10 text-center"
          >
            <div ref={cardRef} className="flex flex-col items-center justify-center text-center w-full max-w-lg mx-auto">
              <img
                src={result.image}
                alt={result.name}
                className="rounded-2xl shadow-md object-contain mb-8 mx-auto"
                style={{
                  width: "75%",
                  maxWidth: "500px",
                  height: "auto",
                  marginBottom: "1rem",
                }}
              />
              {/* 타이틀 */}
              <h2 className="text-2xl font-extrabold text-emerald-800 mb-3">{result.name}</h2>
              {/* 한 줄 설명 */}
              <p className="text-lg italic text-gray-600 mb-10 leading-relaxed max-w-[90%] mx-auto">"{result.desc}"</p>
              {/* 특징 리스트 */}
              <ul className="flex flex-col items-center justify-center text-center space-y-5 text-gray-800 leading-relaxed w-full px-2">
                {result.traits.map((t, i) => (
                  <li key={i} className="max-w-[90%] text-base break-keep">
                    <span className="text-emerald-500"></span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-center gap-3 mt-8">
                <button
                  onClick={handleRestart}
                  className="px-5 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 transition"
                >
                  다시 하기
                </button>
                <button
                  onClick={() => alert('칭찬이 개구리를 행복하게 했어요 💚')}
                  className="px-5 py-2 rounded-lg border border-emerald-300 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition text-sm"
                >
                  칭찬하기
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
