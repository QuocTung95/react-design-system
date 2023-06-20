import { useRef } from "react";
import { DropzoneElement, FileUploadDropzone } from "./dropzone";
import { FileList } from "./file-list";
import {
    Description,
    Title,
    TitleContainer,
    UploadButton,
    UploadButtonContainer,
    UploadButtonLabel,
    WarningAlert,
} from "./file-upload.styles";
import { FileItemProps, FileUploadProps } from "./types";

export const FileUpload = ({
    styleType = "bordered",
    fileItems,
    title,
    description,
    maxFiles,
    warning,
    className,
    name,
    id,
    accept,
    capture,
    multiple,
    disabled,
    descriptionMaxLength,
    editableFileItems = true,
    onChange,
    onDelete,
    onEdit,
}: FileUploadProps) => {
    // =========================================================================
    // CONST, STATE, REFS
    // =========================================================================
    const dropzoneRef = useRef<DropzoneElement>();

    // =========================================================================
    // EVENT HANDLERS
    // =========================================================================
    const handleChange = (files: File[]) => {
        if (!disabled && onChange) {
            onChange(files);
        }
    };

    const handleItemDelete = (item: FileItemProps) => {
        if (onDelete) {
            onDelete(item);
        }
    };

    const handleUploadButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        if (!disabled) {
            event.preventDefault();
            if (dropzoneRef.current) {
                dropzoneRef.current.openFileDialog();
            }
        }
    };

    const handleItemUpdate = (updatedItem: FileItemProps) => {
        if (onEdit) {
            onEdit(updatedItem);
        }
    };

    // =========================================================================
    // HELPER FUNCTIONS
    // =========================================================================
    const reachedMaxFiles = () => {
        return maxFiles ? fileItems.length >= maxFiles : false;
    };

    // =========================================================================
    // RENDER FUNCTIONS
    // =========================================================================
    return (
        <FileUploadDropzone
            ref={dropzoneRef}
            onChange={handleChange}
            id={id ? `${id}-dropzone` : "dropzone"}
            accept={accept}
            capture={capture}
            border={styleType === "bordered"}
            className={className}
            name={name}
            multiple={multiple}
            disabled={disabled || reachedMaxFiles()}
        >
            {(title || description) && (
                <TitleContainer>
                    {title && <Title weight="regular">{title}</Title>}
                    {description && (
                        <Description weight="semibold">
                            {description}
                        </Description>
                    )}
                </TitleContainer>
            )}
            {warning && <WarningAlert type="warning">{warning}</WarningAlert>}
            <FileList
                fileItems={fileItems}
                editableFileItems={editableFileItems}
                descriptionMaxLength={descriptionMaxLength}
                onItemDelete={handleItemDelete}
                onItemUpdate={handleItemUpdate}
            />
            <UploadButtonContainer>
                <UploadButton
                    type="button"
                    styleType="secondary"
                    disabled={disabled || reachedMaxFiles()}
                    onClick={handleUploadButtonClick}
                >
                    Upload files
                </UploadButton>
                <UploadButtonLabel>or drop them here</UploadButtonLabel>
            </UploadButtonContainer>
        </FileUploadDropzone>
    );
};
