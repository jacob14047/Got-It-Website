package Controller;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@WebFilter(filterName="AccessControlFilter",
        urlPatterns={"/common/*","/admin/*"})
public class AccessControlFilter extends HttpFilter {

    @Override
    public void doFilter(ServletRequest request,
                         ServletResponse response,
                         FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest  req = (HttpServletRequest)  request;
        HttpServletResponse res = (HttpServletResponse) response;
        String path = req.getServletPath();

        // 1) lascia passare chi sta già chiedendo il login
        if ("/login".equals(path) || "/login.jsp".equals(path)) {
            chain.doFilter(request,response);
            return;
        }

        // 2) prendi sessione esistente
        HttpSession session = req.getSession(false);
        if (session == null) {
            res.sendRedirect(req.getContextPath() + "/login.jsp");
            return;
        }

        // 3) recupera il flag isAdmin
        String role = (String) session.getAttribute("role");


        // 4) se sto richi­amando /admin/* ma non sono admin → login
        if (path.startsWith("/admin/") && !"admin".equals(role)) {
            res.sendRedirect(req.getContextPath() + "/login.jsp");
            return;
        }

        // 5) se tutto ok, prosegui
        chain.doFilter(request, response);
    }
}
