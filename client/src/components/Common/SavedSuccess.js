import React from 'react';

const SavedSuccess = ({ show, message = "Success!" }) => {
    if (!show) return null;

    return (
        <div className="alert alert-success p-2 mb-0" role="alert" >
            {message}
        </div>
    );
};

export default SavedSuccess;
