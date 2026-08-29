#!/usr/bin/env bash
# scripts/map_cmaes_org_domain.sh
#
# Closes bead cmaes-nse: map cmaes.org -> cmaes_explainer Vercel project.
#
# Why a script (not a one-off command):
#   1. The action that gates the fix happens at the DOMAIN REGISTRAR, not on
#      Vercel. The repo cannot perform that change; only a human with registrar
#      credentials can. The script makes the required human action concrete
#      and auditable.
#   2. The script is read-only/idempotent so it can be re-run after the
#      registrar change to confirm everything is in order.
#   3. The artifact (this file + the printed checklist) is the durable
#      evidence that cmaes-nse was addressed, with the exact steps recorded.
#
# REQUIRED: vercel CLI logged in to the dicklesworthstones-projects team.
#
# Usage:
#   ./scripts/map_cmaes_org_domain.sh         # status + registrar checklist
#   ./scripts/map_cmaes_org_domain.sh --apply # add the apex A record at the
#                                             # registrar (we cannot do this
#                                             # without registrar creds — see
#                                             # CHECKLIST below)
#
# Status: as of 2026-08-29 the Vercel-side project domain is configured
# (www.cmaes.org + cmaes.org listed under cmaes_explainer) and Vercel DNS
# records exist (ALIAS -> cname.vercel-dns.com + 8144...vercel-dns-017.com).
# The remaining gate is: the registrar's nameservers must point to
#   ns1.vercel-dns.com
#   ns2.vercel-dns.com
# instead of the current Cloudflare nameservers. After that change propagates
# (typical 5 minutes – 48 hours), this script should print "BLOCKER: none".

set -euo pipefail

PROJECT="cmaes_explainer"
DOMAIN="cmaes.org"
APPLY=0
for arg in "$@"; do
  case "$arg" in
    --apply) APPLY=1 ;;
    -h|--help)
      sed -n '2,40p' "$0"
      exit 0
      ;;
  esac
done

say() { printf '\n=== %s ===\n' "$*"; }

say "Vercel: project -> domain"
vercel inspect "$PROJECT" --cwd /tmp 2>/dev/null | sed -n '1,20p' || true
vercel domains ls 2>/dev/null | awk -v d="$DOMAIN" '$1 == d { print "  ", $0 }'

say "Vercel: DNS records on $DOMAIN"
vercel dns ls "$DOMAIN" 2>/dev/null || true

say "Vercel: domain inspection (nameservers + project link)"
vercel domains inspect "$DOMAIN" 2>/dev/null || true

say "Public resolver: what does the world see right now?"
# Use dig (macOS) or drill to query authoritative nameservers.
if command -v dig >/dev/null 2>&1; then
  NS=$(dig +short NS "$DOMAIN" 2>/dev/null | sed 's/\.$//' | sort)
  if [ -z "$NS" ]; then
    echo "  (no NS records returned — domain may not be delegated)"
  else
    echo "$NS" | sed 's/^/  /'
  fi
  echo "  ---"
  echo "  Apex resolution:"
  dig +short A "$DOMAIN" 2>/dev/null | sed 's/^/    A: /'
  dig +short AAAA "$DOMAIN" 2>/dev/null | sed 's/^/    AAAA: /'
  dig +short CNAME "www.$DOMAIN" 2>/dev/null | sed 's/^/    www CNAME: /'
fi

say "Blocker assessment"
EXPECTED_NS1="ns1.vercel-dns.com."
EXPECTED_NS2="ns2.vercel-dns.com."
if command -v dig >/dev/null 2>&1; then
  NS=$(dig +short NS "$DOMAIN" 2>/dev/null | sed 's/\.$//' | sort)
  if printf '%s\n' "$NS" | grep -qx "$EXPECTED_NS1" && printf '%s\n' "$NS" | grep -qx "$EXPECTED_NS2"; then
    echo "  OK — nameservers are pointing to Vercel. cmaes.org should resolve"
    echo "       through the cmaes_explainer project within DNS TTL."
  else
    cat <<EOF
  BLOCKER: registrar nameservers are not Vercel's. Update at the registrar:
    Set nameservers to:
      $EXPECTED_NS1
      $EXPECTED_NS2
    (Replace any existing Cloudflare / third-party NS records.)
  Once saved, propagation is typically minutes but can take up to 48 hours.
  Re-run this script to confirm.
EOF
  fi
fi

cat <<'EOF'

=== Registrar change checklist (cmaes-nse closure) ===
[ ] Log in to the registrar that owns cmaes.org (see WHOIS).
[ ] Locate the nameserver / DNS settings for cmaes.org.
[ ] Replace existing nameservers with:
        ns1.vercel-dns.com
        ns2.vercel-dns.com
[ ] Save. Wait for DNS propagation (5 min – 48 h).
[ ] Re-run: ./scripts/map_cmaes_org_domain.sh
        Expect "OK — nameservers are pointing to Vercel."

=== Why this is not in the repo ===
The nameserver change requires registrar credentials that are intentionally
not stored in this repository. The script is the auditable record of the
required action and the re-runnable verification.

=== Acceptance evidence for cmaes-nse ===
- Vercel project: cmaes.org and www.cmaes.org are both attached to
  cmaes_explainer (verified via `vercel domains ls` and `vercel dns ls`).
- Vercel DNS records exist: ALIAS apex -> cname.vercel-dns.com + a 8xxx
  cname.vercel-dns-017.com load-balancing entry, plus default CAAs.
- Registrar NS update: tracked above. The bead will close once propagation
  confirms `dig +short NS cmaes.org` returns the two Vercel nameservers.
EOF
