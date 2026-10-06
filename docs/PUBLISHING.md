# 將 micro 資料夾發布成 GitHub repo

[回中文教學](../README.md) · [English guide](../README.en.md)

這份文件給專案維護者使用。一般使用者只要照 README 下載與安裝。

## 要上傳的是哪一份？

請把 **micro 資料夾裡的內容** 當作新 repo 的根目錄。repo 名稱使用 **micro**。

```text
micro/                  ← 新 repo 的根目錄
├── README.md            ← GitHub 首頁預設顯示的中文教學
├── README.en.md         ← 可切換的英文教學
├── .gitignore
├── extension/           ← 使用者要 Load unpacked 的資料夾
└── docs/
    ├── PUBLISHING.md
    ├── SCREENSHOTS.md
    └── screenshots/
```

不要把外層 pathology-micro-extension 整個上傳，也不要再包一層 micro，否則讀者解壓縮後的路徑會和教學不同。不要只上傳 README；所有截圖與 extension 都要一起上傳。Chrome 安裝時只選 extension。

## 用 GitHub 網站建立

1. 登入你自己的 GitHub 帳號。
2. 右上角「＋」→ **New repository**。
3. Repository name 輸入 **micro**；若要讓讀者不用登入就能下載，選 **Public**。
4. 這個資料夾已有 README，建立空白 repo 即可，不用另外產生 README。
5. 按 **Create repository**。
6. 在空白專案頁面點 **uploading an existing file**；已有檔案時可用 **Add file → Upload files**。
7. 打開本機 micro，將 **extension、docs、README.md、README.en.md** 拖進上傳區。若系統能顯示隱藏檔，也一起加入 .gitignore。先確認資料夾內的檔案都列在上傳區。
8. 輸入簡短說明，例如 `Add extension and bilingual installation guide`，按 **Commit changes**。
9. 回 repo 首頁，確認 README 自動顯示，並點一次 **English**，確認英文教學與圖片都能開啟。

若使用 GitHub Desktop，選擇此 **micro** 資料夾作為本機 repository，再以 micro 名稱發布。登入、repo 擁有者與公開權限由你決定。

## 發布後必做的下載演練

1. 開啟你新 repo 的首頁，確認 extension 與 docs 位於最外層。
2. 按綠色 **Code → Download ZIP**。
3. 解壓縮，確認 **micro-main/extension/manifest.json** 存在。若預設分支不是 main，請同步修改兩份 README 的範例檔名。
4. 使用 Chrome 的 Developer mode → Load unpacked 選取 extension，確認顯示版本 0.4.0。
5. 用有權限的原站帳號測試讀取、選題、作答與紀錄。請使用獨立測試設定檔或測試副本，避免混入個人的練習紀錄。

## 換成自己的 GitHub 截圖

目前 README 的 GitHub 畫面是官方公開範例 **octocat/Spoon-Knife**。兩份 README 的下載步驟均標示為按鈕位置範例。

發布後請實際拍攝你自己的 repo 首頁、Code 選單與下載頁；README 使用標註圖，請先更新以下兩張，保留紅圈與操作順序編號：

- `docs/steps/01-download.png`
- `docs/steps/02-find-zip.png`

可編輯的標註圖存於 `docs/annotations/`；更新時請同步替換 SVG 中的截圖。原圖另存於以下三個檔案：

- `docs/screenshots/01-github-repository.jpg`
- `docs/screenshots/02-github-download-zip.jpg`
- `docs/screenshots/03-downloads.jpg`

可同時重拍解壓縮畫面。保留 `docs/steps/` 的檔名，兩份 README 的圖片連結就不用修改。

取得自己 repo 的實拍後，移除兩份 README 步驟 1 的範例括號與圖中的 Button-location example 標示，再更新 SCREENSHOTS.md 的來源紀錄。

## 之後更新 extension

這個資料夾的 extension 是原專案 0.4.0 的完整副本。原專案更新後，需要把最新版 extension 同步到本 repo，檢查 manifest 版本、兩份教學文字與截圖是否仍符合實際畫面，再發布更新。

本 repo 沒有附上原站影像、帳密或使用者的練習紀錄。發布時不要加入瀏覽器設定檔、登入網址中的憑證參數、匯出的個人紀錄或外層開發資料。
