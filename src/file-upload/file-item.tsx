import { BinIcon, CrossIcon, PencilIcon } from "@lifesg/react-icons";
import {
    Content,
    DesktopErrorMessage,
    ErrorIconButton,
    IconButton,
    Item,
    ItemActionContainer,
    ItemFileSizeText,
    ItemNameSection,
    ItemText,
    LoadingActionContainer,
    MobileErrorMessage,
} from "./file-item.styles";
import { FileItemProps } from "./types";
import { ProgressBar } from "../shared/progress-bar";

interface Props extends FileItemProps {
    onDelete: () => void;
    onEdit?: (() => void) | undefined;
}

export const FileItem = ({
    id,
    type,
    name,
    description,
    size,
    progress = 1,
    errorMessage,
    editableMode,
    onDelete,
    onEdit,
}: Props) => {
    // =========================================================================
    // EVENT HANDLERS
    // =========================================================================
    const isLoading = progress < 1;

    // =========================================================================
    // EVENT HANDLERS
    // =========================================================================
    const handleDelete = () => {
        onDelete();
    };

    const handleEdit = () => {
        if (onEdit) onEdit();
    };

    // =========================================================================
    // RENDER FUNCTIONS
    // =========================================================================
    const renderActionButton = () => {
        if (isLoading) {
            return (
                <LoadingActionContainer>
                    <ProgressBar progress={progress} />
                </LoadingActionContainer>
            );
        } else if (errorMessage) {
            return (
                <ItemActionContainer>
                    <ErrorIconButton
                        onClick={handleDelete}
                        data-testid={`${id}-error-delete-button`}
                    >
                        <CrossIcon />
                    </ErrorIconButton>
                </ItemActionContainer>
            );
        } else {
            const isEditable = isSupportedImageType(type);

            return (
                <ItemActionContainer $hasEditButton={isEditable}>
                    {isEditable && (
                        <IconButton
                            key="edit"
                            data-testid={`${id}-edit-button`}
                            type="button"
                            styleType="light"
                            onClick={handleEdit}
                        >
                            <PencilIcon />
                        </IconButton>
                    )}
                    <IconButton
                        key="delete"
                        data-testid={`${id}-delete-button`}
                        type="button"
                        styleType="light"
                        onClick={handleDelete}
                    >
                        <BinIcon />
                    </IconButton>
                </ItemActionContainer>
            );
        }
    };

    return (
        <Item
            id={id}
            $error={!!errorMessage}
            $loading={isLoading}
            $editable={isSupportedImageType(type)}
        >
            <Content>
                <ItemNameSection>
                    <ItemText
                        data-testid="name"
                        weight={description ? "semibold" : "regular"}
                    >
                        {name}
                    </ItemText>
                    {description && (
                        <ItemText data-testid="description">
                            {description}
                        </ItemText>
                    )}
                    {errorMessage && (
                        <DesktopErrorMessage weight="semibold">
                            {errorMessage}
                        </DesktopErrorMessage>
                    )}
                </ItemNameSection>
                <ItemFileSizeText>
                    {!isLoading && formatFileSizeDisplay(size)}
                </ItemFileSizeText>
                {errorMessage && (
                    <MobileErrorMessage weight="semibold">
                        {errorMessage}
                    </MobileErrorMessage>
                )}
            </Content>
            {renderActionButton()}
        </Item>
    );
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================
// Adapted from https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
const formatFileSizeDisplay = (size?: number) => {
    if (!size || size === 0) return "0kb";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const index = Math.floor(Math.log(size) / Math.log(k));

    return `${parseFloat((size / Math.pow(k, index)).toFixed(0))} ${
        sizes[index]
    }`;
};

const isSupportedImageType = (type: string) => {
    /** Currently only images supported by html <img> */
    const acceptedImageTypes = [
        "image/avif",
        "image/gif",
        "image/jpeg",
        "image/png",
        "image/svg+xml",
        "image/webp",
    ];

    return acceptedImageTypes.includes(type);
};
