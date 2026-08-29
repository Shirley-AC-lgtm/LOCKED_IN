using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace PlasmaIA
{
    public class PlasmaBrain
    {
        private readonly string apiKey =
            "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";

        public async Task<string> AnalizarDocumento(
            string documento)
        {
            Console.WriteLine(
    $"Caracteres recibidos: {documento.Length}");

            if (documento.Length > 4000)
            {
                Console.WriteLine(
                    "Documento grande detectado.");

                var bloques =
                    DividirDocumento(documento);

                Console.WriteLine(
                    $"Bloques creados: {bloques.Count}");
            }

            try
            {
                var client =
                    new HttpClient();

                var mensajes =
                    new List<object>()
                {
                    new
{
    role = "system",
    content =
@"Eres Plasma IA.

PLASMA significa:
Play Lever Autonomous System for Mission Assignment.

Analiza documentos educativos.

Tu respuesta debe ser SIEMPRE JSON válido.

Formato obligatorio:

{
  ""summary"": ""resumen aquí"",

  ""flashcards"": [
    {
      ""question"": ""pregunta"",
      ""answer"": ""respuesta""
    }
  ],

  ""questions"": [
    {
      ""question"": ""pregunta"",
      ""answer"": ""respuesta""
    }
  ]
}

Reglas:

- No uses markdown.
- No uses **.
- No uses títulos.
- No uses texto fuera del JSON.
- Resume las ideas importantes.
- Crea flashcards útiles para estudiar.
- Crea preguntas de examen.
- Ignora texto irrelevante."
},

                    new
                    {
                        role = "user",
                        content =
                        $"Analiza este documento:\n\n{documento}"
                    }
                };

                var body = new
                {
                    model = "llama-3.1-8b-instant",

                    messages = mensajes,

                    temperature = 0.3,

                    max_tokens = 1200
                };

                client.DefaultRequestHeaders.Clear();

                client.DefaultRequestHeaders.Add(
                    "Authorization",
                    $"Bearer {apiKey}");

                var response =
                    await client.PostAsync(
                        "https://api.groq.com/openai/v1/chat/completions",

                        new StringContent(
                            JsonConvert.SerializeObject(body),
                            Encoding.UTF8,
                            "application/json")
                    );

                var json =
                    await response.Content
                    .ReadAsStringAsync();

                dynamic data =
    JsonConvert.DeserializeObject(json);

                string contenido =
                    data.choices[0]
                    .message.content
                    .ToString();

                var resultado =
                    JsonConvert.DeserializeObject<PlasmaResponse>(
                        contenido);

                return JsonConvert.SerializeObject(
                    resultado,
                    Formatting.Indented);
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        private List<string> DividirDocumento(
            string documento,
            int tamañoMaximo = 4000)
        {
            List<string> bloques =
                new List<string>();

            for (
                int i = 0;
                i < documento.Length;
                i += tamañoMaximo)
            {
                bloques.Add(
                    documento.Substring(
                        i,
                        Math.Min(
                            tamañoMaximo,
                            documento.Length - i)));
            }

            return bloques;
        }

    }
}