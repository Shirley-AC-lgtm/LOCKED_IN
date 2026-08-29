using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;

public static class WordReader
{
    public static string LeerDocx(string ruta)
    {
        string texto = "";

        using (WordprocessingDocument doc =
               WordprocessingDocument.Open(ruta, false))
        {
            Body body =
                doc.MainDocumentPart.Document.Body;

            texto = body.InnerText;
        }

        return texto;
    }
}