import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const quizQuestions = [
  {
    question: "Что такое «предвзятость алгоритма» в контексте ИИ?",
    options: [
      "Когда ИИ работает слишком медленно",
      "Когда ИИ принимает решения, дискриминирующие определённые группы людей",
      "Когда ИИ не может решать сложные задачи",
      "Когда ИИ потребляет много электроэнергии",
    ],
    correct: 1,
    explanation:
      "Предвзятость алгоритма возникает, когда обучающие данные содержат неравномерное представление групп. Например, система найма может отдавать предпочтение кандидатам определённого пола, если исторические данные отражали дискриминацию.",
  },
  {
    question: "Какой принцип этики ИИ требует, чтобы решения системы можно было объяснить?",
    options: ["Автономность", "Прозрачность (объяснимость)", "Эффективность", "Масштабируемость"],
    correct: 1,
    explanation:
      "Прозрачность означает, что ИИ-система должна уметь объяснять свои решения понятным образом. Это особенно важно в медицине, праве и образовании — там, где решения влияют на жизнь людей.",
  },
  {
    question: "Учитель использует ИИ для выставления оценок. Какой главный этический риск?",
    options: [
      "ИИ работает медленнее учителя",
      "ИИ может предвзято оценивать работы определённых групп учеников",
      "Ученики могут сломать ИИ",
      "ИИ занимает много места на сервере",
    ],
    correct: 1,
    explanation:
      "Автоматическое оценивание может закрепить существующие неравенства. Если система обучалась на оценках предвзятых учителей, она воспроизведёт эту предвзятость в масштабе. Важно регулярно проверять результаты и сохранять человеческий контроль.",
  },
  {
    question: "Что означает принцип «информированного согласия» при использовании ИИ?",
    options: [
      "ИИ должен сам принять решение",
      "Пользователи должны знать, как их данные используются ИИ",
      "Разработчики должны согласиться с правилами компании",
      "Правительство должно одобрить ИИ-систему",
    ],
    correct: 1,
    explanation:
      "Информированное согласие требует, чтобы люди чётко понимали, какие данные собирает ИИ, как их использует и каковы риски. Без этого принципа доверие к технологиям разрушается.",
  },
  {
    question: "Как лучше всего снизить риск предвзятости в образовательном ИИ?",
    options: [
      "Использовать только один источник данных",
      "Полностью отказаться от ИИ в образовании",
      "Регулярно проверять систему на предвзятость и использовать разнообразные данные",
      "Разрешить только взрослым пользоваться ИИ",
    ],
    correct: 2,
    explanation:
      "Разнообразие обучающих данных и регулярный аудит — ключевые инструменты борьбы с предвзятостью. Также важно привлекать специалистов из разных дисциплин и сообществ к разработке и проверке систем.",
  },
];

const problems = [
  {
    icon: "AlertTriangle",
    title: "Предвзятость алгоритмов",
    desc: "ИИ обучается на исторических данных, которые могут отражать существующие социальные неравенства. Это приводит к дискриминации в образовательных решениях.",
  },
  {
    icon: "Eye",
    title: "Слежка и приватность",
    desc: "Системы мониторинга учеников собирают огромные объёмы данных. Возникает вопрос: где граница между безопасностью и вторжением в частную жизнь?",
  },
  {
    icon: "UserX",
    title: "Замена учителя",
    desc: "Автоматизация рутинных задач ставит под угрозу роль педагога. Важно сохранить человеческий контакт, который критичен для развития личности.",
  },
  {
    icon: "Lock",
    title: "Монополизация данных",
    desc: "Крупные корпорации контролируют образовательные платформы и данные миллионов учеников, создавая зависимость школ от коммерческих интересов.",
  },
];

const solutions = [
  {
    num: "01",
    title: "Прозрачные алгоритмы",
    desc: "Образовательные ИИ-системы должны объяснять свои решения. Ученики и учителя вправе знать, почему система дала ту или иную оценку.",
  },
  {
    num: "02",
    title: "Человеческий контроль",
    desc: "ИИ должен помогать учителю, а не заменять его. Окончательные решения — особенно важные — должны оставаться за человеком.",
  },
  {
    num: "03",
    title: "Разнообразие данных",
    desc: "Обучающие выборки должны включать представителей разных культур, способностей и социальных групп. Это снижает риск системной предвзятости.",
  },
  {
    num: "04",
    title: "Цифровая грамотность",
    desc: "Ученики и учителя должны понимать, как работает ИИ. Критическое мышление — лучшая защита от манипуляций алгоритмов.",
  },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);

  const sections = ["home", "about", "problems", "solutions", "quiz", "contacts"];
  const sectionLabels: Record<string, string> = {
    home: "Главная",
    about: "О проекте",
    problems: "Проблемы",
    solutions: "Решения",
    quiz: "Тест",
    contacts: "Контакты",
  };

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    const correct = quizQuestions[currentQuestion].correct === idx;
    if (correct) setScore((s) => s + 1);
    setAnsweredQuestions((prev) => [...prev, correct]);
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((q) => q + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizFinished(false);
    setAnsweredQuestions([]);
  };

  const getScoreMessage = () => {
    if (score === 5) return "Отличный результат! Ты настоящий эксперт в этике ИИ.";
    if (score >= 3) return "Хорошо! У тебя есть базовое понимание этики ИИ.";
    return "Есть над чем поработать. Перечитай разделы и попробуй снова!";
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] font-golos text-[#1a1a1a]">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF8]/90 backdrop-blur-sm border-b border-[#e8e8e4]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-cormorant text-xl font-semibold tracking-wide text-[#1a1a1a]">
            Этика ИИ
          </span>
          <div className="hidden md:flex items-center gap-8">
            {sections.map((s) => (
              <button
                key={s}
                onClick={() => scrollTo(s)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  activeSection === s
                    ? "text-[#2563eb]"
                    : "text-[#6b6b6b] hover:text-[#1a1a1a]"
                }`}
              >
                {sectionLabels[s]}
              </button>
            ))}
          </div>
          <button
            className="md:hidden p-2 text-[#6b6b6b]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-[#FAFAF8] border-t border-[#e8e8e4] px-6 py-4 flex flex-col gap-4">
            {sections.map((s) => (
              <button
                key={s}
                onClick={() => scrollTo(s)}
                className="text-left text-sm font-medium text-[#6b6b6b] hover:text-[#1a1a1a]"
              >
                {sectionLabels[s]}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section
        id="home"
        className="min-h-screen flex flex-col justify-center px-6 pt-16"
        ref={(el) => { sectionRefs.current["home"] = el; }}
      >
        <div className="max-w-5xl mx-auto w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-[#2563eb] bg-[#eff6ff] px-3 py-1.5 rounded-full mb-8 tracking-wide uppercase">
              <Icon name="BookOpen" size={12} />
              Проект 10 класса · 2026
            </div>
            <h1 className="font-cormorant text-6xl md:text-8xl font-semibold leading-[0.95] tracking-tight mb-8 text-[#1a1a1a]">
              Этичность
              <br />
              <span className="italic text-[#2563eb]">искусственного</span>
              <br />
              интеллекта
            </h1>
            <p className="text-lg text-[#6b6b6b] max-w-xl leading-relaxed mb-12">
              Исследование о том, как технологии меняют образование — и какую ответственность несут их создатели и пользователи.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollTo("about")}
                className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-[#2563eb] transition-colors duration-200"
              >
                Начать читать
                <Icon name="ArrowRight" size={16} />
              </button>
              <button
                onClick={() => scrollTo("quiz")}
                className="inline-flex items-center gap-2 border border-[#e8e8e4] text-[#1a1a1a] px-8 py-3.5 rounded-full text-sm font-medium hover:border-[#2563eb] hover:text-[#2563eb] transition-colors duration-200"
              >
                Пройти тест
                <Icon name="Zap" size={16} />
              </button>
            </div>
          </div>
          <div className="mt-24 grid grid-cols-3 gap-8 border-t border-[#e8e8e4] pt-8 max-w-lg">
            {[["5", "Вопросов"], ["4", "Проблемы"], ["4", "Решения"]].map(([num, label]) => (
              <div key={label}>
                <div className="font-cormorant text-4xl font-semibold text-[#1a1a1a]">{num}</div>
                <div className="text-xs text-[#6b6b6b] mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-medium text-[#2563eb] uppercase tracking-widest">О проекте</span>
              <h2 className="font-cormorant text-5xl font-semibold mt-4 mb-6 leading-tight">
                Зачем это важно сейчас?
              </h2>
              <p className="text-[#6b6b6b] leading-relaxed mb-6">
                ИИ уже используется в тысячах школ по всему миру — для оценивания работ, рекомендации учебных материалов, мониторинга поведения учеников. Но мало кто задаётся вопросом: насколько это справедливо?
              </p>
              <p className="text-[#6b6b6b] leading-relaxed">
                Этот проект исследует ключевые этические вызовы, с которыми сталкивается образование в эпоху ИИ, и предлагает конкретные пути их решения.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "Scale", label: "Справедливость", color: "#eff6ff" },
                { icon: "Shield", label: "Безопасность", color: "#f0fdf4" },
                { icon: "Eye", label: "Прозрачность", color: "#fff7ed" },
                { icon: "Heart", label: "Гуманность", color: "#fdf2f8" },
              ].map(({ icon, label, color }) => (
                <div
                  key={label}
                  style={{ backgroundColor: color }}
                  className="rounded-2xl p-6 flex flex-col gap-3"
                >
                  <Icon name={icon} size={24} className="text-[#2563eb]" />
                  <span className="text-sm font-medium text-[#1a1a1a]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMS */}
      <section id="problems" className="py-32 px-6 bg-[#F4F4F0]">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-medium text-[#2563eb] uppercase tracking-widest">Проблемы</span>
          <h2 className="font-cormorant text-5xl font-semibold mt-4 mb-4 leading-tight">
            Что идёт не так?
          </h2>
          <p className="text-[#6b6b6b] mb-16 max-w-xl">
            Использование ИИ в образовании несёт реальные риски, которые необходимо осознавать.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {problems.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-8 group hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-[#eff6ff] flex items-center justify-center mb-6 group-hover:bg-[#2563eb] transition-colors duration-300">
                  <Icon
                    name={icon}
                    size={18}
                    className="text-[#2563eb] group-hover:text-white transition-colors duration-300"
                  />
                </div>
                <h3 className="font-semibold text-[#1a1a1a] mb-3">{title}</h3>
                <p className="text-sm text-[#6b6b6b] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section id="solutions" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-medium text-[#2563eb] uppercase tracking-widest">Решения</span>
          <h2 className="font-cormorant text-5xl font-semibold mt-4 mb-4 leading-tight">
            Как это исправить?
          </h2>
          <p className="text-[#6b6b6b] mb-16 max-w-xl">
            Этические проблемы ИИ решаемы — если действовать осознанно и системно.
          </p>
          <div className="space-y-px">
            {solutions.map(({ num, title, desc }, i) => (
              <div
                key={num}
                className="flex gap-8 py-8 border-b border-[#e8e8e4] group"
              >
                <span className="font-cormorant text-2xl text-[#d0d0cc] font-semibold shrink-0 group-hover:text-[#2563eb] transition-colors duration-200">
                  {num}
                </span>
                <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-8 flex-1">
                  <h3 className="font-semibold text-[#1a1a1a] md:w-48 shrink-0">{title}</h3>
                  <p className="text-sm text-[#6b6b6b] leading-relaxed flex-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUIZ */}
      <section id="quiz" className="py-32 px-6 bg-[#F4F4F0]">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-medium text-[#2563eb] uppercase tracking-widest">Тест</span>
          <h2 className="font-cormorant text-5xl font-semibold mt-4 mb-4 leading-tight">
            Проверь себя
          </h2>
          <p className="text-[#6b6b6b] mb-12">
            5 вопросов об этике ИИ в образовании. Мгновенные ответы и объяснения.
          </p>

          {!quizFinished ? (
            <div className="bg-white rounded-2xl p-8">
              {/* Progress */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2">
                  {quizQuestions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i < currentQuestion
                          ? answeredQuestions[i]
                            ? "bg-[#22c55e] w-8"
                            : "bg-[#ef4444] w-8"
                          : i === currentQuestion
                          ? "bg-[#2563eb] w-8"
                          : "bg-[#e8e8e4] w-8"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-[#6b6b6b] font-medium">
                  {currentQuestion + 1} / {quizQuestions.length}
                </span>
              </div>

              <h3 className="font-semibold text-lg text-[#1a1a1a] mb-6 leading-snug">
                {quizQuestions[currentQuestion].question}
              </h3>

              <div className="space-y-3 mb-6">
                {quizQuestions[currentQuestion].options.map((opt, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = quizQuestions[currentQuestion].correct === idx;
                  const answered = selectedAnswer !== null;

                  let style = "border border-[#e8e8e4] text-[#1a1a1a] hover:border-[#2563eb]";
                  if (answered && isCorrect) style = "border-2 border-[#22c55e] bg-[#f0fdf4] text-[#15803d]";
                  else if (answered && isSelected && !isCorrect) style = "border-2 border-[#ef4444] bg-[#fef2f2] text-[#b91c1c]";
                  else if (answered) style = "border border-[#e8e8e4] text-[#9ca3af]";

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={answered}
                      className={`w-full text-left px-5 py-4 rounded-xl text-sm transition-all duration-200 flex items-center justify-between group ${style}`}
                    >
                      <span>{opt}</span>
                      {answered && isCorrect && <Icon name="CheckCircle" size={16} className="text-[#22c55e] shrink-0" />}
                      {answered && isSelected && !isCorrect && <Icon name="XCircle" size={16} className="text-[#ef4444] shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-5 mb-6">
                  <div className="flex gap-2 mb-2">
                    <Icon name="Info" size={16} className="text-[#2563eb] shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-[#2563eb] uppercase tracking-wide">Объяснение</span>
                  </div>
                  <p className="text-sm text-[#1e40af] leading-relaxed">
                    {quizQuestions[currentQuestion].explanation}
                  </p>
                </div>
              )}

              {showExplanation && (
                <button
                  onClick={nextQuestion}
                  className="w-full bg-[#1a1a1a] text-white py-3.5 rounded-xl text-sm font-medium hover:bg-[#2563eb] transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {currentQuestion < quizQuestions.length - 1 ? "Следующий вопрос" : "Завершить тест"}
                  <Icon name="ArrowRight" size={16} />
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-[#eff6ff] flex items-center justify-center mx-auto mb-6">
                <span className="font-cormorant text-4xl font-semibold text-[#2563eb]">
                  {score}/{quizQuestions.length}
                </span>
              </div>
              <h3 className="font-cormorant text-3xl font-semibold text-[#1a1a1a] mb-3">
                {score >= 4 ? "Отлично!" : score >= 3 ? "Хорошо!" : "Попробуй ещё раз"}
              </h3>
              <p className="text-[#6b6b6b] text-sm mb-8 max-w-sm mx-auto">{getScoreMessage()}</p>
              <div className="flex justify-center gap-3 mb-8">
                {answeredQuestions.map((correct, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      correct ? "bg-[#f0fdf4]" : "bg-[#fef2f2]"
                    }`}
                  >
                    <Icon
                      name={correct ? "Check" : "X"}
                      size={14}
                      className={correct ? "text-[#22c55e]" : "text-[#ef4444]"}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={restartQuiz}
                className="inline-flex items-center gap-2 border border-[#e8e8e4] text-[#1a1a1a] px-6 py-3 rounded-full text-sm font-medium hover:border-[#2563eb] hover:text-[#2563eb] transition-colors duration-200"
              >
                <Icon name="RotateCcw" size={14} />
                Пройти снова
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl">
            <span className="text-xs font-medium text-[#2563eb] uppercase tracking-widest">Контакты</span>
            <h2 className="font-cormorant text-5xl font-semibold mt-4 mb-6 leading-tight">
              Есть вопросы?
            </h2>
            <p className="text-[#6b6b6b] mb-12 leading-relaxed">
              Этот проект создан учеником 10 класса в рамках исследовательской работы по теме этики искусственного интеллекта в образовании.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: "Mail", label: "Email", value: "md.malutina@gmail.com" },
                { icon: "MapPin", label: "Школа", value: "Школа №50, Самарская область" },
                { icon: "GraduationCap", label: "Класс", value: "10 класс, 2025–2026" },
                { icon: "BookMarked", label: "Руководитель", value: "Учитель информатики" },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-4 p-5 border border-[#e8e8e4] rounded-2xl hover:border-[#2563eb] transition-colors duration-200">
                  <div className="w-9 h-9 rounded-lg bg-[#eff6ff] flex items-center justify-center shrink-0">
                    <Icon name={icon} size={16} className="text-[#2563eb]" />
                  </div>
                  <div>
                    <div className="text-xs text-[#6b6b6b] mb-0.5">{label}</div>
                    <div className="text-sm font-medium text-[#1a1a1a]">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#e8e8e4] px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-cormorant text-lg font-semibold text-[#1a1a1a]">Этика ИИ</span>
          <span className="text-xs text-[#9ca3af]">Проект 10 класса · 2026</span>
          <div className="flex gap-6">
            {sections.slice(0, 4).map((s) => (
              <button
                key={s}
                onClick={() => scrollTo(s)}
                className="text-xs text-[#6b6b6b] hover:text-[#2563eb] transition-colors duration-200"
              >
                {sectionLabels[s]}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}