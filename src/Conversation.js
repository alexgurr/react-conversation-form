import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _once from 'lodash/once';
import cf from 'conversational-form';
import Question from './Question';
import Select from './Select';

const RESERVED_IDS = ['chat', 'chatForm'];
const RESERVED_ERROR = `Can't instantiate a new FormChat with a question/question ID equalling (${RESERVED_IDS.join(', ')}).`;
const REF_SUFFIX = 'Ref';

/**
 * Check if the IDs for the question props are all valid. They must be unique, and not-reserved
 *
 * @param {string} id
 * @param {Object} state
 *
 * @return {void}
 */
function checkIfIdIsReserved(id, state) {
    if (!id) {
        return;
    }

    if (RESERVED_IDS.includes(id)) {
        throw new Error(RESERVED_ERROR);
    }

    if (Object.keys(state).includes(id)) {
        throw new Error(`All question IDs must be unique (${id}).`);
    }
}

/**
 * Throws an error if the child isn't a Question or Select component
 *
 * @param {JSX} child
 */
function checkValidChild(child) {
    if (child.type !== Question && child.type !== Select) {
        throw new Error(`Conversation children must be either Questions or Selects. Found ${child.type}.`);
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

/**
 * Builds initial state from children form elements. Makes sure the IDs and element types are
 * valid. Adds props to each form element and stores them in the state.
 *
 * @param {JSX} children
 * @param {func} injectPropsFunc
 *
 * @return {Object}
 */
function getInitialisedState(children, injectPropsFunc) {
    return React.Children
        .toArray(children)
        .reduce((state, child, index) => {
            checkValidChild(child);
            checkIfIdIsReserved(child.props.id, state);

            const questionId = child.props.id || `question${index + 1}`;

            return {
                ...state,
                [questionId]: '',
                [getRefKey(questionId)]: void 0,
                formElements: [...state.formElements, injectPropsFunc(child, questionId)]
            };
        }, { chatFormRef: void 0, chat: void 0, formElements: [] });
}

/**
 * Validates the result of a question
 *
 * @param {string} id
 * @param {string} text
 * @param {function|string} validation
 *
 * @return {bool}
 */
function isValidResult(id, text, validation) {
    if (typeof validation === 'string') {
        return new RegExp(validation).test(text);
    }

    if (typeof validation === 'function') {
        return validation(text);
    }

    console.warn(`Ignoring validation for question [${id}] - type not recognised.`);

    return true;
}

export default class Conversation extends Component {
    constructor(props) {
        super(props);

        this.setRef = this.setRef.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.injectPropsToChild = this.injectPropsToChild.bind(this);
        this.startConversation = _once(this.startConversation);

        this.state = getInitialisedState(props.children, this.injectPropsToChild);
    }

    /**
     * Add props to each form element child
     *
     * @param {JSX} child
     * @param {string} id
     *
     * @return {JSX}
     */
    injectPropsToChild(child, id) {
        return React.cloneElement(child, { id, ref: this.setRef(getRefKey(id)) });
    }

    onSubmit() {
        const { onSubmit, chatOptions: { submittedResponseText } } = this.props;
        const { formElements } = this.state;

        if (submittedResponseText) {
            cf.addRobotChatResponse(submittedResponseText);
        }

        const formValues = formElements.reduce((submitValues, question) => ({
            ...submitValues, [question.props.id]: this.state[question.props.id]
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
            chatOptions: {
                robotResponseTime,
                robotChainResponseTime,
                showUserThinking,
                thankTheUser,
                introText
            }
        } = this.props;

        const { formElements, chatFormRef } = this.state;

        formElements.forEach((questionEl, index) => {
            const { id, children, question } = questionEl.props;
            const displayThanks = thankTheUser && thankTheUser.includes(id) ? 'Thanks.&&' : '';
            const questionPrefix = index === 0 && introText ? `${introText}&&` : displayThanks;
            const questionText = `${questionPrefix}${question || children}`;

            this.state[getRefKey(id)].state.el.setAttribute('cf-questions', questionText);
        });

        this.setState({
            chat: cf.startTheConversation({
                formEl: chatFormRef,
                userInterfaceOptions: {
                    robot: {
                        robotResponseTime: robotResponseTime || 250,
                        chainedResponseTime: robotChainResponseTime || 1500
                    },
                    user: {showThinking: showUserThinking || false}
                },
                context: document.getElementById('cf-context'),
                flowStepCallback: ({ tag: { id }, text }, success, error) => {
                    // Set the result of the input in state
                    this.setState({ [id]: text });

                    const { props: { validation } } = this.state[getRefKey(id)];

                    if (!validation) { return success(); }

                    return isValidResult(id, text, validation) ? success() : error();
                },
                submitCallback: this.onSubmit
            })
        });
    }

    render() {
        const {formElements} = this.state;

        return (
            <div className="form-chat" style={{height: '100%'}}>
                <div id="cf-context" style={{height: '100%'}}>
                    <form id="form" className="form" ref={this.setRef('chatFormRef')}>
                        {formElements}
                    </form>
                </div>
            </div>
        );
    }
}

Conversation.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    children: PropTypes.node,
    chatOptions: PropTypes.shape({
        robotResponseTime: PropTypes.number,
        robotChainResponseTime: PropTypes.number,
        showUserThinking: PropTypes.bool,
        thankTheUser: PropTypes.arrayOf(PropTypes.string),
        introText: PropTypes.string,
        submittedResponseText: PropTypes.string
    })
};

Conversation.defaultProps = {
    chatOptions: {},
    children: void 0
};
