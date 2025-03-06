import { useEffect } from 'react';

const Notice = (props) => {

    const updateNoticeWrapperHeight = () => {
        const parentNoticeWrapper = document.querySelector('.atfp-body-notice-wrapper');
        if(parentNoticeWrapper){
            const height= parentNoticeWrapper.offsetHeight + parentNoticeWrapper.offsetTop;

            parentNoticeWrapper.closest('.modal-body').style.setProperty('--atfp-notice-wrapper-height', `${height}px`);
        }
    }

    useEffect(() => {

        if(props.lastNotice){
            updateNoticeWrapperHeight();
            window.addEventListener('resize', updateNoticeWrapperHeight);
        }
        
        return () => {
            window.removeEventListener('resize', updateNoticeWrapperHeight);
        }

    }, [props.lastNotice]);

    return (
        <div className={props.className}>{props.children}</div>
    );
};

export default Notice;
