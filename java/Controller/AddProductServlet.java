package Controller;

import Model.Immagine.ImmagineBean;
import Model.Immagine.ImmagineDAO;
import Model.Prodotto.ProdottoBean;
import Model.Prodotto.ProdottoDAO;
import Model.Vendere.VendereBean;
import Model.Vendere.VendereDAO;


import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@WebServlet("/add-product")
@MultipartConfig(
        fileSizeThreshold = 1024 * 1024, // 1 MB
        maxFileSize = 1024 * 1024 * 10,      // 10 MB
        maxRequestSize = 1024 * 1024 * 50   // 50 MB
)
public class AddProductServlet extends HttpServlet {


    private static final String UPLOAD_DIRECTORY = "C:\\Users\\nikol\\Desktop\\uploads";;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // --- A. Parse and Validate Text Data ---
        String nomeProdotto, categoria, colore, descrizione, condizione;
        double prezzo, peso;
        int userId;

        try {
            nomeProdotto = request.getParameter("name-product");
            prezzo = Double.parseDouble(request.getParameter("prezzo"));
            categoria = request.getParameter("category");
            colore = request.getParameter("colore");
            descrizione = request.getParameter("descrizione");
            condizione = request.getParameter("condizione");
            peso = Double.parseDouble(request.getParameter("peso"));
            userId = Integer.parseInt(request.getParameter("user_id"));

            // Basic server-side validation
            if (nomeProdotto == null || nomeProdotto.trim().isEmpty() ||
                    categoria == null || categoria.trim().isEmpty() ||
                    descrizione == null || descrizione.trim().length() < 50 ||
                    condizione == null || condizione.trim().isEmpty())
            {
                response.sendRedirect("addproduct.jsp?error=missingFields");
                return;
            }
        } catch (NumberFormatException e) {
            e.printStackTrace();
            response.sendRedirect("addproduct.jsp?error=invalidNumber");
            return;
        }

        // --- B. Handle File Uploads ---


        List<String> savedFileNames = new ArrayList<>();
        try {

            String sanitizedCategory = categoria.replaceAll("[^a-zA-Z0-9]", ""); //Rimuove tutti i caratteri che non sono lettere/numeri
            File categoryUploadDir = new File(UPLOAD_DIRECTORY, sanitizedCategory); //Inserisce come sottodirectory

            // ✅ 2. Ensure the category-specific directory exists.
            if (!categoryUploadDir.exists()) {
                categoryUploadDir.mkdirs(); // mkdirs() creates parent directories if needed
            }
            // Filter to only get the parts that are file inputs from our form
            List<Part> fileParts = request.getParts().stream()
                    .filter(part -> "immagine".equals(part.getName()) && part.getSize() > 0)
                    .collect(Collectors.toList());

            for (Part filePart : fileParts) {
                String submittedFileName = filePart.getSubmittedFileName();
                String fileName = Paths.get(submittedFileName).getFileName().toString();
                String uniqueFileName = System.currentTimeMillis() + "_" + fileName;

                String absoluteFilePath = categoryUploadDir.getAbsolutePath() + File.separator + uniqueFileName;
                filePart.write(absoluteFilePath);

                // ✅ 4. Store the RELATIVE path for the database (e.g., "uploads/Bellezza/image.jpg")
                String relativePath = sanitizedCategory + "/" + uniqueFileName;
                savedFileNames.add(relativePath);

            }
        } catch (IOException e) {
            e.printStackTrace();
            response.sendRedirect("addproduct.jsp?error=uploadFailed");
            return;
        }

        if (savedFileNames.isEmpty()) {
            response.sendRedirect("addproduct.jsp?error=noImage");
            return;
        }

        // --- C. Save Data to Database within a Transaction ---
        try {
            // 1. Get connection from pool and start transaction

            ProdottoDAO prodottoDAO = new ProdottoDAO();
            ImmagineDAO immagineDAO = new ImmagineDAO();
            VendereDAO vendereDAO = new VendereDAO();

            // 2. Create and save the product
            ProdottoBean prodotto = new ProdottoBean();
            prodotto.setNome(nomeProdotto);
            prodotto.setPrezzo(prezzo);
            prodotto.setCategoria(categoria);
            prodotto.setColore(colore);
            prodotto.setDescrizione(descrizione);
            prodotto.setCondizioni(condizione);
            prodotto.setPeso(peso); // Use helper to parse "0-2kg"
            prodotto.setImg_path(savedFileNames.get(0)); // Main image

            // Assume doSave is modified to accept a Connection and returns the generated ID
            int generatedProductId = prodottoDAO.doSave(prodotto);

            if (generatedProductId <= 0) {
                throw new SQLException("Failed to save product, no ID obtained.");
            }

            // 3. Link the product to the seller
            VendereBean vendere = new VendereBean();
            vendere.setID_Utente(userId);
            vendere.setProdotto_Codice(generatedProductId);
            vendereDAO.doSave(vendere.getID_Utente(), generatedProductId);

            // 4. Save all image paths
            for (String fileName : savedFileNames) {
                ImmagineBean immagine = new ImmagineBean();
                immagine.setCodice(generatedProductId);
                immagine.setPath(fileName);
                immagineDAO.doSave(immagine);
            }

            // 5. If everything is successful, commit the transaction

            // --- D. Redirect on Success ---
            // IMPORTANT: Redirect to a public servlet (like your home page servlet), not a JSP in WEB-INF
            response.sendRedirect(request.getContextPath() + "/InitServlet?productAdded=true");

        } catch (SQLException e) {
            e.printStackTrace();

            response.sendRedirect("addproduct.jsp?error=dbError");

        }

    }


}