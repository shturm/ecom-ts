import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event'

import Home, { Props } from "../pages/Home";

function renderComponent(props: Partial<Props> = {}) {
    const defaultProps: Props = {
        // alwaysPass: true
    };
    return render(<Home {...defaultProps} {...props}/>);
}

/**
 * @jest-environment jsdom
 */
describe("<Home />", () => {
    test("should display home page with title and featured products", async () => {
        const { findByTestId } = renderComponent();

        const sut = await findByTestId("page-home");
        
        // expect(sut).toHaveFormValues({
        //     username: "",
        //     password: "",
        //     remember: true
        // });

        expect(sut).toContainHTML("Home");
        expect(sut).toHaveTextContent(/Home/);
        expect(sut).toBeDefined();
    });
});