import React, { useEffect, useState } from 'react';
import './Wordle.css';

const WORD_LENGTH = 6;

// NavBar Component
const NavBar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-content">
                <span className="creator-name">Author: 🐙</span>
                <a 
                    href="https://www.instagram.com/byebyeyuchii/?hl=en" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="instagram-link"
                >
                    Octotagram
                </a>
            </div>
        </nav>
    );
};

const Wordle = () => {
    const [givenWord, setGivenWord] = useState('');
    const [guesses, setGuesses] = useState(Array(WORD_LENGTH).fill(null));
    const [currentGuess, setCurrentGuess] = useState('');

    const [gameOver, setGameOver] = useState(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        setGivenWord("SALMON");
    }, []);

    console.log(givenWord, gameOver, failed, guesses, currentGuess);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (gameOver || failed) {
                return;
            }
    
            if (e.key === 'Enter') {
                if (currentGuess.length < WORD_LENGTH) {
                    return;
                }
    
                const newGuesses = [...guesses];
                const currentGuessIndex = newGuesses.findIndex(guess => guess === null);
    
                // Set current guess
                newGuesses[currentGuessIndex] = currentGuess;
                setGuesses(newGuesses);
    
                // Check if the guess matches the given word
                if (currentGuess === givenWord) {
                    setGameOver(true);
                }
    
                setCurrentGuess('');
    
                // Check if it's the last guess and it failed
                if (currentGuessIndex === guesses.length - 1 && currentGuess !== givenWord) {
                    setFailed(true);
                }
            } else if (e.key === 'Backspace') {
                setCurrentGuess(currentGuess.slice(0, -1));
                return;
            }
    
            if (currentGuess.length >= WORD_LENGTH) {
                return;
            }
    
            // Handle typing letters
            if (/^[a-zA-Z]{1}$/.test(e.key)) {
                setCurrentGuess(currentGuess + e.key.toUpperCase());
            }
        };
    
        window.addEventListener('keydown', handleKeyPress);
    
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [currentGuess, failed, gameOver, givenWord, guesses]);
    

    return (
        <div className='container'>
            <NavBar /> 
            <div style={{ gap: '0px', color: '#4c1130', fontWeight: 400}}>
                <span>*Gray block means the letter is not used in word</span>
                <br />
                <span>*Blue block means the letter is used but in a different position</span>
                <br />
                <span>*Green block means the letter is correct in postion!</span>
            </div>
            <div className='guess-input'>
            <h1 style={{ color: "#741b47"}}>What is the favorite food of octopus and squid?</h1>
            <h2>🦑🐙❤️🍜</h2>
            {guesses.map((guess, idx) => {
                const isCurrentGuess = idx === guesses.findIndex(guess => guess === null);
                return (
                    <Line
                        key={idx}
                        guess={isCurrentGuess ? currentGuess : guess ?? ''}
                        finished={!isCurrentGuess && guess !== null}
                        givenWord={givenWord}
                    />
                )
            })}
            {gameOver && (<>
            <div style={{ color: "#741b47"}}>You've won!</div>
            <h3 style={{ color: "#741b47"}}>🦑 & 🐙 can have 🍣 for dinner(♡˙︶˙♡)</h3>
            </>)}
            {failed && (<>
            <div style={{ color: "#741b47"}}>{`You've lost! The correct answer is: ${givenWord}`}</div>
            <h3 style={{ color: "#741b47"}}>But it's ok. I guess 🦑 & 🐙 are ok with《{guesses[WORD_LENGTH-1]}》as dinner (´▽`ʃ♡ƪ)"</h3>
            </>)}
            </div>
        </div>
    );
}


const Line = ({ guess, finished, givenWord }) => {
    const tiles = [];

    for (let i = 0; i < WORD_LENGTH; i++) {
        let className = 'tile';
        const char = guess[i];

        if (finished) {
            if (char === givenWord[i]) {
                className += ' correct';
            } else if (givenWord.includes(char)) {
                className += ' included';
            } else {
                className += ' incorrect';
            }
        }

        tiles.push(<div key={i} className={className}>{char}</div>)
    }

    return (
        <div className='line'>
            {tiles}
        </div>
    )
}

export default Wordle;
