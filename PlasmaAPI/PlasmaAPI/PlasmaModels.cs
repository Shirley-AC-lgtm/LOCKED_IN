using System.Collections.Generic;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace PlasmaIA
{
    public class Flashcard
    {
        public string question { get; set; }
        public string answer { get; set; }
    }

    public class Question
    {
        public string question { get; set; }
        public string answer { get; set; }
        public List<string> acceptedAnswers { get; set; }
    }

    public class PlasmaResponse
    {
        public string summary { get; set; }

        public List<Flashcard> flashcards { get; set; }

        public List<Question> questions { get; set; }
    }
}