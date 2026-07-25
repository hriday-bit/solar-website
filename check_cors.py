import urllib.request

req = urllib.request.Request("https://solar-website-9ik0.onrender.com/api/products", method="OPTIONS")
req.add_header("Origin", "https://solar-website-api-server.vercel.app")
req.add_header("Access-Control-Request-Method", "GET")

try:
    with urllib.request.urlopen(req) as response:
        print("Status:", response.status)
        print("Headers:", response.headers)
except Exception as e:
    print("Error:", e)
