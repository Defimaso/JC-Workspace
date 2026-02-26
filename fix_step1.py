fp = r"C:UsersmotokDesktopJCMasoLabsrcpagesIndex.tsx"
with open(fp, "r", encoding="utf-8") as f:
    c = f.read()
orig = len(c)
res = []

def rep(content, old, new_val, label):
    if old in content:
        res.append("  OK: " + label)
        return content.replace(old, new_val, 1)
    res.append("  MISS: " + label)
    return content

# 1 remove top-level PORTFOLIO_TIERS
i = c.find("const PORTFOLIO_TIERS = [")
if i >= 0:
    NL = chr(10)
    j = c.find("]" + NL + NL, i)
    if j >= 0:
        c = c[:i] + c[j+3:]
        res.append("  OK: 1. Remove top-level PORTFOLIO_TIERS")
    else:
        res.append("  MISS: 1. closing not found")
else:
    res.append("  MISS: 1. start not found")

for r in res: print(r)
print("Len: %d -> %d" % (orig, len(c)))

with open(fp, "w", encoding="utf-8") as f:
    f.write(c)
print("STEP1 done")