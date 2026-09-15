# ADR-0009: Tek araç sonucu turu

## Durum

Kabul edildi — 2026-09-15

## Bağlam

Native ve fenced JSON araç çağrıları aynı doğrulanmış `ToolCall` modeline dönüşüyordu; ancak
`workspace.write` ve `terminal.execute` tamamlandıktan sonra sonuç yalnız kullanıcıya gösteriliyor,
model nihai açıklamayı üretemiyordu. Sınırsız bir araç döngüsü bu aşamada idempotency, bütçe ve
izin yüzeyini gereksiz büyütürdü.

## Karar

- V1, bir model araç çağrısı ve ardından aynı bağlantıda tam bir sonuç turu çalıştırır.
- Sağlayıcı adaptörleri ortak `ProviderToolExchange` zarfını kendi protokolüne çevirir: OpenAI
  assistant `tool_calls` + tool message, Claude `tool_use` + `tool_result`, Gemini
  `functionCall` + `functionResponse`, Ollama assistant `tool_calls` + tool message.
- OpenAI `tool_choice: none`, Claude `tool_choice: {type: none}` ve Gemini `NONE` kullanır.
  Ollama sonuç turunda araç tanımlarını almaz; yine de ürettiği araç parçaları uygulama katmanında
  atılır. Diğer sağlayıcıların yasağa rağmen araç üretmesi protokol hatasıdır.
- Native desteği olmayan modeller sonuçları düz `Tool execution result:` metniyle alır. Bu yol da
  ikinci araç çağrısını işleme koymaz.
- Nihai çağrı, fallback seçimi sırasında ilk araç çağrısını gerçekten üreten `connection_id`
  üzerinde sabitlenir. Fallback zinciri sonuç turunda yeniden değerlendirilmez.
- Tam araç sonucu denetim kaydında en çok 64 KiB tutulur. Modele gönderilen terminal sonucu en
  fazla 24.000 karakter ve son 200 satırdır; kesme açıkça etiketlenir. Yazma sonucu yalnız yol ve
  UTF-8 byte sayısını içerir.
- `execute_tool` düğümü sonucu hem `tool_calls` kaydına hem GraphState'e yazdıktan sonra
  `finalize_tool` çalışır. Nihai model çağrısı çökerse kalıcı checkpoint tamamlanmış araç düğümünü
  tekrar çalıştırmadan devam eder.
- Araç sunulan görevler olası sonuç turunu başlangıçtaki model çağrısı bütçesine dahil eder.

## Sonuçlar

Kullanıcı artık araç çıktı dökümü yerine modelin sonuç üzerinden yazdığı tamamlanmış bir yanıt
alır. Tek tur sınırı izin ve maliyet davranışını denetlenebilir tutar. Çok adımlı araç döngüsü,
araç başına yeni onay ve ayrı idempotency politikaları tasarlanana kadar kapsam dışındadır.
