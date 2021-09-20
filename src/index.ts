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

import { Context } from "semantic-release";
import moment from "moment";

type release = "major" | "minor" | "patch";
export interface PluginConfig {
  /** An array of replacements to be made. */
  duration?: number;
  units?: "week" | "day" | "month" | "year";
  release?: release;
}

const DEFAULT_CONFIG: PluginConfig = {
  units: "week",
  duration: 1,
  release: "patch",
};

export async function analyzeCommits(
  {
    duration = DEFAULT_CONFIG.duration,
    units = DEFAULT_CONFIG.units,
    release = DEFAULT_CONFIG.release,
  }: PluginConfig,
  context: Context
): Promise<release | null> {
  const { nextRelease, commits, logger } = context;

  if (nextRelease || !commits) {
    logger.log(
      "Skipping interval based commit analysis since release already set."
    );
    return null;
  }

  const filteredCommits = commits.filter(({ message }) => message.trim());

  if (filteredCommits.length === 0) {
    logger.log(
      "Skipping interval based commit analysis due to lack of valid commits."
    );
    return null;
  }

  const committerDates = filteredCommits
    .map(({ committerDate }) => committerDate)
    .map((date) => moment(date))
    .sort();

  committerDates.forEach((date) => {
    logger.log(`Commit date: ${date.format()}`);
  });

  const firstCommitterDate = committerDates[0];
  const thresholdDate = moment().subtract(duration, units);

  if (firstCommitterDate.isBefore(thresholdDate)) {
    logger.log(
      `Earliest commit, ${firstCommitterDate.format()}, before ${thresholdDate.format()} (${duration} ${units}(s)).`
    );
    return release;
  } else {
    logger.log(
      `Earliest commit, ${firstCommitterDate.format()}, after ${thresholdDate.format()} (${duration} ${units}(s)).`
    );
  }

  return null;
}
