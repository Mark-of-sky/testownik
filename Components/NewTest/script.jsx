'use strict';
import React from 'react';


class NewTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = { questions: []};
    this.handleNewQuestion = this.handleNewQuestion.bind(this);
  }

  handleNewQuestion(newQuestion) {
    this.setState(state => ({
      questions: state.questions.concat(newQuestion)
    }));
  }

  render() {
    return (
      <div>
        <QuestionList
          list={this.state.questions} />
        <Question
          addNewQuestion={this.handleNewQuestion} />
      </div>
    );
  }
}

class QuestionList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.list.map(item => (
          <div key={item.id}>
            Pytanie {item.id + 1}<br />
            Typ: {item.questionType}<br />
            Tresc: {item.questionText}<br />
            <AnswersList items={item.answers} />
          </div>
        ))}
      </div>
    );
  }

}

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = { id: 0, questionType: 1 ,questionText: '', answers: [] };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNewItem = this.handleNewItem.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);

    this.answers = React.createRef();
  }

  render() {
    return (
      <div>
        <div className='row'>
          <div className='col-10 offset-1'>
            <div className='row'>
              <div className='col-2'>
                <h2 className='my-1'>
                  Pytanie {this.state.id + 1}
                </h2>
              </div>
            </div>
            <div className='row'>
              <div className='col-2'>
                <select
                  className='form-control mt-3'
                  value={this.state.questionType}
                  onChange={this.handleChangeType}>
                  <option value='1'>Zamknięte</option>
                  <option value='2'>Półotwarte</option>
                  <option value='3'>Połączenie</option>
                </select>
              </div>
            </div>
            <div className='row'>
              <div className='col'>
                <h5 className='mt-3'>Treść pytania:</h5>
                <input
                  className="form-control"
                  value={this.state.questionText}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className='row'>
              <div className='col-6'>
                <h5 className='mt-3'>Odpowiedzi:</h5>
                <AnswersList items={this.state.answers} />
                {!(this.state.questionType == 2 && this.state.answers.length == 1) &&
                  <Answers
                    ref={this.answers}
                    addNewItem={this.handleNewItem}
                    type={this.state.questionType}
                    questionId={this.state.id}
                  />
                }
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-10 offset-1'>
            <form onSubmit={this.handleSubmit}>
              <button className="btn btn-primary btn-lg">
                Dodaj nowe pytanie
              </button>
            </form>
          </div>
        </div>
        <div className='row'>
         <div className='col my-5'>
         </div>
        </div>
      </div>
    );
  }

  handleChange(e) {
    this.setState({ questionText: e.target.value });
  }

  handleNewItem(item) {
    this.setState(state => ({
      answers: state.answers.concat(item)
    }));
  }

  handleChangeType(e) {
    this.setState({ questionType: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.questionText.length === 0 || this.state.answers.length === 0) {
      return;
    }

    this.answers.current.clearState();

    const newItem = {
      id: this.state.id,
      questionType: this.state.questionType,
      questionText: this.state.questionText,
      answers: this.state.answers
    };

    this.props.addNewQuestion(newItem);
    this.setState({
      id: this.state.id +1,
      questionType: 1,
      questionText: '',
      answers: []
    });
  }
}


class AnswersType extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var type = this.props.type;
    var text = this.props.text;
    var chk = this.props.chk;
    var handleSubmit = this.props.handleSubmit;
    var handleText = this.props.handleText;
    var handleCheckbox = this.props.handleCheckbox;

    return (
      <div>
        {type == 1 &&
          <AnswersClosed
            text={text}
            chk={chk}
            handleSubmit={handleSubmit}
            handleText={handleText}
            handleCheckbox={handleCheckbox} />
        }
        {type == 2 &&
          <AnswersOpen
            text={text}
            chk={chk}
            handleSubmit={handleSubmit}
            handleText={handleText}
            handleCheckbox={handleCheckbox} />
        }
        {type == 3 &&
          <AnswersMatch />
        }
      </div>
    );
  }
}

class Answers extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: '', valid: true };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleText = this.handleText.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.clearState = this.clearState.bind(this);
  }

  render() {
    return (
      <div>
        <AnswersType
          type={this.props.type}
          text={this.state.text}
          chk={this.state.valid}
          handleSubmit={this.handleSubmit}
          handleText={this.handleText}
          handleCheckbox={this.handleCheckbox} />
      </div>
    );
  }

  handleText(e) {
    this.setState({ text: e.target.value });
  }

  handleCheckbox(val) {
    this.setState({ valid: val });
  }

  clearState() {
    this.setState({ text: '', valid: true });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.text.length === 0) {
      return;
    }

    const newItem = {
      text: this.state.text,
      valid: this.state.valid,
      id: Date.now()
    };

    this.props.addNewItem(newItem);
    this.setState({
      text: '',
      valid: false });
  }
}

class AnswersClosed extends React.Component {
  constructor(props) {
    super(props);
    this.innerRender = this.innerRender.bind(this);
    this.handleCheckboxLocal = this.handleCheckboxLocal.bind(this);
  }

  innerRender() {
    return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        onChange={this.handleCheckboxLocal}
        checked={this.props.chk}
        id="defaultCheck1" />
      <label className="form-check-label" htmlFor="defaultCheck1">
        Poprawna odpowiedź
      </label>
    </div>
    );
  }

  handleCheckboxLocal(e) {
    this.props.handleCheckbox(e.target.checked);
  }

  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit}>
          <div className='row'>
            <div className="col-8">
              <div className="input-group mb-3">
                <input
                  id="new-todo"
                  onChange={this.props.handleText}
                  value={this.props.text}
                  className="form-control"
                />
                <div className="input-group-append">
                  <button className="btn btn-secondary">
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className='col-4'>
              {this.innerRender()}
            </div>
          </div>
        </form>
      </div>
    );
  }
}

class AnswersOpen extends AnswersClosed {
  constructor(props) {
    super(props);
    this.innerRender = this.innerRender.bind(this);
    this.props.handleCheckbox(true);
  }

  innerRender() {
    return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        checked={this.props.chk}
        defaultValue={true}
        disabled
        id="defaultCheck1" />
      <label className="form-check-label" htmlFor="defaultCheck1">
        Poprawna odpowiedź
      </label>
    </div>
    );
  }
}

class AnswersMatch extends React.Component {}

class AnswersList extends React.Component {
  render() {
    return (
      <ol type='a'>
        {this.props.items.map(item => (
            <li key={item.id} className={item.valid ? "font-weight-bold" : null}>
              {item.text}
            </li>
        ))}
      </ol>
    );
  }
}

export default NewTest;