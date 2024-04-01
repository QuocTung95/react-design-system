import styled, { css } from "styled-components";
import { Color } from "../color/color";
import { MediaQuery } from "../media/media";
import { ComponentLoadingSpinner } from "../shared/component-loading-spinner/component-loading-spinner";
import { TextStyleHelper } from "../text";
import { MainStyleProps } from "./types";
import { DesignToken } from "../design-token";

export const Main = styled.button<MainStyleProps>`
    padding: 0.5rem 1rem;
    min-width: 4rem;
    border-radius: 4px;
    transition: all 200ms ease;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (hover: hover) {
        &:hover {
            box-shadow: 1px 1px 4px 2px rgba(0, 0, 0, 0.2);
        }
    }

    // -----------------------------------------------------------------------------
    // BUTTON STYLE + TEXT COLOR
    // -----------------------------------------------------------------------------
    ${(props) => {
        switch (props.$buttonStyle) {
            case "secondary":
                return css`
                    background-color: ${Color.Neutral[8]};
                    border: 1px solid
                        ${props.$buttonIsDanger
                            ? DesignToken.Button.Danger.Border
                            : Color.Primary};

                    span {
                        color: ${props.$buttonIsDanger
                            ? DesignToken.Button.Danger.Primary
                            : Color.Primary};
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        flex-direction: ${props.$buttonIconPosition === "right"
                            ? "row-reverse"
                            : ""};
                    }
                `;
            case "light":
                return css`
                    background-color: ${Color.Neutral[8]};
                    border: 1px solid ${Color.Neutral[5]};

                    span {
                        color: ${props.$buttonIsDanger
                            ? DesignToken.Button.Danger.Primary
                            : Color.Primary};
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        flex-direction: ${props.$buttonIconPosition === "right"
                            ? "row-reverse"
                            : ""};
                    }
                `;
            case "disabled":
                return css`
                    background-color: ${Color.Neutral[6]};
                    border: 1px solid transparent;
                    cursor: not-allowed;

                    &:hover {
                        box-shadow: none;
                    }

                    span {
                        color: ${Color.Neutral[3]};
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        flex-direction: ${props.$buttonIconPosition === "right"
                            ? "row-reverse"
                            : ""};
                    }
                `;
            case "link":
                return css`
                    background-color: transparent;
                    border: none;
                    border-radius: unset;

                    span {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        flex-direction: ${props.$buttonIconPosition === "right"
                            ? "row-reverse"
                            : ""};
                    }

                    &:hover {
                        box-shadow: none;
                    }

                    color: ${props.$buttonIsDanger
                        ? DesignToken.Button.Danger.Primary
                        : Color.Primary};
                    :hover,
                    :active,
                    :focus {
                        span {
                            color: ${props.$buttonIsDanger
                                ? DesignToken.Button.Danger.Hover
                                : Color.Secondary};
                        }
                    }
                `;
            default:
                return css`
                    background-color: ${props.$buttonIsDanger
                        ? DesignToken.Button.Danger.BackgroundColor
                        : Color.Primary};
                    border: 1px solid transparent;

                    ${MediaQuery.MaxWidth.mobileL} {
                        width: 100%;
                    }

                    span {
                        color: ${Color.Neutral[8]};
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        flex-direction: ${props.$buttonIconPosition === "right"
                            ? "row-reverse"
                            : ""};
                    }
                `;
        }
    }}

    // -----------------------------------------------------------------------------
	// BUTTON SIZE + TEXT SIZE
	// -----------------------------------------------------------------------------
	${(props) => {
        switch (props.$buttonSizeStyle) {
            case "small":
                return css`
                    height: 2.5rem;
                    span {
                        ${TextStyleHelper.getTextStyle("H5", "semibold")}
                        display: flex;
                        align-items: center;
                        flex-direction: ${props.$buttonIconPosition === "right"
                            ? "row-reverse"
                            : ""};
                    }

                    ${MediaQuery.MaxWidth.mobileS} {
                        height: auto;
                    }
                `;
            default:
                return css`
                    height: 3rem;
                    span {
                        ${TextStyleHelper.getTextStyle("H4", "semibold")}
                        display: flex;
                        align-items: center;
                        flex-direction: ${props.$buttonIconPosition === "right"
                            ? "row-reverse"
                            : ""};
                    }

                    ${MediaQuery.MaxWidth.mobileS} {
                        height: auto;
                    }
                `;
        }
    }}
`;

export const Spinner = styled(ComponentLoadingSpinner)<MainStyleProps>`
    margin-right: 0.5rem;
    ${(props) => {
        let color = props.$buttonIsDanger
            ? DesignToken.Button.Danger.Primary
            : Color.Primary(props);
        switch (props.$buttonStyle) {
            case "secondary":
            case "light":
            case "link":
                break;
            case "disabled":
                color = Color.Neutral[3](props);
                break;
            default:
                color = Color.Neutral[8](props);
                break;
        }

        return css`
            #inner1,
            #inner2,
            #inner3,
            #inner4 {
                border-color: ${color} transparent transparent transparent;
            }
        `;
    }}
`;
