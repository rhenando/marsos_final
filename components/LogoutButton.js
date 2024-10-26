import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Remove the JWT and user information from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");

    // Redirect to the login page
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className='px-4 py-2 text-[#2c6449] rounded-md'
    >
      Logout
    </button>
  );
}
