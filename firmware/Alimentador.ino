
#include <WiFi.h>
#include <HTTPClient.h>
#include <ESP32Servo.h>
#include <ArduinoJson.h>
#include <WiFiManager.h>
#include <time.h>

Servo servo;

const String baseURL = "https://api-rest-comedouro-2poss.onrender.com/comedouro";
const int id_pet = 1;

unsigned long ultimaExecucao = 0;
const unsigned long intervaloCheck = 60000; // verifica a cada 1 min

// LIBERAR RAÇÃO (GRAMAS POR SEGUNDO)

void liberarRacao(int gramas, int gramasPorSegundo) {
  Serial.println("Liberando ração...");

  float tempo = ((float)gramas / (float)gramasPorSegundo) * 1000.0;

  Serial.print("Tempo de servo ativo (ms): ");
  Serial.println(tempo);

  servo.write(90);
  delay(tempo);
  servo.write(0);

  Serial.println("Ração liberada!");
}

// ZERAR FLAG RA_EXTRA NA API

void zerarRaExtra() {
  HTTPClient http;
  String url = baseURL + "/limpar_extra";
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  String body = "{\"id_pet\":" + String(id_pet) + "}";
  int httpCode = http.POST(body);

  Serial.print("Flag Ra_Extra zerada! HTTP: ");
  Serial.println(httpCode);

  if (httpCode > 0) {
    Serial.println(http.getString());
  }

  http.end();
}

// ATUALIZAR HORÁRIO DA ÚLTIMA REFEIÇÃO

void atualizarUltimaRefeicao() {
  HTTPClient http;
  String url = baseURL + "/update_horario";
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  String body = "{\"id_pet\":" + String(id_pet) + "}";
  int httpCode = http.POST(body);

  Serial.print("UPDATE última refeição - HTTP: ");
  Serial.println(httpCode);

  if (httpCode > 0) {
    Serial.println(http.getString());
  }

  http.end();
}

// SETUP

void setup() {
  Serial.begin(115200);
  delay(2000);
  Serial.println("Iniciando ESP32...");

  servo.attach(13);

  WiFiManager wm;
  wm.setConfigPortalBlocking(true);
  wm.setCaptivePortalEnable(true);
  wm.setAPClientCheck(false);
  wm.setWiFiAutoReconnect(true);

  bool conectado = wm.autoConnect("PetCare-Setup", "12345678");

  if (!conectado) {
    Serial.println("Falha ao conectar. Reiniciando...");
    delay(3000);
    ESP.restart();
  }

  Serial.println("WiFi conectado!");
  Serial.print("IP obtido: ");
  Serial.println(WiFi.localIP());

  // Sincronizar hora com NTP
  configTime(-3 * 3600, 0, "pool.ntp.org", "time.nist.gov");
  Serial.println("Aguardando NTP...");

  time_t agora = time(nullptr);
  while (agora < 100000) {
    Serial.println("Aguardando tempo NTP...");
    delay(1000);
    agora = time(nullptr);
  }

  Serial.println("Horário sincronizado!");
}

// LOOP

void loop() {
  if (millis() - ultimaExecucao > intervaloCheck) {
    ultimaExecucao = millis();

    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("WiFi desconectado!");
      return;
    }

    HTTPClient http;
    String url = baseURL + "/" + String(id_pet);
    http.begin(url);

    int httpCode = http.GET();

    if (httpCode == 200) {
      String payload = http.getString();
      Serial.print("HTTP Code: ");
      Serial.println(httpCode);
      Serial.println("Payload recebido:");
      Serial.println(payload);

      DynamicJsonDocument doc(800);
      deserializeJson(doc, payload);

      int intervalo = doc["intervalo_horas"];
      int gramas = doc["Gramagem"];
      int extra = doc["Ra_Extra"];
      int gramasPorSegundo = doc["gramas_por_segundo"];
      String ultima_ref = doc["ultima_refeicao"].as<String>();
      ultima_ref.replace("Z", "");

      // Converter string em struct tm
      struct tm ultimaRef;
      sscanf(
        ultima_ref.c_str(), "%d-%d-%dT%d:%d:%d",
        &ultimaRef.tm_year, &ultimaRef.tm_mon, &ultimaRef.tm_mday,
        &ultimaRef.tm_hour, &ultimaRef.tm_min, &ultimaRef.tm_sec
      );
      ultimaRef.tm_year -= 1900;
      ultimaRef.tm_mon -= 1;

      time_t ultimaRefTime = mktime(&ultimaRef);
      ultimaRefTime -= 3 * 3600; // UTC-3

      time_t agora = time(nullptr);
      double horas_passadas = difftime(agora, ultimaRefTime) / 3600.0;

      Serial.print("Horas passadas: ");
      Serial.println(horas_passadas);

      // Alimentação normal
      if (horas_passadas >= intervalo) {
        Serial.println("Hora de alimentar o pet!");
        liberarRacao(gramas, gramasPorSegundo);
        atualizarUltimaRefeicao();
      }

      // Porção extra
      if (extra == 1) {
        Serial.println("Porção extra detectada!");
        liberarRacao(gramas, gramasPorSegundo);
        zerarRaExtra();
        // NÃO atualizar o horário da última refeição
      }

    } else {
      Serial.print("Erro HTTP: ");
      Serial.println(httpCode);
    }

    http.end();
  }
}
