# Devam notu — 9 Eylül 2026

## Tamamlanan başlangıç dilimi

- Tauri 2 + React/TypeScript masaüstü iskeleti ve Türkçe kontrol paneli.
- Python sidecar; sürümlenmiş JSON-lines IPC, timeout ve süreç temizliği.
- SQLite bağlantı, ajan ve çalışma alanı kayıtları; veri bütünlüğü ve kalıcılık.
- Pydantic → JSON Schema → TypeScript + paketlenmiş Ajv runtime doğrulayıcısı.
- PyInstaller sidecar ve macOS .app paketleme betikleri.
- Kurulum/komutlar README.md içinde; GitHub Actions doğrulaması `main` dalında çalışıyor.

## Doğrulama

- 12 Python backend testi geçti.
- 3 JavaScript sözleşme testi geçti.
- 1 Rust → gerçek Python süreç iletişimi testi geçti; süreç yeniden başlatılınca kayıt korundu.
- TypeScript kontrolü, şema güncelliği, Vite build ve Rust derleme kontrolleri geçti.
- Paketlenmiş bağımsız Python sidecar ile gerçek stdin/stdout smoke testi geçti.
- macOS ZeroCost.app üretildi.
- Tarayıcı önizlemesi ekran görüntüsü incelendi.
- Kullanıcının gönderdiği görüntüde ZeroCost açık ve “Yerel çekirdek bağlı”, “Veri katmanı Hazır” görünüyor.
- Computer Use erişimi düzeldi. Paketlenmiş macOS uygulamasında model bağlantısı, ajan ve workspace formları doldurulup kaydedildi. Uygulama kapatılıp yeniden açıldı; üç kayıt da UI üzerinde korundu. Native ekran görüntüsüyle bağlı çekirdek ve 3/3 kurulum doğrulandı.
- Kullanıcıya örnek olarak “Örnek Yerel Model” (Ollama / qwen3:8b), “Örnek İncelemeci” ve ZeroCost workspace bırakıldı. Model kurulu olduğu veya API bağlantısı kurulduğu iddia edilmez.

## Ollama ve streaming dilimi

- Sağlayıcı adaptör arayüzü ve Ollama adaptörü eklendi.
- Kurulu Ollama modelleri keşfediliyor; embedding-only modeller sohbet listesinden çıkarılıyor.
- Python stdout tamponlaması kapalı ve her JSON satırı flush ediliyor.
- Rust, `request_id` yanıtlarını ve `run_id` akış olaylarını ayrı kanallara yönlendiriyor.
- React sohbet ekranı; ajan/model seçimi, akış, durdurma ve kalıcı geçmiş eklendi.
- 18 Python testi, 4 JS sözleşme testi ve Rust köprü testi geçti.
- Gerçek `qwen2.5-coder:1.5b-base` ile 223 parçalık akış; sıra, birleşmiş içerik ve SQLite kaydı doğrulandı.
- Paketlenmiş macOS uygulamasında mesaj gönderildi; tamamlanmış yanıt UI'da gösterildi. Uygulama kapatılıp açıldıktan sonra aynı sohbet geçmişi yeniden yüklendi.
- Tool-capable kurulu modeller keşif listesinde varsayılan olarak öne alınır; cihazdaki 1.5B base modelin sohbet kalitesi zayıf bulundu.

## OS kasası ve bulut adaptörleri

- Rust keyring 3.6.3, bağlantı UUID'si bazında native kasaya kayıt; React'a anahtar okuma komutu yok.
- Kasa kaydet/değiştir/sil/durum UI'si ve Pydantic sözleşmesi eklendi.
- Rust, backend snapshot'ından ajan bağlantısını çözer; istek bazında özel kimlik bilgisi enjekte eder. Python bağlantı eşleşmesini doğrular.
- Anthropic system ayrımı ve terminal olay kontrolü; Gemini rol dönüşümü, dört kategori BLOCK_NONE, bitiş nedeni kontrolü.
- SDK hataları ve logları anahtar sızdırmamak için sınırlandı; bağımsız bağlantı anahtarları test edildi.
- 29 Python ve 5 JS sözleşme testi geçti. Rust IPC ve native macOS kasa testleri geçti; sentetik kasa kaydı silindi.
- Gerçek bulut çağrısı yapılmadı. Anahtar kullanıcı tarafından uygulamaya girilmeli; sohbette paylaşılmamalı.

## Faz 2 · çoklu ajan ve kontrollü otomasyon

- Homebrew Python 3.12.14 kuruldu; proje `.venv` ortamı 3.12 ile yeniden oluşturuldu. Doğrulama sonrası geçici 3.9 ve staging ortamları macOS Çöp Sepeti'ne taşındı.
- LangGraph 1.2.11 ve SQLite checkpointer 3.1.1 eklendi.
- Ajan masası 2–4 ajan, 1–3 tartışma turu, ajan görüşleri ve ilk ajan sentezi yürütüyor.
- Ajan ve aşama bilgili token olayları React'a akıyor; tamamlanan mesajlar ve görev durumu sürümlü SQLite şemasına yazılıyor.
- Çoklu bulut ajanlarında Rust her bağlantının anahtarını ayrı çözüyor; Python eşleşmeleri yeniden doğruluyor.
- `workspace.read` izni ajan bazında açılıp kapatılıyor. Klasör listeleme ve dosya okuma uçları containment, symlink, tür, boyut ve UTF-8 sınırları uyguluyor.
- Görev formu kullanıcının seçtiği en fazla 10 göreli dosyayı bağlama alıyor; seçili tüm ajanların okuma izni gerekiyor.
- 34 Python, 7 JS sözleşme ve 2 Rust testi geçti; native kasa testi sentetik anahtarı temizledi.
- Paketlenmiş sidecar iki geçici Ollama ajanıyla gerçek üç aşamalı LangGraph görevini tamamladı; geçici veritabanı otomatik silindi.

## Fiat bütçe ve fiyat kataloğu

- SQLite şeması v6; görev bütçesi, üst maliyet tahmini, token toplamları, token bazlı liste maliyeti ve katalog sürümü kalıcıdır.
- `pricing.catalog` ile aynı fiyat verisi Pydantic → TypeScript sözleşmesinden arayüze taşınır.
- Claude, Gemini ve Ollama adaptörleri sağlayıcı kullanım sayaçlarını ortak `TokenUsage` yapısına dönüştürür.
- Görev planı bütçeyi aşarsa ağ erişiminden önce reddedilir; bilinmeyen bulut modelinde fiyat tahmini kapalı davranır.
- Her çağrı sonrasında kümülatif token ve standart USD liste maliyeti canlı olayla arayüze gönderilir.
- 42 Python ve 8 JavaScript sözleşme testi geçti.

## Sınırlar

Salt okunur workspace aracı yalnız kullanıcı seçtiği ve çalıştırma anında onayladığı dosyaları bağlama alır; model tarafından başlatılan tool calling, dosya yazma ve terminal henüz yok. Router kural ve kapasite sinyalleri kullanır. Maliyet, sağlayıcı faturası yerine sürümlü standart liste fiyatının gerçek token kullanımına uygulanmasıdır; ücretsiz katman, cache, batch, araç ücretleri ve hesaba özel fiyatlar henüz yoktur. Eşzamanlı üretim limiti birdir. İmzalı/notarize dağıtım ve Windows/Linux doğrulaması yapılmadı. Google SDK, Pydantic 2.13 kullanımı için upstream deprecation uyarısı üretir.

## Yollar

- Proje: /Users/avci/Desktop/ZeroCost
- Paket: src-tauri/target/release/bundle/macos/ZeroCost.app
- Geliştirme: npm run desktop
- macOS paket: npm run desktop:build -- --bundles app
## Faz 2 · Router, bütçe ve onay kuyruğu

- Manuel ve otomatik, denetlenebilir ajan sıralaması
- Görev öncesi model çağrısı bütçesi ve sağlayıcı başına çıktı token sınırı
- LangGraph `interrupt()` ile kalıcı `waiting_approval` durumu
- `workspace.read` için dosya listesini gösteren onay/ret arayüzü
- Onay öncesinde dosya okuması ve model çağrısı yapılmaması

## Güncel doğrulama

- 42 Python ve 8 JavaScript sözleşme testi geçti.
- 2 Rust testi, native macOS kasa testi dahil, geçti.
- Paketlenmiş sidecar gerçek Ollama ile rota ve üç model çağrısı akışını tamamladı; kullanım olayları doğrulandı.
- Kullanıcı veritabanı v5'ten v6'ya veri bütünlüğü korunarak geçti; kurulu `/Applications/ZeroCost.app` şema v6 ile bağlı çalışıyor.

## Faz 2 · Fiat bütçe

- 9 Eylül 2026 tarihli Anthropic ve Gemini standart API fiyat kataloğu
- Ağ erişiminden önce ihtiyatlı USD üst sınır denetimi
- Sağlayıcının bildirdiği tokenların çağrı ve görev bazında kalıcı toplanması
- Arayüzde katalog, üst tahmin ve token bazlı liste maliyeti
- SQLite v5 → v6 kayıpsız geçiş
