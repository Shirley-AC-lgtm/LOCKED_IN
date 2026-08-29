using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Mvc;
using PlasmaIA;
using System.Speech.Synthesis;

namespace PlasmaAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlasmaController : ControllerBase
    {
        [HttpGet]
        public string Test()
        {
            return "Plasma API funcionando";
        }

        [HttpPost("analizar")]
        public async Task<IActionResult> Analizar(
    [FromBody] PlasmaRequest request)
        {
            PlasmaBrain brain =
                new PlasmaBrain(
                    HttpContext.RequestServices
                        .GetRequiredService<IConfiguration>());

            string resultado =
                await brain.AnalizarDocumento(
                    request.Documento);

            return Ok(resultado);
        }

        [HttpPost("audio")]
        public IActionResult GenerarAudio(
            [FromBody] AudioRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Texto))
                {
                    return BadRequest(
                        "No se recibió texto para convertir en audio."
                    );
                }

                Console.WriteLine(
                    $"Generando audio: {request.Texto.Length} caracteres"
                );

                using SpeechSynthesizer synthesizer =
                    new SpeechSynthesizer();

                using MemoryStream stream =
                    new MemoryStream();

                synthesizer.SetOutputToWaveStream(stream);

                synthesizer.Rate = -1;
                synthesizer.Volume = 100;

                synthesizer.Speak(request.Texto);

                byte[] audio =
                    stream.ToArray();

                Console.WriteLine(
                    $"Audio generado: {audio.Length} bytes"
                );

                return File(
                    audio,
                    "audio/wav",
                    "LOCKED_IN_Summary_Audio.wav"
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine(
                    "ERROR AUDIO:"
                );

                Console.WriteLine(
                    ex.ToString()
                );

                return StatusCode(
                    500,
                    new
                    {
                        success = false,
                        message = "Error generando audio.",
                        error = ex.Message
                    }
                );
            }
        }
    }

    public class PlasmaRequest
    {
        public string Documento { get; set; }
    }

    public class AudioRequest
    {
        public string Texto { get; set; }
    }
}