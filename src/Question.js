import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Question extends Component {
    render() {
        const { id, type } = this.props;

        return <input id={id} type={type} />;
    }
}

Question.propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.string,
    children: PropTypes.string.isRequired
};

Question.defaultProps = {
    type: 'text'
};
