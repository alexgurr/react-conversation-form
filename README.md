# react-conversation-form &middot; [![npm](https://img.shields.io/npm/v/react-conversation-form.svg?style=flat-square)](https://www.npmjs.com/package/react-conversation-form)   [![npm](https://img.shields.io/npm/dw/react-conversation-form.svg?style=flat-square)]()

A React wrapper for Conversational Form (https://github.com/space10-community/conversational-form).

NPM module found here (https://www.npmjs.com/package/react-conversation-form).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [ToDo](#todo)

## Installation

`npm install react-conversation-form`

or 

`yarn add react-conversation-form`

## Usage

For Example (Feedback Form):

    <FormChat
      onSubmit={() => {}}
      chatOptions={{
        thankTheUser: ['identifier', 'feedback'],
        introText: 'Hi there. Lets leave some feedback! To edit any of your responses, just click on them.',
        submitText: 'Thanks for giving us your feedback!'
      }}
      questions={[
        {
          id: 'feedbackType',
          componentType: 'select',
          type: 'text',
          question: 'What type of feedback are you thinking of?',
          selectOptions: [
            { label: 'Issue', value: 'issue' },
            { label: 'Typo', value: 'typo' },
            { label: 'Praise', value: 'praise' },
            { label: 'Other', value: 'other' }
          ]
        },
        {
          id: 'identifier',
          componentType: 'input',
          type: 'text',
          question: 'What\'s your company name/email address, so we can identify you?'
        },
        {
          id: 'feedback',
          componentType: 'input',
          type: 'text',
          question: 'What are you thinking?'
        }
      ]}
    />
  );
  
## Options

* `onSubmit` - *function* Callback function for the form contents when the user has finished (**required**)
* `onStepCallback` - *function ({ id, text, success: successFunc, error: errorFunc })* Callback function for the form contents when the user has finished `default: ({ success }) => { success(); }` (**required**)
* `questions` - *array* Array of *object* questions (**required**)
    * `id` - *string* The unique question id (**required**)
    * `componentType` - *string* Either 'input' or 'select' (**required**)
    * `type` - *string* Type of component, eg. 'text', 'password'
    * `question` - *string* The actual question (**required**)
    * `selectOptions` - *array* Array of *object* select options. Only needed if the question is the select type
        * `value` - *string*
        * `label` - *string*
* `chatOptions` - *object* Extra options for the chat `default: {}`
    * `robotResponseTime` - *number* The time (ms) the robot takes before responding
    * `robotChainResponseTime` - *number* The time (ms) the robot takes between chained messages
    * `showUserThinking` - *boolean* Whether to show the user writing '...' while waiting for response
    * `robotChainResponseTime` - *number* The time (ms) the robot takes between chained messages
    * `thankTheUser` - *array* Array of question IDs that the bot should thank the user after answering
    * `introText` - *string* The opening message from the bot
    * `submittedResponseText` - *string* Closing response message from the bot









## ToDo:

- Expose icons and all configuration options through props (only subset currently supported)
- Fix tests
