// src/components/Loading.js
import React from 'react';

const Loading = () => {
    return (
        <div className="loading-container d-flex flex-column justify-content-center align-items-center">
            <div className="d-flex justify-content-center">
                <img
                    src="/Loading.png"
                    alt="loading..."
                    className="spinner"
                />
            </div>
            <h3 className="d-flex justify-content-center text-light">
                Loading, Please Wait.
            </h3>
        </div>
    );
};

export default Loading;


