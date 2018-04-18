import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap-css-only';
import './scss/style.scss';

import Question from './components/Question';
import QuestionsHeader from './components/QuestionsHeader';

class App extends Component {
	constructor() {
		super();

		this.state = {
			questions: [
				{
					title: 'My first Question',
					rating: 7
				},
				{
					title: 'My second Question',
					rating: 2
				},
				{
					title: 'My third Question',
					rating: 21
				},
				{
					title: 'My fourth Question',
					rating: 10
				}
			],
			newQuestion: ''
		}

		this.handleRatingChange = this.handleRatingChange.bind(this);
		this.handleSort = this.handleSort.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleRatingChange(i, operator) {
		this.setState(prevState => {
			const questions = prevState.questions.map((question, index) => {
				if (i === index) {
					operator === '-' ? question.rating -= 1 : question.rating += 1;
				}
				return question;
			});

			return { questions };
		});
	}

	handleSort(order) {
		this.setState(prevState => {
			const questions = prevState.questions.slice(0).sort((a, b) => {
				return order === 'asc' ? a.rating > b.rating : b.rating > a.rating;
			});

			return { questions };
		});
	}

	handleChange({ target: { value } }) {
		this.setState({ newQuestion: value });
	}

	handleSubmit(e) {
		e.preventDefault();

		this.setState(prevState => {
			const question = { title: prevState.newQuestion, rating: 0 };
			const questions = [question, ...prevState.questions];

			return { questions, newQuestion: '' };
		});
	}

  render() {
    return (
      <div className="App">
				<QuestionsHeader
					handleClick={this.handleSort}
					handleSubmit={this.handleSubmit}
					newQuestion={this.state.newQuestion}
					handleChange={this.handleChange}
				/>
        <ul>
					{
						this.state.questions.map((question, i) => (
							<Question
								key={i}
								index={i}
								handleClick={this.handleRatingChange}
								{...question}
							/>
						))
					}
				</ul>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
