const ErrorModalBox = ({message, onClose, Title}) => {

    let dummyElement = jQuery('<div>').append(message);
    const stringifiedMessage = dummyElement.html();
    dummyElement.remove();
    dummyElement=null;

    return (
        <div className="atfp-error-modal-box-container">
            <div className="atfp-error-modal-box">  
                <div className="atfp-error-modal-box-header">
                    <span className="atfp-error-modal-box-close" onClick={onClose}>×</span>
                    {Title && <h3>{Title}</h3>}
                </div>
                <div className="atfp-error-modal-box-body">
                    <p dangerouslySetInnerHTML={{ __html: stringifiedMessage }} />
                </div>
                <div className="atfp-error-modal-box-footer">
                    <button className="atfp-error-modal-box-close" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ErrorModalBox;
