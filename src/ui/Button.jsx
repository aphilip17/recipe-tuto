import React from "react";
import PropTypes from 'prop-types';
import { Loader } from "./Loader";

export function Button({children, type = 'primary', loading = false, ...props }) {
   const className = 'btn btn-' + type;
   let htmlType = null;
   if (type === 'submit') {
    htmlType = 'submit';
   }
    return <button
        className={className}
        type={htmlType}
        disabled={loading}
        {...props}
    >
        {loading ? <><Loader>Chargement</Loader></> :  children}
    </button>
}

Button.propTypes = {
    children: PropTypes.node.isRequired,
    type: PropTypes.string,
    loading: PropTypes.bool

}