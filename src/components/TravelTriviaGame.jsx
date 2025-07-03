import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from "./Card";
import CardContent from "./CardContent";
import Button from "./Button";

const triviaQuestions = [
  {
    question: "Which Indian state is known as the 'Land of Five Rivers'?",
    options: ["Punjab", "Kerala", "Assam", "Haryana"],
    answer: "Punjab",
    fact: "Punjab is named after the five rivers that flow through it: Sutlej, Beas, Ravi, Chenab, and Jhelum.",
  },
  {
    question: "Which is the highest mountain peak in India?",
    options: ["Mount Everest", "Kanchenjunga", "Nanda Devi", "Trisul"],
    answer: "Kanchenjunga",
    fact: "Kanchenjunga is the third highest mountain in the world, and the highest in India, located in Sikkim.",
  },
  {
    question: "Which town is famous for its toy-making tradition in South India?",
    options: ["Channapatna", "Kanchipuram", "Madurai", "Coorg"],
    answer: "Channapatna",
    fact: "Channapatna in Karnataka is known as the 'Toy Town of India' for its centuries-old tradition of handcrafted wooden toys."
  },
  {
    question: "Which Indian city is known as the 'City of Lakes'?",
    options: ["Udaipur", "Hyderabad", "Bhopal", "Nainital"],
    answer: "Udaipur",
    fact: "Udaipur in Rajasthan is known for its stunning lakes and royal heritage, especially Lake Pichola.",
  },
  {
    question: "Where is the living root bridge found in India?",
    options: ["Sikkim", "Manipur", "Meghalaya", "Arunachal Pradesh"],
    answer: "Meghalaya",
    fact: "These bridges in Meghalaya are made by training tree roots to grow across streams, forming living walkways."
  }
];

export default function TravelTriviaGame({ clickSound, correctSound, wrongSound }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showFact, setShowFact] = useState(false);

  const handleAnswer = (option) => {
    clickSound.play();
    const isCorrect = option === triviaQuestions[current].answer;
    if (isCorrect) {
      correctSound.play();
      setScore(score + 1);
      setShowFact(true);
    } else {
      wrongSound.play();
      nextQuestion();
    }
  };

  const nextQuestion = () => {
    setShowFact(false);
    if (current + 1 < triviaQuestions.length) {
      setCurrent(current + 1);
    } else {
      setDone(true);
    }
  };

  const reset = () => {
    clickSound.play();
    setScore(0);
    setCurrent(0);
    setDone(false);
    setShowFact(false);
  };

  const buttonStyle = {
    backgroundColor: "var(--accent)",
    color: "var(--text)"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto mb-20"
    >
      {!done ? (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">{triviaQuestions[current].question}</h3>
            <div className="grid grid-cols-2 gap-4">
              {triviaQuestions[current].options.map((opt, i) => (
                <Button key={i} onClick={() => handleAnswer(opt)} style={buttonStyle}>
                  {opt}
                </Button>
              ))}
            </div>
            {showFact && (
              <>
                <p className="mt-4 text-green-300 text-sm">✅ {triviaQuestions[current].fact}</p>
                <Button className="mt-4" onClick={nextQuestion} style={buttonStyle}>
                  Next Question →
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-green-100 text-black">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">🎉 Your Score: {score}/{triviaQuestions.length}</h3>
            <Button onClick={reset} style={buttonStyle}>
              Play Again
            </Button>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
