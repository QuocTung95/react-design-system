import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Accordion, AccordionProps, Text } from "../../src";

const DEFAULT_TITLE = "default title";

const renderComponent = (
    props?: Omit<AccordionProps, "children">,
    text?: string[]
) => {
    const renderBody = (text?: string[]): JSX.Element | JSX.Element[] => {
        const isOverrideDefault = text && text.length > 0;

        if (!isOverrideDefault) {
            return (
                <Accordion.Item title={DEFAULT_TITLE}>
                    <Text.Body>Default text</Text.Body>
                </Accordion.Item>
            );
        }
        return text.map((data, index) => (
            <Accordion.Item key={index} title={data}>
                <Text.Body>{data}</Text.Body>
            </Accordion.Item>
        ));
    };

    return render(<Accordion {...props}>{renderBody(text)}</Accordion>);
};

const getExpandItemButton = (isQuery = false, isExpanded = true) => {
    const buttonLabel = isExpanded ? "Collapse" : "Expand";

    if (isQuery) {
        return screen.queryByRole("button", { name: buttonLabel });
    }
    return screen.getByRole("button", { name: buttonLabel });
};

const getExpandAllItemsButton = (isQuery = false, isExpanded = true) => {
    const buttonLabel = isExpanded ? "Hide all" : "Show all";

    if (isQuery) {
        return screen.queryByRole("button", { name: buttonLabel });
    }
    return screen.getByRole("button", { name: buttonLabel });
};

describe("Accordion", () => {
    beforeEach(() => {
        jest.resetAllMocks();

        global.ResizeObserver = jest.fn().mockImplementation(() => ({
            observe: jest.fn(),
            unobserve: jest.fn(),
            disconnect: jest.fn(),
        }));
    });

    it("should render the component", () => {
        renderComponent();

        expect(screen.getByText(DEFAULT_TITLE)).toBeInTheDocument();
    });

    it("should not render title if not specified", () => {
        renderComponent();

        expect(
            screen.queryByRole("heading", { level: 2 })
        ).not.toBeInTheDocument();
    });

    it("should render the expand and collapse buttons", () => {
        renderComponent();

        expect(getExpandAllItemsButton()).toBeInTheDocument();
        expect(getExpandItemButton()).toBeInTheDocument();
    });

    it("should be able to toggle the collapse button", async () => {
        renderComponent();

        await waitFor(() => fireEvent.click(getExpandItemButton()));
        expect(getExpandItemButton(false, false)).toBeInTheDocument();

        await waitFor(() => fireEvent.click(getExpandItemButton(false, false)));
        expect(getExpandItemButton()).toBeInTheDocument();
    });

    it("should not render expand all button if disabled", () => {
        renderComponent({ enableExpandAll: false });

        expect(getExpandAllItemsButton(true)).not.toBeInTheDocument();
    });
});
