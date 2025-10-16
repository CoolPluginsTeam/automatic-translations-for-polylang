const ModalStyle = (props) => {
    const wrapperClass = props.modalContainer;
    return <>
        <style>
            {`
        .${wrapperClass} .components-modal__header{
            height: auto !important;
            padding: 0px !important;
            position: relative;   
        }
        .${wrapperClass} .components-modal__header .components-modal__header-heading{
            font-size: 1.2rem;
            font-weight: 600;
            line-height: 1;
            margin: 0;
        }
        .${wrapperClass} .components-modal__content>div:nth-child(2){
            height: calc(100% - 2.5rem) !important;
            margin-top: 1.5rem;
            overflow-y: auto;
            overflow-x: hidden;
        }
        .${wrapperClass} .components-modal__content{
            flex: 1;
            overflow: unset;
            padding: 0px;
            margin-top: 0px;
            position: relative;
        }
      `}
        </style>
    </>
}

export default ModalStyle;
