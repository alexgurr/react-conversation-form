# react-conversation-form &middot; [![npm](https://img.shields.io/npm/dw/react-conversation-form.svg?style=flat-square)]()

A React wrapper for Conversational Form (https://github.com/space10-community/conversational-form).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
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


## ToDo:

- Expose icons and all configuration options through props (only subset currently supported)
- Fix tests
