# README CHANGELOG

[中文](README_CHANGELOG.md)

This file tracks significant changes to the README. Format inspired by [Keep a Changelog](https://keepachangelog.com); version numbers follow CalVer (YYYY-MM-DD).

## [2026-06-13]

### Added

- Two new rows in the features table: drag-and-drop file open and OS file association, matching the v0.3.0 release
- "Custom commands" node in the architecture diagram with two new edges showing how drag-drop and file-association paths flow through `grant_scope` to the fs scope
- `permissions/` directory in the project layout (auto-generated command ACLs)

### Changed

- Design principle paragraph now mentions the two custom Rust commands instead of claiming "Rust handles I/O only" — drag-drop and file association broke the zero-custom-command rule, and the README should say so honestly
- Updated `lib.rs` description to "+ custom commands" and `tauri.conf.json` to mention file association config
