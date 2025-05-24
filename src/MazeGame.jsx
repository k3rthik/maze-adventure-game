import React, { useState } from "react";
import characterImg from "./character.png";
import monsterImg from "./monster.jpeg";
import ladderImg from "./ladder.png";
import swordImg from "./sword.jpg";
import spaceBg from "./space.avif"; // your space background image

const storyNodes = {
  start: {
    text: "You enter a space maze. Do you want to go left or right?",
    images: ["character"],
    options: [
      { text: "Left", next: "leftBridge", move: "left" },
      { text: "Right", next: "ladderNode", move: "right" }
    ],
  },
  leftBridge: {
    text: "You see a space bridge. Do you want to cross it?",
    images: ["character"],
    options: [
      { text: "Yes", next: "bridgeFall", move: "center", score: -5 },
      { text: "No", next: "hiddenPath", move: "left", score: 5 }
    ],
  },
  bridgeFall: {
    text: "While you cross, the bridge snaps! You fall into a black hole. Game over 💀",
    images: ["character"],
    options: [{ text: "Restart", next: "start", move: "start", score: 0 }]
  },
  hiddenPath: {
    text: "Smart move! You find a hidden path and a shiny laser sword. Do you pick it up?",
    images: ["character", "sword"],
    options: [
      { text: "Yes", next: "monsterFight", move: "left", score: 10 },
      { text: "No", next: "monsterLose", move: "left", score: 0 }
    ],
  },
  monsterFight: {
    text: "A space monster appears! Do you swing your laser sword?",
    images: ["character", "monster"],
    options: [
      { text: "Yes", next: "swingSword", move: "center", score: 10 },
      { text: "No", next: "lose", move: "center", score: 0 }
    ],
  },
  swingSword: {
    text: "You swing your sword at the monster!",
    images: ["character", "monster", "sword"],
    swordSwing: true,
    options: [{ text: "Continue", next: "win", move: "center", score: 10 }]
  },
  monsterLose: {
    text: "A monster attacks! You have no weapon. Game over 😈",
    images: ["monster"],
    options: [{ text: "Restart", next: "start", move: "start", score: 0 }]
  },
  win: {
    text: "You slay the monster and find a cosmic treasure chest. You win! 🏆",
    images: ["character"],
    options: [{ text: "Restart", next: "start", move: "start", score: 0 }]
  },
  lose: {
    text: "The monster attacks and you lose! Game over.",
    images: ["monster"],
    options: [{ text: "Restart", next: "start", move: "start", score: 0 }]
  },
  ladderNode: {
    text: "You see a glowing ladder. Do you want to climb up?",
    images: ["character", "ladder"],
    options: [
      { text: "Yes", next: "climbLadder", move: "up", score: 15 },
      { text: "No", next: "deadEnd", move: "right", score: 0 }
    ]
  },
  climbLadder: {
    text: "You climb up the ladder and escape the maze! You win! 🎉",
    images: ["character", "ladder"],
    climb: true,
    options: [{ text: "Restart", next: "start", move: "start", score: 0 }]
  },
  deadEnd: {
    text: "You find a dead end. Game over.",
    images: [],
    options: [{ text: "Restart", next: "start", move: "start", score: 0 }]
  }
};

export default function MazeGame() {
  const [node, setNode] = useState("start");
  const [position, setPosition] = useState("start");
  const [score, setScore] = useState(0);

  const handleOption = (opt) => {
    setNode(opt.next);
    setPosition(opt.move || position);
    // Add score from option, or reset if restart
    if (typeof opt.score === 'number') {
      if (opt.next === "start") setScore(0);
      else setScore(prev => prev + opt.score);
    }
  };

  const getCharacterClass = () => {
    if (storyNodes[node].climb) return "character-up";
    switch (position) {
      case "left":
        return "character-left";
      case "right":
        return "character-right";
      case "up":
        return "character-up";
      default:
        return "character-center";
    }
  };

  return (
    <div className="game-container">
      <div className="score-badge">Score: {score}</div>
      <h1 className="game-title">Maze Adventure Game</h1>
      <div
        className="maze-area"
        style={{
          backgroundImage: `url(${spaceBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {storyNodes[node].images?.includes("character") && (
          <img src={characterImg} alt="Character" className={`character ${getCharacterClass()}`} />
        )}
        {storyNodes[node].images?.includes("monster") && (
          <img src={monsterImg} alt="Monster" className="monster" />
        )}
        {storyNodes[node].images?.includes("ladder") && (
          <img src={ladderImg} alt="Ladder" className="ladder" />
        )}
        {storyNodes[node].swordSwing && (
          <img src={swordImg} alt="Sword" className="sword-swing" />
        )}
        {storyNodes[node].images?.includes("sword") && !storyNodes[node].swordSwing && (
          <img src={swordImg} alt="Sword" className="sword" />
        )}
      </div>
      <div className="story">{storyNodes[node].text}</div>
      <div className="choices">
        {storyNodes[node].options.map((opt, idx) => (
          <button key={idx} onClick={() => handleOption(opt)}>
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}