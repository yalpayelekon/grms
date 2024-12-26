import React from 'react';

const SuccessAlert = ({ message }) => {
  return (
    <div className="modal fade show" style={{ display: "block", animation: "slideIn 4s forwards" }} tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-body" style={{ fontFamily: "Poppins", textAlign: "center", backgroundColor: '#49796B', color: 'white' }}>
            <p className="alert alert-success mb-0" style={{ textAlign: "center", backgroundColor: '#49796B', color: 'white' }}>
              <strong>
                {message.split('..')[0]}<span style={{ color: 'yellow' }}> {message.split('..')[1]}</span>
              </strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessAlert;