══════════════════════════════════════════════════════════════════
 SAFEGUARD ANCHORS — 英文版官網 (PWA)
 Safeguard Anchors — English Website (Progressive Web App)
 建置日期 Built: 2026-08-10
══════════════════════════════════════════════════════════════════

■ 快速預覽 | Quick preview
  直接雙擊 index.html 即可在瀏覽器完整瀏覽（所有頁面、動畫、RWD 都可用）。
  Double-click index.html to browse the full site (all pages, animations, responsive).

  ※ PWA 功能（安裝到主畫面、離線瀏覽）需要透過 HTTP 伺服器或正式上線後才會啟用：
  ※ PWA features (install to home screen, offline) activate only over HTTP/HTTPS:
     方法 A：資料夾內開終端機執行  python -m http.server 8080  → 開 http://localhost:8080
     方法 B：VS Code 安裝 Live Server 擴充功能，右鍵 index.html → Open with Live Server
     方法 C：部署到任何靜態主機（Netlify / Vercel / GitHub Pages / Cloudflare Pages），
             需要 HTTPS 才能完整啟用安裝與離線功能。

■ 架構 | Structure
  index.html                 網站外殼（單頁應用 SPA，hash 路由）
  manifest.webmanifest       PWA 設定（名稱、圖示、主題色 #0233A0）
  sw.js                      Service Worker（離線快取；改版時請把 VERSION 改成 sa-v2、v3…）
  assets/css/app.css         全站樣式（品牌色、動畫、RWD 斷點 560/920/1080px）
  assets/js/data.js          ★ 全部網站內容都在這裡（產品、分類、文案）— 改內容改這檔
  assets/js/app.js           路由與互動（動畫、篩選、搜尋、表單、手機選單）
  assets/img/                圖片（products / categories / coming-soon / site / icons）

■ 頁面 | Pages (hash routes)
  #/                    首頁（動態 Hero、統計數字、4 分類、ETA 專區、Coming Soon）
  #/products            全部產品（分類篩選 + 即時搜尋）
  #/category/{slug}     4 個分類頁
  #/product/{slug}      16 個產品頁（圖庫、優勢、應用、材質、型號規格表、安裝圖）
  #/eta                 ETA 認證專區（含 Opt.1 / Opt.7 說明）
  #/coming-soon         即將上市（4 個未上架產品線）
  #/downloads           下載中心
  #/about  #/contact    關於我們、聯絡我們

■ 上線前必改 | Replace before launch
  1. 聯絡 Email／電話目前是佔位文字（sales@safeguard-anchors.example / +886-2-XXXX-XXXX）
     → 搜尋替換 index.html 與 assets/js/app.js 兩處。
  2. 聯絡表單目前是展示用（不會真的寄信）→ 接上你的郵件服務（如 Formspree、EmailJS）
     或後端 API：位置在 app.js 的 cForm submit。
  3. 下載中心的型錄 PDF 目前連到原站網址 → 換成自家檔案。
  4. 地址沿用台北大安區辦公室，如需修改請搜尋 "Xinsheng"。

■ 設計規格 | Design tokens
  深藍 Navy   #0233A0（主色，取自 Logo）   深藍加深 #071B4D
  紅   Red    #D80710（強調色，取自 Logo）
  灰   Gray   #F4F5F7 背景 / #5C626E 次要文字 / #E4E6EA 邊線
  動態：捲動浮現、數字滾動、卡片懸浮、頁面轉場、手機抽屜選單；
        皆支援 prefers-reduced-motion（使用者關閉動畫時自動停用）。

■ 內容來源 | Content source
  產品資料與照片整理自 construction-anchors.com（2026-08-10 抓取），
  已重新命名、壓縮並依 Safeguard Anchors 品牌重新設計版面。
══════════════════════════════════════════════════════════════════
