# ADR-0008: Sağlayıcıdan bağımsız native araç çağırma

## Durum

Kabul edildi — 2026-09-15.

## Bağlam

Koordinatör modelin Markdown içindeki `zerocost-tool` JSON zarfı küçük yerel modeller için taşınabilir bir yedektir; native function/tool calling sunan modellerde ise metin ayrıştırmaya bağımlı kalmak gereksiz hata yüzeyi yaratır. OpenAI, Anthropic, Gemini ve Ollama araç tanımlarını ve akış parçalarını farklı biçimlerde taşır. Sağlayıcının çağrı kimliğine güvenmek de eksik kimlik üreten modellerde checkpoint idempotency'sini bozar.

Sağlayıcıların ortak kabul ettiği function adı karakter kümesi nokta içermez. ZeroCost izinleri ve araç kayıtları ise `workspace.write`, `terminal.execute` ve `knowledge.search` canonical adlarını kullanır.

## Karar

- Provider adaptörleri metin için `TextChunk`, araç parçaları için `ToolCallChunk` üretir. Orkestrasyonun geri kalanı sağlayıcı akış biçimini görmez.
- Dış function adları `workspace_write`, `terminal_execute` ve `knowledge_search` olur. Sınırlı assembler bunları doğrulanmış argümanlarla iç canonical ada çevirir.
- Bağlantının `supports_tools` değeri üç durumlu tutulur: `true` native yolu zorunlu kılar, `false` yalnız fenced JSON kullanır, `unknown` native tanımları gönderir ve native çağrı yoksa fenced JSON'u kabul eder.
- Native ve fenced yollar aynı `prepare_write`, `prepare_command` ve bilgi arama doğrulamasında birleşir. Model çıktısı izinleri genişletemez; ajan izni, görev kapsamı ve kullanıcı onayı kontrolleri aynen uygulanır.
- V1 bir sentez düğümünde en fazla bir araç çağrısını kabul eder. Fazlası kapalı davranışla görevi durdurur.
- İç çağrı kimliği `SHA-256(run_id + NUL + node_name + NUL + sequence)` olarak uygulama tarafından üretilir. Sağlayıcı kimliği yalnız denetim için `provider_call_id` alanında saklanır.
- SQLite şema v18 yeni çağrıları `tool_calls` tablosunda doğrulanmış JSON argümanları, argüman/içerik hash'leri, yaşam döngüsü durumu, sonuç ve süreyle saklar. Eski `orchestration_runs` araç alanları geriye dönük okuma için korunur; eski kayıtlar migration sırasında taşınmaz.
- Eski özel provider adaptörleri `tools` parametresi sunmuyorsa fenced JSON yolunda çalışmaya devam eder.

## Sonuçlar

Sağlayıcı protokol farkları adaptör sınırında kalır; onay, idempotency, crash recovery ve izin modeli tek yoldan yürür. Kullanıcı bağlantı bazında native desteği açıkça işaretleyebilir veya otomatik denemeyi kullanabilir. Argümanlar ve çağrı kimlikleri denetlenebilir hale gelir. Bu sürüm paralel çoklu araç çağrısını ve araç sonucunu modele ikinci turda geri verme döngüsünü kapsamaz.
