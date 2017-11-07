import React from 'react';
import PropTypes from 'prop-types';

export default function Option({ value, children }) {
    return (
        <option value={value}>
            {children}
        </option>
    );
}

Option.propTypes = {
    value: PropTypes.any.isRequired,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};

Option.defaultProps = {
    children: 'Option'
};
