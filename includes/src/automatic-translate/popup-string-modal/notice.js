const StringPopUpNotice = (props) => {
    return (
        <div className={`notice inline notice-info is-dismissible ${props.className}`}>
            {Array.isArray(props.children) ? props.children.join(' ') : props.children}
        </div>
    );
}

export default StringPopUpNotice;