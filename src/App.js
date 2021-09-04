import React, { useEffect, useRef, useState } from "react";
import uniqueCardsArray from "./data.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header/index.js";
import { Col, Container, Row } from "react-bootstrap";
import Card from "./components/Card/index.js";
import Finish from "./components/Finish/index.js";
import './App.css'
import { useBeforeunload } from "react-beforeunload"


// FisherYates Modern Shuffle Algorithm
function swap(array, i, j) {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}
function shuffleCards(array) {
  const length = array.length;
  for (let i = length; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * i);
    const currentIndex = i - 1;
    swap(array, currentIndex, randomIndex);
  }
  return array;
}

 const App = () => {
  const [cards, setCards] = useState(() =>
    shuffleCards(uniqueCardsArray.concat(uniqueCardsArray))
  );
  const [openCards, setOpencards] = useState([]);
  const [matchedCards, setMatchedcards] = useState({});
  const [moves, setMoves] = useState(0);
  const [match, setMatch] =useState(0);
  const [showModal, setShowModal] = useState(false);
  const [shouldDisableAllCards, setShouldDisableAllCards] = useState(false);
  const timeout = useRef(null);
  
  
  useBeforeunload(()=> 'Are you sure want to leave the game?');

  const disable = () => {
    setShouldDisableAllCards(true);
  };

  const enable = () => {
    setShouldDisableAllCards(false);
  };

  const checkCompletion = () => {
    if (Object.keys(matchedCards).length === uniqueCardsArray.length) {
      setShowModal(true);
    }
  };
  
  const evaluate = () => {
    const [first, second] = openCards;
    enable();
    
    if (cards[first].type === cards[second].type) {
      setMatchedcards((prev) => ({ ...prev, [cards[first].type]: true }));
      setOpencards([]);
      // alert("you have found a match");
      setMatch((match) => match + 1);
      return;
    }
    timeout.current = setTimeout(() => {
      setOpencards([]);
    }, 500);
  };

  const handleCardClick = (index) => {
    if (openCards.length === 1) {
      setOpencards((prev) => [...prev, index]);
      setMoves((moves) => moves + 1);
      disable();
    } else {
      clearTimeout(timeout.current);
      setOpencards([index]);
    }
  };
  useEffect(() => {
    let timeout = null;
    if (openCards.length === 2) {
      timeout = setTimeout(evaluate, 300);
    }
    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line
  }, [openCards]);

  useEffect(() => {
    // eslint-disable-next-line
    checkCompletion();
    // eslint-disable-next-line
  }, [matchedCards]);

  useEffect(() => {
    // eslint-disable-next-line
    window.onbeforeunload =confirmExit;
    function confirmExit() {
      return "show warning";
    }
    // eslint-disable-next-line
  }, []);


  const checkIsFlipped = (index) => {
    return openCards.includes(index);
  };
  const checkIsInactive = (card) => {
    return Boolean(matchedCards[card.type]);
  };

  


 
  const handleRestart = () => {
    setMatchedcards({});
    setOpencards([]);
    setShowModal(false);
    setMoves(0);
    setMatch(0);
    setShouldDisableAllCards(false);
    setCards(shuffleCards(uniqueCardsArray.concat(uniqueCardsArray)));
  };

  return (
    <div>
      <Header
        moves={moves}
        match={match}
        handleRestart={handleRestart}
      />
      <Container className="container">
        <Row>
          {cards.map((card, index) => {
            return (
              <Col xs={3}  md={1} lg={3}>
                <Card
                  key={index}
                  card={card}
                  index={index}
                  isDisabled={shouldDisableAllCards}
                  isInactive={checkIsInactive(card)}
                  isFlipped={checkIsFlipped(index)}
                  onClick={handleCardClick}
                />
              </Col>
            );
          })}
        </Row>
      </Container>
      <Finish
        showModal={showModal}
        moves={moves}
        match={match}
        handleRestart={handleRestart}
      />
   
   
    </div>
  );
};

export default App;