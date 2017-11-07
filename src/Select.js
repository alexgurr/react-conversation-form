import React from 'react';
import PropTypes from 'prop-types';

export default function Select({ id, type, children }) {
    return (
        <select
            ref={this.setRef(ref)}
            type={question.type}
            id={question.id}
        >
            {children}
        </select>
    );
}

Select.propTypes = {
    id: PropTypes.string,
    type: PropTypes.string,
    children: PropTypes.node
};

Select.defaultProps = {

}

