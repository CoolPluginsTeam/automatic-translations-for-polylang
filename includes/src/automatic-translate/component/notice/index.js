import { useEffect, useState } from 'react';

const Notice = ({className, children, isDismissible=false, lastNotice=false, type=""}) => {

    const [showNotice, setShowNotice] = useState(true);

    const updateNoticeStatus = () => {
        if(showNotice){
            setShowNotice(false);
            updateNoticeWrapperHeight();
        }
    }

    const updateNoticeWrapperHeight = () => {
        const parentNoticeWrapper = document.querySelector('.atfp-body-notice-wrapper');
        if(parentNoticeWrapper){
            const height= parentNoticeWrapper.offsetHeight + parentNoticeWrapper.offsetTop;

            parentNoticeWrapper.closest('.modal-body').style.setProperty('--atfp-notice-wrapper-height', `${height}px`);
        }
    }

    useEffect(() => {

        if(lastNotice){
            updateNoticeWrapperHeight();
            window.addEventListener('resize', updateNoticeWrapperHeight);
        }
        
        return () => {
            window.removeEventListener('resize', updateNoticeWrapperHeight);
        }

    }, [lastNotice]);


    return (
        showNotice ? <div className={className}>
            {type === "alert" && <div className="atfp-notice-alert-icon">i</div>}
            <div className="atfp-notice-body">{children}</div>
            {isDismissible && <div className="atfp-notice-close" onClick={updateNoticeStatus}></div>}
        </div> : null
    );
};

export default Notice;
