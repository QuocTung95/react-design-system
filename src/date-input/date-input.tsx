import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { CalendarAction, CalendarRef } from "../shared/internal-calendar";
import { AnimatedInternalCalendar } from "../shared/internal-calendar/animated-internal-calendar";
import {
    StandaloneDateInput,
    StandaloneDateInputRef,
} from "../shared/standalone-date-input/standalone-date-input";
import { MediaWidths } from "../spec/media-spec";
import { useEventListener } from "../util/use-event-listener";
import { Container } from "./date-input.style";
import { DateInputProps } from "./types";

export type ActionComponent = "calendar" | "input";

export const DateInput = ({
    between,
    disabled,
    disabledDates,
    error,
    value,
    onChange,
    onBlur,
    withButton: _withButton = true,
    readOnly,
    id,
    ...otherProps
}: DateInputProps) => {
    // =============================================================================
    // CONST, STATE, REF
    // =============================================================================
    const [initialDate, setInitialDate] = useState<string>(value);
    const [selectedDate, setSelectedDate] = useState<string>(value);
    const [hoveredDate, setHoveredDate] = useState<string>(undefined);
    const [calendarOpen, setCalendarOpen] = useState<boolean>(false);

    const nodeRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<CalendarRef>();
    const inputRef = useRef<StandaloneDateInputRef>();
    const isMobile = useMediaQuery({
        maxWidth: MediaWidths.mobileL,
    });

    // show button if it is mobile view
    const withButton = _withButton || isMobile;

    // =============================================================================
    // EFFECTS
    // =============================================================================
    useEffect(() => {
        setInitialDate(value);
        setSelectedDate(value);
    }, [value]);

    /**
     * Allows effect below to always get latest state value
     * Reference:
     * https://stackoverflow.com/questions/65125665/new-event-doesnt-have-latest-state-value-updated-by-previous-event
     */

    useEventListener("keydown", handleContainerKeyDown, nodeRef.current);

    // =============================================================================
    // EVENT HANDLERS
    // =============================================================================
    const handleContainerBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        if (nodeRef && !nodeRef.current.contains(event.relatedTarget)) {
            inputRef.current.resetInput();
            setSelectedDate(initialDate);
            setCalendarOpen(false);
            performOnBlurHandler();
        }
    };

    function handleContainerKeyDown(event: KeyboardEvent) {
        if (event.code === "Escape") {
            inputRef.current.resetInput();
            setSelectedDate(initialDate);
            setCalendarOpen(false);
        }
    }

    const handleChange = (value: string) => {
        setSelectedDate(value);

        if (value && !withButton) {
            setInitialDate(value);
            setCalendarOpen(false);
            performOnChangeHandler(value);
        }
    };

    const handleFocus = () => {
        setCalendarOpen(true);

        if (!calendarOpen) {
            calendarRef.current.resetView();
        }
    };

    const handleHoverDayCell = (value: string) => {
        setHoveredDate(value);
    };

    const handleCalendarAction = (buttonAction: CalendarAction) => {
        // handle button in day calendar view
        switch (buttonAction) {
            case "reset":
                setSelectedDate(initialDate);
                break;
            case "confirmed":
                setInitialDate(selectedDate);
                performOnChangeHandler(selectedDate);
                break;
        }

        setCalendarOpen(false);
    };

    // =============================================================================
    // HELPER FUNCTIONS
    // =============================================================================
    const performOnChangeHandler = (changeValue?: string) => {
        if (onChange) {
            onChange(changeValue);
        }
    };

    const performOnBlurHandler = () => {
        if (onBlur) {
            onBlur();
        }
    };

    // =============================================================================
    // RENDER FUNCTION
    // =============================================================================
    return (
        <Container
            ref={nodeRef}
            $disabled={disabled}
            $readOnly={readOnly}
            $error={error}
            id={id}
            data-testid={otherProps["data-testid"]}
            tabIndex={-1}
            onBlur={handleContainerBlur}
            {...otherProps}
        >
            <StandaloneDateInput
                ref={inputRef}
                disabled={disabled}
                onChange={handleChange}
                onFocus={handleFocus}
                readOnly={readOnly}
                focused={calendarOpen}
                names={["start-day", "start-month", "start-year"]}
                value={selectedDate}
                hoverValue={hoveredDate}
            />
            <AnimatedInternalCalendar
                ref={calendarRef}
                type="input"
                variant="single"
                isOpen={calendarOpen}
                withButton={withButton}
                value={selectedDate}
                disabledDates={disabledDates}
                minDate={between && between[0]} // FIXME: Handle refactoring of between prop to minDate and maxDate
                maxDate={between && between[1]} // FIXME: Same as above
                onHover={handleHoverDayCell}
                onSelect={handleChange}
                onDismiss={handleCalendarAction}
            />
        </Container>
    );
};
