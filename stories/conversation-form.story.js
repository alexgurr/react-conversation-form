import React from 'react';
import { storiesOf } from '@storybook/react';
import { Conversation, Question } from '../src';

// questions={[
//     {
//         id: 'feedbackType',
//         componentType: 'select',
//         type: 'text',
//         question: 'What type of feedback are you thinking of?',
//         selectOptions: [
//             { label: 'Issue', value: 'issue' },
//             { label: 'Typo', value: 'typo' },
//             { label: 'Praise', value: 'praise' },
//             { label: 'Other', value: 'other' }
//         ]
//     },
//     {
//         id: 'identifier',
//         componentType: 'input',
//         type: 'text',
//         question: 'What\'s your company name/email address, so we can identify you?'
//     },
//     {
//         id: 'feedback',
//         componentType: 'input',
//         type: 'text',
//         question: 'What are you thinking?'
//     }
// ]}

storiesOf('Conversation Form', module)
  .add('Feedback Example', () => (
      <Conversation
          onSubmit={() => {}}
          chatOptions={{
              thankTheUser: ['identifier', 'feedback'],
              introText: 'Hi there. Lets leave some feedback! To edit any of your responses, just click on them.',
              submitText: 'Thanks for giving us your feedback!'
          }}
      >
          <Question id="foo">Foobar</Question>
      </Conversation>
  ));
