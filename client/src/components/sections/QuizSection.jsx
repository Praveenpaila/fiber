import React, { useState, useEffect } from 'react';
import api from '../../utils/apiClient';
import { HelpCircle, Check, X, RotateCcw } from 'lucide-react';

const fallbackQuiz = [
  {
    order: 1,
    question: 'What is the physical meaning of the Numerical Aperture of an optical fiber?',
    options: [
      'The physical diameter of the outer protective jacket',
      'The dimensionless figure of merit measuring the light gathering capacity of the fiber',
      'The attenuation rate of light per kilometer of fiber',
      'The electrical conductivity of the glass core'
    ],
    correctIndex: 1,
    explanation: 'Numerical Aperture (NA) is a dimensionless parameter that characterizes the range of angles over which the fiber can accept and propagate light by total internal reflection.'
  },
  {
    order: 2,
    question: 'What condition is required for Total Internal Reflection to occur inside an optical fiber?',
    options: [
      'Light must travel from core to cladding, and the core refractive index must be greater than the cladding refractive index',
      'The refractive index of the cladding must be greater than the core refractive index',
      'The incident angle inside the core must be smaller than the critical angle',
      'The fiber must be coated with a metallic reflective silver film'
    ],
    correctIndex: 0,
    explanation: 'Total internal reflection requires light to travel in an optically denser medium (core, n1) toward an optically rarer medium (cladding, n2, where n1 > n2) with an angle of incidence greater than the critical angle.'
  },
  {
    order: 3,
    question: 'If the core refractive index is n1 = 1.50 and cladding refractive index is n2 = 1.45, what is the theoretical Numerical Aperture?',
    options: [
      'NA = 0.384',
      'NA = 0.520',
      'NA = 0.200',
      'NA = 0.707'
    ],
    correctIndex: 0,
    explanation: 'NA = sqrt(n1^2 - n2^2) = sqrt(1.50^2 - 1.45^2) = sqrt(2.25 - 2.1025) = sqrt(0.1475) = 0.384.'
  },
  {
    order: 4,
    question: 'How is the acceptance angle theta_0 related to the Numerical Aperture (NA) in air?',
    options: [
      'theta_0 = arccos(NA)',
      'theta_0 = arcsin(NA)',
      'theta_0 = arctan(NA)',
      'theta_0 = 1 / NA'
    ],
    correctIndex: 1,
    explanation: 'For light entering from air (n0 = 1.0), the acceptance angle theta_0 is defined by sin(theta_0) = NA, which gives theta_0 = arcsin(NA).'
  },
  {
    order: 5,
    question: 'In this experiment, how is the spot diameter D related to the distance L from fiber tip to screen?',
    options: [
      'Spot diameter D decreases linearly as distance L increases',
      'Spot diameter D remains completely constant regardless of distance L',
      'Spot diameter D increases linearly with distance L as light diverges in a cone',
      'Spot diameter D oscillates sinusoidally with distance L'
    ],
    correctIndex: 2,
    explanation: 'Light exits the fiber end face in a conical beam of half-angle theta_0. As distance L increases, the spot diameter D increases proportionally according to D = 2 * L * tan(theta_0).'
  }
];

export function QuizSection() {
  const [questions, setQuestions] = useState(fallbackQuiz);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.get('/api/quiz')
      .then(res => {
        if (res.data?.success && res.data.data?.length > 0) {
          setQuestions(res.data.data);
        }
      })
      .catch(() => {
        // Retain fallback questions
      });
  }, []);

  const handleSelectOption = (qOrder, optionIdx) => {
    if (submitted) return;
    setUserAnswers(prev => ({ ...prev, [qOrder]: optionIdx }));
  };

  const handleReset = () => {
    setUserAnswers({});
    setSubmitted(false);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (userAnswers[q.order] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const totalAnswered = Object.keys(userAnswers).length;
  const score = calculateScore();

  return (
    <section id="quiz" className="py-12">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-charcoal-900 tracking-tight">
              10. Knowledge Assessment Quiz (5 Questions)
            </h2>
            <p className="text-sm text-charcoal-600 mt-1">
              Verify your understanding of total internal reflection, numerical aperture, and cone divergence.
            </p>
          </div>

          {submitted && (
            <div className="p-3 bg-slate-100 border border-borderline rounded flex items-center gap-3">
              <div>
                <span className="text-xs text-charcoal-500 font-mono block">Your Final Score:</span>
                <span className="text-lg font-bold font-mono text-primary">
                  {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
                </span>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="lab-btn-secondary text-xs py-1.5 px-3"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retake Quiz
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => {
          const selected = userAnswers[q.order];
          const isCorrect = selected === q.correctIndex;

          return (
            <div
              key={q.order}
              className={`lab-card p-6 bg-surface border transition-colors ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-300'
                    : 'border-red-300'
                  : 'border-borderline'
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="w-6 h-6 rounded bg-slate-100 border border-borderline text-xs font-mono font-bold text-primary flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <h3 className="font-bold text-sm text-charcoal-900 leading-snug">
                  {q.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2 ml-9">
                {q.options.map((option, optIdx) => {
                  const isThisSelected = selected === optIdx;
                  const isThisCorrect = optIdx === q.correctIndex;

                  let optionStyle = 'border-borderline hover:bg-slate-50 text-charcoal-800';
                  if (submitted) {
                    if (isThisCorrect) {
                      optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-medium';
                    } else if (isThisSelected && !isThisCorrect) {
                      optionStyle = 'border-red-400 bg-red-50 text-red-900';
                    } else {
                      optionStyle = 'border-borderline opacity-60 text-charcoal-600';
                    }
                  } else if (isThisSelected) {
                    optionStyle = 'border-primary bg-sky-50 text-primary font-medium';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleSelectOption(q.order, optIdx)}
                      className={`w-full text-left p-3 rounded text-xs border flex items-center justify-between transition-colors ${optionStyle}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded border border-current flex items-center justify-center text-[10px] font-mono shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {submitted && isThisCorrect && (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {submitted && isThisSelected && !isThisCorrect && (
                        <X className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submission */}
              {submitted && (
                <div className="mt-4 ml-9 p-3 bg-slate-50 border border-borderline rounded text-xs text-charcoal-700 font-mono">
                  <span className="font-semibold text-charcoal-900 block mb-1">
                    Explanation:
                  </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}

        {/* Submit Quiz button */}
        {!submitted && (
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-charcoal-500 font-mono">
              Answered: {totalAnswered} of {questions.length}
            </span>

            <button
              type="button"
              disabled={totalAnswered < questions.length}
              onClick={() => setSubmitted(true)}
              className={`lab-btn-primary ${totalAnswered < questions.length ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Submit and Review Answers
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
