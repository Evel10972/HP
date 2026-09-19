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
- `script.js`：メニュー、出現アニメーション、スクロール連動のカード切り替え
- `assets/`：ヒーローと作品画像。自分の作品に差し替えてください

特にギャラリーは `gallery-section` の高さがスクロール演出の長さ、`script.js` の `progress` が進行度です。各カードは `translate3d`・`rotate`・`scale` で重なって切り替わります。

## 公開する場所

静的サイトなので GitHub Pages、Cloudflare Pages、Netlify などにフォルダの内容をそのまま公開できます。独自ドメインを使う場合は公開先でドメインを接続します。実際の問い合わせ先に合わせて `mailto:hello@example.com` を変更してください。

## メモ

- 画像はこのデモ用に生成したオリジナル素材です。
- `prefers-reduced-motion` を尊重し、動きを減らす設定では不要なアニメーションを停止します。
- JavaScript が無効でも文章と画像は読めますが、カードのスクロール演出とメニュー開閉には JavaScript が必要です。
