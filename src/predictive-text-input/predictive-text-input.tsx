import debounce from "lodash/debounce";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "../input";
import { DropdownList } from "../shared/dropdown-list/dropdown-list";
import { DropdownWrapper } from "../shared/dropdown-wrapper";
import {
    Divider,
    SelectorDiv,
} from "../shared/dropdown-wrapper/dropdown-wrapper.styles";
import { PredictiveTextInputProps } from "./types";
import { ItemsLoadStateType } from "../shared/dropdown-list/types";

export const PredictiveTextInput = <T, V>({
    className,
    "data-testid": testId,
    selectedOption,
    minimumCharacters = 3,
    fetchOptions,
    placeholder = "Enter here...",
    readOnly = false,
    disabled = false,
    error,
    valueExtractor,
    listExtractor,
    displayValueExtractor = (item) => item.toString(),
    onSelectOption,
}: PredictiveTextInputProps<T, V>) => {
    // =============================================================================
    // CONST, STATE
    // =============================================================================
    const inputValue = selectedOption && displayValueExtractor(selectedOption);
    const [input, setInput] = useState<string>(inputValue || "");
    const [searchedInput, setSearchedInput] = useState<string>(
        inputValue || ""
    );
    const [options, setOptions] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [isOptionSelected, setIsOptionSelected] = useState<boolean>(
        !!selectedOption
    );
    const [prevOptionSelected, setPrevOptionSelected] =
        useState<T>(selectedOption);
    const fetchOptionsRef = useRef(fetchOptions);

    // =============================================================================
    // DEBOUNCE FUNCTIONS
    // =============================================================================

    const handleFetchOptions = async (input: string) => {
        setIsError(false);
        setIsLoading(true);
        try {
            const fetchedOptions = await fetchOptionsRef.current(input);
            setSearchedInput(input);
            setOptions(fetchedOptions);
            setIsLoading(false);
        } catch {
            setIsError(true);
        }
    };

    const fetchOptionsDebounced = useCallback(
        debounce((input) => handleFetchOptions(input), 500, {
            leading: false,
            trailing: true,
        }),
        []
    );

    // =============================================================================
    // EFFECTS
    // =============================================================================

    useEffect(() => {
        fetchOptionsRef.current = fetchOptions;
    }, [fetchOptions]);

    useEffect(() => {
        /***
         * Should not fetch options for the following the scenario :
         * 1. When input < minimumCharacters
         * 2. When user selected option from dropdown becomes input
         * 3. Initial selectedOption passed in as input
         */
        if (
            input &&
            input.length >= minimumCharacters &&
            input !== searchedInput
        ) {
            fetchOptionsDebounced(input);
        } else {
            fetchOptionsDebounced.cancel();
        }

        if (input === "" && prevOptionSelected) {
            if (onSelectOption) {
                onSelectOption(undefined, undefined);
            }
            handleDropdownDismiss();
            setPrevOptionSelected(undefined);
        }

        if (selectedOption && input !== displayValueExtractor(selectedOption)) {
            setIsOptionSelected(false);
        }
    }, [input, selectedOption]);

    /**
     * To sync input to selectedOption,
     * hide dropdown and sync prevOption selected
     */
    useEffect(() => {
        if (selectedOption) {
            setInput(displayValueExtractor(selectedOption));
            handleDropdownDismiss(selectedOption);
            setPrevOptionSelected(selectedOption);
        }
    }, [selectedOption]);

    // =============================================================================
    // EVENT HANDLERS
    // =============================================================================

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSelectItem = (item: T, extractedValue: V) => {
        if (onSelectOption) {
            onSelectOption(item, extractedValue);
        }
    };

    const handleDropdownDismiss = (item?: T) => {
        setSearchedInput(item ? displayValueExtractor(item) : "");
        setIsOptionSelected(!!item);
        setOptions([]);
        setIsLoading(true);
    };

    const handleOnClear = () => {
        setInput("");
        if (onSelectOption) {
            onSelectOption(undefined, undefined);
        }
        handleDropdownDismiss();
    };

    const handleWrapperBlur = () => {
        if (!isOptionSelected && !prevOptionSelected) {
            handleOnClear();
        } else {
            handleDropdownDismiss(prevOptionSelected);
            setInput(displayValueExtractor(prevOptionSelected));
            if (onSelectOption) {
                onSelectOption(
                    prevOptionSelected,
                    getValue(prevOptionSelected)
                );
            }
            setPrevOptionSelected(prevOptionSelected);
        }
    };

    // =============================================================================
    // HELPER FUNCTION
    // =============================================================================

    const showDropdown = () => {
        return input && input.length >= minimumCharacters && !isOptionSelected;
    };

    const getValue = (item: T): V => {
        return valueExtractor ? valueExtractor(item) : (item as unknown as V);
    };

    const getItemsLoadState = (): ItemsLoadStateType => {
        if (isError) return "fail";

        return isLoading ? "loading" : "success";
    };

    // =============================================================================
    // RENDER FUNCTION
    // =============================================================================

    const renderDropDown = () => {
        return (
            <DropdownList
                listItems={options}
                onSelectItem={handleSelectItem}
                valueExtractor={valueExtractor}
                listExtractor={listExtractor}
                itemsLoadState={getItemsLoadState()}
                visible={showDropdown()}
                disableItemFocus={true}
                onRetry={() => handleFetchOptions(input)}
                itemTruncationType={"end"}
                itemMaxLines={1}
                labelDisplayType={"next-line"}
            />
        );
    };

    const renderInputField = () => {
        return (
            <Input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder={placeholder}
                readOnly={readOnly}
                disabled={disabled}
                allowClear={true}
                onClear={handleOnClear}
                styleType="no-border"
            />
        );
    };

    return (
        <DropdownWrapper
            className={className}
            show={showDropdown()}
            error={error && !showDropdown()}
            disabled={disabled}
            readOnly={readOnly}
            testId={testId}
            onBlur={handleWrapperBlur}
        >
            {!readOnly ? (
                <SelectorDiv>{renderInputField()}</SelectorDiv>
            ) : (
                <>{renderInputField()}</>
            )}
            {!readOnly && showDropdown() && <Divider />}
            {renderDropDown()}
        </DropdownWrapper>
    );
};
