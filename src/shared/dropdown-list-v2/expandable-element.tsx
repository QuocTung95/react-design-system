import { ChevronDownIcon } from "@lifesg/react-icons/chevron-down";
import { Ref, forwardRef } from "react";
import { IconContainer, Selector } from "./expandable-element.styles";
import { DropdownVariantType } from "./types";

interface ExpandableElementProps {
    children: React.ReactNode;
    disabled: boolean;
    expanded: boolean;
    id: string;
    readOnly: boolean;
    variant: DropdownVariantType;
}

export const Component = (
    {
        children,
        disabled,
        expanded,
        id,
        readOnly,
        variant,
    }: ExpandableElementProps,
    ref: Ref<HTMLButtonElement>
) => {
    // =============================================================================
    // RENDER FUNCTION
    // =============================================================================
    return (
        <Selector
            ref={ref}
            type="button"
            aria-expanded={expanded}
            aria-haspopup="listbox"
            data-testid="selector"
            disabled={disabled}
            aria-controls={id}
            $variant={variant}
        >
            {children}
            {!readOnly && (
                <IconContainer $expanded={expanded} $variant={variant}>
                    <ChevronDownIcon aria-hidden />
                </IconContainer>
            )}
        </Selector>
    );
};

export const ExpandableElement = forwardRef(Component);
