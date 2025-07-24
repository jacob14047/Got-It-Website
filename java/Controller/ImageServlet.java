package Controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

@WebServlet("/images/*")
public class ImageServlet extends HttpServlet {

    // 1. Definiamo dove si trovano le immagini
    private static final String UPLOAD_DIRECTORY = "C:\\Users\\nikol\\Desktop\\uploads";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 2. Otteniamo il nome del file richiesto dall'URL (es. /Bellezza/foto.jpg)
        String requestedFile = request.getPathInfo();

        // Se non è stato richiesto nessun file, non fare nulla
        if (requestedFile == null) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        // 3. Creiamo il percorso completo del file sul disco
        File file = new File(UPLOAD_DIRECTORY, requestedFile);

        // 4. Controlliamo se il file esiste davvero
        if (!file.exists()) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND); // Invia un errore 404 "Not Found"
            return;
        }

        // 5. Diciamo al browser che tipo di file stiamo inviando (FONDAMENTALE)
        String contentType = getServletContext().getMimeType(file.getName());
        response.setContentType(contentType);

        // 6. Copiamo il contenuto del file nella risposta da inviare al browser
        Files.copy(file.toPath(), response.getOutputStream());
    }
}