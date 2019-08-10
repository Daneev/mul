import React, { Component } from 'react';
import './App.css';
import Switch from "../switch/switch";


class App extends Component {
  static defaultProps = {
    count: 100,
    settings: { butt: null }
  };


  butt = this.props.butt;
  count = this.props.count;
  settings = this.props.settings;
  storage = localStorage; // используем localStorage для хранения настроек
  //colorButton = `btn-info`




  state = {
    start: "Start Mul",
    buttons: null,
    factor1: null,
    factor2: null,
    result: null,
    select: null,
    progressBarColor: `color1`,
    progressBarValue: -1,
    classButton: [],
    buttonData: [],
    rating: 5
  };

  componentDidMount() {
    this.init();
   };




  init(reset=false) {
    let { progressBarValue } = this.state
    if (reset) { progressBarValue = -1; }
    const countLocal = this.count - progressBarValue
    if (countLocal === 0) return;
    const progressBarColor = `color${Math.floor(progressBarValue/this.count*5)+1}`
    this.update(progressBarColor, this.count - countLocal + 1);
  };

  update(progressBarColor, progressBarValue) {
    let switchValue = this.storage.getItem('settings.switchValue');
    if (switchValue === "hard") {
          switchValue = true;
    } else {
          switchValue = false;
    };
    const factor1 = this.randomData(2, 9);
    const factor2 = this.randomData(2, 9);
    const result = factor1 * factor2;
    const select = this.randomData(1, 3);
    const buttons = switchValue ? 5 : 3;
    const classButton = new Array(buttons).fill(`btn-info`);
    const buttonData = this.generator(buttons, select, factor1, factor2, result);
    this.setState({
      switchValue,
      factor1,
      factor2,
      result,
      select,
      buttons,
      classButton,
      buttonData,
      progressBarValue,
      progressBarColor
    });
  };

  async setValue(){
    let switchValue = !this.state.switchValue;
    console.log("TCL: App -> setValue -> value", switchValue)
    let { progressBarValue } = this.state;
    progressBarValue = (progressBarValue === 0) ? Number(-1) : (progressBarValue - 1)
    await this.setProgress(switchValue, progressBarValue);
    let data = switchValue ? "hard" : "easy";
    this.storage.setItem('settings.switchValue', data)
    await this.init();
  }

  async setProgress (switchValue, progressBarValue) {
    await this.setState({
      switchValue,
      progressBarValue
    });
  }

  randomData(min = 1, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  generator(buttons, select, factor1, factor2, result) {
    let rnd, max = null, min = 1;
    const buttonData = [];
    //const { buttons, select, factor1, factor2, result } = this.state;
    switch (select) {
      case 1:
        buttonData.push(factor1);
        max = 9;
        break;
      case 2:
        buttonData.push(factor2);
        max = 9;
        break;
      case 3:
        buttonData.push(result);
        max = (result + 10);
        min = ((max - 20) < 1) ? 1 : (max - 20);
        max = ((max + min) > 99) ? (99 - min) : max;
        break;
      default:
        console.log('Я таких значений не знаю');
    };
    do {
      rnd = this.randomData(min, max);
      if ((!buttonData.includes(rnd))) {
        buttonData.push(rnd);
        console.log("TCL: App -> generator -> buttonData", buttonData)}
    } while (buttonData.length < buttons);
    return buttonData.sort();
  }

  rating(rating) {
  console.log("TCL: App -> rating -> rating", rating)
  };

  timerDelay() {
    return new Promise(resolve => setTimeout(resolve, 120));
  }

  timerButton(setColor, index) {
    let arrayColor = [];
    arrayColor = [...this.state.classButton];
    arrayColor.splice(index, 1, setColor);
    this.setState({ classButton: arrayColor }, () => {
      this.timerDelay().then(() => {
        arrayColor.splice(index, 1, `btn-info`);
        this.setState({ classButton: arrayColor });
      });
    });
  }

  filterView(select) {
    const { factor1, factor2, result} = this.state;
    switch (select) {
      case 1:
        return ["?", "x", factor2, "=", result];
      case 2:
        return [factor1, "x", "?", "=", result];
      case 3:
        return [factor1, "x", factor2, "=", "?"];
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
          this.timerDelay().then(() => this.init());
        } else {
          this.rating(1);
          this.timerButton(`btn-danger`, index);
        };
        break;
      case 2:
        if (item === factor2) {
          this.rating(0);
          this.timerButton(`btn-success`, index);
          this.timerDelay().then(() => this.init());
        } else {
          this.rating(1);
          this.timerButton(`btn-danger`, index);
        };
        break;
      case 3:
        if (result === item) {
          this.rating(0);
          this.timerButton(`btn-success`, index);
          this.timerDelay().then(() => this.init());
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
    const { start, progressBarColor, select, progressBarValue, switchValue } = this.state;
    console.log("TCL: render -> switchValue", switchValue)
    if (!select) { return <div> { start }</div>}
    const itemsView = this.renderExample(select);
    const buttonsView = this.renderButtons();

  return (
    <div className="container text-center">
    <div className = "title" onClick={() => this.init(true)}>{start}</div>
        <div className="progress">
        <div className={`progress-bar ${progressBarColor}`} style={{ width: `${progressBarValue}%` }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">{progressBarValue}%</div>
        </div>
      <div className="row text-center justify-content-around d-flex mx-auto">
          {itemsView}
        </div>
      <div className="row d-flex flex-nowrap justify-content-around mx-auto">
          {buttonsView}
        </div>
      <Switch
        switchToggle={switchValue}
        onColor="#EF476F"
        handleToggle={() => this.setValue()}
      />
    </div>
  );}

  renderButtons() {
    const { buttonData, classButton } = this.state;
    return buttonData.map((item, index) => <div key={index + 100} className="col-sx-auto">
      <button className={`btn ${classButton[index]} border rounded-circle`}
        onClick={() => this.clickResponse(item, index)} type="button">
        {item}
      </button>
    </div>);
  }

  renderExample(select) {
    const items = this.filterView(select);
    const listItem = items.map((item, index) =>
      <div key={index} className="col-sx-auto">
      <p>{item}</p>
    </div>);
    return listItem;
  }
}

export default App;
