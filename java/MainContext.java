import Model.ConPool;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;



@WebListener
public class MainContext implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        var context = sce.getServletContext();

        DataSource ds = null;
        try {
            var initCtx = new InitialContext();
            var envCtx = (Context) initCtx.lookup("java:comp/env");

            ds = (DataSource) envCtx.lookup("jdbc/GotItDB");

        } catch (NamingException e) {
            System.out.println("Error: " + e.getMessage());
        }
        ConPool.setDatasource(ds);
        System.out.println("Datasource creation..." + ds);

    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {

    }
}
