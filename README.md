# react-conversation-form &middot; [![npm](https://img.shields.io/npm/v/react-conversation-form.svg?style=flat-square)](https://www.npmjs.com/package/react-conversation-form)   [![npm](https://img.shields.io/npm/dt/react-conversation-form.svg?style=flat-square)]()

A React wrapper for Conversational Form (https://github.com/space10-community/conversational-form).

v2.X is not compatible with v1.X. You'll need to change your implementation. The key difference is the use of new components instead of the 'questions' prop.
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

     <Conversation
          onSubmit={() => {}}
          chatOptions={{
              thankTheUser: ['identifier', 'feedback'],
              introText: 'Hi there. Lets leave some feedback! To edit any of your responses, just click on them.',
              submitText: 'Thanks for giving us your feedback!'
          }}
      >
          <Select id="feedbackType" question="What type of feedback are you thinking of?">
              <Option value="issue">Issue</Option>
              <Option value="typo">Typo</Option>
              <Option value="praise">Praise</Option>
              <Option value="other">Other</Option>
          </Select>
          <Question id="email" validation={text => text.includes('@')}>
              {'What\'s your company email address, so we can identify you?'}
          </Question>
          <Question id="feedback" validation="^[a-zA-Z ]+$">
              What are you thinking?
          </Question>
      </Conversation>
  
## Options

### Conversation
* `onSubmit` - *function* Callback function for the form contents when the user has finished (**required**)
* `chatOptions` - *object* Extra options for the chat `default: {}`
    * `robotResponseTime` - *number* The time (ms) the robot takes before responding
    * `robotChainResponseTime` - *number* The time (ms) the robot takes between chained messages
    * `showUserThinking` - *boolean* Whether to show the user writing '...' while waiting for response
    * `robotChainResponseTime` - *number* The time (ms) the robot takes between chained messages
    * `thankTheUser` - *array* Array of question IDs that the bot should thank the user after answering
    * `introText` - *string* The opening message from the bot
    * `submittedResponseText` - *string* Closing response message from the bot

### Question

### Select

### Option

## ToDo:

- Expose icons and all configuration options through props (only subset currently supported)
- Fix tests
