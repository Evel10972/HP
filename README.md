# STROKE ポートフォリオデモ

[さいとうなおき公式サイト](https://saito-naoki.com/)の**動きと構成**を参考にした、独立したデモです。画像・文章・ブランドはオリジナルです。

## どこで作るか

このフォルダを VS Code などのエディタで開いて編集します。必要なのはブラウザーだけです。依存パッケージやビルドは不要です。

## ローカルで見る

PowerShell でこのフォルダに移動し、次を実行してください。

```powershell
node server.mjs
```

ブラウザーで `http://localhost:8000/` を開きます。Node.js がない場合は Python の `python -m http.server 8000` や VS Code の Live Server 等でも動きます。

## 変更する場所

- `index.html`：文章、リンク、セクション、画像の代替テキスト
- `style.css`：色、文字、余白、レスポンシブ表示、演出の見た目
- `script.js`：メニュー、背景画像の横スクロール、スクロール連動のカード切り替え
- `assets/`：背景に使う画像。対応形式は PNG、JPEG、WebP、GIF、AVIF です。`node server.mjs` では追加した画像が次の読み込みから自動で背景のローテーションに加わります
- `assets-list.js`：HTMLを直接開く場合や静的ホスティングで使う画像一覧。画像の追加・削除後は `node update-assets-list.mjs` で更新します
- `assets/thumbs/`：背景表示用の縮小画像。新しい画像を追加した後は、Pillow が使える Python で `python prepare-thumbnails.py` を実行すると生成できます。縮小画像がない場合は元画像を表示します
- `script.js` の `illustrationFiles`：Illustration で紹介する5枚のファイル名を配列で指定します。空の間は名前順の先頭5枚を仮表示します

ギャラリーは `gallery-section` の高さがスクロール演出の長さ、`script.js` の `progress` が進行度です。最初は「紹介」と書いた表紙が閉じており、めくると1枚目の作品が現れます。その後も右ページをめくって次の作品を表示し、前の作品は裏面に表示しません。

## 公開する場所

画像一覧は `server.mjs` の `/api/assets` から取得します。HTMLを直接開く場合や GitHub Pages などの静的ホスティングでは `assets-list.js` を使用します。公開前に `node update-assets-list.mjs` を実行してください。実際の問い合わせ先に合わせて `mailto:hello@example.com` を変更してください。

## メモ

- 画像はこのデモ用に生成したオリジナル素材です。
- `prefers-reduced-motion` を尊重し、動きを減らす設定では不要なアニメーションを停止します。
- JavaScript が無効でも文章と画像は読めますが、カードのスクロール演出とメニュー開閉には JavaScript が必要です。
