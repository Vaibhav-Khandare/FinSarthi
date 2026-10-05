import httpx
import json

base = "http://127.0.0.1:8000"

r = httpx.get(f"{base}/api/health")
print("HEALTH:", r.status_code, r.json())

r = httpx.get(f"{base}/api/demo")
demo = r.json()
print("DEMO profile:", demo["demo_profile"]["full_name"])

r = httpx.get(f"{base}/api/schemes")
print("SCHEMES:", r.json()["count"])

profile = demo["demo_profile"]
r = httpx.post(f"{base}/api/analyze", json={"profile": profile, "document_ids": []}, timeout=30)
data = r.json()
print("ANALYZE status:", r.status_code)
print("Summary:", data["summary"])
for res in data["results"]:
    ev = res["evaluation"]
    print(f"  {res['scheme_name']}: {ev['status']} (match {ev['match_score']}%)")

# Chat test
if data["results"]:
    scheme_id = data["results"][0]["scheme_id"]
    r = httpx.post(f"{base}/api/schemes/{scheme_id}/chat", json={
        "question": "Why am I eligible?",
        "profile": profile,
    })
    print("CHAT:", r.json()["answer"][:100])

print("\nAll tests passed!")
