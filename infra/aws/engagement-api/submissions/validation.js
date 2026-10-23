const TYPES = { idea: "ネタ投稿", feedback: "サイトに対する意見", business: "業務委託等" };

/** 投稿データを検証し、保存する項目のみを返す。 */
function validate(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("入力内容が不正です。");
  const limits = { radioName: 80, name: 100, email: 254, content: 2000, captchaToken: 8192, website: 200 };
  const result = {};
  for (const [key, limit] of Object.entries(limits)) {
    const value = body[key] ?? "";
    if (typeof value !== "string" || Array.from(value).length > limit || /\u0000/.test(value)) throw new Error("入力内容または文字数を確認してください。");
    result[key] = value.trim();
  }
  if (!Object.hasOwn(TYPES, body.type)) throw new Error("投稿の種類を選択してください。");
  if (Array.from(result.content).length < 20) throw new Error("内容は20文字以上2000文字以内で入力してください。");
  if (body.type === "idea" && !result.radioName) throw new Error("ラジオネームを入力してください。");
  if (!result.email) throw new Error("メールアドレスを入力してください。");
  if (body.type !== "idea" && !result.name) throw new Error("氏名を入力してください。");
  if (body.type === "idea") result.name = "";
  else result.radioName = "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email) || /[\r\n]/.test(result.email)) throw new Error("メールアドレスを確認してください。");
  if (!result.captchaToken || result.website) throw new Error("スパム対策の認証をやり直してください。");
  return { ...result, type: body.type };
}
module.exports = { validate, TYPES };
