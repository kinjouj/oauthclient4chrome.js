oauthclient.js
-----------------


Chrome Extension上にてOAuth APIを使うoauth.jsのユーティリティライブラリ


---
**依存性**


jquery.js
underscore.js
sha1.js
oauth.js


(拡張機能で動かす際にも必要だがその際はディレクトリはどこでも良い)

  - test/resディレクトリ内にmocha.js/mocha.css/chai.jsが必要

---
**Grunt tasks**


  - test テストを実行
  - coverage コードカバレッジを出力
  - jscoverage jscoverageを実行
  - yuidoc yuidocなドキュメントを生成
