import React from 'react';
require('jest-enzyme');
import { mount } from 'enzyme';
import FormChat from '../src/FormChat';

const MOCK_QUESTIONS = [
  { id: 'foo', componentType: 'input', question: 'Foo?' },
  { id: 'bar', componentType: 'select', question: 'Bar?', selectOptions: [{ label: 'foo', value: 'foo' }] }
];

const MOCK_CONVERSATIONAL_FORM = {
  ConversationalForm: {
    startTheConversation: () => {}
  }
};

function countMatchingElements(formChat, elName) {
  let count = 0;

  formChat.find(elName).forEach(() => {
    count += 1;
  });

  return count;
}

function renderFormChat(props = {}, cf = MOCK_CONVERSATIONAL_FORM) {
  window.cf = cf;

  const formChat = mount(
    <FormChat
      onSubmit={() => {}}
      questions={MOCK_QUESTIONS}
      {...props}
    />
  );

  expect(formChat.find('.form-chat')).toBePresent();
  expect(formChat.find('#cf-context')).toBePresent();
  expect(formChat.find('input')).toBePresent();
  expect(formChat.find('select')).toBePresent();

  expect(countMatchingElements(formChat, 'option')).toBe(1);

  const state = formChat.state();
  const stateKeys = Object.keys(state);

  expect(stateKeys.includes('fooRef')).toBe(true);
  expect(stateKeys.includes('barRef')).toBe(true);
  expect(state.foo).toEqual('');
  expect(state.bar).toEqual('');

  return formChat;
}

describe('common/components/FormChat', () => {
  test('should be able to render the form chat as per the snapshot', () => {
    expect(renderFormChat()).toMatchSnapshot();
  });

  test('should set all refs', () => {
    const formChat = renderFormChat();
    const state = formChat.state();
    const refsSet = Object.keys(formChat.state())
      .every(key => !key.includes('Ref') || Boolean(state[key]));

    expect(refsSet).toBe(true);
  });

  test('should throw exception when using reserved IDs', () => {
    expect(() => renderFormChat({
      questions: [{ id: 'chat', componentType: 'input', question: 'foo' }]
    })).toThrow('Can\'t instantiate a new FormChat with a question/question ID equalling (chat, chatForm).');
  });

  test('should throw exception when using duplicate IDs', () => {
    expect(() => renderFormChat({
      questions: [
        { id: 'foo', componentType: 'input', question: 'foo' },
        { id: 'foo', componentType: 'input', question: 'foo' }
      ]
    })).toThrow('All question IDs must be unique (foo).');
  });

  test('should try to start the form chat', () => {
    const START = jest.fn(() => true);
    const CF = {
      ConversationalForm: {
        startTheConversation: START
      }
    };

    renderFormChat(void 0, CF);

    expect(START.mock.calls.length).toBe(1);
    expect(START.mock.calls[0][0].formEl).toBeTruthy();
    expect(START.mock.calls[0][0].robotImage).toBeTruthy();
    expect(START.mock.calls[0][0].userImage).toBeTruthy();
    expect(START.mock.calls[0][0].userInterfaceOptions).toBeTruthy();
    expect(START.mock.calls[0][0].flowStepCallback).toBeTruthy();
    expect(START.mock.calls[0][0].submitCallback).toBeTruthy();
  });

  test('should be able to set chat options', () => {
    const START = jest.fn(() => true);
    const CF = {
      ConversationalForm: {
        startTheConversation: START
      }
    };

    const formChat = renderFormChat({ chatOptions: {
      robotResponseTime: 1,
      robotChainResponseTime: 2,
      showUserThinking: true,
      thankTheUser: ['bar'],
      introText: 'intro'
    } }, CF);

    const firstQuestion = formChat.state().fooRef.getAttribute('cf-questions');
    const secondQuestion = formChat.state().barRef.getAttribute('cf-questions');

    expect(firstQuestion.includes('intro')).toBe(true);
    expect(secondQuestion.includes('intro')).toBe(false);
    expect(secondQuestion.includes('Thanks')).toBe(true);

    expect(START.mock.calls.length).toBe(1);
    expect(START.mock.calls[0][0].userInterfaceOptions).toBeTruthy();
    expect(START.mock.calls[0][0].userInterfaceOptions.robot.robotResponseTime).toEqual(1);
    expect(START.mock.calls[0][0].userInterfaceOptions.robot.chainedResponseTime).toEqual(2);
    expect(START.mock.calls[0][0].userInterfaceOptions.user.showThinking).toEqual(true);
  });

  test('should be able to submit', () => {
    const SUBMIT = jest.fn();
    const ADD_RESPONSE = jest.fn();

    window.ConversationalForm = { addRobotChatResponse: ADD_RESPONSE };

    const formChat = renderFormChat({
      onSubmit: SUBMIT,
      chatOptions: { submittedResponseText: 'foo' }
    });

    formChat.instance().onSubmit();

    expect(SUBMIT.mock.calls.length).toBe(1);
    expect(ADD_RESPONSE.mock.calls.length).toBe(1);
    expect(SUBMIT.mock.calls[0][0]).toEqual({ foo: '', bar: '' });
  });
});
