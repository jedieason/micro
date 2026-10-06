# 截圖紀錄 / Screenshot record

[繁體中文教學](../README.md) · [English guide](../README.en.md)

拍攝日期：2026-10-06。所有圖片均取自實際瀏覽器或作業系統操作，沒有以示意網頁或生成圖片冒充實際介面。

README 使用 `docs/steps/` 的 16 張標註圖：每步一句操作指令，搭配紅圈；需要依序操作時，圖上加上 1、2、3 編號。標註圖由下列實拍原圖裁切並加上標記，控制項、文字、狀態與結果保持原樣。可編輯的 SVG 存在 `docs/annotations/`。

| 教學標註圖 | 實拍來源 |
| --- | --- |
| 00-star.png | 00-github-star.png (GitHub repo 首頁 Star 按鈕實拍) |
| 01-download.png | 02-github-download-zip.jpg |
| 02-find-zip.png | 03-downloads.jpg |
| 03-extract.png | 04-macos-zip.jpg |
| 04-keep-folder.png | 05-macos-extracted.jpg |
| 05-open-extensions.png | 安裝完成當次實拍的 Chrome 網址列，僅包含 chrome://extensions |
| 06-developer-mode.png | 08b-developer-toggle.jpg |
| 07-load-unpacked.png | 08a-load-unpacked.jpg |
| 08-select-folder.png | 09-select-extension.jpg |
| 09-installed.png | 10-installed.jpg |
| 10-open-panel.png | 11-toolbar-entry.jpg |
| 11-add-slides.png | 13a-add-buttons.jpg |
| 12-start-practice.png | 13-select-slides.jpg |
| 13-answer.png | 15-answer.jpg |
| 14-finish.png | 16-result.jpg |
| 15-history.png | 17-history.jpg |

| 檔案 | 實際拍攝內容 | 範圍與說明 |
| --- | --- | --- |
| 01-github-repository.jpg | GitHub 官方公開範例 octocat/Spoon-Knife 首頁 | 示範 repo 檔案清單與 Code 按鈕，並非尚未發布的 micro repo。 |
| 02-github-download-zip.jpg | 上述 repo 實際展開 Code 選單 | Download ZIP 的位置；README 提醒讀者在 micro 下載。 |
| 03-downloads.jpg | Chrome 下載頁 | 本機演練使用 extension 副本製作的 micro-main.zip；正式 GitHub 發布後應換成正式下載畫面。 |
| 04-macos-zip.jpg | macOS Finder 的 micro-main.zip | 演練 ZIP 僅含 micro-main/extension，未含 README 與 docs。 |
| 05-macos-extracted.jpg | Finder 實際解壓縮結果 | 裁出 micro-main 一般資料夾。 |
| 06-extension-folder.jpg | Finder 的 micro-main/extension | 演練 ZIP 的內容。 |
| 07-manifest-check.jpg | Finder 的 extension 檔案清單 | manifest.json、content、icons、lib、pages 等。 |
| 08-developer-mode.jpg | Chrome 擴充功能管理頁 | 開發人員模式與 Load unpacked。 |
| 08a-load-unpacked.jpg | Load unpacked 按鈕近照 | 與安裝卡片同一次實拍，僅裁切。 |
| 08b-developer-toggle.jpg | Developer mode 開關近照 | 與安裝卡片同一次實拍，僅裁切。 |
| 09-select-extension.jpg | Chrome 原生資料夾選擇視窗 | 實際選取 micro/extension，Select 確認按鈕。 |
| 10-installed.jpg | Chrome 實際載入完成的卡片 | 臺大玻片跑臺機 0.4.0，來自 micro/extension。 |
| 11-toolbar-entry.jpg | Chrome 工具列近照 | 拼圖與已固定的粉紅色玻片圖示，從實際安裝畫面裁出。 |
| 12-slide-list.jpg | 臺大教學站與 extension 側欄 | 原站讀取 349 題，數量依使用者權限而不同。 |
| 13-select-slides.jpg | 實際選取 PA0001、PA0002 的側欄近照 | 使用獨立教學副本的選題資料。 |
| 13a-add-buttons.jpg | 原站縮圖旁的＋與✓按鈕近照 | 從完成示範練習後的原站清單裁出；前兩題仍保持已加入。 |
| 14-unit-selection.jpg | 實際展開依單元選題 | 不代表讀者必須選相同單元。 |
| 15-answer.jpg | 原站影像與作答欄位 | 教學示範練習；不含原有個人練習紀錄。 |
| 16-result.jpg | 實際提交後的核對結果 | mitral valve / infective endocarditis 的示範答案。 |
| 17-history.jpg | 教學副本的完成紀錄 | 一題示範練習。 |

Chrome 與檔案視窗使用 macOS、英文系統介面；extension 使用中文介面。Windows 步驟提供文字說明，沒有宣稱附上 Windows 實拍截圖。

部分截圖裁去瀏覽器其他分頁、網址或大片空白，以集中顯示操作區；未修改控制項的文字、狀態或結果。登入帳號、密碼與網址憑證參數不作為公開教學內容。

micro 尚未發布，原圖 01–02 不能代表它的正式 GitHub 頁面；原圖 03–07 是本機安裝演練。README 的下載步驟與標註圖 01 均標示為按鈕位置範例。正式發布後，可依 [PUBLISHING.md](PUBLISHING.md) 重拍並更新此紀錄。

## 參考流程 / Official references

- [GitHub — Downloading files from GitHub](https://docs.github.com/en/repositories/working-with-files/using-files/downloading-files-from-github)
- [Chrome — Load an unpacked extension](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-an-unpacked-extension)

All screenshots show actual UI interaction. GitHub screenshots use an official public example because micro has not been published. The ZIP extraction and download screenshots use a local rehearsal archive containing the extension. Chrome installation and practice screenshots show the supplied extension operating on the original NTU website. Windows has text instructions, without Windows screenshots. Cropping preserves the visible controls and results. No account credentials or authenticated URL parameters are included in the published guide.
