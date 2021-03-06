import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Score(props) {
  if(props.over)
    return (
      <div className='score gameOver'>
        Game Over! Final Score: {props.score}
        <span className='highScore'>highScore: {props.highScore}</span>
        <button className="restartButton" onClick={props.handleRestart}>Restart</button>
      </div>
    );
  else
    return <div className='score'>Score: {props.score} <span className='highScore'>highScore: {props.highScore}</span></div>;
}

function Snek(props) {
  return <span className='snek' style={{left: props.y * 25 + 'px', top: props.x * 25 + 'px'}}></span>;
}

function Food(props) {
  return <span className='food' style={{left: props.y * 25 + 'px', top: props.x * 25 + 'px'}}></span>;
}

class Surface extends React.Component {
  genSnek() {
    let snek = [];
    for(let i = 0; i < this.props.snek.length; i++) {
      snek.push(<Snek key={i} x={this.props.snek[i][0]} y={this.props.snek[i][1]} />);
    }
    return snek;
  }
  render() {
    return <div id='Surface' style={{width: this.props.surface * 25, height: this.props.surface * 25}}>{this.genSnek()}<Food x={this.props.food[0]} y={this.props.food[1]} /></div>;    
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snek: [
        [5, 6],
        [5, 7],
        [5, 8],
      ],
      direction: 'left',
      food: [10, 10],
      keyEvent: false,
      highScore: 0,
    }
    this.restartGame = this.restartGame.bind(this);
    this.timeout = null;
  }

  componentDidMount() {
    this.initLoop();
  }

  initLoop() {
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    this.timeout = setTimeout(
      () => {this.moveSnek(this.state.direction)},
      75
    );
  }

  checkCollision() {
    let oldSnek = this.state.snek;
    let snekHead = oldSnek[0];
    let food = this.state.food;
    let length = oldSnek.length;
    if(snekHead[0] === food[0] && snekHead[1] === food[1]) {
      this.increaseSnek();
      this.generateFood();
      return false;
    } else {
      for(let i = 1; i < length; i++) {
        if(snekHead[0] === oldSnek[i][0] && snekHead[1] === oldSnek[i][1])
          return true;
      }
      return false;
    }
  }

  moveSnek(direction) {
    let oldSnek = this.state.snek;
    let snekHead = oldSnek[0];
    let size = this.props.size - 1;

    if(this.checkCollision()) {
      this.endGame();
    }
    switch(direction) {
      case 'left':
        if(snekHead[1] === 0)
          oldSnek.unshift([snekHead[0], size]);
        else
          oldSnek.unshift([snekHead[0], snekHead[1] - 1]);
          oldSnek.pop();
        break;
      case 'right':
        if(snekHead[1] === size)
          oldSnek.unshift([snekHead[0], 0]);
        else
          oldSnek.unshift([snekHead[0], snekHead[1] + 1]);
          oldSnek.pop();
        break;
      case 'up':
        if(snekHead[0] === 0)
          oldSnek.unshift([size, snekHead[1]]);
        else
          oldSnek.unshift([snekHead[0] - 1, snekHead[1]]);
          oldSnek.pop();
        break;
      case 'down':
        if(snekHead[0] === size)
          oldSnek.unshift([0, snekHead[1]]);
        else
          oldSnek.unshift([snekHead[0] + 1, snekHead[1]]);
          oldSnek.pop();
        break;
      default:
        return;
    }
    this.setState({
      snek: oldSnek,
      keyEvent: false,
    });
    setTimeout(
      () => {this.moveSnek(this.state.direction)},
      75
    );
  }

  handleKeyPress(e) {
    let keycode = e.keyCode;
    let direction = this.state.direction;
    if(this.state.keyEvent || direction === '')
      return;
    switch(keycode) {
      case 37: //left
        if(direction === 'left' || direction === 'right')
          break;
        this.setState({
          direction: 'left',
          keyEvent: true,
        });
        break;
      case 39: //right
        if(direction === 'left' || direction === 'right')
          break;
        this.setState({
          direction: 'right',
          keyEvent: true,
        });
       break;
      case 38: //up
        if(direction === 'up' || direction === 'down')
          break;
        this.setState({
          direction: 'up',
          keyEvent: true,
        });
        break;
      case 40: //down
        if(direction === 'up' || direction === 'down')
          break;
        this.setState({
          direction: 'down',
          keyEvent: true,
        });
        break;
      default:
        //do nothing
    }
  }

  generateFood() {
    let snek = this.state.snek;
    let x = Math.floor(Math.random() * (this.props.size - 1)) + 1;
    let y = Math.floor(Math.random() * (this.props.size - 1)) + 1;
    let collision = false;
    do {
      collision = false;
      for(let i = 0; i<snek.length; i++) {
        if(snek[i][0] === x && snek[i][1] === y) {
          x = Math.floor(Math.random() * (this.props.size - 1)) + 1;
          y = Math.floor(Math.random() * (this.props.size - 1)) + 1;
          collision = true;
          continue;
        }
      }
    } while(collision);
    this.setState({
      food: [x, y],
    });
  }

  increaseSnek() {
    let oldSnek = this.state.snek;
    let highScore = this.state.highScore;
    oldSnek.push(oldSnek[oldSnek.length - 1]);
    if(highScore < oldSnek.length - 3) {
      this.setState({
        snake: oldSnek,
        highScore: oldSnek.length - 3,
      });      
    } else {
      this.setState({
        snake: oldSnek,
      });
    }
  }

  endGame() {
    this.setState({
      direction: '',
    });
  }

  restartGame() {
    this.setState({
      snek: [
        [5, 6],
        [5, 7],
        [5, 8],
      ],
      direction: 'left',
      food: [10, 10],
      keyEvent: false,
    });
    this.initLoop();
  }

  render() {
    let snek = this.state.snek;
    if(this.state.direction === '') {
      clearTimeout(this.timeout);
      return <div><Score score={snek.length - 3} highScore={this.state.highScore} over={true} handleRestart={this.restartGame} /></div>;
    }
    return <div><Score score={snek.length - 3} highScore={this.state.highScore} over={false} /><Surface food={this.state.food} snek={snek} surface={this.props.size} /></div>;

  }
}

ReactDOM.render(
  <Game size='20' />,
  document.getElementById('Game')
);
