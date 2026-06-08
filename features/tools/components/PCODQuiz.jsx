'use client';

import React, { useReducer, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle,
  Circle,
  User,
  Mail,
  List,
  MessageCircle,
  Heart,
  Coffee,
  Activity,
  ThumbsUp,
  XCircle,
} from 'lucide-react';


const initialState = {
  currentStep: 0,
  answers: {},
  loading: false,
  error: null,
  result: null,
};

function quizReducer(state, action) {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, currentStep: state.currentStep + 1 };
    case 'PREV_STEP':
      return { ...state, currentStep: state.currentStep - 1 };
    case 'SET_ANSWER':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: action.payload.answer,
        },
      };
    case 'SUBMIT_START':
      return { ...state, loading: true, error: null };
    case 'SUBMIT_SUCCESS':
      return { ...state, loading: false, result: action.payload };
    case 'SUBMIT_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'RESET_QUIZ':
      return initialState;
    default:
      return state;
  }
}


const quizData = [
  {
    id: 'intro',
    type: 'intro',
    title: 'Take the PCOD Quiz',
    description: 'Understand how you can manage your PCOS symptoms effectively.',
    steps: [
      {
        icon: List,
        title: 'Quiz outcome',
        description: 'Assessing whether you have PCOS and attaining a thorough understanding of your symptoms',
      },
      {
        icon: ThumbsUp,
        title: 'Guidance on next steps',
        description: 'Get personalized recommendations and actionable advice to manage your health.',
      },
    ],
  },
  {
    id: 'user_info',
    type: 'form',
    question: "What's your name?",
    description: "Let's get to know each other before we dive into the quiz.",
    fields: [
      { id: 'full_name', label: 'Full name', type: 'text', icon: User, required: true },
      { id: 'email', label: 'Email', type: 'email', icon: Mail, required: true },
    ],
  },
  {
    id: 'q1_digestive',
    type: 'choice',
    question: 'Do you have chronic digestive problems, such as bloating, diarrhea, ulcers, reflux, or indigestion?',
    options: ['Yes', 'No'],
  },
  {
    id: 'q2_lethargic',
    type: 'choice',
    question: 'Are you constantly tired and lethargic?',
    options: ['Often', 'Seldom'],
  },
  {
    id: 'q3_cravings',
    type: 'choice',
    question: 'Do you crave carbohydrates, such as rice, bread, and sugary sweets?',
    options: ['Yes', 'No'],
  },
  {
    id: 'q4_hypoglycemia',
    type: 'choice',
    question: 'Do you experience symptoms of hypoglycemia, such as shakiness, irritability, or dizziness?',
    options: ['Yes', 'No'],
  },
  {
    id: 'q5_stress',
    type: 'choice',
    question: 'Have you experienced extreme stress, anxiety or depression in the last 5-8 years?',
    options: ['Often', 'Seldom'],
  },
  {
    id: 'q6_coffee',
    type: 'choice',
    question: 'Do you drink coffee regularly?',
    options: ['Yes', 'No'],
  },
  {
    id: 'q7_exercise',
    type: 'choice',
    question: 'Do you overwork or overexercise?',
    options: ['Yes', 'No'],
  },
];

export default function PCODQuiz() {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const [localAnswers, setLocalAnswers] = useState({});
  const [formError, setFormError] = useState(null); // New state for form validation error

  const { currentStep, answers, loading, result, error } = state;
  const currentQuestion = quizData[currentStep];

  const handleNext = async () => {
    // Basic validation for the user info step
    if (currentQuestion.id === 'user_info') {
      if (!localAnswers.full_name || !localAnswers.email) {
        setFormError('Please fill in both name and email fields.');
        return;
      } else {
        setFormError(null); // Clear the error if validation passes
      }
    }

    if (currentStep < quizData.length - 1) {
      dispatch({ type: 'SET_ANSWER', payload: localAnswers });
      dispatch({ type: 'NEXT_STEP' });
      setLocalAnswers({});
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      dispatch({ type: 'PREV_STEP' });
      setFormError(null); // Clear any form errors on back navigation
      const prevQuestion = quizData[currentStep - 1];
      // Load previous answer back into local state if it exists
      if (answers[prevQuestion.id]) {
        setLocalAnswers(answers[prevQuestion.id]);
      }
    }
  };

  const handleOptionClick = (option) => {
    dispatch({
      type: 'SET_ANSWER',
      payload: { questionId: currentQuestion.id, answer: option },
    });
    // Automatically move to the next step after an option is selected
    setTimeout(() => {
      handleNext();
    }, 300);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalAnswers((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async () => {
    dispatch({ type: 'SUBMIT_START' });

    // Combine all answers into a single object for the API call
    const finalAnswers = { ...answers, [currentQuestion.id]: localAnswers };
    console.log('Final Answers to be sent:', finalAnswers);

    // --- Backend API Call Simulation ---
    // For now, we'll simulate a successful submission without a real API call.
    // This allows the "Thank you" screen to be shown immediately.
    setTimeout(() => {
      const resultData = {
        message: 'Quiz submitted successfully!',
        planDetails: 'This is a placeholder for your personalized plan based on the quiz results.',
        userName: finalAnswers.user_info?.full_name || 'user',
      };
      dispatch({ type: 'SUBMIT_SUCCESS', payload: resultData });
    }, 1500); // Simulate a 1.5-second network delay

    // --- TODO: Add your actual backend API call here. ---
    /*
    try {
      const backendEndpoint = '/api/quiz/submit';
      const response = await fetch(backendEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalAnswers),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz data.');
      }

      const resultData = await response.json();
      dispatch({ type: 'SUBMIT_SUCCESS', payload: resultData });
    } catch (err) {
      dispatch({ type: 'SUBMIT_FAILURE', payload: err.message });
    }
    */
  };

  const renderContent = (handleInputChange) => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Loader2 className="h-16 w-16 animate-spin text-[#67BC2A]" />
          <p className="mt-4 text-xl font-medium text-gray-700">Submitting your answers...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center text-red-500">
          <XCircle className="h-16 w-16" />
          <p className="mt-4 text-xl font-medium">Error: {error}</p>
          <button
            onClick={() => dispatch({ type: 'RESET_QUIZ' })}
            className="mt-6 rounded-full bg-[#67BC2A] px-8 py-3 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#5aa624]"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (result) {
      return (
        <div className="flex flex-col items-center p-8 text-center">
          <CheckCircle className="h-20 w-20 text-[#67BC2A]" />
          <h2 className="mt-6 text-2xl font-bold text-gray-800 md:text-3xl">Thank you for answering these questions!</h2>
          <div className="mt-10 w-full">
            <h3 className="text-xl font-semibold text-gray-800 md:text-2xl">Curated plan for you</h3>
            <div className="mt-6 w-full rounded-2xl bg-gray-50 p-6 shadow-inner">
              {/* TODO: Render dynamic content from the API result here */}
              <p className="text-gray-500">
                This is a placeholder for your personalized plan based on the quiz results.
              </p>
              <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Heart className="h-4 w-4 text-red-400" />
                <span>9 months plan</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => dispatch({ type: 'RESET_QUIZ' })}
            className="mt-8 rounded-full bg-gray-200 px-6 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-300"
          >
            Start Over
          </button>
        </div>
      );
    }

    // Render the current question based on its type
    switch (currentQuestion.type) {
      case 'intro':
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 md:text-3xl">
              {currentQuestion.title}
            </h2>
            <p className="mt-2 text-gray-600">{currentQuestion.description}</p>
            <div className="mt-8 space-y-4">
              {currentQuestion.steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="flex items-start rounded-xl border border-gray-200 p-4 text-left shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#67BC2A]/10 text-[#67BC2A]">
                      {index === 0 ? <List className="h-5 w-5" /> : <ThumbsUp className="h-5 w-5" />}
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-gray-800">
                        <span className="text-lg font-bold text-[#67BC2A]">{`0${index + 1}`}</span> {step.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={handleNext}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#67BC2A] px-10 py-3 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#5aa624]"
            >
              Get Started
            </button>
          </div>
        );

      case 'form':
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 md:text-3xl">
              {currentQuestion.question}
            </h2>
            <p className="mt-2 text-gray-600">{currentQuestion.description}</p>
            <div className="mt-8 space-y-4">
              {currentQuestion.fields.map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.id} className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={field.type}
                      id={field.id}
                      name={field.id}
                      placeholder={field.label}
                      value={localAnswers[field.id] || ''}
                      onChange={handleInputChange}
                      required={field.required}
                      className="w-full rounded-full border border-gray-300 bg-gray-50 py-3 pl-12 pr-4 text-gray-800 placeholder-gray-500 transition-colors focus:border-[#67BC2A] focus:outline-none focus:ring-1 focus:ring-[#67BC2A]"
                    />
                  </div>
                );
              })}
            </div>
            {/* Display the error message here */}
            {formError && (
              <p className="mt-4 text-sm font-medium text-red-500">{formError}</p>
            )}
            <button
              onClick={handleNext}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#67BC2A] px-10 py-3 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#5aa624]"
            >
              Next <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        );

      case 'choice':
        const progressPercentage = ((currentStep - 1) / (quizData.length - 2)) * 100;
        return (
          <div className="relative flex min-h-[500px] flex-col items-center justify-center p-8 text-center">
            {/* Progress bar and counter */}
            <div className="absolute left-0 top-0 w-full px-8 pt-8">
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-[#67BC2A] transition-all duration-300 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-500">{currentStep - 1} of {quizData.length - 2}</p>
            </div>

            <h2 className="mt-16 text-xl font-bold text-gray-800 md:text-2xl">
              {currentQuestion.question}
            </h2>

            <div className="mt-8 w-full max-w-sm space-y-4">
              {currentQuestion.options.map((option, index) => {
                const isSelected = answers[currentQuestion.id] === option;
                return (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    className={`w-full rounded-full border-2 p-4 text-lg font-medium transition-all duration-200 ${
                      isSelected
                        ? 'border-[#67BC2A] bg-[#67BC2A] text-white shadow-md'
                        : 'border-gray-300 bg-white text-gray-800 hover:border-[#67BC2A]/50'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex w-full max-w-sm justify-between">
              <button
                onClick={handlePrev}
                className={`flex items-center rounded-full px-6 py-2 text-gray-500 transition-colors hover:bg-gray-100 ${
                  currentStep <= 1 ? 'invisible' : ''
                }`}
              >
                <ChevronLeft className="h-5 w-5" /> Back
              </button>
              {currentStep === quizData.length - 1 && (
                <button
                  onClick={handleSubmit}
                  className="flex items-center rounded-full bg-[#67BC2A] px-6 py-2 text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#5aa624]"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="px-4 pb-8 md:px-12 md:pb-12">{renderContent(handleInputChange)}</div>
      </div>
    </div>
  );
}
