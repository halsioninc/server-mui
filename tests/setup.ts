import { beforeAll, vi, beforeEach, afterEach } from "vitest";
import { setServer } from "./test-utils";
import { cleanup } from "@testing-library/react";

beforeAll(() => {
  // Set server environment by default
  setServer();
});

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});
