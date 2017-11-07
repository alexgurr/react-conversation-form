import React from 'react';
import { storiesOf } from '@storybook/react';
import { Conversation, Question, Select, Option } from '../src';

storiesOf('Conversation Form', module)
  .add('Feedback Example', () => (
      <Conversation
          onSubmit={(a) => {console.log(a)}}
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
          <Question id="feedback" validation={[]}>
              What are you thinking?
          </Question>
      </Conversation>
  ));
