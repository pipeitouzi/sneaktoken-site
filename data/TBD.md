# 待补条目：Google AI Studio & Google Colab

## 为什么缺

`ai.google.dev` 和 `research.google.com` 在本次执行环境（中国大陆网络）下抓取失败（HTTP 000），无法按「必须抓官方页面」的规矩核实数字。这两条是海外用户最常用的，缺了很可惜。

## 怎么补

1. 打开 `data/templates/google-ai-studio.template.json` 和 `google-colab.template.json`
2. 在海外网络下打开官方页面核实数字：
   - Google AI Studio：`ai.google.dev/gemini-api/docs/rate-limits`
   - Colab：`research.google.com/colaboratory/faq.html`
3. 复制模板内容，贴进一个新的 `data/offers-xxx.json`（比如 `data/offers-google.json`），填完所有 TODO / unknown / `_todo`
4. 删除 `_todo` 字段，`confidence` 改为 `official`，`source` 填官方 URL，`checked` 填核实日期
5. 运行合并：`node tools/merge-offers.js`

## 核实要点（模板的 _todo 里已逐条列出）

| 字段 | 要看什么 |
|---|---|
| quota | 免费档开放哪些模型、额度是多少 |
| limits | RPM / RPD / TPM，一次会话或每日上限 |
| card_required | 是否必须绑信用卡 |
| expiry | 每日刷新 / 一次性 / 不过期 |
| data_training | 免费档数据是否用于改进产品（可关闭吗） |
| checked + source | 核实日期 + 官方页 URL（站上会显示成可点击链接） |

## 如果实在补不了

宁可让这两条不上线，也不要凭记忆/二手信息填数字。站上 FAQ 里已经写了「查不到就 unknown」的原则，访客反而信这个。等能抓到官方页再补，页面上会自动出现。
