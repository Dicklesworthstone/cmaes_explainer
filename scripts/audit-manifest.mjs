// Audit manifest for the W2 six-lens pass. Smoke coverage is insufficient —
// vision-qa --smoke only hits the default page; production has /, /arm,
// /humanoid, /receipts (the four user-facing routes), and the smoke failure
// on / may not be the only site of problems. The manifest gives the audit
// reproducible per-route coverage and produces one evidence dir per route.
export default [
  { name: "home", path: "/" },
  { name: "humanoid", path: "/humanoid" },
  { name: "arm", path: "/arm" },
  { name: "receipts", path: "/receipts" },
];
