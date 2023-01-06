import user_api_handler from "./user";
import { createMocks, RequestOptions, MockResponse } from "node-mocks-http";
import "@testing-library/jest-dom";
import { NextApiRequest, NextApiResponse } from "next";

describe("Test Create User API", () => {
  async function mockUserApiCall(
    options: RequestOptions
  ): Promise<MockResponse<NextApiResponse>> {
    const { req, res }: { req: NextApiRequest; res: NextApiResponse } =
      createMocks({ ...options });
    await user_api_handler(req, res);
    return res as MockResponse<NextApiResponse>;
  }

  it("Checks all variables required", async () => {
    const res = await mockUserApiCall({
      path: "/user",
      method: "POST",
      headers: { "content-type": "application/json" },
      body: {},
    });

    expect(res.statusCode).toBe(400);

    const data = res._getJSONData();
    expect(data.message).toEqual("Please provide a valid name");
    expect(data.errors).toEqual([
      "Please provide a valid name",
      "Please provide a valid email address",
      "Password too weak, your password must have at least 6 characters, a lower case, upper case and a numeric character",
    ]);
  });

  it("Checks creates a new account", async () => {
    const res = await mockUserApiCall({
      path: "/user",
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: {
        name: "Test User",
        email: `user${Date.now()}@testing.com`,
        password: "Pass*1233",
      },
    });

    expect(res.statusCode).toBe(201);

    const data = res._getJSONData();
    expect(data.message).toEqual("User created successfully");
  });

  it("Doesn't allow user duplication", async () => {
    const options: RequestOptions = {
      path: "/user",
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: {
        name: "Test User",
        email: `user${Date.now()}@testing.com`,
        password: "Pass*1233",
      },
    };
    await mockUserApiCall(options);
    const res = await mockUserApiCall(options);

    expect(res.statusCode).toBe(422);

    const data = res._getJSONData();
    expect(data.message).toEqual(
      "Email address already registered by another user"
    );
  });
});
