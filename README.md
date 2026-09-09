# ZeroCost

Yerel AI orkestrasyon ve kontrollü çoklu ajan masaüstü uygulaması. Tauri 2 + React/TypeScript arayüzü, Python 3.12 sidecar, LangGraph ve SQLite kayıt katmanı içerir.

## Kurulum ve çalıştırma

Node.js 22.12+ (Vite gereksinimi), Rust stable, Python 3.12+ ve platformun Tauri geliştirme bağımlılıkları gerekir. macOS üzerinde Xcode komut satırı araçları gereklidir.

```sh
npm ci
python3 -m venv .venv
.venv/bin/python -m pip install -e './backend[dev]'
npm run schema:generate
npm run desktop
```

Windows'ta Python komutu `.venv\Scripts\python.exe` olur. Node yardımcı betikleri doğru platform yolunu seçer. Masaüstü betiği varsayılan `~/.cargo/bin` dizinini kendi sürecinin PATH'ine ekler; shell ayarlarını değiştirmez.

`npm run dev` yalnızca tarayıcı önizlemesini açar. Tarayıcıda kayıt işlemleri bilinçli olarak kapalıdır; sahte backend veya localStorage yedeği yoktur.

## Bu sürümde çalışanlar

- Masaüstü kontrol paneli; bağlantı, ajan ve çalışma alanı formları.
- Aynı sağlayıcı için bağımsız model bağlantı profilleri.
- Ajanın bağlantıyla ilişkilendirilmesi; rol ve talimat kaydı.
- Mevcut klasörlerin mutlak ve çözümlenmiş yollarla kaydı.
- SQLite foreign key ve unique kısıtları, WAL, transaction ve sürümlü başlangıç şeması.
- React → Tauri IPC → Rust → Python JSON-lines → SQLite uçtan uca akışı.
- Pydantic'ten otomatik TypeScript ve CSP uyumlu, önceden derlenmiş JSON yanıt doğrulayıcısı.
- İstek/yanıt kimliği, protokol sürümü, çerçeve boyutu sınırı, 10 saniye timeout ve kapanışta sidecar temizliği.
- Python çalışma ortamını içeren PyInstaller sidecar paketleme betiği.
- Ollama model keşfi; yalnızca metin üretebilen kurulu modellerin gösterilmesi.
- Sıralı ve çalışma zamanı doğrulamalı akış olaylarıyla yerel sohbet, iptal ve kalıcı geçmiş.
- LangGraph tabanlı 2–4 ajan tartışması, 1–3 tur karşı görüş ve koordinatör sentezi.
- Ajan/aşama kimlikli canlı görev olayları, SQLite görev geçmişi ve LangGraph SQLite checkpoint'leri.
- Ajan bazında `workspace.read` izni; sınırlandırılmış klasör listeleme ve UTF-8 metin okuma araçları.
- Kullanıcının seçtiği en fazla 10 çalışma alanı dosyasını çoklu ajan bağlamına ekleme.

Claude ve Gemini akışlı sohbet adaptörleri ve Rust yönetiminde OS anahtar kasası eklendi. Faz 2'nin çoklu ajan, otomatik router, yürütme bütçesi ve kullanıcı onaylı salt okunur çalışma alanı dilimi çalışır. Yazma, terminal ve vektör RAG henüz uygulanmadı; bu sürüm üretime hazır değildir.

## Bulut bağlantısı ve anahtar kasası

1. Model bağlantıları ekranında Anthropic veya Gemini profili oluşturun; hesabınızın erişebildiği model kimliğini yazın.
2. Profilin **API anahtarı** düğmesinden anahtarı OS kasasına kaydedin. Aynı sağlayıcının farklı hesapları için ayrı profiller oluşturun.
3. Ajanlar ekranından bu bağlantıya bağlı bir ajan oluşturun; Sohbet ekranında ajanı seçin.

Anahtarlar SQLite'a yazılmaz. Rust `keyring` 3.6.3 ile macOS Keychain, Windows Credential Manager veya Linux Secret Service kullanır. Linux'ta çalışan ve kilidi açık bir Secret Service gerekir; düz metin yedeği yoktur. Arayüz sadece anahtarın varlığını öğrenir; kayıtlı anahtarı geri okuyamaz. Kaydetme, API erişiminin doğrulandığı anlamına gelmez. Silme/değiştirme sonraki istekleri etkiler; devam eden isteği durdurmak için **Durdur** kullanın.

Rust ajanın bağlantısını Python'daki kayıt üzerinden çözer ve yalnız ilgili `chat.start` isteğine özel `_auth` alanını ekler. React bu alanı gönderemez. Python bağlantı kimliğini tekrar kontrol eder; anahtar `SecretStr` ile ilgili üretim görevine verilir. SDK istemcileri istek bazında oluşturulur, anahtar ortam değişkenlerinden alınmaz, SDK hata ayrıntıları kullanıcıya/loglara taşınmaz. Python/Rust yönetilen bellek kopyaları için kriptografik sıfırlama garantisi verilmez.

Claude sistem talimatları mesaj listesinden ayrılır. Gemini'nin dört ayarlanabilir güvenlik kategorisi `BLOCK_NONE` olarak gönderilir; sağlayıcının değiştirilemeyen korumaları devam eder. Kesilen, engellenen veya token sınırına ulaşan yanıtlar kısmi içerikle başarısız olarak kaydedilir. Bulut ajanlarında mesaj, sohbet bağlamı ve çoklu ajan görevinde kullanıcı tarafından seçilen dosya içeriği ilgili sağlayıcıya iletilir. Mevcut çekirdek aynı anda bir sohbet veya çoklu ajan görevi yürütür.

SDK entegrasyonları sahte HTTP yanıtlarıyla test edilir; gerçek bulut anahtarı ve ücretli çağrı kullanılmadı. macOS native kasa testi yalnız sentetik anahtar oluşturup siler: `cargo test --manifest-path src-tauri/Cargo.toml --lib -- --include-ignored`. Windows/Linux kasa davranışları bu cihazda doğrulanmadı. Geliştirme ve paketleme ortamı Python 3.12.14'e geçirildi.

## Faz 2: ajan masası, router ve kontrollü dosya bağlamı

**Ajan masası** ekranında 2–4 aday ajan seçilir. Manuel mod seçim sırasını korur. Otomatik mod görevi basit/karmaşık olarak sınıflandırır, yerel/bulut sağlayıcı ve model adı kapasite sinyallerine göre adayları sıralar; bütçeye sığmayan son adayları çıkarabilir. Karar gerekçesi görevle birlikte saklanır. Her ajan ortak hedefi ve kendisinden önce tamamlanan görüşleri görür; sonraki turlarda karşı görüş üretir. İlk ajan son düğümde ekip koordinatörü olarak ortak sonucu sentezler. Her tamamlanan düğüm LangGraph SQLite checkpointer'a, kullanıcıya gösterilen mesaj da ana uygulama veritabanına kaydedilir.

Model çağrısı bütçesi, seçilen ajan sayısı × tur + sentez formülüyle ağ erişiminden önce doğrulanır. Çağrı başına çıktı token bütçesi Ollama, Claude ve Gemini adaptörlerine doğrudan geçirilir. Başlatılan her sağlayıcı çağrısı kalıcı sayaçta tutulur. Para cinsinden tahmin bu aşamada yapılmaz; bunun için sağlayıcı kullanım verisi ve sürümlü fiyat kataloğu gerekir.

Ajanlar varsayılan olarak dosya okuyamaz. Kullanıcı **Ajanlar** ekranından `workspace.read` iznini ajan bazında açar ve görev formunda okunacak göreli yolları açıkça seçer. LangGraph, somut dosya listesini `interrupt()` yüküyle arayüze gönderir ve görevi kalıcı `waiting_approval` durumuna alır. Onay aynı `thread_id` üzerinden devam eder; ret sıfır model çağrısıyla görevi kapatır. Dosya içerikleri onay öncesinde okunmaz ve ana görev kaydında tutulmaz. Mutlak yollar, `..`/symlink ile çalışma alanı dışına çıkış, gizli ve yaygın build klasörleri, UTF-8 olmayan/ikili içerik, izin verilmeyen uzantılar ve 128 KiB üzerindeki dosyalar reddedilir. En fazla 10 dosya ve toplam 128.000 karakter bağlama alınır. Bulut ajan seçilmişse onaylanan içerik ilgili sağlayıcıya gönderilir. Modelin kendi başına yol seçmesi, dosya yazması veya terminal çalıştırması bu dilimde mümkün değildir.

Entegrasyon referansları: [keyring](https://docs.rs/keyring/3.6.3/keyring/), [Anthropic Python SDK](https://github.com/anthropics/anthropic-sdk-python), [Google GenAI SDK](https://googleapis.github.io/python-genai/).

## Pydantic → TypeScript sözleşmesi

Tek kaynak `backend/zerocost/models.py` dosyasıdır.

```sh
npm run schema:generate
npm run schema:check
```

Üretim zinciri: Pydantic serialization JSON Schema → json-schema-to-typescript → TypeScript; aynı şemadan Ajv standalone yanıt doğrulayıcısı. Çalışma zamanında `eval` veya `new Function` kullanılmaz. `src/generated/` dosyaları sürüm kontrolüne eklenmelidir; elle düzenlenmez. Şema güncelliği build/check sırasında doğrulanır. Pydantic özel validator'ları (ör. yol kontrolü) backend'de ayrıca uygulanır; JSON Schema tüm iş kurallarının yerine geçmez.

Çoklu ajan görevleri manuel veya deterministik otomatik routing kullanır. Router kararı ve gerekçesi görev kaydında tutulur. Çağrı bütçesi, görev başlamadan önce gerekli model çağrılarını sınırlar; çıktı bütçesi her sağlayıcı isteğine doğrudan uygulanır. Çalışma alanı dosyaları seçildiyse LangGraph görevi `waiting_approval` checkpoint'inde durur. İçerik ancak kullanıcı somut dosya listesini onayladıktan sonra okunur; ret halinde hiçbir model çağrısı yapılmaz.

Protokol v1 yapılandırma komutlarına ek olarak sohbet, kasa, workspace okuma ve `orchestration.start/approve/cancel/history` komutlarını sunar. Her komut `request_id` ve `protocol_version` içerir. Akış parçaları `run_id`, monoton `sequence`, olay türü, ajan/aşama kimliği ve terminal işareti taşır. Yanıtlar ile akış olayları Pydantic'ten üretilen ayrı çalışma zamanı doğrulayıcılarından geçer.

## Veri ve süreç yaşam döngüsü

Veritabanı Tauri'nin platforma özgü uygulama veri dizininde tutulur. macOS: `~/Library/Application Support/dev.zerocost.desktop/zerocost.sqlite3`.

UI Python'a doğrudan erişmez; Rust tek bir sidecar sürecini tembel başlatır. Geliştirmede `.venv` Python'ı; release'te uygulama yanında paketlenen `zerocost-sidecar` çalışır. `PYTHONUNBUFFERED=1` ve her çerçevede flush kullanılır. stdout yalnızca protokol içindir; tanı mesajları stderr'e gider. Rust yanıtları `request_id` ile bekleyen çağrılara, akış olaylarını Tauri `chat_stream` kanalına yönlendirir. Backend kilidi yanıt beklerken tutulmadığından iptal komutu akış sırasında işlenebilir. Yazma işlemi otomatik tekrarlanmaz: sonucu belirsiz bir kayıt için önce durumu yenileyin.

Başlangıçta ajanlara araç yetkisi verilmez. Çalışma alanı kaydı tek başına içerik erişimi vermez; okuma hem ajan izni hem kullanıcı tarafından seçilmiş göreli dosya yolu gerektirir. Ağ çağrıları sabit Ollama/Anthropic/Gemini uç noktalarıyla sınırlıdır. Python süreç izolasyonu bir OS sandbox değildir; serbest kod/terminal yürütme bu sürümde sunulmaz.

Bu ilk şema SQLite `user_version` ile transaction içinde uygulanır. İlerideki migration'lar mevcut kullanıcı verisini korumalı; daha yeni şemalı DB açılmaya çalışılırsa uygulama reddeder. SQLAlchemy/Alembic geçişi, görev ve sohbet veri modeli eklenirken ayrıca ele alınacak.

## Doğrulama

```sh
npm run check
npm run test:contract
npm run build
cargo check --manifest-path src-tauri/Cargo.toml
cargo test --manifest-path src-tauri/Cargo.toml --lib
cargo fmt --manifest-path src-tauri/Cargo.toml -- --check
```

Backend testleri hesap/ajan ayrımı, foreign key/unique, yeniden açılışta kalıcılık, protokol reddi, klasör sınırları, ajan izinleri, ilerideki DB sürümünü koruma, gerçek stdin/stdout iletişimi, model keşfi, NDJSON ayrıştırma, sıralı akış, iptal, çoklu ajan durum geçişleri ve kısmi hata kaydını kapsar. Contract testleri üretilmiş yanıt ve ajan/aşama olay doğrulayıcılarının bozuk veriyi reddettiğini denetler. Paketlenmiş Python 3.12 sidecar ayrıca iki geçici Ollama ajanıyla gerçek üç aşamalı görev üzerinden doğrulanmıştır.

## Masaüstü paketi

```sh
npm run desktop:build -- --bundles app
```

macOS uygulaması `src-tauri/target/release/bundle/macos/ZeroCost.app` altında oluşur. `app` hedefi macOS'a özeldir; diğer platformlarda varsayılan bundle hedefini kullanın. İmzalama/notarization, güncelleme imzası ve Windows/Linux doğrulaması dağıtıma hazırlık aşamasıdır. Doğrudan `tauri build` yerine sidecar'ı hazırlayan yukarıdaki komutu kullanın. Cross-compilation betiği yoktur; her hedef platformda native build gerekir.

## Sonraki geliştirme dilimi

1. Sağlayıcı kullanım bilgisini ve sürümlü fiyat kataloğunu kullanan para bütçesi.
2. Model tarafından önerilen araç çağrıları için genişletilebilir onay kuyruğu; workspace yazma aracı.
3. Terminal için komut ayrıştırma, risk sınıfları, çalışma dizini sınırı ve açık onay.
4. Kesilmiş üretim düğümünü kontrollü yeniden deneme ve kısmi görev devamı.
