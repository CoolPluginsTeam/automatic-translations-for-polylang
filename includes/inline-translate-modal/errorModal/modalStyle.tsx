const ModalStyle = (props) => {
    const wrapperClass = props.modalContainer;
    return <>
        <style>
            {`
        .${wrapperClass} .components-modal__header{
            height: auto !important;
            padding: 0px !important;
            position: relative;   
            border-bottom: 1px solid #dcdcde;
            padding-right: 1rem !important;
            display: block;
        }
        .${wrapperClass} .components-modal__header button.components-button{
            right: 15px;
            top: 13px;
            border-radius: 0 !important;
            position: absolute;
            color: #646970;
            cursor: pointer;
            height: 27px;
        }
        .${wrapperClass} .components-modal__header h1{
            height: unset;
            padding: 8px 36px 8px 25px;
            border: none;
            background: 0 0;
            font-size: 18px;
            font-weight: 600;
            line-height: 2;
            margin: 0;
            color: black;
        }
        .${wrapperClass} .components-modal__content>div:nth-child(2){
            padding: 0px !important;
            height: 100% !important;
            max-height: calc(100% - 126px) !important;
        }
        .${wrapperClass} .components-modal__content{
            flex: 1;
            overflow: unset;
            padding: 0px;
            margin-top: 0px;
        }
      `}
        </style>
    </>
}

export default ModalStyle;
