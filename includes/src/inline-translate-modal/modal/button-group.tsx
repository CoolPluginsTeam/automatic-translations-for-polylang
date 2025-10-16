import Button from './button';
import { createElement } from "@wordpress/element";

export const ButtonCompat = (props: any) =>
    createElement(Button as any, props);

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
                <ButtonCompat key={button.label} {...button} />
            ))}
        </div>
    );
};

export default ButtonGroup;
