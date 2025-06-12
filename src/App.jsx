import Die from "./Die"
import { bestScoreRef, get, set } from './firebase'
import { useEffect, useState } from 'react'
import { nanoid } from "nanoid";
import Confetti from "react-confetti"

export default function App(){
    function allNewDice(){
        const newdice = [];
        for(let i = 0; i < 10; i++){
            const rand = { value: Math.ceil(Math.random() * 6), isHeld: false, id: nanoid() }
            newdice.push(rand)
        }
        return newdice
    }

    const [score, setScore] = useState(0);
    const [dice, setDice] = useState(() => allNewDice());
    const [bestRolls, setBestRolls] = useState(null);
    const [hasUpdatedBest, alreadyUpdated] = useState(false); 

    const gameWon = dice.every(die => die.isHeld) && dice.every(die => die.value === dice[0].value);

    useEffect(() => {
        get(bestScoreRef).then(snapshot => {
            if (snapshot.exists()) {
                setBestRolls(snapshot.val());
            }
        }).catch(console.error);
    }, []);

    useEffect(() => {
        if (gameWon && !hasUpdatedBest) {
            if (!bestRolls || score < bestRolls) {
                set(bestScoreRef, score)
                    .then(() => setBestRolls(score))
                    .catch(console.error);
            }
            alreadyUpdated(true); 
        }
    }, [gameWon, score, bestRolls, hasUpdatedBest]);

    function rollDice(){
        if (!gameWon) {
            setDice(prevDie => prevDie.map(item => {
                return item.isHeld ? item : { ...item, value: Math.ceil(Math.random() * 6) }
            }));
            setScore(prev => prev + 1);
        } else {
            setDice(allNewDice());
            setScore(0);
            alreadyUpdated(false); 
        }
    }

    function hold(id){
        setDice(prevDie => prevDie.map(item => {
            return item.id === id ? { ...item, isHeld: !item.isHeld } : item;
        }));
    }

    const diceElems = dice.map(dieObj => (
        <Die 
            key={dieObj.id} 
            value={dieObj.value} 
            isHeld={dieObj.isHeld} 
            hold={() => hold(dieObj.id)}
        />
    ));

    return (
        <main>
            {gameWon && <Confetti className="confetti" />}
            <h1 className="title">Tenzies</h1>
            <p className="instruction">
                Roll until all dice are the same. Click each die to freeze at its current value between rolls.
            </p>
            <div className="dice-cont">
                {diceElems}
            </div>
            <button className="roll-btn" onClick={rollDice}>
                {gameWon ? "Play Again!" : "Roll"}
            </button>

            {!gameWon && <h2 className="score">Score: {score}</h2>}

            {gameWon && <>
                <h2 className="score">🎉 Game Won 🎉</h2>
                <h3 className="score">Your Score: {score}</h3>
            </>}

            {bestRolls !== null && (
                <h4 className="score">🥇 Best Global Score: {bestRolls} rolls</h4>
            )}
        </main>
    );
}
