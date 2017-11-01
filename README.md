# react-conversation-form &middot; [![](https://img.shields.io/badge/status-is%20developing-green.svg?style=flat)](#plugin)

A React wrapper for Conversational Form (https://github.com/space10-community/conversational-form).

Currently this requires you to import the minified JS Script inside your index.html file. This is only temporary while we wait for the latest version on NPM.

Styles are in SASS so will need compiling to CSS.

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
        thankTheUser: ['email', 'feedback'],
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
- Turn this into an NPM module (not yet initialised with package json)
- Add build step for compiling to ES5 and for compiling SCSS to CSS
- Add this to the NPM repo
- Use the Conversational Form NPM module 
