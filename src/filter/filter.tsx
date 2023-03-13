import { CrossIcon } from "@lifesg/react-icons/cross";
import { FilterIcon } from "@lifesg/react-icons/filter";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Button } from "../button/button";
import { Overlay } from "../overlay/overlay";
import { MediaWidths } from "../spec/media-spec";
import { FilterItem } from "./filter-item";
import {
    DesktopContainer,
    FilterBody,
    FilterClearButton,
    FilterFooter,
    FilterHeader,
    FilterHeaderButton,
    FilterTitle,
    MobileContainer,
} from "./filter.styles";
import { FilterProps } from "./types";

export const Filter = ({ items }: FilterProps) => {
    // =============================================================================
    // CONST, STATE, REF
    // =============================================================================
    const isMobile = useMediaQuery({
        maxWidth: MediaWidths.mobileL,
    });
    const [visible, setVisible] = useState(false);

    // =========================================================================
    // EVENT HANDLERS
    // =========================================================================
    const handleShowFilter = () => {
        setVisible(true);
    };

    const handleDoneClick = () => {
        setVisible(false);
    };

    // =========================================================================
    // RENDER FUNCTIONS
    // =========================================================================
    const renderFilterItems = () => (
        <div>
            {items.map((item, index) => {
                return (
                    <FilterItem
                        key={index}
                        {...item}
                        mode={isMobile ? "mobile" : "default"}
                    />
                );
            })}
        </div>
    );

    const renderMobile = () => {
        return (
            <>
                <Button.Default styleType="light" onClick={handleShowFilter}>
                    <FilterIcon /> Sort & Filters
                </Button.Default>
                {visible && (
                    <Overlay show>
                        <MobileContainer>
                            <FilterHeader>
                                <FilterHeaderButton>
                                    <CrossIcon />
                                </FilterHeaderButton>
                                <FilterTitle weight="semibold">
                                    Filters
                                </FilterTitle>
                                <FilterClearButton styleType="link">
                                    Clear
                                </FilterClearButton>
                            </FilterHeader>
                            <FilterBody>{renderFilterItems()}</FilterBody>
                            <FilterFooter>
                                <Button.Default onClick={handleDoneClick}>
                                    Done
                                </Button.Default>
                            </FilterFooter>
                        </MobileContainer>
                    </Overlay>
                )}
            </>
        );
    };

    const renderDesktop = () => {
        return (
            <DesktopContainer>
                <FilterHeader>
                    <FilterTitle weight="semibold">Filters</FilterTitle>
                    <FilterClearButton styleType="link">
                        Clear
                    </FilterClearButton>
                </FilterHeader>
                <FilterBody>{renderFilterItems()}</FilterBody>
            </DesktopContainer>
        );
    };

    return isMobile ? renderMobile() : renderDesktop();
};
