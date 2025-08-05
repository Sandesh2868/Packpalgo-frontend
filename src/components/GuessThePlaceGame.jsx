import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from "./Card";
import CardContent from "./CardContent";
import Button from "./Button";
import confetti from 'canvas-confetti';

function useConfettiOnWin(trigger) {
  useEffect(() => {
    if (trigger) {
      confetti({ particleCount: 150, spread: 90 });
    }
  }, [trigger]);
}

export default function GuessThePlaceGame({ clickSound, correctSound, wrongSound }) {
  const guessGameData = [
    { image: "/images/hampi.jpg", correct: "Hampi", options: ["Hampi", "Udaipur", "Mahabalipuram", "Khajuraho"] },
    { image: "/images/kerala back water.avif", correct: "Alleppey", options: ["Alleppey", "Kerala", "Munnar", "Kullu"] },
    { image: "/images/mawlynnong.jpg", correct: "Mawlynnong", options: ["Mawlynnong", "Mawsynram", "Cherrapunji", "Ziro"] },
    { image: "/images/ladakh.jpg", correct: "Ladakh", options: ["Spiti Valley", "Leh", "Ladakh", "Srinagar"] },
    { image: "/images/jaisalmer-fort.jpg", correct: "Jaisalmer Fort", options: ["Mehrangarh Fort", "Jaisalmer Fort", "Amber Fort", "Gwalior Fort"] },
    { image: "/images/valley-of-flowers.jpg", correct: "Valley of Flowers", options: ["Valley of Flowers", "Nanda Devi", "Auli", "Kedarnath"] }
  ];

  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [currentPlayer, setCurrentPlayer] = useState("player1");
  const [completed, setCompleted] = useState(false);

  const totalQuestions = guessGameData.length;
  const winner = scores.player1 > scores.player2 ? "Player 1" : scores.player2 > scores.player1 ? "Player 2" : "Tie";

  useConfettiOnWin(completed);

  const handleGuess = (option) => {
    clickSound.play();
    if (option === guessGameData[index].correct) {
      correctSound.play();
      setScores((prev) => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 1 }));
    } else {
      wrongSound.play();
    }

    const nextPlayer = currentPlayer === "player1" ? "player2" : "player1";

    if (index + 1 < totalQuestions) {
      setIndex(index + 1);
      setCurrentPlayer(nextPlayer);
    } else {
      setCompleted(true);
    }
  };

  const resetGame = () => {
    clickSound.play();
    setIndex(0);
    setScores({ player1: 0, player2: 0 });
    setCurrentPlayer("player1");
    setCompleted(false);
  };

  const current = guessGameData[index];
  const buttonStyle = {
    backgroundColor: "var(--accent)",
    color: "var(--text)"
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto mb-20">
      {!completed ? (
        <Card>
          <CardContent className="p-4">
            <p className="text-md mb-2" style={{ color: "white" }}>
              🎮 Turn: <strong>{currentPlayer === "player1" ? "Player 1" : "Player 2"}</strong>
            </p>
            <img src={current.image} alt="Guess the place" className="w-full h-64 object-cover rounded-xl mb-4" />
            <div className="grid grid-cols-2 gap-4">
              {current.options.map((opt, i) => (
                <Button key={i} onClick={() => handleGuess(opt)} style={buttonStyle}>
                  {opt}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gray-800 text-white">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2" style={{ color: "white" }}>🏁 Game Over</h3>
            <p className="mb-1" style={{ color: "white" }}>Player 1 Score: <strong>{scores.player1}</strong></p>
            <p className="mb-3" style={{ color: "white" }}>Player 2 Score: <strong>{scores.player2}</strong></p>
            <p className="text-lg font-semibold" style={{ color: "white" }}>
              {winner === "Tie" ? "🤝 It's a Tie!" : `🎉 ${winner} Wins!`}
            </p>
            <Button className="mt-4" onClick={resetGame} style={buttonStyle}>
              Play Again
            </Button>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
