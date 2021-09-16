/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as m from "../src/index";

import { Context } from "semantic-release";
import moment from "moment";

const context = { logger: console, env: {} };

test("should expose analyzeCommits", async () => {
  expect(m.analyzeCommits).toBeDefined();
});

test("should skip empty messages", async () => {
  await expect(
    m.analyzeCommits({}, { ...context, commits: [{ message: "" }] } as Context)
  ).resolves.toEqual(null);
});

test("should skip no commits", async () => {
  await expect(m.analyzeCommits({}, { ...context })).resolves.toEqual(null);
});

test("should patch due to interval", async () => {
  await expect(
    m.analyzeCommits({}, {
      ...context,
      commits: [
        {
          message: "foo",
          committerDate: moment().subtract(1, "day").toISOString(),
        },
        {
          message: "foo",
          committerDate: moment().subtract(1, "month").toISOString(),
        },
      ],
    } as Context)
  ).resolves.toEqual("patch");
});

test("should not patch due to interval", async () => {
  await expect(
    m.analyzeCommits({}, {
      ...context,
      commits: [
        {
          message: "foo",
          committerDate: moment().subtract(1, "minute").toISOString(),
        },
        {
          message: "foo",
          committerDate: moment().subtract(2, "minute").toISOString(),
        },
      ],
    } as Context)
  ).resolves.toEqual(null);
});

test("should patch due to interval with custom config", async () => {
  await expect(
    m.analyzeCommits({ release: "major", duration: 10, units: "day" }, {
      ...context,
      commits: [
        {
          message: "foo",
          committerDate: moment().subtract(11, "day").toISOString(),
        },        
      ],
    } as Context)
  ).resolves.toEqual("major");
});
