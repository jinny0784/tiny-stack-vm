import { readdirSync as rd, readFileSync as rf, mkdirSync as mk, writeFileSync as wf } from "node:fs";
function vm(P, I) {
  const M = new Int32Array(256), S = new Int32Array(256), C = new Int32Array(64), O = Buffer.alloc(65536);
  let sp = 0, cp = 0, pc = 0, st = 0, ol = 0, ip = 0, ex = 0;
  const L = P.length;
  run: while (1) {
    if (st >= 1e6) { ex = 10; break; }
    if (pc < 0 || pc >= L) { ex = 9; break; }
    switch (P[pc]) {
      case 0x00: ex = 0; break run;
      case 0x01:
        if (pc + 2 > L) { ex = 9; break run; }
        if (sp > 255) { ex = 3; break run; }
        S[sp++] = (P[pc + 1] << 24) >> 24; pc += 2; break;
      case 0x02:
        if (pc + 5 > L) { ex = 9; break run; }
        if (sp > 255) { ex = 3; break run; }
        S[sp++] = P[pc + 1] | P[pc + 2] << 8 | P[pc + 3] << 16 | P[pc + 4] << 24; pc += 5; break;
      case 0x03: if (sp < 1) { ex = 2; break run; } sp--; pc++; break;
      case 0x04:
        if (sp < 1) { ex = 2; break run; }
        if (sp > 255) { ex = 3; break run; }
        S[sp] = S[sp - 1]; sp++; pc++; break;
      case 0x05:
        if (sp < 2) { ex = 2; break run; }
        { const t = S[sp - 1]; S[sp - 1] = S[sp - 2]; S[sp - 2] = t; }
        pc++; break;
      case 0x06:
        if (sp < 2) { ex = 2; break run; }
        if (sp > 255) { ex = 3; break run; }
        S[sp] = S[sp - 2]; sp++; pc++; break;
      case 0x07:
        if (sp < 3) { ex = 2; break run; }
        { const a = S[sp - 3]; S[sp - 3] = S[sp - 2]; S[sp - 2] = S[sp - 1]; S[sp - 1] = a; }
        pc++; break;
      case 0x10:
        if (sp < 2) { ex = 2; break run; }
        S[sp - 2] = (S[sp - 2] + S[sp - 1]) | 0; sp--; pc++; break;
      case 0x11:
        if (sp < 2) { ex = 2; break run; }
        S[sp - 2] = (S[sp - 2] - S[sp - 1]) | 0; sp--; pc++; break;
      case 0x12:
        if (sp < 2) { ex = 2; break run; }
        S[sp - 2] = Math.imul(S[sp - 2], S[sp - 1]); sp--; pc++; break;
      case 0x13:
        if (sp < 2) { ex = 2; break run; }
        if (!S[sp - 1]) { ex = 4; break run; }
        S[sp - 2] = (S[sp - 2] / S[sp - 1]) | 0; sp--; pc++; break;
      case 0x14:
        if (sp < 2) { ex = 2; break run; }
        if (!S[sp - 1]) { ex = 4; break run; }
        S[sp - 2] %= S[sp - 1]; sp--; pc++; break;
      case 0x15:
        if (sp < 2) { ex = 2; break run; }
        if (!S[sp - 1]) { ex = 4; break run; }
        S[sp - 2] = ((S[sp - 2] >>> 0) / (S[sp - 1] >>> 0)) | 0; sp--; pc++; break;
      case 0x16:
        if (sp < 2) { ex = 2; break run; }
        if (!S[sp - 1]) { ex = 4; break run; }
        S[sp - 2] = ((S[sp - 2] >>> 0) % (S[sp - 1] >>> 0)) | 0; sp--; pc++; break;
      case 0x17:
        if (sp < 1) { ex = 2; break run; }
        S[sp - 1] = (-S[sp - 1]) | 0; pc++; break;
      case 0x18:
        if (sp < 2) { ex = 2; break run; }
        S[sp - 2] &= S[sp - 1]; sp--; pc++; break;
      case 0x19:
        if (sp < 2) { ex = 2; break run; }
        S[sp - 2] |= S[sp - 1]; sp--; pc++; break;
      case 0x1a:
        if (sp < 2) { ex = 2; break run; }
        S[sp - 2] ^= S[sp - 1]; sp--; pc++; break;
      case 0x1b:
        if (sp < 1) { ex = 2; break run; }
        S[sp - 1] = ~S[sp - 1]; pc++; break;
      case 0x1c:
        if (sp < 2) { ex = 2; break run; }
        S[sp - 2] <<= S[sp - 1]; sp--; pc++; break;
      case 0x1d:
        if (sp < 2) { ex = 2; break run; }
        S[sp - 2] >>= S[sp - 1]; sp--; pc++; break;
      case 0x1e:
        if (sp < 2) { ex = 2; break run; }
        S[sp - 2] = (S[sp - 2] >>> S[sp - 1]) | 0; sp--; pc++; break;
      case 0x20:
        if (sp < 2) { ex = 2; break run; }
        S[sp - 2] = S[sp - 2] === S[sp - 1] ? 1 : 0; sp--; pc++; break;
      case 0x21:
        if (sp < 2) { ex = 2; break run; }
        S[sp - 2] = S[sp - 2] < S[sp - 1] ? 1 : 0; sp--; pc++; break;
      case 0x22:
        if (sp < 2) { ex = 2; break run; }
        S[sp - 2] = (S[sp - 2] >>> 0) < (S[sp - 1] >>> 0) ? 1 : 0; sp--; pc++; break;
      case 0x30:
        if (pc + 3 > L) { ex = 9; break run; }
        pc = pc + 3 + (((P[pc + 1] | P[pc + 2] << 8) << 16) >> 16); break;
      case 0x31:
        if (pc + 3 > L) { ex = 9; break run; }
        if (sp < 1) { ex = 2; break run; }
        { const v = S[--sp], j = ((P[pc + 1] | P[pc + 2] << 8) << 16) >> 16; pc = v === 0 ? pc + 3 + j : pc + 3; }
        break;
      case 0x32:
        if (pc + 3 > L) { ex = 9; break run; }
        if (sp < 1) { ex = 2; break run; }
        { const v = S[--sp], j = ((P[pc + 1] | P[pc + 2] << 8) << 16) >> 16; pc = v !== 0 ? pc + 3 + j : pc + 3; }
        break;
      case 0x33:
        if (pc + 3 > L) { ex = 9; break run; }
        if (cp > 63) { ex = 7; break run; }
        C[cp++] = pc + 3; pc = P[pc + 1] | P[pc + 2] << 8; break;
      case 0x34: if (cp < 1) { ex = 8; break run; } pc = C[--cp]; break;
      case 0x40:
        if (sp < 1) { ex = 2; break run; }
        { const a = S[sp - 1]; if (a < 0 || a > 255) { ex = 6; break run; } S[sp - 1] = M[a]; }
        pc++; break;
      case 0x41:
        if (sp < 2) { ex = 2; break run; }
        { const a = S[sp - 1]; if (a < 0 || a > 255) { ex = 6; break run; } M[a] = S[sp - 2]; sp -= 2; }
        pc++; break;
      case 0x50:
        if (sp < 1) { ex = 2; break run; }
        { const s = String(S[--sp]); if (ol + s.length > 65536) { ex = 11; break run; } ol += O.write(s, ol); }
        pc++; break;
      case 0x51:
        if (sp < 1) { ex = 2; break run; }
        if (ol + 1 > 65536) { ex = 11; break run; }
        O[ol++] = S[--sp] & 255; pc++; break;
      case 0x52:
        if (sp > 255) { ex = 3; break run; }
        S[sp++] = ip < I.length ? I[ip++] : -1; pc++; break;
      case 0x53: if (sp < 1) { ex = 2; break run; } ex = S[--sp] & 255; break run;
      default: ex = 5; break run;
    }
    st++;
  }
  return [O.subarray(0, ol), ex];
}
for (const id of rd("/input").sort()) {
  const P = rf("/input/" + id + "/program.bin");
  let I = Buffer.alloc(0);
  try { I = rf("/input/" + id + "/input.bin"); } catch {}
  const [o, e] = vm(P, I);
  mk("/output/" + id, { recursive: true });
  wf("/output/" + id + "/stdout.bin", o);
  wf("/output/" + id + "/exit.txt", e + "\n");
}
