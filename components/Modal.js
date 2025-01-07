// components/Modal.js

import React from 'react';

const Modal = ({ onClose, children }) => {
    return (
        <div className='overlay'>
            <div style={modalStyle}>
                <button onClick={onClose} style={closeButtonStyle}>X</button>
                {children}
            </div>
        </div>
    );
};

// const overlayStyle = {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1000
// };

const modalStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '4px',
    width: '80%',
    maxWidth: '500px',
    position: 'relative'
};

const closeButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer'
};

export default Modal;
