import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Select extends Component {
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
        const { id, type, children } = this.props;

        return (
            <select
                ref={this.setRef}
                type={type}
                id={id}
            >
                {children}
            </select>
        );
    }
}

Select.propTypes = {
    id: PropTypes.string,
    type: PropTypes.string,
    question: PropTypes.string.isRequired,
    children: PropTypes.string
};

Select.defaultProps = {
    type: 'text',
    id: void 0,
    children: void 0
};
