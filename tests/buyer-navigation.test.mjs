import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/routes.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { routes, safeBuyerReturnTo, buyerLoginHref } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

test("address navigation stays within the single buyer profile page", () => {
  assert.equal(routes.buyer.addresses, `${routes.buyer.profile}#addresses`);
  assert.equal(safeBuyerReturnTo(routes.buyer.addresses), "/buyer/profile#addresses");
});

const authSource = ts.createSourceFile("auth-api.ts", readFileSync(new URL("../src/features/buyer/auth/auth-api.ts", import.meta.url), "utf8"), ts.ScriptTarget.Latest, true);
const nameFunction = authSource.statements.find((statement) => ts.isFunctionDeclaration(statement) && statement.name?.text === "buyerDisplayName");
assert.ok(nameFunction);
const nameCode = ts.transpileModule(ts.createPrinter().printNode(ts.EmitHint.Unspecified, nameFunction, authSource), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { buyerDisplayName } = await import(`data:text/javascript;base64,${Buffer.from(nameCode).toString("base64")}`);

test("buyer name uses profile name, email username, then Buyer, never phone", () => {
  assert.equal(buyerDisplayName({ name: " Logu ", email: "contact@example.com", phone: "+919876543210", recipientName: "Address Recipient" }), "Logu");
  assert.equal(buyerDisplayName({ name: " ", email: "contact@example.com", phone: "+919876543210" }), "contact");
  assert.equal(buyerDisplayName({ phone: "+919876543210" }), "Buyer");
  assert.equal(buyerDisplayName({}), "Buyer");
});

test("login defaults to home", () => {
  assert.equal(safeBuyerReturnTo(null), "/");
  assert.equal(safeBuyerReturnTo(""), "/");
});
test("preserves internal buyer destinations", () => {
  for (const path of ["/buyer/bag", "/buyer/addresses", "/buyer/profile", "/buyer/products/tee?size=M#details"]) assert.equal(safeBuyerReturnTo(path), path);
  assert.equal(buyerLoginHref("/buyer/bag"), "/buyer/login?returnTo=%2Fbuyer%2Fbag");
});
test("rejects external, malformed, privileged and login destinations", () => {
  for (const path of ["https://evil.test", "//evil.test", "/\\evil.test", "/%5cevil.test", "/%2fevil.test", "/buyer/login", "/admin", "/api/auth/logout", "/buyer/../admin", "/%61dmin", "/bad%", "/\nevil"]) assert.equal(safeBuyerReturnTo(path), "/", path);
});
