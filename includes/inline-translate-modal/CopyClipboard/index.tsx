interface CopyClipboardProps {
    text?: string;
    startCopyStatus?: () => void;
    endCopyStatus?: () => void;
}

const CopyClipboard = async ({
    text = "",
    startCopyStatus = () => {},
    endCopyStatus = () => {},
}: CopyClipboardProps): Promise<void> => {
    if (!text || text === "") return;

    try {
        if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback method if Clipboard API is not supported
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            if (document.execCommand) {
                document.execCommand('copy');
            }
            document.body.removeChild(textArea);
        }

        startCopyStatus();
        setTimeout(() => endCopyStatus(), 800); // Reset to "Copy" after 0.8 seconds
    } catch (err) {
        console.error('Error copying text to clipboard:', err);
    }
};

export default CopyClipboard;
