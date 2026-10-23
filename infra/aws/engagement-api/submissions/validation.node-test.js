const { test } = require("node:test");
const assert = require("node:assert/strict");
const { validate } = require("./validation");
const valid = { type: "idea", radioName: "読者", email: "reader@example.com", content: "提案", captchaToken: "token" };
test("投稿種別に応じた名前のみ必須として保存する", () => {
  assert.equal(validate(valid).name, "");
  assert.equal(validate({ ...valid, name: "入力不要" }).name, "");
  assert.throws(() => validate({ ...valid, radioName: "" }), /ラジオネーム/);
  for (const type of ["feedback", "business"]) {
    assert.throws(() => validate({ ...valid, type }), /氏名/);
    const result = validate({ ...valid, type, radioName: "", name: "担当者" });
    assert.equal(result.name, "担当者");
    assert.equal(result.radioName, "");
    assert.equal(validate({ ...valid, type, name: "担当者" }).radioName, "");
  }
});
test("全種類でメールアドレスは必須となる", () => {
  for (const type of ["idea", "feedback", "business"]) assert.throws(() => validate({ ...valid, type, name: "担当者", email: " " }), /メールアドレス/);
});
test("日本語と絵文字を同じ文字数規則で検証する", () => {
  assert.equal(Array.from(validate({ ...valid, content: "🌻".repeat(2000) }).content).length, 2000);
  assert.throws(() => validate({ ...valid, content: "🌻".repeat(2001) }));
});
test("必須項目、種類、型、メール改行、ハニーポットを拒否する", () => {
  for (const change of [{ radioName: " " }, { content: " " }, { type: "__proto__" }, { name: {} }, { email: "a@b.com\nBcc:x@y.com" }, { website: "spam" }, { captchaToken: "" }]) assert.throws(() => validate({ ...valid, ...change }));
});
