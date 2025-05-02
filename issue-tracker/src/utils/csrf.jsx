// Function to get the CSRF token from cookies
export function getCsrfTokenFromCookies() {
    return getCookie("csrftoken");
  }
  
  // Helper function to get a cookie by name (for reuse in csrf.js)
  function getCookie(name) {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="));
    return cookieValue ? decodeURIComponent(cookieValue.split("=")[1]) : "";
  }
  