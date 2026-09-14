# ADR-0004: Açık ve bütçeye bağlı model fallback zinciri

## Durum

Kabul edildi — 2026-09-14.

## Bağlam

Aynı model çağrısındaki kısa süreli retry, geçici sağlayıcı kesintisini her zaman çözemiyor. Otomatik olarak rastgele bir modele geçmek ise maliyet, veri yönetişimi ve çıktı kalitesi açısından denetlenemez davranış yaratır. Çoklu ajan çalışmasında her ajanın farklı bir model politikası olabilir; bu politika görev geçmişi ve checkpoint devamı boyunca değişmemelidir.

## Karar

- Her ajan bir birincil bağlantı ve en fazla üç kullanıcı sıralı fallback bağlantısı taşır.
- Görev başında seçilen ajanların zincirleri participant sırasıyla `orchestration_runs.fallback_chain` JSON alanına dondurulur. Onay ve retry güncel ajan ayarı yerine bu snapshot'ı kullanır.
- Her bağlantı en fazla üç güvenli LLM retry'ı alır. Geçici hata zincirde sıradaki bağlantıya geçebilir; kalıcı hata zinciri hemen durdurur.
- HTTP 429 yanıtındaki `Retry-After` en fazla 30 saniyeyse aynı bağlantı beklenir. Daha uzunsa kalan yerel retry'lar atlanıp fallback denenir.
- Her aday çağrıdan önce fiyat kataloğu ve aile bütçesiyle kapalı davranan ön kontrolden geçer. Fiyatı bilinmeyen veya bütçeye sığmayan aday çağrılmaz.
- `model_call_attempts` yalnız model çağrısı denetim günlüğüdür. Sağlayıcı ve model kimliği `connection_id` foreign key'inden türetilir; araç ve orchestration retry kayıtlarıyla birleştirilmez.
- Başarılı veya sağlayıcının kullanım bildirdiği başarısız çağrının denetim kaydı ile token/maliyet muhasebesi aynı SQLite transaction'ında yazılır.
- Renderer hiçbir credential görmez. Rust, dondurulan zincirdeki kasa gerektiren bağlantıların anahtarlarını request belleğine ekler; Python bunları diske veya olaya yazmaz.
- V1 arayüzü sıralı liste, ekleme, kaldırma ve yukarı/aşağı hareket kontrolleri kullanır. Drag-and-drop kapsam dışıdır.

## Sonuçlar

Bir sağlayıcı veya model geçici olarak kullanılamadığında LangGraph aynı düğümü açıkça izin verilmiş bir modelle tamamlayabilir. Her geçiş, deneme, sonuç, süre ve bilinen maliyet denetlenebilir. Zincir bütçe ya da fiyat kontrolünü aşamaz ve kalıcı yapılandırma hatalarını gizlemez.

Task queue, paralel worker pool, model kalite puanlaması, otomatik zincir üretimi ve sürükle-bırak düzenleme sonraki dilimlere bırakılmıştır.
