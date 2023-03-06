export type PagenationButtonType = "page" | "last" | "first" | "ellipsis";

export type PagenationButton = {
  type: PagenationButtonType;
  current: boolean;
  page: number;
};

export type PaginationData = {
  previous: number | null;
  next: number | null;
  buttons: PagenationButton[];
};

export type PaginationArg = {
  current: number;
  last: number;
  first?: number;
  rangeDisplayed?: number;
  hasFirstAndLast?: boolean;
  hasEllipsis?: boolean;
};

export class PaginationError extends Error {}

const ELLIPSIS_BUTTON = (): PagenationButton => ({
  page: 0,
  type: "ellipsis",
  current: false,
});

export const pagination = (inputArgs: PaginationArg): PaginationData => {
  const arg: Required<PaginationArg> = {
    first: 1,
    rangeDisplayed: 5,
    hasFirstAndLast: true,
    hasEllipsis: true,
    ...inputArgs,
  };

  if (!(arg.first <= arg.current && arg.current <= arg.last)) {
    throw new PaginationError("numbers must be: first <= current <= last");
  }

  if (arg.rangeDisplayed % 2 === 0) {
    throw new PaginationError("rangeDisplayed required to be odd number");
  }

  const pageSet = new Set<number>();

  if (arg.hasFirstAndLast) {
    pageSet.add(arg.first);
    pageSet.add(arg.last);
  }

  const lrRange = ~~(arg.rangeDisplayed / 2);
  const rangeFrom = Math.max(
    Math.min(arg.current - lrRange, arg.last - arg.rangeDisplayed + 1),
    arg.first
  );
  const rangeTo = Math.min(
    Math.max(arg.current + lrRange, arg.first + arg.rangeDisplayed - 1),
    arg.last
  );

  for (let page = rangeFrom; page <= rangeTo; page++) {
    pageSet.add(page);
  }

  const previous = arg.current - 1 >= arg.first ? arg.current - 1 : null;
  const next = arg.current + 1 <= arg.last ? arg.current + 1 : null;

  const getButton = (page: number): PagenationButton => {
    let type: PagenationButtonType = "page";
    if (page === arg.first) type = "first";
    if (page === arg.last) type = "last";
    return {
      page,
      type,
      current: page === arg.current,
    };
  };

  const buttons: PagenationButton[] = Array.from(pageSet)
    .sort((a, b) => a - b)
    .flatMap((page, i, pages) => {
      const addButtons: PagenationButton[] = [];
      addButtons.push(getButton(page));
      if (arg.hasEllipsis) {
        const nextPage = pages[i + 1];
        const consecutive =
          !Number.isInteger(nextPage) || nextPage === page + 1;
        if (!consecutive) {
          addButtons.push(ELLIPSIS_BUTTON());
        }
      }
      return addButtons;
    });

  return {
    previous,
    next,
    buttons,
  };
};
