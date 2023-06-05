export interface FileItemProps {
    id: string;
    /** The file MIME type */
    type: string;
    /** The name of the file and will be used as the title */
    name: string;
    /** The alt text or description of the file */
    description?: string | undefined;
    /** The size of the file in bytes */
    size: number;
    /** The upload progress display. Values from 0 to 1 */
    progress?: number | undefined;
    /** The error message display to indicate file upload error */
    errorMessage?: string | undefined;
    /** If set, the item will be in editable mode */
    editableMode?: boolean | undefined;
}

export type FileUploadStyle = "bordered" | "no-border";

export interface FileInputProps {
    /** Defines the file types that is accepted */
    accept?: string | undefined;
    /** Specifies which camera to use for capture of image or video data  */
    capture?: boolean | "user" | "environment" | undefined; // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
    /** Specifies if user is allowed to select more than one file. */
    multiple?: boolean | undefined;
    disabled?: boolean | undefined;
    id?: string | undefined;
    className?: string | undefined;
    name?: string | undefined;
}

export interface ChangeEventFile {
    file: File;
    /** The optional alt text or description assigned to the file */
    description?: string | undefined;
}

export interface FileUploadProps extends FileInputProps {
    /** Component specific */
    /** Called when an upload happens via drag drop or click */
    onChange?: (files: File[]) => void;
    /** Called when an update to the description happens */
    onUpdate?: (fileItem: FileItemProps) => void;
    /** Called when a file item's delete button is clicked */
    onDelete?: (fileItem: FileItemProps) => void;
    title?: string | JSX.Element | undefined;
    description?: string | JSX.Element | undefined;
    styleType?: FileUploadStyle | undefined;
    maxFiles?: number | undefined;
    errorMessage?: string | undefined;
    warning?: string | JSX.Element | undefined;
    fileItems?: FileItemProps[] | undefined;
    /** If set, file items will be editable (only image files) */
    editableFileItems?: boolean | undefined;
}
