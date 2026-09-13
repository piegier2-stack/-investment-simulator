const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizeNumber, validatePositiveInteger, calculatePrincipal, formatYen } = require("./app");

test("3桁区切りを含む積立額から元本を計算する", () => {
  assert.equal(calculatePrincipal("30,000", "20"), 7_200_000);
});

test("円表示を3桁区切りにする", () => {
  assert.equal(formatYen(7_200_000), "7,200,000円");
});

test("半角・全角カンマと空白を除去する", () => {
  assert.equal(normalizeNumber(" 1，000,000 "), "1000000");
});

test("未入力と不正値にわかりやすいエラーを返す", () => {
  assert.equal(validatePositiveInteger("", "積立年数"), "積立年数を入力してください。");
  assert.equal(validatePositiveInteger("0", "積立年数"), "積立年数は1以上の整数で入力してください。");
  assert.equal(validatePositiveInteger("1.5", "積立年数"), "積立年数は1以上の整数で入力してください。");
});

test("安全に扱えない計算結果を拒否する", () => {
  assert.throws(() => calculatePrincipal(Number.MAX_SAFE_INTEGER, 2), RangeError);
});
