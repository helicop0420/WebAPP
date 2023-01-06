import Home from "./Home";
import "@testing-library/jest-dom";
import { render, screen, renderHook, act } from "@testing-library/react";
import { useGlobalState } from "www/shared/modules/global_context";

describe.skip("Home", () => {
  it("renders public homepage", () => {
    render(<Home />);
    const heading = screen.getByText(/grow your/i);
    expect(heading).toBeInTheDocument();

    const signInButton = screen.getByRole("button", {
      name: /Sign in/i,
    });
    expect(signInButton).toBeInTheDocument();

    const elmmbaseText = screen.getByText(/ELMBASE/i);
    expect(elmmbaseText).toBeInTheDocument();
  });

  it("renders user homepage", () => {
    const { result } = renderHook(() => useGlobalState());
    act(() => {
      result.current.setGlobalState({
        supabaseUser: {
          id: "test_user",
          app_metadata: {},
          user_metadata: {},
          email: "tester@home.page",
          aud: "email",
          created_at: "2022-12-12",
        },
      });
    });
    render(<Home />);

    const waitListBtn = screen.getByRole("button", {
      name: /join waitlist/i,
    });
    expect(waitListBtn).toBeInTheDocument();

    const searchBar = screen.getByRole("searchbox");
    expect(searchBar).toBeInTheDocument();
  });
});
