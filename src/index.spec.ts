import { describe, it, expect } from "vitest";
import { pagination, PaginationError } from "./";

describe("pagination", () => {
  it("base", () => {
    const res = pagination({ current: 2, last: 10 });
    expect(res.buttons).toStrictEqual([
      { page: 1, type: "first", current: false },
      { page: 2, type: "page", current: true },
      { page: 3, type: "page", current: false },
      { page: 4, type: "page", current: false },
      { page: 5, type: "page", current: false },
      { page: 0, type: "ellipsis", current: false },
      { page: 10, type: "last", current: false },
    ]);
    expect(res.previous).toBe(1);
    expect(res.next).toBe(3);
  });

  describe("errors", () => {
    it("last number must be greater than current", () => {
      expect(() => pagination({ current: 6, last: 5 })).toThrowError(
        PaginationError
      );
    });

    it("first number must be less than current", () => {
      expect(() => pagination({ first: 2, current: 1, last: 5 })).toThrowError(
        PaginationError
      );
    });

    it("rangeDisplayed number must be odd number", () => {
      expect(() =>
        pagination({ current: 3, last: 5, rangeDisplayed: 4 })
      ).toThrowError(PaginationError);
    });
  });

  describe("pages", () => {
    const last = 5;
    const rangeDisplayed = 3;

    it.each([
      [1, [1, 2, 3, 0, 5]],
      [2, [1, 2, 3, 0, 5]],
      [3, [1, 2, 3, 4, 5]],
      [4, [1, 0, 3, 4, 5]],
      [5, [1, 0, 3, 4, 5]],
    ])("current: %s", (current, arr) => {
      const { buttons } = pagination({ current, last, rangeDisplayed });
      const expectedArr = expect.arrayContaining(arr);
      expect(buttons.length).toBe(arr.length);
      expect(buttons.map(({ page }) => page)).toEqual(expectedArr);
    });

    it.each([
      [1, [1, 2, 3, 5]],
      [2, [1, 2, 3, 5]],
      [3, [1, 2, 3, 4, 5]],
      [4, [1, 3, 4, 5]],
      [5, [1, 3, 4, 5]],
    ])("current: %s (no ellipsis)", (current, arr) => {
      const { buttons } = pagination({
        current,
        last,
        rangeDisplayed,
        hasEllipsis: false,
      });
      const expectedArr = expect.arrayContaining(arr);
      expect(buttons.length).toBe(arr.length);
      expect(buttons.map(({ page }) => page)).toEqual(expectedArr);
    });

    it.each([
      [1, [1, 2, 3]],
      [2, [1, 2, 3]],
      [3, [2, 3, 4]],
      [4, [3, 4, 5]],
      [5, [3, 4, 5]],
    ])("current: %s (no first and last)", (current, arr) => {
      const { buttons } = pagination({
        current,
        last,
        rangeDisplayed,
        hasFirstAndLast: false,
      });
      const expectedArr = expect.arrayContaining(arr);
      expect(buttons.length).toBe(arr.length);
      expect(buttons.map(({ page }) => page)).toEqual(expectedArr);
    });

    it("current: 1", () => {
      const { buttons } = pagination({
        current: 1,
        last: 1,
      });
      expect(buttons.map(({ page }) => page)).toStrictEqual([1]);
    });
  });
});
