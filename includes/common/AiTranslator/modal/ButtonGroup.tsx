import Button from './Button';

interface ButtonProps {
    label: string;
    className?: string;
    onClick: () => void;
}

interface ButtonGroupProps {
    buttons: ButtonProps[];
    className?: string;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ buttons, className }) => {
    return (
        <div className={className}>
            {buttons.map((button) => (
                <Button key={button.label} {...button} />
            ))}
        </div>
    );
};

export default ButtonGroup;
