import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _once from 'lodash/once';
// import cf from 'conversational-form';
import './styles/_form-chat.scss';

const RESERVED_IDS = ['chat', 'chatForm'];
const RESERVED_ERROR = `Can't instantiate a new FormChat with a question/question ID equalling (${RESERVED_IDS.join(', ')}).`;
const REF_SUFFIX = 'Ref';
const INPUT_TYPE = 'input';
const SELECT_TYPE = 'select';

/**
 * Check if the IDs for the question props are all valid. They must be unique, and not-reserved
 *
 * @param {string} id
 * @param {Object} state
 *
 * @return {void}
 */
function checkIfIdIsReserved(id, state) {
  if (RESERVED_IDS.includes(id)) {
    throw new Error(RESERVED_ERROR);
  }

  if (Object.keys(state).includes(id)) {
    throw new Error(`All question IDs must be unique (${id}).`);
  }
}

/**
 * Returns the ID with the suffix appended
 *
 * @param {string} id
 *
 * @return {string}
 */
function getRefKey(id) {
  return `${id}${REF_SUFFIX}`;
}

/**
 * Check every el/ref in state has been assigned
 *
 * @param {Object} state
 *
 * @return {boolean}
 */
function allRefsSet(state) {
  return Object.keys(state)
    .every(stateKey => !stateKey.includes(REF_SUFFIX) || Boolean(state[stateKey]));
}

export default class FormChat extends Component {
  constructor(props) {
    super(props);

    this.state = props.questions.reduce((state, question) => {
      checkIfIdIsReserved(question.id, state);

      return {
        ...state,
        [question.id]: '',
        [getRefKey(question.id)]: void 0
      };
    }, { chatFormRef: void 0, chat: void 0 });

    this.setRef = this.setRef.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.renderFormComponent = this.renderFormComponent.bind(this);
    this.startConversation = _once(this.startConversation);
  }

  onSubmit() {
    const { questions, onSubmit, chatOptions: { submittedResponseText } } = this.props;

    if (submittedResponseText) {
      window.ConversationalForm.addRobotChatResponse(submittedResponseText);
    }

    const formValues = questions.reduce((submitValues, question) => ({
      ...submitValues, [question.id]: this.state[question.id]
    }), {});

    onSubmit(formValues);
  }

  /**
   * Set an element ref in state
   *
   * @param {string} elName
   *
   * @return {void}
   */
  setRef(elName) {
    const tryToStartConversation = () => {
      if (allRefsSet(this.state)) {
        this.startConversation();
      }
    };

    return (el) => {
      if (el && !this.state[elName]) {
        this.setState({ [elName]: el }, tryToStartConversation);
      }
    };
  }

  /**
   * Try and start the form chat. If all refs haven't been set, then do nothing. Set questions from
   * props and configure form chat.
   *
   * @return {void}
   */
  startConversation() {
    const {
      questions,
      onStepCallback,
      chatOptions: {
        robotResponseTime,
        robotChainResponseTime,
        showUserThinking,
        thankTheUser,
        introText
      }
    } = this.props;
    const { chatFormRef } = this.state;

    questions.forEach((question, index) => {
      const displayThanks = thankTheUser && thankTheUser.includes(question.id) ? 'Thanks.&&' : '';
      const questionPrefix = index === 0 && introText ? `${introText}&&` : displayThanks;
      const questionText = `${questionPrefix}${question.question}`;

      this.state[getRefKey(question.id)].setAttribute('cf-questions', questionText);
    });

    this.setState({ chat: window.cf.ConversationalForm.startTheConversation({
      formEl: chatFormRef,
      userInterfaceOptions: {
        robot: {
          robotResponseTime: robotResponseTime || 250,
          chainedResponseTime: robotChainResponseTime || 1500
        },
        user: { showThinking: showUserThinking || false }
      },
      context: document.getElementById('cf-context'),
      flowStepCallback: ({ tag: { id }, text }, success, error) => {
        // Set the result of the input in state
        this.setState({ [id]: text });

        // Call the callback prop function
        onStepCallback({ id, text, success, error });
      },
      submitCallback: this.onSubmit
    }) });
  }

  /**
   * Get the appropriate element for each form question in props
   *
   * @param {Object} question
   * @return {JSX}
   */
  renderFormComponent(question) {
    const ref = getRefKey(question.id);

    if (question.componentType === INPUT_TYPE) {
      return (
        <input key={question.id} id={question.id} type={question.type} ref={this.setRef(ref)} />
      );
    }

    return (
      <select key={question.id} ref={this.setRef(ref)} type={question.type} id={question.id}>
        {question.selectOptions && question.selectOptions.map(selectOption => (
          <option
            key={selectOption.value}
            value={selectOption.value}
          >
            {selectOption.label}
          </option>
        ))}
      </select>
    );
  }

  render() {
    const { questions } = this.props;

    return (
      <div className="form-chat">
        <div id="cf-context" >
          <form id="form" className="form" ref={this.setRef('chatFormRef')}>
            {questions.map(this.renderFormComponent)}
          </form>
        </div>
      </div>
    );
  }
}

FormChat.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onStepCallback: PropTypes.func,
  questions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    componentType: PropTypes.oneOf([INPUT_TYPE, SELECT_TYPE]).isRequired,
    type: PropTypes.string,
    question: PropTypes.string.isRequired,
    selectOptions: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string
    }))
  })).isRequired,
  chatOptions: PropTypes.shape({
    robotResponseTime: PropTypes.number,
    robotChainResponseTime: PropTypes.number,
    showUserThinking: PropTypes.bool,
    thankTheUser: PropTypes.arrayOf(PropTypes.string),
    introText: PropTypes.string,
    submittedResponseText: PropTypes.string
  })
};

FormChat.defaultProps = {
  onStepCallback: ({ success }) => { success(); },
  chatOptions: {}
};
