# Semantic Release Interval Plugin

[![npm](https://img.shields.io/npm/v/semantic-release-interval)](https://www.npmjs.com/package/semantic-release-interval)
![Build](https://github.com/jpoehnelt/semantic-release-interval/workflows/Build/badge.svg)
![Release](https://github.com/jpoehnelt/semantic-release-interval/workflows/Release/badge.svg)
[![codecov](https://codecov.io/gh/jpoehnelt/semantic-release-interval/branch/master/graph/badge.svg)](https://codecov.io/gh/jpoehnelt/semantic-release-interval)
![GitHub contributors](https://img.shields.io/github/contributors/jpoehnelt/semantic-release-interval?color=green)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

The `semantic-release-interval` plugin provides functionality to trigger a new release if the oldest commit since the last release is over a certain age.

Read more about [Semantic Release](https://semantic-release.gitbook.io/).

> **Note**: The release determined by this package **does not** override any previous release analysis and short circuits if `nextRelease` is already defined.
## Install

```bash
$ npm install -D semantic-release-interval
```

## Basic Usage

The following example will generate a release if the oldest commit is more than 1 week old.

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    [
      "semantic-release-interval",
      {
        "units": "week",
        "duration": "1"
      }
    ]
  ]
}
```

## Configuration Options

- `units`: The unit of time to use. Can be `day`, `week`, `month`, `year` or `hour`.
- `duration`: The duration to compare the oldest commit to.
- `release`: The release type to use. Can be `patch`, `minor`, or `major`.
