# ADR-0007: OpenAI-compatible adaptör ve güven profilleri

## Durum

Kabul edildi — 2026-09-14.

## Bağlam

OpenAI API ve LM Studio aynı Chat Completions ile Models HTTP biçimini sunar. İki ayrı adaptör protokol ayrıştırmasını çoğaltır; tek bir serbest endpoint profili ise bulut anahtarının kullanıcı tanımlı bir sunucuya gönderilmesi ve yerel profilin uzak ağa çıkması riskini doğurur.

Model keşfi yardımcı bir kullanıcı deneyimidir. Yerel sunucunun kapalı ya da yavaş olması, kullanıcının bağlantı profilini kaydetmesini engellememelidir. OpenAI'de yeni model kimlikleri fiyat kataloğundan önce yayınlanabileceği için serbest model alanı korunmalıdır.

## Karar

- `openai` ve `lmstudio` ayrı provider değerleridir; ikisi Python'daki tek `OpenAIProvider` sınıfını kullanır.
- OpenAI profili sabit `https://api.openai.com/v1` endpoint'ine gider ve Rust OS kasasından istek bazında enjekte edilen API anahtarını zorunlu tutar.
- LM Studio anahtarsız çalışır. Endpoint yalnız düz HTTP loopback host, isteğe bağlı port ve `/v1` yolundan oluşabilir. Kullanıcı bilgisi, sorgu, fragment, uzak IP ve başka yollar reddedilir.
- `/v1/models` keşfi üç saniyede sınırlandırılır. Hata yalnız keşif sonucunu etkiler; bağlantı oluşturma ve elle model kimliği girme çalışmaya devam eder.
- Chat akışı sınırlı SSE çerçevelerini, kullanım verisini, bitiş nedenini ve `[DONE]` sentinel'ini doğrular. Ağ/timeout/429/5xx geçici; kimlik doğrulama ve geçersiz protokol kalıcı hata sınıfına girer.
- OpenAI fiyat kataloğu gpt-4o, gpt-4o-mini, o3 ve o4-mini için statiktir. Bilinmeyen OpenAI modelinin bilinen maliyeti sıfır kaydedilir, fakat run kaydı ve UI sağlayıcı faturası doğabileceğini açıkça bildirir. Anthropic/Gemini'nin mevcut kapalı fiyat davranışı korunur; LM Studio yerel ve sıfır API maliyetlidir.

## Sonuçlar

Protokol kodu tek yerde kalırken kimlik doğrulama ve ağ güven sınırları provider profilinde açıkça ayrılır. Yeni OpenAI-compatible servis ancak ayrı bir provider değeri ve doğrulama profili eklenerek desteklenebilir. Kullanıcı model keşfine bağımlı değildir. Bilinmeyen OpenAI fiyatında bütçe üst sınırı garanti vermez; kalıcı ve görünür uyarı bu sınırlamayı denetlenebilir kılar.
