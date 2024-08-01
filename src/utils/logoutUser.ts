import Cookies from "js-cookie";

export const logoutUser = async () => {
  try {
    const response = await fetch("/api/logout", {
      method: "POST",
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to sign out:", errorData.error);
      throw new Error("Failed to sign out");
    }

    Cookies.remove("supabaseSession");
    alert("Logged out successfully");
  } catch (error) {
    console.error("Failed to sign out:", error);
    throw new Error("Failed to sign out");
  }
};
