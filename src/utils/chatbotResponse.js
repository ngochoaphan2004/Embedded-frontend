function normalizeText(text = "") {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const sensorMapping = {
  "nhiệt độ": { key: "temperature", label: "Nhiệt độ", unit: "°C" },
  temperature: { key: "temperature", label: "Nhiệt độ", unit: "°C" },
  temp: { key: "temperature", label: "Nhiệt độ", unit: "°C" },
  "độ ẩm": { key: "humidity", label: "Độ ẩm", unit: "%" },
  humidity: { key: "humidity", label: "Độ ẩm", unit: "%" },
  "độ ẩm đất": { key: "soilMoisture", label: "Độ ẩm đất", unit: "%" },
  "soil moisture": { key: "soilMoisture", label: "Độ ẩm đất", unit: "%" },
  soil: { key: "soilMoisture", label: "Độ ẩm đất", unit: "%" },
  "lượng mưa": { key: "rainfall", label: "Lượng mưa", unit: "mm" },
  rainfall: { key: "rainfall", label: "Lượng mưa", unit: "mm" },
  rain: { key: "rainfall", label: "Lượng mưa", unit: "mm" },
  mưa: { key: "rainfall", label: "Lượng mưa", unit: "mm" },
  "mực nước": { key: "waterLevel", label: "Mực nước", unit: "cm" },
  "water level": { key: "waterLevel", label: "Mực nước", unit: "cm" },
  water: { key: "waterLevel", label: "Mực nước", unit: "cm" },
  led: { key: "ledState", label: "Trạng thái LED", unit: "" },
  đèn: { key: "ledState", label: "Trạng thái LED", unit: "" },
  "máy bơm": { key: "pumpState", label: "Trạng thái máy bơm", unit: "" },
  pump: { key: "pumpState", label: "Trạng thái máy bơm", unit: "" },
  bơm: { key: "pumpState", label: "Trạng thái máy bơm", unit: "" },
};

const sensorKeywordEntries = Object.entries(sensorMapping)
  .map(([keyword, sensor]) => ({
    rawKeyword: keyword,
    normalizedKeyword: normalizeText(keyword),
    sensor,
  }))
  .sort((a, b) => b.normalizedKeyword.length - a.normalizedKeyword.length);

const GREETING_KEYWORDS = ["xin chào", "hello", "hi", "chào"];
const HELP_KEYWORDS = ["giúp", "help", "hướng dẫn", "làm gì"];
const ALL_SENSOR_KEYWORDS = [
  "tất cả",
  "all",
  "tất cả thông số",
  "tất cả cảm biến",
  "tat ca thong so",
];
const NORMALIZED_GREETING_KEYWORDS = GREETING_KEYWORDS.map((keyword) =>
  normalizeText(keyword)
);
const NORMALIZED_HELP_KEYWORDS = HELP_KEYWORDS.map((keyword) =>
  normalizeText(keyword)
);
const NORMALIZED_ALL_SENSOR_KEYWORDS = ALL_SENSOR_KEYWORDS.map((keyword) =>
  normalizeText(keyword)
);

const HELP_MESSAGE = `Tôi có thể giúp bạn kiểm tra các thông số sau:
🌡️ Nhiệt độ
💧 Độ ẩm
🌱 Độ ẩm đất
🌧️ Lượng mưa
💦 Mực nước
💡 Trạng thái LED
🔧 Trạng thái máy bơm

Bạn có thể hỏi: "Nhiệt độ hiện tại là bao nhiêu?" hoặc "Cho tôi biết tất cả thông số"`;

function formatAllSensors(sensorData) {
  if (!sensorData) {
    return "Xin lỗi, tôi chưa thể lấy dữ liệu cảm biến. Vui lòng thử lại sau.";
  }

  let response = "📊 **Tất cả thông số cảm biến hiện tại:**\n\n";
  response += `🌡️ Nhiệt độ: ${sensorData.temperature?.toFixed(1) || "N/A"}°C\n`;
  response += `💧 Độ ẩm: ${sensorData.humidity?.toFixed(1) || "N/A"}%\n`;
  response += `🌱 Độ ẩm đất: ${
    sensorData.soilMoisture?.toFixed(1) || "N/A"
  }%\n`;
  response += `🌧️ Lượng mưa: ${sensorData.rainfall?.toFixed(1) || "N/A"}mm\n`;
  response += `💦 Mực nước: ${sensorData.waterLevel?.toFixed(1) || "N/A"}cm\n`;
  response += `💡 LED: ${sensorData.ledState ? "BẬT" : "TẮT"}\n`;
  response += `🔧 Máy bơm: ${sensorData.pumpState ? "BẬT" : "TẮT"}\n`;

  if (sensorData.dateTime) {
    response += `\n⏰ Cập nhật lúc: ${sensorData.dateTime}`;
  }

  return response;
}

function formatSingleSensor(sensor, value, sensorData) {
  if (value === undefined || value === null) {
    return `Xin lỗi, tôi không tìm thấy dữ liệu cho ${sensor.label}.`;
  }

  let response = "";
  if (sensor.key === "ledState" || sensor.key === "pumpState") {
    response = `${sensor.label} hiện tại đang: **${value ? "BẬT" : "TẮT"}**`;
  } else {
    response = `${sensor.label} hiện tại là: **${value.toFixed(1)}${
      sensor.unit
    }**`;

    if (sensor.key === "temperature") {
      if (value < 20) response += " (Thấp)";
      else if (value <= 30) response += " (Bình thường)";
      else response += " (Cao)";
    } else if (sensor.key === "humidity") {
      if (value < 40) response += " (Thấp)";
      else if (value <= 70) response += " (Bình thường)";
      else response += " (Cao)";
    } else if (sensor.key === "soilMoisture") {
      if (value < 30) response += " (Thấp - Cần tưới nước)";
      else if (value <= 60) response += " (Bình thường)";
      else response += " (Cao)";
    }
  }

  if (sensorData?.dateTime) {
    response += `\n⏰ Cập nhật lúc: ${sensorData.dateTime}`;
  }

  return response;
}

function includesKeyword(normalizedQuestion, normalizedKeywords) {
  const paddedQuestion = ` ${normalizedQuestion} `;

  return normalizedKeywords.some((keyword) =>
    paddedQuestion.includes(` ${keyword} `)
  );
}

function includesGreeting(normalizedQuestion) {
  return includesKeyword(normalizedQuestion, NORMALIZED_GREETING_KEYWORDS);
}

function includesHelp(normalizedQuestion) {
  return includesKeyword(normalizedQuestion, NORMALIZED_HELP_KEYWORDS);
}

function asksAllSensors(normalizedQuestion) {
  return includesKeyword(normalizedQuestion, NORMALIZED_ALL_SENSOR_KEYWORDS);
}

function extractSensorsFromQuestion(normalizedQuestion) {
  let remainingQuestion = normalizedQuestion;
  const matches = [];
  const seen = new Set();

  for (const { normalizedKeyword, sensor } of sensorKeywordEntries) {
    if (
      normalizedKeyword &&
      remainingQuestion.includes(normalizedKeyword) &&
      !seen.has(sensor.key)
    ) {
      matches.push(sensor);
      seen.add(sensor.key);
      remainingQuestion = remainingQuestion
        .replace(normalizedKeyword, " ")
        .replace(/\s+/g, " ")
        .trim();
    }
  }

  return matches;
}

function buildChatbotResponse(question, sensorData) {
  const normalized = normalizeText(question);

  if (asksAllSensors(normalized)) {
    return formatAllSensors(sensorData);
  }

  const matchedSensors = extractSensorsFromQuestion(normalized);

  if (matchedSensors.length > 0) {
    if (!sensorData) {
      return "Xin lỗi, tôi chưa thể lấy dữ liệu cảm biến. Vui lòng thử lại sau.";
    }

    if (matchedSensors.length === 1) {
      const sensor = matchedSensors[0];
      const value = sensorData[sensor.key];
      return formatSingleSensor(sensor, value, sensorData);
    }

    const responses = matchedSensors.map((sensor) => {
      const value = sensorData[sensor.key];
      return `• ${formatSingleSensor(sensor, value, sensorData)}`;
    });

    return `📌 **Thông tin bạn yêu cầu:**\n\n${responses.join("\n\n")}`;
  }

  if (includesGreeting(normalized)) {
    return "Xin chào! Tôi có thể giúp gì cho bạn? Bạn có thể hỏi tôi về bất kỳ thông số cảm biến nào.";
  }

  if (includesHelp(normalized)) {
    return HELP_MESSAGE;
  }

  return 'Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Bạn có thể hỏi tôi về các thông số cảm biến như nhiệt độ, độ ẩm, độ ẩm đất, lượng mưa, mực nước, LED, hoặc máy bơm. Hoặc gõ "giúp" để xem hướng dẫn.';
}

export { buildChatbotResponse };
