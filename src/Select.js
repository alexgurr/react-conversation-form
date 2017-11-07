import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Option from './Option';

export default class Select extends Component {
    constructor(props) {
        super(props);

        React.Children.forEach(props.children, (child) => {
            if (child.type !== Option) {
                throw new Error(`Every child of <Select> must be an <Option>. Received ${child.type}.`);
            }
        });

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
    children: PropTypes.node.isRequired
};

Select.defaultProps = {
    type: 'text',
    id: void 0
};
