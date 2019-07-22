import React, {Component} from 'react';
import styles from './App.css';

class App extends Component {
  butt = 5;
  colorButton = `btn-info`

  state = {
    start: "Start Mul",
    buttons: null,
    factor1: null,
    factor2: null,
    result: null,
    select: null,
    progressBarColor: `one`,
    classButton: [],
    buttonData: [],
    rating: 5
  };

  componentDidMount() {
    this.init();
   };

  init() {
    this.update(this.butt);
  };

  update(buttons) {
    const factor1 = this.randomData(9);
    const factor2 = this.randomData(9);
    const result = factor1 * factor2;
    const select = this.randomData(3);
    const classButton = new Array(buttons).fill(`btn-info`);
    const buttonData = this.generator(buttons, select, factor1, factor2, result);
    this.setState({
      factor1,
      factor2,
      result,
      select,
      buttons,
      classButton,
      buttonData
    });
  };

  randomData(range, offset = 1) {
    return Math.floor(Math.random() * range) + offset;
  };

  generator(buttons, select, factor1, factor2, result) {
    let rnd, range = null, offset = 1;
    const buttonData = [];
    //const { buttons, select, factor1, factor2, result } = this.state;
    switch (select) {
      case 1:
        buttonData.push(factor1);
        range = 9;
        break;
      case 2:
        buttonData.push(factor2);
        range = 9;
        break;
      case 3:
        buttonData.push(result);
        range = (result + 10);
        offset = ((range - 20) < 1) ? 1 : (range - 20);
        range = ((range + offset) > 99) ? (99 - offset) : range;
        break;
      default:
        console.log('Я таких значений не знаю');
    };
    do {
      rnd = this.randomData(range, offset);
      if ((!buttonData.includes(rnd))) {
        buttonData.push(rnd);
        console.log("TCL: App -> generator -> buttonData", buttonData)}
    } while (buttonData.length < buttons);
    return buttonData.sort();
  }

  rating(rating) {
  console.log("TCL: App -> rating -> rating", rating)
  };

  timerCount() {
    return new Promise(resolve => setTimeout(resolve, 150));
  }

  timerButton(setColor, index) {
    let array = [];
    const { classButton } = this.state;
    array = [...classButton.slice(0, index), setColor, ...classButton.slice(index + 1)];
    this.setState({ classButton: array }, () => {
      this.timerCount().then(() => {
        array = [...classButton.slice(0, index), `btn-info`, ...classButton.slice(index + 1)];
        this.setState({ classButton: array });
      });
    });
  }

  filterView(select) {
    const { factor1, factor2, result} = this.state;
    switch (select) {
      case 1:
        return [null, "x", factor2, "=", result];
      case 2:
        return [factor1, "x", null, "=", result];
      case 3:
        return [factor1, "x", factor2, "=", null];
      default:
        console.log('Я таких значений не знаю');
    };
  };

  clickResponse = (item, index) => {
    const { select, factor1, factor2, result } = this.state;
    console.log("TCL: App -> onTrhee -> x", item)
    switch (select) {
      case 1:
        if (item === factor1) {
          this.rating(0);
          this.timerButton(`btn-success`, index);
          this.timerCount().then(() => this.init());
        } else {
          this.rating(1);
          this.timerButton(`btn-danger`, index);
        };
        break;
      case 2:
        if (item === factor2) {
          this.rating(0);
          this.timerButton(`btn-success`, index);
          this.timerCount().then(() => this.init());
        } else {
          this.rating(1);
          this.timerButton(`btn-danger`, index);
        };
        break;
      case 3:
        if (result === item) {
          this.rating(0);
          this.timerButton(`btn-success`, index);
          this.timerCount().then(() => this.init());
        } else {
          this.rating(1);
          this.timerButton(`btn-danger`, index);
        };
        break;
      default:
        console.log('Я таких значений не знаю');
    };
  }

  render() {
    const { start, progressBarColor, select, buttonData } = this.state;
    if (!select) { return <div> { start }</div>}
    //const buttonData = this.generator();
    console.log("TCL: render -> buttonData", buttonData)
    const itemsView = this.renderExample(select);
    const buttonsView = this.renderButtons(buttonData);
  return (
     <div className="container text-center">
     {start}
        <div className="progress">
            <div className={`progress-bar ${progressBarColor}`} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">50%</div>
        </div>
      <div className="row text-center d-flex mx-auto">
          {itemsView}
        </div>
      <div className="row d-flex flex-nowrap justify-content-between mx-auto">
          {buttonsView}
        </div>
    </div>
  );}

  renderButtons(buttonData) {
    const { classButton } = this.state;
    return buttonData.map((item, index) => <div key={index + 100} className="col">
      <button className={`btn ${classButton[index]} border rounded-circle`}
        onClick={() => this.clickResponse(item, index)} type="button">
        {item}
      </button>
    </div>);
  }

  renderExample(select) {
    const items = this.filterView(select);
    const listItem = items.map((item, index) =>
    <div key={index} className="col">
      <p>{item}</p>
    </div>);
    return listItem;
  }
}

export default App;
