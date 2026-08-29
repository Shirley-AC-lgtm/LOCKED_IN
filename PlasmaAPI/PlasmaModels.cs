using System;
using System.IO;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace PlasmaIA
{
    class Program
    {
        static async Task Main()
        {
            Console.Title = "PLASMA IA";

            Console.WriteLine(
                "=== PLASMA IA ===");

            Console.WriteLine(
                "\nPega el documento:");

            Console.WriteLine(
    "\nPega el documento completo.");

            Console.WriteLine(
                "Cuando termines escribe:");

            Console.WriteLine(
                "FIN_DOCUMENTO");

            string documento = "";

            string linea;

            while ((linea = Console.ReadLine()) != "FIN_DOCUMENTO")
            {
                documento += linea + "\n";
            }

            PlasmaBrain plasma =
                new PlasmaBrain();

            Console.WriteLine(
                "\nAnalizando...\n");

            string resultado =
     await plasma.AnalizarDocumento(
         documento);

            var datos =
                Newtonsoft.Json.JsonConvert
                .DeserializeObject<PlasmaResponse>(
                    resultado);

            File.WriteAllText(
    "resultado.json",
    resultado);

            Console.WriteLine(
    "\nGuardado en resultado.json");

            Console.WriteLine(
                "\n=== RESUMEN ===\n");

            Console.WriteLine(
                datos.summary);

            Console.WriteLine(
    "\n=== FLASHCARDS ===\n");

            foreach (var card in datos.flashcards)
            {
                Console.WriteLine(
                    $"P: {card.question}");

                Console.WriteLine(
                    $"R: {card.answer}");

                Console.WriteLine();
            }

            Console.WriteLine(
    "\n=== PREGUNTAS ===\n");

            foreach (var q in datos.questions)
            {
                Console.WriteLine(
                    $"Pregunta: {q.question}");

                Console.WriteLine(
                    $"Respuesta: {q.answer}");

                Console.WriteLine();
            }

            Console.ReadLine();
        }
    }
}