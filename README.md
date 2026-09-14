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

- Masaüstü kontrol paneli; bağlantı, ajan, skill paketi, workflow tarifi ve çalışma alanı formları.
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
- Geçici sağlayıcı hatalarında sınırlı backoff ve kalıcı checkpoint'ten kullanıcı tetiklemeli düğüm devamı.
- Ajan/aşama kimlikli canlı görev olayları, SQLite görev geçmişi ve LangGraph SQLite checkpoint'leri.
- Ajan bazında `workspace.read` izni; sınırlandırılmış klasör listeleme ve UTF-8 metin okuma araçları.
- Kullanıcının seçtiği en fazla 10 çalışma alanı dosyasını çoklu ajan bağlamına ekleme.
- Yerel Ollama embedding modeli keşfi, bilgi koleksiyonları ve SQLite FTS5/float32 vektör depolama temeli.

Claude ve Gemini akışlı sohbet adaptörleri ve Rust yönetiminde OS anahtar kasası eklendi. Faz 2'nin çoklu ajan, otomatik router, yürütme bütçesi, kontrollü çalışma alanı yazması ve terminal dilimi çalışır. RAG'ın veri, embedding, bağlam duyarlı belge parçalama, kaynak ekleme ve kaynak gösteren hibrit ajan arama hattı hazırdır. Bu sürüm üretime hazır değildir.

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

Model çağrısı bütçesi, seçilen ajan sayısı × tur + sentez formülüyle ağ erişiminden önce doğrulanır. Çağrı başına çıktı token bütçesi Ollama, Claude ve Gemini adaptörlerine doğrudan geçirilir. Başlatılan her sağlayıcı çağrısı kalıcı sayaçta tutulur.

USD görev bütçesi, `2026-09-09` sürümlü fiyat kataloğunu kullanır. Başlangıçta hedef, rol/talimat, seçilen dosyaların yalnız boyut bilgisi, planlanan konuşma büyümesi ve azami çıktı tokenları üzerinden ihtiyatlı bir üst sınır hesaplanır; sınırı aşan görev ağ çağrısından önce reddedilir. Bilinmeyen bulut modeli fiyatı kapalı davranışla reddedilir. Ollama ve LM Studio için API maliyeti sıfır kabul edilir. Her tamamlanan çağrıdan sonra sağlayıcının bildirdiği giriş/çıkış tokenları SQLite'a eklenir ve standart liste fiyatıyla hesaplanan kullanım maliyeti arayüze yayınlanır. Bütçe beklenmedik biçimde aşılırsa yapılmış çağrının maliyeti doğmuş olabilir; kalan çağrılar durdurulur.

Katalog doğrudan API standart fiyatlarını temel alır: [Anthropic Claude API fiyatları](https://platform.claude.com/docs/en/about-claude/pricing) ve [Google Gemini API fiyatları](https://ai.google.dev/gemini-api/docs/pricing). Ücretsiz katman, batch indirimi, prompt cache, araç ücretleri, vergiler, kur dönüşümü ve hesaba özel indirimler hesaplanmaz. Gösterilen kullanım tutarı sağlayıcının faturası değil, gerçek token sayısına uygulanmış katalog liste maliyetidir. Gemini 2.5 Pro'nun 200 bin token üzeri uzun bağlam tarifesi desteklenir.

Ajanlar varsayılan olarak dosya okuyamaz. Kullanıcı **Ajanlar** ekranından `workspace.read` iznini ajan bazında açar ve görev formunda okunacak göreli yolları açıkça seçer. LangGraph, somut dosya listesini `interrupt()` yüküyle arayüze gönderir ve görevi kalıcı `waiting_approval` durumuna alır. Onay aynı `thread_id` üzerinden devam eder; ret sıfır model çağrısıyla görevi kapatır. Dosya içerikleri onay öncesinde okunmaz ve ana görev kaydında tutulmaz. Mutlak yollar, `..`/symlink ile çalışma alanı dışına çıkış, gizli ve yaygın build klasörleri, UTF-8 olmayan/ikili içerik, izin verilmeyen uzantılar ve 128 KiB üzerindeki dosyalar reddedilir. En fazla 10 dosya ve toplam 128.000 karakter bağlama alınır. Bulut ajan seçilmişse onaylanan içerik ilgili sağlayıcıya gönderilir.

`workspace.write` ve `terminal.execute` ajan bazında ayrı izinlerdir ve görev bazında ayrıca etkinleştirilir. Koordinatör model en fazla bir `zerocost-tool` JSON zarfı önerebilir. Backend zarfı katı şemayla doğrular; yazma için birleşik diff, terminal için tam argv ve çözümlenmiş binary yolu gösterir. LangGraph ikinci bir kalıcı onay noktasında durur. Ret halinde sentez korunur ve işlem yapılmaz. Yazma, metin uzantısı ve 128 KiB sınırıyla workspace içinde kalır; gizli/dışlanan yol ve symlink hedefleri reddedilir. Onay beklerken dosyanın SHA-256 özeti değişirse işlem iptal edilir; kabul edilen içerik geçici dosya, `fsync` ve atomik `replace` ile uygulanır.

Terminal shell kullanmaz; komut argv dizisi olarak çalıştırılır. Çalışma dizini kayıtlı workspace içinde çözülür, executable sabit izin listesinden seçilir, ortam değişkenleri azaltılır, süre 60 saniye ve gösterilen çıktı 64 KiB ile sınırlanır. Terminalde izin verilen `npm`, `cargo`, `python` gibi araçlar proje kodu çalıştırabileceği için onay ekranında **yüksek risk** olarak gösterilir. Bu süreç bir OS sandbox değildir; kullanıcı tam komutu incelemeden onay vermemelidir.

Entegrasyon referansları: [keyring](https://docs.rs/keyring/3.6.3/keyring/), [Anthropic Python SDK](https://github.com/anthropics/anthropic-sdk-python), [Google GenAI SDK](https://googleapis.github.io/python-genai/).

## Faz 3: yerel bilgi ve embedding temeli

**Bilgi yönetimi** ekranı Ollama'nın embedding yeteneği bildiren kurulu modellerini keşfeder. Koleksiyon oluşturulurken `/api/embed` ile yerel bir boyut probu yapılır; dönen vektör doğrulanır, L2 normalize edilir ve koleksiyonun model/boyut sözleşmesi SQLite'a kaydedilir. Ollama erişilemez olsa da önceden kaydedilmiş koleksiyonlar görüntülenir. API anahtarı veya ücretli bulut çağrısı kullanılmaz.

SQLite şema v10; koleksiyon, kaynak ve parça tablolarını, Unicode FTS5 tam metin indeksini ve küçük endian float32 embedding BLOB'larını içerir. Belgenin tam UTF-8 içeriği ve her chunk SHA-256 ile özetlenir. Aynı içerik ve indeks sürümü tekrar işlendiğinde embedding çağrısı yapılmaz; belge değiştiğinde koleksiyon içindeki aynı chunk vektörleri yeniden kullanılır ve yalnız benzersiz yeni parçalar 32'lik partilerle embed edilir. Sürümlü chunk hash alanı, ileride ayrıştırma/embedding girdisi değiştiğinde eski cache'i güvenle geçersiz kılar. Kaynak yenileme aynı koleksiyon/workspace/yol anahtarında transaction içinde eskisini değiştirir; vektör boyutu uyuşmazlığı reddedilir. Bu taşınabilir temel harici bir vektör veritabanı gerektirmez.

Metin ve Markdown ayrıştırıcısı CRLF/CR satır sonlarını deterministik biçimde normalize eder; kaynak satır numaralarını koruyarak başlık, paragraf, liste, tablo, alıntı, fenced code ve YAML frontmatter blokları üretir. ATX/Setext başlıkları ile başlık hiyerarşisi korunur; code içindeki Markdown işaretleri ayrıştırılmaz. Girdi NUL, 1.000.000 karakter ve 50.000 satır sınırlarıyla çevrelenir.

Semantik birleştirici varsayılan 2.400 karakter hedefi ve 3.200 karakter azami sınırıyla komşu küçük blokları paketler. Yeni başlık her zaman yeni bir bölüm başlatır; frontmatter/başlık ilk gövde bloğuyla birlikte tutulur. Hedefe ulaşıldığında doğal blok sınırı tercih edilir. Tek başına büyük paragraf veya code bloğu bu aşamada kesilmez ya da kaybedilmez; açıkça `oversized` işaretlenerek güvenli büyük-blok bölücüsüne bırakılır. Üretilen her chunk satır aralığını, başlık yolunu ve içerdiği blok türlerini taşır.

Oversized düz metin bölücüsü cümle sonlarını önceliklendirir; yaygın Türkçe/İngilizce kısaltmaları ve tek harfli isimleri yanlış sınır saymaz. Tek cümle azami boyutu aşıyorsa sırasıyla satır, noktalı virgül, iki nokta, virgül, kelime ve son çare olarak Unicode karakter sınırına iner. Başlık için ilk gövde parçasında yer ayırır, her parçanın özgün satır aralığını kaynak bloktan hesaplar ve hiçbir çıktının azami karakter sınırını aşmasına izin vermez. Code içeren oversized chunk'lar değiştirilmeden ayrı kod bölücüsüne aktarılır.

Oversized code bölücüsü özgün backtick/tilde fence açılışını ve dil etiketini her parçada yeniden üretir, parçayı aynı fence ile kapatır. İlk parça frontmatter/başlık bağlamını korur. Bölme önce boş satır ve üst seviye `class`, `def`, `function`, `fn`, `struct`, `interface` gibi bildirim sınırlarını; sonra kaynak satırını tercih eder. Tek bir minified satır limite sığmıyorsa içerik kaybetmeden Unicode karakter sınırına iner ve tüm parçalar aynı kaynak satırını işaret eder. Kapanmamış kaynak fence güvenli biçimde kapatılır.

Birleşik chunk hattı semantik paketleme, oversized düz metin bölme, fenced-code bölme ve kontrollü overlap aşamalarını tek sırada çalıştırır. Düz metin yalnız aynı başlık yolundaki önceki cümle kuyruğunu alır; kod yalnız önceki kod parçasının kapsam bildirimi ve son satırlarını taşır. Kod bağlamı embedding girdisinde Markdown alıntısı ve “referans, yeniden tanım değil” etiketiyle ayrılır. Ana içerik ile overlap ayrı tutulur: SQLite/FTS yalnız ana parçayı saklar ve arar, embedding hash'i ile vektör girdisi etiketli birleşik bağlamı kullanır. Tip veya bölüm sınırları aşılmaz ve birleşik girdi 3.200 karakterlik katı sınırı geçmez.

`knowledge.source.ingest` IPC komutu, kayıtlı bir çalışma alanı ve koleksiyon kimliğiyle göreli `.txt`/Markdown yolunu indeksleme hattına bağlar. Backend yolu yeniden doğrular; mutlak, gizli, dışlanan, çalışma alanından kaçan, symlink, ikili, boş, UTF-8 olmayan ve 1 MiB üzerindeki dosyaları Ollama çağrısından önce reddeder. Başarılı yanıt kanonik göreli yolu, durum ile toplam/yeni/yeniden kullanılan chunk sayılarını döndürür. Rust köprüsü uzun yerel embedding işlemleri için 305 saniyelik sınırlı yanıt süresi uygular; renderer dosya içeriğini IPC zarfına taşımaz.

İndeksleme sürerken `knowledge_ingestion_progress` olayları okuma, ayrıştırma, chunking, embedding partileri, SQLite transaction ve tamamlanma aşamalarını bildirir. Her olay istek kimliği, monoton sıra numarası, ölçülen tamamlanan/toplam iş birimi ve 0–100 ilerleme değeri taşır. Rust yalnız izin verilen olay türlerini renderer'a geçirir; React çalışma zamanı şemasını doğrular, eski sıra numaralarını yok sayar ve erişilebilir progress bar'ı günceller.

Bilgi yönetimi ekranındaki native dosya seçici ve Tauri webview sürükle-bırak olayı, yalnız seçili kayıtlı çalışma alanının içindeki `.txt`/Markdown belgelerini en fazla 10 dosyalık kuyruğa alır. Mutlak yol UI'da çalışma alanına göreli hale getirilir; renderer dosya içeriğini okumaz. Kuyruk sıralı çalışır, her dosyanın progress olayları istek kimliğiyle ayrılır ve başarılı öğeler kuyruktan çıkarılır. Sonuç ekranı yeni embedding, yeniden kullanılan parça ve değişmemiş belge sayılarını gösterir.

`knowledge.search`, sorguyu koleksiyonun kayıtlı Ollama modeliyle embed eder ve aynı anda güvenli biçimde oluşturulmuş FTS5 sorgusunu çalıştırır. Cosine sırası ile BM25 sırası `k=60` Reciprocal Rank Fusion kullanılarak ağırlık ayarı gerektirmeden birleştirilir. Sonuçlar chunk kimliği, koleksiyon, workspace, kaynak yolu ve özgün satır aralığını taşır. Yerel brute-force vektör taraması koleksiyon başına 50.000 chunk ile, aday listeleri 20 ve nihai sonuçlar 10 ile sınırlıdır; bozuk veya boyutu uyuşmayan vektör kapalı davranışla reddedilir.

Ajan masasında en fazla üç bilgi koleksiyonu açıkça seçilebilir. Koordinatör bir `knowledge.search` zarfı üretirse salt-okunur araç kullanıcı onayı beklemeden çalışır ve sonuç ikinci sentez çağrısına geri verilir. Bu olası ek çağrı model çağrısı ve fiat maliyet üst sınırına baştan dahil edilir. Belge içeriği XML ayraçlarını taklit edemeyecek biçimde escape edilir, `<document>` zarflarında güvenilmeyen veri olarak işaretlenir ve nihai yanıtta `kaynak:satır-satır` referansları korunur. Mutasyon araçlarının ayrı onay akışı değişmez.

Embedding API sözleşmesi: [Ollama Embeddings](https://docs.ollama.com/capabilities/embeddings) ve [Ollama `/api/embed`](https://docs.ollama.com/api/embed).

## Skill paketleri

**Skill paketleri** ekranında ad, semantik sürüm, açıklama, sistem talimatı, gerekli araçlar/izinler ve isteğe bağlı sağlayıcı önerisi içeren deklaratif manifestler oluşturulur. Paket sürümleri değiştirilemez kayıtlar olarak tutulur; aynı ad ve sürüm ikinci kez eklenemez. Aynı paketin yeni sürümü ajana atandığında eski sürüm tek transaction içinde değiştirilir. Sağlayıcı alanı router için geleceğe dönük bir öneridir ve mevcut deterministik rotayı zorlamaz.

Ajan başına en fazla 8 paket ve toplam 24.000 karakter skill talimatı atanabilir. Talimatlar normal sohbet ve LangGraph çağrılarında açık `<skill>` sınırlarıyla sistem mesajına eklenir. `workspace.write` veya `terminal.execute` isteyen manifest aynı ajan iznini de beyan etmek zorundadır. Görev başlarken seçilen ajanların izinleri ve görev bazında etkin araçları yeniden doğrulanır; `knowledge.search` isteyen skill için en az bir bilgi koleksiyonu seçilmelidir. Araç gerektiren skill normal sohbet ekranında kapalı davranışla reddedilir ve kullanıcı Ajan masasına yönlendirilir. Onay bekleyen görev sürdürülürken gereksinimler tekrar kontrol edilir.

SQLite şema v11, `skills` ve foreign key/cascade kullanan `skill_assignments` tablolarını ekler. `skill.create`, `skill.assign` ve `skill.unassign` komutları kapalı Pydantic → TypeScript sözleşmesinden geçer; snapshot ajan atamalarını ve manifestleri birlikte döndürür. Skill talimatları kullanıcı tarafından güvenilen yapılandırmadır; RAG belge içeriği gibi güvenilmeyen veri değildir.

Skill, workflow ve executable plugin güven sınırları ile Phase 2/3 geçiş kuralları [ADR-0001](docs/adr/0001-skill-trust-and-capabilities.md) içinde sabitlenmiştir. Temel değişmez kural: skill talimatı ajanın yetkisini genişletemez; üçüncü taraf paketlerde ajan izni, paket sürümüne verilmiş kullanıcı onayının yerine geçmez.

## Workflow tarifleri V1

**Workflow tarifleri** ekranı tekrar eden çoklu ajan görevlerini değişmez, sürümlü tarifler olarak kaydeder. V1 mevcut LangGraph akışını değiştirmez: tarif 2–4 sıralı ajan yuvası, yuva başına sıfır veya daha fazla sabit skill sürümü, gerekli araçlar, 1–3 tur ve çağrı/token/fiat bütçelerini tanımlar. Coordinator alanı ve graph editörü yoktur; yürütme mevcut sıralı görüş, karşı görüş ve ilk ajan sentezi topolojisini kullanır.

Tarifte string interpolation veya placeholder değerlendirmesi yapılmaz. En fazla 4.000 karakterlik `objective_prefix` sabit metin olarak korunur ve kullanıcının her çalıştırmada girdiği serbest hedefin önüne backend tarafından bir kez eklenir. Workflow seçildiğinde UI uyumlu ajanları yuvalara önerir; backend tam slot sayısını, sırasını ve her slotun bütün `required_skill_ids` atamalarını model veya ağ çağrısından önce yeniden doğrular. `knowledge.search` koleksiyon seçimi, yazma/terminal araçları çalışma alanı ve mevcut ajan/görev/onay izin sınırlarını aynen korur; tarif hiçbir yetki vermez.

Aynı adla yeni sürüm oluşturmak önceki sürümleri silmeden arşivler. Arşivli sürüm yeni görev başlatamaz; geçmiş görev ve bekleyen checkpoint provenance kaydını korur. Onay bekleyen mevcut görev tarif sonradan arşivlense de sürdürülebilir, fakat slot skill ataması bu sırada kaldırılırsa onay kapalı davranışla reddedilir. SQLite şema v12, `workflows` tablosu ile `orchestration_runs.workflow_id/workflow_version` alanlarını ekler. `workflow.create` ve `workflow.archive` komutları kapalı Pydantic → TypeScript sözleşmesinden geçer. Kararın kapsamı ve ertelenen graph/plugin işleri [ADR-0002](docs/adr/0002-fixed-workflow-recipes.md) içinde kayıtlıdır.

## Dayanıklı görev devamı

Provider katmanı geçici ve kalıcı hataları ayrı tiplerle sınıflandırır. Timeout, bağlantı kesintisi, HTTP 429 ve 5xx hataları aynı LLM düğümünde 250/500 ms backoff ile en fazla üç kez denenir; kimlik doğrulama, bulunamayan model, güvenlik/çıktı sınırı ve geçersiz protokol hataları otomatik tekrarlanmaz. Her sağlayıcı girişimi model çağrısı bütçesinden düşer. Kısmi stream yeniden başlatılırken UI eski parçayı temizler; başarısız isteğin sağlayıcıda ücretlenmiş olabileceği kabul edilir.

Üç deneme sonunda geçici hata sürerse görev `retryable` olarak ve başarısız düğüm adıyla kapanır. Kullanıcı **Başarısız düğümü yeniden dene** dediğinde yeni bir run satırı oluşturulur; `parent_run_id`, artan `attempt` ve `resumed_from_node` ile kök denemeye bağlanır. Yeni çalışma aynı kalıcı LangGraph `thread_id` checkpoint'ini açar ve yalnız tamamlanmamış düğümü yürütür. Önceki görüşler tekrar üretilmez. UI deneme zincirinin mesajlarını birlikte gösterir; model çağrısı ve bilinen token maliyeti bütün aile üzerinden hesaplanır. Workflow, agent, skill, izin ve kimlik bilgileri devam öncesinde yeniden doğrulanır.

Mutasyon aracı yürütülmeden hemen önce `executing` durumu, doğrulanmış parametre özeti, kanonik args SHA-256 ve `workspace.write` hedef içerik SHA-256 değeri kalıcı olarak yazılır. Bu sırada süreç kesilirse terminal çağrısı `uncertain` olur ve otomatik tekrarlanmaz; UI tam argv/önizlemeyi göstererek kullanıcıdan yeniden çalıştırmadan devam etme veya görevi durdurma kararı ister. Yazma hedefinin mevcut hash'i beklenen içerik hash'iyle eşleşirse işlem tamamlanmış kabul edilir ve yeniden uygulanmaz; farklı hash güvenli biçimde belirsiz kalır. Tasarım kararı [ADR-0003](docs/adr/0003-durable-node-retry.md) içinde kayıtlıdır.

## Pydantic → TypeScript sözleşmesi

Tek kaynak `backend/zerocost/models.py` dosyasıdır.

```sh
npm run schema:generate
npm run schema:check
```

Üretim zinciri: Pydantic serialization JSON Schema → json-schema-to-typescript → TypeScript; aynı şemadan Ajv standalone yanıt doğrulayıcısı. Çalışma zamanında `eval` veya `new Function` kullanılmaz. `src/generated/` dosyaları sürüm kontrolüne eklenmelidir; elle düzenlenmez. Şema güncelliği build/check sırasında doğrulanır. Pydantic özel validator'ları (ör. yol kontrolü) backend'de ayrıca uygulanır; JSON Schema tüm iş kurallarının yerine geçmez.

Çoklu ajan görevleri manuel veya deterministik otomatik routing kullanır. Router kararı ve gerekçesi görev kaydında tutulur. Çağrı bütçesi, görev başlamadan önce gerekli model çağrılarını sınırlar; çıktı bütçesi her sağlayıcı isteğine doğrudan uygulanır. Çalışma alanı dosyaları seçildiyse LangGraph görevi `waiting_approval` checkpoint'inde durur. İçerik ancak kullanıcı somut dosya listesini onayladıktan sonra okunur; ret halinde hiçbir model çağrısı yapılmaz.

Protokol v1 yapılandırma komutlarına ek olarak sohbet, kasa, workspace okuma, `pricing.catalog`, `skill.create/assign/unassign`, `workflow.create/archive`, `knowledge.snapshot`, `knowledge.collection.create` ve `orchestration.start/approve/retry/cancel/history` komutlarını sunar. Her komut `request_id` ve `protocol_version` içerir. Akış parçaları `run_id`, monoton `sequence`, olay türü, ajan/aşama kimliği ve terminal işareti taşır. Yanıtlar ile akış olayları Pydantic'ten üretilen ayrı çalışma zamanı doğrulayıcılarından geçer.

## Veri ve süreç yaşam döngüsü

Veritabanı Tauri'nin platforma özgü uygulama veri dizininde tutulur. macOS: `~/Library/Application Support/dev.zerocost.desktop/zerocost.sqlite3`.

UI Python'a doğrudan erişmez; Rust tek bir sidecar sürecini tembel başlatır. Geliştirmede `.venv` Python'ı; release'te uygulama yanında paketlenen `zerocost-sidecar` çalışır. `PYTHONUNBUFFERED=1` ve her çerçevede flush kullanılır. stdout yalnızca protokol içindir; tanı mesajları stderr'e gider. Rust yanıtları `request_id` ile bekleyen çağrılara, akış olaylarını Tauri `chat_stream` kanalına yönlendirir. Backend kilidi yanıt beklerken tutulmadığından iptal komutu akış sırasında işlenebilir. Yazma işlemi otomatik tekrarlanmaz: sonucu belirsiz bir kayıt için önce durumu yenileyin.

Başlangıçta ajanlara araç yetkisi verilmez. Çalışma alanı kaydı tek başına içerik erişimi vermez; her araç hem ajan izni hem görev kapsamı hem de somut kullanıcı onayı gerektirir. Ağ çağrıları sabit Ollama/Anthropic/Gemini uç noktalarıyla sınırlıdır. Python sidecar ve terminal alt süreci OS sandbox değildir.

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

Backend testleri hesap/ajan ayrımı, foreign key/unique, yeniden açılışta kalıcılık, protokol reddi, klasör sınırları, ajan izinleri, skill ve workflow sürüm/atama/gereksinim sınırları, workflow provenance ve onayda yeniden doğrulama, ilerideki DB sürümünü koruma, gerçek stdin/stdout iletişimi, model keşfi, NDJSON ayrıştırma, sıralı akış, iptal, çoklu ajan durum geçişleri, fiyat kataloğu, ön kontrol bütçesi, gerçek token bazlı maliyet toplama ve kısmi hata kaydını kapsar. Contract testleri üretilmiş yanıt, skill/workflow manifesti ve ajan/aşama olay doğrulayıcılarının bozuk veriyi reddettiğini denetler. Paketlenmiş Python 3.12 sidecar ayrıca iki geçici Ollama ajanıyla gerçek üç aşamalı görev üzerinden doğrulanmıştır.

## Masaüstü paketi

```sh
npm run desktop:build -- --bundles app
```

macOS uygulaması `src-tauri/target/release/bundle/macos/ZeroCost.app` altında oluşur. `app` hedefi macOS'a özeldir; diğer platformlarda varsayılan bundle hedefini kullanın. İmzalama/notarization, güncelleme imzası ve Windows/Linux doğrulaması dağıtıma hazırlık aşamasıdır. Doğrudan `tauri build` yerine sidecar'ı hazırlayan yukarıdaki komutu kullanın. Cross-compilation betiği yoktur; her hedef platformda native build gerekir.

## Sonraki geliştirme dilimi

1. Workflow tarifleri için çalıştırma geçmişi filtresi, kopyalama ve açık sürüm karşılaştırması.
2. Sağlayıcı fallback zinciri ve kullanıcı onaylı model değişimi.
3. Task queue, worker pool ve stream backpressure.
4. Ayrı bir dilimde görsel graph editörü ve topoloji doğrulaması.
5. Üçüncü taraf plugin manifesti, imza doğrulaması ve sandbox sınırı.
