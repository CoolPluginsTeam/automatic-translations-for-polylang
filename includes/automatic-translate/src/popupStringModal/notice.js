const StringPopUpNotice = (props) => {
    return (
        <div className={`notice inline notice-info is-dismissible ${props.className}`}>
            {props.children.join(' ')}
        </div>
    );
}

export default StringPopUpNotice;