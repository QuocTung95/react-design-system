import React, { useEffect, useState } from "react";
import { Brand } from "./brand";
import {
    CloseButton,
    CloseIcon,
    Container,
    Content,
    NavBrandContainer,
    NavLogoContainer,
    NavSeparator,
    TopBar,
    Wrapper,
} from "./drawer.styles";
import { NavbarDrawerProps } from "./types";

const Component = (
    props: NavbarDrawerProps,
    ref: React.Ref<HTMLDivElement>
) => {
    // =============================================================================
    // CONST, STATE, REFS
    // =============================================================================
    const {
        show,
        resources,
        children,
        resourcesSecondaryBrand,
        onClose,
        onBrandClick,
        handleSecondaryBrandClick,
    } = props;
    const [viewHeight, setViewHeight] = useState<number>(0);

    // =============================================================================
    // EFFECTS
    // =============================================================================
    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // =============================================================================
    // EVENT HANDLERS
    // =============================================================================
    const handleResize = () => {
        /**
         * Reference:
         * https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
         */
        if (window) {
            const viewHeight = window.innerHeight * 0.01;
            setViewHeight(viewHeight);
        }
    };

    // =============================================================================
    // RENDER FUNCTIONS
    // =============================================================================
    const renderTopBar = () => (
        <TopBar>
            <NavBrandContainer>
                <Brand
                    resources={resources}
                    compress={true}
                    onClick={onBrandClick}
                    data-testid="drawer__brand"
                />
                {resourcesSecondaryBrand && (
                    <NavLogoContainer>
                        <NavSeparator />
                        <Brand
                            resources={resourcesSecondaryBrand}
                            compress={true}
                            onClick={handleSecondaryBrandClick}
                            data-testid="drawer__brand-secondary"
                        />
                    </NavLogoContainer>
                )}
            </NavBrandContainer>

            <CloseButton
                onClick={onClose}
                focusHighlight={false}
                aria-label="Close nav menu"
            >
                <CloseIcon />
            </CloseButton>
        </TopBar>
    );

    return (
        <Wrapper ref={ref} data-testid="drawer">
            <Container $show={show} $viewHeight={viewHeight}>
                <Content>
                    {renderTopBar()}
                    {children}
                </Content>
            </Container>
        </Wrapper>
    );
};

export const Drawer = React.forwardRef(Component);
