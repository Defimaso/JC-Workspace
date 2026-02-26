
import re

filepath = r"C:\Users\motok\Desktop\JC\MasoLab\src\pages\Index.tsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

original_len = len(content)
replacements_done = 0

def do_replace(content, old, new, label):
    global replacements_done
    if old in content:
        content = content.replace(old, new, 1)
        replacements_done += 1
        print(f"  OK: {label}")
    else:
        print(f"  MISS: {label}")
    return content

# 1. Remove PORTFOLIO_TIERS from top-level
old_tiers = """const PORTFOLIO_TIERS = [
  {
    icon: Landmark,
    name: \'Banca a Dubai\',
    provider: \'Wio Bank\',
    allocation: \'Grosso del capitale\',
    target: \'~0.5% / mese\',
    risk: \'Basso\',
    riskColor: \'text-dm-accent\',
    riskBg: \'bg-dm-accent/20\',
    borderColor: \'border-dm-accent/30\',
    accentColor: \'text-dm-accent\',
    glowClass: \'border-glow-accent\',
    description: \'La base di tutto. Prima di qualsiasi sfida, il capitale deve essere al sicuro. Rendimento stabile e prevedibile.\',
  },
  {
    icon: LineChart,
    name: \'ETF Classici\',
    provider: \'Trading 212\',
    allocation: \'Quota media\',
    target: \'~1.5% / mese\',
    risk: \'Medio\',
    riskColor: \'text-dm-purple\',
    riskBg: \'bg-dm-purple/20\',
    borderColor: \'border-dm-purple/30\',
    accentColor: \'text-dm-purple\',
    glowClass: \'border-glow-purple\',
    description: \'Il secondo livello. Crescita costante, rischio contenuto. La base su cui costruire tutto il resto.\',
  },
  {
    icon: Zap,
    name: \'Social Trading Ecosistemi\',
    provider: \'Ecosistemi diversificati\',
    allocation: \'5% del portafoglio\',
    target: \'~5% / mese\',
    risk: \'Alto\',
    riskColor: \'text-dm-green\',
    riskBg: \'bg-dm-green/20\',
    borderColor: \'border-dm-green/30\',
    accentColor: \'text-dm-green\',
    glowClass: \'border-glow-green\',
    description: \'La parte ad alto rendimento. Non un singolo prodotto, ma ecosistemi: panieri di strategie che si diversificano su 4 assi — operatività, rischio, coppie e durata. Quando una strategia soffre, le altre compensano.\',
  },
]

"""
content = do_replace(content, old_tiers, "", "1. Remove top-level PORTFOLIO_TIERS")

print(f"Length after step 1: {len(content)} (was {original_len})")

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print(f"File saved. {replacements_done} replacements done in step 1.")
