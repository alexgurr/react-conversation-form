import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Question extends Component {
    constructor() {
        super();

        this.state = { el: void 0 };

        this.setRef = this.setRef.bind(this);
    }

    setRef(el) {
        if (el && !this.state.el) {
            this.setState({ el });
        }
    }

    render() {
        const { id, type } = this.props;

        return <input ref={this.setRef} id={id} type={type} />;
    }
}

Question.propTypes = {
    id: PropTypes.string,
    type: PropTypes.string,
    children: PropTypes.string.isRequired,
    validation: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
};

Question.defaultProps = {
    type: 'text',
    id: void 0,
    validation: void 0
};
