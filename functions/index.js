const URL_INDONESIA = "https://www.youtube.com/";

const URL_LUAR = [
  "https://www.instagram.com/",
  "https://www.facebook.com/"
];

export async function onRequest({ request }) {
  // Redirect hanya untuk permintaan halaman GET/HEAD.
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: {
        "Allow": "GET, HEAD",
        "Cache-Control": "no-store"
      }
    });
  }

  // Cloudflare menyediakan kode negara berdasarkan IP yang terdeteksi.
  const country = request.cf?.country;

  let destination;

  // Indonesia selalu diproses lebih dahulu; tidak masuk random.
  if (country === "ID") {
    destination = URL_INDONESIA;
  } else {
    // Terima hanya kode negara dua huruf kapital yang valid secara format.
    // Nilai kosong, tidak tersedia, atau XX dianggap tidak diketahui.
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

    // Untuk negara terdeteksi selain Indonesia: peluang 50:50 per permintaan.
    const randomByte = new Uint8Array(1);
    crypto.getRandomValues(randomByte);
    destination = URL_LUAR[randomByte[0] & 1];
  }

  // Redirect sementara HTTP 302; tidak bergantung pada JavaScript browser.
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
