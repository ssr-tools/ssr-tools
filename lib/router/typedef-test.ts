/* eslint-disable @typescript-eslint/no-unused-vars */

// This file is to test type definitions correctness via `npm run tsc`.
// It should never export anything.

import type { PathParams } from "./types";
import type { Match } from "../../test-utils/types";

const t1: Match<PathParams<"/hello">, null> = true;

const t2: Match<
  PathParams<"/hello/:world">,
  {
    world?: string;
  }
> = true;

const t3: Match<
  PathParams<"/hello/:world/:hello">,
  {
    hello?: string;
    world?: string;
  }
> = true;

type T4 = PathParams<"/hello/:world/hello/:foo">;

const t4_0: Match<
  T4,
  {
    world?: string;
    foo?: string;
  }
> = true;

const t4_1: Match<T4, { world?: 100 }> = false;

const t4_2: Match<T4, null> = false;

const t4_3: Match<T4, []> = false;
