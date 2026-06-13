# README CHANGELOG

[English](README_CHANGELOG_EN.md)

本檔記錄 README 的重大變更。格式參考 [Keep a Changelog](https://keepachangelog.com)，版本號採日期格式。

## [2026-06-13]

### 新增

- 功能表加「拖曳開檔」和「檔案關聯」兩列——v0.3.0 的兩個新功能
- 架構圖加「自訂 Commands」節點和兩條連線（拖曳/檔案關聯 → grant_scope → fs scope 授權）
- 專案結構加 `permissions/` 目錄（自動生成的 command ACL）

### 調整

- 設計原則段落從「Rust 端只負責 I/O」補充為「加兩個自訂 command」——拖曳和檔案關聯打破了原本零自訂 command 的設計，README 要如實反映
- `src/lib.rs` 描述更新為「+ 自訂 commands」；`tauri.conf.json` 描述加「檔案關聯設定」
