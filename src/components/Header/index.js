import React from "react";
import "./style.css";
import { Container } from "react-bootstrap";
import { FaRedo } from "react-icons/fa";

const Header = ({ moves, match, handleRestart }) => {
  return (
    <div>
      <h1>Memory Game</h1>
      <Container>
        <div className="sub-header">
          <div className="moves">
            <span className="bold">Moves:</span>
            {moves}
          </div>
          <div className="reshuffle">
            <button onClick={handleRestart}>
              <FaRedo />
            </button>
          </div>
          
            <div className="high-score">
              <span>Matches:</span>
              {match}
            </div>
        </div>
      </Container>
    </div>
  );
};

export default Header;