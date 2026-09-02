import storeTranslateString from "../store-translate-strings";

const ScrollAnimation = (props) => {
    const { element, scrollSpeed, prefix, completedPostStatus, totalPosts, postId, lang, provider } = props;

    if (element.scrollHeight - element.offsetHeight <= 0) {
        return;
    }

    let startTime = null;
    let startScrollTop = element.scrollTop;
    const animateScroll = () => {
        const stringContainer = document.querySelector(`#${prefix}-${provider}-table-container[data-render-id="${postId}"]`);

        if (!stringContainer) {
            return;
        }

        const scrollHeight = element.scrollHeight - element.offsetHeight + 100;
        const currentTime = performance.now();
        const duration = scrollSpeed;
        const scrollTarget = scrollHeight + 2000;

        if (!startTime) {
            startTime = currentTime;
        }

        const progress = (currentTime - startTime) / duration;
        const scrollPosition = startScrollTop + (scrollTarget - startScrollTop) * progress;

        var scrollTop = element.scrollTop;
        var currentScrollHeight = element.scrollHeight;
        var clientHeight = element.clientHeight;
        var scrollPercentage = (scrollTop / (currentScrollHeight - clientHeight)) * 100;

        let completedPercentage = (Math.round(scrollPercentage * 10) / 10).toFixed(2);
        completedPercentage = Math.min(completedPercentage, 100).toString();

        updateProgressBarStatus(prefix, postId, lang, completedPercentage, completedPostStatus, totalPosts);

        if (scrollPosition > scrollHeight) {
            return;
        }

        if (scrollPosition || 0 === scrollPosition) {
            element.scrollTop = scrollPosition;
        }

        if (scrollPosition < scrollHeight) {
            requestAnimationFrame(animateScroll);
        }
    }
    requestAnimationFrame(animateScroll);
};

const updateTranslatedContent = ({ provider, prefix, postId, lang, storeDispatch }) => {
    const stringContainer = document.querySelector(`#${prefix}-${provider}-table-container[data-render-id="${postId}"]`);

    if (!stringContainer) {
        return;
    }

    const translatedData = stringContainer.querySelectorAll(`.${prefix}-${provider}-table-cell`);
    translatedData.forEach((ele) => {
        const translatedText = ele.innerText;
        const key = ele.dataset.key;

        storeTranslateString(postId, key, lang, translatedText, provider, lang, storeDispatch);
    });
}

const onCompleteTranslation = ({ provider, prefix, postId, lang, storeDispatch }) => {
    const stringContainer = document.querySelector(`#${prefix}-${provider}-table-container[data-render-id="${postId}"]`);

    if (!stringContainer) {
        return;
    }

    updateTranslatedContent({ provider, prefix, postId, lang, storeDispatch });
}

const updateProgressBarStatus = (prefix, postId, lang, percentage, completedPostStatus, totalPosts) => {
    const progressBarCircular = document.querySelector(`.${prefix}-progress-bar-circular[data-id="${postId}_${lang}"]`);

    let currentPostCompletedPercentage = percentage;
    currentPostCompletedPercentage = Math.round(currentPostCompletedPercentage);
    currentPostCompletedPercentage = Math.min(currentPostCompletedPercentage, 100);

    if (progressBarCircular) {
        progressBarCircular.querySelector(`.${prefix}-percentage`).innerHTML = currentPostCompletedPercentage + '%';
        progressBarCircular.querySelector(`.${prefix}-progress`).style.strokeDasharray = currentPostCompletedPercentage + ', 100';
    }

    let totalProgress = completedPostStatus + (percentage / totalPosts);
    const totalProgressBar = document.querySelector(`.${prefix}-overall-progress .${prefix}-progress`);
    if (totalProgressBar) {
        totalProgress = totalProgress.toFixed(2);
        totalProgress = Math.min(totalProgress, 100);
        totalProgressBar.style.width = totalProgress + '%';
        totalProgressBar.innerHTML = totalProgress + '%';
    }
}

const ModalStringScroll = async ({ provider, prefix, postId, lang, storeDispatch, totalPosts, completedPostStatus }) => {
    const startTime = new Date().getTime();

    let translateComplete = false;

    const stringContainer = document.querySelector(`#${prefix}-${provider}-table-container[data-render-id="${postId}"]`);
    let scrollHeight = false;

    if (stringContainer) {
        stringContainer.scrollTop = 0;
        scrollHeight = stringContainer.scrollHeight;
    }

    await new Promise((resolve) => {
        if (!stringContainer) {
            resolve('No container');
            return;
        }

        if (typeof scrollHeight === 'number' && scrollHeight > 100) {
            const visibilityChange = () => {
                if (document.visibilityState === 'visible') {
                    const scrollSpeed = Math.ceil(scrollHeight / (stringContainer.offsetHeight || 1)) * 2000;
                    ScrollAnimation({ element: stringContainer, scrollSpeed, prefix, provider, totalPosts, completedPostStatus, postId, lang });
                }
            }

            document.addEventListener("visibilitychange", visibilityChange);

            setTimeout(() => {
                const scrollSpeed = Math.ceil(scrollHeight / (stringContainer.offsetHeight || 1)) * 2000;
                ScrollAnimation({ element: stringContainer, scrollSpeed, provider, prefix, totalPosts, completedPostStatus, postId, lang });
            }, 2000);

            const onScroll = () => {
                const isScrolledToBottom =
                    stringContainer.scrollTop + stringContainer.clientHeight + 50 >= stringContainer.scrollHeight;
                if (isScrolledToBottom && !translateComplete) {
                    translateComplete = true;
                    stringContainer.removeEventListener('scroll', onScroll);
                    updateProgressBarStatus(prefix, postId, lang, 100, completedPostStatus, totalPosts);
                    document.removeEventListener('visibilitychange', visibilityChange);
                    setTimeout(() => {
                        onCompleteTranslation({ provider, startTime, prefix, postId, lang, storeDispatch });
                        resolve('Complete');
                    }, 4000);
                }
            };
            stringContainer.addEventListener('scroll', onScroll);

            if ((stringContainer.clientHeight || 0) + 10 >= scrollHeight) {
                updateProgressBarStatus(prefix, postId, lang, 100, completedPostStatus, totalPosts);
                setTimeout(() => {
                    document.removeEventListener('visibilitychange', visibilityChange);
                    onCompleteTranslation({ provider, startTime, prefix, postId, lang, storeDispatch });
                    resolve('Complete');
                }, 4000);
            }
        } else {
            updateProgressBarStatus(prefix, postId, lang, 100, completedPostStatus, totalPosts);

            setTimeout(() => {
                onCompleteTranslation({ provider, startTime, prefix, postId, lang, storeDispatch });
                resolve('Complete');
            }, 4000);
        }
    });
}

export default ModalStringScroll;
