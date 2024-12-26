import React, {useEffect} from 'react';

const ErrorAlert = ({ message, onClose }) => {

  useEffect(() => {
      const timer = setTimeout(() => {
          onClose();
      }, 2000);

      return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="modal fade show" style={{ display: "block", animation: "slideIn 2s forwards" }} tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
            <div className="modal-body" style={{ fontFamily: "Poppins", textAlign: "center", backgroundColor: '#C75861', color: 'white' }}>
              <p className="alert alert-success mb-0" style={{ textAlign: "center", backgroundColor: '#C75861', color: 'white' }}>
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

export default ErrorAlert;