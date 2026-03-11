// ============================================================
//  SAFE STRING COMPARE (constant-time)
// ============================================================

const crypto = require('crypto');

function safeCompare(a, b) {
  const left = String(a || '');
  const right = String(b || '');

  const leftBuf = Buffer.from(left);
  const rightBuf = Buffer.from(right);
  const maxLen = Math.max(leftBuf.length, rightBuf.length);

  const leftPadded = Buffer.alloc(maxLen);
  const rightPadded = Buffer.alloc(maxLen);
  leftBuf.copy(leftPadded);
  rightBuf.copy(rightPadded);

  const same = crypto.timingSafeEqual(leftPadded, rightPadded);
  return same && leftBuf.length === rightBuf.length;
}

module.exports = {
  safeCompare,
};
